'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { projects, type ProjectFull } from '@/data/projects'
import { SECTION_IDS } from '@/lib/constants'
import DetailModal, { ModalLabel, MetricGrid, TagRow, Pill } from '@/components/ui/DetailModal'

// ─── SVG Icons ─────────────────────────────────────────────────────────────────
// Keyed by `project.icon` and tinted with the project colour, so adding a
// project never silently renders a blank tile the way a positional array did.

const ICONS: Record<string, (c: string) => JSX.Element> = {
  // Multi-agent hub with satellites
  agents: (c) => (
    <svg viewBox="0 0 80 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <circle cx="40" cy="40" r="16" stroke={c} strokeWidth="1.5" opacity="0.7" />
      <circle cx="40" cy="40" r="28" stroke={c} strokeWidth="0.6" strokeDasharray="4 3" opacity="0.3" />
      {([[20, 20], [60, 20], [40, 65], [16, 50], [64, 50]] as [number, number][]).map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill={c} opacity="0.8" />
          <line x1={x} y1={y} x2="40" y2="40" stroke={c} strokeWidth="0.7" opacity="0.35" />
        </g>
      ))}
      <circle cx="40" cy="40" r="6" fill={c} opacity="0.95" />
      <text x="40" y="44" textAnchor="middle" fill="white" fontSize="7" fontFamily="monospace" opacity="0.9">AI</text>
    </svg>
  ),
  // Medallion architecture: three stacked layers
  lakehouse: (c) => (
    <svg viewBox="0 0 80 80" fill="none" style={{ width: '100%', height: '100%' }}>
      {[18, 38, 58].map((y, i) => (
        <g key={i}>
          <rect x="12" y={y - 7} width="56" height="14" rx="3" stroke={c} strokeWidth="1" opacity={0.35 + i * 0.22} />
          <rect x="12" y={y - 7} width={18 + i * 19} height="14" rx="3" fill={c} opacity={0.1 + i * 0.1} />
        </g>
      ))}
      {[28, 48].map((y, i) => (
        <path key={i} d={`M40 ${y - 3} L40 ${y + 3} M37 ${y} L40 ${y + 3} L43 ${y}`} stroke={c} strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
      ))}
    </svg>
  ),
  // Streaming: live trend over candles
  streaming: (c) => (
    <svg viewBox="0 0 80 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <circle cx="40" cy="40" r="36" stroke={c} strokeWidth="0.8" strokeDasharray="5 4" opacity="0.3" />
      <polyline points="10,52 22,36 32,44 44,26 56,34 70,18" stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="36" r="3.5" fill={c} opacity="0.9" />
      <circle cx="44" cy="26" r="3.5" fill={c} opacity="0.9" />
      <circle cx="70" cy="18" r="3.5" fill={c} opacity="0.9" />
      {[14, 27, 40, 53].map((x, i) => (
        <rect key={i} x={x} y={58 - i * 0} width="7" height={10 + i * 5} rx="1" fill={c} opacity={0.5 - i * 0.07} />
      ))}
    </svg>
  ),
  // Hybrid retrieval + re-ranking
  retrieval: (c) => (
    <svg viewBox="0 0 80 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <circle cx="30" cy="32" r="17" stroke={c} strokeWidth="1.1" opacity="0.55" />
      <circle cx="50" cy="32" r="17" stroke={c} strokeWidth="1.1" opacity="0.55" />
      <path d="M40 16 a17 17 0 0 1 0 32 a17 17 0 0 1 0 -32" fill={c} opacity="0.16" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="22" y={56 + i * 7} width={36 - i * 9} height="4" rx="2" fill={c} opacity={0.75 - i * 0.22} />
          <circle cx="18" cy={58 + i * 7} r="1.8" fill={c} opacity={0.75 - i * 0.22} />
        </g>
      ))}
    </svg>
  ),
  // Relational database disc
  database: (c) => (
    <svg viewBox="0 0 80 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="40" cy="40" rx="30" ry="13" stroke={c} strokeWidth="1" opacity="0.55" />
      <ellipse cx="40" cy="40" rx="30" ry="13" stroke={c} strokeWidth="0.8" opacity="0.25" transform="rotate(60 40 40)" />
      <ellipse cx="40" cy="40" rx="30" ry="13" stroke={c} strokeWidth="0.8" opacity="0.25" transform="rotate(-60 40 40)" />
      <circle cx="40" cy="40" r="6" fill={c} opacity="0.9" />
      {([[65, 40], [54, 52], [28, 52], [15, 40], [28, 28], [54, 28]] as [number, number][]).map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.5" fill={c} opacity="0.65" />
      ))}
    </svg>
  ),
  // Forecast: history bars into dashed projection
  forecast: (c) => (
    <svg viewBox="0 0 80 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <line x1="10" y1="62" x2="70" y2="62" stroke={c} strokeWidth="0.8" opacity="0.35" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={13 + i * 9} y={50 - i * 6} width="6" height={12 + i * 6} rx="1.5" fill={c} opacity={0.3 + i * 0.13} />
      ))}
      <polyline points="16,48 25,42 34,36 43,28" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
      <polyline points="43,28 54,22 66,14" stroke={c} strokeWidth="2" strokeDasharray="4 4" fill="none" strokeLinecap="round" opacity="0.7" />
      <circle cx="43" cy="28" r="3.5" fill={c} />
      <path d="M62 14 L66 14 L66 18" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    </svg>
  ),
  // Transit route with stations
  transit: (c) => (
    <svg viewBox="0 0 80 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <path d="M12 58 L28 58 L40 40 L52 40 L68 20" stroke={c} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      <path d="M12 68 L34 68 L48 50 L68 50" stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" strokeDasharray="4 4" />
      {([[12, 58], [28, 58], [52, 40], [68, 20]] as [number, number][]).map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.6" fill="#000" stroke={c} strokeWidth="1.8" />
      ))}
      <circle cx="40" cy="40" r="5" fill={c} opacity="0.9" />
      <circle cx="40" cy="40" r="11" stroke={c} strokeWidth="0.8" opacity="0.3" />
    </svg>
  ),
  // Parallel worker threads
  pipeline: (c) => (
    <svg viewBox="0 0 80 80" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect x="10" y="14" width="60" height="52" rx="5" stroke={c} strokeWidth="0.8" opacity="0.4" />
      {[24, 36, 48, 60].map((x, i) => (
        <rect key={i} x={x - 4} y={34 - i * 3} width="8" height={30 + i * 3} rx="1.5" fill={c} opacity={0.25 + i * 0.18} />
      ))}
      <polyline points="10,46 20,36 30,42 42,28 54,34 70,20" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="70" cy="20" r="4" fill={c} />
      <circle cx="42" cy="28" r="3" fill={c} opacity="0.7" />
    </svg>
  ),
}

// ─── Card sizing ───────────────────────────────────────────────────────────────
// One source of truth: the card's CSS and the GSAP scroll-distance maths must
// agree, or the horizontal track over- or under-shoots the last card.

const CARD_VW = 0.52        // share of viewport width
const CARD_MAX_W = 560      // px ceiling on wide screens
const CARD_MAX_H = 520      // px ceiling so cards don't fill the whole viewport
const CARD_GAP = 28         // px between cards
const TRACK_PAD = 48        // px inset at each end of the track

function cardWidth() {
  return Math.min(window.innerWidth * CARD_VW, CARD_MAX_W)
}

function ProjectIcon({ project }: { project: ProjectFull }) {
  const render = ICONS[project.icon] ?? ICONS.agents
  return render(project.color)
}

// ─── ProjectModal ──────────────────────────────────────────────────────────────

function ProjectModal({ project, onClose }: { project: ProjectFull; onClose: () => void }) {
  const c = project.color
  return (
    <DetailModal
      accent={c}
      onClose={onClose}
      title={project.title}
      subtitle={project.subtitle}
      maxWidth={760}
      pills={<><Pill accent={c}>{project.role}</Pill><Pill accent={c} muted>{project.period}</Pill></>}
      headerAside={<div style={{ width: 60, height: 60, opacity: 0.85 }}><ProjectIcon project={project} /></div>}
    >
      <div style={{
        padding: '12px 16px', marginBottom: 22,
        background: `${c}0c`, border: `1px solid ${c}22`,
        borderRadius: 10, borderLeft: `3px solid ${c}`,
      }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>
          {project.impact}
        </p>
      </div>

      <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.78, marginBottom: 26 }}>
        {project.description}
      </p>

      <div style={{ marginBottom: 26 }}>
        <ModalLabel accent={c}>Results</ModalLabel>
        <MetricGrid accent={c} metrics={project.metrics} />
      </div>

      <div style={{ marginBottom: 26 }}>
        <ModalLabel accent={c}>What I Built</ModalLabel>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {project.highlights.map((h, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ color: c, fontSize: 14, marginTop: 2, flexShrink: 0 }}>▸</span>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{h}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: 26 }}>
        <ModalLabel accent={c}>Engineering Decisions</ModalLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {project.decisions.map((d, i) => (
            <div key={i} style={{
              padding: '12px 16px', background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10,
              borderLeft: `2px solid ${c}55`,
            }}>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.68, margin: 0 }}>{d}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <ModalLabel accent={c}>Tech Stack</ModalLabel>
        <TagRow accent={c} tags={project.tags} />
      </div>
    </DetailModal>
  )
}

// ─── Single Project Card ───────────────────────────────────────────────────────

function ProjectCard({
  project,
  total,
  onOpen,
}: {
  project: ProjectFull
  total: number
  onOpen: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2
    card.style.transform = `perspective(1000px) rotateX(${-y * 4}deg) rotateY(${x * 5}deg) scale(1.015)`
    if (shineRef.current) {
      shineRef.current.style.background = `radial-gradient(circle at ${(x + 1) * 50}% ${(y + 1) * 50}%, ${project.color}18 0%, transparent 65%)`
    }
  }, [project.color])

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) cardRef.current.style.transform = ''
    if (shineRef.current) shineRef.current.style.background = 'transparent'
  }, [])

  return (
    <div
      ref={cardRef}
      onClick={onOpen}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: `${CARD_VW * 100}vw`,
        maxWidth: CARD_MAX_W,
        height: `min(100%, ${CARD_MAX_H}px)`,
        flexShrink: 0,
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'none',
        background: `linear-gradient(145deg, rgba(0,8,20,0.97) 0%, ${project.color}0a 60%, rgba(0,3,10,0.99) 100%)`,
        border: `1px solid ${project.color}22`,
        boxShadow: `0 0 60px ${project.color}0a, inset 0 0 80px rgba(0,0,0,0.4)`,
        transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '30px 32px 26px',
        willChange: 'transform',
      }}
    >
      {/* Shine overlay */}
      <div
        ref={shineRef}
        style={{
          position: 'absolute', inset: 0, zIndex: 1,
          borderRadius: 20, pointerEvents: 'none',
          transition: 'background 0.15s ease',
        }}
      />

      {/* Subtle grid lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.025,
        backgroundImage: `linear-gradient(${project.color} 1px, transparent 1px), linear-gradient(90deg, ${project.color} 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Ghost number */}
      <div style={{
        position: 'absolute',
        top: -12,
        left: 24,
        fontSize: 'clamp(6rem, 13vw, 10rem)',
        fontWeight: 900,
        fontFamily: 'var(--font-geist-sans)',
        color: project.color,
        opacity: 0.04,
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
        zIndex: 0,
        letterSpacing: '-0.06em',
      }}>
        {project.number}
      </div>

      {/* Top row: number + role badge */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{
          fontSize: 13, fontFamily: 'monospace', letterSpacing: '0.3em',
          color: project.color, opacity: 0.7,
        }}>
          {project.number} / {String(total).padStart(2, '0')}
        </span>
        <span style={{
          fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: project.color,
          background: `${project.color}14`,
          border: `1px solid ${project.color}35`,
          padding: '5px 14px',
          borderRadius: 20,
          whiteSpace: 'nowrap',
        }}>
          {project.badge}
        </span>
      </div>

      {/* Center: icon + title + bullets */}
      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 28, paddingBottom: 28 }}>
        <div style={{ width: 46, height: 46, marginBottom: 14, opacity: 0.8 }}>
          <ProjectIcon project={project} />
        </div>

        <h3 style={{
          fontSize: 'clamp(1.35rem, 2.3vw, 1.9rem)',
          fontWeight: 400,
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontStyle: 'italic',
          color: '#fff',
          lineHeight: 1.1,
          marginBottom: 14,
          letterSpacing: '-0.01em',
        }}>
          {project.title}
        </h3>

        <p style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.38)',
          lineHeight: 1.6,
          marginBottom: 22,
          maxWidth: '58ch',
        }}>
          {project.subtitle}
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {project.bullets.map((b, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{
                marginTop: 5,
                flexShrink: 0,
                display: 'block',
                width: 5, height: 5,
                borderRadius: '50%',
                background: project.color,
                boxShadow: `0 0 8px ${project.color}`,
              }} />
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom row: tags + CTA */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          height: 1,
          background: `linear-gradient(90deg, ${project.color}30, transparent)`,
          marginBottom: 20,
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {project.tags.slice(0, 5).map(tag => (
              <span key={tag} style={{
                fontSize: 11, padding: '4px 12px',
                borderRadius: 20,
                background: `${project.color}0e`,
                border: `1px solid ${project.color}28`,
                color: project.color,
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
              }}>
                {tag}
              </span>
            ))}
            {project.tags.length > 5 && (
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', alignSelf: 'center' }}>
                +{project.tags.length - 5}
              </span>
            )}
          </div>

          <span style={{
            fontSize: 12, fontFamily: 'monospace', letterSpacing: '0.15em',
            color: project.color, opacity: 0.6,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: project.color,
              boxShadow: `0 0 10px ${project.color}`,
              display: 'inline-block',
              animation: 'ctaPulse 2s ease-in-out infinite',
            }} />
            click to expand
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Projects section ─────────────────────────────────────────────────────

export default function Projects() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const [selectedProject, setSelectedProject] = useState<ProjectFull | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  // outerHeight drives the scroll travel; 0 on SSR, set client-side
  const [outerHeight, setOuterHeight] = useState(0)

  const CARD_COUNT = projects.length

  useEffect(() => {
    // Compute outer wrapper height on client
    const totalShift = (CARD_COUNT - 1) * (cardWidth() + CARD_GAP)
    setOuterHeight(window.innerHeight + totalShift + window.innerHeight * 0.5)
  }, [CARD_COUNT])

  useEffect(() => {
    if (outerHeight === 0) return
    // Structural type instead of `any`: gsap is dynamically imported, so its
    // Context type isn't in scope here and revert() is all we need.
    let ctx: { revert: () => void } | undefined

    import('@/lib/gsap').then(({ gsap }) => {
      ctx = gsap.context(() => {
        const track = trackRef.current
        const outer = outerRef.current
        if (!track || !outer) return

        const totalShift = (CARD_COUNT - 1) * (cardWidth() + CARD_GAP)

        gsap.to(track, {
          x: -totalShift,
          ease: 'none',
          scrollTrigger: {
            trigger: outer,
            start: 'top top',
            end: () => `+=${totalShift + window.innerHeight * 0.5}`,
            pin: innerRef.current,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
              const idx = Math.round(self.progress * (CARD_COUNT - 1))
              setActiveIndex(Math.min(Math.max(idx, 0), CARD_COUNT - 1))
            },
          },
        })
      }, outerRef)
    })

    return () => {
      ctx?.revert()
    }
  }, [CARD_COUNT, outerHeight])

  return (
    <>
      {/* Global keyframes */}
      <style>{`
        @keyframes modalBackdropIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalPanelIn { from { opacity: 0; transform: translateY(24px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes ctaPulse { 0%,100% { opacity: 0.5; transform: scale(1) } 50% { opacity: 1; transform: scale(1.3) } }
        @keyframes headerFadeIn { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      {/*
        outerRef: scrollable wrapper — height controls how much scroll travel
        innerRef: sticky viewport — stays pinned at top:0 during scroll
        trackRef: the horizontal flex row that GSAP translates on X
      */}
      <div
        ref={outerRef}
        id={SECTION_IDS.projects}
        style={{
          position: 'relative',
          // outerHeight is computed client-side; fallback to 100vh on SSR
          height: outerHeight > 0 ? `${outerHeight}px` : '100vh',
        }}
      >
        <div
          ref={innerRef}
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* ── Section header ── */}
          <div style={{
            padding: '44px 48px 26px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexShrink: 0,
            animation: 'headerFadeIn 0.7s ease forwards',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                <span style={{ width: 28, height: 1, background: 'rgba(0,212,255,0.5)', display: 'block' }} />
                <span style={{ fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.5em', color: 'rgba(0,212,255,0.65)', textTransform: 'uppercase' }}>
                  Selected Work
                </span>
              </div>
              <h2 style={{
                fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
                fontWeight: 400,
                color: '#fff',
                fontFamily: 'var(--font-instrument-serif)',
                fontStyle: 'italic',
                letterSpacing: '-0.02em',
                lineHeight: 1.0,
              }}>
                Projects that{' '}
                <span className="editorial-gradient">ship.</span>
              </h2>
            </div>

            {/* Floating progress indicator */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10,
              paddingBottom: 4,
            }}>
              <span style={{
                fontSize: 28, fontWeight: 800,
                fontFamily: 'var(--font-geist-sans)',
                color: projects[activeIndex]?.color ?? '#00d4ff',
                letterSpacing: '-0.04em',
                transition: 'color 0.4s ease',
                lineHeight: 1,
              }}>
                {String(activeIndex + 1).padStart(2, '0')}
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.25)', fontWeight: 400, margin: '0 4px' }}>/</span>
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>{String(CARD_COUNT).padStart(2, '0')}</span>
              </span>
              {/* Mini progress dots */}
              <div style={{ display: 'flex', gap: 6 }}>
                {projects.map((p, i) => (
                  <span
                    key={p.id}
                    style={{
                      width: i === activeIndex ? 20 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: i === activeIndex ? (p.color) : 'rgba(255,255,255,0.15)',
                      transition: 'all 0.35s ease',
                      boxShadow: i === activeIndex ? `0 0 8px ${p.color}` : 'none',
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                scroll to explore
              </span>
            </div>
          </div>

          {/* ── Horizontal card track ── */}
          <div style={{ flex: 1, overflow: 'visible', display: 'flex', alignItems: 'center', paddingBottom: 32 }}>
            <div
              ref={trackRef}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: CARD_GAP,
                paddingLeft: TRACK_PAD,
                paddingRight: TRACK_PAD,
                willChange: 'transform',
                height: '100%',
              }}
            >
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  total={CARD_COUNT}
                  onOpen={() => setSelectedProject(project)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  )
}
