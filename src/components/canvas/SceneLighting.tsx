'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollStore } from '@/store/scrollStore'
import { SECTION_THEMES } from '@/lib/sectionThemes'

export default function SceneLighting() {
  const ambientRef  = useRef<THREE.AmbientLight>(null)
  const keyRef      = useRef<THREE.PointLight>(null)
  const fillRef     = useRef<THREE.PointLight>(null)
  const backRef     = useRef<THREE.PointLight>(null)

  const currentAmbientColor   = useRef(new THREE.Color(SECTION_THEMES[0].ambientColor))
  const currentAmbientIntensity = useRef(SECTION_THEMES[0].ambientIntensity)
  const currentPointColor     = useRef(new THREE.Color(SECTION_THEMES[0].pointColor))
  const currentPointIntensity = useRef(SECTION_THEMES[0].pointIntensity)

  useFrame(() => {
    const { sectionIndex, sectionProgress } = useScrollStore.getState()
    const nextIdx = Math.min(sectionIndex + 1, SECTION_THEMES.length - 1)
    const from    = SECTION_THEMES[sectionIndex]
    const to      = SECTION_THEMES[nextIdx]
    const eased   = sectionProgress * sectionProgress * (3 - 2 * sectionProgress)

    // Interpolate target values
    const tAmbCol = from.ambientColor.clone().lerp(to.ambientColor, eased)
    const tAmbInt = from.ambientIntensity + (to.ambientIntensity - from.ambientIntensity) * eased
    const tPtCol  = from.pointColor.clone().lerp(to.pointColor, eased)
    const tPtInt  = from.pointIntensity + (to.pointIntensity - from.pointIntensity) * eased

    // Smooth lerp toward targets
    currentAmbientColor.current.lerp(tAmbCol, 0.03)
    currentAmbientIntensity.current += (tAmbInt - currentAmbientIntensity.current) * 0.03
    currentPointColor.current.lerp(tPtCol, 0.03)
    currentPointIntensity.current += (tPtInt - currentPointIntensity.current) * 0.03

    if (ambientRef.current) {
      ambientRef.current.color.copy(currentAmbientColor.current)
      ambientRef.current.intensity = currentAmbientIntensity.current
    }
    if (keyRef.current) {
      keyRef.current.color.copy(currentPointColor.current)
      keyRef.current.intensity = currentPointIntensity.current
    }
    if (fillRef.current) {
      // Fill is always 35% of key, complementary hue shift
      fillRef.current.color.copy(currentPointColor.current).multiplyScalar(0.35)
      fillRef.current.intensity = currentPointIntensity.current * 0.4
    }
    if (backRef.current) {
      backRef.current.color.copy(currentPointColor.current)
      backRef.current.intensity = currentPointIntensity.current * 0.25
    }
  })

  return (
    <>
      <ambientLight ref={ambientRef} color="#1a1a3a" intensity={0.04} />
      <pointLight ref={keyRef}  position={[10,  8,  8]}  color="#6366f1" intensity={1.2} distance={80} />
      <pointLight ref={fillRef} position={[-8, -6, -6]}  color="#a78bfa" intensity={0.5} distance={60} />
      <pointLight ref={backRef} position={[ 0, -5,  -8]} color="#6366f1" intensity={0.3} distance={50} />
      {/* Section Y-band fill lights — static, just illuminate content areas */}
      <pointLight position={[0, -10, 4]} color="#8844cc" intensity={0.4} distance={25} />
      <pointLight position={[0, -20, 4]} color="#cc4422" intensity={0.4} distance={25} />
      <pointLight position={[0, -30, 4]} color="#0088cc" intensity={0.4} distance={25} />
      <pointLight position={[0, -40, 4]} color="#4455cc" intensity={0.3} distance={25} />
      {/* Moon directional */}
      <directionalLight position={[-3, 2, 3]} intensity={0.4} color="#c8d8ff" />
    </>
  )
}
