'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollStore } from '@/store/scrollStore'

const vertexShader = `
  attribute float aRandom;
  attribute float aSize;
  uniform float uTime;
  uniform float uScrollY;

  void main() {
    vec3 pos = position;
    pos.y += sin(uTime * 0.4 + aRandom * 6.28318) * 0.4;
    pos.x += cos(uTime * 0.3 + aRandom * 3.14159) * 0.3;
    pos.z += sin(uTime * 0.2 + aRandom * 9.42478) * 0.2;
    pos.y -= uScrollY * 15.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * (200.0 / -mvPosition.z);
  }
`

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, dist) * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`

interface ParticleFieldProps {
  count?: number
}

export default function ParticleField({ count = 3000 }: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null)

  const { positions, randoms, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const randoms = new Float32Array(count)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      randoms[i] = Math.random()
      sizes[i] = Math.random() * 2 + 0.5
    }
    return { positions, randoms, sizes }
  }, [count])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScrollY: { value: 0 },
    uColor: { value: new THREE.Color('#a78bfa') },
    uOpacity: { value: 0.6 },
  }), [])

  useFrame((_, delta) => {
    uniforms.uTime.value += delta
    uniforms.uScrollY.value = useScrollStore.getState().scrollY
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
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
