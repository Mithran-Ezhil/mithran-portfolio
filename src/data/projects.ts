import type { Project } from '@/types'

interface ProjectFull extends Project {
  highlights?: string[]
  impact?: string
  role?: string
}

export const projects: ProjectFull[] = [
  {
    id: '1',
    title: 'CryptoSignal',
    description:
      'Production-grade dual-speed streaming platform processing live Coinbase WebSocket trades — sub-60s streaming pipeline (Kafka → PySpark → Delta Lake) + nightly batch pipeline (Airflow → Snowflake → dbt) with real-time anomaly detection across BTC, ETH, SOL.',
    tags: ['Kafka', 'PySpark', 'Delta Lake', 'Airflow', 'dbt', 'Snowflake', 'Docker'],
    color: '#00d4ff',
    githubUrl: '#',
    liveUrl: '#',
    role: 'Lead Data Engineer',
    impact: 'Processes 13+ events/sec in real-time with sub-60s end-to-end latency, enabling anomaly detection across 3 major cryptocurrencies',
    highlights: [
      'Dual-speed architecture: sub-60s Kafka→PySpark→Delta Lake streaming + nightly Airflow→Snowflake→dbt batch',
      'Real-time anomaly detection across BTC, ETH, SOL with configurable thresholds',
      'Docker-containerized with automated schema validation and dead-letter queue handling',
      'dbt models for dimensional modeling, incremental loads, and data quality testing',
      'Grafana dashboards for live pipeline monitoring and alert management',
    ],
  },
  {
    id: '2',
    title: 'Oracle ERP Intelligence Hub',
    description:
      '6-agent NLP ERP system over Oracle Fusion Cloud REST API — Procurement, Financials, Supplier, Analytics, Action, and Orchestrator agents. Hybrid RAG pipeline with ChromaDB + BM25, 40+ tools exposed via MCP server enabling Claude Desktop to autonomously chain REST API calls.',
    tags: ['Python', 'Flask', 'ChromaDB', 'GPT-4o-mini', 'Oracle Fusion', 'MCP'],
    color: '#0ea5e9',
    githubUrl: '#',
    role: 'AI Systems Engineer',
    impact: '40+ Oracle Fusion REST API tools exposed via MCP, enabling Claude Desktop to autonomously chain complex multi-step ERP workflows',
    highlights: [
      '6 specialized NLP agents: Procurement, Financials, Supplier, Analytics, Action, Orchestrator',
      'Hybrid RAG pipeline combining ChromaDB vector search + BM25 keyword retrieval',
      'MCP server exposing 40+ tools for seamless Claude Desktop integration',
      'GPT-4o-mini powered intent classification with fallback chain logic',
      'Flask REST API with session management and audit trail logging',
    ],
  },
  {
    id: '3',
    title: 'Job Hunter v2',
    description:
      'Parallelized job discovery pipeline scanning 384 keyword-location combinations per cycle with exponential backoff. SQLite deduplication engine with Google Sheets dual-routing, SMTP digest alerts, and 7-day follow-up cadence — delivering 100–250+ deduplicated listings every 2 hours.',
    tags: ['Python', 'SQLite', 'ThreadPoolExecutor', 'Google Sheets API', 'SMTP'],
    color: '#22d3ee',
    githubUrl: '#',
    role: 'Backend / Automation Engineer',
    impact: 'Delivers 100–250+ deduplicated job listings every 2 hours with zero manual intervention',
    highlights: [
      'Parallelized scraping across 384 keyword-location combinations using ThreadPoolExecutor',
      'SQLite deduplication engine with hash-based fingerprinting prevents duplicate alerts',
      'Dual routing: Google Sheets for browsable archive + SMTP email digest for immediate alerts',
      '7-day automated follow-up cadence with engagement tracking',
      'Exponential backoff with jitter for rate-limit resilience',
    ],
  },
  {
    id: '4',
    title: 'Hospital Management System',
    description:
      'Scalable data warehouse with star schema dimensional modeling, ERD documentation, data lineage mapping, 20+ stored procedures, and data cataloging pipelines across a normalized 10-table schema. Interactive Power BI dashboards with role-based access controls.',
    tags: ['SQL', 'Power BI', 'Star Schema', 'Stored Procedures', 'Data Modeling'],
    color: '#38bdf8',
    githubUrl: '#',
    role: 'Data Warehouse Architect',
    impact: 'Star schema warehouse serving 20+ stored procedures, reducing report generation time by 70%',
    highlights: [
      'Star schema dimensional modeling with 10-table normalized source and denormalized mart layer',
      'ERD documentation and data lineage mapping for full audit compliance',
      '20+ optimized stored procedures for common clinical and administrative queries',
      'Interactive Power BI dashboards with role-based access controls for staff vs. admin',
      'Data cataloging pipelines with automated metadata extraction',
    ],
  },
]
