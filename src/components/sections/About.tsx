'use client'

import { useEffect, useRef } from 'react'
import { SECTION_IDS } from '@/lib/constants'

const STATS = [
  { value: 13,   suffix: '+',  label: 'Events/sec',      sub: 'Kafka streaming'  },
  { value: 100,  suffix: 'K+', label: 'Records migrated', sub: 'Zero data loss'  },
  { value: 70,   suffix: '%',  label: 'Latency cut',      sub: 'Pipeline perf'   },
  { value: 3.67, suffix: '',   label: 'GPA',              sub: 'Northeastern'    },
]

const SKILLS_ROWS = [
  ['Apache Kafka', 'PySpark', 'dbt', 'Snowflake', 'Airflow', 'Databricks'],
  ['Delta Lake', 'PostgreSQL', 'AWS S3', 'Docker', 'Python', 'SQL'],
  ['Power BI', 'Grafana', 'Oracle ERP', 'LangChain', 'ChromaDB', 'Flask'],
]

// Grouped so the card reads as a stack rather than a flat tag cloud.
// No emoji — each tool gets a colour-matched dot instead.
const TOOL_GROUPS = [
  {
    label: 'Languages',
    tools: [
      { name: 'Python',     color: '#87FB89' },
      { name: 'SQL',        color: '#38bdf8' },
      { name: 'PL/SQL',     color: '#f28c28' },
      { name: 'R',          color: '#276dc3' },
    ],
  },
  {
    label: 'Processing & Orchestration',
    tools: [
      { name: 'PySpark',    color: '#e25a1c' },
      { name: 'Databricks', color: '#ff3621' },
      { name: 'Kafka',      color: '#00d4ff' },
      { name: 'Airflow',    color: '#017cee' },
      { name: 'dbt',        color: '#ff694a' },
    ],
  },
  {
    label: 'Storage & Warehouse',
    tools: [
      { name: 'Snowflake',  color: '#29b5e8' },
      { name: 'Delta Lake', color: '#00adef' },
      { name: 'Redshift',   color: '#8c4fff' },
      { name: 'PostgreSQL', color: '#4f93c0' },
      { name: 'AWS S3',     color: '#569a31' },
    ],
  },
  {
    label: 'Enterprise & BI',
    tools: [
      { name: 'Oracle Fusion', color: '#f80000' },
      { name: 'Oracle EBS',    color: '#ea1b22' },
      { name: 'OIC',           color: '#fa6b05' },
      { name: 'Power BI',      color: '#f2c811' },
      { name: 'Tableau',       color: '#e8762d' },
    ],
  },
  {
    label: 'AI & Retrieval',
    tools: [
      { name: 'LangChain',  color: '#1c3c3c' },
      { name: 'ChromaDB',   color: '#ffde2d' },
      { name: 'Pinecone',   color: '#a78bfa' },
      { name: 'MLflow',     color: '#0194e2' },
    ],
  },
  {
    label: 'Platform',
    tools: [
      { name: 'Docker',     color: '#2496ed' },
      { name: 'Kubernetes', color: '#326ce5' },
      { name: 'AWS Glue',   color: '#c925d1' },
      { name: 'Git',        color: '#f05032' },
    ],
  },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    import('@/lib/gsap').then(({ gsap }) => {
      // Stat counters
      sectionRef.current?.querySelectorAll('.stat-val').forEach(el => {
        const target = parseFloat((el as HTMLElement).dataset.val ?? '0')
        const suffix = (el as HTMLElement).dataset.suffix ?? ''
        const isFloat = target % 1 !== 0
        const obj = { v: 0 }
        gsap.to(obj, {
          v: target, duration: 2.2, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
          onUpdate() {
            el.textContent = (isFloat ? obj.v.toFixed(2) : Math.round(obj.v).toLocaleString()) + suffix
          },
        })
      })

      // Bento cards stagger
      gsap.fromTo(
        sectionRef.current?.querySelectorAll('.bento-card') ?? [],
        { opacity: 0, y: 32, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        }
      )
    })
  }, [])

  const cardBase: React.CSSProperties = {
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(255,255,255,0.025)',
    backdropFilter: 'blur(20px)',
    padding: 28,
    position: 'relative',
    overflow: 'hidden',
    transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
  }

  return (
    <section
      id={SECTION_IDS.about}
      ref={sectionRef}
      data-section="about"
      className="relative py-28 px-6 md:px-16 max-w-7xl mx-auto"
      style={{ zIndex: 1 }}
    >
      {/* Section header */}
      <div className="mb-14" style={{ opacity: 0, animation: 'revealUp 0.8s 0.1s forwards' }}>
        <div className="flex items-center gap-4 mb-4">
          <span style={{ width: 32, height: 1, background: 'rgba(0,212,255,0.5)', display: 'block' }} />
          <span style={{ fontSize: 11, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.5em', color: 'rgba(0,212,255,0.6)', textTransform: 'uppercase' }}>
            03 — About
          </span>
        </div>
        <h2 style={{
          fontFamily: 'var(--font-instrument-serif)',
          fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
          fontStyle: 'italic',
          fontWeight: 400,
          color: '#fff',
          letterSpacing: '-0.025em',
          lineHeight: 1.05,
          margin: 0,
        }}>
          Building systems<br />
          <span style={{ background: 'linear-gradient(90deg, #00d4ff, #87FB89)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            that scale.
          </span>
        </h2>
      </div>

      {/* ── Bento Grid ─────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridAutoRows: 'minmax(100px, auto)',
        gap: 12,
      }}>

        {/* 1. Bio card — 7 cols × 2 rows */}
        <div
          className="bento-card"
          style={{ ...cardBase, gridColumn: 'span 7', gridRow: 'span 2', opacity: 0 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.transform = '' }}
        >
          {/* Background glow */}
          <div style={{ position: 'absolute', top: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ fontSize: 11, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.4em', color: 'rgba(0,212,255,0.5)', textTransform: 'uppercase', marginBottom: 16 }}>
            Data Engineer · MS Northeastern
          </div>
          <p style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)', lineHeight: 1.8, color: 'rgba(255,255,255,0.72)', marginBottom: 16 }}>
            I build production-grade data systems that move, transform, and make sense of large-scale data.
            From streaming pipelines ingesting <span style={{ color: '#00d4ff', fontWeight: 600 }}>13+ events/sec</span> with Kafka &amp; PySpark, to
            6-agent AI systems over Oracle ERP APIs.
          </p>
          <p style={{ fontSize: 'clamp(0.88rem, 1.2vw, 0.98rem)', lineHeight: 1.75, color: 'rgba(255,255,255,0.45)', marginBottom: 0 }}>
            Currently pursuing my MS in Information Systems at Northeastern (GPA 3.67), open to Data Engineering,
            Analytics Engineering, and Data Platform roles starting <span style={{ color: '#87FB89' }}>May 2026</span>.
          </p>
          {/* Bottom tags */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24 }}>
            {['Boston, MA', 'Open to Work', 'May 2026'].map(t => (
              <span key={t} style={{ fontSize: 11, fontFamily: 'var(--font-geist-mono)', padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* 2. Status card — 5 cols × 1 row */}
        <div
          className="bento-card"
          style={{ ...cardBase, gridColumn: 'span 5', gridRow: 'span 1', opacity: 0, background: 'rgba(135,251,137,0.04)', borderColor: 'rgba(135,251,137,0.1)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(135,251,137,0.25)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(135,251,137,0.08)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(135,251,137,0.1)'; (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#87FB89', boxShadow: '0 0 10px #87FB89', flexShrink: 0, animation: 'pulse-glow 2s ease-in-out infinite', display: 'block' }} />
            <span style={{ fontSize: 12, fontFamily: 'var(--font-geist-mono)', color: '#87FB89', letterSpacing: '0.1em' }}>Available · May 2026</span>
          </div>
          <div style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)', fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', marginTop: 14, lineHeight: 1.3 }}>
            Open to full-time roles
          </div>
        </div>

        {/* 3. GPA / edu card — 5 cols × 1 row */}
        <div
          className="bento-card"
          style={{ ...cardBase, gridColumn: 'span 5', gridRow: 'span 1', opacity: 0 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.transform = '' }}
        >
          <div style={{ fontSize: 11, fontFamily: 'var(--font-geist-mono)', color: 'rgba(0,212,255,0.5)', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 8 }}>Education</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 2 }}>Northeastern University</div>
          <div style={{ fontSize: 13, color: 'rgba(0,212,255,0.7)', fontFamily: 'var(--font-geist-mono)' }}>MS Information Systems · GPA 3.67</div>
        </div>

        {/* 4–7. Stats cards — 3 cols each × 1 row */}
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bento-card"
            style={{ ...cardBase, gridColumn: 'span 3', gridRow: 'span 1', opacity: 0, textAlign: 'center', padding: 20 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px) scale(1.02)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(0,212,255,0.07)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}
          >
            <div
              className="stat-val"
              data-val={s.value}
              data-suffix={s.suffix}
              style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                fontWeight: 700,
                fontFamily: 'var(--font-geist-mono)',
                background: 'linear-gradient(135deg, #00d4ff, #87FB89)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.1,
              }}
            >
              0
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-geist-mono)', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}

        {/* 8. Tools card — full width, grouped by layer */}
        <div
          className="bento-card"
          style={{ ...cardBase, gridColumn: 'span 12', gridRow: 'span 1', opacity: 0 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.18)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)' }}
        >
          <div style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 20 }}>Core Tools</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '22px 28px' }}>
            {TOOL_GROUPS.map(group => (
              <div key={group.label}>
                <div style={{ fontSize: 9.5, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.24em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 10 }}>
                  {group.label}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {group.tools.map(t => (
                    <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 12px', borderRadius: 30, background: `${t.color}0d`, border: `1px solid ${t.color}2b` }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.color, boxShadow: `0 0 7px ${t.color}99`, flexShrink: 0, display: 'block' }} />
                      <span style={{ fontSize: 12, fontFamily: 'var(--font-geist-mono)', color: t.color, fontWeight: 500, whiteSpace: 'nowrap' }}>{t.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 9. Skills marquee card — full width */}
        <div
          className="bento-card"
          style={{ ...cardBase, gridColumn: 'span 12', gridRow: 'span 1', opacity: 0, padding: '20px 0', overflow: 'hidden' }}
        >
          <div style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 12, paddingLeft: 24 }}>Full Stack</div>
          {SKILLS_ROWS.map((row, ri) => (
            <div key={ri} style={{ overflow: 'hidden', marginBottom: ri < SKILLS_ROWS.length - 1 ? 4 : 0 }}>
              <div className="ticker-track" style={{ '--speed': `${18 + ri * 4}s` } as React.CSSProperties}>
                {[...row, ...row].map((skill, si) => (
                  <span key={si} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginRight: 24, fontSize: 11, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(0,212,255,0.4)', display: 'inline-block' }} />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
