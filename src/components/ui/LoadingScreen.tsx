'use client'

import { useEffect, useRef, useState } from 'react'
import { waitForHeroVideo } from '@/lib/heroMedia'

/** Hold the bar here until the hero video is playable. */
const GATE_AT = 92
/** Never wait longer than this for the video — slow CDN must not block entry. */
const GATE_TIMEOUT_MS = 4500

const PHRASES = [
  'Initializing pipelines...',
  'Streaming data...',
  'Building systems...',
  'Crafting experience...',
]

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress]     = useState(0)
  const [phrase, setPhrase]         = useState(0)
  const [exiting, setExiting]       = useState(false)
  const [done, setDone]             = useState(false)
  const topRef    = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let n = 0

    // Cycle loading phrases
    const phraseTimer = setInterval(() => setPhrase(p => (p + 1) % PHRASES.length), 700)

    // Gate the last few percent on the hero video, so the curtain never lifts
    // onto an empty hero. Resolves early if the video is already playable.
    let gateOpen = false
    waitForHeroVideo(GATE_TIMEOUT_MS).then(() => { gateOpen = true })

    // Simulate loading progress
    const tick = () => {
      const step = n < 60 ? 1 + Math.random() * 2 : n < 85 ? 0.5 + Math.random() : 0.2 + Math.random() * 0.4
      const ceiling = gateOpen ? 100 : GATE_AT
      n = Math.min(ceiling, n + step)
      setProgress(Math.floor(n))
      if (n < 100) {
        setTimeout(tick, 18 + Math.random() * 24)
      } else {
        clearInterval(phraseTimer)
        setTimeout(() => {
          setExiting(true)
          // Curtain wipe: slide top half up, bottom half down
          if (topRef.current)    topRef.current.style.transform    = 'translateY(-100%)'
          if (bottomRef.current) bottomRef.current.style.transform = 'translateY(100%)'
          setTimeout(() => { setDone(true); onComplete() }, 900)
        }, 350)
      }
    }
    setTimeout(tick, 120)

    return () => clearInterval(phraseTimer)
  }, [onComplete])

  if (done) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        pointerEvents: exiting ? 'none' : 'auto',
      }}
    >
      {/* Top curtain half */}
      <div
        ref={topRef}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
          background: '#000',
          transition: 'transform 0.85s cubic-bezier(0.76,0,0.24,1)',
          zIndex: 2,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-end',
          paddingBottom: 2,
          overflow: 'hidden',
        }}
      >
        {/* Giant ghost number - top */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%) translateY(50%)',
          fontFamily: 'var(--font-geist-mono)',
          fontSize: 'clamp(10rem, 30vw, 22rem)',
          fontWeight: 100,
          lineHeight: 1,
          color: 'rgba(255,255,255,0.03)',
          userSelect: 'none',
          letterSpacing: '-0.06em',
          whiteSpace: 'nowrap',
        }}>
          {String(progress).padStart(3, '0')}
        </div>

        {/* Center content top half */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', paddingBottom: 40 }}>
          <p style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 10,
            letterSpacing: '0.5em',
            color: 'rgba(0,212,255,0.4)',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            Portfolio · 2026
          </p>
          <h1 style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.92)',
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            Mithran Ezhilarasan
          </h1>
        </div>
      </div>

      {/* Bottom curtain half */}
      <div
        ref={bottomRef}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
          background: '#000',
          transition: 'transform 0.85s cubic-bezier(0.76,0,0.24,1)',
          zIndex: 2,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-start',
          paddingTop: 2,
          overflow: 'hidden',
        }}
      >
        {/* Giant ghost number - bottom */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%) translateY(-50%)',
          fontFamily: 'var(--font-geist-mono)',
          fontSize: 'clamp(10rem, 30vw, 22rem)',
          fontWeight: 100,
          lineHeight: 1,
          color: 'rgba(255,255,255,0.03)',
          userSelect: 'none',
          letterSpacing: '-0.06em',
          whiteSpace: 'nowrap',
        }}>
          {String(progress).padStart(3, '0')}
        </div>

        {/* Center content bottom half */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', paddingTop: 40 }}>
          <p style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 11,
            color: 'rgba(255,255,255,0.22)',
            letterSpacing: '0.12em',
            margin: '0 0 20px',
          }}>
            {PHRASES[phrase]}
          </p>

          {/* Percentage */}
          <div style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.18)',
            letterSpacing: '0.08em',
          }}>
            {progress}%
          </div>
        </div>
      </div>

      {/* Center divider line (progress bar) */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: 0, right: 0,
        height: 1,
        zIndex: 3,
        background: 'rgba(255,255,255,0.06)',
        transform: 'translateY(-0.5px)',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(to right, #00d4ff, #87FB89, #00d4ff)',
          backgroundSize: '200% 100%',
          boxShadow: '0 0 20px rgba(0,212,255,0.7), 0 0 6px rgba(135,251,137,0.5)',
          transition: 'width 0.06s linear',
          animation: 'shimmer 1.5s linear infinite',
        }} />
        {/* Glowing dot at progress tip */}
        <div style={{
          position: 'absolute',
          right: `${100 - progress}%`,
          top: '50%',
          transform: 'translate(50%, -50%)',
          width: 8, height: 8,
          borderRadius: '50%',
          background: '#87FB89',
          boxShadow: '0 0 12px #87FB89, 0 0 24px rgba(135,251,137,0.6)',
          transition: 'right 0.06s linear',
        }} />
      </div>
    </div>
  )
}
