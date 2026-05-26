'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number; y: number; r: number
  phase: number; speed: number; opacity: number
}

interface Meteor {
  x: number; y: number; vx: number; vy: number
  life: number; maxLife: number; active: boolean
}

export default function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width  = W
    canvas.height = H

    const onResize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width  = W
      canvas.height = H
      initStars()
    }
    window.addEventListener('resize', onResize)

    let stars: Star[] = []
    const meteors: Meteor[] = Array.from({ length: 3 }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, active: false,
    }))

    const initStars = () => {
      stars = Array.from({ length: 280 }, () => ({
        x:       Math.random() * W,
        y:       Math.random() * H,
        r:       0.2 + Math.random() * 1.1,
        phase:   Math.random() * Math.PI * 2,
        speed:   0.3 + Math.random() * 0.9,
        opacity: 0.2 + Math.random() * 0.6,
      }))
    }
    initStars()

    const spawnMeteor = (m: Meteor) => {
      const edge = Math.random()
      m.x = edge < 0.5 ? Math.random() * W : 0
      m.y = edge < 0.5 ? 0 : Math.random() * H * 0.5
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.4
      const speed = 4 + Math.random() * 6
      m.vx = Math.cos(angle) * speed
      m.vy = Math.sin(angle) * speed
      m.maxLife = 40 + Math.random() * 40
      m.life = m.maxLife
      m.active = true
    }

    let t = 0
    let meteorTimer = 0
    let raf: number
    let lastFPS = 0

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)

      // Cap at 40fps to save CPU
      if (now - lastFPS < 25) return
      lastFPS = now

      ctx.clearRect(0, 0, W, H)
      t += 0.012

      // Stars
      stars.forEach(s => {
        const a = s.opacity * (0.65 + Math.sin(t * s.speed + s.phase) * 0.35)
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,225,255,${a.toFixed(2)})`
        ctx.fill()
      })

      // Meteors
      meteorTimer++
      if (meteorTimer > 220) {
        meteorTimer = 0
        const idle = meteors.find(m => !m.active)
        if (idle) spawnMeteor(idle)
      }

      meteors.forEach(m => {
        if (!m.active) return
        m.x += m.vx
        m.y += m.vy
        m.life--
        if (m.life <= 0 || m.x > W + 50 || m.y > H + 50) { m.active = false; return }

        const progress = m.life / m.maxLife
        const tailLen  = 60 + (1 - progress) * 80
        const alpha    = progress * 0.55

        const grad = ctx.createLinearGradient(
          m.x, m.y,
          m.x - m.vx * (tailLen / Math.sqrt(m.vx * m.vx + m.vy * m.vy)),
          m.y - m.vy * (tailLen / Math.sqrt(m.vx * m.vx + m.vy * m.vy)),
        )
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`)
        grad.addColorStop(0.3, `rgba(150,220,255,${alpha * 0.6})`)
        grad.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.beginPath()
        ctx.moveTo(m.x, m.y)
        ctx.lineTo(
          m.x - m.vx * (tailLen / Math.sqrt(m.vx * m.vx + m.vy * m.vy)) * 4,
          m.y - m.vy * (tailLen / Math.sqrt(m.vx * m.vx + m.vy * m.vy)) * 4,
        )
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.2
        ctx.stroke()
      })
    }

    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.85,
      }}
    />
  )
}
