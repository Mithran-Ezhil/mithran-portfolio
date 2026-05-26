'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  uniform float uDrift;

  void main() {
    vec3 pos = position;
    pos.x += sin(uTime * uDrift       + aPhase * 3.14159) * 1.2;
    pos.y += cos(uTime * uDrift * 0.7 + aPhase * 1.5708)  * 0.6;
    pos.z += sin(uTime * uDrift * 0.5 + aPhase * 6.28318) * 0.5;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position  = projectionMatrix * mvPos;
    gl_PointSize = aSize * (500.0 / -mvPos.z);
  }
`

const fragmentShader = `
  uniform vec3  uColor;
  uniform float uOpacity;

  void main() {
    vec2  uv   = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;

    // Gaussian soft disk — looks volumetric with additive blending
    float alpha = exp(-dist * dist * 10.0) * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`

interface CloudConfig {
  position: [number, number, number]
  color:    string
  opacity:  number
  count:    number
  spread:   [number, number, number]
  drift:    number
}

const CLOUDS: CloudConfig[] = [
  // Hero — deep navy teal
  { position: [-8,  3, -20], color: '#002040', opacity: 0.10, count: 500, spread: [14, 8, 8], drift: 0.025 },
  { position: [ 8, -2, -18], color: '#001830', opacity: 0.08, count: 400, spread: [10, 6, 6], drift: 0.018 },
  // About — cyan teal nebula
  { position: [-6, -10, -18], color: '#003850', opacity: 0.11, count: 550, spread: [16, 8, 8], drift: 0.022 },
  { position: [ 5, -13, -16], color: '#004466', opacity: 0.09, count: 400, spread: [12, 7, 6], drift: 0.030 },
  // Experience — electric blue
  { position: [ 6, -20, -20], color: '#002855', opacity: 0.10, count: 480, spread: [14, 7, 7], drift: 0.020 },
  { position: [-5, -22, -16], color: '#013366', opacity: 0.08, count: 380, spread: [10, 6, 5], drift: 0.028 },
  // Projects — cyan hologram
  { position: [ 0, -30, -22], color: '#003d60', opacity: 0.12, count: 520, spread: [18, 8, 8], drift: 0.018 },
  { position: [-8, -28, -16], color: '#004d70', opacity: 0.09, count: 400, spread: [12, 6, 6], drift: 0.025 },
  // Contact — midnight teal
  { position: [ 4, -40, -18], color: '#001c2e', opacity: 0.09, count: 420, spread: [14, 7, 7], drift: 0.020 },
  { position: [-4, -42, -15], color: '#002236', opacity: 0.07, count: 350, spread: [10, 6, 5], drift: 0.022 },
]

function CloudInstance({ config }: { config: CloudConfig }) {
  const ref = useRef<THREE.Points>(null)

  const { positions, sizes, phases } = useMemo(() => {
    const [sx, sy, sz] = config.spread
    const positions = new Float32Array(config.count * 3)
    const sizes     = new Float32Array(config.count)
    const phases    = new Float32Array(config.count)

    for (let i = 0; i < config.count; i++) {
      // Ellipsoidal distribution with gaussian falloff
      const r   = Math.pow(Math.random(), 0.5)
      const phi = Math.acos(2 * Math.random() - 1)
      const th  = Math.random() * Math.PI * 2
      positions[i * 3]     = Math.sin(phi) * Math.cos(th) * r * sx
      positions[i * 3 + 1] = Math.cos(phi) * r * sy
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(th) * r * sz
      sizes[i]  = 2.5 + Math.random() * 6.0
      phases[i] = Math.random() * Math.PI * 2
    }
    return { positions, sizes, phases }
  }, [config])

  const uniforms = useMemo(() => ({
    uTime:    { value: Math.random() * 100 },
    uDrift:   { value: config.drift },
    uColor:   { value: new THREE.Color(config.color) },
    uOpacity: { value: config.opacity },
  }), [config])

  useFrame((_, delta) => {
    uniforms.uTime.value += delta
  })

  return (
    <points ref={ref} position={config.position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize"    args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase"   args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function NebulaClouds() {
  return (
    <group>
      {CLOUDS.map((cfg, i) => (
        <CloudInstance key={i} config={cfg} />
      ))}
    </group>
  )
}
