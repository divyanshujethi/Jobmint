export interface PodMember {
  id: string;
  name: string;
  avatarInitial: string;
  college: string;
  roleInterest: string;
  isBot?: boolean;
}

export interface PodInterviewQuestion {
  question: string;
  focusArea: string;
  starTip: string;
}

export interface StudyPod {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "AI & ML" | "Web Development" | "Data Science" | "Mobile" | "Backend & Systems" | "DevOps & Cloud" | "Cybersecurity";
  roadmapSlug: string;
  primarySkill: string;
  memberCount: number;
  maxMembers: number;
  meetingCadence: string;
  currentPhaseNumber: number;
  phaseTitle: string;
  activeMembers: PodMember[];
  mockQuestions: PodInterviewQuestion[];
  dailyTopic?: string;
  dailyChallenge?: string;
}

export const BOT_COORDINATOR: PodMember = {
  id: "cohort-bot",
  name: "RoleNest Cohort Bot",
  avatarInitial: "🤖",
  college: "Verified AI Coordinator",
  roleInterest: "Technical Study Mentor",
  isBot: true,
};

export const MOCK_STUDY_PODS: StudyPod[] = [
  {
    id: "pod-1",
    slug: "ai-llm-builders-pod",
    title: "AI & LLM Systems Pod",
    description: "Collaborative cohort following Andrej Karpathy and Fast.ai roadmaps. We build fine-tuned small LLMs and RAG pipelines.",
    category: "AI & ML",
    roadmapSlug: "ai-engineer",
    primarySkill: "PyTorch",
    memberCount: 6,
    maxMembers: 10,
    meetingCadence: "Tuesdays & Saturdays at 7:30 PM IST",
    currentPhaseNumber: 3,
    phaseTitle: "Transformers & Attention Mechanism Deep Dive",
    dailyTopic: "KV Caching implementation and multi-query attention memory savings",
    dailyChallenge: "Benchmark FP16 vs INT4 quantized matrix multiplication inference latency on GPU",
    activeMembers: [
      BOT_COORDINATOR,
      { id: "m1", name: "Aarav Sharma", avatarInitial: "A", college: "IIT Delhi", roleInterest: "ML Research" },
      { id: "m2", name: "Priya Nair", avatarInitial: "P", college: "BITS Pilani", roleInterest: "GenAI Architect" },
      { id: "m3", name: "Rohan V.", avatarInitial: "R", college: "NIT Trichy", roleInterest: "Computer Vision" },
      { id: "m4", name: "Elena Rostova", avatarInitial: "E", college: "Univ. of Waterloo", roleInterest: "LLM Fine-tuning" },
    ],
    mockQuestions: [
      {
        question: "Explain the architectural difference between self-attention and cross-attention in Transformer models.",
        focusArea: "Deep Learning Fundamentals",
        starTip: "Discuss queries, keys, and values projection matrices. Detail where encoder-decoder models inject cross-attention.",
      },
      {
        question: "How do you mitigate catastrophic forgetting when fine-tuning an open-source model using LoRA / QLoRA?",
        focusArea: "Practical LLM Fine-Tuning",
        starTip: "Explain rank matrices (A & B), parameter efficiency, freezing base weights, and validation loss tracking.",
      },
      {
        question: "Describe a project where you encountered vanishing or exploding gradients and how you diagnosed it.",
        focusArea: "Debugging & Problem Solving",
        starTip: "Use the STAR framework: Situation (training loss stagnated), Task (debug tensor values), Action (gradient clipping, layer norm), Result.",
      },
      {
        question: "How do you evaluate retrieval precision and context hallucination in a production RAG system?",
        focusArea: "RAG Evaluation (Ragas / TruLens)",
        starTip: "Mention context recall, context precision, answer relevancy, and embedding vector similarity thresholds.",
      },
      {
        question: "What excites you most about open-weights AI models versus proprietary closed APIs?",
        focusArea: "Industry Awareness & Motivation",
        starTip: "Highlight latency control, local data privacy, cost predictability, and independence from cloud vendor lock-in.",
      },
    ],
  },
  {
    id: "pod-2",
    slug: "full-stack-nextjs-pod",
    title: "Full-Stack TypeScript & Next.js Pod",
    description: "Building production web apps with Next.js 15, PostgreSQL, and Drizzle ORM. Focus on clean architecture and zero-egress deployments.",
    category: "Web Development",
    roadmapSlug: "fullstack-developer",
    primarySkill: "Next.js",
    memberCount: 7,
    maxMembers: 10,
    meetingCadence: "Mondays & Thursdays at 8:00 PM IST",
    currentPhaseNumber: 2,
    phaseTitle: "Relational Schemas, ACID Transactions & Drizzle ORM",
    dailyTopic: "Server Actions optimistic UI rollback strategies with useOptimistic",
    dailyChallenge: "Build a debounced auto-saving markdown editor with LocalStorage and Postgres sync",
    activeMembers: [
      BOT_COORDINATOR,
      { id: "m5", name: "Devansh Mehta", avatarInitial: "D", college: "IIIT Hyderabad", roleInterest: "Full-Stack Web" },
      { id: "m6", name: "Ananya Iyer", avatarInitial: "A", college: "VIT Vellore", roleInterest: "Frontend Lead" },
      { id: "m7", name: "Marcus Chen", avatarInitial: "M", college: "UC Berkeley", roleInterest: "Next.js Platform" },
    ],
    mockQuestions: [
      {
        question: "How do Next.js Server Components differ from Client Components in terms of bundle delivery and data fetching?",
        focusArea: "Next.js & React 19 Architecture",
        starTip: "Explain that RSCs execute strictly on the server, zero client bundle weight, while client components hydrate for DOM events.",
      },
      {
        question: "Walk through designing an idempotent webhook handler in Node.js / PostgreSQL for payment updates.",
        focusArea: "System Reliability & Transactions",
        starTip: "Discuss unique constraint keys on event IDs, database transactions, locking rows, and acknowledging HTTP 200.",
      },
      {
        question: "How do you isolate client-side rendering bottlenecks like Core Web Vitals LCP and INP?",
        focusArea: "Frontend Performance",
        starTip: "Mention DevTools Performance panel, reducing JavaScript execution time, image fetch priorities, and code splitting.",
      },
      {
        question: "Explain the difference between optimistic UI updates and pessimistic server responses.",
        focusArea: "State Management & UX",
        starTip: "Contrast immediate client feedback with rollback mechanisms on API failure vs waiting for HTTP roundtrip.",
      },
      {
        question: "Why do you prefer TypeScript strict mode over standard JavaScript for early-stage team codebases?",
        focusArea: "Code Quality & Invariants",
        starTip: "Discuss compile-time error catching, automated refactoring confidence, self-documenting interfaces, and eliminating null checks.",
      },
    ],
  },
  {
    id: "pod-3",
    slug: "data-science-analytics-pod",
    title: "Data Science & Applied Analytics Pod",
    description: "Deep dive into statistical inference, SQL window functions, exploratory data analysis with Pandas, and scikit-learn models.",
    category: "Data Science",
    roadmapSlug: "data-analyst",
    primarySkill: "SQL",
    memberCount: 5,
    maxMembers: 8,
    meetingCadence: "Wednesdays & Sundays at 6:30 PM IST",
    currentPhaseNumber: 2,
    phaseTitle: "Advanced SQL: CTEs, Window Functions & Joins",
    dailyTopic: "Customer Cohort Retention matrix computation in pure PostgreSQL",
    dailyChallenge: "Write a query computing 30-day rolling average churn rate with zero subquery overhead",
    activeMembers: [
      BOT_COORDINATOR,
      { id: "m8", name: "Kavya Patel", avatarInitial: "K", college: "IIM Bangalore", roleInterest: "Data Scientist" },
      { id: "m9", name: "Siddharth Roy", avatarInitial: "S", college: "SRM University", roleInterest: "BI Engineer" },
    ],
    mockQuestions: [
      {
        question: "What is the difference between RANK(), DENSE_RANK(), and ROW_NUMBER() in SQL window functions?",
        focusArea: "Advanced SQL",
        starTip: "Detail handling of duplicate tie values: ROW_NUMBER increments sequentially, RANK leaves gaps, DENSE_RANK does not leave gaps.",
      },
      {
        question: "How do you detect and handle data leakage when preparing train and test splits for supervised learning?",
        focusArea: "Machine Learning Rigor",
        starTip: "Explain why scaling and imputation parameters must fit ONLY on the training split before transforming the test split.",
      },
      {
        question: "Can you explain Simpson's Paradox using an intuitive real-world data scenario?",
        focusArea: "Statistical Reasoning",
        starTip: "Provide an example where a trend appears in different groups of data but disappears or reverses when the groups are combined.",
      },
      {
        question: "When would you choose an ROC-AUC score over raw accuracy for evaluating binary classification?",
        focusArea: "Model Evaluation",
        starTip: "Discuss class imbalance (e.g. 99% negative vs 1% fraud detection) where 99% accuracy is completely deceptive.",
      },
      {
        question: "Describe how you communicate complex statistical findings to non-technical business stakeholders.",
        focusArea: "Communication & Storytelling",
        starTip: "Explain translating technical metrics into business impact, risk reduction, and actionable next steps.",
      },
    ],
  },
  {
    id: "pod-4",
    slug: "mobile-react-native-pod",
    title: "Mobile App Developers (React Native & Flutter) Pod",
    description: "Cross-platform mobile development with Expo SDK 52, offline-first SQLite synchronization, and native device APIs.",
    category: "Mobile",
    roadmapSlug: "mobile-engineer",
    primarySkill: "React Native",
    memberCount: 5,
    maxMembers: 8,
    meetingCadence: "Wednesdays & Fridays at 7:00 PM IST",
    currentPhaseNumber: 2,
    phaseTitle: "Navigation Hierarchies, Gesture Handlers & Device Storage",
    dailyTopic: "Offline SQLite sync queue reconciliation algorithms",
    dailyChallenge: "Implement 60fps swipe-to-dismiss gesture using Reanimated 3 with spring physics",
    activeMembers: [
      BOT_COORDINATOR,
      { id: "m10", name: "Tanmay Ghosh", avatarInitial: "T", college: "Jadavpur Univ", roleInterest: "Mobile Tech Lead" },
      { id: "m11", name: "Rachel Adams", avatarInitial: "R", college: "Georgia Tech", roleInterest: "iOS / React Native" },
    ],
    mockQuestions: [
      {
        question: "How does the React Native New Architecture (Fabric & TurboModules) improve communication over the legacy JS bridge?",
        focusArea: "React Native Core Architecture",
        starTip: "Discuss JSI (JavaScript Interface), synchronous C++ bindings, eliminating asynchronous JSON serialization bottlenecks.",
      },
      {
        question: "How do you architect an offline-first mobile application with background synchronization?",
        focusArea: "Mobile Systems Architecture",
        starTip: "Cover local SQLite/WatermelonDB storage, optimistic UI updates, conflict resolution strategies (e.g. last-write-wins).",
      },
      {
        question: "Walk through optimizing 60 FPS list scrolling in React Native when rendering hundreds of media items.",
        focusArea: "Mobile Rendering Performance",
        starTip: "Mention FlashList, recycling views, getItemLayout to bypass measurements, memoizing renderItem, and resizing images.",
      },
    ],
  },
  {
    id: "pod-5",
    slug: "backend-systems-pod",
    title: "Backend & Distributed Systems Architects Pod",
    description: "Mastering Go, Kafka partitions, Redis caching topologies, B-Tree storage engines, and high-concurrency microservices.",
    category: "Backend & Systems",
    roadmapSlug: "backend-systems",
    primarySkill: "Go & Kafka",
    memberCount: 7,
    maxMembers: 10,
    meetingCadence: "Tuesdays & Fridays at 8:30 PM IST",
    currentPhaseNumber: 3,
    phaseTitle: "Event-Driven Kafka Architecture & Redis Distributed Caching",
    dailyTopic: "Mitigating Kafka consumer lag and designing dead-letter queues",
    dailyChallenge: "Build an atomic sliding window rate limiter in Go using Redis Lua scripts",
    activeMembers: [
      BOT_COORDINATOR,
      { id: "m12", name: "Nikhil Verma", avatarInitial: "N", college: "IIT Bombay", roleInterest: "Distributed Systems" },
      { id: "m13", name: "Aditi Rao", avatarInitial: "A", college: "DTU Delhi", roleInterest: "Backend Engineer" },
      { id: "m14", name: "Stefan Meyer", avatarInitial: "S", college: "TU Munich", roleInterest: "Go Core Dev" },
    ],
    mockQuestions: [
      {
        question: "Explain the difference between optimistic and pessimistic locking in high-throughput PostgreSQL databases.",
        focusArea: "Database Concurrency",
        starTip: "Discuss version columns / CAS operations vs SELECT FOR UPDATE, comparing contention overhead under high concurrency.",
      },
      {
        question: "How do you prevent cache stampedes (dog-piling) when popular cached keys expire?",
        focusArea: "Distributed Caching",
        starTip: "Explain singleflight request coalescing, probabilistic early expiration (XFetch algorithm), and mutex locking.",
      },
      {
        question: "How does the Raft consensus algorithm guarantee leader election safety and log consistency?",
        focusArea: "Distributed Consensus",
        starTip: "Cover election timers, randomized heartbeats, quorum votes (N/2 + 1), and log term comparisons.",
      },
    ],
  },
  {
    id: "pod-6",
    slug: "devops-cloud-pod",
    title: "DevOps & Cloud Platform SRE Pod",
    description: "Hands-on multi-AZ Terraform IaC, Kubernetes GitOps deployments with ArgoCD, distroless Docker containers, and Prometheus observability.",
    category: "DevOps & Cloud",
    roadmapSlug: "devops-cloud",
    primarySkill: "Kubernetes & Terraform",
    memberCount: 6,
    maxMembers: 10,
    meetingCadence: "Mondays & Thursdays at 7:00 PM IST",
    currentPhaseNumber: 2,
    phaseTitle: "Kubernetes Cluster Architecture & GitOps with ArgoCD",
    dailyTopic: "Argo Rollouts canary deployment strategies with automated metrics rollback",
    dailyChallenge: "Write a multi-stage distroless Dockerfile under 40MB passing zero CVE Trivy scans",
    activeMembers: [
      BOT_COORDINATOR,
      { id: "m15", name: "Varun Kapoor", avatarInitial: "V", college: "BITS Goa", roleInterest: "Cloud Platform SRE" },
      { id: "m16", name: "Sarah Jenkins", avatarInitial: "S", college: "Imperial College", roleInterest: "DevOps Engineer" },
    ],
    mockQuestions: [
      {
        question: "What is the difference between a Kubernetes Deployment and a StatefulSet regarding pod identity and storage?",
        focusArea: "Kubernetes Orchestration",
        starTip: "Explain sticky ordinal pod identities (pod-0, pod-1) and dedicated PersistentVolumeClaim volume templates in StatefulSets.",
      },
      {
        question: "How do you manage remote state locking and secret isolation in production Terraform pipelines?",
        focusArea: "Infrastructure as Code",
        starTip: "Cover S3 backend with DynamoDB locking, least-privilege IAM policies, and injecting secrets via HashiCorp Vault.",
      },
      {
        question: "Walk through setting up an SLO alert in Prometheus based on 99.9% HTTP success rate over a 30-day rolling window.",
        focusArea: "Site Reliability Engineering",
        starTip: "Mention error budgets, burn rate alerting, rate(http_requests_total[5m]), and multi-window multi-burn-rate alerts.",
      },
    ],
  },
  {
    id: "pod-7",
    slug: "cybersecurity-soc-pod",
    title: "Cybersecurity & Cloud Security Engineers Pod",
    description: "Offensive web penetration testing (OWASP Top 10), Wireshark packet analysis, AWS IAM hardening, and Wazuh SIEM threat hunting.",
    category: "Cybersecurity",
    roadmapSlug: "cybersecurity",
    primarySkill: "OWASP & AWS IAM",
    memberCount: 6,
    maxMembers: 8,
    meetingCadence: "Wednesdays & Saturdays at 8:00 PM IST",
    currentPhaseNumber: 2,
    phaseTitle: "Web Application Security & OWASP Top 10 Exploitation",
    dailyTopic: "Server-Side Request Forgery (SSRF) bypasses targeting AWS IMDSv2 metadata",
    dailyChallenge: "Audit public S3 buckets and wildcard IAM permissions using Python Boto3",
    activeMembers: [
      BOT_COORDINATOR,
      { id: "m17", name: "Kunal Singhal", avatarInitial: "K", college: "IIIT Allahabad", roleInterest: "Security Analyst" },
      { id: "m18", name: "Alexandre Moreau", avatarInitial: "A", college: "EPFL Switzerland", roleInterest: "Penetration Tester" },
    ],
    mockQuestions: [
      {
        question: "How does IMDSv2 in AWS protect EC2 instances against SSRF exploitation compared to legacy IMDSv1?",
        focusArea: "Cloud Security",
        starTip: "Detail session-oriented token requirement via HTTP PUT with X-aws-ec2-metadata-token header, blocking simple SSRF proxies.",
      },
      {
        question: "Explain the mechanics of a Blind SQL Injection attack and how automated tools extract data bit-by-bit.",
        focusArea: "Offensive Security",
        starTip: "Cover Boolean-based (true/false responses) and Time-based (sleep delays) payload conditions with binary search logic.",
      },
      {
        question: "How do you write a Sigma rule detecting suspicious PowerShell encoded commands across endpoint logs?",
        focusArea: "SIEM & SOC Operations",
        starTip: "Explain matching on CommandLine contains '-enc' or '-EncodedCommand' and correlating with parent process IDs.",
      },
    ],
  },
  {
    id: "pod-8",
    slug: "data-engineering-lakehouse-pod",
    title: "Data Engineering & Real-Time Lakehouse Pod",
    description: "Petabyte data pipelines with Apache Spark DataFrames, Kafka event streams, dbt data models, and Delta Lake ACID transactions.",
    category: "Data Science",
    roadmapSlug: "data-engineer",
    primarySkill: "Apache Spark & dbt",
    memberCount: 7,
    maxMembers: 10,
    meetingCadence: "Mondays & Fridays at 7:30 PM IST",
    currentPhaseNumber: 2,
    phaseTitle: "Distributed Batch Processing with Apache Spark & Catalyst Optimizer",
    dailyTopic: "Resolving data skew and out-of-memory shuffles with salt keys in PySpark",
    dailyChallenge: "Build an incremental dbt model with unique constraints and automated freshness tests",
    activeMembers: [
      BOT_COORDINATOR,
      { id: "m19", name: "Harshwardhan J.", avatarInitial: "H", college: "IIT Roorkee", roleInterest: "Data Platform Architect" },
      { id: "m20", name: "Chloe Dupont", avatarInitial: "C", college: "Polytechnique Paris", roleInterest: "Big Data Engineer" },
    ],
    mockQuestions: [
      {
        question: "How does Spark's Catalyst Optimizer optimize physical execution plans through predicate pushdown and projection pruning?",
        focusArea: "Distributed Query Optimization",
        starTip: "Explain pushing WHERE clauses directly down to columnar Parquet file readers before pulling data into memory.",
      },
      {
        question: "What are the core advantages of Delta Lake ACID logs over raw Parquet files in Cloud Object Storage?",
        focusArea: "Lakehouse Architecture",
        starTip: "Cover transaction logs (_delta_log), ACID guarantees, schema enforcement, time-travel queries, and OPTIMIZE compaction.",
      },
      {
        question: "How do you handle late-arriving event data using watermarking in Spark Structured Streaming?",
        focusArea: "Streaming Systems",
        starTip: "Discuss withWatermark() threshold, tumbling event-time windows, and dropping records older than maximum expected delay.",
      },
    ],
  },
];

export function getStudyPods(): StudyPod[] {
  return MOCK_STUDY_PODS;
}

export function getStudyPodBySlug(slug: string): StudyPod | undefined {
  return MOCK_STUDY_PODS.find((p) => p.slug === slug);
}
