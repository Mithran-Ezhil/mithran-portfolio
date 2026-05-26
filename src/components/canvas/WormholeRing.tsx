'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollStore } from '@/store/scrollStore'

// Interstellar-style wormhole / accretion rings
export default function WormholeRing() {
  const groupRef = useRef<THREE.Group>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)
  const glowRef  = useRef<THREE.Mesh>(null)

  // Particle ring (accretion disk)
  const particleData = useMemo(() => {
    const N = 800
    const positions = new Float32Array(N * 3)
    const sizes     = new Float32Array(N)
    const phases    = new Float32Array(N)

    for (let i = 0; i < N; i++) {
      const angle  = (i / N) * Math.PI * 2
      const radius = 3.8 + (Math.random() - 0.5) * 1.2
      const spread = (Math.random() - 0.5) * 0.18

      positions[i * 3]     = Math.cos(angle) * radius
      positions[i * 3 + 1] = spread
      positions[i * 3 + 2] = Math.sin(angle) * radius

      sizes[i]  = 0.4 + Math.random() * 1.2
      phases[i] = Math.random() * Math.PI * 2
    }
    return { positions, sizes, phases }
  }, [])

  const diskUniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  const diskVert = `
    attribute float aSize;
    attribute float aPhase;
    uniform float uTime;
    varying float vAlpha;
    varying float vAngle;

    void main() {
      float pulse  = sin(uTime * 1.2 + aPhase * 6.28318) * 0.3 + 0.7;
      vAlpha = pulse * 0.85;
      vAngle = atan(position.x, position.z);

      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_Position  = projectionMatrix * mv;
      gl_PointSize = aSize * pulse * (220.0 / -mv.z);
    }
  `

  const diskFrag = `
    varying float vAlpha;
    varying float vAngle;

    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv);
      if (d > 0.5) discard;

      float glow = smoothstep(0.5, 0.0, d) * vAlpha;
      // Golden warm inner, cool cyan outer
      float t = smoothstep(-3.14, 3.14, vAngle);
      vec3 warm = vec3(1.0, 0.72, 0.2);   // golden
      vec3 cool = vec3(0.0, 0.83, 1.0);   // cyan
      vec3 col  = mix(warm, cool, t * 0.5 + 0.25);
      gl_FragColor = vec4(col, glow);
    }
  `

  useFrame((_, delta) => {
    diskUniforms.uTime.value += delta * 0.6
    const { scrollY } = useScrollStore.getState()

    if (groupRef.current) {
      // Slow cinematic tilt as you scroll
      groupRef.current.rotation.x = 0.3 + scrollY * 0.4
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.08
    if (ring2Ref.current) ring2Ref.current.rotation.z -= delta * 0.05
    if (ring3Ref.current) ring3Ref.current.rotation.z += delta * 0.03
  })

  return (
    <group ref={groupRef} position={[2, 0, -12]} rotation={[0.3, 0.2, 0]}>

      {/* Accretion disk particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particleData.positions, 3]} />
          <bufferAttribute attach="attributes-aSize"    args={[particleData.sizes, 1]} />
          <bufferAttribute attach="attributes-aPhase"   args={[particleData.phases, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={diskVert}
          fragmentShader={diskFrag}
          uniforms={diskUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Ring 1 — thin bright */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.8, 0.018, 4, 180]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Ring 2 — medium warm gold */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[4.4, 0.012, 4, 180]} />
        <meshBasicMaterial
          color="#f5c842"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Ring 3 — outer faint */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[5.0, 0.008, 4, 180]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Central dark sphere (the singularity) */}
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Inner glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.1, 24, 24]} />
        <meshBasicMaterial
          color="#1a6688"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

    </group>
  )
}
