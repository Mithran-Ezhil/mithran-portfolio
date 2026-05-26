'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  baseX: number; baseY: number
  x: number; y: number
  size: number
  colorR: number; colorG: number; colorB: number
  alpha: number
  phase: number
  speed: number
  driftAmp: number
}

export default function ParticleCloud({ width = 560, height = 580 }: { width?: number; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = width
    const H = height
    canvas.width = W
    canvas.height = H

    const cx = W * 0.5
    const cy = H * 0.52
    const rx = W * 0.30
    const ry = H * 0.42
    const TILT = -Math.PI / 5   // ~-36 degrees tilt like USTA rocket

    const COUNT = 720
    const particles: Particle[] = []

    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const r = Math.sqrt(Math.random())     // sqrt = volume fill

      const ex = rx * r * Math.cos(theta)
      const ey = ry * r * Math.sin(theta)

      // Apply tilt rotation
      const bx = cx + ex * Math.cos(TILT) - ey * Math.sin(TILT)
      const by = cy + ex * Math.sin(TILT) + ey * Math.cos(TILT)

      // Color zones by angle + position
      // Top-right = warm orange/gold, bottom-left = cool blue/cyan, mid = white
      const ang = Math.atan2(ey, ex)
      const posT = (ang + Math.PI) / (Math.PI * 2) // 0-1

      let cr: number, cg: number, cb: number
      const rng = Math.random()
      if (posT < 0.25 || posT > 0.85) {
        // Orange/warm zone
        if (rng < 0.5) { cr = 255; cg = 140 + Math.random() * 60; cb = 20 + Math.random() * 40 }
        else { cr = 255; cg = 200; cb = 80 }
      } else if (posT > 0.4 && posT < 0.7) {
        // Blue/cyan zone
        if (rng < 0.5) { cr = 30 + Math.random() * 50; cg = 100 + Math.random() * 100; cb = 220 + Math.random() * 35 }
        else { cr = 0; cg = 200 + Math.random() * 55; cb = 255 }
      } else {
        // White/silver mid zone
        const v = 180 + Math.random() * 75
        cr = v; cg = v; cb = v + Math.random() * 30
      }

      particles.push({
        baseX: bx, baseY: by, x: bx, y: by,
        size: 0.6 + Math.random() * (r > 0.7 ? 1.8 : 2.8),
        colorR: cr, colorG: cg, colorB: Math.min(255, cb),
        alpha: 0.25 + Math.random() * 0.75,
        phase: Math.random() * Math.PI * 2,
        speed: 0.25 + Math.random() * 0.9,
        driftAmp: 1.5 + Math.random() * 3.5,
      })
    }

    let time = 0
    let raf: number
    let mouseX = -9999, mouseY = -9999

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const scaleX = W / rect.width
      const scaleY = H / rect.height
      mouseX = (e.clientX - rect.left) * scaleX
      mouseY = (e.clientY - rect.top) * scaleY
    }
    window.addEventListener('mousemove', onMove)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      time += 0.007

      // Slow whole-cloud rotation
      const rot = time * 0.04

      for (const p of particles) {
        // Rotate base position around center
        const dx = p.baseX - cx
        const dy = p.baseY - cy
        const rx2 = cx + dx * Math.cos(rot) - dy * Math.sin(rot)
        const ry2 = cy + dx * Math.sin(rot) + dy * Math.cos(rot)

        // Drift
        const drift = Math.sin(time * p.speed + p.phase) * p.driftAmp
        const driftY = Math.cos(time * p.speed * 0.8 + p.phase + 1) * p.driftAmp * 0.7

        p.x = rx2 + drift
        p.y = ry2 + driftY

        // Mouse repulsion
        const mdx = p.x - mouseX
        const mdy = p.y - mouseY
        const md2 = mdx * mdx + mdy * mdy
        if (md2 < 6400) {  // 80px radius
          const md = Math.sqrt(md2)
          const force = (80 - md) / 80
          p.x += (mdx / md) * force * 12
          p.y += (mdy / md) * force * 12
        }

        // Twinkle alpha
        const a = p.alpha * (0.55 + Math.sin(time * 2 * p.speed + p.phase) * 0.45)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${Math.round(p.colorR)},${Math.round(p.colorG)},${Math.round(p.colorB)},${a})`
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [width, height])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  )
}
