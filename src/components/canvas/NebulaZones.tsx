'use client'

import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const ZONES = [
  { y:   0, col: [0.00, 0.83, 1.00] as const },
  { y: -10, col: [0.55, 0.20, 0.90] as const },
  { y: -20, col: [0.00, 0.70, 0.65] as const },
  { y: -30, col: [0.90, 0.45, 0.05] as const },
  { y: -40, col: [0.20, 0.15, 0.60] as const },
]

// ── Zone billboard vertex shader ──────────────────────────────────────────────
const zoneVert = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// ── Zone billboard fragment shader ───────────────────────────────────────────
const zoneFrag = `
  uniform vec3  uColor;
  uniform float uAlpha;
  varying vec2  vUv;

  void main() {
    float d    = length(vUv - 0.5);
    float fade = smoothstep(0.5, 0.05, d) * uAlpha;
    gl_FragColor = vec4(uColor, fade);
  }
`

export default function NebulaZones() {
  const { camera } = useThree()

  const zoneUnis = useMemo(() =>
    ZONES.map(z => ({
      uColor: { value: new THREE.Vector3(...z.col) },
      uAlpha: { value: 0 },
    })), [])

  useFrame(() => {
    const camY = camera.position.y
    ZONES.forEach((zone, i) => {
      const dist  = Math.abs(camY - zone.y)
      const alpha = Math.max(0, (1.0 - dist / 9.0)) * 0.08
      zoneUnis[i].uAlpha.value = alpha
    })
  })

  return (
    <group>
      {ZONES.map((zone, i) => (
        <mesh key={i} position={[0, zone.y, -5]}>
          <planeGeometry args={[40, 30]} />
          <shaderMaterial
            vertexShader={zoneVert}
            fragmentShader={zoneFrag}
            uniforms={zoneUnis[i]}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}
