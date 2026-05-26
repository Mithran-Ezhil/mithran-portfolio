export interface SectionTheme {
  accentHex:  string
  glowHex:    string
  panelTint:  string
  borderTint: string
}

export const SECTION_THEMES: SectionTheme[] = [
  { accentHex: '#00d4ff', glowHex: '#00ffcc', panelTint: 'rgba(1,8,20,0.86)',  borderTint: 'rgba(0,212,255,0.18)' },
  { accentHex: '#00d4ff', glowHex: '#4af9ff', panelTint: 'rgba(2,10,24,0.88)', borderTint: 'rgba(0,212,255,0.20)' },
  { accentHex: '#0ea5e9', glowHex: '#38bdf8', panelTint: 'rgba(1,8,20,0.90)',  borderTint: 'rgba(14,165,233,0.20)' },
  { accentHex: '#00d4ff', glowHex: '#7df9ff', panelTint: 'rgba(1,6,18,0.90)',  borderTint: 'rgba(0,212,255,0.22)' },
  { accentHex: '#22d3ee', glowHex: '#67e8f9', panelTint: 'rgba(1,6,16,0.86)',  borderTint: 'rgba(34,211,238,0.18)' },
]
