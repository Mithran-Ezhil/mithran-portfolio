import type { Project } from '@/types'

export interface ProjectFull extends Project {
  /** Two-digit card number, e.g. "01" */
  number: string
  /** Short role label shown in the card pill */
  badge: string
  /** One-line positioning statement shown under the title in the modal */
  subtitle: string
  /** Human-readable date range */
  period: string
  /** Exactly the 3 lines shown on the card face — keep them short */
  bullets: [string, string, string]
  /** Key of the SVG in Projects.tsx ICONS map */
  icon: string
  role: string
  impact: string
  highlights: string[]
  /** Compact results panel: [label, value] pairs */
  metrics: [string, string][]
  /** "What I learned / engineering decisions" */
  decisions: string[]
}

export const projects: ProjectFull[] = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'oracle-erp-hub',
    number: '01',
    title: 'Oracle ERP Intelligence Hub',
    subtitle:
      'Multi-agent AI platform for natural-language analytics, retrieval, and controlled execution across Oracle Fusion ERP',
    period: 'Jan 2026 – Apr 2026',
    badge: 'AI Systems Engineer',
    icon: 'agents',
    color: '#0ea5e9',
    githubUrl: '#',
    description:
      'An enterprise AI platform that makes complex Oracle Fusion ERP data accessible through natural language. Rather than requiring users to navigate Oracle modules, tables, reports and REST endpoints by hand, the platform interprets a request, routes it to the right specialised agent or enterprise tool, retrieves the necessary context, and produces a controlled analytical or operational response. Architected as a 6-agent system covering 50+ enterprise intents across financial, procurement, supplier, invoice and spend data.',
    role: 'AI Systems Engineer',
    impact:
      '6 specialised agents resolving 50+ enterprise intents, with 40+ Oracle REST tools exposed through an MCP server — and every sensitive ERP action gated behind a plan → confirm → execute handshake.',
    bullets: [
      '6 specialised agents across 50+ enterprise intents',
      'Hybrid RAG: ChromaDB vectors + BM25 over 12 collections',
      'plan → confirm → execute gate on every write',
    ],
    tags: [
      'Python',
      'Flask',
      'GPT-4o-mini',
      'ChromaDB',
      'BM25',
      'Oracle Fusion REST API',
      'MCP',
      'RAG',
      'Vector Search',
    ],
    highlights: [
      'Request pipeline: natural language → intent classification → specialised agent → retrieval/tool selection → plan generation → user confirmation → tool execution → response with trace logging',
      'Hybrid RAG combining ChromaDB vector embeddings with BM25 keyword indexing across 12 Oracle data collections — semantic similarity for concepts, exact matching for Oracle field names, supplier identifiers and financial terminology',
      '40+ Oracle ERP tools exposed through an MCP server, so the AI layer interacts via structured tool calls rather than generated text, supporting multi-step workflows spanning several REST operations',
      'AnalyticsAgent performing spend-trend and regression analysis, invoice anomaly and Z-score outlier detection, supplier analytics, and A–F supplier risk scoring against live AP and PO data',
      'Bulk supplier import provisioning 50+ records with Oracle TCA field mappings in under five seconds',
      'Auditability layer: role-based access control, structured logging, trace IDs, rate limiting, controlled tool exposure and validation at the boundary',
    ],
    metrics: [
      ['Specialised agents', '6'],
      ['Enterprise intents', '50+'],
      ['Oracle tools via MCP', '40+'],
      ['Data collections', '12'],
      ['Bulk supplier import', '50+ in <5s'],
      ['Supplier risk scoring', 'A–F scale'],
    ],
    decisions: [
      'An enterprise agent should not mutate ERP state because a language model decided to. The plan → confirm → execute model surfaces the intended operation before it runs, keeping a human in the loop for sensitive actions.',
      'Pure vector search loses on Oracle-specific vocabulary — exact supplier names, field identifiers and financial terms. Pairing BM25 with embeddings preserved precise matching without giving up semantic recall.',
      'Exposing capability as MCP tools instead of parsing free-form model output turned multi-step ERP workflows into composable, individually auditable calls.',
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'pharmasafe',
    number: '02',
    title: 'PharmaSafe',
    subtitle:
      '20M+ record AWS pharmacovigilance lakehouse with Medallion Architecture, dbt analytics, and ML-based safety-signal detection',
    period: 'Feb 2026 – May 2026',
    badge: 'Data Engineer',
    icon: 'lakehouse',
    color: '#2dd4bf',
    githubUrl: '#',
    description:
      'An end-to-end healthcare data engineering and machine-learning platform built on public FDA FAERS adverse-event data. The system processes 20M+ adverse-event reports, converting raw regulatory filings into structured, queryable, quality-tested analytical datasets through a three-layer Medallion Architecture — covering ingestion, distributed transformation, dimensional modelling, data-quality testing, BI, ML, orchestration and monitoring.',
    role: 'Data Engineer',
    impact:
      'Processes 20M+ FDA adverse-event reports through Bronze → Silver → Gold, with partition pruning cutting Athena scan volume by ~60% and Isolation Forest surfacing safety signals across 500K+ drug-reaction pairs.',
    bullets: [
      '20M+ FDA adverse-event reports, Bronze → Silver → Gold',
      'Partition pruning cut Athena scan volume ~60%',
      'Isolation Forest over 500K+ drug-reaction pairs',
    ],
    tags: [
      'PySpark',
      'AWS Glue',
      'S3',
      'Athena',
      'Redshift',
      'dbt',
      'SageMaker',
      'MWAA/Airflow',
      'CloudWatch',
      'QuickSight',
    ],
    highlights: [
      'Three-layer Medallion Architecture: raw filings land in Bronze, cleaned and standardised records progress through Silver, analytics-ready entities and aggregates surface in Gold',
      'PySpark on AWS Glue ingesting and transforming the four primary relational areas of FAERS — drug, reaction, demographic and outcome',
      'Parquet on S3 partitioned by year and quarter; partition pruning reduced Athena query scan volume by roughly 60%',
      'Redshift analytics layer built with dbt: 5 layered models in a staging → dimensions → fact → mart architecture, guarded by 11 automated data-quality tests covering uniqueness, completeness and referential integrity',
      'Six pharmacovigilance KPIs in Amazon QuickSight, including adverse-drug signal rankings, reaction-age heatmaps and 12-month temporal trend analysis',
      'Unsupervised anomaly detection with Isolation Forest on SageMaker across 500K+ drug-reaction co-occurrence pairs to flag statistically unusual safety signals',
      'Airflow DAG on Amazon MWAA orchestrating Glue ETL → dbt transformations and tests → SageMaker batch inference, with CloudWatch alerting for operational visibility',
    ],
    metrics: [
      ['Adverse-event reports', '20M+'],
      ['Athena scan reduction', '~60%'],
      ['dbt models', '5 layered'],
      ['Data-quality tests', '11'],
      ['Pharmacovigilance KPIs', '6'],
      ['Drug-reaction pairs scored', '500K+'],
    ],
    decisions: [
      'Physical storage design is a performance feature, not an afterthought. Partitioning Parquet by year and quarter cut Athena scan volume by about 60% without changing a single query.',
      'Data-quality tests belong in the pipeline, not in a reviewer’s head. Encoding uniqueness, completeness and integrity as 11 dbt tests meant a bad upstream load failed loudly instead of quietly corrupting the marts.',
      'Manually picking anomalous drug-reaction relationships does not scale to a 500K-pair search space — an unsupervised model made the search tractable and repeatable.',
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'cryptosignal',
    number: '03',
    title: 'CryptoSignal',
    subtitle:
      'Dual-speed crypto analytics platform combining real-time Kafka/Spark processing with Snowflake/dbt batch analytics',
    period: 'Nov 2025 – Dec 2025',
    badge: 'Lead Data Engineer',
    icon: 'streaming',
    color: '#00d4ff',
    githubUrl: '#',
    liveUrl: '#',
    description:
      'A production-style streaming and batch data platform built around live cryptocurrency market events, designed to satisfy two different analytical requirements at once: detecting market behaviour within seconds, and computing deeper rolling metrics organised into a warehouse for longer-term analysis. That tension drove a dual-speed architecture — a streaming path for latency and a batch path for depth.',
    role: 'Lead Data Engineer',
    impact:
      'Sustains 13+ events/sec with sub-60-second end-to-end processing across BTC, ETH and SOL, backed by a 6-model dbt star schema and 11 data-quality tests on the batch side.',
    bullets: [
      'Sub-60s Coinbase → Kafka → PySpark → Delta Lake',
      'Z-score anomaly detection at σ > 2.0',
      '6-model dbt star schema, 9 Docker services',
    ],
    tags: [
      'Kafka',
      'PySpark Structured Streaming',
      'Delta Lake',
      'Snowflake',
      'Airflow',
      'dbt',
      'Docker',
      'Grafana',
      'Metabase',
    ],
    highlights: [
      'Streaming path: Coinbase WebSocket → Kafka → PySpark Structured Streaming → Delta Lake for BTC, ETH and SOL, achieving sub-60-second processing at 13+ events per second',
      'Real-time transformations producing 1-minute OHLCV aggregates, 5-minute sliding-window analysis and Z-score anomaly detection at a σ > 2.0 threshold',
      'Delta Lake ACID transactions for persistence, with Kafka offset checkpointing so processing recovers without replaying and duplicating the entire stream',
      'Batch path: two Airflow DAGs computing 7-day and 30-day rolling returns plus volatility metrics into Snowflake',
      'Warehouse layer of 6 dbt models in a star schema, covered by 11 data-quality tests',
      'Grafana and Metabase dashboards tracking live price behaviour and anomalies across all three assets',
      'Containerised across nine Docker services rather than run component-by-component by hand',
    ],
    metrics: [
      ['Throughput', '13+ events/sec'],
      ['End-to-end latency', '<60s'],
      ['Anomaly threshold', 'σ > 2.0'],
      ['dbt models', '6-model star schema'],
      ['Data-quality tests', '11'],
      ['Docker services', '9'],
    ],
    decisions: [
      'Real-time and historical analytics have genuinely different shapes. Forcing both through one pipeline compromises each, so the streaming and batch paths were separated and allowed to optimise independently.',
      'Fault tolerance is about recovery cost, not just uptime. Kafka offset checkpointing plus Delta Lake ACID writes meant a restart resumed where it left off instead of duplicating the stream.',
      'Nine services running by hand is not a system. Containerising the whole topology made the platform reproducible and the architecture legible.',
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'scichat',
    number: '04',
    title: 'SciChat',
    subtitle:
      'Production-oriented multimodal scientific RAG system with retrieval evaluation, MLflow experimentation, Kubernetes deployment, and CI quality gates',
    period: 'May 2025 – Jun 2025',
    badge: 'AI / MLOps Engineer',
    icon: 'retrieval',
    color: '#a78bfa',
    githubUrl: '#',
    description:
      'A scientific question-answering system built around a production-oriented Retrieval-Augmented Generation architecture. Rather than relying on the language model’s internal knowledge, it retrieves relevant scientific material from an indexed knowledge base and supplies that context before generating an answer — packaged as a containerised multimodal RAG pipeline with offline evaluation and merge-blocking CI quality gates.',
    role: 'AI / MLOps Engineer',
    impact:
      'Hybrid retrieval with cross-encoder re-ranking reaching >0.95 Hit Rate and Recall and >0.93 Faithfulness and Relevancy, protected by semantic regression tests that block regressions at merge time.',
    bullets: [
      'Vector + BM25 retrieval with cross-encoder re-ranking',
      '>0.95 Hit Rate / Recall, >0.93 Faithfulness',
      'Merge-blocking semantic regression tests in CI',
    ],
    tags: [
      'Python',
      'FastAPI',
      'LlamaIndex',
      'Pinecone',
      'BM25',
      'Docker',
      'Kubernetes',
      'MLflow',
      'GitHub Actions',
      'RAG',
    ],
    highlights: [
      'Retrieval pipeline deliberately not reliant on vector similarity alone: vector retrieval plus BM25 keyword retrieval, then cross-encoder re-ranking of candidates before context reaches the LLM',
      'Offline evaluation process rather than manual answer inspection — LLM-as-judge scoring tracked through MLflow experiments',
      'Retrieval and generation quality measured on Hit Rate, Recall, Faithfulness and Relevancy; the implementation records >0.95 Hit Rate and Recall, >0.93 Faithfulness and Relevancy',
      'Packaged with Docker and deployed and orchestrated on Kubernetes',
      'MLflow experiment tracking so competing retrieval and model configurations are compared rather than swapped informally',
      'Semantic regression tests in GitHub Actions acting as merge-blocking quality gates, catching changes that would degrade RAG performance before they land',
    ],
    metrics: [
      ['Hit Rate', '>0.95'],
      ['Recall', '>0.95'],
      ['Faithfulness', '>0.93'],
      ['Relevancy', '>0.93'],
      ['Evaluation', 'LLM-as-judge + MLflow'],
      ['CI gate', 'Merge-blocking'],
    ],
    decisions: [
      'Top-k vector search is a baseline, not an architecture. Layering BM25 for exact keyword matching and a cross-encoder for re-ranking meaningfully improved what actually reached the model.',
      'A RAG system without evaluation is unfalsifiable. Offline LLM-as-judge scoring across Hit Rate, Recall, Faithfulness and Relevancy turned "seems better" into a measurable comparison.',
      'Retrieval quality silently regresses. Wiring semantic regression tests into CI as merge-blocking gates made that failure mode visible before merge instead of in production.',
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'hospital-management',
    number: '05',
    title: 'Hospital Management System',
    subtitle:
      'Secure SQL Server healthcare operations platform with stored procedures, Power BI analytics, application UI, and database automation',
    period: 'Jan 2025 – Apr 2025',
    badge: 'Database Engineer',
    icon: 'database',
    color: '#38bdf8',
    githubUrl: '#',
    description:
      'A complete database-driven software engineering project centralising healthcare operational information to reduce manual administrative work. I designed the relational database, the backend database logic, the reporting layer and the graphical interface — 10+ relational tables, 20+ stored procedures, 15 triggers, column-level AES encryption, and a Power BI layer over the live database.',
    role: 'Database Engineer',
    impact:
      'Database optimisation work records a 45% query-performance improvement, with reported data accuracy rising from 85% to 98% within one quarter and a 60% reduction in administrative workload.',
    bullets: [
      '10+ tables, 20+ stored procedures, 15 triggers',
      'Column-level AES encryption on sensitive fields',
      '45% query-performance improvement',
    ],
    tags: [
      'Microsoft SQL Server',
      'Power BI',
      'Stored Procedures',
      'Triggers',
      'ERD',
      'AES Encryption',
      'Selenium',
      'Playwright',
    ],
    highlights: [
      'Conceptual and logical modelling completed before implementation, with an ERD and logical schema designed to preserve referential integrity across interconnected hospital entities',
      'Repeated operations implemented as 20+ stored procedures and 15 triggers rather than embedded in UI code',
      'Column-level AES encryption on sensitive healthcare fields, with parameterised queries between application and database reducing reliance on dynamically assembled SQL',
      'Database implementation and optimisation work recording a 45% query-performance improvement',
      'Power BI dashboard over the live SQL Server database visualising patient inflow, service utilisation and operational trends',
      'Graphical interface connected to the SQL backend via parameterised queries and live database binding, making common operations available without writing SQL',
      'Later extended with Selenium and Playwright coverage over UI flows and application functions',
    ],
    metrics: [
      ['Relational tables', '10+'],
      ['Stored procedures', '20+'],
      ['Triggers', '15'],
      ['Query performance', '+45%'],
      ['Data accuracy', '85% → 98%'],
      ['Admin workload', '−60%'],
    ],
    decisions: [
      'Business logic in the UI layer gets duplicated and drifts. Pushing repeated operations into stored procedures and triggers kept behaviour consistent regardless of which client called it.',
      'Healthcare data justifies defence in depth — column-level AES encryption for data at rest, parameterised queries for the application boundary.',
      'The same project reads differently per audience: SQL Server and Power BI for data and BI roles, application architecture for software engineering, Selenium and Playwright for QA.',
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'restaurant-analytics',
    number: '06',
    title: 'Restaurant Visit Analysis',
    subtitle:
      '100K+ record restaurant analytics platform combining AWS RDS, R/SQL analysis, and ARIMA demand forecasting',
    period: 'Jan 2024 – Apr 2024',
    badge: 'Data Analyst',
    icon: 'forecast',
    color: '#87FB89',
    githubUrl: '#',
    description:
      'An exploration of customer and restaurant visit behaviour using a structured cloud database and statistical forecasting. I built a relational database of 10+ tables in AWS RDS and analysed more than 100K restaurant visit records, combining SQL and R for the full path from raw multi-source visit data to consistent analytical datasets and demand forecasts.',
    role: 'Data Analyst',
    impact:
      'ARIMA forecasting reaching approximately 90% accuracy over 100K+ visit records, with validation and reconciliation contributing a reported 20% improvement in revenue tracking.',
    bullets: [
      '100K+ visit records across 10+ tables in AWS RDS',
      'ARIMA forecasting at ~90% accuracy',
      'Validation + reconciliation, not assumed-clean input',
    ],
    tags: ['R', 'SQL', 'AWS RDS', 'ARIMA', 'Statistical Analysis', 'Forecasting'],
    highlights: [
      'Relational database of 10+ tables in AWS RDS consolidating multiple related restaurant datasets',
      'R and SQL pipeline covering cleaning, transformation, loading, aggregation, validation and reconciliation',
      'SQL queries and statistical tests investigating customer spending behaviour, visit frequency, peak visit periods, restaurant activity and revenue-related trends',
      'ARIMA-based demand forecasting implemented in R, documented at approximately 90% accuracy',
      'Validation and reconciliation steps included by design rather than assuming source data correctness — credited with a 20% improvement in revenue tracking',
    ],
    metrics: [
      ['Visit records analysed', '100K+'],
      ['Relational tables', '10+'],
      ['Forecast accuracy', '~90%'],
      ['Revenue tracking', '+20%'],
      ['Model', 'ARIMA'],
      ['Stack', 'R + SQL + AWS RDS'],
    ],
    decisions: [
      'Assuming source data is correct is the cheapest way to produce confident nonsense. Explicit validation and reconciliation steps caught inconsistencies before they reached the analysis.',
      'Forecasting only earns its place when the underlying aggregates are trustworthy — the cleaning and reconciliation work was the precondition for the ARIMA model being meaningful.',
      'This project is positioned for analyst-oriented roles: relational modelling, SQL, R, statistics and business interpretation rather than infrastructure depth.',
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'mbta-fare-evasion',
    number: '07',
    title: 'Combating Fare Evasion — Sustainable MBTA',
    subtitle:
      'Transit analytics and behavioural-change framework combining predictive modeling, anomaly detection, BI, and organizational change',
    period: 'Sep 2024 – Dec 2024',
    badge: 'Business Analytics',
    icon: 'transit',
    color: '#818cf8',
    githubUrl: '#',
    description:
      'An examination of how analytics, predictive modelling, behavioural science and operational change could combine to address fare evasion and transit-system performance. Unlike the purely technical projects, this one deliberately pairs data analytics with organisational and behavioural strategy — asking not only whether a proposed analytical system could work, but how an organisation would actually adopt it.',
    role: 'Business Analytics',
    impact:
      'Modelled strategy targeting a 25% reduction in annual revenue losses — an estimated $15M–$26M opportunity in the scenario analysed. These are modelled/target figures from a project proposal, not realised production savings.',
    bullets: [
      'Predictive modelling + anomaly detection on evasion patterns',
      'Modelled target: 25% cut in annual revenue loss',
      'Nudge Theory, ADKAR and McKinsey 7S adoption plan',
    ],
    tags: [
      'Predictive Modeling',
      'Anomaly Detection',
      'Power BI',
      'Tableau',
      'Nudge Theory',
      'ADKAR',
      'McKinsey 7S',
    ],
    highlights: [
      'Predictive-modelling and anomaly-detection concepts applied to identify patterns associated with fare evasion',
      'Strategy modelled around a 25% reduction in annual revenue losses, corresponding to an estimated $15M–$26M opportunity in the scenario analysed',
      'Dashboard concepts in Power BI and Tableau designed for operational and executive users to read performance trends and adjust policy',
      'Nudge Theory applied to examine how passenger behaviour could be influenced without relying entirely on enforcement',
      'Change-management framing via ADKAR and McKinsey 7S, addressing organisational adoption rather than technical feasibility alone',
    ],
    metrics: [
      ['Modelled loss reduction', '25% (target)'],
      ['Modelled opportunity', '$15M–$26M'],
      ['Status', 'Proposal, not deployed'],
      ['BI tools', 'Power BI + Tableau'],
      ['Behavioural frame', 'Nudge Theory'],
      ['Change frameworks', 'ADKAR · 7S'],
    ],
    decisions: [
      'This was a project proposal, not a deployed MBTA production system. The revenue figures are presented as modelled or target impact rather than realised savings — overstating them would misrepresent the work.',
      'A technically correct analytics system that nobody adopts changes nothing. ADKAR and McKinsey 7S were used to reason about organisational adoption as a first-class part of the solution.',
      'Enforcement is not the only lever. Nudge Theory opened a design space for influencing passenger behaviour that pure detection-and-penalty framing misses.',
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'job-hunter-v2',
    number: '08',
    title: 'Job Hunter v2',
    subtitle:
      'Parallelised job-discovery pipeline with SQLite deduplication, dual-routing delivery, and automated follow-up cadence',
    period: '2025',
    badge: 'Backend / Automation Engineer',
    icon: 'pipeline',
    color: '#22d3ee',
    githubUrl: '#',
    description:
      'A parallelised job discovery pipeline scanning 384 keyword-location combinations per cycle with exponential backoff. A SQLite deduplication engine feeds dual routing into Google Sheets and SMTP digest alerts, with a 7-day follow-up cadence — delivering 100–250+ deduplicated listings every two hours with no manual intervention.',
    role: 'Backend / Automation Engineer',
    impact:
      'Delivers 100–250+ deduplicated job listings every two hours with zero manual intervention.',
    bullets: [
      '384 keyword-location combos parallelised per cycle',
      'SQLite dedup engine with hash fingerprinting',
      '100–250+ listings delivered every 2 hours',
    ],
    tags: ['Python', 'SQLite', 'ThreadPoolExecutor', 'Google Sheets API', 'SMTP'],
    highlights: [
      'Parallelised scraping across 384 keyword-location combinations using ThreadPoolExecutor',
      'SQLite deduplication engine with hash-based fingerprinting preventing duplicate alerts',
      'Dual routing: Google Sheets for a browsable archive plus SMTP email digest for immediate alerts',
      '7-day automated follow-up cadence with engagement tracking',
      'Exponential backoff with jitter for rate-limit resilience',
    ],
    metrics: [
      ['Combos per cycle', '384'],
      ['Listings per run', '100–250+'],
      ['Cycle interval', '2 hours'],
      ['Follow-up cadence', '7 days'],
      ['Dedup strategy', 'Hash fingerprint'],
      ['Manual effort', 'None'],
    ],
    decisions: [
      'Scraping at this breadth guarantees duplicates across overlapping keyword-location queries — hash-based fingerprinting in SQLite made deduplication the pipeline’s responsibility rather than the reader’s.',
      'Rate limits are a normal operating condition, not an error. Exponential backoff with jitter kept the scan resilient without hand-tuning request timing.',
      'Two delivery modes serve two needs: an email digest for immediate triage, a Sheets archive for browsing later.',
    ],
  },
]
