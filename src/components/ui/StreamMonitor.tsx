'use client'

import { useEffect, useRef } from 'react'

/**
 * Animated streaming-monitor panel for the CryptoSignal case study.
 *
 * Replaces a CloudFront video that returns 403, which left the Featured Work
 * panel as an empty black box behind a "Live Preview" badge. Canvas-drawn so
 * there is no external asset to expire — and the badge is now honest.
 *
 * Only animates while on screen (same IntersectionObserver gate the <video>
 * used) so it costs nothing while scrolled away.
 */

const ASSETS = [
  { sym: 'BTC', color: '135,251,137', base: 0.62 },
  { sym: 'ETH', color: '0,212,255',   base: 0.45 },
  { sym: 'SOL', color: '167,139,250', base: 0.32 },
]

const POINTS = 130

export default function StreamMonitor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const evRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Seeded random walk per asset, plus occasional injected spikes so the
    // σ > 2.0 anomaly markers have something to catch.
    const series = ASSETS.map((a) => {
      const arr: number[] = []
      let v = a.base
      for (let i = 0; i < POINTS; i++) {
        v += (Math.random() - 0.5) * 0.035
        v = Math.max(0.08, Math.min(0.92, v))
        arr.push(v)
      }
      return arr
    })
    const anomalies: { i: number; s: number }[] = []

    let dpr = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = wrap.getBoundingClientRect()
      canvas.width = Math.max(1, Math.round(r.width * dpr))
      canvas.height = Math.max(1, Math.round(r.height * dpr))
    }
    resize()
    window.addEventListener('resize', resize)

    let raf = 0
    let running = false
    let frame = 0

    const step = () => {
      frame++
      // advance the series every few frames
      if (frame % 3 === 0) {
        series.forEach((arr, si) => {
          let next = arr[arr.length - 1] + (Math.random() - 0.5) * 0.035
          // occasional spike
          if (Math.random() < 0.012) {
            next += (Math.random() < 0.5 ? -1 : 1) * (0.1 + Math.random() * 0.12)
            anomalies.push({ i: POINTS - 1, s: si })
          }
          arr.push(Math.max(0.08, Math.min(0.92, next)))
          arr.shift()
        })
        for (let k = anomalies.length - 1; k >= 0; k--) {
          anomalies[k].i -= 1
          if (anomalies[k].i < 0) anomalies.splice(k, 1)
        }
        if (evRef.current && frame % 21 === 0) {
          evRef.current.textContent = String(13 + Math.floor(Math.random() * 5))
        }
      }

      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      const padL = 10 * dpr
      const padR = 10 * dpr
      const padT = 12 * dpr
      const padB = 14 * dpr
      const plotW = W - padL - padR
      const plotH = H - padT - padB

      // grid
      ctx.strokeStyle = 'rgba(255,255,255,0.045)'
      ctx.lineWidth = 1
      for (let g = 0; g <= 4; g++) {
        const y = padT + (plotH / 4) * g
        ctx.beginPath()
        ctx.moveTo(padL, y)
        ctx.lineTo(W - padR, y)
        ctx.stroke()
      }

      const xAt = (i: number) => padL + (plotW * i) / (POINTS - 1)
      const yAt = (v: number) => padT + plotH * (1 - v)

      series.forEach((arr, si) => {
        const c = ASSETS[si].color

        // area fill
        const grad = ctx.createLinearGradient(0, padT, 0, padT + plotH)
        grad.addColorStop(0, `rgba(${c},0.16)`)
        grad.addColorStop(1, `rgba(${c},0)`)
        ctx.beginPath()
        ctx.moveTo(xAt(0), yAt(arr[0]))
        for (let i = 1; i < arr.length; i++) ctx.lineTo(xAt(i), yAt(arr[i]))
        ctx.lineTo(xAt(arr.length - 1), padT + plotH)
        ctx.lineTo(xAt(0), padT + plotH)
        ctx.closePath()
        ctx.fillStyle = grad
        ctx.fill()

        // line
        ctx.beginPath()
        ctx.moveTo(xAt(0), yAt(arr[0]))
        for (let i = 1; i < arr.length; i++) ctx.lineTo(xAt(i), yAt(arr[i]))
        ctx.strokeStyle = `rgba(${c},0.9)`
        ctx.lineWidth = 1.6 * dpr
        ctx.lineJoin = 'round'
        ctx.shadowColor = `rgba(${c},0.55)`
        ctx.shadowBlur = 7 * dpr
        ctx.stroke()
        ctx.shadowBlur = 0

        // leading dot
        const lx = xAt(arr.length - 1)
        const ly = yAt(arr[arr.length - 1])
        ctx.beginPath()
        ctx.arc(lx, ly, 2.8 * dpr, 0, Math.PI * 2)
        ctx.fillStyle = `rgb(${c})`
        ctx.fill()
      })

      // anomaly markers
      for (const a of anomalies) {
        const arr = series[a.s]
        const c = ASSETS[a.s].color
        const x = xAt(a.i)
        const y = yAt(arr[a.i])
        ctx.beginPath()
        ctx.arc(x, y, 6 * dpr, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${c},0.75)`
        ctx.lineWidth = 1.2 * dpr
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x, padT)
        ctx.lineTo(x, padT + plotH)
        ctx.strokeStyle = `rgba(${c},0.12)`
        ctx.stroke()
      }

      raf = requestAnimationFrame(step)
    }

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) {
          running = true
          raf = requestAnimationFrame(step)
        } else if (!e.isIntersecting && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(wrap)

    return () => {
      obs.disconnect()
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'rgba(0,6,16,0.72)' }}>
      <style>{`
        @keyframes smLiveDot { 0%,100% { opacity: 0.35; transform: scale(1) } 50% { opacity: 1; transform: scale(1.35) } }
      `}</style>

      {/* title bar */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
          <span
            style={{
              width: 7, height: 7, borderRadius: '50%', background: '#87FB89',
              boxShadow: '0 0 8px #87FB89', flexShrink: 0,
              animation: 'smLiveDot 1.8s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontSize: 10.5, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis',
            }}
          >
            crypto-signal · kafka → pyspark → delta
          </span>
        </div>
        <span
          style={{
            fontSize: 10, fontFamily: 'var(--font-geist-mono)', color: 'rgba(135,251,137,0.85)',
            background: 'rgba(135,251,137,0.08)', border: '1px solid rgba(135,251,137,0.22)',
            padding: '3px 9px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          <span ref={evRef}>13</span> ev/s
        </span>
      </div>

      {/* chart */}
      <div ref={wrapRef} style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
        <span
          style={{
            position: 'absolute', top: 8, right: 12,
            fontSize: 9.5, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.16em',
            color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', pointerEvents: 'none',
          }}
        >
          5-min window · σ &gt; 2.0
        </span>
      </div>

      {/* legend */}
      <div
        style={{
          display: 'flex', gap: 18, flexWrap: 'wrap', padding: '10px 16px',
          borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)',
        }}
      >
        {ASSETS.map((a) => (
          <div key={a.sym} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 14, height: 2, borderRadius: 2, background: `rgb(${a.color})`, boxShadow: `0 0 6px rgba(${a.color},0.8)` }} />
            <span style={{ fontSize: 10.5, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em' }}>
              {a.sym}
            </span>
          </div>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 10, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.25)' }}>
          1-min OHLCV · Z-score anomalies
        </span>
      </div>
    </div>
  )
}
