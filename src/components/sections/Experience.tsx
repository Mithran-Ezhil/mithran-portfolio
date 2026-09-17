'use client'

import { useEffect, useRef, useState } from 'react'
import { experiences, type ExperienceFull } from '@/data/experience'
import { SECTION_IDS } from '@/lib/constants'
import DetailModal, { ModalLabel, MetricGrid, DetailBlocks, TagRow, Pill } from '@/components/ui/DetailModal'

const EDU = [
  { school: 'Northeastern University', degree: 'MS Information Systems', detail: 'GPA 3.67 · Expected May 2026', location: 'Boston, MA', icon: '🎓' },
  { school: 'Rajalakshmi Engineering College', degree: 'BE Computer Science', detail: 'Graduated 2024', location: 'Chennai, India', icon: '🏛️' },
]

// ─── Role detail modal ─────────────────────────────────────────────────────────

function ExperienceModal({ exp, onClose }: { exp: ExperienceFull; onClose: () => void }) {
  const c = exp.color
  return (
    <DetailModal
      accent={c}
      onClose={onClose}
      title={exp.role}
      meta={`\u{1F4CD} ${exp.location}`}
      maxWidth={780}
      pills={
        <>
          <Pill accent={c}>{exp.company}</Pill>
          <Pill accent={c} muted>{exp.duration}</Pill>
          {exp.current && (
            <span style={{
              fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.1em',
              background: 'rgba(135,251,137,0.12)', border: '1px solid rgba(135,251,137,0.3)',
              color: '#87FB89', padding: '4px 12px', borderRadius: 20, whiteSpace: 'nowrap',
            }}>
              Current
            </span>
          )}
        </>
      }
    >
      <div style={{ marginBottom: 26 }}>
        <ModalLabel accent={c}>Overview</ModalLabel>
        {exp.overview.map((p, i) => (
          <p key={i} style={{
            fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.78,
            marginBottom: i === exp.overview.length - 1 ? 0 : 14,
          }}>
            {p}
          </p>
        ))}
      </div>

      <div style={{ marginBottom: 26 }}>
        <ModalLabel accent={c}>At a Glance</ModalLabel>
        <MetricGrid accent={c} metrics={exp.metrics} />
      </div>

      <div style={{ marginBottom: 26 }}>
        <DetailBlocks accent={c} blocks={exp.details} />
      </div>

      <div>
        <ModalLabel accent={c}>{exp.techLabel}</ModalLabel>
        <TagRow accent={c} tags={exp.technologies} />
      </div>
    </DetailModal>
  )
}

// ─── Section ───────────────────────────────────────────────────────────────────

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const [selected, setSelected] = useState<ExperienceFull | null>(null)

  useEffect(() => {
    import('@/lib/gsap').then(({ gsap }) => {
      gsap.fromTo(
        sectionRef.current?.querySelectorAll('.reveal-item') ?? [],
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
    })
  }, [])

  return (
    <section
      id={SECTION_IDS.experience}
      ref={sectionRef}
      data-section="experience"
      className="relative py-32 px-8 md:px-16 max-w-7xl mx-auto"
      style={{ zIndex: 1 }}
    >
      {/* Header */}
      <div className="mb-16 reveal-item">
        <div className="flex items-center gap-4 mb-5">
          <span className="w-8 h-px bg-accent/60" />
          <span className="text-xs font-mono tracking-[0.5em] text-accent/70 uppercase">Experience</span>
        </div>
        <h2
          className="text-white"
          style={{
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            fontFamily: 'var(--font-instrument-serif)',
            fontStyle: 'italic', fontWeight: 400,
            letterSpacing: '-0.02em', lineHeight: 1.02,
          }}
        >
          Where I&apos;ve{' '}
          <span className="editorial-gradient">worked.</span>
        </h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Timeline */}
        <div className="lg:col-span-2 space-y-0">
          {experiences.map((exp, i) => (
            <div
              key={exp.id}
              className="reveal-item relative flex gap-6 pb-10"
            >
              {/* Timeline line */}
              <div className="flex flex-col items-center pt-1.5">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{
                    background: exp.color,
                    boxShadow: `0 0 0 4px ${exp.color}26, 0 0 12px ${exp.color}b3`,
                  }}
                />
                {i < experiences.length - 1 && (
                  <div
                    className="w-px flex-1 mt-2"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(0,212,255,0.3), rgba(0,212,255,0.05))',
                    }}
                  />
                )}
              </div>

              {/* Card */}
              <div
                className="flex-1 p-6 rounded-2xl border mb-2 group hover:border-accent/30 transition-all duration-300 hover-lift card-glow-cyan"
                style={{
                  background: 'rgba(0, 8, 20, 0.7)',
                  borderColor: 'rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{exp.role}</h3>
                    <p className="text-sm font-medium mt-0.5" style={{ color: exp.color }}>
                      {exp.company}
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}> · {exp.location}</span>
                    </p>
                  </div>
                  <span
                    className="text-xs font-mono px-3 py-1 rounded-full"
                    style={{
                      background: 'rgba(0,212,255,0.08)',
                      color: 'rgba(0,212,255,0.7)',
                      border: '1px solid rgba(0,212,255,0.15)',
                    }}
                  >
                    {exp.duration}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {exp.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full font-mono"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.45)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* More details trigger */}
                <button
                  onClick={() => setSelected(exp)}
                  data-hover
                  className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.12em] uppercase px-4 py-2 rounded-full transition-all duration-200 hover:brightness-125"
                  style={{
                    background: `${exp.color}12`,
                    border: `1px solid ${exp.color}35`,
                    color: exp.color,
                    cursor: 'none',
                  }}
                >
                  <span
                    style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: exp.color,
                      boxShadow: `0 0 8px ${exp.color}`,
                      display: 'inline-block',
                    }}
                  />
                  More details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Education */}
        <div className="space-y-5">
          <p
            className="text-xs font-mono tracking-[0.5em] uppercase mb-6 reveal-item"
            style={{ color: 'rgba(0,212,255,0.6)' }}
          >
            Education
          </p>
          {EDU.map((edu) => (
            <div
              key={edu.school}
              className="reveal-item p-6 rounded-2xl border"
              style={{
                background: 'rgba(0, 8, 20, 0.75)',
                borderColor: 'rgba(0,212,255,0.10)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="text-2xl mb-4">{edu.icon}</div>
              <div className="text-white font-semibold text-sm mb-1">{edu.school}</div>
              <div className="text-sm font-medium mb-1" style={{ color: '#00d4ff' }}>{edu.degree}</div>
              <div className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {edu.detail}
              </div>
              <div
                className="mt-4 text-xs font-mono px-3 py-1 rounded-full inline-block"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.35)',
                }}
              >
                📍 {edu.location}
              </div>
            </div>
          ))}

          {/* Quick stats */}
          <div
            className="reveal-item p-6 rounded-2xl border mt-4"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(0,255,204,0.03))',
              borderColor: 'rgba(0,212,255,0.15)',
            }}
          >
            <p className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: 'rgba(0,212,255,0.6)' }}>
              Quick Stats
            </p>
            {[
              ['Monthly volume reconciled', '$1B+'],
              ['Supplier records migrated', '100K+'],
              ['Settlement transactions', '4M+'],
              ['First-pass match accuracy', '~95%'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 py-2 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{k}</span>
                <span className="text-xs font-mono font-bold text-accent whitespace-nowrap">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selected && <ExperienceModal exp={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
