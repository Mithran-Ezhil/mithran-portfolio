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
