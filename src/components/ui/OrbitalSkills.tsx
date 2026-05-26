'use client'

import { useState } from 'react'

interface Skill {
  name: string
  color: string
  abbr: string
}

interface Ring {
  radius: number
  duration: number
  skills: Skill[]
}

const rings: Ring[] = [
  {
    radius: 108,
    duration: 28,
    skills: [
      { name: 'Python',   color: '#3776AB', abbr: 'PY'  },
      { name: 'SQL',      color: '#00758F', abbr: 'SQL' },
      { name: 'PySpark',  color: '#E25A1C', abbr: '⚡'  },
      { name: 'R',        color: '#276DC3', abbr: 'R'   },
    ],
  },
  {
    radius: 172,
    duration: 42,
    skills: [
      { name: 'Kafka',      color: '#B31418', abbr: 'KFK' },
      { name: 'Airflow',    color: '#017CEE', abbr: 'AF'  },
      { name: 'dbt',        color: '#FF694A', abbr: 'dbt' },
      { name: 'Snowflake',  color: '#29B5E8', abbr: '❄'   },
      { name: 'Delta Lake', color: '#0052CC', abbr: 'Δ'   },
    ],
  },
  {
    radius: 238,
    duration: 58,
    skills: [
      { name: 'Databricks', color: '#FF3621', abbr: 'DBX' },
      { name: 'AWS S3',     color: '#FF9900', abbr: 'AWS' },
      { name: 'Docker',     color: '#2496ED', abbr: '🐳'  },
      { name: 'PostgreSQL', color: '#4169E1', abbr: 'PG'  },
      { name: 'Power BI',   color: '#F2C811', abbr: 'PBI' },
      { name: 'Grafana',    color: '#F46800', abbr: 'GRF' },
    ],
  },
]

export default function OrbitalSkills() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <>
      <style>{`
        @keyframes orbit-arm {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes orbit-badge {
          from { transform: translateY(-50%) rotate(0deg); }
          to   { transform: translateY(-50%) rotate(-360deg); }
        }
        @media (max-width: 768px) {
          .orbital-container {
            transform: scale(0.75);
          }
        }
      `}</style>

      <div style={{ width: 520, height: 520, margin: '0 auto', position: 'relative' }}>
        <div
          className="orbital-container"
          style={{ position: 'relative', width: 520, height: 520 }}
        >
          {/* Orbit path rings */}
          {rings.map((ring, ri) => (
            <div
              key={`ring-path-${ri}`}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: ring.radius * 2,
                height: ring.radius * 2,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                border: `1px solid rgba(0,212,255,${0.06 + ri * 0.02})`,
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* Center element */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 68,
              height: 68,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,212,255,0.18) 0%, transparent 70%)',
              border: '1px solid rgba(0,212,255,0.4)',
              boxShadow: '0 0 25px rgba(0,212,255,0.25), 0 0 50px rgba(0,212,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <span
              style={{
                fontSize: 8,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'rgba(0,212,255,0.85)',
                letterSpacing: '0.25em',
                lineHeight: 1,
              }}
            >
              TECH
            </span>
            <span
              style={{
                fontSize: 8,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'rgba(0,212,255,0.85)',
                letterSpacing: '0.25em',
                lineHeight: 1,
              }}
            >
              STACK
            </span>
          </div>

          {/* Orbital skill badges */}
          {rings.map((ring, ri) =>
            ring.skills.map((skill, j) => {
              const delay = `-${(j / ring.skills.length) * ring.duration}s`
              const isHovered = hovered === skill.name
              const playState = isHovered ? 'paused' : 'running'

              return (
                <div
                  key={`${ri}-${skill.name}`}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 0,
                    height: 0,
                    animationName: 'orbit-arm',
                    animationDuration: `${ring.duration}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    animationDelay: delay,
                    animationPlayState: playState,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: ring.radius,
                      animationName: 'orbit-badge',
                      animationDuration: `${ring.duration}s`,
                      animationTimingFunction: 'linear',
                      animationIterationCount: 'infinite',
                      animationDelay: delay,
                      animationPlayState: playState,
                      transform: 'translateY(-50%)',
                    }}
                    onMouseEnter={() => setHovered(skill.name)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -28,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'rgba(0,8,20,0.95)',
                          border: `1px solid ${skill.color}55`,
                          borderRadius: 4,
                          padding: '2px 8px',
                          fontSize: 10,
                          fontFamily: 'monospace',
                          color: skill.color,
                          whiteSpace: 'nowrap',
                          pointerEvents: 'none',
                          zIndex: 100,
                        }}
                      >
                        {skill.name}
                      </div>
                    )}

                    {/* Badge circle */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: `${skill.color}18`,
                        border: `1.5px solid ${isHovered ? `${skill.color}cc` : `${skill.color}55`}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isHovered ? 11 : 10,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: skill.color,
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        transform: isHovered ? 'scale(1.4)' : 'scale(1)',
                        boxShadow: isHovered ? `0 0 18px ${skill.color}88` : 'none',
                      }}
                    >
                      {skill.abbr}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
