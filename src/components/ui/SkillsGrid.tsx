'use client'

import { useEffect, useRef } from 'react'

interface SkillCategory {
  icon:   string
  label:  string
  color:  string
  glow:   string
  skills: string[]
}

const CATEGORIES: SkillCategory[] = [
  {
    icon: '⚡',
    label: 'Data Streaming',
    color: 'rgba(0,212,255,0.08)',
    glow:  'rgba(0,212,255,0.3)',
    skills: ['Apache Kafka', 'PySpark', 'Spark Streaming', 'Delta Lake', 'Event Sourcing'],
  },
  {
    icon: '🏗️',
    label: 'Data Engineering',
    color: 'rgba(135,251,137,0.07)',
    glow:  'rgba(135,251,137,0.28)',
    skills: ['dbt', 'Airflow', 'Snowflake', 'PostgreSQL', 'Data Modeling'],
  },
  {
    icon: '☁️',
    label: 'Cloud & Platform',
    color: 'rgba(56,189,248,0.07)',
    glow:  'rgba(56,189,248,0.28)',
    skills: ['AWS S3', 'Databricks', 'Docker', 'Glue', 'Lambda'],
  },
  {
    icon: '🤖',
    label: 'AI Systems',
    color: 'rgba(167,139,250,0.08)',
    glow:  'rgba(167,139,250,0.3)',
    skills: ['LangChain', 'ReAct Agents', 'LLMs', 'Oracle ERP APIs', 'RAG'],
  },
  {
    icon: '📊',
    label: 'Analytics & BI',
    color: 'rgba(251,146,60,0.07)',
    glow:  'rgba(251,146,60,0.28)',
    skills: ['Power BI', 'Grafana', 'Tableau', 'SQL Analytics', 'dbt Metrics'],
  },
  {
    icon: '🐍',
    label: 'Languages',
    color: 'rgba(52,211,153,0.07)',
    glow:  'rgba(52,211,153,0.28)',
    skills: ['Python', 'SQL', 'R', 'Scala', 'Bash'],
  },
]

function Card({ cat, delay }: { cat: SkillCategory; delay: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    import('@/lib/gsap').then(({ gsap }) => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          delay,
          scrollTrigger: { trigger: cardRef.current, start: 'top 88%' },
        }
      )
    })
  }, [delay])

  return (
    <div
      ref={cardRef}
      className="group relative rounded-2xl p-6 cursor-default transition-all duration-500 hover:-translate-y-1"
      style={{
        opacity: 0,
        background: cat.color,
        border: '0.5px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.boxShadow = `0 0 40px ${cat.glow}, 0 8px 32px rgba(0,0,0,0.4)`
        el.style.borderColor = cat.glow.replace('0.28)', '0.25)').replace('0.3)', '0.25)')
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.boxShadow = ''
        el.style.borderColor = 'rgba(255,255,255,0.07)'
      }}
    >
      {/* Icon + label */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{cat.icon}</span>
        <span
          className="text-xs font-mono tracking-[0.3em] uppercase font-medium"
          style={{ color: cat.glow }}
        >
          {cat.label}
        </span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {cat.skills.map(s => (
          <span
            key={s}
            className="text-[11px] font-mono px-2.5 py-1 rounded-full transition-all duration-200 group-hover:brightness-125"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.55)',
              border: '0.5px solid rgba(255,255,255,0.08)',
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function SkillsGrid() {
  const headRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    import('@/lib/gsap').then(({ gsap }) => {
      gsap.fromTo(
        headRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headRef.current, start: 'top 85%' } }
      )
    })
  }, [])

  return (
    <div>
      {/* Header */}
      <div ref={headRef} className="mb-12" style={{ opacity: 0 }}>
        <div className="flex items-center gap-4 mb-4">
          <span className="w-8 h-px bg-accent/60" />
          <span className="text-xs font-mono tracking-[0.5em] text-accent/70 uppercase">Tech Stack</span>
        </div>
        <h3
          className="text-white leading-tight"
          style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontStyle: 'italic',
          }}
        >
          Tools I build with,{' '}
          <span
            style={{
              background: 'linear-gradient(90deg, #87FB89, #00d4ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            every day.
          </span>
        </h3>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat, i) => (
          <Card key={cat.label} cat={cat} delay={i * 0.08} />
        ))}
      </div>
    </div>
  )
}
