'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 9000
const NUM_ARMS = 3
const MAX_R = 7.0
const BASE = 0.28
const B = 0.22

// ── Star particle vertex shader ──────────────────────────────────────────────
const starVert = `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3  aColor;
  uniform float   uTime;
  varying float   vA;
  varying vec3    vC;

  void main() {
    vC = aColor;
    float p = sin(uTime * 0.6 + aPhase) * 0.12 + 0.88;
    vA = p;

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position  = projectionMatrix * mv;
    gl_PointSize = aSize * p * (180.0 / -mv.z);
  }
`

// ── Star particle fragment shader ─────────────────────────────────────────────
const starFrag = `
  varying float vA;
  varying vec3  vC;

  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float d  = length(uv);
    if (d > 0.5) discard;

    float a = smoothstep(0.5, 0.0, d) * vA * 0.9;
    gl_FragColor = vec4(vC, a);
  }
`

// ── Galactic core glow shaders ────────────────────────────────────────────────
const coreVert = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const coreFrag = `
  uniform float uTime;
  varying vec2  vUv;

  void main() {
    vec2  uv    = vUv - 0.5;
    float d     = length(uv);
    float pulse = 0.93 + sin(uTime * 0.7) * 0.07;

    float inner = smoothstep(0.45, 0.0,  d) * 0.65 * pulse;
    float mid   = smoothstep(0.45, 0.18, d) * 0.22;
    float outer = smoothstep(0.45, 0.30, d) * 0.09;

    vec3 innerCol = vec3(1.00, 0.97, 0.85);
    vec3 midCol   = vec3(0.85, 0.65, 0.30);
    vec3 outerCol = vec3(0.55, 0.40, 0.85);

    vec3  col   = innerCol * inner + midCol * mid + outerCol * outer;
    float alpha = inner + mid * 0.6 + outer * 0.3;

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`

// ── Dust lane shaders ─────────────────────────────────────────────────────────
const dustVert = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const dustFrag = `
  uniform vec3  uColor;
  uniform float uTime;
  varying vec2  vUv;

  void main() {
    vec2  uv   = vUv - 0.5;
    float d    = length(uv * vec2(1.6, 0.5));
    float fade = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(uColor, fade * 0.05);
  }
`

const DUST_CONFIGS: { rot: [number, number, number]; col: [number, number, number] }[] = [
  { rot: [0, 0,  0.3],  col: [0.4,  0.7,  1.0] },
  { rot: [0, 0, -0.5],  col: [0.55, 0.35, 0.9] },
  { rot: [0, 0,  1.0],  col: [0.2,  0.8,  0.7] },
]

export default function GalaxyScene() {
  const groupRef = useRef<THREE.Group>(null)
  const coreUni  = useMemo(() => ({ uTime: { value: 0 } }), [])

  // ── Build star geometry ───────────────────────────────────────────────────
  const starGeo = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const colors    = new Float32Array(PARTICLE_COUNT * 3)
    const sizes     = new Float32Array(PARTICLE_COUNT)
    const phases    = new Float32Array(PARTICLE_COUNT)

    let idx = 0

    for (let arm = 0; arm < NUM_ARMS; arm++) {
      const armOffset = (arm / NUM_ARMS) * Math.PI * 2
      const perArm    = PARTICLE_COUNT / NUM_ARMS

      for (let j = 0; j < perArm; j++) {
        const r      = Math.pow(Math.random(), 0.6) * MAX_R
        const theta  = Math.log(r / BASE) / B + armOffset
        const scatter = (Math.random() - 0.5) * (0.2 + r * 0.08)

        const x = Math.cos(theta + scatter) * r + (Math.random() - 0.5) * 0.12
        const z = Math.sin(theta + scatter) * r + (Math.random() - 0.5) * 0.12
        const y = (Math.random() - 0.5) * 0.18 * (r * 0.25 + 0.3)

        positions[idx * 3]     = x
        positions[idx * 3 + 1] = y
        positions[idx * 3 + 2] = z

        const t = r / MAX_R

        let cr: number, cg: number, cb: number
        if (t < 0.15) {
          cr = 1.0; cg = 0.95; cb = 0.75
        } else if (t < 0.4) {
          const mt = (t - 0.15) / 0.25
          cr = 0.80 - mt * 0.25; cg = 0.88; cb = 1.0
        } else {
          const ot = (t - 0.4) / 0.6
          cr = 0.50 + ot * 0.05; cg = 0.40 + ot * 0.10; cb = 0.90
        }

        colors[idx * 3]     = cr
        colors[idx * 3 + 1] = cg
        colors[idx * 3 + 2] = cb

        let size: number
        if (r < 0.8) {
          size = 1.8 + Math.random() * 2.0
        } else if (Math.random() < 0.015) {
          size = 1.4 + Math.random() * 1.0
        } else {
          size = 0.18 + Math.random() * 0.38
        }

        sizes[idx]  = size
        phases[idx] = Math.random() * Math.PI * 2

        idx++
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aColor',   new THREE.BufferAttribute(colors,    3))
    geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes,     1))
    geo.setAttribute('aPhase',   new THREE.BufferAttribute(phases,    1))
    return geo
  }, [])

  // ── Per-dust uniforms ─────────────────────────────────────────────────────
  const dustUniforms = useMemo(() =>
    DUST_CONFIGS.map(cfg => ({
      uColor: { value: new THREE.Vector3(...cfg.col) },
      uTime:  { value: 0 },
    })), [])

  // ── Star material uniforms ────────────────────────────────────────────────
  const starUni = useMemo(() => ({ uTime: { value: 0 } }), [])

  // ── Animation ────────────────────────────────────────────────────────────
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.010
    }
    const t = (starUni.uTime.value += delta)
    coreUni.uTime.value = t
    dustUniforms.forEach(u => { u.uTime.value = t })
  })

  return (
    <group
      ref={groupRef}
      position={[0, 0, -1.5]}
      rotation={[0.30, 0, 0]}
    >
      {/* ── Star particles ── */}
      <points>
        <primitive object={starGeo} />
        <shaderMaterial
          vertexShader={starVert}
          fragmentShader={starFrag}
          uniforms={starUni}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ── Galactic core glow ── */}
      <mesh>
        <planeGeometry args={[4, 4]} />
        <shaderMaterial
          vertexShader={coreVert}
          fragmentShader={coreFrag}
          uniforms={coreUni}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── Dust lane planes ── */}
      {DUST_CONFIGS.map((cfg, i) => (
        <mesh key={i} rotation={cfg.rot}>
          <planeGeometry args={[9, 3.5]} />
          <shaderMaterial
            vertexShader={dustVert}
            fragmentShader={dustFrag}
            uniforms={dustUniforms[i]}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}
