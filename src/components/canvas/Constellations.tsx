'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Orion constellation star positions (normalized)
const ORION_STARS = [
  [0, 4],    // Betelgeuse
  [2, 4],    // Bellatrix
  [-1, 3],   // Meissa
  [1, 3],    // shoulder
  [0, 2],    // Belt star 1 (Mintaka)
  [0.5, 2],  // Belt star 2 (Alnilam)
  [1, 2],    // Belt star 3 (Alnitak)
  [0, 1],    // Saiph
  [2, 1],    // Rigel
  [0.5, 0],  // foot
]

const ORION_LINES = [
  [0, 1], [0, 2], [1, 3], [2, 4], [3, 5],
  [4, 5], [5, 6], [6, 8], [4, 7], [7, 9],
]

// Big Dipper
const DIPPER_STARS = [
  [0, 0], [1, 0.3], [2, 0.4], [3, 0],
  [3.5, 1], [3, 2], [2.5, 3],
]
const DIPPER_LINES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
]

// Cassiopeia
const CASS_STARS = [
  [0, 0], [1, 1.5], [2, 0.5], [3, 1.5], [4, 0],
]
const CASS_LINES = [
  [0, 1], [1, 2], [2, 3], [3, 4],
]

interface ConstellationDef {
  stars: number[][]
  lines: number[][]
  position: [number, number, number]
  scale: number
}

const CONSTELLATIONS: ConstellationDef[] = [
  { stars: ORION_STARS,  lines: ORION_LINES,  position: [-30, 5, -40],  scale: 2.5 },
  { stars: DIPPER_STARS, lines: DIPPER_LINES, position: [25, 15, -45],  scale: 2.0 },
  { stars: CASS_STARS,   lines: CASS_LINES,   position: [-10, 20, -50], scale: 3.0 },
]

function buildConstellation(def: ConstellationDef) {
  const { stars, lines, scale } = def

  // Star positions
  const starPositions = stars.map(([x, y]) => new THREE.Vector3(x * scale, y * scale, 0))

  // Line geometry
  const linePoints: THREE.Vector3[] = []
  for (const [a, b] of lines) {
    linePoints.push(starPositions[a].clone())
    linePoints.push(starPositions[b].clone())
  }

  return { starPositions, linePoints }
}

export default function Constellations() {
  const groupRef = useRef<THREE.Group>(null)

  const built = useMemo(() => CONSTELLATIONS.map(buildConstellation), [])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.003
    }
  })

  return (
    <group ref={groupRef}>
      {CONSTELLATIONS.map((def, ci) => {
        const { starPositions, linePoints } = built[ci]

        // Build line geometry
        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints)

        // Build star geometry
        const starGeo = new THREE.BufferGeometry()
        const posArr = new Float32Array(starPositions.length * 3)
        const sizeArr = new Float32Array(starPositions.length)
        starPositions.forEach((p, i) => {
          posArr[i * 3]     = p.x
          posArr[i * 3 + 1] = p.y
          posArr[i * 3 + 2] = p.z
          sizeArr[i] = 3 + Math.random() * 3
        })
        starGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
        starGeo.setAttribute('size', new THREE.BufferAttribute(sizeArr, 1))

        return (
          <group key={ci} position={def.position}>
            {/* Constellation lines */}
            <lineSegments geometry={lineGeo}>
              <lineBasicMaterial
                color="#6688aa"
                transparent
                opacity={0.35}
                blending={THREE.AdditiveBlending}
              />
            </lineSegments>

            {/* Constellation stars */}
            {starPositions.map((p, si) => (
              <mesh key={si} position={[p.x, p.y, p.z]}>
                <sphereGeometry args={[0.08 + Math.random() * 0.08, 6, 6]} />
                <meshBasicMaterial
                  color={si % 3 === 0 ? '#aaccff' : si % 3 === 1 ? '#ffffff' : '#ffeebb'}
                  blending={THREE.AdditiveBlending}
                  transparent
                  opacity={0.9}
                />
              </mesh>
            ))}
          </group>
        )
      })}
    </group>
  )
}
