'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'

import SkyDome          from './SkyDome'
import SceneLighting    from './SceneLighting'
import ScrollCamera     from './ScrollCamera'
import StarField        from './StarField'
import DataNetwork      from './DataNetwork'
import AmbientParticles from './AmbientParticles'
import GalaxyScene      from './GalaxyScene'
import NebulaZones      from './NebulaZones'
import PostProcessing   from './PostProcessing'

function SceneContent() {
  return (
    <>
      <SkyDome />
      <SceneLighting />
      <ScrollCamera />

      {/* Distant star field */}
      <StarField count={3000} />

      {/* Slowly rising ambient particles across all sections */}
      <AmbientParticles />

      {/* Data network with travelling packets */}
      <DataNetwork />

      {/* ── Galaxy spiral — hero focal point ── */}
      <GalaxyScene />

      {/* ── Per-section nebula atmosphere ── */}
      <NebulaZones />

      <PostProcessing />
    </>
  )
}

export default function Scene() {
  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      dpr={[1, 1.5]}
      camera={{ fov: 65, near: 0.1, far: 400, position: [0, 0, 8] }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  )
}
