import { create } from 'zustand'

interface ScrollStore {
  scrollY:          number   // 0–1 normalized
  scrollVelocity:   number   // px/s
  sectionIndex:     number   // 0–4 integer
  sectionProgress:  number   // 0–1 within current section
  setScrollY: (y: number, velocity: number) => void
}

export const useScrollStore = create<ScrollStore>((set) => ({
  scrollY:         0,
  scrollVelocity:  0,
  sectionIndex:    0,
  sectionProgress: 0,
  setScrollY: (y, velocity) => {
    const raw      = y * 4
    const index    = Math.min(Math.floor(raw), 3)
    const progress = raw - index
    set({ scrollY: y, scrollVelocity: velocity, sectionIndex: index, sectionProgress: progress })
  },
}))
