'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useScrollStore } from '@/store/scrollStore'
import { CAMERA_WAYPOINTS } from '@/lib/constants'

// Cubic bezier interpolation between two vec3 points with control handles
function cubicBezier(
  p0: THREE.Vector3,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  p3: THREE.Vector3,
  t: number,
): THREE.Vector3 {
  const mt  = 1 - t
  const mt2 = mt * mt
  const mt3 = mt2 * mt
  const t2  = t * t
  const t3  = t2 * t
  return new THREE.Vector3(
    mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
    mt3 * p0.z + 3 * mt2 * t * p1.z + 3 * mt * t2 * p2.z + t3 * p3.z,
  )
}

function wp2v(wp: [number, number, number]): THREE.Vector3 {
  return new THREE.Vector3(wp[0], wp[1], wp[2])
}

export default function ScrollCamera() {
  const { camera } = useThree()

  const targetPos   = useRef(new THREE.Vector3(0, 0, 8))
  const targetLook  = useRef(new THREE.Vector3(0, 0, 0))
  const currentLook = useRef(new THREE.Vector3(0, 0, 0))

  // Idle orbit
  const idleTime     = useRef(0)
  const lastScrollY  = useRef(0)
  const idlePhase    = useRef(0)
  const idleStrength = useRef(0)

  // Velocity tilt
  const smoothVelocity = useRef(0)

  useFrame((_, delta) => {
    const { scrollY, scrollVelocity } = useScrollStore.getState()
    const total = CAMERA_WAYPOINTS.length - 1
    const t = scrollY * total
    const idx = Math.min(Math.floor(t), total - 1)
    const alpha = t - idx

    const from = CAMERA_WAYPOINTS[idx]
    const to   = CAMERA_WAYPOINTS[idx + 1] ?? from

    // Build bezier control points
    const p0 = wp2v(from.position)
    const p1 = from.controlA ? wp2v(from.controlA) : p0.clone().lerp(wp2v(to.position), 0.33)
    const p2 = to.controlB   ? wp2v(to.controlB)   : wp2v(to.position).clone().lerp(p0, 0.33)
    const p3 = wp2v(to.position)

    const bezierPos  = cubicBezier(p0, p1, p2, p3, alpha)

    // Same bezier for look target
    const l0 = wp2v(from.target)
    const l3 = wp2v(to.target)
    const l1 = l0.clone().lerp(l3, 0.33)
    const l2 = l3.clone().lerp(l0, 0.33)
    const bezierLook = cubicBezier(l0, l1, l2, l3, alpha)

    targetPos.current.copy(bezierPos)
    targetLook.current.copy(bezierLook)

    // ── Idle orbital drift ──────────────────────────────────────────────
    const scrollMoved = Math.abs(scrollY - lastScrollY.current) > 0.0001
    lastScrollY.current = scrollY

    if (scrollMoved) {
      idleTime.current    = 0
      idleStrength.current = Math.max(0, idleStrength.current - delta * 2)
    } else {
      idleTime.current  += delta
      idlePhase.current += delta
      idleStrength.current = Math.min(idleTime.current / 5.0, 1.0) * 0.18
    }

    targetPos.current.x += Math.sin(idlePhase.current * 0.4)  * idleStrength.current
    targetPos.current.y += Math.cos(idlePhase.current * 0.25) * idleStrength.current * 0.4

    // ── Apply position — very slow cinematic lerp ────────────────────────
    camera.position.lerp(targetPos.current, 0.028)
    currentLook.current.lerp(targetLook.current, 0.028)

    // ── Velocity tilt (Z-roll Dutch angle) ───────────────────────────────
    smoothVelocity.current += (scrollVelocity - smoothVelocity.current) * 0.03
    const tilt = THREE.MathUtils.clamp(smoothVelocity.current * 0.00002, -0.025, 0.025)

    // Quaternion-based lookAt + roll
    const lookDir  = currentLook.current.clone().sub(camera.position).normalize()
    const up       = new THREE.Vector3(0, 1, 0)
    const lookQuat = new THREE.Quaternion().setFromRotationMatrix(
      new THREE.Matrix4().lookAt(camera.position, currentLook.current, up)
    )
    const rollQuat = new THREE.Quaternion().setFromAxisAngle(lookDir, tilt)
    const finalQuat = rollQuat.multiply(lookQuat)

    camera.quaternion.slerp(finalQuat, 0.028)
  })

  return null
}
