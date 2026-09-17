'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const LoadingScreen = dynamic(() => import('@/components/ui/LoadingScreen'), { ssr: false })

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.6s ease 0.2s',
          pointerEvents: loaded ? 'auto' : 'none',
        }}
      >
        {children}
      </div>
    </>
  )
}
