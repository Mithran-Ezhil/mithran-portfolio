'use client'

import { useEffect, useRef } from 'react'

interface Props {
  colorRgb?: string   // e.g. "0,212,255"
  label?: string
}

export default function SectionDivider({
  colorRgb = '0,212,255',
  label,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.offsetWidth || 600
    const H = 80
    canvas.width  = W
    canvas.height = H

    const [r, g, b] = colorRgb.split(',').map(Number)
    const midY = H / 2

    // Flowing spark particles along the line
    type Spark = { x: number; speed: number; size: number; alpha: number }
    const sparks: Spark[] = Array.from({ length: 14 }, () => ({
      x:     Math.random() * W,
      speed: 0.4 + Math.random() * 1.2,
      size:  1.0 + Math.random() * 1.5,
      alpha: 0.3 + Math.random() * 0.7,
    }))

    let time = 0, raf = 0

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      time += 0.016

      // Static glowing line
      const lineGrad = ctx.createLinearGradient(0, 0, W, 0)
      lineGrad.addColorStop(0,    'rgba(0,0,0,0)')
      lineGrad.addColorStop(0.15, `rgba(${r},${g},${b},0.18)`)
      lineGrad.addColorStop(0.50, `rgba(${r},${g},${b},0.55)`)
      lineGrad.addColorStop(0.85, `rgba(${r},${g},${b},0.18)`)
      lineGrad.addColorStop(1,    'rgba(0,0,0,0)')
      ctx.strokeStyle = lineGrad
      ctx.lineWidth   = 1
      ctx.beginPath()
      ctx.moveTo(0,   midY)
      ctx.lineTo(W,   midY)
      ctx.stroke()

      // Centre glow orb
      const pulse = 0.8 + Math.sin(time * 2.2) * 0.2
      const orb = ctx.createRadialGradient(W / 2, midY, 0, W / 2, midY, 24 * pulse)
      orb.addColorStop(0,    `rgba(${r},${g},${b},0.55)`)
      orb.addColorStop(0.4,  `rgba(${r},${g},${b},0.18)`)
      orb.addColorStop(1,    'rgba(0,0,0,0)')
      ctx.fillStyle = orb
      ctx.fillRect(W / 2 - 30, midY - 30, 60, 60)

      // Centre diamond
      ctx.save()
      ctx.translate(W / 2, midY)
      ctx.rotate(Math.PI / 4 + time * 0.4)
      ctx.scale(pulse, pulse)
      ctx.fillStyle = `rgba(${r},${g},${b},0.9)`
      ctx.fillRect(-3, -3, 6, 6)
      ctx.restore()

      // Moving sparks
      for (const sp of sparks) {
        sp.x += sp.speed
        if (sp.x > W + 10) sp.x = -10

        const distFromCenter = Math.abs(sp.x - W / 2)
        const fade = Math.max(0, 1 - distFromCenter / (W * 0.42))
        const a    = sp.alpha * fade * (0.5 + Math.sin(time * 3 + sp.x * 0.01) * 0.5)

        // Spark trail
        const trailGrad = ctx.createLinearGradient(sp.x - 12, midY, sp.x, midY)
        trailGrad.addColorStop(0, 'rgba(0,0,0,0)')
        trailGrad.addColorStop(1, `rgba(${r},${g},${b},${a * 0.6})`)
        ctx.strokeStyle = trailGrad
        ctx.lineWidth   = sp.size * 0.6
        ctx.beginPath()
        ctx.moveTo(sp.x - 12, midY)
        ctx.lineTo(sp.x,      midY)
        ctx.stroke()

        // Spark head
        ctx.beginPath()
        ctx.arc(sp.x, midY, sp.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`
        ctx.fill()
      }

      // Side accent dots
      for (let side = 0; side < 2; side++) {
        const dotX   = side === 0 ? W * 0.25 : W * 0.75
        const dotPulse = 0.5 + Math.sin(time * 1.8 + side * Math.PI) * 0.5
        ctx.beginPath()
        ctx.arc(dotX, midY, 2 * dotPulse, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${0.25 * dotPulse})`
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => cancelAnimationFrame(raf)
  }, [colorRgb])

  return (
    <div style={{ position: 'relative', zIndex: 2, overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 80, display: 'block' }}
      />
      {label && (
        <div style={{
          position:   'absolute',
          top:        '50%',
          left:       '50%',
          transform:  'translate(-50%, 18px)',
          fontSize:   10,
          fontFamily: 'var(--font-geist-mono)',
          letterSpacing: '0.35em',
          color:      `rgba(${colorRgb},0.45)`,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          {label.toUpperCase()}
        </div>
      )}
    </div>
  )
}
