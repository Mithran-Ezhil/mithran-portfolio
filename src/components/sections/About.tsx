'use client'

import { useEffect, useRef } from 'react'
import { SECTION_IDS } from '@/lib/constants'
import SkillsGrid from '@/components/ui/SkillsGrid'

const STATS = [
  { value: '100K+', label: 'Records migrated' },
  { value: '70%',   label: 'Processing time cut' },
  { value: '13+',   label: 'Events/sec streaming' },
  { value: '3.62',  label: 'GPA @ Northeastern' },
]


export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    import('@/lib/gsap').then(({ gsap }) => {
      // Stat counters
      sectionRef.current?.querySelectorAll('.stat-num').forEach((el) => {
        const target = parseFloat((el as HTMLElement).dataset.val ?? '0')
        const isFloat = target % 1 !== 0
        const counter = { v: 0 }
        gsap.to(counter, {
          v: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate() {
            el.textContent = isFloat
              ? counter.v.toFixed(2)
              : Math.round(counter.v).toLocaleString() + (String(target).includes('+') ? '+' : '')
          },
        })
      })

      // Reveal animations
      gsap.fromTo(
        sectionRef.current?.querySelectorAll('.reveal-up') ?? [],
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
    })
  }, [])

  return (
    <section
      id={SECTION_IDS.about}
      ref={sectionRef}
      data-section="about"
      className="relative py-32 px-8 md:px-16 max-w-7xl mx-auto"
      style={{ zIndex: 1 }}
    >
      {/* Section header */}
      <div className="mb-20 reveal-up">
        <div className="flex items-center gap-4 mb-5">
          <span className="w-8 h-px bg-accent/60" />
          <span className="text-xs font-mono tracking-[0.5em] text-accent/70 uppercase">About</span>
        </div>
        <h2
          className="font-bold tracking-tight text-white"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontFamily: 'var(--font-geist-sans)' }}
        >
          Building systems that{' '}
          <span style={{
            background: 'linear-gradient(90deg, #00d4ff, #00ffcc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            scale.
          </span>
        </h2>
      </div>

      <div className="grid lg:grid-cols-[420px_1fr] gap-16 items-start">
        {/* Left: Bio + stats */}
        <div>
          <div className="space-y-5 mb-14 reveal-up">
            <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
              I&apos;m a Data Engineer pursuing my{' '}
              <span className="text-white font-medium">MS in Information Systems at Northeastern University</span>{' '}
              (GPA 3.62), building production-grade data systems that move, transform, and make sense of large-scale data.
            </p>
            <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              From streaming pipelines ingesting <span className="text-accent">13+ events/sec</span> with Kafka and PySpark,
              to 6-agent AI systems over Oracle ERP APIs — I turn complex data challenges into clean, automated solutions.
            </p>
            <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Currently open to Data Engineering, Analytics Engineering, and Data Platform roles starting May 2026.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 reveal-up">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="p-6 rounded-2xl border"
                style={{
                  background: 'rgba(0,212,255,0.04)',
                  borderColor: 'rgba(0,212,255,0.12)',
                }}
              >
                <div
                  className="stat-num text-3xl font-bold mb-1"
                  data-val={s.value.replace(/[^0-9.]/g, '')}
                  style={{
                    background: 'linear-gradient(135deg, #00d4ff, #00ffcc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {s.value}
                </div>
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Skills bento grid */}
        <div className="reveal-up">
          <SkillsGrid />
        </div>
      </div>
    </section>
  )
}
