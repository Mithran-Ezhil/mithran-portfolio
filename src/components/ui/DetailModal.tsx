'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { DetailBlock } from '@/types'

/**
 * Shared chrome for the Projects / Experience / Research detail modals.
 *
 * Everything fiddly about overlaying this site lives here on purpose — each of
 * these was a real bug once, and having three copies is how they come back:
 *
 *  - Portalled to <body>. The sections live inside `main` (z-10), which is a
 *    stacking context, so a z-index set from in there can never beat the fixed
 *    z-50 navbar.
 *  - z-index 9990. Site layers: MotionLayer 30, Navbar/NoiseOverlay 50,
 *    ScrollProgress 100, .scanline 9995, CustomCursor 9999, LoadingScreen
 *    99999. globals.css sets `* { cursor: none !important }`, so the cursor IS
 *    the canvas — go above 9999 and the pointer vanishes over the modal and the
 *    close button becomes unfindable.
 *  - Wheel is handled explicitly. Lenis owns wheel events document-wide and
 *    keeps calling preventDefault even while stopped, so native scrolling
 *    inside the panel is not dependable. `data-lenis-prevent` keeps Lenis off
 *    the panel; lenis.stop() freezes the page behind it.
 */

const MODAL_Z = 9990

export interface DetailModalProps {
  accent: string
  onClose: () => void
  title: string
  /** Italic line under the title */
  subtitle?: string
  /** Small line under the subtitle, e.g. a location or affiliation */
  meta?: React.ReactNode
  /** Pills rendered in the header band */
  pills?: React.ReactNode
  /** Optional right-hand header element, e.g. the project icon */
  headerAside?: React.ReactNode
  maxWidth?: number
  children: React.ReactNode
}

export default function DetailModal({
  accent,
  onClose,
  title,
  subtitle,
  meta,
  pills,
  headerAside,
  maxWidth = 780,
  children,
}: DetailModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      el.scrollTop += e.deltaY
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    // Focus so PageUp/PageDown/arrows scroll the panel too.
    el.focus({ preventScroll: true })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis
    lenis?.stop()
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
      lenis?.start()
    }
  }, [onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: MODAL_Z,
        background: 'rgba(3,7,16,0.55)', backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: 'clamp(1rem, 4vh, 3rem) 1.5rem',
        animation: 'detailBackdropIn 0.25s ease forwards',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <style>{`
        @keyframes detailBackdropIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes detailPanelIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }
      `}</style>

      <div
        ref={panelRef}
        data-lenis-prevent
        tabIndex={-1}
        style={{
          width: '100%', maxWidth, maxHeight: '100%',
          overflowY: 'auto', overscrollBehavior: 'contain', outline: 'none',
          background: 'rgba(0,6,16,0.985)',
          border: `1px solid ${accent}33`, borderRadius: 20,
          boxShadow: `0 0 80px ${accent}22, 0 30px 90px rgba(0,0,0,0.6)`,
          animation: 'detailPanelIn 0.35s cubic-bezier(0.22,1,0.36,1) forwards',
        }}
      >
        {/* Header band */}
        <div style={{
          position: 'relative',
          background: `linear-gradient(135deg, ${accent}22, ${accent}08)`,
          borderRadius: '20px 20px 0 0',
          padding: '32px 34px 24px',
        }}>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: 16, right: 16, width: 36, height: 36,
              borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)',
              fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'none',
            }}
          >
            ×
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
            <div style={{ minWidth: 0 }}>
              {pills && (
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 14, paddingRight: 34 }}>
                  {pills}
                </div>
              )}
              <h2 style={{
                fontSize: 'clamp(1.35rem, 2.6vw, 1.75rem)', fontWeight: 800, color: '#fff',
                marginBottom: subtitle || meta ? 7 : 0,
                fontFamily: 'var(--font-geist-sans)', lineHeight: 1.22,
              }}>
                {title}
              </h2>
              {subtitle && (
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                  {subtitle}
                </p>
              )}
              {meta && (
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', margin: subtitle ? '6px 0 0' : 0, fontFamily: 'monospace' }}>
                  {meta}
                </p>
              )}
            </div>
            {headerAside && <div style={{ flexShrink: 0 }}>{headerAside}</div>}
          </div>
        </div>

        <div style={{ padding: '28px 34px 34px' }}>{children}</div>
      </div>
    </div>,
    document.body
  )
}

// ─── Shared building blocks ────────────────────────────────────────────────────

export function ModalLabel({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <h4 style={{
      fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.3em',
      color: accent, textTransform: 'uppercase', marginBottom: 12,
    }}>
      {children}
    </h4>
  )
}

export function Pill({ accent, children, muted }: { accent: string; children: React.ReactNode; muted?: boolean }) {
  return (
    <span style={{
      fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.12em',
      background: muted ? 'rgba(255,255,255,0.04)' : `${accent}22`,
      border: `1px solid ${muted ? 'rgba(255,255,255,0.1)' : `${accent}44`}`,
      color: muted ? 'rgba(255,255,255,0.5)' : accent,
      padding: '4px 12px', borderRadius: 20,
      textTransform: muted ? 'none' : 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}

export function MetricGrid({ accent, metrics }: { accent: string; metrics: [string, string][] }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 1,
      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10, overflow: 'hidden',
    }}>
      {metrics.map(([label, value]) => (
        <div key={label} style={{ background: 'rgba(0,6,16,0.985)', padding: '12px 14px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: accent, fontFamily: 'var(--font-geist-mono, monospace)', marginBottom: 3 }}>
            {value}
          </div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}

export function DetailBlocks({ accent, blocks }: { accent: string; blocks: DetailBlock[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {blocks.map((block) => (
        <div
          key={block.label}
          style={{
            padding: '18px 20px', background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12,
            borderLeft: `2px solid ${accent}55`,
          }}
        >
          <h5 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: '-0.01em' }}>
            {block.label}
          </h5>

          {block.body && (
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>
              {block.body}
            </p>
          )}

          {block.flow && (
            <div style={{
              marginTop: block.body ? 12 : 0, padding: '10px 12px',
              background: `${accent}0c`, border: `1px solid ${accent}22`,
              borderRadius: 8, overflowX: 'auto',
            }}>
              <code style={{ fontSize: 11.5, color: accent, fontFamily: 'var(--font-geist-mono, monospace)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {block.flow}
              </code>
            </div>
          )}

          {block.items && (
            <div style={{ marginTop: (block.body || block.flow) ? 12 : 0, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {block.items.map((item) => (
                <span key={item} style={{
                  fontSize: 11.5, padding: '4px 10px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  color: 'rgba(255,255,255,0.5)',
                }}>
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export function TagRow({ accent, tags }: { accent: string; tags: string[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {tags.map((tag) => (
        <span key={tag} style={{
          fontSize: 12, padding: '5px 14px', borderRadius: 20,
          background: `${accent}10`, border: `1px solid ${accent}30`,
          color: accent, fontFamily: 'monospace',
        }}>
          {tag}
        </span>
      ))}
    </div>
  )
}
