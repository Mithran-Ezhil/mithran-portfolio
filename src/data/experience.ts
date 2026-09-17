import type { Experience } from '@/types'

/** One titled block inside the role detail modal. */
export interface DetailBlock {
  label: string
  /** Optional lead paragraph */
  body?: string
  /** Optional monospace pipeline line, e.g. "Source → OIC → PL/SQL → Fusion" */
  flow?: string
  /** Optional bullet list */
  items?: string[]
}

export interface ExperienceFull extends Experience {
  location: string
  /** Renders the "current role" pulse on the timeline dot */
  current?: boolean
  /** Modal overview, one entry per paragraph */
  overview: string[]
  /** Compact results panel: [label, value] pairs */
  metrics: [string, string][]
  details: DetailBlock[]
  /** "Technologies" for jobs, "Skills" for the non-technical role */
  techLabel: string
  technologies: string[]
  color: string
}

export const experiences: ExperienceFull[] = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'prodes-associate-db-engineer',
    role: 'Associate Database Engineer',
    company: 'ProDes E&T Inc.',
    location: 'East Brunswick, NJ',
    duration: 'June 2026 – Present',
    current: true,
    color: '#00d4ff',
    description:
      'Supporting multiple enterprise Oracle Fusion implementations across data engineering, financial systems, integration architecture and production support. Re-engineered five AP invoice integrations, built a PySpark reconciliation pipeline covering $1B+ in monthly transaction volume, and fixed a critical join-logic defect that was inflating reported financial variance.',
    tags: ['Oracle Fusion', 'OIC', 'PL/SQL', 'PySpark', 'Databricks', 'Power BI'],
    overview: [
      'As an Associate Database Engineer at ProDes E&T Inc., I support multiple enterprise Oracle Fusion implementations spanning data engineering, financial systems, integration architecture, reconciliation, application configuration, testing and production support. My work sits between business applications and the underlying data layer: I analyse how information moves across source systems, integrations, databases and Oracle Fusion, then design, troubleshoot, validate and document those workflows.',
      'My responsibilities have covered Oracle Fusion Financials, Oracle Integration Cloud (OIC), PL/SQL, Databricks, PySpark, Power BI, General Ledger, Accounts Payable, P2P, Inventory, B2B integrations and enterprise financial reconciliation.',
    ],
    metrics: [
      ['Monthly transaction volume', '$1B+'],
      ['AP integrations re-engineered', '5'],
      ['Join-logic iterations', '~5'],
      ['Transaction records', 'Millions'],
      ['Vertex tax dependency', 'Removed'],
      ['Power BI KPIs built', '5 recurring'],
    ],
    details: [
      {
        label: 'Enterprise Integration Architecture',
        body:
          'I analysed existing F&B inbound, Inventory, Procure-to-Pay (P2P) and B2B integrations to understand how data moved between source applications and Oracle. Rather than documenting integrations only at a high level, I traced their technical dependencies and created Technical Architecture Documents (TADs). This required understanding both the technical implementation and the business process being supported, so existing integrations could be accurately represented and redesigned where necessary.',
        items: [
          'Current-state integration flows',
          'Source and target applications',
          'Interface dependencies',
          'Data movement between systems',
          'Source-to-target mappings',
          'Transformation requirements',
          'Database dependencies',
          'Integration touchpoints',
          'Target-state architecture',
        ],
      },
      {
        label: 'AP Invoice Integration Re-Engineering',
        body:
          'I performed detailed analysis of five AP invoice integrations connecting upstream systems with Oracle Fusion, tracing invoice processing end to end. I analysed existing OIC integrations to identify the PL/SQL packages and database tables involved, documented how source fields were transformed into Oracle invoice header and line structures, then modified PL/SQL components and mapping logic where required and helped simplify the overall invoice-processing architecture. One significant improvement involved analysing and removing an existing Vertex tax-processing dependency, allowing the integration architecture to be simplified.',
        flow:
          'Source → Integration → OIC → PL/SQL → staging/temp tables → transformations → invoice headers/lines → Oracle Fusion Payables',
        items: [
          'Technical architecture diagrams',
          'Mapping documents',
          'Source-to-target mapping sheets',
          'Header/line transformation specifications',
          'Integration dependency documentation',
          'Technical design documentation',
          'Test scenarios and supporting evidence',
        ],
      },
      {
        label: 'Large-Scale Financial Reconciliation',
        body:
          'I built and enhanced a PySpark reconciliation pipeline in Databricks for comparing financial transactions across enterprise systems, processing millions of transaction records representing more than $1B in monthly transaction volume. The objective was not simply to calculate differences, but to determine whether those differences represented genuine financial discrepancies.',
        items: [
          'Full outer joins',
          'Multi-key transaction matching',
          'GroupBy aggregations',
          'Currency-safe decimal precision',
          'Source-versus-target comparison',
          'Missing transaction detection',
          'Duplicate detection',
          'Amount comparison',
          'Date comparison',
          'Status comparison',
          'Identifier comparison',
          'Regional discrepancy analysis',
        ],
      },
      {
        label: 'Critical Reconciliation Defect Resolution',
        body:
          'During reconciliation analysis I identified a critical problem in the existing join logic: the pipeline was generating false-positive discrepancies, which materially inflated the financial variance being reported. I investigated the transaction relationships, tested different matching strategies and redesigned the join-key logic through approximately five iterations. After validating the corrected logic I updated the PySpark implementation so expected, system-generated differences were no longer incorrectly classified as financial discrepancies — preventing misleading variance information from reaching downstream stakeholder reporting.',
      },
      {
        label: 'Materiality & Variance Analysis',
        body:
          'I incorporated materiality judgment into the reconciliation process. Not every technical difference between two systems represents a meaningful financial issue, so I worked on separating actionable financial discrepancies from expected or non-actionable system-generated variance. This reduced noise in reconciliation outputs and allowed stakeholders to focus on the discrepancies that actually required investigation.',
      },
      {
        label: 'Financial Data Investigation',
        body:
          'My reconciliation work included recurring comparison of financial information across source and target systems, including ARCHS/INSM-related datasets and multiple daily source-code inputs. When a discrepancy appeared, I traced the record through the underlying integration path to determine whether the issue originated in source data, mappings, transformation logic, PL/SQL processing, integration configuration or Oracle Fusion processing.',
        items: [
          'Source/target record-count differences',
          'Missing transactions',
          'Duplicate transactions',
          'Amount mismatches',
          'Status mismatches',
          'Date discrepancies',
          'Identifier mismatches',
          'Regional discrepancies',
          'Failed transactions',
          'Unexpected financial variances',
        ],
      },
      {
        label: 'Power BI & Management Reporting',
        body:
          'I designed and built a Power BI financial reconciliation dashboard to convert complex technical reconciliation output into information non-technical stakeholders could interpret. Instead of handing stakeholders raw PySpark or SQL output, the dashboard presented financial discrepancies and trends in a business-facing format. I also presented reconciliation findings directly to system owners and cross-functional teams, explaining root causes, identifying unresolved gaps and supporting decisions around correction and reprocessing.',
        items: [
          'Match Rate',
          'Variance %',
          'Regional Discrepancy Ratio',
          'Discrepancy trends',
          'Reconciliation performance',
        ],
      },
      {
        label: 'Oracle Fusion Financials',
        body:
          'My work also includes Oracle Fusion Financials configuration and support across General Ledger and Accounts Payable — giving me experience with financial data from both the application/configuration perspective and the underlying technical/data perspective.',
        items: [
          'Ledger-related configuration',
          'Accounts Payable configuration',
          'Supplier setup',
          'Bank-account setup',
          'Claims',
          'Pay groups',
          'Invoice sources',
          'AP lookups',
          'Invoice validation',
          'Payment validation',
          'Financial reconciliation',
        ],
      },
      {
        label: 'Financial Forecasting & Analysis',
        body:
          'I have supported financial analysis using historical transaction and operational information.',
        items: [
          'Historical trend analysis',
          'Variance analysis',
          'Forecasting',
          'KPI tracking',
          'Reconciliation reporting',
          'Exception analysis',
          'Financial data validation',
        ],
      },
      {
        label: 'Testing & Validation',
        body:
          'I created end-to-end test cases covering financial and integration workflows across Oracle Fusion and connected applications.',
        items: [
          'Invoice creation',
          'Invoice status',
          'Payment processing',
          'Payment number/date',
          'Source-to-target results',
          'Reconciliation results',
          'Integration behaviour',
          'Configuration changes',
          'Regression scenarios',
        ],
      },
      {
        label: 'Production Support & JIRA',
        body:
          'I worked within a JIRA-based issue-management process. For assigned tickets I investigated problems across the full stack, then documented findings, updated ticket status and comments, coordinated with functional and technical teams, validated fixes and supported issue closure or controlled reprocessing.',
        items: [
          'OIC integration logs',
          'Error messages',
          'SQL queries',
          'PL/SQL',
          'Database records',
          'Mapping documents',
          'Source data',
          'Oracle Fusion results',
        ],
      },
    ],
    techLabel: 'Technologies',
    technologies: [
      'Oracle Fusion',
      'Oracle Integration Cloud',
      'PL/SQL',
      'SQL',
      'Python',
      'PySpark',
      'Databricks',
      'Power BI',
      'Oracle Financials',
      'General Ledger',
      'Accounts Payable',
      'REST APIs',
      'JIRA',
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'prodes-data-engineer-coop',
    role: 'Data Engineer (Co-op)',
    company: 'ProDes E&T Inc.',
    location: 'East Brunswick, NJ',
    duration: 'June 2025 – Dec 2025',
    color: '#0ea5e9',
    description:
      'Built an automated framework for migrating and reconciling 100K+ supplier records from SAP and other enterprise systems into Oracle Fusion, cutting a two-week conversion cycle to roughly one hour. Also developed a PySpark/Databricks reconciliation framework across 4M+ financial settlement transactions.',
    tags: ['Python', 'PySpark', 'Databricks', 'SAP', 'Oracle Fusion', 'FBDI'],
    overview: [
      'As a Data Engineer Co-op I focused primarily on enterprise data migration, data quality, reconciliation, Python/PySpark engineering, Databricks and Oracle Fusion.',
      'My largest initiative was developing an automated framework for migrating and reconciling 100K+ supplier records from SAP and other enterprise systems into Oracle Fusion. I also developed large-scale reconciliation workflows covering 4M+ financial settlement transactions.',
    ],
    metrics: [
      ['Supplier records migrated', '100K+'],
      ['Conversion cycle', '2 weeks → ~1 hr'],
      ['First-pass match accuracy', '~95%'],
      ['Settlement transactions', '4M+'],
      ['Data release cycle', '−60%'],
      ['Reconciliation stages', '2'],
    ],
    details: [
      {
        label: 'SAP-to-Oracle Fusion Supplier Migration',
        body:
          'The supplier-conversion process initially required extensive manual preparation, mapping, validation and file generation — a complete conversion cycle could take approximately two weeks. I helped redesign the process around Python-based automation. Once the framework was established, FBDI datasets could be generated rapidly and complete supplier-load preparation was reduced to roughly one hour.',
        flow:
          'SAP/Legacy Data → Profiling → Cleansing → Normalisation → Mapping → Transformation → Validation → Deduplication → Matching → Reconciliation → Oracle FBDI Preparation',
      },
      {
        label: 'Data Profiling & Cleansing',
        body:
          'Before conversion I profiled incoming supplier data to identify quality issues, then developed normalisation and cleansing rules so matching and transformation occurred on standardised data.',
        items: [
          'Missing attributes',
          'Duplicate suppliers',
          'Inconsistent names',
          'Address variations',
          'Invalid reference values',
          'Formatting differences',
          'Existing-versus-new entity ambiguity',
        ],
      },
      {
        label: 'Source-to-Target Mapping',
        body:
          'Oracle supplier conversion required preserving relationships between multiple enterprise entities. I mapped source attributes to their corresponding Oracle structures while maintaining dependencies between related records.',
        items: [
          'Suppliers',
          'Parties',
          'Addresses',
          'Party Sites',
          'Supplier Sites',
          'Site Assignments',
          'Customer/Party structures',
          'Customer Accounts',
          'Account Sites',
          'Bank Accounts',
          'Business Classifications',
        ],
      },
      {
        label: 'Entity Resolution & Fuzzy Matching',
        body:
          'One of the major challenges was determining whether an incoming supplier already existed in Oracle or needed to be created. I developed a matching framework combining deterministic and fuzzy techniques, which achieved approximately 95% first-pass matching accuracy.',
        items: [
          'Normalised supplier names',
          'Tax identifiers',
          'Token similarity',
          'Numeric identifiers',
          'Address information',
          'Existing reconciliation records',
        ],
      },
      {
        label: 'Two-Stage Reconciliation Engine',
        body:
          'I implemented a two-stage reconciliation strategy: the first stage attempted high-confidence deterministic matches, and records that could not be resolved were passed to a fuzzy-matching stage. This improved consistency when deciding whether an incoming record represented an existing Oracle entity or a new supplier.',
        items: [
          'Collision detection',
          'Address-based tie-breaking',
          'Match classification',
          'Insert/update determination',
        ],
      },
      {
        label: '4M+ Transaction Reconciliation',
        body:
          'In addition to supplier migration I developed a PySpark/Databricks reconciliation framework analysing more than 4M financial settlement transactions, using distributed processing to surface discrepancies. Automated match-quality scoring helped prioritise records requiring further investigation.',
        items: [
          'Missing records',
          'Duplicate records',
          'Transaction discrepancies',
          'Matching inconsistencies',
          'Multi-level reconciliation differences',
        ],
      },
      {
        label: 'Error Diagnostics & Reprocessing',
        body:
          'I created reusable Python-based failure-diagnostics workflows, which reduced unnecessary full reruns and contributed to an approximately 60% reduction in the data release cycle.',
        items: [
          'Structured error logging',
          'Record-level validation',
          'Exception outputs',
          'Failure classification',
          'Targeted reprocessing',
        ],
      },
      {
        label: 'Iterative Conversion Testing',
        body:
          'Supplier migration involved multiple conversion cycles rather than a single load, which allowed conversion quality to improve iteratively before final migration.',
        flow:
          'Generate → Validate → Test/Load → Reconcile → Investigate rejected/unmatched records → Correct mapping/transformation → Regenerate',
      },
      {
        label: 'Oracle Fusion Exposure',
        body:
          'I worked with Oracle Fusion data across several domains, supporting extraction, migration, validation, reconciliation and reporting activities.',
        items: [
          'Suppliers',
          'Procurement',
          'Payables',
          'Receivables',
          'General Ledger',
          'Party/Customer',
          'Fixed Assets',
        ],
      },
      {
        label: 'Integration & Automation',
        body:
          'I automated movement and processing of enterprise data between source and target systems.',
        items: ['REST APIs', 'SFTP/FTP', 'Python automation', 'Oracle Cloud', 'Databricks'],
      },
    ],
    techLabel: 'Technologies',
    technologies: [
      'Python',
      'PySpark',
      'Pandas',
      'Databricks',
      'SAP',
      'Oracle Fusion',
      'FBDI',
      'SQL',
      'REST APIs',
      'SFTP/FTP',
      'Data Migration',
      'Data Quality',
      'Entity Resolution',
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'unigenix-data-analyst-intern',
    role: 'Data Analyst Intern',
    company: 'Unigenix',
    location: 'Chennai, India',
    duration: 'Jan 2024 – Aug 2024',
    color: '#38bdf8',
    description:
      'Engineered automated ETL workflows across FTP, REST/SOAP APIs, Salesforce and Oracle EBS processing 50K+ records per day, cutting pipeline failures by ~40%. Parameterised Oracle SQL datasets powered 6+ dashboards and 10+ finance/procurement KPIs, reducing ad-hoc reporting turnaround from two days to under an hour.',
    tags: ['Oracle SQL', 'ETL', 'REST/SOAP APIs', 'Salesforce', 'Oracle EBS'],
    overview: [
      'As a Data Analyst Intern I worked on ETL automation, enterprise API integrations, Oracle SQL, Oracle EBS data, data validation and business reporting.',
      'The role gave me early experience building reliable data pipelines and transforming enterprise operational data into datasets used for finance and procurement reporting.',
    ],
    metrics: [
      ['Records per day', '50K+'],
      ['Pipeline failures', '−40%'],
      ['Dashboards supported', '6+'],
      ['Finance/procurement KPIs', '10+'],
      ['Ad-hoc reporting', '2 days → <1 hr'],
      ['Oracle EBS schemas', '5+'],
    ],
    details: [
      {
        label: 'ETL Pipeline Development',
        body:
          'I engineered automated ETL workflows integrating multiple enterprise sources, processing approximately 50K+ records per day. I implemented validation, error handling and retry mechanisms to make the workflows more fault tolerant — improvements that reduced pipeline failures by approximately 40%.',
        items: ['FTP', 'REST APIs', 'SOAP APIs', 'Salesforce', 'Oracle EBS'],
      },
      {
        label: 'Oracle SQL & Analytics',
        body:
          'I developed parameterised Oracle SQL queries whose resulting datasets supported more than 6 dashboards and 10+ finance/procurement KPIs.',
        items: [
          'Joins',
          'Aggregations',
          'Filters',
          'Reusable query logic',
          'Cross-schema data extraction',
        ],
      },
      {
        label: 'Reporting Optimisation',
        body:
          'Recurring business questions previously required significant manual analysis. I developed reusable SQL datasets and standardised analytical queries that reduced ad-hoc reporting turnaround from approximately two days to under one hour.',
      },
      {
        label: 'Data Quality',
        body:
          'I performed validation and reconciliation across inbound source information, Oracle EBS records and downstream reporting datasets.',
        items: [
          'Missing records',
          'Duplicate records',
          'Inconsistent values',
          'ETL failures',
          'Mapping discrepancies',
          'Source/report differences',
        ],
      },
      {
        label: 'Oracle EBS & Access Controls',
        body:
          'I worked across 5+ Oracle EBS schemas and supported role-based data access, which gave me experience with both enterprise reporting and controlled access to financial and operational information.',
        items: [
          'Source schemas',
          'Mapping requirements',
          'Validation rules',
          'Reporting requirements',
        ],
      },
    ],
    techLabel: 'Technologies',
    technologies: [
      'Oracle SQL',
      'SQL',
      'ETL',
      'REST APIs',
      'SOAP APIs',
      'FTP',
      'Salesforce',
      'Oracle EBS',
      'Data Validation',
      'Data Reconciliation',
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'recharge-pr-head',
    role: 'Public Relations Head',
    company: "RECHARGE '24 — Rajalakshmi Engineering College",
    location: 'Chennai, India',
    duration: 'Dec 2022 – Mar 2024',
    color: '#87FB89',
    description:
      "Led planning and execution of RECHARGE '24, a student-led festival of ~120 events and 10,000+ attendees. Secured ~$24K from 10+ sponsors and helped direct a 100-member team across communications, logistics, vendor coordination and sponsor relationships.",
    tags: ['Leadership', 'Stakeholder Management', 'Sponsorship', 'Event Operations'],
    overview: [
      "As Public Relations Head for RECHARGE '24, I helped lead the planning and execution of a large student-led college festival consisting of approximately 120 events and 10,000+ attendees.",
      'The role required coordination across sponsorship, communications, vendors, logistics and internal teams.',
    ],
    metrics: [
      ['Events', '~120'],
      ['Attendees', '10,000+'],
      ['Sponsorship secured', '~$24K'],
      ['Sponsors', '10+'],
      ['Team directed', '100 members'],
      ['Duration', '15 months'],
    ],
    details: [
      {
        label: 'Sponsorship & External Relations',
        body:
          'I helped secure approximately $24K in sponsorship funding from 10+ sponsors. This involved sponsor outreach, communication, relationship management and coordination around event requirements.',
      },
      {
        label: 'Team Leadership',
        body:
          'I helped direct a 100-member team, which strengthened my ability to manage dependencies across large groups and communicate with people from different functional backgrounds.',
        items: [
          'Communications',
          'Logistics',
          'Vendor coordination',
          'Event operations',
          'Sponsor relationships',
        ],
      },
      {
        label: 'Event Operations',
        body:
          'Supporting a 120-event festival required coordinating multiple activities simultaneously while ensuring teams, sponsors, vendors and event organisers remained aligned.',
        items: [
          'Stakeholder management',
          'Leadership',
          'Cross-functional coordination',
          'External communication',
          'Event planning',
          'Problem solving',
        ],
      },
    ],
    techLabel: 'Skills',
    technologies: [
      'Leadership',
      'Stakeholder Management',
      'Team Management',
      'Sponsorship',
      'Communications',
      'Event Operations',
      'Vendor Coordination',
    ],
  },
]
