'use client'

import { useEffect, useRef } from 'react'

// Replace with your actual CloudFront video URLs
const VIDEO_1 = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_4a2205b7-b061-490a-852b-92d9e9955ce9.mp4'
const VIDEO_2 = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_4a2205b7-b061-490a-852b-92d9e9955ce9.mp4'

interface ServiceCard {
  video: string
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  tags: string[]
}

const SERVICES: ServiceCard[] = [
  {
    video: VIDEO_1,
    eyebrow: 'Data Engineering',
    title: 'Pipeline Architecture',
    description: 'End-to-end streaming and batch pipelines built for reliability, observability, and scale.',
    bullets: [
      'Kafka + PySpark real-time ingestion',
      'dbt + Snowflake / Delta Lake warehousing',
      'Airflow DAG orchestration',
      'Data quality & lineage tracking',
    ],
    tags: ['Kafka', 'Spark', 'dbt', 'Airflow'],
  },
  {
    video: VIDEO_2,
    eyebrow: 'AI Systems',
    title: 'Intelligent Data Agents',
    description: 'Multi-agent AI systems that query, interpret, and automate complex data workflows over enterprise APIs.',
    bullets: [
      '6-agent NLP over Oracle ERP APIs',
      'LangChain ReAct reasoning loops',
      'Automated report generation',
      'RAG-powered analytics assistants',
    ],
    tags: ['LangChain', 'Python', 'Oracle', 'LLMs'],
  },
]

function ServiceCard({ card, index }: { card: ServiceCard; index: number }) {
  const videoRef  = useRef<HTMLVideoElement>(null)
  const cardRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { video.play().catch(() => {}) } else { video.pause() } },
      { threshold: 0.3 }
    )
    obs.observe(video)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    import('@/lib/gsap').then(({ gsap }) => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          delay: index * 0.15,
          scrollTrigger: { trigger: cardRef.current, start: 'top 82%' },
        }
      )
    })
  }, [index])

  return (
    <div
      ref={cardRef}
      className="liquid-glass rounded-3xl overflow-hidden group transition-all duration-500 hover:scale-[1.02]"
      style={{ opacity: 0 }}
    >
      {/* Video area */}
      <div className="relative overflow-hidden" style={{ height: 260 }}>
        <video
          ref={videoRef}
          src={card.video}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
          }}
        />
        {/* Eyebrow */}
        <div className="absolute top-5 left-5">
          <span
            className="text-[10px] font-mono tracking-[0.4em] uppercase px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.55)',
              color: 'rgba(135,251,137,0.85)',
              backdropFilter: 'blur(8px)',
              border: '0.5px solid rgba(135,251,137,0.2)',
            }}
          >
            {card.eyebrow}
          </span>
        </div>
      </div>

      {/* Text content */}
      <div className="p-8">
        <h3
          className="text-white mb-3 leading-tight"
          style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontSize: '1.75rem',
            fontStyle: 'italic',
          }}
        >
          {card.title}
        </h3>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.50)' }}>
          {card.description}
        </p>

        {/* Bullets */}
        <ul className="space-y-2.5 mb-7">
          {card.bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.60)' }}>
              <span style={{ color: '#87FB89', marginTop: 2 }}>◆</span>
              {b}
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-5" style={{ borderTop: '0.5px solid rgba(255,255,255,0.07)' }}>
          {card.tags.map((t) => (
            <span
              key={t}
              className="text-[11px] font-mono px-3 py-1 rounded-full"
              style={{
                background: 'rgba(135,251,137,0.06)',
                color: 'rgba(135,251,137,0.65)',
                border: '0.5px solid rgba(135,251,137,0.12)',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    import('@/lib/gsap').then(({ gsap }) => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 80%' } }
      )
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-28 px-6 md:px-16 max-w-7xl mx-auto"
      style={{ zIndex: 1 }}
    >
      {/* Header */}
      <div ref={headerRef} className="mb-16" style={{ opacity: 0 }}>
        <div className="flex items-center gap-4 mb-5">
          <span className="w-8 h-px" style={{ background: 'rgba(135,251,137,0.5)' }} />
          <span className="text-xs font-mono tracking-[0.5em] uppercase" style={{ color: 'rgba(135,251,137,0.6)' }}>
            What I Build
          </span>
        </div>
        <h2
          className="text-white leading-tight"
          style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontStyle: 'italic',
          }}
        >
          From raw data to{' '}
          <span
            style={{
              background: 'linear-gradient(90deg, #87FB89, #00ffcc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            intelligent systems.
          </span>
        </h2>
      </div>

      {/* Cards grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {SERVICES.map((card, i) => (
          <ServiceCard key={card.title} card={card} index={i} />
        ))}
      </div>
    </section>
  )
}
