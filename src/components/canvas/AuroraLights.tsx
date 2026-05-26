'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    vUv = uv;
    vPosition = position;

    // Warp the mesh vertices for wavy curtain effect
    vec3 pos = position;
    pos.y += sin(pos.x * 0.4 + uTime * 0.6) * 1.5;
    pos.y += sin(pos.x * 0.9 - uTime * 0.4) * 0.8;
    pos.x += cos(pos.y * 0.3 + uTime * 0.3) * 0.5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;

  // Smooth noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vec2 uv = vUv;

    // Animated noise layers for organic movement
    float n1 = noise(vec2(uv.x * 3.0 + uTime * 0.2, uv.y * 1.5));
    float n2 = noise(vec2(uv.x * 5.0 - uTime * 0.15, uv.y * 2.5 + 1.3));
    float n3 = noise(vec2(uv.x * 2.0 + uTime * 0.1 + 2.0, uv.y * 1.0));

    float band = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    // Aurora color palette — green to teal to purple to pink
    vec3 col1 = vec3(0.0, 1.0, 0.5);   // neon green
    vec3 col2 = vec3(0.0, 0.8, 1.0);   // cyan
    vec3 col3 = vec3(0.5, 0.1, 1.0);   // deep purple
    vec3 col4 = vec3(1.0, 0.2, 0.7);   // magenta pink

    vec3 color = mix(col1, col2, uv.x + sin(uTime * 0.3) * 0.2);
    color = mix(color, col3, band * 0.6);
    color = mix(color, col4, n2 * 0.3 * sin(uTime * 0.2 + 1.5));

    // Alpha: vertical fade + noise-driven intensity
    float fadeY = smoothstep(0.0, 0.25, uv.y) * smoothstep(1.0, 0.6, uv.y);
    float fadeX = smoothstep(0.0, 0.1, uv.x) * smoothstep(1.0, 0.9, uv.x);
    float alpha = fadeY * fadeX * (band * 0.7 + 0.15) * 0.55;

    gl_FragColor = vec4(color, alpha);
  }
`

export default function AuroraLights() {
  const meshRef = useRef<THREE.Mesh>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((_, delta) => {
    uniforms.uTime.value += delta * 0.5
  })

  return (
    <mesh ref={meshRef} position={[0, 18, -25]} rotation={[0.1, 0, 0]}>
      <planeGeometry args={[80, 30, 60, 30]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
