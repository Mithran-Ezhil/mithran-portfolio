import type { Experience } from '@/types'

export const experiences: Experience[] = [
  {
    id: '1',
    role: 'Data Engineer (Co-op)',
    company: 'ProDes E&T Inc.',
    duration: 'June 2025 – Dec 2025',
    description:
      'Architected end-to-end Python ETL pipelines migrating 100K+ vendor records across SAP and Oracle EBS — reducing processing time by 70%. Built deduplication and fuzzy matching framework with RapidFuzz achieving 95% first-pass accuracy. Designed two-stage reconciliation engine and delta reprocessing system cutting release cycle time by 60%.',
    tags: ['Python', 'Pandas', 'RapidFuzz', 'Databricks', 'Oracle EBS', 'Git'],
  },
  {
    id: '2',
    role: 'Data Analyst Intern',
    company: 'Unigenix',
    duration: 'Jan 2024 – Aug 2024',
    description:
      'Built automated ETL pipelines for FTP transfers and REST/SOAP API integrations including Salesforce. Developed parameterized SQL queries powering 6+ real-time dashboards tracking 20+ finance and procurement metrics across Oracle EBS. Implemented role-based access controls and authored data design documentation.',
    tags: ['Oracle SQL', 'REST/SOAP APIs', 'Salesforce', 'ETL', 'Power BI'],
  },
  {
    id: '3',
    role: 'Public Relations Head',
    company: 'RECHARGE \'24 — Rajalakshmi Engineering College',
    duration: 'Dec 2022 – Mar 2024',
    description:
      'Spearheaded RECHARGE \'24, a 120-event college fest with 10,000+ attendees. Secured $24K from 10+ sponsors and directed a 100-member team across logistics, communications, and vendor coordination. Co-authored published research on CNN-based elderly fall detection (IRCCTSD 2024, Springer).',
    tags: ['Leadership', 'Event Management', 'Sponsorship', 'Research', 'Springer'],
  },
]
