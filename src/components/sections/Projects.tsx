'use client'

import { useEffect, useRef, useState } from 'react'
import { projects } from '@/data/projects'
import { SECTION_IDS } from '@/lib/constants'
import HoverLightReveal from '@/components/ui/HoverLightReveal'

// Extended type for our enhanced project data
interface ProjectFull {
  id: string
  title: string
  description: string
  tags: string[]
  color: string
  githubUrl?: string
  liveUrl?: string
  highlights?: string[]
  impact?: string
  role?: string
}

const PROJECT_VISUALS = [
  {
    gradient: 'linear-gradient(135deg, #003d60 0%, #006688 40%, #00d4ff22 100%)',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <circle cx="32" cy="32" r="28" stroke="#00d4ff" strokeWidth="1" strokeDasharray="4 4" opacity="0.5"/>
        <polyline points="8,40 18,28 26,34 36,20 46,26 56,14" stroke="#00d4ff" strokeWidth="2" fill="none"/>
        <circle cx="18" cy="28" r="3" fill="#00d4ff"/>
        <circle cx="36" cy="20" r="3" fill="#00ffcc"/>
        <circle cx="56" cy="14" r="3" fill="#00d4ff"/>
        <rect x="10" y="44" width="8" height="8" fill="#00d4ff" opacity="0.6"/>
        <rect x="22" y="38" width="8" height="14" fill="#00d4ff" opacity="0.5"/>
        <rect x="34" y="32" width="8" height="20" fill="#00d4ff" opacity="0.4"/>
        <rect x="46" y="36" width="8" height="16" fill="#00d4ff" opacity="0.3"/>
      </svg>
    ),
  },
  {
    gradient: 'linear-gradient(135deg, #001a3a 0%, #003366 40%, #0ea5e922 100%)',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <circle cx="32" cy="32" r="14" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.7"/>
        <circle cx="32" cy="32" r="22" stroke="#0ea5e9" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4"/>
        {([[16,16],[48,16],[32,52],[16,40],[48,40]] as [number,number][]).map(([x,y],i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="3" fill="#0ea5e9" opacity="0.8"/>
            <line x1={x} y1={y} x2="32" y2="32" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.3"/>
          </g>
        ))}
        <circle cx="32" cy="32" r="5" fill="#0ea5e9" opacity="0.9"/>
        <text x="32" y="36" textAnchor="middle" fill="white" fontSize="6" fontFamily="monospace" opacity="0.8">AI</text>
      </svg>
    ),
  },
  {
    gradient: 'linear-gradient(135deg, #001428 0%, #002244 40%, #22d3ee22 100%)',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <rect x="8" y="12" width="48" height="40" rx="4" stroke="#22d3ee" strokeWidth="1" opacity="0.5"/>
        {[20,30,40,50].map((x,i) => (
          <rect key={i} x={x-3} y={28-(i*3)} width="6" height={24+(i*3)} rx="1" fill="#22d3ee" opacity={0.3+i*0.15}/>
        ))}
        <polyline points="8,38 16,30 24,34 32,24 40,28 56,16" stroke="#22d3ee" strokeWidth="1.5" fill="none"/>
        <circle cx="56" cy="16" r="3" fill="#22d3ee"/>
      </svg>
    ),
  },
  {
    gradient: 'linear-gradient(135deg, #001020 0%, #002040 40%, #38bdf822 100%)',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <ellipse cx="32" cy="32" rx="24" ry="12" stroke="#38bdf8" strokeWidth="1" opacity="0.6"/>
        <ellipse cx="32" cy="32" rx="24" ry="12" stroke="#38bdf8" strokeWidth="1" opacity="0.3" transform="rotate(60 32 32)"/>
        <ellipse cx="32" cy="32" rx="24" ry="12" stroke="#38bdf8" strokeWidth="1" opacity="0.3" transform="rotate(-60 32 32)"/>
        <circle cx="32" cy="32" r="5" fill="#38bdf8" opacity="0.9"/>
        {([[52,32],[42,40.66],[22,40.66],[12,32],[22,23.34],[42,23.34]] as [number,number][]).map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="2.5" fill="#38bdf8" opacity="0.7"/>
        ))}
      </svg>
    ),
  },
]

// Modal component
function ProjectModal({ project, visual, onClose }: {
  project: ProjectFull,
  visual: typeof PROJECT_VISUALS[0],
  onClose: () => void
}) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
        animation: 'modalBackdropIn 0.25s ease forwards',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={modalRef}
        style={{
          width: '100%', maxWidth: 760,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'rgba(0,6,16,0.97)',
          border: `1px solid ${project.color}33`,
          borderRadius: 20,
          boxShadow: `0 0 60px ${project.color}22, 0 0 120px ${project.color}0a, inset 0 0 30px rgba(0,0,0,0.5)`,
          animation: 'modalPanelIn 0.3s cubic-bezier(0.22,1,0.36,1) forwards',
        }}
      >
        {/* Modal header image */}
        <div style={{ position: 'relative', height: 180, background: visual.gradient, overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 48, opacity: 0.7 }}>
            <div style={{ width: 140, height: 140 }}>{visual.icon}</div>
          </div>
          {/* Scanline grid */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(0deg, transparent 50%, rgba(255,255,255,0.5) 50%)', backgroundSize: '100% 4px' }} />
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.8)',
              fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'none', transition: 'all 0.2s',
            }}
          >
            ×
          </button>
          {/* Role badge */}
          {project.role && (
            <div style={{ position: 'absolute', bottom: 16, left: 24 }}>
              <span style={{
                fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.15em',
                background: `${project.color}22`, border: `1px solid ${project.color}44`,
                color: project.color, padding: '4px 12px', borderRadius: 20,
                textTransform: 'uppercase',
              }}>
                {project.role}
              </span>
            </div>
          )}
        </div>

        {/* Modal body */}
        <div style={{ padding: '32px 36px 36px' }}>
          <h2 style={{
            fontSize: 28, fontWeight: 800, color: '#fff',
            marginBottom: 12,
            fontFamily: 'var(--font-geist-sans)',
          }}>
            {project.title}
          </h2>

          {/* Impact stat */}
          {project.impact && (
            <div style={{
              padding: '12px 16px', marginBottom: 20,
              background: `${project.color}0c`,
              border: `1px solid ${project.color}22`,
              borderRadius: 10,
              borderLeft: `3px solid ${project.color}`,
            }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>
                {project.impact}
              </p>
            </div>
          )}

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 24 }}>
            {project.description}
          </p>

          {/* Highlights */}
          {project.highlights && (
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.3em', color: project.color, textTransform: 'uppercase', marginBottom: 12 }}>
                KEY HIGHLIGHTS
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {project.highlights.map((h, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: project.color, fontSize: 14, marginTop: 2, flexShrink: 0 }}>▸</span>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech tags */}
          <div style={{ marginBottom: 28 }}>
            <h4 style={{ fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.3em', color: project.color, textTransform: 'uppercase', marginBottom: 12 }}>
              TECH STACK
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {project.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    fontSize: 12, padding: '5px 14px', borderRadius: 20,
                    background: `${project.color}10`,
                    border: `1px solid ${project.color}30`,
                    color: project.color,
                    fontFamily: 'monospace',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            {project.githubUrl && project.githubUrl !== '#' && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 22px', borderRadius: 40,
                  background: `${project.color}14`,
                  border: `1px solid ${project.color}44`,
                  color: project.color,
                  fontSize: 13, fontWeight: 600, textDecoration: 'none',
                  transition: 'all 0.25s',
                }}
              >
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const [selectedProject, setSelectedProject] = useState<ProjectFull | null>(null)
  const [selectedVisualIdx, setSelectedVisualIdx] = useState(0)

  useEffect(() => {
    import('@/lib/gsap').then(({ gsap }) => {
      const cards = sectionRef.current?.querySelectorAll('.project-card')
      if (!cards) return
      gsap.fromTo(cards,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
    })

    const handleTilt = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement
      const rect = card.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2
      card.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) scale(1.025)`
      const shine = card.querySelector('.card-shine') as HTMLElement | null
      if (shine) shine.style.background = `radial-gradient(circle at ${(x+1)*50}% ${(y+1)*50}%, rgba(0,212,255,0.10) 0%, transparent 70%)`
    }
    const resetTilt = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement
      card.style.transform = ''
      const shine = card.querySelector('.card-shine') as HTMLElement | null
      if (shine) shine.style.background = 'transparent'
    }
    const cards2 = sectionRef.current?.querySelectorAll('.project-card')
    cards2?.forEach(c => {
      c.addEventListener('mousemove', handleTilt as EventListener)
      c.addEventListener('mouseleave', resetTilt as EventListener)
    })
    return () => {
      cards2?.forEach(c => {
        c.removeEventListener('mousemove', handleTilt as EventListener)
        c.removeEventListener('mouseleave', resetTilt as EventListener)
      })
    }
  }, [])

  const openProject = (project: ProjectFull, visualIdx: number) => {
    setSelectedProject(project)
    setSelectedVisualIdx(visualIdx)
  }

  return (
    <section
      id={SECTION_IDS.projects}
      ref={sectionRef}
      data-section="projects"
      className="relative py-32 px-8 md:px-16 max-w-7xl mx-auto"
      style={{ zIndex: 1 }}
    >
      {/* Section header */}
      <div className="mb-16 reveal-up">
        <div className="flex items-center gap-4 mb-5">
          <span className="w-8 h-px bg-accent/60" />
          <span className="text-xs font-mono tracking-[0.5em] text-accent/70 uppercase">Selected Work</span>
        </div>
        <h2
          className="font-bold tracking-tight text-white"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontFamily: 'var(--font-geist-sans)' }}
        >
          Projects that{' '}
          <span style={{
            background: 'linear-gradient(90deg, #00d4ff, #00ffcc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            ship.
          </span>
        </h2>
      </div>

      {/* Featured project */}
      {(projects as ProjectFull[]).slice(0, 1).map((project, i) => (
        <div
          key={project.id}
          className="project-card group relative rounded-2xl overflow-hidden mb-6 cursor-pointer"
          style={{ opacity: 0, transition: 'transform 0.35s cubic-bezier(0.23,1,0.32,1), box-shadow 0.35s ease', willChange: 'transform' }}
          onClick={() => openProject(project, i)}
        >
          <div className="card-shine absolute inset-0 z-10 pointer-events-none rounded-2xl transition-all duration-300" />
          {/* Hover glow border */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: `inset 0 0 0 1px ${project.color}55, 0 0 40px ${project.color}18` }} />

          <HoverLightReveal radius={180} darknessBase={0.75} className="relative h-56 md:h-72" style={{ background: PROJECT_VISUALS[i].gradient }}>
            <div className="absolute inset-0 flex items-end p-8">
              <div className="absolute inset-0 flex items-center justify-end pr-12 opacity-60">
                <div className="w-48 h-48">{PROJECT_VISUALS[i].icon}</div>
              </div>
              <div className="absolute inset-0 opacity-[0.06]">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="absolute h-full w-px bg-white" style={{ left: `${j * 20}%` }} />
                ))}
              </div>
              <div className="relative z-10 flex items-center gap-3">
                <span className="text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent">
                  Featured
                </span>
                <span className="text-xs text-white/50 font-mono">01</span>
              </div>
            </div>
          </HoverLightReveal>

          <div className="p-8 border border-t-0 rounded-b-2xl" style={{ background: 'rgba(0, 8, 20, 0.92)', borderColor: 'rgba(0,212,255,0.12)', backdropFilter: 'blur(24px)' }}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-accent transition-colors duration-300">{project.title}</h3>
                <p className="text-white/55 leading-relaxed mb-5 max-w-2xl">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full font-mono" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.18)', color: 'rgba(0,212,255,0.8)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* View Details CTA */}
              <div className="flex items-center gap-3 shrink-0">
                <div
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ borderColor: 'rgba(0,212,255,0.4)', color: '#00d4ff', background: 'rgba(0,212,255,0.08)' }}
                >
                  View Details →
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Grid of remaining projects */}
      <div className="grid md:grid-cols-3 gap-5">
        {(projects as ProjectFull[]).slice(1).map((project, i) => {
          const vi = i + 1
          return (
            <div
              key={project.id}
              className="project-card group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{ opacity: 0, transition: 'transform 0.35s cubic-bezier(0.23,1,0.32,1), box-shadow 0.35s ease', willChange: 'transform' }}
              onClick={() => openProject(project, vi)}
            >
              <div className="card-shine absolute inset-0 z-10 pointer-events-none rounded-2xl transition-all duration-300" />
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: `inset 0 0 0 1px ${project.color}44, 0 0 30px ${project.color}14` }} />

              <HoverLightReveal radius={180} darknessBase={0.75} className="relative h-36" style={{ background: PROJECT_VISUALS[vi]?.gradient ?? PROJECT_VISUALS[0].gradient }}>
                <div className="absolute inset-0 flex items-end p-5">
                  <div className="absolute inset-0 flex items-center justify-end pr-6 opacity-50">
                    <div className="w-28 h-28">{PROJECT_VISUALS[vi]?.icon ?? PROJECT_VISUALS[0].icon}</div>
                  </div>
                  <span className="relative z-10 text-xs font-mono text-white/40">0{i + 2}</span>
                </div>
              </HoverLightReveal>

              <div className="p-6 border border-t-0 rounded-b-2xl h-full" style={{ background: 'rgba(0, 8, 20, 0.92)', borderColor: 'rgba(0,212,255,0.10)', backdropFilter: 'blur(24px)' }}>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors duration-300">{project.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed mb-4 line-clamp-3">{project.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[11px] px-2.5 py-0.5 rounded-full font-mono" style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.15)', color: 'rgba(0,212,255,0.7)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-accent/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 ml-2">
                    Details →
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          visual={PROJECT_VISUALS[selectedVisualIdx] ?? PROJECT_VISUALS[0]}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  )
}
