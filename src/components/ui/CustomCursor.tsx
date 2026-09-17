'use client'

import { useEffect, useRef } from 'react'

interface Ripple { x: number; y: number; r: number; alpha: number }

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const pos       = { x: -300, y: -300 }
    const smooth    = { x: -300, y: -300 }
    let rotation    = 0
    let hovered     = false
    const ripples: Ripple[] = []
    let raf         = 0

    const onMove = (e: MouseEvent) => { pos.x = e.clientX; pos.y = e.clientY }

    const onClick = () => {
      ripples.push({ x: pos.x, y: pos.y, r: 4, alpha: 0.9 })
      ripples.push({ x: pos.x, y: pos.y, r: 4, alpha: 0.55 })
    }

    const onEnter = (e: Event) => {
      if ((e.target as HTMLElement).closest('a,button,[data-hover],input,textarea'))
        hovered = true
    }
    const onLeave = (e: Event) => {
      if ((e.target as HTMLElement).closest('a,button,[data-hover],input,textarea'))
        hovered = false
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('click', onClick)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout',  onLeave)

    /** Draw 4 corner bracket "L" shapes centred on (cx,cy), rotated by `rot` */
    function drawBrackets(
      cx: number, cy: number,
      size: number, rot: number,
      rgb: string, alpha: number,
      lineWidth = 1.5,
    ) {
      const r   = size / 2
      const arm = size * 0.32
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rot)
      ctx.strokeStyle = `rgba(${rgb},${alpha})`
      ctx.lineWidth   = lineWidth
      ctx.lineCap     = 'square'

      // top-left
      ctx.beginPath(); ctx.moveTo(-r + arm, -r); ctx.lineTo(-r, -r); ctx.lineTo(-r, -r + arm); ctx.stroke()
      // top-right
      ctx.beginPath(); ctx.moveTo( r - arm, -r); ctx.lineTo( r, -r); ctx.lineTo( r, -r + arm); ctx.stroke()
      // bottom-right
      ctx.beginPath(); ctx.moveTo( r - arm,  r); ctx.lineTo( r,  r); ctx.lineTo( r,  r - arm); ctx.stroke()
      // bottom-left
      ctx.beginPath(); ctx.moveTo(-r + arm,  r); ctx.lineTo(-r,  r); ctx.lineTo(-r,  r - arm); ctx.stroke()

      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const easing = hovered ? 0.18 : 0.10
      smooth.x += (pos.x - smooth.x) * easing
      smooth.y += (pos.y - smooth.y) * easing

      rotation += hovered ? 0.018 : 0.006

      const cRGB        = hovered ? '135,251,137' : '0,212,255'
      const bracketSize = hovered ? 26 : 36
      const bracketAlpha = hovered ? 0.95 : 0.65

      /* ── center dot (snaps instantly) ── */
      ctx.save()
      ctx.shadowColor = `rgba(${cRGB},0.9)`
      ctx.shadowBlur  = 10
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, hovered ? 2 : 2.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${cRGB},1)`
      ctx.fill()
      ctx.restore()

      /* ── outer bracket reticle (lagged) ── */
      // glow pass
      drawBrackets(smooth.x, smooth.y, bracketSize + 4, rotation, cRGB, bracketAlpha * 0.2, 4)
      // crisp pass
      drawBrackets(smooth.x, smooth.y, bracketSize, rotation, cRGB, bracketAlpha, 1.5)

      /* ── center crosshair lines (tiny, very subtle) ── */
      ctx.save()
      ctx.strokeStyle = `rgba(${cRGB},0.18)`
      ctx.lineWidth   = 0.8
      const cross = bracketSize * 0.22
      ctx.beginPath(); ctx.moveTo(smooth.x - cross, smooth.y); ctx.lineTo(smooth.x + cross, smooth.y); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(smooth.x, smooth.y - cross); ctx.lineTo(smooth.x, smooth.y + cross); ctx.stroke()
      ctx.restore()

      /* ── ripple rings on click ── */
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]
        rp.r     += 3.5
        rp.alpha -= 0.028
        if (rp.alpha <= 0) { ripples.splice(i, 1); continue }
        ctx.save()
        ctx.beginPath()
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${cRGB},${rp.alpha})`
        ctx.lineWidth   = 1.2
        ctx.stroke()
        ctx.restore()
      }

      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout',  onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        pointerEvents: 'none', zIndex: 9999,
      }}
    />
  )
}
