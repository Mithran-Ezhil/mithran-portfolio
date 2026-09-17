export const COLORS = {
  bg: '#0a0a0f',
  accent: '#6366f1',
  glow: '#a78bfa',
  textPrimary: '#f8fafc',
  textMuted: '#64748b',
} as const

export const SECTION_IDS = {
  hero:       'hero',
  about:      'about',
  experience: 'experience',
  projects:   'projects',
  research:   'research',
  contact:    'contact',
} as const

export interface Waypoint {
  position: [number, number, number]
  target:   [number, number, number]
  controlA?: [number, number, number]   // bezier handle OUT of this point
  controlB?: [number, number, number]   // bezier handle INTO this point
}

// Cinematic camera path with bezier handles for smooth arcs
export const CAMERA_WAYPOINTS: Waypoint[] = [
  {
    position: [0,   0,  8],
    target:   [0,   0,  0],
    controlA: [3,  -3,  9],
  },
  {
    position: [-2, -10, 6],
    target:   [-1, -10, 0],
    controlB: [-4,  -7, 8],
    controlA: [ 1, -14, 7],
  },
  {
    position: [ 2, -20, 7],
    target:   [ 1, -20, 0],
    controlB: [ 4, -16, 8],
    controlA: [-1, -24, 8],
  },
  {
    position: [0, -30, 9],
    target:   [0, -30, 0],
    controlB: [-2, -27, 9],
    controlA: [ 1, -34, 7],
  },
  {
    position: [0, -40, 6],
    target:   [0, -40, 0],
    controlB: [ 1, -37, 7],
  },
]
