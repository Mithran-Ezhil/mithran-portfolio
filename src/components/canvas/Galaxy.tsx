'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  attribute float aSize;
  attribute float aAngle;
  attribute float aRadius;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uRotation;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;

    // Spiral rotation based on radius (inner spins faster)
    float angle = aAngle + uRotation * (1.0 - aRadius / 30.0);
    vec3 pos = position;
    pos.x = cos(angle) * aRadius;
    pos.z = sin(angle) * aRadius;

    // Twinkle
    vAlpha = 0.5 + sin(uTime * 1.5 + aAngle * 10.0) * 0.25;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * (250.0 / -mvPosition.z);
  }
`

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.05, dist) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`

const ARMS = 5
const PARTICLES_PER_ARM = 1200
const TOTAL = ARMS * PARTICLES_PER_ARM + 800 // core

export default function Galaxy() {
  const ref = useRef<THREE.Points>(null)

  const { positions, sizes, angles, radii, colors } = useMemo(() => {
    const positions = new Float32Array(TOTAL * 3)
    const sizes     = new Float32Array(TOTAL)
    const angles    = new Float32Array(TOTAL)
    const radii     = new Float32Array(TOTAL)
    const colors    = new Float32Array(TOTAL * 3)

    const coreColor = new THREE.Color('#ffe8aa')
    const armColors = [
      new THREE.Color('#aac8ff'),
      new THREE.Color('#c8aaff'),
      new THREE.Color('#aaffdd'),
      new THREE.Color('#ffaacc'),
      new THREE.Color('#aaddff'),
    ]

    let idx = 0

    // Core glow cluster
    for (let i = 0; i < 800; i++) {
      const r = Math.pow(Math.random(), 2) * 4
      const theta = Math.random() * Math.PI * 2
      positions[idx * 3]     = Math.cos(theta) * r
      positions[idx * 3 + 1] = (Math.random() - 0.5) * 0.5
      positions[idx * 3 + 2] = Math.sin(theta) * r
      sizes[idx]   = 1.5 + Math.random() * 2
      angles[idx]  = theta
      radii[idx]   = r
      const t = Math.random()
      const c = coreColor.clone().lerp(armColors[0], t * 0.3)
      colors[idx * 3]     = c.r
      colors[idx * 3 + 1] = c.g
      colors[idx * 3 + 2] = c.b
      idx++
    }

    // Spiral arms
    for (let arm = 0; arm < ARMS; arm++) {
      const armAngleOffset = (arm / ARMS) * Math.PI * 2
      const armColor = armColors[arm]

      for (let i = 0; i < PARTICLES_PER_ARM; i++) {
        const progress = i / PARTICLES_PER_ARM
        const r = 2 + progress * 26
        const spinAngle = progress * Math.PI * 4 // 2 full turns
        const scatter = (1 - progress * 0.5) * (Math.random() - 0.5) * 3

        const angle = armAngleOffset + spinAngle + scatter * 0.3

        positions[idx * 3]     = 0 // will be set in shader via aAngle + aRadius
        positions[idx * 3 + 1] = (Math.random() - 0.5) * 0.4 * (1 - progress * 0.7)
        positions[idx * 3 + 2] = 0

        sizes[idx]  = progress < 0.1 ? 2 + Math.random() : 0.5 + Math.random() * 1.2
        angles[idx] = angle
        radii[idx]  = r + scatter

        const t = Math.random()
        const c = armColor.clone().lerp(new THREE.Color('#ffffff'), t * 0.3)
        colors[idx * 3]     = c.r
        colors[idx * 3 + 1] = c.g
        colors[idx * 3 + 2] = c.b
        idx++
      }
    }

    return { positions, sizes, angles, radii, colors }
  }, [])

  const uniforms = useMemo(() => ({
    uTime:     { value: 0 },
    uRotation: { value: 0 },
  }), [])

  useFrame((_, delta) => {
    uniforms.uTime.value     += delta
    uniforms.uRotation.value += delta * 0.04
  })

  return (
    <points ref={ref} position={[8, -15, -35]} rotation={[0.3, 0, 0.1]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize"    args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aAngle"   args={[angles, 1]} />
        <bufferAttribute attach="attributes-aRadius"  args={[radii, 1]} />
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
