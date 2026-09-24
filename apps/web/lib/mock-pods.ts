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
  category: "AI & ML" | "Web Development" | "Data Science" | "Mobile";
  roadmapSlug: string;
  primarySkill: string;
  memberCount: number;
  maxMembers: number;
  meetingCadence: string;
  currentPhaseNumber: number;
  phaseTitle: string;
  activeMembers: PodMember[];
  mockQuestions: PodInterviewQuestion[];
}

export const BOT_COORDINATOR: PodMember = {
  id: "cohort-bot",
  name: "JobMint Cohort Bot",
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
    memberCount: 1,
    maxMembers: 8,
    meetingCadence: "Tuesdays & Saturdays at 7:30 PM IST",
    currentPhaseNumber: 3,
    phaseTitle: "Transformers & Attention Mechanism Deep Dive",
    activeMembers: [BOT_COORDINATOR],
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
    roadmapSlug: "full-stack",
    primarySkill: "Next.js",
    memberCount: 1,
    maxMembers: 8,
    meetingCadence: "Mondays & Thursdays at 8:00 PM IST",
    currentPhaseNumber: 2,
    phaseTitle: "Relational Schemas, ACID Transactions & Drizzle ORM",
    activeMembers: [BOT_COORDINATOR],
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
    roadmapSlug: "data-science",
    primarySkill: "SQL",
    memberCount: 1,
    maxMembers: 6,
    meetingCadence: "Wednesdays & Sundays at 6:30 PM IST",
    currentPhaseNumber: 2,
    phaseTitle: "Advanced SQL: CTEs, Window Functions & Joins",
    activeMembers: [BOT_COORDINATOR],
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
    title: "Mobile App Developers (React Native & Expo) Pod",
    description: "Cross-platform mobile development with Expo SDK 52, offline-first SQLite synchronization, and native device APIs.",
    category: "Mobile",
    roadmapSlug: "mobile",
    primarySkill: "React Native",
    memberCount: 1,
    maxMembers: 8,
    meetingCadence: "Wednesdays & Fridays at 7:00 PM IST",
    currentPhaseNumber: 2,
    phaseTitle: "Navigation Hierarchies, Gesture Handlers & Device Storage",
    activeMembers: [BOT_COORDINATOR],
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
      {
        question: "What are the key differences in permission handling between Android 13+ (Runtime) and iOS?",
        focusArea: "Native Platform Invariants",
        starTip: "Explain explicit runtime permission prompts, graceful degradation when users deny permissions, and OS privacy policies.",
      },
      {
        question: "Why does cross-platform React Native fit early-career startups better than separate Swift and Kotlin codebases?",
        focusArea: "Engineering Tradeoffs",
        starTip: "Highlight unified team velocity, shared TypeScript business logic with web, and single bug-fix deployment via OTA updates.",
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
