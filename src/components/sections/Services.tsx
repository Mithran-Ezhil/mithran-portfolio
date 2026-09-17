'use client'

import { useEffect, useRef } from 'react'

interface ServiceCard {
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  tags: string[]
  accentColor: string
  illustration: React.ReactNode
}

/* ─── Pipeline Architecture illustration ──────────────────────────────── */
function PipelineIllustration() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(135,251,137,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(135,251,137,0.04) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 320, height: 120,
        background: 'radial-gradient(ellipse, rgba(135,251,137,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <svg viewBox="0 0 520 220" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Animated flow gradient */}
          <linearGradient id="flowLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#87FB89" stopOpacity="0"/>
            <stop offset="40%"  stopColor="#87FB89" stopOpacity="0.6"/>
            <stop offset="60%"  stopColor="#00ffcc" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="flowLine2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#00d4ff" stopOpacity="0"/>
            <stop offset="40%"  stopColor="#00d4ff" stopOpacity="0.6"/>
            <stop offset="60%"  stopColor="#87FB89" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#87FB89" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* ── Connection lines (static base) ── */}
        <line x1="90" y1="90" x2="160" y2="90" stroke="rgba(135,251,137,0.18)" strokeWidth="1.5" strokeDasharray="4 3"/>
        <line x1="210" y1="90" x2="280" y2="90" stroke="rgba(135,251,137,0.18)" strokeWidth="1.5" strokeDasharray="4 3"/>
        <line x1="330" y1="90" x2="400" y2="90" stroke="rgba(135,251,137,0.18)" strokeWidth="1.5" strokeDasharray="4 3"/>
        {/* Branch down to Airflow */}
        <path d="M 240 115 Q 240 155 180 170" stroke="rgba(135,251,137,0.14)" strokeWidth="1.5" strokeDasharray="4 3" fill="none"/>
        <path d="M 240 115 Q 240 155 300 170" stroke="rgba(135,251,137,0.14)" strokeWidth="1.5" strokeDasharray="4 3" fill="none"/>

        {/* ── Animated flow packets on main line ── */}
        <circle r="5" fill="#87FB89" opacity="0.9" filter="url(#nodeGlow)">
          <animateMotion dur="2.2s" repeatCount="indefinite" path="M 90,90 L 430,90"/>
          <animate attributeName="opacity" values="0;0.9;0.9;0" dur="2.2s" repeatCount="indefinite"/>
        </circle>
        <circle r="4" fill="#00ffcc" opacity="0.7" filter="url(#nodeGlow)">
          <animateMotion dur="2.2s" repeatCount="indefinite" begin="0.7s" path="M 90,90 L 430,90"/>
          <animate attributeName="opacity" values="0;0.7;0.7;0" dur="2.2s" repeatCount="indefinite" begin="0.7s"/>
        </circle>
        <circle r="3.5" fill="#00d4ff" opacity="0.8" filter="url(#nodeGlow)">
          <animateMotion dur="2.2s" repeatCount="indefinite" begin="1.4s" path="M 90,90 L 430,90"/>
          <animate attributeName="opacity" values="0;0.8;0.8;0" dur="2.2s" repeatCount="indefinite" begin="1.4s"/>
        </circle>

        {/* ── Node 1: Source / Raw Data ── */}
        <circle cx="55" cy="90" r="28" fill="#050f1a" stroke="rgba(135,251,137,0.4)" strokeWidth="1.5" filter="url(#nodeGlow)"/>
        <circle cx="55" cy="90" r="28" fill="none" stroke="rgba(135,251,137,0.15)" strokeWidth="8"/>
        <text x="55" y="86" textAnchor="middle" fill="#87FB89" fontSize="9" fontFamily="monospace" fontWeight="bold">RAW</text>
        <text x="55" y="97" textAnchor="middle" fill="#87FB89" fontSize="9" fontFamily="monospace" fontWeight="bold">DATA</text>
        <text x="55" y="128" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="monospace">Source</text>

        {/* ── Node 2: Kafka ── */}
        <circle cx="185" cy="90" r="28" fill="#050f1a" stroke="rgba(135,251,137,0.5)" strokeWidth="1.5" filter="url(#nodeGlow)">
          <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
        </circle>
        <text x="185" y="87" textAnchor="middle" fill="#87FB89" fontSize="10" fontFamily="monospace" fontWeight="bold">Apache</text>
        <text x="185" y="99" textAnchor="middle" fill="#87FB89" fontSize="10" fontFamily="monospace" fontWeight="bold">Kafka</text>
        <text x="185" y="128" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="monospace">Stream</text>

        {/* ── Node 3: PySpark ── */}
        <circle cx="305" cy="90" r="28" fill="#050f1a" stroke="rgba(0,255,204,0.5)" strokeWidth="1.5" filter="url(#nodeGlow)">
          <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2s" begin="0.6s" repeatCount="indefinite"/>
        </circle>
        <text x="305" y="87" textAnchor="middle" fill="#00ffcc" fontSize="10" fontFamily="monospace" fontWeight="bold">Py</text>
        <text x="305" y="99" textAnchor="middle" fill="#00ffcc" fontSize="10" fontFamily="monospace" fontWeight="bold">Spark</text>
        <text x="305" y="128" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="monospace">Transform</text>

        {/* ── Node 4: Snowflake ── */}
        <circle cx="425" cy="90" r="28" fill="#050f1a" stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" filter="url(#nodeGlow)">
          <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2s" begin="1.2s" repeatCount="indefinite"/>
        </circle>
        <text x="425" y="87" textAnchor="middle" fill="#00d4ff" fontSize="9" fontFamily="monospace" fontWeight="bold">Snow</text>
        <text x="425" y="99" textAnchor="middle" fill="#00d4ff" fontSize="9" fontFamily="monospace" fontWeight="bold">flake</text>
        <text x="425" y="128" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="monospace">Warehouse</text>

        {/* ── Branch nodes: dbt + Airflow ── */}
        <circle cx="155" cy="178" r="22" fill="#050f1a" stroke="rgba(135,251,137,0.3)" strokeWidth="1.2"/>
        <text x="155" y="182" textAnchor="middle" fill="#87FB89" fontSize="11" fontFamily="monospace" fontWeight="bold">dbt</text>

        <circle cx="310" cy="178" r="22" fill="#050f1a" stroke="rgba(135,251,137,0.3)" strokeWidth="1.2"/>
        <text x="310" y="174" textAnchor="middle" fill="#87FB89" fontSize="9" fontFamily="monospace" fontWeight="bold">Air</text>
        <text x="310" y="186" textAnchor="middle" fill="#87FB89" fontSize="9" fontFamily="monospace" fontWeight="bold">flow</text>

        {/* throughput label */}
        <rect x="190" y="38" width="140" height="22" rx="11" fill="rgba(135,251,137,0.08)" stroke="rgba(135,251,137,0.2)" strokeWidth="1"/>
        <text x="260" y="53" textAnchor="middle" fill="rgba(135,251,137,0.8)" fontSize="10" fontFamily="monospace">1M+ events / sec</text>
      </svg>
    </div>
  )
}

/* ─── AI Agents illustration ──────────────────────────────────────────── */
function AgentsIllustration() {
  const agents = [
    { label: 'NLP',    angle: -90,  r: 90, color: '#00d4ff' },
    { label: 'RAG',    angle: -30,  r: 90, color: '#a78bfa' },
    { label: 'Report', angle:  30,  r: 90, color: '#00d4ff' },
    { label: 'Query',  angle:  90,  r: 90, color: '#a78bfa' },
    { label: 'ERP',    angle:  150, r: 90, color: '#00ffcc' },
    { label: 'Auto',   angle: -150, r: 90, color: '#00ffcc' },
  ]
  const cx = 260, cy = 110

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(167,139,250,0.07) 0%, transparent 70%)',
      }} />

      <svg viewBox="0 0 520 220" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="agentGlow">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="coreGlow">
            <feGaussianBlur stdDeviation="6" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── Orbital ring ── */}
        <circle cx={cx} cy={cy} r="90" fill="none" stroke="rgba(0,212,255,0.08)" strokeWidth="1" strokeDasharray="4 6"/>
        <circle cx={cx} cy={cy} r="90" fill="none" stroke="rgba(0,212,255,0.04)" strokeWidth="8"/>

        {/* ── Connection lines from core to agents ── */}
        {agents.map((a, i) => {
          const rad = (a.angle * Math.PI) / 180
          const ax = cx + a.r * Math.cos(rad)
          const ay = cy + a.r * Math.sin(rad)
          return (
            <line key={i}
              x1={cx} y1={cy} x2={ax} y2={ay}
              stroke={a.color} strokeWidth="1" strokeOpacity="0.25"
              strokeDasharray="3 4"
            >
              <animate attributeName="stroke-opacity" values="0.15;0.5;0.15" dur={`${2 + i * 0.4}s`} repeatCount="indefinite"/>
            </line>
          )
        })}

        {/* ── Animated signal pulses along connections ── */}
        {agents.map((a, i) => {
          const rad = (a.angle * Math.PI) / 180
          const ax = cx + a.r * Math.cos(rad)
          const ay = cy + a.r * Math.sin(rad)
          return (
            <circle key={i} r="3.5" fill={a.color} opacity="0.9" filter="url(#agentGlow)">
              <animateMotion
                dur={`${1.8 + i * 0.25}s`}
                repeatCount="indefinite"
                begin={`${i * 0.3}s`}
                path={`M ${cx},${cy} L ${ax},${ay}`}
              />
              <animate attributeName="opacity" values="0;0.9;0" dur={`${1.8 + i * 0.25}s`} repeatCount="indefinite" begin={`${i * 0.3}s`}/>
            </circle>
          )
        })}

        {/* ── Agent nodes ── */}
        {agents.map((a, i) => {
          const rad = (a.angle * Math.PI) / 180
          const ax = cx + a.r * Math.cos(rad)
          const ay = cy + a.r * Math.sin(rad)
          return (
            <g key={i}>
              <circle cx={ax} cy={ay} r="22" fill="#060e1c" stroke={a.color} strokeWidth="1.2" opacity="0.9">
                <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur={`${2.4 + i * 0.3}s`} repeatCount="indefinite"/>
              </circle>
              <circle cx={ax} cy={ay} r="22" fill="none" stroke={a.color} strokeWidth="6" opacity="0.05"/>
              <text x={ax} y={ay + 4} textAnchor="middle" fill={a.color} fontSize="9" fontFamily="monospace" fontWeight="bold">
                {a.label}
              </text>
            </g>
          )
        })}

        {/* ── Core LLM hub ── */}
        <circle cx={cx} cy={cy} r="36" fill="#060e1c" stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" filter="url(#coreGlow)">
          <animate attributeName="stroke-opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx={cx} cy={cy} r="36" fill="none" stroke="rgba(0,212,255,0.1)" strokeWidth="12"/>
        {/* Rotating inner ring */}
        <circle cx={cx} cy={cy} r="28" fill="none" stroke="rgba(167,139,250,0.3)" strokeWidth="1" strokeDasharray="6 4">
          <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="8s" repeatCount="indefinite"/>
        </circle>
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#00d4ff" fontSize="11" fontFamily="monospace" fontWeight="bold">LLM</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="rgba(0,212,255,0.6)" fontSize="8" fontFamily="monospace">CORE</text>

        {/* agent count badge */}
        <rect x={cx + 36} y={cy - 50} width="80" height="20" rx="10" fill="rgba(0,212,255,0.08)" stroke="rgba(0,212,255,0.2)" strokeWidth="1"/>
        <text x={cx + 76} y={cy - 36} textAnchor="middle" fill="rgba(0,212,255,0.75)" fontSize="10" fontFamily="monospace">6 agents active</text>
      </svg>
    </div>
  )
}

const SERVICES: ServiceCard[] = [
  {
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
    accentColor: '#87FB89',
    illustration: <PipelineIllustration />,
  },
  {
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
    accentColor: '#00d4ff',
    illustration: <AgentsIllustration />,
  },
]

function ServiceCardComponent({ card, index }: { card: ServiceCard; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

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
      className="liquid-glass rounded-3xl overflow-hidden group"
      style={{
        opacity: 0,
        transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-6px) scale(1.01)'
        el.style.boxShadow = `0 24px 60px rgba(0,0,0,0.5), 0 0 40px ${card.accentColor}18`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = ''
        el.style.boxShadow = ''
      }}
    >
      {/* ── Illustration area ── */}
      <div
        style={{
          position: 'relative',
          height: 240,
          background: 'linear-gradient(135deg, #060d1a 0%, #080f20 100%)',
          overflow: 'hidden',
        }}
      >
        {card.illustration}

        {/* Bottom gradient fade into card body */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
          background: 'linear-gradient(to bottom, transparent, rgba(5,8,20,0.9))',
          pointerEvents: 'none',
        }} />

        {/* Eyebrow badge */}
        <div style={{ position: 'absolute', top: 18, left: 20, zIndex: 2 }}>
          <span style={{
            fontSize: 10, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.4em',
            textTransform: 'uppercase', padding: '6px 14px', borderRadius: 9999,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            color: card.accentColor, border: `0.5px solid ${card.accentColor}33`,
          }}>
            {card.eyebrow}
          </span>
        </div>
      </div>

      {/* ── Text content ── */}
      <div style={{ padding: '28px 32px 32px' }}>
        <h3 style={{
          fontFamily: 'var(--font-instrument-serif)',
          fontSize: '1.75rem', fontStyle: 'italic', fontWeight: 400,
          color: '#ffffff', margin: '0 0 12px', lineHeight: 1.2,
        }}>
          {card.title}
        </h3>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.48)', margin: '0 0 22px' }}>
          {card.description}
        </p>

        {/* Bullets */}
        <ul style={{ margin: '0 0 24px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {card.bullets.map((b) => (
            <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14, color: 'rgba(255,255,255,0.58)' }}>
              <span style={{ color: card.accentColor, marginTop: 3, flexShrink: 0 }}>◆</span>
              {b}
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 20, borderTop: '0.5px solid rgba(255,255,255,0.07)' }}>
          {card.tags.map((t) => (
            <span key={t} style={{
              fontSize: 11, fontFamily: 'var(--font-geist-mono)',
              padding: '5px 13px', borderRadius: 9999,
              background: `${card.accentColor}0d`,
              color: `${card.accentColor}aa`,
              border: `0.5px solid ${card.accentColor}22`,
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Services() {
  const headerRef = useRef<HTMLDivElement>(null)

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
      className="relative py-28 px-6 md:px-16 max-w-7xl mx-auto"
      style={{ zIndex: 1 }}
    >
      {/* Header */}
      <div ref={headerRef} style={{ opacity: 0, marginBottom: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <span style={{ width: 32, height: 1, background: 'rgba(135,251,137,0.5)', display: 'block' }} />
          <span style={{ fontSize: 11, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(135,251,137,0.6)' }}>
            What I Build
          </span>
        </div>
        <h2 style={{
          fontFamily: 'var(--font-instrument-serif)',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontStyle: 'italic',
          color: '#ffffff', lineHeight: 1.15, margin: 0,
        }}>
          From raw data to{' '}
          <span style={{
            background: 'linear-gradient(90deg, #87FB89, #00ffcc)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            intelligent systems.
          </span>
        </h2>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
        {SERVICES.map((card, i) => (
          <ServiceCardComponent key={card.title} card={card} index={i} />
        ))}
      </div>
    </section>
  )
}
