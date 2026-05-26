'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;

  // Hash for procedural craters
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1,0)), f.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
      f.y
    );
  }

  float crater(vec2 uv, vec2 center, float size) {
    float d = length(uv - center);
    float rim = smoothstep(size, size * 0.7, d) * smoothstep(size * 0.5, size * 0.7, d);
    float floor = smoothstep(size * 0.55, size * 0.4, d) * 0.3;
    return rim * 0.4 - floor;
  }

  void main() {
    vec2 uv = vUv;

    // Base moon color
    float surface = noise(uv * 8.0) * 0.4 + noise(uv * 20.0) * 0.15 + 0.45;
    vec3 moonBase = vec3(0.75, 0.73, 0.68) * surface;

    // Craters
    float c = 0.0;
    c += crater(uv, vec2(0.3, 0.6), 0.08);
    c += crater(uv, vec2(0.6, 0.3), 0.06);
    c += crater(uv, vec2(0.5, 0.7), 0.04);
    c += crater(uv, vec2(0.2, 0.4), 0.05);
    c += crater(uv, vec2(0.7, 0.65), 0.035);
    c += crater(uv, vec2(0.45, 0.2), 0.07);

    moonBase += c * 0.15;

    // Dark maria (lunar seas)
    float maria = noise(uv * 3.0 + 0.5) * noise(uv * 4.0);
    moonBase *= 1.0 - maria * 0.3;

    // Directional lighting (from upper-left)
    vec3 lightDir = normalize(vec3(-1.0, 1.0, 1.5));
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    float ambient = 0.08;
    float light = ambient + diffuse * 0.85;

    // Limb darkening
    float limb = 1.0 - pow(1.0 - max(dot(vNormal, vec3(0,0,1)), 0.0), 2.0) * 0.3;

    // Subtle atmospheric glow on edge
    float rim = pow(1.0 - max(dot(vNormal, vec3(0,0,1)), 0.0), 4.0);
    vec3 rimColor = vec3(0.6, 0.7, 0.9) * rim * 0.15;

    vec3 finalColor = moonBase * light * limb + rimColor;
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

export default function Moon() {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((_, delta) => {
    uniforms.uTime.value += delta
    if (meshRef.current)  meshRef.current.rotation.y  += delta * 0.015
    if (glowRef.current)  glowRef.current.rotation.y  += delta * 0.008
  })

  return (
    <group position={[22, 12, -30]}>
      {/* Moon sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[3, 64, 64]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>

      {/* Atmospheric glow halo */}
      <mesh ref={glowRef} scale={1.12}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial
          color="#8899cc"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer soft halo */}
      <mesh scale={1.4}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial
          color="#445577"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
