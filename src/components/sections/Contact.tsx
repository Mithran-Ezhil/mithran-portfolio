'use client'

import { useEffect, useRef } from 'react'
import { SECTION_IDS } from '@/lib/constants'

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    import('@/lib/gsap').then(({ gsap }) => {
      gsap.fromTo(
        sectionRef.current?.querySelectorAll('.reveal-item') ?? [],
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
    })
  }, [])

  return (
    <section
      id={SECTION_IDS.contact}
      ref={sectionRef}
      data-section="contact"
      className="relative py-40 px-8 md:px-16 max-w-7xl mx-auto text-center"
      style={{ zIndex: 1 }}
    >
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 80%, rgba(0,212,255,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="reveal-item flex items-center justify-center gap-4 mb-8">
        <span className="w-8 h-px bg-accent/60" />
        <span className="text-xs font-mono tracking-[0.5em] text-accent/70 uppercase">Get in Touch</span>
        <span className="w-8 h-px bg-accent/60" />
      </div>

      <h2
        className="reveal-item font-bold tracking-tight text-white mb-6"
        style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontFamily: 'var(--font-geist-sans)' }}
      >
        Let&apos;s build something{' '}
        <span style={{
          background: 'linear-gradient(90deg, #00d4ff, #00ffcc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          great.
        </span>
      </h2>

      <p
        className="reveal-item text-lg max-w-lg mx-auto mb-14"
        style={{ color: 'rgba(255,255,255,0.45)' }}
      >
        I&apos;m actively seeking Data Engineering, Analytics Engineering, and Data Platform roles.
        If you&apos;re working on interesting data problems — let&apos;s talk.
      </p>

      {/* Email */}
      <a
        href="mailto:ezhilarasan.m@northeastern.edu"
        className="reveal-item group inline-block mb-14"
      >
        <span
          className="font-bold transition-all duration-300 group-hover:opacity-100"
          style={{
            fontSize: 'clamp(1.2rem, 3vw, 2.2rem)',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          ezhilarasan.m@northeastern.edu
        </span>
        <div
          className="h-px mt-2 transition-transform duration-500 origin-left group-hover:scale-x-100 scale-x-0"
          style={{ background: 'linear-gradient(90deg, #00d4ff, #00ffcc)' }}
        />
      </a>

      {/* Social links */}
      <div className="reveal-item flex items-center justify-center gap-4 flex-wrap mb-16">
        {[
          { label: 'GitHub', url: 'https://github.com/mithran77', icon: (
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          )},
          { label: 'LinkedIn', url: 'https://linkedin.com/in/mithran-ezhilarasan', icon: (
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          )},
          { label: 'Resume', url: '#', icon: (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          )},
        ].map(link => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-6 py-3 rounded-full border transition-all duration-300 hover:border-accent/50 hover:text-accent hover:bg-accent/5"
            style={{
              borderColor: 'rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.55)',
              fontSize: '0.875rem',
            }}
          >
            {link.icon}
            {link.label}
          </a>
        ))}
      </div>

      <p
        className="reveal-item text-xs font-mono"
        style={{ color: 'rgba(255,255,255,0.2)' }}
      >
        Boston, MA · 857-339-8622 · Built with Next.js, Three.js & GSAP
      </p>
    </section>
  )
}
