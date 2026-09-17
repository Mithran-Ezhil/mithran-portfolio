'use client'

import { useEffect, useRef } from 'react'
import StreamMonitor from '@/components/ui/StreamMonitor'

export default function FeaturedVideo() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef    = useRef<HTMLDivElement>(null)
  const textRef    = useRef<HTMLDivElement>(null)

  /* ── GSAP scroll reveal ──────────────────────────────────────────── */
  useEffect(() => {
    import('@/lib/gsap').then(({ gsap }) => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 60, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: cardRef.current, start: 'top 80%' },
        }
      )
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: textRef.current, start: 'top 80%' },
        }
      )
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-28 px-6 md:px-16 max-w-7xl mx-auto"
      style={{ zIndex: 1 }}
    >
      {/* Section label */}
      <div className="flex items-center gap-4 mb-16">
        <span className="w-8 h-px" style={{ background: 'rgba(135,251,137,0.5)' }} />
        <span className="text-xs font-mono tracking-[0.5em] uppercase" style={{ color: 'rgba(135,251,137,0.6)' }}>
          Featured Work
        </span>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-center">
        {/* Video container */}
        <div
          ref={cardRef}
          className="relative rounded-3xl overflow-hidden video-glow"
          style={{ opacity: 0, aspectRatio: '16/9' }}
        >
          {/* Was a CloudFront <video> that now 403s, leaving an empty box
              behind the "Live Preview" badge. Canvas-drawn monitor instead, so
              there is no external asset to expire. */}
          <StreamMonitor />
          {/* Corner label */}
          <div className="absolute top-5 left-5" style={{ zIndex: 2 }}>
            <span
              className="text-[10px] font-mono tracking-[0.4em] uppercase px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(0,0,0,0.6)',
                color: 'rgba(135,251,137,0.8)',
                backdropFilter: 'blur(8px)',
                border: '0.5px solid rgba(135,251,137,0.2)',
              }}
            >
              Live Preview
            </span>
          </div>
        </div>

        {/* Text card */}
        <div ref={textRef} className="liquid-glass rounded-2xl p-8" style={{ opacity: 0 }}>
          <div
            className="text-[10px] font-mono tracking-[0.4em] uppercase mb-4"
            style={{ color: 'rgba(135,251,137,0.6)' }}
          >
            Case Study
          </div>
          <h3
            className="text-white mb-5 leading-tight"
            style={{
              fontFamily: 'var(--font-instrument-serif)',
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontStyle: 'italic',
            }}
          >
            Real-time Crypto Signal Pipeline
          </h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            End-to-end streaming system ingesting 13+ market events/sec through
            Kafka → PySpark → Delta Lake, with live Grafana dashboards and automated
            signal generation.
          </p>
          <div className="flex flex-wrap gap-2 mb-7">
            {['Kafka', 'PySpark', 'Delta Lake', 'Grafana'].map(t => (
              <span
                key={t}
                className="text-[11px] font-mono px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(135,251,137,0.06)',
                  color: 'rgba(135,251,137,0.7)',
                  border: '0.5px solid rgba(135,251,137,0.15)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <a
            href="#projects"
            className="flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:gap-3"
            style={{ color: '#87FB89' }}
          >
            View all projects
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
