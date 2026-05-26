'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'
import * as THREE from 'three'
import { useScrollStore } from '@/store/scrollStore'

// Bloom intensity per section
const BLOOM_BY_SECTION  = [1.4, 2.0, 2.4, 2.8, 1.4]
const VIGNETTE_BY_SECTION = [0.7, 0.65, 0.72, 0.68, 0.75]

export default function PostProcessing() {
  const bloomRef   = useRef<{ intensity: number }>(null)
  const vigRef     = useRef<{ darkness: number }>(null)
  const caOffset   = useRef(new THREE.Vector2(0.001, 0.001))

  useFrame(() => {
    const { sectionIndex, sectionProgress, scrollVelocity } = useScrollStore.getState()
    const nextIdx  = Math.min(sectionIndex + 1, 4)
    const eased    = sectionProgress * sectionProgress * (3 - 2 * sectionProgress)

    // Lerp bloom target between sections
    const bloomTarget = BLOOM_BY_SECTION[sectionIndex] +
      (BLOOM_BY_SECTION[nextIdx] - BLOOM_BY_SECTION[sectionIndex]) * eased
    const velBoost = Math.min(Math.abs(scrollVelocity) * 0.001, 0.8)

    if (bloomRef.current) {
      bloomRef.current.intensity +=
        (bloomTarget + velBoost - bloomRef.current.intensity) * 0.04
    }

    // Vignette
    const vigTarget = VIGNETTE_BY_SECTION[sectionIndex] +
      (VIGNETTE_BY_SECTION[nextIdx] - VIGNETTE_BY_SECTION[sectionIndex]) * eased
    if (vigRef.current) {
      vigRef.current.darkness +=
        (vigTarget - vigRef.current.darkness) * 0.04
    }

    // Chromatic aberration spikes on fast scroll
    const caStrength = 0.0005 + Math.min(Math.abs(scrollVelocity) * 0.000003, 0.004)
    caOffset.current.lerp(new THREE.Vector2(caStrength, caStrength), 0.1)
  })

  return (
    <EffectComposer>
      {/* Primary bloom — picks up emissive objects */}
      <Bloom
        ref={bloomRef}
        luminanceThreshold={0.3}
        luminanceSmoothing={0.85}
        intensity={1.4}
        kernelSize={KernelSize.LARGE}
        blendFunction={BlendFunction.ADD}
      />
      {/* Secondary bloom — only ultra-bright star cores */}
      <Bloom
        luminanceThreshold={0.85}
        luminanceSmoothing={0.5}
        intensity={0.4}
        kernelSize={KernelSize.HUGE}
        blendFunction={BlendFunction.ADD}
      />
      <ChromaticAberration
        offset={caOffset.current}
        blendFunction={BlendFunction.NORMAL}
      />
      <Vignette
        ref={vigRef}
        eskil={false}
        offset={0.25}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}
