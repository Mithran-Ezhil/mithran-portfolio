'use client'

import { useEffect, useRef } from 'react'

/**
 * MotionLayer — global premium micro-interactions, mounted once.
 *  • Mouse-follow spotlight (a soft light that tracks the cursor)
 *  • Magnetic pull on any [data-magnetic] element
 *  • Scroll-reveal for any [data-reveal] element (line-mask rise)
 * Pure DOM + GSAP; no layout impact, fully cleaned up on unmount.
 */
export default function MotionLayer() {
  const spotRef = useRef<HTMLDivElement>(null)

  /* ── Mouse-follow spotlight ─────────────────────────────── */
  useEffect(() => {
    // Skip on touch / coarse pointers
    if (window.matchMedia('(pointer: coarse)').matches) return
    const spot = spotRef.current
    if (!spot) return

    const target = { x: window.innerWidth / 2, y: window.innerHeight * 0.4 }
    const cur    = { ...target }
    let raf = 0
    let visible = false

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!visible) { visible = true; spot.style.opacity = '1' }
    }
    const loop = () => {
      cur.x += (target.x - cur.x) * 0.12
      cur.y += (target.y - cur.y) * 0.12
      spot.style.transform = `translate3d(${cur.x - 300}px, ${cur.y - 300}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  /* ── Magnetic elements (live query → works for late-mounted nodes) ── */
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const onMove = (e: MouseEvent) => {
      const els = document.querySelectorAll<HTMLElement>('[data-magnetic]')
      els.forEach((el) => {
        const strength = parseFloat(el.dataset.magnetic || '0.35')
        const radius   = parseFloat(el.dataset.magneticRadius || '90')
        const r  = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        if (Math.hypot(dx, dy) < Math.max(r.width, r.height) / 2 + radius) {
          el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
        } else if (el.style.transform) {
          el.style.transform = ''
        }
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  /* ── Scroll-reveal [data-reveal] ────────────────────────── */
  useEffect(() => {
    let killed = false
    const triggers: Array<{ kill: () => void }> = []

    import('@/lib/gsap').then(({ gsap, ScrollTrigger }) => {
      if (killed) return
      const els = gsap.utils.toArray<HTMLElement>('[data-reveal]')
      els.forEach((el) => {
        const delay = parseFloat(el.dataset.revealDelay || '0')
        const st = gsap.fromTo(
          el,
          { opacity: 0, y: 46, filter: 'blur(8px)' },
          {
            opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 1.1, ease: 'power3.out', delay,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        )
        if (st.scrollTrigger) triggers.push(st.scrollTrigger)
      })
      // Layout settles after fonts / Lenis — recalc positions
      setTimeout(() => ScrollTrigger.refresh(), 400)

      // Safety: never leave a tagged element invisible
      setTimeout(() => {
        els.forEach((el) => { if (getComputedStyle(el).opacity === '0') el.style.opacity = '1' })
      }, 4000)
    })

    return () => { killed = true; triggers.forEach((t) => t.kill()) }
  }, [])

  return (
    <div
      ref={spotRef}
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 600,
        height: 600,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 30,
        opacity: 0,
        transition: 'opacity 0.6s ease',
        mixBlendMode: 'screen',
        background:
          'radial-gradient(circle, rgba(0,212,255,0.12) 0%, rgba(0,212,255,0.05) 32%, transparent 66%)',
        willChange: 'transform',
      }}
    />
  )
}
