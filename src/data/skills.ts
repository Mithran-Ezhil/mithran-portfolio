import type { Skill } from '@/types'

export const skills: Skill[] = [
  // Languages
  { name: 'Python', level: 95, category: 'frontend' },
  { name: 'SQL / PL/SQL', level: 92, category: 'frontend' },
  { name: 'PySpark', level: 85, category: 'frontend' },
  { name: 'R', level: 72, category: 'frontend' },

  // Data Engineering
  { name: 'Kafka', level: 85, category: 'backend' },
  { name: 'Airflow', level: 88, category: 'backend' },
  { name: 'dbt', level: 85, category: 'backend' },
  { name: 'Delta Lake', level: 83, category: 'backend' },
  { name: 'ETL/ELT Pipelines', level: 92, category: 'backend' },
  { name: 'Data Modeling', level: 88, category: 'backend' },

  // Platforms
  { name: 'Snowflake', level: 88, category: 'tools' },
  { name: 'Databricks', level: 85, category: 'tools' },
  { name: 'Oracle EBS/TCA', level: 85, category: 'tools' },
  { name: 'AWS (S3, RDS)', level: 80, category: 'tools' },
  { name: 'Docker', level: 80, category: 'tools' },
  { name: 'PostgreSQL', level: 85, category: 'tools' },
  { name: 'ChromaDB', level: 78, category: '3d' },
  { name: 'Power BI', level: 82, category: '3d' },
  { name: 'Grafana', level: 80, category: '3d' },
  { name: 'Metabase', level: 78, category: '3d' },
]
