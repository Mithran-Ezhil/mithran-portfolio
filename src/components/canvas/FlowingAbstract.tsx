'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ─────────────────────────────────────────────────────────────────────────────
   Flowing translucent sheets — 14 planes with multi-harmonic wave displacement
   Centered in the hero (camera at z=8, sheets at z=0 to z=-3)
   Additive blending → layers accumulate into a luminous soft mass
───────────────────────────────────────────────────────────────────────────── */

const SHEET_COUNT = 14
const W = 18, H = 8
const W_SEG = 120, H_SEG = 48

// ── Flowing sheet vertex shader ────────────────────────────────────────────
const sheetVert = `
  uniform float uTime;
  uniform float uPhase;
  varying vec2  vUv;
  varying float vWave;
  varying float vEdge;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float t  = uTime * 0.38 + uPhase;
    float px = pos.x * 0.28;
    float py = pos.y * 0.38;

    // Three overlaid wave layers — organic, not mechanical
    float w1 = sin(px       + t * 1.10) * cos(py * 1.2 + t * 0.75) * 1.80;
    float w2 = cos(px * 1.6 - t * 0.80) * sin(py * 0.9 + t * 0.90) * 1.10;
    float w3 = sin((px + py) * 0.9 + t * 1.30) * 0.55;
    float w4 = cos(px * 2.2 + py * 1.5 - t * 1.60) * 0.25;   // fine ripple

    float total = w1 + w2 + w3 + w4;
    pos.z += total;
    vWave = total * 0.14 + 0.5;  // normalise to ~0..1

    // Smooth radial + rectangular edge fade
    vec2 uvN = uv * 2.0 - 1.0;               // -1..1
    float ex = 1.0 - smoothstep(0.50, 1.00, abs(uvN.x));
    float ey = 1.0 - smoothstep(0.40, 1.00, abs(uvN.y));
    float radial = 1.0 - smoothstep(0.45, 0.95, length(uvN * vec2(0.7, 1.0)));
    vEdge = ex * ey * (0.6 + radial * 0.4);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

// ── Flowing sheet fragment shader ──────────────────────────────────────────
const sheetFrag = `
  uniform float uTime;
  uniform float uPhase;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  varying vec2  vUv;
  varying float vWave;
  varying float vEdge;

  void main() {
    // Colour blends between two per-sheet hues along wave height
    vec3 col = mix(uColorA, uColorB, clamp(vWave, 0.0, 1.0));

    // Iridescent shimmer — thin-film interference approximation
    float irid = sin(vUv.x * 12.0 + uTime * 2.0 + uPhase) * 0.03
               + sin(vUv.y *  9.0 - uTime * 1.5 + uPhase * 0.7) * 0.025;
    col = clamp(col + irid, 0.0, 1.0);

    // Very soft highlight near crest
    float crest = smoothstep(0.62, 0.85, vWave) * 0.08;
    col += crest;

    float alpha = vEdge * (0.065 + vWave * 0.045);
    alpha = clamp(alpha, 0.0, 0.16);

    gl_FragColor = vec4(col, alpha);
  }
`

// ── Central luminous orb ──────────────────────────────────────────────────
const orbVert = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const orbFrag = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv - 0.5;
    float d  = length(uv);

    // Layered glow rings
    float pulse  = 0.92 + sin(uTime * 1.8) * 0.08;
    float inner  = smoothstep(0.50, 0.00, d) * 0.55 * pulse;
    float mid    = smoothstep(0.50, 0.15, d) * 0.22;
    float outer  = smoothstep(0.50, 0.30, d) * 0.10;

    vec3 coreCol  = vec3(0.88, 0.97, 1.00);
    vec3 midCol   = vec3(0.60, 0.86, 1.00);
    vec3 outerCol = vec3(0.45, 0.70, 1.00);

    vec3 col = coreCol * inner + midCol * mid + outerCol * outer;
    float alpha  = inner + mid * 0.6 + outer * 0.3;

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`

// ── Wisp particle shader — tiny glowing dots swirling around the mass ─────
const wispVert = `
  attribute float aPhase;
  attribute float aRadius;
  attribute float aSpeed;
  uniform float uTime;
  varying float vAlpha;

  void main() {
    float t = uTime * aSpeed + aPhase;

    // Orbit in a bent ellipse
    float x = position.x + cos(t * 0.7) * aRadius;
    float y = position.y + sin(t * 0.5) * aRadius * 0.6;
    float z = position.z + sin(t * 1.1) * aRadius * 0.4;

    float pulse = sin(t * 2.5 + aPhase) * 0.35 + 0.65;
    vAlpha = pulse * (0.5 + aRadius * 0.15);

    vec4 mv = modelViewMatrix * vec4(x, y, z, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (2.5 + aRadius * 0.6) * (120.0 / -mv.z);
  }
`
const wispFrag = `
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float a = smoothstep(0.5, 0.0, d) * vAlpha * 0.7;
    vec3 col = mix(vec3(0.60, 0.88, 1.0), vec3(1.0, 1.0, 1.0), smoothstep(0.1, 0.0, d));
    gl_FragColor = vec4(col, a);
  }
`

// ── Colour palette for the sheets ─────────────────────────────────────────
const PALETTE: [THREE.Color, THREE.Color][] = [
  [new THREE.Color(0.85, 0.95, 1.00), new THREE.Color(1.00, 1.00, 1.00)], // white-ice
  [new THREE.Color(0.65, 0.88, 1.00), new THREE.Color(0.90, 0.97, 1.00)], // ice-blue
  [new THREE.Color(0.78, 0.70, 1.00), new THREE.Color(0.95, 0.92, 1.00)], // pale violet
  [new THREE.Color(0.55, 0.95, 0.88), new THREE.Color(0.82, 0.98, 1.00)], // teal-mint
  [new THREE.Color(0.90, 0.80, 1.00), new THREE.Color(0.98, 0.96, 1.00)], // lavender
]

export default function FlowingAbstract() {
  const groupRef   = useRef<THREE.Group>(null)
  const sheetMats  = useRef<THREE.ShaderMaterial[]>([])
  const orbUni     = useMemo(() => ({ uTime: { value: 0 } }), [])
  const wispUni    = useMemo(() => ({ uTime: { value: 0 } }), [])
  const tRef       = useRef(0)

  // ── Shared high-res geometry for all sheets ──────────────────────────────
  const sheetGeo = useMemo(() =>
    new THREE.PlaneGeometry(W, H, W_SEG, H_SEG), [])

  // ── Per-sheet data ────────────────────────────────────────────────────────
  const sheets = useMemo(() =>
    Array.from({ length: SHEET_COUNT }, (_, i) => {
      const phase = (i / SHEET_COUNT) * Math.PI * 2
      const [colA, colB] = PALETTE[i % PALETTE.length]
      const rotY = (i / SHEET_COUNT) * Math.PI * 1.5   // fan across 270°
      const rotZ = Math.sin(phase * 0.8) * 0.22
      const scaleY = 0.88 + (i % 4) * 0.08

      const mat = new THREE.ShaderMaterial({
        vertexShader:   sheetVert,
        fragmentShader: sheetFrag,
        uniforms: {
          uTime:   { value: 0 },
          uPhase:  { value: phase },
          uColorA: { value: colA },
          uColorB: { value: colB },
        },
        transparent: true,
        side:       THREE.DoubleSide,
        depthWrite: false,
        blending:   THREE.AdditiveBlending,
      })

      return { mat, rotY, rotZ, scaleY }
    }), [])

  // ── Wisp particle cloud ────────────────────────────────────────────────
  const { wispGeo } = useMemo(() => {
    const N = 320
    const pos     = new Float32Array(N * 3)
    const phases  = new Float32Array(N)
    const radii   = new Float32Array(N)
    const speeds  = new Float32Array(N)

    for (let i = 0; i < N; i++) {
      // Spawn on a tilted torus around the mass
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.random() * Math.PI * 2
      const r     = 3.5 + Math.random() * 3.5   // torus major radius

      pos[i * 3]     = r * Math.cos(theta)
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5
      pos[i * 3 + 2] = r * Math.sin(theta)

      phases[i] = phi
      radii[i]  = 0.4 + Math.random() * 1.8
      speeds[i] = 0.25 + Math.random() * 0.55
    }

    const wispGeo = new THREE.BufferGeometry()
    wispGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    wispGeo.setAttribute('aPhase',   new THREE.BufferAttribute(phases, 1))
    wispGeo.setAttribute('aRadius',  new THREE.BufferAttribute(radii, 1))
    wispGeo.setAttribute('aSpeed',   new THREE.BufferAttribute(speeds, 1))

    return { wispGeo }
  }, [])

  // ── Animation loop ─────────────────────────────────────────────────────
  useFrame((_, delta) => {
    tRef.current += delta

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.045   // gentle global spin
      groupRef.current.rotation.x  = Math.sin(tRef.current * 0.12) * 0.06
    }

    const t = tRef.current
    orbUni.uTime.value   = t
    wispUni.uTime.value  = t
    sheetMats.current.forEach(m => {
      if (m) m.uniforms.uTime.value = t
    })
  })

  return (
    <group
      ref={groupRef}
      position={[0, 0, -1.5]}   /* centred in the hero camera view */
    >
      {/* ── Flowing translucent sheets ── */}
      {sheets.map((s, i) => (
        <mesh
          key={i}
          geometry={sheetGeo}
          material={s.mat}
          scale={[1, s.scaleY, 1]}
          rotation={[0, s.rotY, s.rotZ]}
          ref={m => { if (m) sheetMats.current[i] = s.mat }}
        />
      ))}

      {/* ── Central luminous orb ── */}
      <mesh>
        <planeGeometry args={[5.5, 5.5]} />
        <shaderMaterial
          vertexShader={orbVert}
          fragmentShader={orbFrag}
          uniforms={orbUni}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── Wisp particles ── */}
      <points>
        <primitive object={wispGeo} />
        <shaderMaterial
          vertexShader={wispVert}
          fragmentShader={wispFrag}
          uniforms={wispUni}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
