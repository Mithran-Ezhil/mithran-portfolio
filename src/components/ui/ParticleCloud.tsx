'use client'

import { useEffect, useRef } from 'react'

type Zone = 'core' | 'inner' | 'mid' | 'outer'

interface Particle {
  baseX: number; baseY: number
  x: number; y: number
  size: number
  r: number; g: number; b: number
  alpha: number
  phase: number
  speed: number
  driftAmp: number
  zone: Zone
}

export default function ParticleCloud({ width = 700, height = 700 }: { width?: number; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = width, H = height
    canvas.width = W
    canvas.height = H

    const cx = W * 0.5, cy = H * 0.5
    const semiX = W * 0.38
    const semiY = H * 0.33
    const TILT = -Math.PI / 6   // 30° tilt

    /* ── Pre-render nebula blobs onto offscreen canvas ─────────────── */
    const nebCanvas = document.createElement('canvas')
    nebCanvas.width = W; nebCanvas.height = H
    const nc = nebCanvas.getContext('2d')!

    const blobs = [
      { ox:   0,   oy:   0, r: 160, cr: [0,  212, 255, 0.10] },   // center cyan
      { ox:  90,  oy: -70, r: 110, cr: [0,  255, 200, 0.07] },   // top-right teal
      { ox: -110,  oy:  90, r: 130, cr: [60, 130, 255, 0.08] },   // bottom-left blue
      { ox:  150,  oy:  70, r:  80, cr: [140,  80, 255, 0.05] },  // right violet
      { ox: -80,  oy: -90, r:  90, cr: [0,  180, 255, 0.06] },   // top-left
      { ox:   0,  oy: 130, r: 120, cr: [0,  100, 200, 0.05] },   // bottom
    ]
    blobs.forEach(({ ox, oy, r: br, cr }) => {
      const nx = cx + ox, ny = cy + oy
      const grd = nc.createRadialGradient(nx, ny, 0, nx, ny, br)
      grd.addColorStop(0, `rgba(${cr[0]},${cr[1]},${cr[2]},${cr[3]})`)
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      nc.fillStyle = grd
      nc.fillRect(0, 0, W, H)
    })

    /* ── Generate particles (galaxy spiral + core + haze) ──────────── */
    const COUNT = 1400
    const particles: Particle[] = []

    for (let i = 0; i < COUNT; i++) {
      let rad: number, theta: number, zone: Zone

      if (i < COUNT * 0.12) {
        // Dense bright core
        zone = 'core'
        rad   = Math.random() * 0.16
        theta = Math.random() * Math.PI * 2
      } else if (i < COUNT * 0.55) {
        // Two-arm logarithmic spiral
        zone = i < COUNT * 0.33 ? 'inner' : 'mid'
        rad   = 0.14 + Math.sqrt(Math.random()) * 0.60
        const arm    = i % 2
        const tightness = 3.2
        const spread = (Math.random() - 0.5) * 0.9
        theta = arm * Math.PI + rad * tightness + spread
      } else {
        // Outer haze
        zone = 'outer'
        rad   = 0.55 + Math.random() * 0.45
        theta = Math.random() * Math.PI * 2
      }

      // Ellipse coordinates + tilt
      const ex = semiX * rad * Math.cos(theta)
      const ey = semiY * rad * Math.sin(theta)
      const bx = cx + ex * Math.cos(TILT) - ey * Math.sin(TILT)
      const by = cy + ex * Math.sin(TILT) + ey * Math.cos(TILT)

      // Color per zone
      let pr: number, pg: number, pb: number
      const rn = Math.random()

      if (zone === 'core') {
        // White-blue-cyan
        pr = 160 + Math.random() * 95
        pg = 210 + Math.random() * 45
        pb = 255
      } else if (zone === 'inner') {
        // Cyan / teal
        if (rn < 0.5) { pr = 0;   pg = 210 + Math.random() * 45; pb = 255 }
        else           { pr = 0;   pg = 255; pb = 180 + Math.random() * 75 }
      } else if (zone === 'mid') {
        // Blue-indigo
        if (rn < 0.5) { pr = 40  + Math.random() * 80; pg = 120 + Math.random() * 80; pb = 255 }
        else           { pr = 100 + Math.random() * 60; pg = 170 + Math.random() * 60; pb = 255 }
      } else {
        // Deep blue / purple haze
        pr = 20  + Math.random() * 60
        pg = 50  + Math.random() * 80
        pb = 160 + Math.random() * 95
      }

      particles.push({
        baseX: bx, baseY: by, x: bx, y: by,
        size: zone === 'core'  ? 1.0 + Math.random() * 2.2
            : zone === 'inner' ? 0.7 + Math.random() * 1.6
            : zone === 'mid'   ? 0.5 + Math.random() * 1.2
            :                    0.3 + Math.random() * 0.9,
        r: pr, g: pg, b: Math.min(255, pb),
        alpha: zone === 'core'  ? 0.70 + Math.random() * 0.30
             : zone === 'inner' ? 0.50 + Math.random() * 0.50
             : zone === 'mid'   ? 0.25 + Math.random() * 0.45
             :                    0.08 + Math.random() * 0.28,
        phase:    Math.random() * Math.PI * 2,
        speed:    0.20 + Math.random() * 0.85,
        driftAmp: zone === 'core' ? 0.4 + Math.random() * 1.2
                                  : 1.0 + Math.random() * 3.5,
        zone,
      })
    }

    let time = 0, raf = 0
    let mouseX = -9999, mouseY = -9999

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = (e.clientX - rect.left) * (W / rect.width)
      mouseY = (e.clientY - rect.top)  * (H / rect.height)
    }
    window.addEventListener('mousemove', onMove)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Nebula layer
      ctx.globalAlpha = 1
      ctx.drawImage(nebCanvas, 0, 0)

      time += 0.005
      const rot = time * 0.022  // very slow galaxy rotation

      // Bright core glow overlay
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100)
      cg.addColorStop(0,   'rgba(160,220,255,0.22)')
      cg.addColorStop(0.35,'rgba(100,180,255,0.10)')
      cg.addColorStop(0.70,'rgba(50,120,255,0.04)')
      cg.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.fillStyle = cg
      ctx.fillRect(0, 0, W, H)

      for (const p of particles) {
        // Rotate base around center
        const dx = p.baseX - cx, dy = p.baseY - cy
        const rx = cx + dx * Math.cos(rot) - dy * Math.sin(rot)
        const ry = cy + dx * Math.sin(rot) + dy * Math.cos(rot)

        // Organic drift
        p.x = rx + Math.sin(time * p.speed + p.phase)             * p.driftAmp
        p.y = ry + Math.cos(time * p.speed * 0.7 + p.phase + 1.2) * p.driftAmp * 0.6

        // Smooth mouse repulsion
        const mdx = p.x - mouseX, mdy = p.y - mouseY
        const md2 = mdx * mdx + mdy * mdy
        if (md2 < 12000) {
          const md    = Math.sqrt(md2)
          const force = (110 - md) / 110
          p.x += (mdx / md) * force * 22
          p.y += (mdy / md) * force * 22
        }

        // Twinkle
        const a = p.alpha * (0.35 + Math.sin(time * 2.8 * p.speed + p.phase) * 0.65)

        const pr = Math.round(p.r)
        const pg = Math.round(p.g)
        const pb = Math.round(p.b)

        // Halo glow (only bright zones, double-draw = cheap substitute for shadowBlur)
        if (p.zone === 'core' || p.zone === 'inner') {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 5.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${pr},${pg},${pb},${a * 0.09})`
          ctx.fill()

          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${pr},${pg},${pb},${a * 0.30})`
          ctx.fill()
        } else if (p.zone === 'mid' && a > 0.3) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${pr},${pg},${pb},${a * 0.12})`
          ctx.fill()
        }

        // Sharp star
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${pr},${pg},${pb},${Math.min(1, a)})`
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
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
