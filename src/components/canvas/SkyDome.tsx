'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollStore } from '@/store/scrollStore'
import { SECTION_THEMES } from '@/lib/sectionThemes'

const vertexShader = `
  varying float vElevation;

  void main() {
    vElevation = normalize(position).y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform vec3  uColorTop;
  uniform vec3  uColorMid;
  uniform vec3  uColorBottom;
  uniform float uTime;

  varying float vElevation;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
               mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
  }

  void main() {
    float t = clamp(vElevation * 0.5 + 0.5, 0.0, 1.0);

    vec3 color;
    if (t < 0.5) {
      color = mix(uColorBottom, uColorMid, t * 2.0);
    } else {
      color = mix(uColorMid, uColorTop, (t - 0.5) * 2.0);
    }

    // Subtle animated shimmer at horizon to break banding
    float n = noise(vec2(vElevation * 8.0 + uTime * 0.03, uTime * 0.015));
    color += (n - 0.5) * 0.012;

    gl_FragColor = vec4(color, 1.0);
  }
`

export default function SkyDome() {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  // Live lerping colors
  const currentTop = useRef(new THREE.Color(SECTION_THEMES[0].skyTop))
  const currentMid = useRef(new THREE.Color(SECTION_THEMES[0].skyMid))
  const currentBot = useRef(new THREE.Color(SECTION_THEMES[0].skyBottom))

  const uniforms = useMemo(() => ({
    uColorTop:    { value: currentTop.current.clone() },
    uColorMid:    { value: currentMid.current.clone() },
    uColorBottom: { value: currentBot.current.clone() },
    uTime:        { value: 0 },
  }), [])

  useFrame((_, delta) => {
    uniforms.uTime.value += delta

    const { sectionIndex, sectionProgress } = useScrollStore.getState()

    // Blend between current section theme and next section for smooth crossfade
    const nextIdx = Math.min(sectionIndex + 1, SECTION_THEMES.length - 1)
    const from    = SECTION_THEMES[sectionIndex]
    const to      = SECTION_THEMES[nextIdx]
    const eased   = sectionProgress * sectionProgress * (3 - 2 * sectionProgress) // smoothstep

    const targetTop = from.skyTop.clone().lerp(to.skyTop, eased)
    const targetMid = from.skyMid.clone().lerp(to.skyMid, eased)
    const targetBot = from.skyBottom.clone().lerp(to.skyBottom, eased)

    currentTop.current.lerp(targetTop, 0.04)
    currentMid.current.lerp(targetMid, 0.04)
    currentBot.current.lerp(targetBot, 0.04)

    uniforms.uColorTop.value.copy(currentTop.current)
    uniforms.uColorMid.value.copy(currentMid.current)
    uniforms.uColorBottom.value.copy(currentBot.current)
  })

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[140, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}
