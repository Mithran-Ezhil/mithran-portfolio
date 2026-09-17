'use client'

import { useEffect, useRef, useState } from 'react'
import { SECTION_IDS } from '@/lib/constants'

const SOCIAL = [
  {
    label: 'GitHub',
    handle: '@mithran77',
    url: 'https://github.com/mithran77',
    color: '#ffffff',
    icon: <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>,
  },
  {
    label: 'LinkedIn',
    handle: 'mithran-ezhilarasan',
    url: 'https://linkedin.com/in/mithran-ezhilarasan',
    color: '#0077b5',
    icon: <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
  {
    label: 'Email',
    handle: 'ezhilarasan.m@northeastern.edu',
    url: 'mailto:ezhilarasan.m@northeastern.edu',
    color: '#87FB89',
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  },
]

export default function Contact() {
  const sectionRef  = useRef<HTMLElement>(null)
  const emailRef    = useRef<HTMLAnchorElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    import('@/lib/gsap').then(({ gsap }) => {
      gsap.fromTo(
        sectionRef.current?.querySelectorAll('.c-reveal') ?? [],
        { opacity: 0, y: 48 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.14, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }
      )
    })

    // Magnetic effect on email
    const el = emailRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.25}px)`
    }
    const onLeave = () => { el.style.transform = '' }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) }
  }, [])

  const copyEmail = () => {
    navigator.clipboard.writeText('ezhilarasan.m@northeastern.edu').catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      id={SECTION_IDS.contact}
      ref={sectionRef}
      data-section="contact"
      style={{ position: 'relative', zIndex: 1, padding: 'clamp(6rem, 12vw, 12rem) 6vw', textAlign: 'center', overflow: 'hidden' }}
    >
      {/* Ambient radial glow */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '60vw', maxWidth: 900, background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.06) 0%, rgba(135,251,137,0.03) 40%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />

      {/* Section label */}
      <div className="c-reveal" style={{ opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 40 }}>
        <span style={{ width: 48, height: 1, background: 'rgba(135,251,137,0.4)', display: 'block' }} />
        <span style={{ fontSize: 11, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.5em', color: 'rgba(135,251,137,0.55)', textTransform: 'uppercase' }}>06 — Contact</span>
        <span style={{ width: 48, height: 1, background: 'rgba(135,251,137,0.4)', display: 'block' }} />
      </div>

      {/* Main heading */}
      <h2 className="c-reveal" style={{
        opacity: 0,
        fontFamily: 'var(--font-instrument-serif)',
        fontSize: 'clamp(3rem, 9vw, 9rem)',
        fontStyle: 'italic',
        fontWeight: 400,
        color: '#fff',
        lineHeight: 0.95,
        letterSpacing: '-0.03em',
        marginBottom: 24,
      }}>
        Let&apos;s build<br />
        <span style={{ background: 'linear-gradient(90deg, #87FB89 0%, #00ffcc 60%, #00d4ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          something great.
        </span>
      </h2>

      <p className="c-reveal" style={{ opacity: 0, fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', color: 'rgba(255,255,255,0.42)', maxWidth: 520, margin: '0 auto 60px', lineHeight: 1.75 }}>
        Open to Data Engineering, Analytics Engineering, and Data Platform roles starting May 2026. If you&apos;re building something interesting — let&apos;s talk.
      </p>

      {/* Giant email link */}
      <a
        ref={emailRef}
        href="mailto:ezhilarasan.m@northeastern.edu"
        className="c-reveal"
        style={{
          opacity: 0,
          display: 'inline-block',
          fontSize: 'clamp(1rem, 2.8vw, 2rem)',
          fontFamily: 'var(--font-geist-mono)',
          color: 'rgba(255,255,255,0.85)',
          textDecoration: 'none',
          letterSpacing: '-0.02em',
          padding: '20px 44px',
          borderRadius: 60,
          border: '1px solid rgba(135,251,137,0.2)',
          background: 'rgba(135,251,137,0.04)',
          transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1), transform 0.15s ease',
          marginBottom: 48,
          backdropFilter: 'blur(16px)',
          position: 'relative',
        }}
        onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'rgba(135,251,137,0.08)'; el.style.borderColor = 'rgba(135,251,137,0.5)'; el.style.color = '#87FB89'; el.style.boxShadow = '0 0 60px rgba(135,251,137,0.15), 0 8px 40px rgba(0,0,0,0.4)' }}
        onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'rgba(135,251,137,0.04)'; el.style.borderColor = 'rgba(135,251,137,0.2)'; el.style.color = 'rgba(255,255,255,0.85)'; el.style.boxShadow = '' }}
      >
        ezhilarasan.m@northeastern.edu
        <span style={{ marginLeft: 12, opacity: 0.5, fontSize: '0.75em' }}>↗</span>
      </a>

      {/* Copy email button */}
      <div className="c-reveal" style={{ opacity: 0, marginBottom: 64 }}>
        <button
          onClick={copyEmail}
          style={{
            fontSize: 12, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.2em',
            color: copied ? '#87FB89' : 'rgba(255,255,255,0.3)',
            background: 'transparent', border: 'none', cursor: 'none',
            transition: 'color 0.3s', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto',
          }}
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          {copied ? 'Copied!' : 'Copy email'}
        </button>
      </div>

      {/* Social links */}
      <div className="c-reveal" style={{ opacity: 0, display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 80 }}>
        {SOCIAL.map(s => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 24px', borderRadius: 50,
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.55)',
              fontSize: 14, textDecoration: 'none',
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-geist-sans)',
            }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = `${s.color}55`; el.style.color = s.color; el.style.background = `${s.color}0c`; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = `0 12px 32px ${s.color}18` }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(255,255,255,0.1)'; el.style.color = 'rgba(255,255,255,0.55)'; el.style.background = 'rgba(255,255,255,0.03)'; el.style.transform = ''; el.style.boxShadow = '' }}
          >
            {s.icon}
            <span>{s.label}</span>
            <span style={{ opacity: 0.4, fontSize: 11 }}>{s.handle}</span>
          </a>
        ))}
      </div>

      {/* Footer */}
      <div className="c-reveal" style={{ opacity: 0, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, maxWidth: 800, margin: '0 auto' }}>
          <span style={{ fontSize: 12, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
            Boston, MA · 857-339-8622
          </span>
          <span style={{ fontSize: 12, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.08em' }}>
            © 2026 Mithran Ezhilarasan
          </span>
          <span style={{ fontSize: 12, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
            Built with Next.js &amp; GSAP
          </span>
        </div>
      </div>
    </section>
  )
}
