'use client'

import { useEffect, useRef, createContext, useContext } from 'react'
import Lenis from 'lenis'
import { useScrollStore } from '@/store/scrollStore'
import { SECTION_THEMES } from '@/lib/sectionThemes'

const LenisContext = createContext<Lenis | null>(null)
export const useLenis = () => useContext(LenisContext)

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const setScrollY = useScrollStore((s) => s.setScrollY)
  const rafRef = useRef<number>(0)
  const lastScrollY = useRef(0)
  const lastTime = useRef(0)

  useEffect(() => {
    // Dynamically import GSAP ScrollTrigger to keep it client-only
    import('@/lib/gsap').then(({ ScrollTrigger }) => {
      const lenis = new Lenis({
        lerp: 0.05,          // slower = more cinematic glide
        smoothWheel: true,
        touchMultiplier: 1.5,
        wheelMultiplier: 0.8,
      })
      lenisRef.current = lenis
      ;(window as unknown as { lenis?: Lenis }).lenis = lenis

      lenis.on('scroll', ({ scroll, limit }: { scroll: number; limit: number }) => {
        const now = performance.now()
        const dt = now - lastTime.current
        const velocity = dt > 0 ? (scroll - lastScrollY.current) / dt * 1000 : 0
        const normalized = limit > 0 ? scroll / limit : 0
        setScrollY(normalized, velocity)
        lastScrollY.current = scroll
        lastTime.current = now
        ScrollTrigger.update()

        // Propagate section theme CSS variables to the document root
        const idx = Math.min(Math.floor(normalized * 4), 3)
        const theme = SECTION_THEMES[idx]
        document.documentElement.style.setProperty('--accent', theme.accentHex)
        document.documentElement.style.setProperty('--glow', theme.glowHex)
        document.documentElement.style.setProperty('--border', theme.borderTint)
        document.documentElement.style.setProperty('--panel-bg', theme.panelTint)
      })

      function raf(time: number) {
        lenis.raf(time)
        rafRef.current = requestAnimationFrame(raf)
      }
      rafRef.current = requestAnimationFrame(raf)
    })

    return () => {
      lenisRef.current?.destroy()
      cancelAnimationFrame(rafRef.current)
    }
  }, [setScrollY])

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  )
}
