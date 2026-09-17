/** One titled block inside a detail modal. Shared by experience + publications. */
export interface DetailBlock {
  label: string
  /** Optional lead paragraph */
  body?: string
  /** Optional monospace pipeline line, e.g. "Source → OIC → PL/SQL → Fusion" */
  flow?: string
  /** Optional chip list */
  items?: string[]
}

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  image?: string
  liveUrl?: string
  githubUrl?: string
  color: string
}

export interface Experience {
  id: string
  role: string
  company: string
  duration: string
  description: string
  tags: string[]
}

export interface Skill {
  name: string
  level: number
  category: 'frontend' | 'backend' | 'tools' | '3d'
}
