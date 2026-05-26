'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float twinkle = sin(uTime * 1.8 + aPhase * 6.28318) * 0.35 + 0.65;
    vAlpha = twinkle;
    vColor = aColor;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * twinkle * (300.0 / -mvPosition.z);
  }
`

const fragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
    float core  = smoothstep(0.12, 0.0, dist) * 0.8;
    gl_FragColor = vec4(vColor + core, alpha);
  }
`

export default function StarField({ count = 4000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)

  const { positions, sizes, phases, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes     = new Float32Array(count)
    const phases    = new Float32Array(count)
    const colors    = new Float32Array(count * 3)

    // Data-tech color palette: white, cyan, blue-white, teal
    const starColors = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#e0f4ff'),
      new THREE.Color('#b0e0ff'),
      new THREE.Color('#80d4ff'),
      new THREE.Color('#40c8f8'),
      new THREE.Color('#00d4ff'),
      new THREE.Color('#60ffe4'),
    ]

    for (let i = 0; i < count; i++) {
      const phi   = Math.acos(2 * Math.random() - 1)
      const theta = 2 * Math.PI * Math.random()
      const r     = 70 + Math.random() * 80

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      sizes[i]  = Math.random() < 0.04 ? 2.5 + Math.random() * 2 : 0.6 + Math.random() * 1.2
      phases[i] = Math.random() * Math.PI * 2

      const c = starColors[Math.floor(Math.random() * starColors.length)]
      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    return { positions, sizes, phases, colors }
  }, [count])

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((_, delta) => {
    uniforms.uTime.value += delta * 0.4
    if (ref.current) ref.current.rotation.y += delta * 0.003
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize"    args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase"   args={[phases, 1]} />
        <bufferAttribute attach="attributes-aColor"   args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  )
}
