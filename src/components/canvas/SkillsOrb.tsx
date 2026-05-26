'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

export default function SkillsOrb() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
  })

  return (
    <mesh ref={meshRef} position={[3, -10, 0]}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <MeshDistortMaterial
        color="#6366f1"
        emissive="#a78bfa"
        emissiveIntensity={0.4}
        roughness={0.1}
        metalness={0.9}
        distort={0.4}
        speed={2}
      />
    </mesh>
  )
}
