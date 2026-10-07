export interface FreeResource {
  title: string;
  provider: string; // e.g. "YouTube (Andrej Karpathy)", "Harvard CS50", "Fast.ai", "Full Stack Open"
  url: string;
  type: "Course" | "Video Series" | "Interactive" | "Documentation";
  estimatedHours: number;
  cost: "100% Free";
  badge?: string; // "Top Pick", "Beginner Friendly", "Industry Gold Standard"
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  description: string;
  skills: string[]; // skill slugs
  resources: FreeResource[];
  projectIdea: {
    title: string;
    description: string;
    deliverables: string[];
  };
}

export interface SprintMilestone {
  id: string;
  task: string;
  deliverable: string;
  estimatedHours: number;
  xpBonus: number;
}

export interface RoadmapSprintWeek {
  weekNumber: number;
  title: string;
  theme: string;
  milestones: SprintMilestone[];
}

export interface CareerRoadmap {
  slug: string;
  title: string;
  shortDescription: string;
  category: "AI & ML" | "Web Development" | "Data Science" | "Mobile" | "Backend & Systems" | "DevOps & Cloud" | "Cybersecurity";
  durationWeeks: string;
  level: "Beginner to Pro" | "Intermediate";
  keySkills: string[];
  phases: RoadmapPhase[];
  weeklySprints?: RoadmapSprintWeek[];
}

export const CAREER_ROADMAPS: CareerRoadmap[] = [
  {
    slug: "ai-engineer",
    title: "AI & Machine Learning Engineer",
    shortDescription:
      "Master Python, Linear Algebra, Neural Networks, PyTorch, and modern LLM / RAG architectures with zero paid courses.",
    category: "AI & ML",
    durationWeeks: "10–14 Weeks",
    level: "Beginner to Pro",
    keySkills: ["Python", "PyTorch", "Hugging Face", "Vector Databases", "LangChain"],
    phases: [
      {
        phaseNumber: 1,
        title: "Python Foundations & Mathematical Intuition",
        description: "Core Python, Matrix Multiplication, NumPy vectorization, and basic calculus intuition.",
        skills: ["python", "pandas-numpy"],
        resources: [
          {
            title: "CS50's Introduction to Artificial Intelligence with Python",
            provider: "Harvard Online (edX/YouTube)",
            url: "https://cs50.harvard.edu/ai/",
            type: "Course",
            estimatedHours: 30,
            cost: "100% Free",
            badge: "Beginner Friendly",
          },
          {
            title: "Essence of Linear Algebra",
            provider: "3Blue1Brown",
            url: "https://www.3blue1brown.com/topics/linear-algebra",
            type: "Video Series",
            estimatedHours: 6,
            cost: "100% Free",
            badge: "Visual Masterclass",
          },
        ],
        projectIdea: {
          title: "NumPy-Only Multilayer Perceptron",
          description: "Build backpropagation and gradient descent from scratch without using PyTorch or TensorFlow.",
          deliverables: ["Pure Python matrix math", "MNIST digit classification >95% accuracy", "GitHub repository with README explanations"],
        },
      },
      {
        phaseNumber: 2,
        title: "Deep Learning & Neural Networks (PyTorch)",
        description: "From backpropagation to Convolutional and Recurrent Networks using PyTorch.",
        skills: ["pytorch", "machine-learning"],
        resources: [
          {
            title: "Neural Networks: Zero to Hero",
            provider: "Andrej Karpathy (ex-Tesla AI Director)",
            url: "https://karpathy.ai/zero-to-hero.html",
            type: "Video Series",
            estimatedHours: 25,
            cost: "100% Free",
            badge: "Top Pick",
          },
          {
            title: "Practical Deep Learning for Coders",
            provider: "Fast.ai",
            url: "https://course.fast.ai/",
            type: "Course",
            estimatedHours: 40,
            cost: "100% Free",
            badge: "Industry Gold Standard",
          },
        ],
        projectIdea: {
          title: "Custom Image Classifier & Web Predictor",
          description: "Train a custom ResNet/Vision model on satellite or biomedical images and deploy with FastAPI.",
          deliverables: ["Trained PyTorch model weights", "Inference endpoint", "Evaluation metrics confusion matrix"],
        },
      },
      {
        phaseNumber: 3,
        title: "Modern Generative AI, RAG & LLMs",
        description: "Embeddings, Vector Databases, Retrieval-Augmented Generation (RAG), and fine-tuning with Hugging Face.",
        skills: ["huggingface", "langchain", "vectordb", "nlp"],
        resources: [
          {
            title: "Hugging Face NLP Course",
            provider: "Hugging Face",
            url: "https://huggingface.co/learn/nlp-course",
            type: "Interactive",
            estimatedHours: 20,
            cost: "100% Free",
            badge: "Hands-on Labs",
          },
          {
            title: "Building Systems with ChatGPT API & Vector Search",
            provider: "DeepLearning.AI",
            url: "https://www.deeplearning.ai/short-courses/",
            type: "Course",
            estimatedHours: 8,
            cost: "100% Free",
            badge: "Quick Win",
          },
        ],
        projectIdea: {
          title: "Production RAG Document Assistant",
          description: "Build an AI agent that retrieves and answers questions against technical PDFs using embeddings and a free vector DB (e.g. Chroma/Qdrant).",
          deliverables: ["Chunking & embedding pipeline", "Hybrid keyword + semantic search", "Hallucination guardrails"],
        },
      },
    ],
    weeklySprints: [
      {
        weekNumber: 1,
        title: "Week 1: Math for AI & NumPy Vectorization",
        theme: "Tensors, Dot Products & Matrix Math",
        milestones: [
          { id: "ai-w1-1", task: "Derive and implement dot products, cosine similarity, and matrix multiplication from scratch in Python", deliverable: "math_foundations.py with unit tests", estimatedHours: 6, xpBonus: 30 },
          { id: "ai-w1-2", task: "Benchmark vectorized NumPy SIMD execution vs nested loops on 10,000x10,000 matrices", deliverable: "benchmark_scaling.ipynb with memory charts", estimatedHours: 5, xpBonus: 30 },
          { id: "ai-w1-3", task: "Compute multivariate gradient vectors and chain rule derivatives manually", deliverable: "manual_backprop_derivation.md", estimatedHours: 4, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 2,
        title: "Week 2: Micrograd & Autograd DAG Engine",
        theme: "Reverse-Mode Automatic Differentiation",
        milestones: [
          { id: "ai-w2-1", task: "Implement a scalar Value class supporting add, mul, relu, and tanh operations with computational DAG graph tracing", deliverable: "micrograd_engine.py", estimatedHours: 7, xpBonus: 30 },
          { id: "ai-w2-2", task: "Implement topological sort and backward() traversal to accumulate gradients through arbitrary expressions", deliverable: "dag_backward_tests.py", estimatedHours: 6, xpBonus: 30 },
          { id: "ai-w2-3", task: "Train a 2-layer Multi-Layer Perceptron (MLP) to solve the non-linear XOR classification boundary", deliverable: "mlp_xor_solver.py (>99% accuracy)", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 3,
        title: "Week 3: PyTorch Internals & CUDA Acceleration",
        theme: "Tensors, DataLoader, Loss & Optimizers",
        milestones: [
          { id: "ai-w3-1", task: "Build custom torch.utils.data.Dataset and DataLoader with multiprocessing worker threads and memory pinning", deliverable: "custom_dataset_pipeline.py", estimatedHours: 6, xpBonus: 30 },
          { id: "ai-w3-2", task: "Train a Convolutional Neural Network (CNN) with batch normalization, dropout, and AdamW optimizer", deliverable: "vision_classifier.pt with training curves", estimatedHours: 7, xpBonus: 30 },
          { id: "ai-w3-3", task: "Inspect GPU VRAM allocation, CUDA kernel execution, and mixed-precision (FP16/BF16) torch.amp.autocast()", deliverable: "vram_optimization_report.md", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 4,
        title: "Week 4: Transformers & Multi-Head Self-Attention",
        theme: "Attention Is All You Need Mechanics",
        milestones: [
          { id: "ai-w4-1", task: "Implement Scaled Dot-Product Attention from scratch: softmax((Q @ K.T) / sqrt(d_k)) @ V", deliverable: "attention_mechanics.py", estimatedHours: 7, xpBonus: 30 },
          { id: "ai-w4-2", task: "Implement Multi-Head Attention, causal autoregressive masking, and rotary positional embeddings (RoPE)", deliverable: "multihead_attention_block.py", estimatedHours: 8, xpBonus: 30 },
          { id: "ai-w4-3", task: "Assemble and train a GPT decoder-only language model on tiny Shakespeare corpus", deliverable: "train_minigpt.py with inference sample generation", estimatedHours: 8, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 5,
        title: "Week 5: Tokenization & Open Weights LLMs",
        theme: "Byte-Pair Encoding & Hugging Face Transformers",
        milestones: [
          { id: "ai-w5-1", task: "Train a Byte-Pair Encoding (BPE) tokenizer from raw text files without using third-party tokenizers", deliverable: "custom_bpe_tokenizer.py", estimatedHours: 6, xpBonus: 30 },
          { id: "ai-w5-2", task: "Load and prompt open-weight models (Llama 3, Mistral, Qwen) using Hugging Face pipelines with custom system prompts", deliverable: "llm_inference_harness.py", estimatedHours: 5, xpBonus: 30 },
          { id: "ai-w5-3", task: "Implement KV-Caching to accelerate autoregressive generation by 10x", deliverable: "kv_cache_benchmark.py", estimatedHours: 6, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 6,
        title: "Week 6: LoRA Fine-Tuning & Quantization",
        theme: "PEFT, QLoRA 4-bit & Instruction Tuning",
        milestones: [
          { id: "ai-w6-1", task: "Configure Low-Rank Adaptation (LoRA) decomposed adapter matrices (A and B) with PEFT", deliverable: "lora_adapter_config.py", estimatedHours: 7, xpBonus: 30 },
          { id: "ai-w6-2", task: "Fine-tune a 7B parameter LLM on custom domain instruction pairs using bitsandbytes 4-bit NF4 quantization", deliverable: "qlora_finetuned_model_weights.pt", estimatedHours: 8, xpBonus: 30 },
          { id: "ai-w6-3", task: "Evaluate perplexity and BLEU/ROUGE validation scores before and after adapter fine-tuning", deliverable: "evaluation_metrics_table.md", estimatedHours: 4, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 7,
        title: "Week 7: Advanced RAG & Vector Database Architecture",
        theme: "Hybrid Search, Re-Ranking & Hallucination Guardrails",
        milestones: [
          { id: "ai-w7-1", task: "Implement parent-document and semantic chunking with overlapping windows across enterprise PDFs", deliverable: "smart_chunking_indexer.py", estimatedHours: 6, xpBonus: 30 },
          { id: "ai-w7-2", task: "Build hybrid reciprocal rank fusion (RRF) combining BM25 keyword search with dense HNSW vector embeddings", deliverable: "hybrid_search_retriever.py", estimatedHours: 7, xpBonus: 30 },
          { id: "ai-w7-3", task: "Integrate Cohere/BGE cross-encoder re-ranking and Ragas automated hallucination evaluation", deliverable: "rag_faithfulness_suite.py", estimatedHours: 6, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 8,
        title: "Week 8: Multi-Agent Swarms & Production Serving",
        theme: "LangGraph, vLLM High-Throughput Serving & SLAs",
        milestones: [
          { id: "ai-w8-1", task: "Build a stateful multi-agent system with LangGraph where planner, coder, and critic agents collaborate with tool execution", deliverable: "multi_agent_system.py", estimatedHours: 8, xpBonus: 30 },
          { id: "ai-w8-2", task: "Deploy an OpenAI-compatible model endpoint using vLLM with PagedAttention and continuous dynamic batching", deliverable: "vllm_docker_deployment.yaml", estimatedHours: 7, xpBonus: 30 },
          { id: "ai-w8-3", task: "Enforce JSON Schema structured outputs, toxicity guardrails, and automated latency/cost logging with OpenTelemetry", deliverable: "production_ai_gateway.py", estimatedHours: 6, xpBonus: 30 },
        ],
      },
    ],
  },
  {
    slug: "fullstack-developer",
    title: "Full-Stack Web Developer",
    shortDescription:
      "Become job-ready in React, Next.js, Node.js, PostgreSQL, and scalable API architecture.",
    category: "Web Development",
    durationWeeks: "10–12 Weeks",
    level: "Beginner to Pro",
    keySkills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    phases: [
      {
        phaseNumber: 1,
        title: "Modern JavaScript & TypeScript Essentials",
        description: "DOM manipulation, asynchronous JavaScript (Promises, async/await), and type systems.",
        skills: ["javascript", "typescript"],
        resources: [
          {
            title: "JavaScript.info — The Modern JavaScript Tutorial",
            provider: "Ilya Kantor",
            url: "https://javascript.info/",
            type: "Interactive",
            estimatedHours: 35,
            cost: "100% Free",
            badge: "Complete Reference",
          },
          {
            title: "TypeScript Handbook & Executable Examples",
            provider: "Microsoft TypeScript Team",
            url: "https://www.typescriptlang.org/docs/handbook/intro.html",
            type: "Documentation",
            estimatedHours: 15,
            cost: "100% Free",
          },
        ],
        projectIdea: {
          title: "Type-Safe State-Driven Kanban Board",
          description: "A drag-and-drop task board with TypeScript, custom event handlers, and localStorage persistence.",
          deliverables: ["Zero TypeScript `any` errors", "Drag and drop reordering", "Clean mobile responsive CSS"],
        },
      },
      {
        phaseNumber: 2,
        title: "React & Next.js Ecosystem",
        description: "Hooks, Server Components, App Router, Tailwind CSS, and client-server boundaries.",
        skills: ["react", "nextjs", "tailwind"],
        resources: [
          {
            title: "Full Stack Open (React & Node.js)",
            provider: "University of Helsinki",
            url: "https://fullstackopen.com/en/",
            type: "Course",
            estimatedHours: 60,
            cost: "100% Free",
            badge: "Top Pick",
          },
          {
            title: "Official Next.js Learn App Router Tutorial",
            provider: "Next.js Team",
            url: "https://nextjs.org/learn",
            type: "Interactive",
            estimatedHours: 10,
            cost: "100% Free",
            badge: "Hands-on",
          },
        ],
        projectIdea: {
          title: "Multi-Tenant SaaS Landing & App Dashboard",
          description: "Full Next.js 15 app with server-side rendered data, optimistic UI mutations, and Tailwind styling.",
          deliverables: ["Sub-1 second page loads", "Clean component separation", "Dark/Light mode switch"],
        },
      },
      {
        phaseNumber: 3,
        title: "Backend, Databases & Authentication",
        description: "Relational database design in PostgreSQL, Drizzle/Prisma ORMs, Auth.js, and REST/Edge APIs.",
        skills: ["nodejs", "postgresql", "sql", "git"],
        resources: [
          {
            title: "The Odin Project (Full Stack Path)",
            provider: "The Odin Project Community",
            url: "https://www.theodinproject.com/",
            type: "Course",
            estimatedHours: 80,
            cost: "100% Free",
            badge: "Industry Favorite",
          },
          {
            title: "PostgreSQL Tutorial for Beginners to Pro",
            provider: "PostgresTutorial.com",
            url: "https://www.postgresqltutorial.com/",
            type: "Interactive",
            estimatedHours: 12,
            cost: "100% Free",
          },
        ],
        projectIdea: {
          title: "Full-Stack Collaborative Notes App",
          description: "End-to-end web app with user authentication, PostgreSQL relational database, and real-time edits.",
          deliverables: ["Normalized SQL schema", "Session/JWT authentication", "Live demo deployed on Cloudflare/Vercel"],
        },
      },
    ],
    weeklySprints: [
      {
        weekNumber: 1,
        title: "Week 1: Git Internals & Linux Basics",
        theme: "Version Control, Shell Scripting & Semantic Standards",
        milestones: [
          { id: "fs-w1-1", task: "Configure Git with GPG signing, interactive rebase, and squash commit workflow", deliverable: "Clean GitHub commit history proof", estimatedHours: 5, xpBonus: 30 },
          { id: "fs-w1-2", task: "Master Linux shell commands, file permissions, systemd service management, and cron jobs", deliverable: "deploy_monitor.sh automation script", estimatedHours: 5, xpBonus: 30 },
          { id: "fs-w1-3", task: "Build an accessible, mobile-first responsive landing page with semantic HTML5 and ARIA", deliverable: "Accessible HTML5 portfolio (100 Lighthouse score)", estimatedHours: 6, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 2,
        title: "Week 2: TypeScript & Async JavaScript Internals",
        theme: "Type Systems, Generics & Libuv Event Loop",
        milestones: [
          { id: "fs-w2-1", task: "Master TypeScript generics, utility types, and runtime data validation using Zod", deliverable: "type_safe_validator.ts", estimatedHours: 6, xpBonus: 30 },
          { id: "fs-w2-2", task: "Implement custom EventEmitter, Promise.allSettled concurrency pools, and error handling boundaries", deliverable: "async_pool_runner.ts", estimatedHours: 5, xpBonus: 30 },
          { id: "fs-w2-3", task: "Handle Node.js Streams backpressure for processing multi-gigabyte files with constant memory footprint", deliverable: "stream_processor.ts", estimatedHours: 6, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 3,
        title: "Week 3: React 19 & Next.js 15 Server Components",
        theme: "RSC, Suspense Streaming & Server Actions",
        milestones: [
          { id: "fs-w3-1", task: "Architect application boundary with React Server Components (RSC) and parallel Suspense streaming", deliverable: "Next.js dashboard with streaming UI", estimatedHours: 7, xpBonus: 30 },
          { id: "fs-w3-2", task: "Implement Next.js Server Actions with optimistic UI updates (useOptimistic) and form validation", deliverable: "Optimistic form submission workflow", estimatedHours: 6, xpBonus: 30 },
          { id: "fs-w3-3", task: "Configure fine-grained caching with revalidateTag and on-demand ISR (Incremental Static Regeneration)", deliverable: "caching_strategy_test.ts", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 4,
        title: "Week 4: Redis Caching & Database Indexing",
        theme: "PostgreSQL B-Tree, MVCC & In-Memory Cache-Aside",
        milestones: [
          { id: "fs-w4-1", task: "Analyze query execution plans with EXPLAIN (ANALYZE, BUFFERS) and optimize composite B-Tree indexes", deliverable: "db_query_optimization.sql", estimatedHours: 7, xpBonus: 30 },
          { id: "fs-w4-2", task: "Implement Redis Cache-Aside pattern with TTL expiration jitter to prevent cache stampedes", deliverable: "redis_cache_aside_service.ts", estimatedHours: 6, xpBonus: 30 },
          { id: "fs-w4-3", task: "Implement distributed locks and atomic rate limiters using Redis Lua scripts", deliverable: "sliding_window_limiter.lua", estimatedHours: 6, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 5,
        title: "Week 5: Docker Containerization & Multi-Stage Builds",
        theme: "OCI Images, Compose Orchestration & Security",
        milestones: [
          { id: "fs-w5-1", task: "Write Dockerfile multi-stage builds producing minimal non-root alpine images under 80MB", deliverable: "Dockerfile.production", estimatedHours: 6, xpBonus: 30 },
          { id: "fs-w5-2", task: "Orchestrate local development environment with Docker Compose (App, Postgres, Redis, Mailpit)", deliverable: "docker-compose.yml with health checks", estimatedHours: 5, xpBonus: 30 },
          { id: "fs-w5-3", task: "Perform container vulnerability scanning with Trivy and fix high/critical CVEs", deliverable: "container_audit_report.json", estimatedHours: 4, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 6,
        title: "Week 6: Auth, Session Management & OWASP Defenses",
        theme: "JWT vs Cookies, OAuth 2.0 PKCE & CSRF/XSS",
        milestones: [
          { id: "fs-w6-1", task: "Implement secure authentication with HttpOnly SameSite=Lax session cookies and token rotation", deliverable: "session_auth_handler.ts", estimatedHours: 7, xpBonus: 30 },
          { id: "fs-w6-2", task: "Implement OAuth 2.0 social login with PKCE (Proof Key for Code Exchange) and state verification", deliverable: "oauth_pkce_client.ts", estimatedHours: 6, xpBonus: 30 },
          { id: "fs-w6-3", task: "Implement Content Security Policy (CSP), CORS headers, and input sanitization against OWASP Top 10", deliverable: "security_middleware.ts", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 7,
        title: "Week 7: REST, GraphQL & Asynchronous Event Queues",
        theme: "API Contracts, Idempotency & Background Workers",
        milestones: [
          { id: "fs-w7-1", task: "Design OpenAPI 3.0 specification with strict schema validation and auto-generated TypeScript clients", deliverable: "openapi.yaml specification", estimatedHours: 6, xpBonus: 30 },
          { id: "fs-w7-2", task: "Implement idempotent payment webhook processing with transactional outbox pattern and deduplication", deliverable: "idempotent_webhook_handler.ts", estimatedHours: 7, xpBonus: 30 },
          { id: "fs-w7-3", task: "Set up asynchronous background job worker queue with exponential backoff retries and Dead Letter Queue", deliverable: "job_worker_queue.ts", estimatedHours: 6, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 8,
        title: "Week 8: Production CI/CD, Deployment & Observability",
        theme: "GitHub Actions, Prometheus/Grafana & Zero Downtime",
        milestones: [
          { id: "fs-w8-1", task: "Build GitHub Actions CI/CD workflow running linters, unit tests, and automated blue-green deployment", deliverable: ".github/workflows/deploy.yml", estimatedHours: 7, xpBonus: 30 },
          { id: "fs-w8-2", task: "Instrument application with OpenTelemetry tracing, structured JSON logs, and Prometheus metrics endpoint", deliverable: "telemetry_exporter.ts", estimatedHours: 6, xpBonus: 30 },
          { id: "fs-w8-3", task: "Execute k6 stress test simulating 5,000 concurrent users and verify sub-150ms p95 latency", deliverable: "k6_load_test_results.md", estimatedHours: 5, xpBonus: 30 },
        ],
      },
    ],
  },
  {
    slug: "data-analyst",
    title: "Data Analyst & Scientist",
    shortDescription:
      "Transform raw data into business intelligence using SQL, Python, Pandas, and exploratory data visualization.",
    category: "Data Science",
    durationWeeks: "8–10 Weeks",
    level: "Beginner to Pro",
    keySkills: ["SQL", "Python", "Pandas & NumPy", "Tableau", "Statistics"],
    phases: [
      {
        phaseNumber: 1,
        title: "SQL Mastery for Analytics",
        description: "Aggregations, Window functions, CTEs, Joins, and query optimization on millions of records.",
        skills: ["sql", "postgresql"],
        resources: [
          {
            title: "Mode Analytics SQL Tutorial for Data Analysis",
            provider: "Mode Analytics",
            url: "https://mode.com/sql-tutorial/",
            type: "Interactive",
            estimatedHours: 15,
            cost: "100% Free",
            badge: "Top Pick",
          },
          {
            title: "SQLZoo Interactive Exercises",
            provider: "SQLZoo",
            url: "https://sqlzoo.net/",
            type: "Interactive",
            estimatedHours: 10,
            cost: "100% Free",
          },
        ],
        projectIdea: {
          title: "E-Commerce Customer Cohort Retention Analysis",
          description: "Write complex SQL queries calculating monthly cohort retention, churn rate, and customer lifetime value (LTV).",
          deliverables: ["SQL scripts with CTEs & window functions", "Executive dashboard visualization", "Data story report"],
        },
      },
      {
        phaseNumber: 2,
        title: "Python Data Wrangling & EDA",
        description: "Pandas, NumPy, Seaborn, Matplotlib, and statistical hypotheses testing.",
        skills: ["python", "pandas-numpy"],
        resources: [
          {
            title: "Kaggle Learn: Python, Pandas & Data Visualization",
            provider: "Kaggle",
            url: "https://www.kaggle.com/learn",
            type: "Interactive",
            estimatedHours: 20,
            cost: "100% Free",
            badge: "Hands-on Certificates",
          },
        ],
        projectIdea: {
          title: "Real Estate Market Price Prediction & Insights",
          description: "Clean messy tabular data, perform exploratory data analysis, and uncover key pricing drivers.",
          deliverables: ["Jupyter notebook with visual charts", "Handling missing values and outliers", "Presentation slide deck"],
        },
      },
      {
        phaseNumber: 3,
        title: "Dimensional Data Modeling & Enterprise BI",
        description: "Star Schema, Kimball modeling, Slowly Changing Dimensions (SCD), Tableau/PowerBI visual storytelling.",
        skills: ["sql", "data-modeling", "tableau"],
        resources: [
          {
            title: "The Kimball Group Dimensional Modeling Techniques",
            provider: "Kimball Group",
            url: "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/",
            type: "Documentation",
            estimatedHours: 15,
            cost: "100% Free",
            badge: "Industry Gold Standard",
          },
          {
            title: "Tableau Free Data Visualization Training Videos",
            provider: "Tableau",
            url: "https://www.tableau.com/learn/training",
            type: "Video Series",
            estimatedHours: 18,
            cost: "100% Free",
            badge: "Hands-on Labs",
          },
        ],
        projectIdea: {
          title: "Executive Retail Performance & Sales Cockpit",
          description: "Model transactional sales into dimensional facts and dimensions, and build an executive KPI dashboard with interactive filters.",
          deliverables: ["Star Schema ERD Diagram", "Interactive Tableau/PowerBI Dashboard", "Executive presentation deck with data-driven recommendations"],
        },
      },
      {
        phaseNumber: 4,
        title: "Automated ELT with dbt & Predictive Analytics",
        description: "Modern data stack transformations with dbt, automated data quality assertions, and customer churn prediction.",
        skills: ["dbt", "python", "machine-learning"],
        resources: [
          {
            title: "dbt Fundamentals Free Course",
            provider: "dbt Labs",
            url: "https://courses.getdbt.com/courses/fundamentals",
            type: "Course",
            estimatedHours: 15,
            cost: "100% Free",
            badge: "Industry Favorite",
          },
          {
            title: "Machine Learning with Python & Scikit-Learn",
            provider: "freeCodeCamp",
            url: "https://www.freecodecamp.org/news/machine-learning-in-python-with-scikit-learn/",
            type: "Interactive",
            estimatedHours: 25,
            cost: "100% Free",
            badge: "Top Pick",
          },
        ],
        projectIdea: {
          title: "Production dbt Warehouse & Churn Propensity Model",
          description: "Build an automated ELT pipeline transforming raw data into analytics marts with dbt tests, plus a logistic regression churn model.",
          deliverables: ["dbt models repository with schema.yml tests", "Model evaluation ROC-AUC curve", "Automated GitHub Actions CI runner"],
        },
      },
    ],
    weeklySprints: [
      {
        weekNumber: 1,
        title: "Week 1: Advanced SQL & Analytical Queries",
        theme: "Window Functions, CTEs & Aggregations",
        milestones: [
          { id: "da-w1-1", task: "Master window functions (ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, NTILE) over partitioned data", deliverable: "window_functions_suite.sql", estimatedHours: 6, xpBonus: 30 },
          { id: "da-w1-2", task: "Write complex multi-level Common Table Expressions (CTEs) for hierarchical organizational data", deliverable: "recursive_cte_analysis.sql", estimatedHours: 5, xpBonus: 30 },
          { id: "da-w1-3", task: "Optimize SQL joins and aggregations on datasets with 10M+ rows using indexing and partitioning", deliverable: "query_optimization_log.sql", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 2,
        title: "Week 2: Relational Modeling & Star Schema Warehousing",
        theme: "Kimball Dimensional Modeling & Normalization",
        milestones: [
          { id: "da-w2-1", task: "Design 3NF normalized transactional database schema and denormalize into dimensional Star Schema", deliverable: "star_schema_erd.png", estimatedHours: 6, xpBonus: 30 },
          { id: "da-w2-2", task: "Model Slowly Changing Dimensions (SCD Type 1 vs Type 2) to maintain historical customer records", deliverable: "scd2_pipeline.sql", estimatedHours: 6, xpBonus: 30 },
          { id: "da-w2-3", task: "Define Fact and Dimension tables for an enterprise e-commerce platform with surrogate keys", deliverable: "warehouse_ddl.sql", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 3,
        title: "Week 3: Python Data Wrangling with Pandas & Polars",
        theme: "Data Cleaning, Transformation & Vectorization",
        milestones: [
          { id: "da-w3-1", task: "Clean messy real-world datasets: handle missing values, duplicate records, and invalid date formats", deliverable: "data_cleaning_pipeline.py", estimatedHours: 6, xpBonus: 30 },
          { id: "da-w3-2", task: "Benchmark multi-threaded Polars DataFrames vs Pandas on 20 million tabular rows", deliverable: "polars_performance_study.ipynb", estimatedHours: 6, xpBonus: 30 },
          { id: "da-w3-3", task: "Automate statistical summary profiling and outlier detection using IQR and Z-scores", deliverable: "eda_profiler.py", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 4,
        title: "Week 4: Statistical Testing & A/B Experimentation",
        theme: "Hypothesis Testing, P-Values & Confidence Intervals",
        milestones: [
          { id: "da-w4-1", task: "Calculate sample size requirements and statistical power for a landing page A/B test", deliverable: "sample_size_calculator.py", estimatedHours: 5, xpBonus: 30 },
          { id: "da-w4-2", task: "Conduct two-sample t-tests, Mann-Whitney U tests, and Chi-Square contingency tests", deliverable: "hypothesis_test_notebook.ipynb", estimatedHours: 6, xpBonus: 30 },
          { id: "da-w4-3", task: "Write executive summary explaining statistical significance, p-values, and confidence intervals to non-technical stakeholders", deliverable: "ab_test_executive_brief.md", estimatedHours: 4, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 5,
        title: "Week 5: Interactive Visualizations & Executive Dashboards",
        theme: "Tableau / PowerBI & Storytelling with Data",
        milestones: [
          { id: "da-w5-1", task: "Build interactive executive sales KPI dashboard with dynamic date sliders and drill-down filters", deliverable: "executive_dashboard.twbx / pbi", estimatedHours: 7, xpBonus: 30 },
          { id: "da-w5-2", task: "Implement Edward Tufte visual design principles: high data-to-ink ratio and zero chart junk", deliverable: "dashboard_design_system.md", estimatedHours: 5, xpBonus: 30 },
          { id: "da-w5-3", task: "Publish interactive web-based charts using Plotly and Streamlit", deliverable: "streamlit_bi_app.py", estimatedHours: 6, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 6,
        title: "Week 6: Automated ELT Pipelines with dbt",
        theme: "Data Transformation & Automated Testing",
        milestones: [
          { id: "da-w6-1", task: "Build dbt models transforming raw staging tables into cleaned dimensional business marts", deliverable: "dbt_models_repository", estimatedHours: 7, xpBonus: 30 },
          { id: "da-w6-2", task: "Configure automated dbt tests: unique, not_null, accepted_values, and relationships", deliverable: "schema.yml test suite", estimatedHours: 5, xpBonus: 30 },
          { id: "da-w6-3", task: "Generate and host dbt interactive data lineage documentation graph", deliverable: "lineage_dag_export.png", estimatedHours: 4, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 7,
        title: "Week 7: SaaS Unit Economics & Cohort Analysis",
        theme: "LTV, CAC, Retention Curves & Churn Prediction",
        milestones: [
          { id: "da-w7-1", task: "Build monthly cohort retention matrix and triangular retention curves in SQL and Python", deliverable: "cohort_retention_analysis.ipynb", estimatedHours: 7, xpBonus: 30 },
          { id: "da-w7-2", task: "Calculate Customer Lifetime Value (LTV), Customer Acquisition Cost (CAC), and LTV:CAC payback period", deliverable: "saas_unit_economics_model.xlsx", estimatedHours: 6, xpBonus: 30 },
          { id: "da-w7-3", task: "Train a logistic regression model identifying leading indicators of customer churn", deliverable: "churn_risk_classifier.py", estimatedHours: 6, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 8,
        title: "Week 8: Capstone Enterprise Business Intelligence Portfolio",
        theme: "End-to-End Decision Science Delivery",
        milestones: [
          { id: "da-w8-1", task: "Ingest and model 500,000 multi-market retail sales records from scratch", deliverable: "retail_analytics_warehouse.sql", estimatedHours: 8, xpBonus: 30 },
          { id: "da-w8-2", task: "Deliver an executive decision memo recommending product line expansions based on profit margin elasticity", deliverable: "executive_strategy_memo.pdf", estimatedHours: 6, xpBonus: 30 },
          { id: "da-w8-3", task: "Publish complete GitHub repository with reproducible Dockerized notebook and live dashboard link", deliverable: "GitHub portfolio repository README", estimatedHours: 6, xpBonus: 30 },
        ],
      },
    ],
  },
  {
    slug: "backend-systems",
    title: "Backend & Distributed Systems Architect",
    shortDescription:
      "Design high-throughput distributed microservices, caching topologies, message brokers, and transactional SQL engines with Go, Java, and Redis.",
    category: "Backend & Systems",
    durationWeeks: "10–12 Weeks",
    level: "Beginner to Pro",
    keySkills: ["Go / Java", "PostgreSQL", "Redis", "Kafka", "Docker", "System Design"],
    phases: [
      {
        phaseNumber: 1,
        title: "Systems Programming & Concurrent Runtimes",
        description: "Master goroutines, threads, thread pools, memory synchronization, and network socket programming.",
        skills: ["go", "java", "concurrency"],
        resources: [
          {
            title: "Go Class by Matt Holiday",
            provider: "YouTube (Matt Holiday)",
            url: "https://www.youtube.com/playlist?list=PLoILbXuU65KSPJkkyN_BkWGf_jE1jE2f1",
            type: "Video Series",
            estimatedHours: 24,
            cost: "100% Free",
            badge: "Deep Systems Focus",
          },
        ],
        projectIdea: {
          title: "Multi-Threaded TCP Proxy & Load Balancer",
          description: "Build an L4 reverse proxy with health checking and round-robin connection balancing from scratch.",
          deliverables: ["Raw socket programming", "Graceful shutdown handling", "Benchmarked against NGINX"],
        },
      },
      {
        phaseNumber: 2,
        title: "Relational Storage & Indexing Internals",
        description: "B-Trees, WAL logs, ACID isolation levels, connection pooling, and query optimization in PostgreSQL.",
        skills: ["postgresql", "sql-optimization"],
        resources: [
          {
            title: "Use The Index, Luke (SQL Indexing Guide)",
            provider: "Markus Winand",
            url: "https://use-the-index-luke.com/",
            type: "Documentation",
            estimatedHours: 12,
            cost: "100% Free",
            badge: "Industry Gold Standard",
          },
        ],
        projectIdea: {
          title: "ACID-Compliant Banking Transaction Ledger",
          description: "Design a high-concurrency ledger service with row-level locks, idempotency keys, and zero phantom reads.",
          deliverables: ["Pessimistic vs Optimistic locking tests", "Idempotency layer", "Stress tested with vegeta/k6"],
        },
      },
      {
        phaseNumber: 3,
        title: "Event-Driven Messaging & Distributed Caching",
        description: "Kafka partitions, consumer groups, exactly-once semantics, Redis cache-aside, and write-through patterns.",
        skills: ["kafka", "redis", "distributed-systems"],
        resources: [
          {
            title: "Designing Data-Intensive Applications Study Guide",
            provider: "Martin Kleppmann",
            url: "https://dataintensive.net/",
            type: "Course",
            estimatedHours: 35,
            cost: "100% Free",
            badge: "Top Pick",
          },
        ],
        projectIdea: {
          title: "Real-Time Flash Sale Order Processing Engine",
          description: "Build an event-driven inventory countdown system capable of handling 50,000 requests/sec with Redis Lua scripts and Kafka.",
          deliverables: ["Redis atomic decrement", "Kafka order dispatch", "Distributed tracing with OpenTelemetry"],
        },
      },
      {
        phaseNumber: 4,
        title: "High-Availability Microservices, Raft Consensus & Service Meshes",
        description: "gRPC streaming, Protocol Buffers, Raft distributed consensus, Envoy service mesh, and circuit breaker resilience.",
        skills: ["grpc", "distributed-systems", "docker"],
        resources: [
          {
            title: "Raft Consensus Algorithm Interactive Visualization & Paper",
            provider: "In Search of an Understandable Consensus Algorithm (Ongaro & Ousterhout)",
            url: "https://raft.github.io/",
            type: "Interactive",
            estimatedHours: 16,
            cost: "100% Free",
            badge: "Industry Gold Standard",
          },
          {
            title: "gRPC & Protocol Buffers Architecture Guide",
            provider: "Google Cloud / gRPC.io",
            url: "https://grpc.io/docs/what-is-grpc/introduction/",
            type: "Documentation",
            estimatedHours: 12,
            cost: "100% Free",
            badge: "Top Pick",
          },
        ],
        projectIdea: {
          title: "Distributed Fault-Tolerant Key-Value Store",
          description: "Implement a Raft-replicated cluster with leader election, log replication, snapshotting, and high-performance gRPC clients.",
          deliverables: ["Raft state machine in Go/Java", "gRPC bidirectional streaming API", "Jepsen-style network partition chaos test"],
        },
      },
    ],
    weeklySprints: [
      {
        weekNumber: 1,
        title: "Week 1: Systems Programming & Memory Model",
        theme: "Pointers, Memory Layout & TCP Socket Primitives",
        milestones: [
          { id: "bs-w1-1", task: "Implement a multi-threaded TCP echo server handling concurrent connections with non-blocking I/O", deliverable: "tcp_echo_server.go / java", estimatedHours: 6, xpBonus: 30 },
          { id: "bs-w1-2", task: "Profile memory allocations, escape analysis, and garbage collector latency under high load", deliverable: "gc_profile_report.pdf", estimatedHours: 5, xpBonus: 30 },
          { id: "bs-w1-3", task: "Implement custom binary protocol serializer and parser with endianness handling", deliverable: "binary_protocol_codec.go", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 2,
        title: "Week 2: Concurrency & Synchronization Primitives",
        theme: "Mutexes, Channels, Semaphores & Memory Barriers",
        milestones: [
          { id: "bs-w2-1", task: "Build a lock-free ring buffer and evaluate throughput vs mutex-guarded queues", deliverable: "lockfree_ringbuffer.go", estimatedHours: 7, xpBonus: 30 },
          { id: "bs-w2-2", task: "Implement worker pool with bounded job queues, dynamic worker scaling, and graceful shutdown", deliverable: "worker_pool_manager.go", estimatedHours: 6, xpBonus: 30 },
          { id: "bs-w2-3", task: "Verify thread safety and eliminate race conditions using Go race detector or ThreadSanitizer", deliverable: "race_audit_results.txt", estimatedHours: 4, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 3,
        title: "Week 3: Database Storage Engines & Index Tuning",
        theme: "B-Tree Internals, WAL Logs & Buffer Pool Management",
        milestones: [
          { id: "bs-w3-1", task: "Simulate an on-disk append-only log and SSTable storage engine with in-memory memtable", deliverable: "sstable_engine.go", estimatedHours: 7, xpBonus: 30 },
          { id: "bs-w3-2", task: "Analyze query execution plans with EXPLAIN ANALYZE on PostgreSQL and tune partial composite indexes", deliverable: "index_optimization_audit.sql", estimatedHours: 6, xpBonus: 30 },
          { id: "bs-w3-3", task: "Configure connection pooling (PgBouncer) and benchmark throughput at 2,000 active client connections", deliverable: "pgbouncer_benchmark_report.md", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 4,
        title: "Week 4: Transaction Isolation & ACID Locks",
        theme: "MVCC, Row-Level Locks & Idempotent Transactions",
        milestones: [
          { id: "bs-w4-1", task: "Demonstrate dirty reads, non-repeatable reads, and phantom reads across ANSI SQL isolation levels", deliverable: "isolation_anomalies_demo.sql", estimatedHours: 6, xpBonus: 30 },
          { id: "bs-w4-2", task: "Implement transactional outbox pattern with Debezium CDC (Change Data Capture) event publishing", deliverable: "transactional_outbox_service.go", estimatedHours: 7, xpBonus: 30 },
          { id: "bs-w4-3", task: "Implement banking transfer with row-level locks (SELECT FOR UPDATE) and distributed idempotency keys", deliverable: "idempotent_transfer_api.go", estimatedHours: 6, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 5,
        title: "Week 5: Distributed Caching & Cache Invalidation",
        theme: "Cache-Aside, Write-Through & Cache Stampede Defense",
        milestones: [
          { id: "bs-w5-1", task: "Implement multi-tier L1 (in-memory) and L2 (Redis cluster) caching with consistent hashing", deliverable: "two_tier_cache.go", estimatedHours: 7, xpBonus: 30 },
          { id: "bs-w5-2", task: "Mitigate cache stampedes using singleflight request coalescing and probabilistic early expiration (XFetch)", deliverable: "stampede_mitigator.go", estimatedHours: 6, xpBonus: 30 },
          { id: "bs-w5-3", task: "Implement atomic sliding window rate limiter using Redis Lua script", deliverable: "rate_limiter.lua", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 6,
        title: "Week 6: Event-Driven Kafka Architecture",
        theme: "Partitioning, Consumer Rebalance & Exactly-Once Semantics",
        milestones: [
          { id: "bs-w6-1", task: "Configure high-throughput Kafka producer with batching, snappy compression, and acks=all", deliverable: "kafka_producer_tuning.go", estimatedHours: 6, xpBonus: 30 },
          { id: "bs-w6-2", task: "Implement resilient consumer group with manual commit, dead letter queue (DLQ), and exponential retries", deliverable: "resilient_kafka_consumer.go", estimatedHours: 7, xpBonus: 30 },
          { id: "bs-w6-3", task: "Enforce Avro / Protobuf schema evolution using Confluent Schema Registry", deliverable: "schema_evolution_suite.avsc", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 7,
        title: "Week 7: High-Throughput RPCs & gRPC Protocols",
        theme: "Protocol Buffers, HTTP/2 Streaming & Interceptors",
        milestones: [
          { id: "bs-w7-1", task: "Design Protobuf contracts with server-streaming and bidirectional streaming RPC methods", deliverable: "telemetry_service.proto", estimatedHours: 6, xpBonus: 30 },
          { id: "bs-w7-2", task: "Implement gRPC middleware interceptors for distributed tracing context propagation and auth tokens", deliverable: "grpc_interceptors.go", estimatedHours: 6, xpBonus: 30 },
          { id: "bs-w7-3", task: "Benchmark gRPC unary & streaming throughput against REST JSON APIs under 10,000 req/sec", deliverable: "grpc_vs_rest_benchmark.md", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 8,
        title: "Week 8: Distributed Consensus & SRE Resilience",
        theme: "Raft Leader Election, Circuit Breakers & Chaos Testing",
        milestones: [
          { id: "bs-w8-1", task: "Implement Raft election timer, heartbeat broadcasts, and vote request handling", deliverable: "raft_election_engine.go", estimatedHours: 8, xpBonus: 30 },
          { id: "bs-w8-2", task: "Integrate Sony/gobreaker circuit breaker and token bucket rate limiters to protect upstream dependencies", deliverable: "circuit_breaker_wrapper.go", estimatedHours: 6, xpBonus: 30 },
          { id: "bs-w8-3", task: "Conduct network latency and packet loss chaos tests with Toxiproxy and verify system auto-healing", deliverable: "toxiproxy_chaos_report.md", estimatedHours: 6, xpBonus: 30 },
        ],
      },
    ],
  },
  {
    slug: "devops-cloud",
    title: "DevOps & Cloud Platform Engineer",
    shortDescription:
      "Automate multi-cloud infrastructure as code, container orchestration with Kubernetes, CI/CD pipelines, and observability stacks.",
    category: "DevOps & Cloud",
    durationWeeks: "8–10 Weeks",
    level: "Beginner to Pro",
    keySkills: ["Docker", "Kubernetes", "Terraform", "GitHub Actions", "Prometheus", "AWS / Linux"],
    phases: [
      {
        phaseNumber: 1,
        title: "Linux Kernel Fundamentals & Containers",
        description: "Linux namespaces, cgroups, multi-stage Docker builds, and non-root security contexts.",
        skills: ["linux", "docker"],
        resources: [
          {
            title: "Docker and Kubernetes: Full Course by TechWorld with Nana",
            provider: "YouTube (TechWorld with Nana)",
            url: "https://www.youtube.com/watch?v=X48VuDVv0do",
            type: "Video Series",
            estimatedHours: 18,
            cost: "100% Free",
            badge: "Beginner Friendly",
          },
        ],
        projectIdea: {
          title: "Hardened Production Container Base Images",
          description: "Package a polyglot microservice with distroless images, minimal attack surfaces, and automated Trivy vulnerability scanning.",
          deliverables: ["Distroless Dockerfile", "Zero CVE scan report", "Sub-50MB image size"],
        },
      },
      {
        phaseNumber: 2,
        title: "Kubernetes Cluster Architecture & GitOps",
        description: "Deployments, Services, Ingress controllers, Helm charts, and GitOps deployments with ArgoCD.",
        skills: ["kubernetes", "helm", "argocd"],
        resources: [
          {
            title: "Kubernetes the Hard Way",
            provider: "Kelsey Hightower (GitHub)",
            url: "https://github.com/kelseyhightower/kubernetes-the-hard-way",
            type: "Interactive",
            estimatedHours: 20,
            cost: "100% Free",
            badge: "Industry Gold Standard",
          },
        ],
        projectIdea: {
          title: "Zero-Downtime Blue/Green GitOps Pipeline",
          description: "Configure automated deployments with ArgoCD, rollback triggers, and Prometheus-based canary analysis.",
          deliverables: ["Helm chart repository", "ArgoCD Application CRD", "Canary metric gates"],
        },
      },
      {
        phaseNumber: 3,
        title: "Infrastructure as Code (IaC) & Cloud Architecture",
        description: "HashiCorp Terraform, AWS multi-tier VPC topology, IAM least-privilege, and state backend locking with S3/DynamoDB.",
        skills: ["terraform", "aws", "cloud-security"],
        resources: [
          {
            title: "HashiCorp Terraform Associate Certification Course",
            provider: "freeCodeCamp",
            url: "https://www.freecodecamp.org/news/terraform-course-hashicorp-certified-associate/",
            type: "Video Series",
            estimatedHours: 14,
            cost: "100% Free",
            badge: "Industry Standard",
          },
          {
            title: "AWS Well-Architected Framework Whitepapers",
            provider: "Amazon Web Services",
            url: "https://aws.amazon.com/architecture/well-architected/",
            type: "Documentation",
            estimatedHours: 15,
            cost: "100% Free",
            badge: "Must Read",
          },
        ],
        projectIdea: {
          title: "Multi-Tier High-Availability AWS Cloud Infrastructure via Terraform",
          description: "Provision modular VPC, private subnets, NAT gateways, ALB, auto-scaling ECS/EKS clusters with zero manual clicks.",
          deliverables: ["Reusable Terraform modules", "Remote S3 backend with DynamoDB locking", "Infracost automated cost estimation pull request comment"],
        },
      },
      {
        phaseNumber: 4,
        title: "Production SRE, Observability & Chaos Engineering",
        description: "Prometheus metrics collection, Grafana dashboards, OpenTelemetry distributed tracing, Alertmanager, and Chaos Mesh experiments.",
        skills: ["prometheus", "grafana", "sre", "opentelemetry"],
        resources: [
          {
            title: "Google Site Reliability Engineering (SRE) Books",
            provider: "Google SRE Team",
            url: "https://sre.google/sre-book/table-of-contents/",
            type: "Documentation",
            estimatedHours: 30,
            cost: "100% Free",
            badge: "Industry Gold Standard",
          },
          {
            title: "Prometheus Monitoring & Alerting Masterclass",
            provider: "Robust Perception / Prometheus.io",
            url: "https://prometheus.io/docs/introduction/overview/",
            type: "Documentation",
            estimatedHours: 12,
            cost: "100% Free",
          },
        ],
        projectIdea: {
          title: "Enterprise Observability & Automated Chaos Resilience Suite",
          description: "Instrument microservices with RED/USE metrics, build SLO/SLA dashboards in Grafana, and test resilience under simulated pod kills.",
          deliverables: ["Prometheus Alertmanager rules configuration", "Custom Grafana RED dashboard", "Chaos experiment report proving 99.95% uptime"],
        },
      },
    ],
    weeklySprints: [
      {
        weekNumber: 1,
        title: "Week 1: Linux Kernel Mechanics & Shell Automation",
        theme: "Namespaces, cgroups, Systemd & Bash Standard Library",
        milestones: [
          { id: "dc-w1-1", task: "Build a mini container runtime in Bash using unshare, chroot, and cgroup v2 resource limits", deliverable: "mini_container_runtime.sh", estimatedHours: 6, xpBonus: 30 },
          { id: "dc-w1-2", task: "Write robust Bash automation scripts with set -euo pipefail, trap handlers, and logging", deliverable: "server_bootstrap.sh", estimatedHours: 5, xpBonus: 30 },
          { id: "dc-w1-3", task: "Configure systemd daemon with automated restart policies, journald logging, and socket activation", deliverable: "custom_app.service config", estimatedHours: 4, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 2,
        title: "Week 2: Production Containerization with Docker",
        theme: "Multi-Stage Builds, Distroless & Security Hardening",
        milestones: [
          { id: "dc-w2-1", task: "Construct multi-stage Dockerfile producing hardened distroless image under 50MB with non-root USER", deliverable: "Dockerfile.distroless", estimatedHours: 6, xpBonus: 30 },
          { id: "dc-w2-2", task: "Audit images using Trivy and Grype to eliminate all CRITICAL and HIGH severity vulnerabilities", deliverable: "vulnerability_audit_report.json", estimatedHours: 5, xpBonus: 30 },
          { id: "dc-w2-3", task: "Configure Docker Buildx with multi-platform AMD64/ARM64 build caching and remote registry push", deliverable: "buildx_workflow.yml", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 3,
        title: "Week 3: Kubernetes Workloads & Networking",
        theme: "Pods, Deployments, Services & CoreDNS Mechanics",
        milestones: [
          { id: "dc-w3-1", task: "Deploy high-availability application with RollingUpdate strategy, readiness/liveness probes, and PodDisruptionBudget", deliverable: "k8s_deployment_suite.yaml", estimatedHours: 6, xpBonus: 30 },
          { id: "dc-w3-2", task: "Configure ClusterIP, NodePort, and LoadBalancer services and inspect iptables / IPVS routing rules", deliverable: "k8s_networking_diagram.md", estimatedHours: 6, xpBonus: 30 },
          { id: "dc-w3-3", task: "Mount ConfigMaps and encrypted Kubernetes Secrets with automated checksum reloads", deliverable: "secret_rotation_demo.yaml", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 4,
        title: "Week 4: Ingress Controllers, SSL & Helm Packaging",
        theme: "NGINX Ingress, cert-manager Let's Encrypt & Helm Charts",
        milestones: [
          { id: "dc-w4-1", task: "Deploy NGINX Ingress Controller with SSL termination, TLS cert-manager, and rate limiting annotations", deliverable: "ingress_controller_config.yaml", estimatedHours: 7, xpBonus: 30 },
          { id: "dc-w4-2", task: "Package complete microservices stack into reusable production Helm 3 chart with values.schema.json", deliverable: "helm_microservice_chart/", estimatedHours: 7, xpBonus: 30 },
          { id: "dc-w4-3", task: "Publish packaged Helm chart to GitHub Container Registry (GHCR) as an OCI artifact", deliverable: "helm_oci_publish_log.txt", estimatedHours: 4, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 5,
        title: "Week 5: Infrastructure as Code with Terraform",
        theme: "State Locking, Modular Architecture & Drift Detection",
        milestones: [
          { id: "dc-w5-1", task: "Provision production multi-AZ AWS VPC with public/private subnets, Internet Gateway, and NAT Gateways", deliverable: "terraform_vpc_module/", estimatedHours: 7, xpBonus: 30 },
          { id: "dc-w5-2", task: "Configure remote Terraform state backend with S3 bucket encryption and DynamoDB distributed state locking", deliverable: "backend_config.tf", estimatedHours: 5, xpBonus: 30 },
          { id: "dc-w5-3", task: "Automate Terraform plan and drift detection in CI using Atlantis or GitHub Actions", deliverable: "terraform_ci_pipeline.yml", estimatedHours: 6, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 6,
        title: "Week 6: Automated CI/CD with GitHub Actions",
        theme: "Workflows, OIDC Cloud Auth & Automated SemVer",
        milestones: [
          { id: "dc-w6-1", task: "Build GitHub Actions CI workflow using AWS OIDC role assumption without static long-lived credentials", deliverable: ".github/workflows/ci_oidc.yml", estimatedHours: 6, xpBonus: 30 },
          { id: "dc-w6-2", task: "Implement automated Semantic Versioning and conventional changelog generation on merge to main", deliverable: "release_automation.yml", estimatedHours: 5, xpBonus: 30 },
          { id: "dc-w6-3", task: "Enforce branch protection rules with mandatory passing status checks and signed commit requirements", deliverable: "branch_policy_audit.md", estimatedHours: 4, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 7,
        title: "Week 7: GitOps Continuous Delivery with ArgoCD",
        theme: "Declarative Sync, Automated Self-Healing & Canary Rollouts",
        milestones: [
          { id: "dc-w7-1", task: "Deploy ArgoCD in Kubernetes cluster and manage multiple microservices with ApplicationSet CRD", deliverable: "argocd_applicationset.yaml", estimatedHours: 7, xpBonus: 30 },
          { id: "dc-w7-2", task: "Implement progressive delivery with Argo Rollouts and canary traffic splitting (10% -> 50% -> 100%)", deliverable: "canary_rollout.yaml", estimatedHours: 7, xpBonus: 30 },
          { id: "dc-w7-3", task: "Configure automated rollback triggered by HTTP 5xx error spikes during canary window", deliverable: "analysis_template.yaml", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 8,
        title: "Week 8: Full-Stack Observability & Incident SRE",
        theme: "Prometheus, Grafana, OpenTelemetry & Chaos Engineering",
        milestones: [
          { id: "dc-w8-1", task: "Deploy Prometheus Operator and configure ServiceMonitors for scraping custom application metrics", deliverable: "prometheus_operator_crds.yaml", estimatedHours: 7, xpBonus: 30 },
          { id: "dc-w8-2", task: "Design Grafana production dashboard monitoring Four Golden Signals (Latency, Traffic, Errors, Saturation)", deliverable: "grafana_golden_signals.json", estimatedHours: 6, xpBonus: 30 },
          { id: "dc-w8-3", task: "Run Chaos Mesh experiments simulating network delay and node eviction, validating 99.99% availability SLO", deliverable: "chaos_mesh_audit_report.md", estimatedHours: 6, xpBonus: 30 },
        ],
      },
    ],
  },
  {
    slug: "data-engineer",
    title: "Data Engineering & Real-Time Lakehouse Architect",
    shortDescription:
      "Design petabyte-scale batch & streaming data pipelines, medallion lakehouse architecture, and real-time Kafka transformations with Apache Spark and dbt.",
    category: "Data Science",
    durationWeeks: "10–12 Weeks",
    level: "Beginner to Pro",
    keySkills: ["Apache Spark", "Kafka", "dbt", "Airflow", "Snowflake / BigQuery", "Delta Lake"],
    phases: [
      {
        phaseNumber: 1,
        title: "Data Warehousing & SQL Query Optimization",
        description: "Columnar storage formats (Parquet, ORC), query clustering, partitioning, and complex analytical SQL.",
        skills: ["sql", "data-modeling", "postgresql"],
        resources: [
          {
            title: "Data Engineering Zoomcamp (Free by DataTalksClub)",
            provider: "DataTalksClub",
            url: "https://github.com/DataTalksClub/data-engineering-zoomcamp",
            type: "Course",
            estimatedHours: 40,
            cost: "100% Free",
            badge: "Industry Favorite",
          },
        ],
        projectIdea: {
          title: "Million-Record Taxi Trip Warehouse",
          description: "Ingest and model raw ride data in BigQuery/PostgreSQL with partitioned tables and optimized indexing.",
          deliverables: ["Partitioned DDL schema", "Analytical queries", "Query cost comparison report"],
        },
      },
      {
        phaseNumber: 2,
        title: "Distributed Batch Processing with Apache Spark",
        description: "PySpark DataFrames, Spark SQL, Catalyst Optimizer, DAG physical plans, and memory shuffles.",
        skills: ["spark", "python"],
        resources: [
          {
            title: "Apache Spark Programming with Databricks",
            provider: "Databricks Academy / edX",
            url: "https://www.edx.org/",
            type: "Course",
            estimatedHours: 25,
            cost: "100% Free",
            badge: "Top Pick",
          },
        ],
        projectIdea: {
          title: "Multi-Terabyte Log Aggregation Pipeline",
          description: "Process raw web server access logs with PySpark, partition by date and status, and output compressed Parquet.",
          deliverables: ["PySpark transformation script", "Execution plan analysis", "Cluster sizing calculation"],
        },
      },
      {
        phaseNumber: 3,
        title: "Real-Time Streaming with Kafka & Spark Streaming",
        description: "Event stream ingestion, windowed aggregations, watermarking, and exactly-once processing semantics.",
        skills: ["kafka", "spark-streaming"],
        resources: [
          {
            title: "Confluent Kafka Developer Learning Path",
            provider: "Confluent Developer",
            url: "https://developer.confluent.io/learn-kafka/",
            type: "Interactive",
            estimatedHours: 20,
            cost: "100% Free",
            badge: "Industry Standard",
          },
        ],
        projectIdea: {
          title: "Live Fraud Detection Financial Stream",
          description: "Detect anomalous credit card transactions in sub-second windows using Kafka topics and Spark Structured Streaming.",
          deliverables: ["Kafka producer & consumer topologies", "Sliding window aggregation code", "Real-time alert sink"],
        },
      },
      {
        phaseNumber: 4,
        title: "Modern Medallion Lakehouse & Airflow Orchestration",
        description: "Bronze/Silver/Gold Lakehouse architecture with Delta Lake/Iceberg, automated dbt ELT, and Airflow DAGs.",
        skills: ["airflow", "dbt", "lakehouse"],
        resources: [
          {
            title: "Astronomer Apache Airflow Fundamentals",
            provider: "Astronomer Academy",
            url: "https://academy.astronomer.io/",
            type: "Interactive",
            estimatedHours: 15,
            cost: "100% Free",
            badge: "Cert Prep",
          },
        ],
        projectIdea: {
          title: "Production Medallion Data Lakehouse",
          description: "Build an end-to-end automated pipeline orchestrated with Airflow, transforming raw data into business-ready Gold marts using dbt and Delta Lake.",
          deliverables: ["Airflow DAG with sensor dependencies", "dbt data testing models", "Data lineage diagram"],
        },
      },
    ],
    weeklySprints: [
      {
        weekNumber: 1,
        title: "Week 1: SQL Internals & Data Modeling",
        theme: "Columnar Storage, Partitioning & Star Schema",
        milestones: [
          { id: "de-w1-1", task: "Design Star Schema for enterprise logistics platform with surrogate keys and date dimensions", deliverable: "logistics_star_schema.sql", estimatedHours: 6, xpBonus: 30 },
          { id: "de-w1-2", task: "Benchmark query performance across row-oriented CSV vs Parquet snappy compression on 10M rows", deliverable: "storage_benchmark_report.md", estimatedHours: 5, xpBonus: 30 },
          { id: "de-w1-3", task: "Implement Slowly Changing Dimensions (SCD Type 2) using MERGE INTO statements", deliverable: "scd2_merge_pipeline.sql", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 2,
        title: "Week 2: Dockerized Data Infrastructure",
        theme: "PostgreSQL, Airflow, Kafka & MinIO S3",
        milestones: [
          { id: "de-w2-1", task: "Spin up complete local data stack using Docker Compose (Postgres, MinIO S3, Airflow, Redpanda)", deliverable: "docker-compose-data-stack.yml", estimatedHours: 6, xpBonus: 30 },
          { id: "de-w2-2", task: "Configure MinIO S3 bucket policies and test boto3 programmatic batch uploads", deliverable: "s3_ingestion_script.py", estimatedHours: 5, xpBonus: 30 },
          { id: "de-w2-3", task: "Set up automated Postgres database backup and WAL archiving scripts", deliverable: "backup_postgres.sh", estimatedHours: 4, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 3,
        title: "Week 3: PySpark DataFrames & Transformations",
        theme: "Spark Execution Plans, Catalyst Optimizer & Shuffling",
        milestones: [
          { id: "de-w3-1", task: "Clean and transform messy JSON clickstream data into partitioned Parquet files using PySpark", deliverable: "clickstream_etl.py", estimatedHours: 7, xpBonus: 30 },
          { id: "de-w3-2", task: "Inspect Spark DAG physical plan with explain(mode='formatted') and resolve data skew with salting", deliverable: "spark_optimization_notes.md", estimatedHours: 6, xpBonus: 30 },
          { id: "de-w3-3", task: "Implement broadcast joins to optimize large-table small-table lookups and avoid shuffle stages", deliverable: "broadcast_join_bench.py", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 4,
        title: "Week 4: Apache Airflow DAG Orchestration",
        theme: "Sensors, TaskFlow API & Dynamic DAG Generation",
        milestones: [
          { id: "de-w4-1", task: "Write resilient Airflow DAG using TaskFlow API with retries, SLA callbacks, and XCom parameter passing", deliverable: "airflow_pipeline_dag.py", estimatedHours: 7, xpBonus: 30 },
          { id: "de-w4-2", task: "Implement custom S3KeySensor and Slack failure notification alerting webhook", deliverable: "airflow_custom_alerts.py", estimatedHours: 6, xpBonus: 30 },
          { id: "de-w4-3", task: "Dynamically generate multiple table ingestion DAGs from YAML configuration files", deliverable: "dynamic_dag_generator.py", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 5,
        title: "Week 5: Modern ELT Transformations with dbt",
        theme: "Staging, Marts, Snapshots & Data Lineage",
        milestones: [
          { id: "de-w5-1", task: "Architect multi-layer dbt project: staging (stg_), intermediate (int_), and dimensional marts (fct_, dim_)", deliverable: "dbt_project_structure/", estimatedHours: 7, xpBonus: 30 },
          { id: "de-w5-2", task: "Configure dbt test suites with dbt-expectations package validating row counts and schema integrity", deliverable: "schema_tests.yml", estimatedHours: 6, xpBonus: 30 },
          { id: "de-w5-3", task: "Build dbt snapshot models tracking customer subscription tier changes over time", deliverable: "snapshots/subscription_history.sql", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 6,
        title: "Week 6: Event Streaming with Apache Kafka",
        theme: "Producers, Consumer Groups & Schema Registry",
        milestones: [
          { id: "de-w6-1", task: "Implement Python Kafka producer streaming IoT sensor telemetry with Confluent Avro serialization", deliverable: "iot_telemetry_producer.py", estimatedHours: 7, xpBonus: 30 },
          { id: "de-w6-2", task: "Build resilient Kafka consumer group with manual commit offset and dead-letter queue", deliverable: "telemetry_consumer_group.py", estimatedHours: 6, xpBonus: 30 },
          { id: "de-w6-3", task: "Tune Kafka topic partitions and replication factor for zero data loss (min.insync.replicas=2)", deliverable: "kafka_topic_config.sh", estimatedHours: 4, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 7,
        title: "Week 7: Real-Time Spark Structured Streaming",
        theme: "Watermarking, Tumbling Windows & Sink Checkpointing",
        milestones: [
          { id: "de-w7-1", task: "Build Spark Structured Streaming job consuming Kafka events with 10-minute tumbling window aggregations", deliverable: "spark_streaming_metrics.py", estimatedHours: 8, xpBonus: 30 },
          { id: "de-w7-2", task: "Configure watermarking to handle late-arriving out-of-order data and prevent unbounded state growth", deliverable: "watermark_sliding_window.py", estimatedHours: 6, xpBonus: 30 },
          { id: "de-w7-3", task: "Sink aggregated stream into PostgreSQL with WAL checkpointing for end-to-end exactly-once semantics", deliverable: "checkpoint_recovery_test.py", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 8,
        title: "Week 8: Capstone Medallion Data Lakehouse",
        theme: "Delta Lake ACID, Time Travel & Automated Reporting",
        milestones: [
          { id: "de-w8-1", task: "Implement Medallion Architecture: Bronze (raw JSON) -> Silver (cleaned Delta) -> Gold (business aggregations)", deliverable: "medallion_pipeline.py", estimatedHours: 8, xpBonus: 30 },
          { id: "de-w8-2", task: "Execute Delta Lake ACID time travel queries and OPTIMIZE Z-ORDER BY indexing on high-cardinality keys", deliverable: "delta_time_travel_demo.py", estimatedHours: 6, xpBonus: 30 },
          { id: "de-w8-3", task: "Publish complete end-to-end repository with automated CI data test checks and architectural documentation", deliverable: "GitHub repository README with architecture diagram", estimatedHours: 6, xpBonus: 30 },
        ],
      },
    ],
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity & Cloud Security Engineer",
    shortDescription:
      "Master offensive security, defensive SOC operations, Zero Trust architecture, AWS IAM hardening, and OWASP Top 10 web application defenses.",
    category: "Cybersecurity",
    durationWeeks: "10–12 Weeks",
    level: "Beginner to Pro",
    keySkills: ["Network Security", "Linux Hardening", "OWASP Top 10", "AWS IAM", "Wireshark", "SIEM"],
    phases: [
      {
        phaseNumber: 1,
        title: "Networking Protocols & Traffic Analysis",
        description: "TCP/IP handshakes, DNS resolution, TLS 1.3 cryptography, Wireshark packet capture, and Nmap network scanning.",
        skills: ["network-security", "linux"],
        resources: [
          {
            title: "Network Security & Wireshark Fundamentals",
            provider: "Professor Messer / Cybrary",
            url: "https://www.professormesser.com/",
            type: "Video Series",
            estimatedHours: 25,
            cost: "100% Free",
            badge: "Beginner Friendly",
          },
        ],
        projectIdea: {
          title: "Network Packet Capture & Anomaly Scanner",
          description: "Capture network packets with Wireshark/tshark, write Python scripts to inspect TCP flags, and detect port scanning attempts.",
          deliverables: ["PCAP packet analysis report", "Python SYN-flood detector script", "Nmap network topology map"],
        },
      },
      {
        phaseNumber: 2,
        title: "Web Application Security & OWASP Top 10",
        description: "SQL Injection, Cross-Site Scripting (XSS), CSRF, Server-Side Request Forgery (SSRF), and broken access control.",
        skills: ["owasp", "web-security"],
        resources: [
          {
            title: "PortSwigger Web Security Academy",
            provider: "PortSwigger (Creators of Burp Suite)",
            url: "https://portswigger.net/web-security",
            type: "Interactive",
            estimatedHours: 40,
            cost: "100% Free",
            badge: "Industry Gold Standard",
          },
        ],
        projectIdea: {
          title: "Web Application Penetration Test Audit Report",
          description: "Perform authorized security assessment against vulnerable lab applications (DVWA/Juice Shop) and document remediations.",
          deliverables: ["Executive vulnerability assessment report", "Proof of Concept exploit scripts", "Remediated code diffs"],
        },
      },
      {
        phaseNumber: 3,
        title: "Cloud Infrastructure Security & AWS IAM Hardening",
        description: "Least-privilege IAM policies, AWS KMS encryption, VPC security groups, CloudTrail audit logging, and GuardDuty.",
        skills: ["aws", "cloud-security", "terraform"],
        resources: [
          {
            title: "AWS Security Fundamentals",
            provider: "AWS Skill Builder",
            url: "https://explore.skillbuilder.aws/",
            type: "Course",
            estimatedHours: 15,
            cost: "100% Free",
            badge: "Official AWS",
          },
        ],
        projectIdea: {
          title: "Automated AWS Security Compliance Scanner",
          description: "Write Python Boto3 scripts to audit AWS account configurations against CIS AWS Foundations Benchmark standards.",
          deliverables: ["CIS benchmark audit script", "Automated remediation Lambda function", "Compliance score report"],
        },
      },
      {
        phaseNumber: 4,
        title: "Security Operations (SOC), SIEM & Incident Response",
        description: "Log aggregation with Elastic/Wazuh, writing Sigma detection rules, memory forensics with Volatility, and threat hunting.",
        skills: ["siem", "incident-response", "linux"],
        resources: [
          {
            title: "Splunk Free Security Training & Wazuh SIEM Labs",
            provider: "Wazuh Documentation & Labs",
            url: "https://documentation.wazuh.com/",
            type: "Interactive",
            estimatedHours: 20,
            cost: "100% Free",
            badge: "Hands-on SOC",
          },
        ],
        projectIdea: {
          title: "End-to-End SIEM Detection & Incident Response Pipeline",
          description: "Deploy Wazuh SIEM, simulate brute-force and privilege escalation attacks, and write automated incident response containment rules.",
          deliverables: ["Wazuh SIEM deployment", "Custom Sigma threat detection rules", "Incident response post-mortem report"],
        },
      },
    ],
    weeklySprints: [
      {
        weekNumber: 1,
        title: "Week 1: Network Protocols & Packet Analysis",
        theme: "TCP/IP, Wireshark, DNS & Port Scanning",
        milestones: [
          { id: "sec-w1-1", task: "Capture and analyze 3-way TCP handshakes, TLS 1.3 handshakes, and DNS requests using Wireshark", deliverable: "wireshark_analysis_report.pdf", estimatedHours: 6, xpBonus: 30 },
          { id: "sec-w1-2", task: "Conduct authorized vulnerability port scans using Nmap with SYN, UDP, and service version probes", deliverable: "nmap_audit_results.txt", estimatedHours: 5, xpBonus: 30 },
          { id: "sec-w1-3", task: "Implement basic Python socket packet sniffer to detect unauthorized ARP spoofing attacks", deliverable: "arp_spoof_detector.py", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 2,
        title: "Week 2: Linux Operating System Hardening",
        theme: "Permissions, SSH Bastion, IPTables & Fail2ban",
        milestones: [
          { id: "sec-w2-1", task: "Harden Linux server following CIS benchmark: disable root SSH, configure key-only auth, and enforce umask 027", deliverable: "linux_hardening_script.sh", estimatedHours: 6, xpBonus: 30 },
          { id: "sec-w2-2", task: "Configure IPTables / UFW firewall rules blocking unwanted egress traffic and brute-force IPs with Fail2ban", deliverable: "firewall_rules.sh", estimatedHours: 5, xpBonus: 30 },
          { id: "sec-w2-3", task: "Audit system file integrity and SUID/SGID binaries using Lynis security auditor", deliverable: "lynis_audit_score.md", estimatedHours: 4, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 3,
        title: "Week 3: Web App Pen-Testing: Injection & Broken Auth",
        theme: "SQLi, Burp Suite, Session Hijacking & JWT Attacks",
        milestones: [
          { id: "sec-w3-1", task: "Exploit union-based and blind Boolean SQL injection in vulnerable lab and extract database metadata", deliverable: "sqli_exploit_walkthrough.md", estimatedHours: 7, xpBonus: 30 },
          { id: "sec-w3-2", task: "Intercept and tamper HTTP requests using Burp Suite proxy to bypass client-side form validation", deliverable: "burp_tamper_log.txt", estimatedHours: 5, xpBonus: 30 },
          { id: "sec-w3-3", task: "Crack weak JWT signature keys and forge administrative privileges tokens", deliverable: "jwt_exploit_script.py", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 4,
        title: "Week 4: XSS, CSRF & Server-Side Vulnerabilities",
        theme: "Reflected/Stored XSS, CSP Policies & SSRF",
        milestones: [
          { id: "sec-w4-1", task: "Execute Stored and DOM XSS payloads in testbed and capture simulated session tokens", deliverable: "xss_poc_demonstration.md", estimatedHours: 6, xpBonus: 30 },
          { id: "sec-w4-2", task: "Design strict Content Security Policy (CSP) header eliminating inline script execution risks", deliverable: "csp_header_policy.conf", estimatedHours: 5, xpBonus: 30 },
          { id: "sec-w4-3", task: "Exploit Server-Side Request Forgery (SSRF) to read AWS EC2 instance metadata (169.254.169.254)", deliverable: "ssrf_remediation_guide.md", estimatedHours: 6, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 5,
        title: "Week 5: Cloud Security & AWS IAM Least Privilege",
        theme: "Policy Evaluation, KMS Encryption & CloudTrail",
        milestones: [
          { id: "sec-w5-1", task: "Write least-privilege IAM JSON policies replacing wildcard AdministratorAccess policies", deliverable: "least_privilege_iam.json", estimatedHours: 6, xpBonus: 30 },
          { id: "sec-w5-2", task: "Enable AWS CloudTrail multi-region trails and write CloudWatch metric alarms for unauthorized API calls", deliverable: "cloudtrail_alarm_rules.tf", estimatedHours: 6, xpBonus: 30 },
          { id: "sec-w5-3", task: "Scan public S3 buckets and unencrypted EBS volumes using AWS CLI and Python Boto3", deliverable: "cloud_misconfig_scanner.py", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 6,
        title: "Week 6: Container & Kubernetes Cluster Security",
        theme: "PodSecurity Standards, NetworkPolicies & Trivy",
        milestones: [
          { id: "sec-w6-1", task: "Enforce Kubernetes Pod Security Standards (Restricted) prohibiting root execution and privilege escalation", deliverable: "k8s_security_standards.yaml", estimatedHours: 6, xpBonus: 30 },
          { id: "sec-w6-2", task: "Define default-deny Kubernetes NetworkPolicies isolating multi-tenant namespace traffic", deliverable: "default_deny_networkpolicy.yaml", estimatedHours: 6, xpBonus: 30 },
          { id: "sec-w6-3", task: "Integrate Trivy container image scanning into CI pipeline to block builds containing critical CVEs", deliverable: "ci_trivy_gate.yml", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 7,
        title: "Week 7: SIEM Log Management & Threat Hunting",
        theme: "Wazuh / ELK Stack, Sigma Detection & Sysmon",
        milestones: [
          { id: "sec-w7-1", task: "Deploy Wazuh agent on Linux endpoints and collect system authentication and file integrity logs", deliverable: "wazuh_agent_config.xml", estimatedHours: 7, xpBonus: 30 },
          { id: "sec-w7-2", task: "Author Sigma detection rule detecting suspicious PowerShell encoded execution and reverse shells", deliverable: "sigma_powershell_rule.yml", estimatedHours: 6, xpBonus: 30 },
          { id: "sec-w7-3", task: "Query SIEM dashboard to identify attacker pivot attempts across subnets", deliverable: "threat_hunt_summary.md", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 8,
        title: "Week 8: Incident Response & Post-Mortem Operations",
        theme: "Containment, Memory Forensics & Root-Cause RCA",
        milestones: [
          { id: "sec-w8-1", task: "Simulate ransomware outbreak in lab and execute network containment protocol in under 15 minutes", deliverable: "incident_containment_log.md", estimatedHours: 7, xpBonus: 30 },
          { id: "sec-w8-2", task: "Extract volatile RAM dump and identify injected malicious DLLs using Volatility 3 framework", deliverable: "memory_forensics_report.pdf", estimatedHours: 7, xpBonus: 30 },
          { id: "sec-w8-3", task: "Write comprehensive Root Cause Analysis (RCA) executive report with preventive engineering measures", deliverable: "security_incident_rca.pdf", estimatedHours: 6, xpBonus: 30 },
        ],
      },
    ],
  },
  {
    slug: "mobile-engineer",
    title: "Cross-Platform Mobile Engineer (React Native & Flutter)",
    shortDescription:
      "Develop high-performance iOS and Android applications with React Native, Flutter, offline-first SQLite sync, native device modules, and App Store CI/CD.",
    category: "Mobile",
    durationWeeks: "10–12 Weeks",
    level: "Beginner to Pro",
    keySkills: ["React Native", "Flutter", "TypeScript", "Dart", "SQLite", "App Store CI/CD"],
    phases: [
      {
        phaseNumber: 1,
        title: "Mobile UI Layouts, State & Gesture Engines",
        description: "Declarative UI widgets, Flexbox layout algorithms, touch gestures, and animated transitions.",
        skills: ["react-native", "typescript"],
        resources: [
          {
            title: "React Native Official Tutorial & Docs",
            provider: "Meta Open Source",
            url: "https://reactnative.dev/docs/getting-started",
            type: "Documentation",
            estimatedHours: 20,
            cost: "100% Free",
            badge: "Official Reference",
          },
          {
            title: "Flutter & Dart Apprentice",
            provider: "Google Flutter Team",
            url: "https://docs.flutter.dev/get-started",
            type: "Interactive",
            estimatedHours: 25,
            cost: "100% Free",
            badge: "Hands-on Labs",
          },
        ],
        projectIdea: {
          title: "Fluid Gesture-Driven Habit Tracker",
          description: "Build an interactive mobile app with smooth 60fps swipe gestures, sound effects, and dark mode theme switching.",
          deliverables: ["Cross-platform mobile codebase", "Custom gestures and animations", "Responsive tablet/phone layouts"],
        },
      },
      {
        phaseNumber: 2,
        title: "Offline-First Storage & Local Database Synchronization",
        description: "Embedded SQLite, WatermelonDB/Isar, offline sync queues, background sync, and conflict resolution.",
        skills: ["sqlite", "mobile"],
        resources: [
          {
            title: "Offline-First Mobile Architecture Patterns",
            provider: "Expo / React Native Community",
            url: "https://docs.expo.dev/guides/offline-support/",
            type: "Documentation",
            estimatedHours: 12,
            cost: "100% Free",
          },
        ],
        projectIdea: {
          title: "Offline-First Field Inspection & Note App",
          description: "Allow users to record photos, GPS coordinates, and notes completely offline, auto-syncing with server when connection restores.",
          deliverables: ["Local SQLite schema", "Optimistic mutation sync queue", "Conflict resolution strategy"],
        },
      },
      {
        phaseNumber: 3,
        title: "Native Modules, Camera & Device Hardware Access",
        description: "Camera hardware, biometric authentication (FaceID/Fingerprint), Geolocation, and Push Notifications.",
        skills: ["react-native", "ios", "android"],
        resources: [
          {
            title: "React Native Native Modules Guide",
            provider: "React Native Team",
            url: "https://reactnative.dev/docs/native-modules-intro",
            type: "Documentation",
            estimatedHours: 15,
            cost: "100% Free",
          },
        ],
        projectIdea: {
          title: "Biometric Secure Digital Wallet App",
          description: "Secure local credential storage using Keychain/Keystore, biometric prompt unlocks, and camera QR scanning.",
          deliverables: ["FaceID/TouchID unlock flow", "Secure keychain encrypted storage", "QR code scanner view"],
        },
      },
      {
        phaseNumber: 4,
        title: "Production App Store CI/CD & Performance Profiling",
        description: "Fastlane automation, EAS Build, Hermes JS engine profiling, memory leak detection, and App Store submission.",
        skills: ["mobile", "fastlane", "ci-cd"],
        resources: [
          {
            title: "Fastlane Mobile Automation Guide",
            provider: "Fastlane.tools",
            url: "https://docs.fastlane.tools/",
            type: "Documentation",
            estimatedHours: 14,
            cost: "100% Free",
            badge: "Industry Standard",
          },
        ],
        projectIdea: {
          title: "Automated App Store Release Pipeline",
          description: "Configure end-to-end automated builds producing signed Android APKs and iOS IPAs with changelog generation and automated release notes.",
          deliverables: ["Fastlane Fastfile automation", "GitHub Actions build pipeline", "Hermes memory profiling report"],
        },
      },
    ],
    weeklySprints: [
      {
        weekNumber: 1,
        title: "Week 1: Declarative Mobile UI & Flexbox Architecture",
        theme: "Components, Responsive Layouts & Design Tokens",
        milestones: [
          { id: "mob-w1-1", task: "Build a pixel-perfect e-commerce home screen with horizontal scrolling banners and product grids", deliverable: "HomeScreen.tsx / dart", estimatedHours: 6, xpBonus: 30 },
          { id: "mob-w1-2", task: "Implement universal design tokens supporting dynamic Dark Mode and accessible text scaling", deliverable: "theme_system.ts", estimatedHours: 5, xpBonus: 30 },
          { id: "mob-w1-3", task: "Handle safe area insets across notches and dynamic island displays on iOS and Android", deliverable: "safe_area_wrapper.tsx", estimatedHours: 4, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 2,
        title: "Week 2: Navigation Stacks & Deep Linking",
        theme: "Tab Navigators, Stack Transitions & URL Schemes",
        milestones: [
          { id: "mob-w2-1", task: "Configure type-safe nested navigators (Bottom Tabs, Drawer, Modal Stacks) with React Navigation", deliverable: "navigation_manifest.tsx", estimatedHours: 6, xpBonus: 30 },
          { id: "mob-w2-2", task: "Configure deep linking schemes (myapp://product/:id) and Universal Links (iOS) / App Links (Android)", deliverable: "deep_link_config.ts", estimatedHours: 6, xpBonus: 30 },
          { id: "mob-w2-3", task: "Implement shared element transitions between list view and detail view screens", deliverable: "shared_element_transition.tsx", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 3,
        title: "Week 3: High-Performance Animations & Gestures",
        theme: "Reanimated 3, Gesture Handler & 60fps Native Threading",
        milestones: [
          { id: "mob-w3-1", task: "Build a gesture-based draggable bottom sheet with snapping points running on UI thread", deliverable: "BottomSheetModal.tsx", estimatedHours: 7, xpBonus: 30 },
          { id: "mob-w3-2", task: "Implement swipe-to-delete row animations with spring physics and haptic vibration feedback", deliverable: "SwipeableRowItem.tsx", estimatedHours: 5, xpBonus: 30 },
          { id: "mob-w3-3", task: "Benchmark JS thread FPS vs UI thread FPS under heavy rendering to guarantee zero frame drops", deliverable: "fps_benchmark_log.md", estimatedHours: 4, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 4,
        title: "Week 4: Local Storage & Offline-First SQLite",
        theme: "WatermelonDB / SQLite, Sync Queues & Conflict Rules",
        milestones: [
          { id: "mob-w4-1", task: "Create normalized SQLite database schema with indexes for high-speed queries on 50,000 local records", deliverable: "local_database_schema.sql", estimatedHours: 7, xpBonus: 30 },
          { id: "mob-w4-2", task: "Implement offline mutation queue intercepting API writes and synchronizing upon reconnect", deliverable: "offline_sync_manager.ts", estimatedHours: 7, xpBonus: 30 },
          { id: "mob-w4-3", task: "Handle conflict resolution with Last-Write-Wins and manual conflict user prompts", deliverable: "conflict_resolver.ts", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 5,
        title: "Week 5: Device Hardware, Camera & Sensors",
        theme: "Camera Hardware, Geolocation & Biometrics",
        milestones: [
          { id: "mob-w5-1", task: "Integrate native camera with photo capture, flash control, and image compression prior to upload", deliverable: "camera_capture_view.tsx", estimatedHours: 6, xpBonus: 30 },
          { id: "mob-w5-2", task: "Implement biometric authentication (FaceID/Fingerprint) with fallback to device PIN", deliverable: "biometric_auth_service.ts", estimatedHours: 6, xpBonus: 30 },
          { id: "mob-w5-3", task: "Track background GPS location with battery-saving geofence alerts", deliverable: "background_location_task.ts", estimatedHours: 6, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 6,
        title: "Week 6: Push Notifications & Real-Time WebSockets",
        theme: "APNs, FCM, Background Handlers & Badging",
        milestones: [
          { id: "mob-w6-1", task: "Set up Apple Push Notification service (APNs) and Firebase Cloud Messaging (FCM) credentials", deliverable: "push_notification_setup.md", estimatedHours: 6, xpBonus: 30 },
          { id: "mob-w6-2", task: "Handle foreground, background, and killed-state push notifications with actionable tap routing", deliverable: "notification_router.ts", estimatedHours: 6, xpBonus: 30 },
          { id: "mob-w6-3", task: "Implement real-time WebSocket chat client with automatic reconnection and heartbeat ping/pong", deliverable: "websocket_chat_client.ts", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 7,
        title: "Week 7: Native Performance Profiling & Hermes",
        theme: "Memory Leaks, Hermes Bytecode & Image Caching",
        milestones: [
          { id: "mob-w7-1", task: "Profile application using Xcode Instruments (Leaks, Allocations) and Android Studio Profiler", deliverable: "memory_profiling_audit.pdf", estimatedHours: 6, xpBonus: 30 },
          { id: "mob-w7-2", task: "Optimize large image lists with FastImage disk caching, thumbnail downsampling, and recycler lists", deliverable: "optimized_image_list.tsx", estimatedHours: 6, xpBonus: 30 },
          { id: "mob-w7-3", task: "Enable Hermes JavaScript engine and analyze bundle size reductions with react-native-bundle-visualizer", deliverable: "bundle_size_analysis.html", estimatedHours: 5, xpBonus: 30 },
        ],
      },
      {
        weekNumber: 8,
        title: "Week 8: Automated Fastlane CI/CD & App Publishing",
        theme: "Code Signing, EAS Build, TestFlight & Google Play",
        milestones: [
          { id: "mob-w8-1", task: "Configure Fastlane Match for centralized Git-managed iOS code signing certificates and provisioning profiles", deliverable: "Fastfile & Matchfile", estimatedHours: 7, xpBonus: 30 },
          { id: "mob-w8-2", task: "Automate build and upload of signed Android AABs to Google Play Internal Testing track via CI", deliverable: ".github/workflows/android_release.yml", estimatedHours: 7, xpBonus: 30 },
          { id: "mob-w8-3", task: "Automate iOS TestFlight uploads with release changelogs and version bump triggers", deliverable: ".github/workflows/ios_release.yml", estimatedHours: 6, xpBonus: 30 },
        ],
      },
    ],
  },
];

/**
 * Given a missing skill slug, returns the direct free learning resource and roadmap link
 */
export function getLearningGuideForSkill(skillSlug: string): {
  roadmapSlug: string;
  resource: FreeResource;
} | null {
  for (const roadmap of CAREER_ROADMAPS) {
    for (const phase of roadmap.phases) {
      if (phase.skills.includes(skillSlug)) {
        return {
          roadmapSlug: roadmap.slug,
          resource: phase.resources[0],
        };
      }
    }
  }
  return null;
}
