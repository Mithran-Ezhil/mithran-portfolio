'use client'

import { useEffect, useRef } from 'react'
import { SECTION_IDS } from '@/lib/constants'
import ParticleCloud from '@/components/ui/ParticleCloud'

const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260309_042944_4a2205b7-b061-490a-852b-92d9e9955ce9.mp4'

const ROLES = ['Data Engineer', 'Data Analyst', 'Innovator', 'AI Builder', 'Pipeline Architect']

const SKILLS_MARQUEE = [
  'Apache Kafka', 'PySpark', 'dbt', 'Snowflake', 'Airflow', 'Databricks',
  'Delta Lake', 'PostgreSQL', 'AWS S3', 'Docker', 'Python', 'SQL',
  'Power BI', 'Grafana', 'Oracle ERP', 'LangChain',
]

export default function Hero() {
  const videoRef    = useRef<HTMLVideoElement>(null)
  const fadeAnimRef = useRef<number>(0)
  const badgeRef    = useRef<HTMLDivElement>(null)
  const nameRef     = useRef<HTMLDivElement>(null)
  const roleLineRef = useRef<HTMLDivElement>(null)
  const roleRef     = useRef<HTMLSpanElement>(null)
  const tagRef      = useRef<HTMLParagraphElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)
  const marqueeRef  = useRef<HTMLDivElement>(null)
  const particleRef = useRef<HTMLDivElement>(null)

  /* ── Video fade ── */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const FADE_IN = 900, FADE_OUT = 0.6
    const onPlay = () => {
      video.style.opacity = '0'
      let t0: number | null = null
      const fi = (t: number) => {
        if (!t0) t0 = t
        const p = Math.min((t - t0) / FADE_IN, 1)
        video.style.opacity = String(p * 0.6) // max 60% opacity so particles show through
        if (p < 1) fadeAnimRef.current = requestAnimationFrame(fi)
      }
      cancelAnimationFrame(fadeAnimRef.current)
      fadeAnimRef.current = requestAnimationFrame(fi)
    }
    const onTime = () => {
      const rem = video.duration - video.currentTime
      if (rem < FADE_OUT && rem > 0) video.style.opacity = String((rem / FADE_OUT) * 0.6)
    }
    video.addEventListener('canplay', onPlay)
    video.addEventListener('timeupdate', onTime)
    return () => {
      video.removeEventListener('canplay', onPlay)
      video.removeEventListener('timeupdate', onTime)
      cancelAnimationFrame(fadeAnimRef.current)
    }
  }, [])

  /* ── Typewriter ── */
  useEffect(() => {
    let idx = 0, chars = 0, del = false
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      const word = ROLES[idx]
      if (!roleRef.current) return
      if (!del) {
        roleRef.current.textContent = word.slice(0, chars + 1)
        chars++
        if (chars === word.length) { del = true; timer = setTimeout(tick, 2000); return }
      } else {
        roleRef.current.textContent = word.slice(0, chars - 1)
        chars--
        if (chars === 0) { del = false; idx = (idx + 1) % ROLES.length }
      }
      timer = setTimeout(tick, del ? 38 : 72)
    }
    const start = setTimeout(() => tick(), 1600)
    return () => { clearTimeout(timer); clearTimeout(start) }
  }, [])

  /* ── GSAP entrance ── */
  useEffect(() => {
    import('@/lib/gsap').then(({ gsap }) => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl
        .fromTo(particleRef.current, { opacity: 0 }, { opacity: 1, duration: 1.6, ease: 'power2.out' }, 0)
        .fromTo(badgeRef.current,    { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.4)
        .fromTo(nameRef.current,     { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 1.0 }, 0.6)
        .fromTo(roleLineRef.current, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.8 }, 0.9)
        .fromTo(tagRef.current,      { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, 1.1)
        .fromTo(ctaRef.current?.children ?? [], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 1.25)
        .fromTo(marqueeRef.current,  { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.6)
    })
  }, [])

  const doubled = [...SKILLS_MARQUEE, ...SKILLS_MARQUEE]

  return (
    <section
      id={SECTION_IDS.hero}
      style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1 }}
    >
      {/* ── Video bg ── */}
      <video
        ref={videoRef}
        src={HERO_VIDEO}
        autoPlay muted loop playsInline
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0, zIndex: 1, pointerEvents: 'none' }}
      />

      {/* ── Dark gradient overlays ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.10) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.95) 100%)' }} />

      {/* ── PARTICLE CLOUD — always visible, right side, absolute ── */}
      <div
        ref={particleRef}
        style={{
          position: 'absolute',
          top: 0, right: 0,
          width: '55%',
          height: '100%',
          zIndex: 3,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <ParticleCloud width={700} height={700} />
      </div>

      {/* ── Left-side content ── */}
      <div style={{
        position: 'relative', zIndex: 4, flex: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        maxWidth: 680, padding: '130px 0 130px 6vw',
      }}>

        {/* Badge */}
        <div ref={badgeRef} className="liquid-glass-sm" style={{
          opacity: 0, borderRadius: 9999, marginBottom: 28,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '10px 20px', cursor: 'default', alignSelf: 'flex-start',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#87FB89', boxShadow: '0 0 10px #87FB89', flexShrink: 0, display: 'block', animation: 'pulse-glow 2s ease-in-out infinite' }} />
          <span style={{ fontSize: 12, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.65)' }}>
            Open to Data roles · <span style={{ color: '#87FB89' }}>May 2026</span>
          </span>
        </div>

        {/* Name */}
        <div ref={nameRef} style={{ opacity: 0, marginBottom: 14 }}>
          <h1 style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontSize: 'clamp(3rem, 7vw, 7rem)',
            fontStyle: 'italic', fontWeight: 400,
            lineHeight: 0.95, letterSpacing: '-0.025em',
            color: '#ffffff', margin: 0,
          }}>
            Mithran<br />Ezhilarasan
          </h1>
        </div>

        {/* Role typewriter */}
        <div ref={roleLineRef} style={{
          opacity: 0, marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap',
        }}>
          <span style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'rgba(255,255,255,0.38)', fontWeight: 300, fontFamily: 'var(--font-geist-sans)', whiteSpace: 'nowrap' }}>
            I&apos;m a
          </span>
          <span style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', fontWeight: 700,
            fontFamily: 'var(--font-geist-sans)',
            background: 'linear-gradient(90deg, #87FB89 0%, #00ffcc 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            filter: 'drop-shadow(0 0 18px rgba(135,251,137,0.55))',
            whiteSpace: 'nowrap',
          }}>
            <span ref={roleRef}>Data Engineer</span>
          </span>
          <span style={{
            display: 'inline-block', width: 2.5, height: '1em',
            background: '#87FB89', verticalAlign: 'middle',
            animation: 'pulse 1s steps(1) infinite',
          }} />
        </div>

        {/* Tagline */}
        <p ref={tagRef} style={{
          opacity: 0, fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
          lineHeight: 1.75, color: 'rgba(255,255,255,0.45)',
          margin: '0 0 38px 0', maxWidth: 500,
          fontFamily: 'var(--font-geist-sans)',
        }}>
          MS Information Systems @ Northeastern &mdash; building production
          pipelines, real-time streaming systems &amp; AI-powered data platforms.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} style={{ opacity: 0, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a
            href={`#${SECTION_IDS.projects}`}
            data-hover
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 30px', borderRadius: 9999,
              background: '#87FB89', color: '#000',
              fontWeight: 700, fontSize: 14, textDecoration: 'none',
              boxShadow: '0 0 40px rgba(135,251,137,0.30), 0 4px 20px rgba(0,0,0,0.5)',
              transition: 'transform 0.2s, filter 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.06)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
          >
            View My Work
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>

          <a
            href={`#${SECTION_IDS.contact}`}
            data-hover
            className="liquid-glass-sm"
            style={{
              display: 'inline-flex', alignItems: 'center', padding: '13px 30px',
              borderRadius: 9999, color: 'rgba(255,255,255,0.82)',
              fontWeight: 600, fontSize: 14, textDecoration: 'none',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.06)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
          >
            Get in Touch
          </a>

          <a
            href="https://github.com/mithran77"
            target="_blank" rel="noopener noreferrer"
            data-hover
            className="liquid-glass-sm"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '13px 22px', borderRadius: 9999,
              color: 'rgba(255,255,255,0.42)', fontSize: 13,
              fontFamily: 'var(--font-geist-mono)', textDecoration: 'none',
              transition: 'transform 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'scale(1.06)'; el.style.color = 'rgba(255,255,255,0.8)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.color = 'rgba(255,255,255,0.42)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
        </div>
      </div>

      {/* ── Skills marquee ── */}
      <div ref={marqueeRef} style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        overflow: 'hidden', padding: '18px 0', zIndex: 5, opacity: 0,
      }}>
        <div style={{ position: 'absolute', inset: '0 0 0 0', left: 0, width: 80, pointerEvents: 'none', background: 'linear-gradient(to right, #000, transparent)' }} />
        <div style={{ position: 'absolute', inset: '0 0 0 auto', right: 0, width: 80, pointerEvents: 'none', background: 'linear-gradient(to left, #000, transparent)' }} />
        <div style={{ width: '100%', height: 1, marginBottom: 14, background: 'rgba(255,255,255,0.06)' }} />
        <div className="ticker-track" style={{ '--speed': '36s' } as React.CSSProperties}>
          {doubled.map((skill, i) => (
            <span key={i} className="ticker-item">
              <span style={{ margin: '0 12px' }}>{skill}</span>
              <span style={{ color: 'rgba(135,251,137,0.35)', fontSize: '0.45rem' }}>◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
