'use client'

import { useScrollStore } from '@/store/scrollStore'

export function useScrollProgress() {
  return useScrollStore((s) => s.scrollY)
}
