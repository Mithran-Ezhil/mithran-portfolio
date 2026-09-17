'use client'

/**
 * Self-contained end-to-end data-platform diagram.
 *
 * Replaces a CloudFront video that returns 403, which left the Philosophy
 * panel as an empty black box. Pure CSS/DOM on purpose — no external asset to
 * expire, no network request to fail, and it still reads at a glance.
 */

const GREEN = '135,251,137'
const CYAN = '0,212,255'

interface Stage {
  label: string
  role: string
  metric: string
  /** 0 = green end of the ramp, 1 = cyan end */
  t: number
}

const STAGES: Stage[] = [
  { label: 'SOURCES',    role: 'Coinbase · SAP · Oracle · FDA', metric: '4 systems',  t: 0.0 },
  { label: 'KAFKA',      role: 'stream ingest',                 metric: '13+ ev/s',   t: 0.2 },
  { label: 'PYSPARK',    role: 'transform & enrich',            metric: 'sub-60s',    t: 0.4 },
  { label: 'DELTA LAKE', role: 'ACID storage',                  metric: '20M+ rows',  t: 0.6 },
  { label: 'dbt · SNOWFLAKE', role: 'model & test',             metric: '11 tests',   t: 0.8 },
  { label: 'POWER BI · AI',   role: 'serve & reason',           metric: '6 agents',   t: 1.0 },
]

/** Blend the green→cyan ramp so the stack reads as one gradient top to bottom. */
function mix(t: number) {
  const a = GREEN.split(',').map(Number)
  const b = CYAN.split(',').map(Number)
  return a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')
}

export default function PipelineDiagram() {
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 24,
        border: '1px solid rgba(255,255,255,0.07)',
        background:
          'linear-gradient(160deg, rgba(135,251,137,0.05) 0%, rgba(0,8,20,0.75) 45%, rgba(0,212,255,0.05) 100%)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        padding: '26px 24px',
      }}
    >
      <style>{`
        @keyframes pipeFlow {
          0%   { top: -6px;  opacity: 0 }
          18%  { opacity: 1 }
          82%  { opacity: 1 }
          100% { top: 100%;  opacity: 0 }
        }
        @keyframes pipeNodePulse {
          0%, 100% { box-shadow: 0 0 0 0 var(--pulse-c) }
          50%      { box-shadow: 0 0 0 5px transparent }
        }
      `}</style>

      {/* faint grid */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.05,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
      />

      {/* header */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <div
          style={{
            fontSize: 9.5, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.34em',
            color: `rgba(${GREEN},0.65)`, textTransform: 'uppercase', marginBottom: 6,
          }}
        >
          Reference Pipeline
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
          Raw events in, trustworthy decisions out.
        </div>
      </div>

      {/* stages */}
      <div style={{ position: 'relative' }}>
        {STAGES.map((s, i) => {
          const c = mix(s.t)
          const isLast = i === STAGES.length - 1
          return (
            <div key={s.label} style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                {/* node */}
                <span
                  style={{
                    position: 'relative', zIndex: 1, flexShrink: 0,
                    width: 11, height: 11, borderRadius: '50%',
                    background: `rgb(${c})`,
                    ['--pulse-c' as string]: `rgba(${c},0.45)`,
                    animation: `pipeNodePulse 2.6s ease-in-out ${i * 0.22}s infinite`,
                  }}
                />
                {/* label */}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: 11.5, fontFamily: 'var(--font-geist-mono)',
                      letterSpacing: '0.13em', color: `rgb(${c})`, fontWeight: 600,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}
                  >
                    {s.label}
                  </div>
                  <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.32)', marginTop: 2 }}>
                    {s.role}
                  </div>
                </div>
                {/* metric */}
                <span
                  style={{
                    flexShrink: 0, fontSize: 10, fontFamily: 'var(--font-geist-mono)',
                    padding: '3px 9px', borderRadius: 20,
                    background: `rgba(${c},0.09)`, border: `1px solid rgba(${c},0.24)`,
                    color: `rgba(${c},0.85)`, whiteSpace: 'nowrap',
                  }}
                >
                  {s.metric}
                </span>
              </div>

              {/* connector with a travelling pulse */}
              {!isLast && (
                <div
                  style={{
                    position: 'relative',
                    height: 30,
                    marginLeft: 5,
                    borderLeft: `1px solid rgba(${c},0.26)`,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute', left: -2.5, width: 4, height: 4, borderRadius: '50%',
                      background: `rgb(${c})`, boxShadow: `0 0 7px rgba(${c},0.9)`,
                      animation: `pipeFlow 2.1s linear ${i * 0.35}s infinite`,
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
