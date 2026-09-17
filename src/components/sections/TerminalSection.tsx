'use client'

import { useEffect, useRef } from 'react'

const LINES = [
  { delay: 0,    text: '~/mithran $ run showcase --all', type: 'cmd' },
  { delay: 600,  text: '', type: 'blank' },
  { delay: 800,  text: '✓ streaming-platform    1M+ events/sec · Apache Kafka + PySpark', type: 'success' },
  { delay: 1400, text: '✓ ml-pipeline           40% latency reduction · Delta Lake', type: 'success' },
  { delay: 1900, text: '✓ ai-agent-fleet        6 LangChain agents deployed · Oracle ERP', type: 'success' },
  { delay: 2400, text: '✓ data-warehouse        100K+ records migrated · zero data loss', type: 'success' },
  { delay: 2900, text: '', type: 'blank' },
  { delay: 3100, text: '[4/4] All systems operational ■', type: 'done' },
]

export default function TerminalSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const started      = useRef(false)
  const linesRef     = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          revealLines()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  function revealLines() {
    LINES.forEach((line, i) => {
      const el = linesRef.current[i]
      if (!el) return
      setTimeout(() => {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
        // typewriter for non-blank lines
        if (line.type !== 'blank') {
          typewrite(el, line.text)
        }
      }, line.delay)
    })
  }

  function typewrite(el: HTMLDivElement, text: string) {
    let i = 0
    el.textContent = ''
    const cursor = document.createElement('span')
    cursor.textContent = '█'
    cursor.style.opacity = '1'
    cursor.style.animation = 'termBlink 0.8s steps(1) infinite'
    el.appendChild(cursor)

    const interval = setInterval(() => {
      el.insertBefore(document.createTextNode(text[i] ?? ''), cursor)
      i++
      if (i >= text.length) {
        clearInterval(interval)
        // remove cursor after last line
        if (text.includes('[4/4]')) {
          setTimeout(() => {
            cursor.style.animation = 'none'
            cursor.style.opacity = '1'
          }, 400)
        } else {
          setTimeout(() => cursor.remove(), 800)
        }
      }
    }, 22)
  }

  return (
    <div
      ref={containerRef}
      style={{
        padding: '0 6vw 80px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {/* Terminal window */}
      <div
        style={{
          width: '100%',
          maxWidth: 780,
          borderRadius: 16,
          background: 'rgba(5,5,15,0.92)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          boxShadow:
            '0 0 0 0.5px rgba(255,255,255,0.06), 0 40px 100px rgba(0,0,0,0.7), 0 0 80px rgba(0,212,255,0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.025)',
          }}
        >
          {/* Traffic lights */}
          {(['#FF5F57','#FEBC2E','#28C840'] as const).map((c, i) => (
            <span key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c, display: 'block', opacity: 0.85 }} />
          ))}
          <span style={{
            flex: 1, textAlign: 'center',
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 12,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.06em',
            marginLeft: -36, // optical center
          }}>
            mithran — pipeline-showcase — zsh
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px 28px', minHeight: 220 }}>
          {LINES.map((line, i) => (
            <div
              key={i}
              ref={el => { linesRef.current[i] = el }}
              style={{
                opacity: 0,
                transform: 'translateY(6px)',
                transition: 'opacity 0.25s ease, transform 0.25s ease',
                minHeight: line.type === 'blank' ? 10 : 24,
                marginBottom: line.type === 'blank' ? 4 : 2,
                fontFamily: 'var(--font-geist-mono)',
                fontSize: 13,
                lineHeight: 1.7,
                color:
                  line.type === 'cmd'     ? 'rgba(255,255,255,0.85)' :
                  line.type === 'success' ? '#87FB89'                :
                  line.type === 'done'    ? '#00d4ff'                :
                  'transparent',
                whiteSpace: 'pre',
                letterSpacing: '0.02em',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
