'use client'

const TECHS = [
  'Apache Kafka', 'Apache Spark', 'Apache Airflow', 'dbt', 'Snowflake',
  'Python', 'PostgreSQL', 'AWS S3', 'Docker', 'Kubernetes',
  'Databricks', 'LangChain', 'Vector Databases', 'Terraform',
  'PySpark', 'Delta Lake', 'Flink', 'Redis', 'Power BI', 'Grafana',
]

const DOT = (
  <span
    style={{
      display: 'inline-block',
      width: 4, height: 4,
      borderRadius: '50%',
      background: '#00d4ff',
      margin: '0 28px',
      verticalAlign: 'middle',
      boxShadow: '0 0 8px #00d4ff',
      opacity: 0.7,
    }}
  />
)

const TickerRow = ({ reverse = false, speed = 40 }: { reverse?: boolean; speed?: number }) => {
  const items = [...TECHS, ...TECHS]   // doubled for seamless loop

  return (
    <div
      style={{
        overflow: 'hidden',
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)',
        maskImage: 'linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)',
      }}
    >
      <div
        className={reverse ? 'ticker-track-reverse' : 'ticker-track'}
        style={{ '--speed': `${speed}s` } as React.CSSProperties}
      >
        {items.map((tech, i) => (
          <span key={i} className="ticker-item">
            <span>{tech}</span>
            {DOT}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function SkillsTicker() {
  return (
    <div
      className="relative py-8 overflow-hidden"
      style={{
        zIndex: 1,
        borderTop:    '1px solid rgba(0,212,255,0.07)',
        borderBottom: '1px solid rgba(0,212,255,0.07)',
        background: 'linear-gradient(180deg, rgba(0,8,20,0.0) 0%, rgba(0,212,255,0.025) 50%, rgba(0,8,20,0.0) 100%)',
      }}
    >
      <TickerRow speed={50} />
    </div>
  )
}
