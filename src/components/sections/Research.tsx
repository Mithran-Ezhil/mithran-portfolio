'use client'

import { useEffect, useRef, useState } from 'react'
import { publications, type Publication } from '@/data/publications'
import { SECTION_IDS } from '@/lib/constants'
import DetailModal, { ModalLabel, MetricGrid, DetailBlocks, TagRow, Pill } from '@/components/ui/DetailModal'

// ─── Publication modal ─────────────────────────────────────────────────────────

function PublicationModal({ pub, onClose }: { pub: Publication; onClose: () => void }) {
  const c = pub.color
  return (
    <DetailModal
      accent={c}
      onClose={onClose}
      title={pub.title}
      subtitle={pub.subtitle}
      meta={pub.affiliation}
      maxWidth={800}
      pills={<><Pill accent={c}>{pub.badge}</Pill><Pill accent={c} muted>{pub.type}</Pill></>}
    >
      <div style={{ marginBottom: 26 }}>
        <ModalLabel accent={c}>Authors</ModalLabel>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.7 }}>
          {pub.authors.map((a, i) => (
            <span key={a}>
              <span style={i === 0 ? { color: c, fontWeight: 600 } : undefined}>{a}</span>
              {i < pub.authors.length - 1 && <span style={{ color: 'rgba(255,255,255,0.3)' }}>, </span>}
            </span>
          ))}
        </p>
      </div>

      <div style={{ marginBottom: 26 }}>
        <ModalLabel accent={c}>Abstract</ModalLabel>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.78, margin: 0 }}>
          {pub.abstract}
        </p>
      </div>

      <div style={{ marginBottom: 26 }}>
        <ModalLabel accent={c}>At a Glance</ModalLabel>
        <MetricGrid accent={c} metrics={pub.metrics} />
      </div>

      <div style={{ marginBottom: 26 }}>
        <DetailBlocks accent={c} blocks={pub.details} />
      </div>

      <div>
        <ModalLabel accent={c}>Methods &amp; Tools</ModalLabel>
        <TagRow accent={c} tags={pub.tags} />
      </div>
    </DetailModal>
  )
}

// ─── Section ───────────────────────────────────────────────────────────────────

export default function Research() {
  const sectionRef = useRef<HTMLElement>(null)
  const [selected, setSelected] = useState<Publication | null>(null)

  useEffect(() => {
    import('@/lib/gsap').then(({ gsap }) => {
      gsap.fromTo(
        sectionRef.current?.querySelectorAll('.reveal-item') ?? [],
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        }
      )
    })
  }, [])

  return (
    <section
      id={SECTION_IDS.research}
      ref={sectionRef}
      data-section="research"
      className="relative py-28 px-8 md:px-16 max-w-7xl mx-auto"
      style={{ zIndex: 1 }}
    >
      {/* Header */}
      <div className="mb-12 reveal-item">
        <div className="flex items-center gap-4 mb-5">
          <span className="w-8 h-px" style={{ background: 'rgba(240,171,252,0.6)' }} />
          <span className="text-xs font-mono tracking-[0.5em] uppercase" style={{ color: 'rgba(240,171,252,0.7)' }}>
            Research
          </span>
        </div>
        <h2
          className="text-white"
          style={{
            fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
            fontFamily: 'var(--font-instrument-serif)',
            fontStyle: 'italic', fontWeight: 400,
            letterSpacing: '-0.02em', lineHeight: 1.02,
          }}
        >
          Published{' '}
          <span className="editorial-gradient">work.</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {publications.map((pub) => {
          const c = pub.color
          return (
            <article
              key={pub.id}
              className="reveal-item rounded-2xl border p-7 flex flex-col"
              style={{
                background: `linear-gradient(145deg, rgba(0,8,20,0.8) 0%, ${c}0a 65%, rgba(0,3,10,0.92) 100%)`,
                borderColor: `${c}22`,
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex items-center gap-2 flex-wrap mb-5">
                <span
                  className="text-[10px] font-mono tracking-[0.15em] uppercase px-3 py-1 rounded-full"
                  style={{ background: `${c}1f`, border: `1px solid ${c}3d`, color: c }}
                >
                  {pub.badge}
                </span>
                <span
                  className="text-[10px] font-mono tracking-[0.1em] px-3 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.42)' }}
                >
                  {pub.type}
                </span>
              </div>

              <h3
                className="text-white mb-3"
                style={{ fontSize: 'clamp(1.15rem, 2vw, 1.4rem)', fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.01em' }}
              >
                {pub.title}
              </h3>

              <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                {pub.authors.map((a, i) => (
                  <span key={a}>
                    <span style={i === 0 ? { color: c, fontWeight: 600 } : undefined}>{a}</span>
                    {i < pub.authors.length - 1 && <span style={{ color: 'rgba(255,255,255,0.28)' }}>, </span>}
                  </span>
                ))}
              </p>

              <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                {pub.summary}
              </p>

              <ul className="list-none p-0 m-0 mb-6 space-y-2.5">
                {pub.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <span
                      className="block shrink-0 rounded-full mt-[7px]"
                      style={{ width: 5, height: 5, background: c, boxShadow: `0 0 8px ${c}` }}
                    />
                    <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <div className="h-px mb-5" style={{ background: `linear-gradient(90deg, ${c}30, transparent)` }} />
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex flex-wrap gap-2">
                    {pub.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="text-[11px] px-3 py-1 rounded-full font-mono"
                        style={{ background: `${c}0e`, border: `1px solid ${c}28`, color: c }}
                      >
                        {tag}
                      </span>
                    ))}
                    {pub.tags.length > 3 && (
                      <span className="text-[11px] font-mono self-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        +{pub.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setSelected(pub)}
                    data-hover
                    className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.12em] uppercase px-4 py-2 rounded-full transition-all duration-200 hover:brightness-125"
                    style={{ background: `${c}12`, border: `1px solid ${c}35`, color: c, cursor: 'none' }}
                  >
                    <span
                      className="inline-block rounded-full"
                      style={{ width: 5, height: 5, background: c, boxShadow: `0 0 8px ${c}` }}
                    />
                    More details
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {selected && <PublicationModal pub={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
