'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const NODE_COUNT    = 80
const SPREAD        = 22
const CONNECT_DIST  = 3.6
const CONNECT_DIST2 = CONNECT_DIST * CONNECT_DIST
const PACKET_COUNT  = 40

// ── Node shaders ──────────────────────────────────────────────────────────────
const nodeVert = `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  varying float vAlpha;

  void main() {
    float pulse = sin(uTime * 1.4 + aPhase * 6.28318) * 0.3 + 0.7;
    vAlpha = pulse;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * pulse * (160.0 / -mv.z);
  }
`
const nodeFrag = `
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, d) * vAlpha * 0.75;
    float core = smoothstep(0.15, 0.0, d) * 0.6;
    vec3 col = mix(vec3(0.0, 0.83, 1.0), vec3(0.0, 1.0, 0.8), core);
    gl_FragColor = vec4(col, glow);
  }
`

// ── Packet shaders (bright travelling dots) ───────────────────────────────────
const pktVert = `
  attribute float aGlow;
  uniform float uTime;
  varying float vGlow;

  void main() {
    vGlow = aGlow;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (3.5 + aGlow * 2.5) * (140.0 / -mv.z);
  }
`
const pktFrag = `
  varying float vGlow;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d) * vGlow * 1.2;
    float core = smoothstep(0.12, 0.0, d);
    vec3 col = mix(vec3(0.0, 0.85, 1.0), vec3(1.0, 1.0, 1.0), core * 0.6);
    gl_FragColor = vec4(col, a);
  }
`

interface PacketState {
  edgeIdx: number   // index into connectedEdges
  t: number         // 0→1 progress along edge
  speed: number
}

export default function DataNetwork() {
  const pointsRef  = useRef<THREE.Points>(null)
  const linesRef   = useRef<THREE.LineSegments>(null)
  const pktGeoRef  = useRef<THREE.BufferGeometry>(null)
  const nodesData  = useRef<{ vel: THREE.Vector3; pos: THREE.Vector3 }[]>([])

  const { nodePositions, nodeSizes, nodePhases, linePositions, pktPositions, pktGlows, connectedEdges } = useMemo(() => {
    const nodePositions = new Float32Array(NODE_COUNT * 3)
    const nodeSizes     = new Float32Array(NODE_COUNT)
    const nodePhases    = new Float32Array(NODE_COUNT)
    const nodes: THREE.Vector3[] = []

    // Camera waypoints: Y = 0, -10, -20, -30, -40
    // Cluster most nodes near each waypoint so each section looks rich
    const waypoints = [0, -10, -20, -30, -40]
    for (let i = 0; i < NODE_COUNT; i++) {
      const x = (Math.random() - 0.5) * SPREAD
      // Assign nodes to waypoints — most near hero, progressively fewer deeper
      const wIdx = Math.floor(Math.random() * waypoints.length)
      const baseY = waypoints[wIdx]
      const y = baseY + (Math.random() - 0.5) * 7  // ±3.5 around each waypoint
      const z = (Math.random() - 0.5) * SPREAD * 0.5 - 5

      nodePositions[i * 3]     = x
      nodePositions[i * 3 + 1] = y
      nodePositions[i * 3 + 2] = z

      nodeSizes[i]  = Math.random() < 0.06 ? 2.5 + Math.random() * 1.5 : 0.7 + Math.random() * 1.0
      nodePhases[i] = Math.random() * Math.PI * 2

      nodes.push(new THREE.Vector3(x, y, z))
      nodesData.current.push({
        pos: new THREE.Vector3(x, y, z),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.002,
        ),
      })
    }

    // Pre-compute edges
    const maxLines = 2000
    const linePositions = new Float32Array(maxLines * 6)
    const connectedEdges: [number, number][] = []
    let lineIdx = 0

    for (let i = 0; i < NODE_COUNT && lineIdx < maxLines; i++) {
      for (let j = i + 1; j < NODE_COUNT && lineIdx < maxLines; j++) {
        if (nodes[i].distanceToSquared(nodes[j]) < CONNECT_DIST2) {
          linePositions[lineIdx * 6]     = nodes[i].x
          linePositions[lineIdx * 6 + 1] = nodes[i].y
          linePositions[lineIdx * 6 + 2] = nodes[i].z
          linePositions[lineIdx * 6 + 3] = nodes[j].x
          linePositions[lineIdx * 6 + 4] = nodes[j].y
          linePositions[lineIdx * 6 + 5] = nodes[j].z
          connectedEdges.push([i, j])
          lineIdx++
        }
      }
    }

    // Packet geometry (hidden initially)
    const pktPositions = new Float32Array(PACKET_COUNT * 3)
    const pktGlows     = new Float32Array(PACKET_COUNT)
    for (let k = 0; k < PACKET_COUNT; k++) {
      pktPositions[k * 3 + 2] = -999
      pktGlows[k] = 0.6 + Math.random() * 0.4
    }

    return { nodePositions, nodeSizes, nodePhases, linePositions, pktPositions, pktGlows, connectedEdges }
  }, [])

  // Packet runtime state
  const packets = useRef<PacketState[]>(
    Array.from({ length: PACKET_COUNT }, () => ({
      edgeIdx: Math.floor(Math.random() * Math.max(1, connectedEdges.length)),
      t: Math.random(),
      speed: 0.004 + Math.random() * 0.008,
    }))
  )

  const uniforms    = useMemo(() => ({ uTime: { value: 0 } }), [])
  const pktUniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((_, delta) => {
    uniforms.uTime.value    += delta * 0.6
    pktUniforms.uTime.value += delta * 0.6

    const data   = nodesData.current
    const pGeo   = pointsRef.current?.geometry
    const lGeo   = linesRef.current?.geometry
    const pktGeo = pktGeoRef.current

    if (!pGeo || !lGeo || !pktGeo) return

    const posAttr  = pGeo.attributes.position as THREE.BufferAttribute
    const lineAttr = lGeo.attributes.position as THREE.BufferAttribute
    const pktAttr  = pktGeo.attributes.position as THREE.BufferAttribute

    // Drift nodes
    for (let i = 0; i < NODE_COUNT; i++) {
      const n = data[i]
      n.pos.addScaledVector(n.vel, 1)
      if (Math.abs(n.pos.x) > SPREAD * 0.5) n.vel.x *= -1
      if (n.pos.y > 3 || n.pos.y < -44)     n.vel.y *= -1
      if (Math.abs(n.pos.z) > SPREAD * 0.25 + 3) n.vel.z *= -1
      posAttr.setXYZ(i, n.pos.x, n.pos.y, n.pos.z)
    }

    // Rebuild lines
    let idx = 0
    const maxLines = lineAttr.count
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (idx >= maxLines) break
        const d2 = data[i].pos.distanceToSquared(data[j].pos)
        if (d2 < CONNECT_DIST2) {
          lineAttr.setXYZ(idx * 2,     data[i].pos.x, data[i].pos.y, data[i].pos.z)
          lineAttr.setXYZ(idx * 2 + 1, data[j].pos.x, data[j].pos.y, data[j].pos.z)
          idx++
        }
      }
      if (idx >= maxLines) break
    }
    for (let k = idx; k < maxLines; k++) {
      lineAttr.setXYZ(k * 2, 0, 0, -999)
      lineAttr.setXYZ(k * 2 + 1, 0, 0, -999)
    }

    // Animate packets along edges
    const pkts = packets.current
    const edges = connectedEdges
    if (edges.length > 0) {
      for (let k = 0; k < PACKET_COUNT; k++) {
        const pkt = pkts[k]
        pkt.t += pkt.speed

        if (pkt.t > 1) {
          pkt.t = 0
          pkt.edgeIdx = Math.floor(Math.random() * edges.length)
          pkt.speed   = 0.004 + Math.random() * 0.010
        }

        const [ni, nj] = edges[pkt.edgeIdx % edges.length]
        const A = data[ni].pos
        const B = data[nj].pos

        // Only show if still connected
        const d2 = A.distanceToSquared(B)
        if (d2 < CONNECT_DIST2 * 1.5) {
          const x = A.x + (B.x - A.x) * pkt.t
          const y = A.y + (B.y - A.y) * pkt.t
          const z = A.z + (B.z - A.z) * pkt.t
          pktAttr.setXYZ(k, x, y, z)
        } else {
          pktAttr.setXYZ(k, 0, 0, -999)
        }
      }
    }

    posAttr.needsUpdate  = true
    lineAttr.needsUpdate = true
    pktAttr.needsUpdate  = true
  })

  return (
    <group>
      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={linePositions.length / 3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Node points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
          <bufferAttribute attach="attributes-aSize"    args={[nodeSizes, 1]} />
          <bufferAttribute attach="attributes-aPhase"   args={[nodePhases, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={nodeVert}
          fragmentShader={nodeFrag}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Data packets — bright travelling dots */}
      <points>
        <bufferGeometry ref={pktGeoRef}>
          <bufferAttribute attach="attributes-position" args={[pktPositions, 3]} count={PACKET_COUNT} />
          <bufferAttribute attach="attributes-aGlow"    args={[pktGlows, 1]}    count={PACKET_COUNT} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={pktVert}
          fragmentShader={pktFrag}
          uniforms={pktUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
