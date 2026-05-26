'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Streak {
  position: THREE.Vector3
  direction: THREE.Vector3
  speed: number
  life: number
  maxLife: number
  active: boolean
  meshRef: React.RefObject<THREE.Mesh>
}

function createStreak(): Streak {
  const angle = (Math.random() * 0.4 + 0.1) * Math.PI  // mostly left-to-right diagonal
  return {
    position: new THREE.Vector3(
      (Math.random() - 0.5) * 80,
      20 + Math.random() * 20,
      -10 - Math.random() * 20,
    ),
    direction: new THREE.Vector3(
      Math.cos(angle) * 1.5,
      -Math.sin(angle),
      0,
    ).normalize(),
    speed: 30 + Math.random() * 40,
    life: 0,
    maxLife: 0.6 + Math.random() * 0.5,
    active: false,
    meshRef: { current: null } as React.RefObject<THREE.Mesh>,
  }
}

const STREAK_COUNT = 6

export default function ShootingStars() {
  const streaks = useRef<Streak[]>(Array.from({ length: STREAK_COUNT }, createStreak))
  const meshesRef = useRef<(THREE.Mesh | null)[]>(Array(STREAK_COUNT).fill(null))
  const nextSpawn = useRef(2 + Math.random() * 3)
  const elapsed = useRef(0)

  const geometry = useMemo(() => {
    // Elongated teardrop shape for the streak
    const geo = new THREE.CylinderGeometry(0.02, 0.002, 1, 4)
    geo.rotateZ(Math.PI / 2)
    return geo
  }, [])

  useFrame((_, delta) => {
    elapsed.current += delta
    nextSpawn.current -= delta

    // Spawn a new shooting star
    if (nextSpawn.current <= 0) {
      const inactive = streaks.current.findIndex((s) => !s.active)
      if (inactive !== -1) {
        const s = streaks.current[inactive]
        // Reset
        s.position.set(
          (Math.random() - 0.5) * 80,
          15 + Math.random() * 20,
          -5 - Math.random() * 15,
        )
        const angle = (Math.random() * 0.5 + 0.1) * Math.PI
        s.direction.set(Math.cos(angle), -Math.sin(angle), 0).normalize()
        s.speed    = 30 + Math.random() * 50
        s.life     = 0
        s.maxLife  = 0.4 + Math.random() * 0.5
        s.active   = true
      }
      nextSpawn.current = 1.5 + Math.random() * 4
    }

    streaks.current.forEach((s, i) => {
      const mesh = meshesRef.current[i]
      if (!mesh) return

      if (!s.active) {
        mesh.visible = false
        return
      }

      s.life += delta
      const t = s.life / s.maxLife
      if (t >= 1) {
        s.active = false
        mesh.visible = false
        return
      }

      // Move
      s.position.addScaledVector(s.direction, s.speed * delta)
      mesh.position.copy(s.position)

      // Rotate to face direction
      mesh.lookAt(s.position.clone().add(s.direction))
      mesh.rotateY(Math.PI / 2)

      // Fade in and out
      const alpha = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85
      const scale = (s.speed / 40) * (0.8 + alpha * 0.5)
      mesh.scale.set(scale * 3, scale, scale)
      mesh.visible = true

      const mat = mesh.material as THREE.MeshBasicMaterial
      mat.opacity = alpha * 0.95
    })
  })

  return (
    <group>
      {Array.from({ length: STREAK_COUNT }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => { meshesRef.current[i] = el }}
          geometry={geometry}
          visible={false}
        >
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
