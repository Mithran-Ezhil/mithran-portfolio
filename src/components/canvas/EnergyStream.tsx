'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const streamVert = `
  attribute float aOffset;
  attribute float aWidth;
  uniform float uTime;
  uniform float uScrollY;
  varying float vAlpha;
  varying float vProgress;

  void main() {
    vProgress = (position.x + 12.0) / 24.0;

    // Sine wave displacement
    float wave1 = sin(position.x * 0.5 + uTime * 1.2 + aOffset) * 1.4;
    float wave2 = sin(position.x * 0.8 + uTime * 0.7 + aOffset * 2.0) * 0.6;
    float y = position.y + wave1 + wave2;

    // Fade at edges
    float edgeFade = smoothstep(0.0, 0.15, vProgress) * smoothstep(1.0, 0.85, vProgress);
    vAlpha = edgeFade * (0.5 + 0.5 * sin(position.x * 1.2 + uTime * 0.9 + aOffset));

    vec3 pos = vec3(position.x, y, position.z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aWidth * (200.0 / -(modelViewMatrix * vec4(pos, 1.0)).z);
  }
`

const streamFrag = `
  varying float vAlpha;
  varying float vProgress;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float glow = smoothstep(0.5, 0.0, d) * vAlpha * 0.9;
    // Cyan to teal gradient along stream
    vec3 colA = vec3(0.0, 0.83, 1.0);   // #00d4ff
    vec3 colB = vec3(0.0, 1.0, 0.78);   // #00ffca
    vec3 col  = mix(colA, colB, vProgress);
    gl_FragColor = vec4(col, glow);
  }
`

function buildStream(streamIdx: number) {
  const N   = 200
  const positions = new Float32Array(N * 3)
  const offsets   = new Float32Array(N)
  const widths    = new Float32Array(N)

  const yBase = (streamIdx - 1.5) * 1.8  // 4 streams: -2.7 to +2.7
  const zBase = -4 + streamIdx * 0.8

  for (let i = 0; i < N; i++) {
    const x = -12 + (i / (N - 1)) * 24
    positions[i * 3]     = x
    positions[i * 3 + 1] = yBase
    positions[i * 3 + 2] = zBase
    offsets[i] = streamIdx * 1.4 + (Math.random() - 0.5) * 0.4
    widths[i]  = 1.2 + Math.random() * 1.2
  }

  return { positions, offsets, widths }
}

export default function EnergyStream() {
  const groupRef = useRef<THREE.Group>(null)
  const streams  = useMemo(() => [0, 1, 2, 3].map(buildStream), [])
  const uniforms = useMemo(() => ({
    uTime:    { value: 0 },
    uScrollY: { value: 0 },
  }), [])

  useFrame((_, delta) => {
    uniforms.uTime.value += delta * 0.9
  })

  return (
    <group ref={groupRef} position={[0, -1, -6]} rotation={[0.1, 0, 0]}>
      {streams.map((stream, i) => (
        <points key={i}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[stream.positions, 3]} />
            <bufferAttribute attach="attributes-aOffset"  args={[stream.offsets, 1]} />
            <bufferAttribute attach="attributes-aWidth"   args={[stream.widths, 1]} />
          </bufferGeometry>
          <shaderMaterial
            vertexShader={streamVert}
            fragmentShader={streamFrag}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      ))}
    </group>
  )
}
