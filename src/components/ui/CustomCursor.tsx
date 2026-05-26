'use client'

import { useEffect, useRef } from 'react'

interface Spark {
  x: number; y: number
  vx: number; vy: number
  life: number   // 0 → 1, counts down
}

const TRAIL_LEN  = 30
const SPARK_LIFE = 0.9

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotRef    = useRef<HTMLDivElement>(null)
  const ringRef   = useRef<HTMLDivElement>(null)

  const pos     = useRef({ x: -300, y: -300 })
  const ringPos = useRef({ x: -300, y: -300 })
  const trail   = useRef<Array<{ x: number; y: number }>>([])
  const sparks  = useRef<Spark[]>([])
  const hovered = useRef(false)
  const raf     = useRef(0)
  const frame   = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    /* ── Mouse tracking ─────────────────────────────────── */
    const onMove = (e: MouseEvent) => {
      const prev = { ...pos.current }
      pos.current = { x: e.clientX, y: e.clientY }
      trail.current.push({ x: e.clientX, y: e.clientY })
      if (trail.current.length > TRAIL_LEN) trail.current.shift()

      // Emit sparks every 2 frames
      if (frame.current % 2 === 0) {
        const speed = Math.hypot(e.clientX - prev.x, e.clientY - prev.y)
        const count = Math.min(3, Math.floor(speed * 0.4))
        for (let i = 0; i < count; i++) {
          const dx = e.clientX - prev.x
          const dy = e.clientY - prev.y
          sparks.current.push({
            x: e.clientX + (Math.random() - 0.5) * 6,
            y: e.clientY + (Math.random() - 0.5) * 6,
            vx: dx * 0.15 + (Math.random() - 0.5) * 1.5,
            vy: dy * 0.15 + (Math.random() - 0.5) * 1.5,
            life: SPARK_LIFE,
          })
        }
      }
    }

    /* ── Click burst ─────────────────────────────────────── */
    const onClick = () => {
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2
        const spd = 2.5 + Math.random() * 3.5
        sparks.current.push({
          x: pos.current.x, y: pos.current.y,
          vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
          life: SPARK_LIFE + Math.random() * 0.1,
        })
      }
    }

    /* ── Hover detection ─────────────────────────────────── */
    const onEnter = (e: Event) => {
      if ((e.target as HTMLElement).closest('a,button,[data-hover],input,textarea')) {
        hovered.current = true
        if (dotRef.current)  { dotRef.current.style.background  = '#00ffcc'; dotRef.current.style.boxShadow = '0 0 12px #00ffcc, 0 0 28px #00ffcc77' }
        if (ringRef.current) { ringRef.current.style.borderColor = 'rgba(0,255,204,0.7)'; ringRef.current.style.boxShadow = '0 0 18px rgba(0,255,204,0.25)' }
      }
    }
    const onLeave = (e: Event) => {
      if ((e.target as HTMLElement).closest('a,button,[data-hover],input,textarea')) {
        hovered.current = false
        if (dotRef.current)  { dotRef.current.style.background  = '#00d4ff'; dotRef.current.style.boxShadow = '0 0 8px #00d4ff, 0 0 16px #00d4ff66' }
        if (ringRef.current) { ringRef.current.style.borderColor = 'rgba(0,212,255,0.45)'; ringRef.current.style.boxShadow = 'none' }
      }
    }
    const onDown = () => { if (dotRef.current) dotRef.current.style.transform = `translate(${pos.current.x - 3}px, ${pos.current.y - 3}px) scale(0.55)` }
    const onUp   = () => {}

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)
    window.addEventListener('click',     onClick)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout',  onLeave)

    /* ── Render loop ─────────────────────────────────────── */
    const animate = () => {
      frame.current++
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const isHover = hovered.current
      const cRGB = isHover ? '0,255,204' : '0,212,255'

      /* comet tail */
      if (trail.current.length > 2) {
        for (let i = 1; i < trail.current.length; i++) {
          const t  = i / trail.current.length          // 0=tail → 1=head
          const p0 = trail.current[i - 1]
          const p1 = trail.current[i]

          ctx.save()
          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y)
          ctx.lineTo(p1.x, p1.y)
          ctx.strokeStyle = `rgba(${cRGB},${(t * t * 0.6).toFixed(3)})`
          ctx.lineWidth   = t * 4 + 0.4
          ctx.lineCap     = 'round'
          ctx.stroke()
          ctx.restore()
        }

        // halo at head
        const h   = trail.current[trail.current.length - 1]
        const g   = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, 18)
        g.addColorStop(0,   `rgba(${cRGB},0.30)`)
        g.addColorStop(0.5, `rgba(${cRGB},0.08)`)
        g.addColorStop(1,   `rgba(${cRGB},0)`)
        ctx.save()
        ctx.beginPath()
        ctx.arc(h.x, h.y, 18, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
        ctx.restore()
      }

      /* sparks */
      sparks.current = sparks.current.filter(s => s.life > 0)
      for (const s of sparks.current) {
        s.x   += s.vx;  s.y   += s.vy
        s.vx  *= 0.92;  s.vy  *= 0.92
        s.life -= 0.045

        const a = Math.max(0, s.life / SPARK_LIFE) * 0.85
        const r = Math.max(0.3, (s.life / SPARK_LIFE) * 3.5)

        ctx.save()
        ctx.shadowColor = `rgba(${cRGB},${a * 0.7})`
        ctx.shadowBlur  = 8
        ctx.beginPath()
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${cRGB},${a})`
        ctx.fill()
        ctx.restore()
      }

      /* dot */
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`
      }

      /* ring smooth follow */
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.11
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.11
      if (ringRef.current) {
        const sz = isHover ? 54 : 32
        ringRef.current.style.transform = `translate(${ringPos.current.x - sz / 2}px, ${ringPos.current.y - sz / 2}px)`
        ringRef.current.style.width  = `${sz}px`
        ringRef.current.style.height = `${sz}px`
      }

      raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('click', onClick)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      {/* Trail canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9997 }}
      />

      {/* Core dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 8, height: 8, borderRadius: '50%',
          pointerEvents: 'none', zIndex: 9999,
          background: '#00d4ff',
          boxShadow: '0 0 8px #00d4ff, 0 0 16px #00d4ff66',
          transition: 'background 0.15s, box-shadow 0.15s',
          willChange: 'transform',
        }}
      />

      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 32, height: 32, borderRadius: '50%',
          pointerEvents: 'none', zIndex: 9998,
          border: '1px solid rgba(0,212,255,0.45)',
          backdropFilter: 'blur(1px)',
          transition: 'border-color 0.2s, box-shadow 0.2s, width 0.18s, height 0.18s',
          willChange: 'transform',
        }}
      />
    </>
  )
}
