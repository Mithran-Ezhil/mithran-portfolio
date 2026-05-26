'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface Props {
  children: ReactNode
  radius?: number          // spotlight radius in px, default 240
  darknessBase?: number    // 0–1 darkness outside spotlight, default 0.88
  className?: string
  style?: React.CSSProperties
}

export default function HoverLightReveal({
  children,
  radius = 240,
  darknessBase = 0.88,
  className = '',
  style,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const entered = useRef(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const overlay = overlayRef.current
    if (!wrap || !overlay) return

    // Default: full dark
    overlay.style.background = `rgba(0,0,0,${darknessBase})`

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const pct = `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`
      overlay.style.background = `radial-gradient(circle ${radius}px at ${pct}, transparent 0%, transparent 35%, rgba(0,0,0,${darknessBase * 0.4}) 60%, rgba(0,0,0,${darknessBase}) 100%)`
    }

    const onEnter = () => {
      entered.current = true
      overlay.style.transition = 'background 0.15s ease'
    }
    const onLeave = () => {
      entered.current = false
      overlay.style.background = `rgba(0,0,0,${darknessBase})`
    }

    wrap.addEventListener('mousemove', onMove)
    wrap.addEventListener('mouseenter', onEnter)
    wrap.addEventListener('mouseleave', onLeave)

    return () => {
      wrap.removeEventListener('mousemove', onMove)
      wrap.removeEventListener('mouseenter', onEnter)
      wrap.removeEventListener('mouseleave', onLeave)
    }
  }, [radius, darknessBase])

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`} style={style}>
      {children}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 10,
          transition: 'background 0.4s ease',
        }}
      />
    </div>
  )
}
