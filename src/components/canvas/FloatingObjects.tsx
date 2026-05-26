'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface FloatingObject {
  id: number
  position: THREE.Vector3
  velocity: THREE.Vector3
  target: THREE.Vector3
  rotationSpeed: THREE.Vector3
  scale: number
  color: string
}

// Subtle cyan wireframe geometric shapes only — no rockets, no donuts, no boxes
const TYPES = ['icosahedron', 'octahedron', 'tetrahedron', 'icosahedron', 'octahedron',
               'tetrahedron', 'icosahedron', 'octahedron', 'tetrahedron', 'icosahedron'] as const

const COLORS = ['#00d4ff', '#00ffcc', '#0ea5e9', '#22d3ee', '#38bdf8',
                '#00b4d8', '#48cae4', '#0096c7', '#00d4ff', '#00ffcc']

export default function FloatingObjects() {
  const { mouse } = useThree()
  const objectsRef = useRef<FloatingObject[]>([])
  const meshesRef  = useRef<(THREE.Mesh | null)[]>([])

  const objects: FloatingObject[] = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5 - 3,
      ),
      velocity: new THREE.Vector3(0, 0, 0),
      target: new THREE.Vector3(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4 - 3,
      ),
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.006,
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.004,
      ),
      scale: 0.15 + Math.random() * 0.28,
      color: COLORS[i % COLORS.length],
    }))
  }, [])

  objectsRef.current = objects

  useFrame(() => {
    const mouseVec = new THREE.Vector3(mouse.x * 6, mouse.y * 4, 0)

    objectsRef.current.forEach((obj, i) => {
      const mesh = meshesRef.current[i]
      if (!mesh) return

      const stiffness = 0.006   // very slow drift
      const damping   = 0.96    // high inertia = cinematic float

      obj.velocity.x += (obj.target.x - obj.position.x) * stiffness
      obj.velocity.y += (obj.target.y - obj.position.y) * stiffness + 0.0004
      obj.velocity.z += (obj.target.z - obj.position.z) * stiffness

      // Gentle mouse repulsion
      const dist = obj.position.distanceTo(mouseVec)
      if (dist < 4) {
        const repulsion = ((4 - dist) / 4) * 0.025
        const dir = obj.position.clone().sub(mouseVec).normalize()
        obj.velocity.addScaledVector(dir, repulsion)
      }

      obj.velocity.multiplyScalar(damping)
      obj.position.add(obj.velocity)

      if (Math.random() < 0.001) {
        obj.target.set(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 4 - 3,
        )
      }

      mesh.position.copy(obj.position)
      mesh.rotation.x += obj.rotationSpeed.x
      mesh.rotation.y += obj.rotationSpeed.y
      mesh.rotation.z += obj.rotationSpeed.z
    })
  })

  return (
    <group>
      {objects.map((obj, i) => (
        <mesh
          key={obj.id}
          ref={(el) => { meshesRef.current[i] = el }}
          position={obj.position.toArray()}
          scale={obj.scale}
        >
          {TYPES[i] === 'icosahedron'  && <icosahedronGeometry  args={[1, 0]} />}
          {TYPES[i] === 'octahedron'   && <octahedronGeometry   args={[1]} />}
          {TYPES[i] === 'tetrahedron'  && <tetrahedronGeometry  args={[1, 0]} />}
          <meshStandardMaterial
            color={obj.color}
            emissive={obj.color}
            emissiveIntensity={0.6}
            roughness={0.1}
            metalness={0.95}
            wireframe
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}
    </group>
  )
}
