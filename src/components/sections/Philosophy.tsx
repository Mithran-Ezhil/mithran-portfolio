'use client'

import { useEffect, useRef } from 'react'
import PipelineDiagram from '@/components/ui/PipelineDiagram'

const PILLARS = [
  {
    icon: '◈',
    title: 'Data as Infrastructure',
    desc: 'Every business decision deserves a reliable data backbone — engineered with the same rigor as production software.',
  },
  {
    icon: '◉',
    title: 'Intelligence at Scale',
    desc: 'Streaming pipelines, AI agents, and analytics that move at the speed of the business they serve.',
  },
  {
    icon: '◐',
    title: 'Clean by Design',
    desc: 'Automated, observable, self-healing systems that teams trust — not spreadsheets they fear.',
  },
]

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef    = useRef<HTMLDivElement>(null)
  const rightRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    import('@/lib/gsap').then(({ gsap }) => {
      gsap.fromTo(leftRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } })
      gsap.fromTo(rightRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } })
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-28 px-6 md:px-16 max-w-7xl mx-auto"
      style={{ zIndex: 1 }}
    >
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — text */}
        <div ref={leftRef} style={{ opacity: 0 }}>
          <div className="flex items-center gap-4 mb-8">
            <span className="w-8 h-px" style={{ background: 'rgba(135,251,137,0.5)' }} />
            <span className="text-xs font-mono tracking-[0.5em] uppercase" style={{ color: 'rgba(135,251,137,0.6)' }}>
              Philosophy
            </span>
          </div>

          <h2
            className="text-white mb-10 leading-tight"
            style={{
              fontFamily: 'var(--font-instrument-serif)',
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              fontStyle: 'italic',
            }}
          >
            Innovation{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #87FB89, #00ffcc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ×
            </span>{' '}
            Vision
          </h2>

          <div className="space-y-6">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="flex gap-5 p-5 rounded-2xl transition-all duration-300 hover:bg-white/[0.03] group cursor-default"
                style={{ border: '0.5px solid rgba(255,255,255,0.06)' }}
              >
                <span
                  className="text-xl mt-0.5 shrink-0 transition-colors duration-300 group-hover:text-[#87FB89]"
                  style={{ color: 'rgba(135,251,137,0.5)' }}
                >
                  {p.icon}
                </span>
                <div>
                  <h4
                    className="text-white text-sm font-semibold mb-2 group-hover:text-[#87FB89] transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-geist-sans)' }}
                  >
                    {p.title}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — reference pipeline.
            Was a CloudFront <video> that now 403s, leaving an empty black 4/5
            box. Replaced with a self-contained diagram so there is no external
            asset to expire. */}
        <div ref={rightRef} className="relative" style={{ opacity: 0 }}>
          <PipelineDiagram />

          {/* Floating stat pill */}
          <div
            className="absolute -bottom-6 -left-6 liquid-glass rounded-2xl p-5"
            style={{ minWidth: 160 }}
          >
            <div
              className="text-3xl font-bold mb-1"
              style={{
                background: 'linear-gradient(135deg, #87FB89, #00ffcc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'var(--font-geist-sans)',
              }}
            >
              100K+
            </div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Records migrated
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
