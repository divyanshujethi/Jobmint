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
  category: "AI & ML" | "Web Development" | "Data Science" | "Mobile" | "Backend & Systems" | "DevOps & Cloud";
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
