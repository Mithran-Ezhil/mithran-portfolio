'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SECTION_IDS } from '@/lib/constants'

const NAV_ITEMS = [
  { label: 'About',      href: `#${SECTION_IDS.about}` },
  { label: 'Experience', href: `#${SECTION_IDS.experience}` },
  { label: 'Projects',   href: `#${SECTION_IDS.projects}` },
  { label: 'Contact',    href: `#${SECTION_IDS.contact}` },
]

export default function Navbar() {
  const { scrollY } = useScroll()
  const [active, setActive] = useState<string>(SECTION_IDS.hero)
  // Compress pill on scroll
  const pillPaddingY = useTransform(scrollY, [0, 80], [14, 10])

  useEffect(() => {
    const ids = Object.values(SECTION_IDS)
    const observers = ids.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { threshold: 0.35 }
      )
      obs.observe(el)
      return obs
    }).filter(Boolean) as IntersectionObserver[]
    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
        className="pointer-events-auto w-full flex justify-center"
        style={{ paddingTop: 20, paddingLeft: 16, paddingRight: 16 }}
      >
        <motion.nav
          className="liquid-glass rounded-full flex items-center justify-between gap-2 w-full"
          style={{
            maxWidth: 850,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: pillPaddingY,
            paddingBottom: pillPaddingY,
          }}
        >
          {/* Logo */}
          <a
            href={`#${SECTION_IDS.hero}`}
            className="font-bold text-sm tracking-widest uppercase font-mono transition-colors duration-300 hover:opacity-80 shrink-0"
            style={{
              fontFamily: 'var(--font-geist-mono)',
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            <span style={{ color: '#00d4ff' }}>M</span>
            ithran
            <span style={{ color: '#00d4ff' }}>.</span>
          </a>

          {/* Nav links — center */}
          <ul className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {NAV_ITEMS.map(item => {
              const isActive = active === item.href.slice(1)
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-[13px] font-medium px-4 py-1.5 rounded-full transition-all duration-200"
                    style={{
                      color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)',
                      background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* CTA — right */}
          <a
            href={`#${SECTION_IDS.contact}`}
            className="shrink-0 text-[13px] font-semibold px-5 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:brightness-110"
            style={{
              background: '#87FB89',
              color: '#000',
              boxShadow: '0 0 20px rgba(135,251,137,0.25)',
            }}
          >
            Hire Me
          </a>
        </motion.nav>
      </motion.div>
    </header>
  )
}
