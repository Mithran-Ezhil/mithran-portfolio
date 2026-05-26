'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 700

// Particles distributed across all 5 camera waypoints (Y = 0, -10, -20, -30, -40)
const vert = `
  attribute float aSpeed;
  attribute float aSize;
  attribute float aBaseY;
  uniform float uTime;
  varying float vAlpha;

  void main() {
    // Slowly drift upward within a ±5 window around base Y, then wrap
    float range = 10.0;
    float t = mod(aSpeed * uTime * 0.6 + range, range * 2.0) - range;
    float y = aBaseY + t;

    vec3 pos = vec3(position.x, y, position.z);

    // Fade at extremes of drift range
    float f = 1.0 - abs(t / range);
    vAlpha = f * f * 0.45 + 0.05;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * (110.0 / -mv.z);
  }
`
const frag = `
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    vec3 col = mix(vec3(0.0, 0.83, 1.0), vec3(0.85, 0.97, 1.0), smoothstep(0.15, 0.0, d));
    gl_FragColor = vec4(col, a);
  }
`

export default function AmbientParticles() {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, speeds, sizes, baseYs } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const speeds    = new Float32Array(COUNT)
    const sizes     = new Float32Array(COUNT)
    const baseYs    = new Float32Array(COUNT)

    // Evenly distribute across all 5 camera waypoints
    const waypoints = [0, -10, -20, -30, -40]

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = 0   // actual Y comes from aBaseY + drift in shader
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22 - 8

      const wpIdx = Math.floor(Math.random() * waypoints.length)
      baseYs[i] = waypoints[wpIdx] + (Math.random() - 0.5) * 6

      speeds[i] = (Math.random() > 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.9)
      sizes[i]  = Math.random() < 0.04
        ? 1.8 + Math.random() * 1.2
        : 0.3 + Math.random() * 0.55
    }
    return { positions, speeds, sizes, baseYs }
  }, [])

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((_, delta) => {
    uniforms.uTime.value += delta
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSpeed"   args={[speeds, 1]}    />
        <bufferAttribute attach="attributes-aSize"    args={[sizes, 1]}     />
        <bufferAttribute attach="attributes-aBaseY"   args={[baseYs, 1]}    />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
