'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ProjectCard3DProps {
  position: [number, number, number]
  color: string
  index: number
}

export default function ProjectCard3D({ position, color, index }: ProjectCard3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const targetRotX = useRef(0)
  const targetRotY = useRef(0)
  const targetY = useRef(position[1])

  useFrame((state) => {
    if (!meshRef.current) return

    if (hovered) {
      targetRotX.current = state.mouse.y * -0.3
      targetRotY.current = state.mouse.x * 0.3
      targetY.current = position[1] + 0.3
    } else {
      targetRotX.current = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.05
      targetRotY.current = Math.cos(state.clock.elapsedTime * 0.3 + index) * 0.05
      targetY.current = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + index * 1.5) * 0.1
    }

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX.current, 0.1)
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY.current, 0.1)
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY.current, 0.08)
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <boxGeometry args={[2.5, 1.5, 0.05]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 0.5 : 0.15}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  )
}
