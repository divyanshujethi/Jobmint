export interface VideoChapter {
  timestamp: string;
  seconds: number;
  title: string;
  notes: string;
}

export interface CoursePlaylist {
  id: string;
  title: string;
  creator: string;
  creatorSubscribers: string;
  category: "AI_ML" | "WEB_DEV" | "DSA" | "DEVOPS_CLOUD" | "CYBERSECURITY" | "PYTHON_DATA" | "SYSTEM_DESIGN" | "FREE_TEST" | string;
  subcategory: string;
  youtubeUrl: string;
  embedPlaylistId?: string;
  duration: string;
  totalVideos: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Beginner to Intermediate" | "Beginner to Advanced" | "Intermediate to Advanced" | "All Levels";
  skillsLearned: string[];
  description: string;
  certificateTitle: string;
  projectBenchmark: string;
  curriculumModules: string[];
  recommendedGithubRepos: {
    name: string;
    repoUrl: string;
    stars: string;
    description: string;
  }[];
  relatedProblemCategory?: string;
  videoChapters?: VideoChapter[];
}

export const CURATED_COURSES: CoursePlaylist[] = [
  // 0. 100% FREE TEST COURSE (Zero cost, instant verification & testing)
  {
    id: "free-developer-sandbox",
    title: "Interactive Full-Stack Architecture & Git Sandbox (Free Test Course)",
    creator: "RoleNest Virtual Labs",
    creatorSubscribers: "Official",
    category: "FREE_TEST",
    subcategory: "Full-Stack Architecture & Verification Testing",
    youtubeUrl: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9goXbgTDQ0n_4TBzOO0ocPR",
    embedPlaylistId: "PL4cUxeGkcC9goXbgTDQ0n_4TBzOO0ocPR",
    duration: "Self-Paced / Instant Test",
    totalVideos: 5,
    difficulty: "All Levels",
    certificateTitle: "Certified Interactive Full-Stack & Developer Sandbox Specialist",
    projectBenchmark: "Test the examination suite and verify instant cryptographic certificate generation.",
    curriculumModules: [
      "Module 1: Git Internals, Plumbing Commands & Interactive Rebase",
      "Module 2: Modular Clean Architecture & REST Contract Verification",
      "Module 3: Database Indexing, B-Trees & Sub-Millisecond Redis Caching",
      "Module 4: Lightweight Multi-Stage Docker Containers & CI/CD Pipelines",
      "Module 5: Cryptographic Verification Ledger & Proof-of-Work Auditing",
    ],
    skillsLearned: ["Git", "Next.js", "Clean Architecture", "Unit Testing", "Docker", "CI/CD", "Verification"],
    description:
      "100% Free interactive developer course designed for candidates and evaluators to test quiz examination, project benchmark evaluation, and instant cryptographic certificate issuance.",
    videoChapters: [
      {
        timestamp: "00:00",
        seconds: 0,
        title: "Architecture Sandbox Overview & Git Plumbing",
        notes: "Deep dive into git object hashing, blob trees, commit graphs, and internal pointer manipulation.",
      },
      {
        timestamp: "04:15",
        seconds: 255,
        title: "Clean REST Contracts & Schema Validation",
        notes: "Defining idempotent API routes, Zod payload validation, and HTTP status code semantics.",
      },
      {
        timestamp: "11:30",
        seconds: 690,
        title: "Redis Sub-Millisecond Caching & B-Tree Indexes",
        notes: "Optimizing database queries, cache stampede mitigation, and multi-tenant keyspacing.",
      },
      {
        timestamp: "18:45",
        seconds: 1125,
        title: "Docker Multi-Stage Builds & Automated CI",
        notes: "Minimizing container footprint from 1.2GB down to 68MB using alpine scratch targets.",
      },
      {
        timestamp: "26:10",
        seconds: 1570,
        title: "Cryptographic Certificate Ledger & QR Verification",
        notes: "Verifying tamper-proof digital certificates, asymmetric signatures, and candidate credentials.",
      },
    ],
    recommendedGithubRepos: [
      {
        name: "RitualDev-Lab/DevShelf",
        repoUrl: "https://github.com/RitualDev-Lab/DevShelf",
        stars: "1.2k ⭐",
        description: "Open-source developer platform and resource ecosystem curated by RoleNest.",
      },
    ],
    relatedProblemCategory: "Arrays & Hashing",
  },
  // 1. AI & MACHINE LEARNING - ANDREJ KARPATHY
  {
    id: "karpathy-nn",
    title: "Neural Networks: Zero to Hero",
    creator: "Andrej Karpathy",
    creatorSubscribers: "680K+",
    category: "AI_ML",
    subcategory: "Deep Learning & Transformer Architectures",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
    embedPlaylistId: "PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
    duration: "20+ Hours",
    totalVideos: 8,
    difficulty: "Intermediate",
    certificateTitle: "Certified Deep Learning & GPT Architecture Practitioner",
    projectBenchmark: "Implement a character-level Autograd engine (Micrograd) or train a custom NanoGPT model.",
    curriculumModules: [
      "Micrograd: Building the Autograd scalar derivative engine",
      "Makemore: Bigram, MLP, BatchNorm, and WaveNet language models",
      "Building the GPT-2 Transformer model from scratch in PyTorch",
      "Byte-Pair Encoding (BPE) Tokenizer implementation",
    ],
    skillsLearned: ["Backpropagation", "Micrograd", "Makemore", "GPT from Scratch", "Tokenizer", "PyTorch"],
    description:
      "World-class, hands-on deep learning lecture series from former Tesla AI Director & OpenAI founding member Andrej Karpathy. Builds GPT-2 completely from raw Python.",
    recommendedGithubRepos: [
      {
        name: "karpathy/nanoGPT",
        repoUrl: "https://github.com/karpathy/nanoGPT",
        stars: "34k ⭐",
        description: "The simplest, fastest repository for training/finetuning medium-sized GPTs in PyTorch.",
      },
      {
        name: "karpathy/micrograd",
        repoUrl: "https://github.com/karpathy/micrograd",
        stars: "11k ⭐",
        description: "A tiny scalar-valued autograd engine with a small PyTorch-like neural net library.",
      },
    ],
    relatedProblemCategory: "Dynamic Programming",
  },

  // 2. KRISH NAIK - COMPLETE GENERATIVE AI & RAG
  {
    id: "krish-naik-genai",
    title: "Complete Generative AI, LangChain & LLM Masterclass",
    creator: "Krish Naik",
    creatorSubscribers: "1.1M+",
    category: "AI_ML",
    subcategory: "Generative AI, RAG & Agents",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLZoTAELRMXVNbDMGZlUVbUxsXsvgleF_5",
    embedPlaylistId: "PLZoTAELRMXVNbDMGZlUVbUxsXsvgleF_5",
    duration: "35+ Hours",
    totalVideos: 42,
    difficulty: "Beginner to Intermediate",
    certificateTitle: "Certified Generative AI & Retrieval-Augmented Generation (RAG) Specialist",
    projectBenchmark: "Build an enterprise Multi-Document RAG QA assistant with LangChain, ChromaDB, and Llama-3.",
    curriculumModules: [
      "Foundations of LLMs, Prompt Engineering & Temperature tuning",
      "LangChain Prompts, Output Parsers, LCEL and Memory Components",
      "Vector Databases: ChromaDB, FAISS and Pinecone Embeddings",
      "Multi-Modal RAG Pipelines & Autonomous Multi-Agent Workflows",
    ],
    skillsLearned: ["LangChain", "Llama-3", "RAG Architecture", "ChromaDB", "Vector Math", "Prompt Engineering", "Ollama"],
    description:
      "Industry-tested, step-by-step masterclass covering open-source LLMs, local inference with Ollama, vector search, and production agent architectures.",
    recommendedGithubRepos: [
      {
        name: "langchain-ai/langchain",
        repoUrl: "https://github.com/langchain-ai/langchain",
        stars: "94k ⭐",
        description: "Building applications with LLMs through composability and tool-augmented agents.",
      },
      {
        name: "chroma-core/chroma",
        repoUrl: "https://github.com/chroma-core/chroma",
        stars: "18k ⭐",
        description: "The AI-native open-source embedding database.",
      },
    ],
  },

  // 3. 3BLUE1BROWN - MATHEMATICAL FOUNDATIONS
  {
    id: "3b1b-dl",
    title: "Essence of Neural Networks & Linear Algebra",
    creator: "3Blue1Brown (Grant Sanderson)",
    creatorSubscribers: "6.2M+",
    category: "AI_ML",
    subcategory: "Mathematical Foundations",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi",
    embedPlaylistId: "PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi",
    duration: "6 Hours",
    totalVideos: 6,
    difficulty: "Beginner",
    certificateTitle: "Certified Neural Network Mathematical Foundations Specialist",
    projectBenchmark: "Implement forward pass and gradient descent optimization from raw mathematical matrices without libraries.",
    curriculumModules: [
      "What is a Neural Network and what are weights and biases?",
      "Gradient Descent and Loss Surface Geometry",
      "What is Backpropagation really doing?",
      "Matrix Calculus of the Backpropagation Algorithm",
      "Visualizing Attention & Transformers",
    ],
    skillsLearned: ["Gradient Descent", "Loss Functions", "Matrix Transformations", "Backpropagation Intuition", "Attention Mechanism"],
    description:
      "The undisputed gold standard visual explanation of neural network mathematics, weights, biases, and high-dimensional loss geometry.",
    recommendedGithubRepos: [
      {
        name: "3b1b/manim",
        repoUrl: "https://github.com/3b1b/manim",
        stars: "66k ⭐",
        description: "Animation engine for explanatory math and machine learning videos.",
      },
    ],
  },

  // 4. FULL-STACK WEB - HITESH CHOUDHARY (CHAI AUR CODE)
  {
    id: "hitesh-chai-fullstack",
    title: "Chai aur Full Stack Next.js 15 & Node.js",
    creator: "Hitesh Choudhary (Chai aur Code)",
    creatorSubscribers: "1.2M+",
    category: "WEB_DEV",
    subcategory: "Full-Stack React 19 & Next.js 15",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLu71SKxNbfoBAaWGtn9GA2PTw0HO0tXzq",
    embedPlaylistId: "PLu71SKxNbfoBAaWGtn9GA2PTw0HO0tXzq",
    duration: "28+ Hours",
    totalVideos: 30,
    difficulty: "Beginner to Intermediate",
    certificateTitle: "Certified Full-Stack Next.js & TypeScript Developer",
    projectBenchmark: "Deploy a production Next.js 15 App Router web application with PostgreSQL, Drizzle ORM, and secure authentication.",
    curriculumModules: [
      "Modern React 19 & Next.js 15 Server vs Client Components",
      "Server Actions, Mutations & Data Fetching Patterns",
      "PostgreSQL Integration with Drizzle ORM & Migrations",
      "Session Security, JWT Cookies & Production Deployment",
    ],
    skillsLearned: ["React 19", "Next.js App Router", "Server Actions", "PostgreSQL", "Drizzle ORM", "Auth.js"],
    description:
      "Production-focused comprehensive guide to building modern full-stack web applications with authentication, serverless backends, and deployment.",
    recommendedGithubRepos: [
      {
        name: "shadcn/ui",
        repoUrl: "https://github.com/shadcn/ui",
        stars: "76k ⭐",
        description: "Beautifully designed components that you can copy and paste into your apps.",
      },
      {
        name: "drizzle-team/drizzle-orm",
        repoUrl: "https://github.com/drizzle-team/drizzle-orm",
        stars: "38k ⭐",
        description: "TypeScript ORM for SQL databases with maximum performance and zero overhead.",
      },
    ],
    relatedProblemCategory: "Arrays & Hashing",
  },

  // 5. HARKIRAT SINGH - 100XDEVS FULL STACK & WEB3
  {
    id: "harkirat-100xdevs",
    title: "100xDevs: Complete Full-Stack & DevOps Cohort",
    creator: "Harkirat Singh",
    creatorSubscribers: "550K+",
    category: "WEB_DEV",
    subcategory: "Full Stack & Microservices",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLinedj3B30sCOs6l1r24sM_J_vUq04iS3",
    embedPlaylistId: "PLinedj3B30sCOs6l1r24sM_J_vUq04iS3",
    duration: "40+ Hours",
    totalVideos: 35,
    difficulty: "Intermediate",
    certificateTitle: "Certified Scalable Full Stack & Microservices Engineer",
    projectBenchmark: "Build an event-driven payment processing microservice with Redis Pub/Sub, WebSockets, and Turborepo.",
    curriculumModules: [
      "Turborepo Monorepo Architecture for Enterprise Apps",
      "Real-Time WebSockets & Stateful Node.js Microservices",
      "Message Queues with Redis Streams & BullMQ",
      "Containerization & CI/CD with Docker & GitHub Actions",
    ],
    skillsLearned: ["TypeScript", "Turborepo", "WebSockets", "Redis", "Docker", "PostgreSQL", "Microservices"],
    description:
      "Deep dive into production engineering practices used at high-growth Indian startups: Monorepos, real-time messaging, Redis queues, and distributed backends.",
    recommendedGithubRepos: [
      {
        name: "vercel/turborepo",
        repoUrl: "https://github.com/vercel/turborepo",
        stars: "16k ⭐",
        description: "The high-performance build system for JavaScript & TypeScript codebases.",
      },
    ],
  },

  // 6. STRIVER - A2Z DSA SHEET (TAKEOFOWARD)
  {
    id: "striver-a2z-dsa",
    title: "Striver's A2Z DSA Course & 450+ Problem Sheet",
    creator: "takeUforward (Raj Vikramaditya)",
    creatorSubscribers: "1.4M+",
    category: "DSA",
    subcategory: "Data Structures & Algorithms",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
    embedPlaylistId: "PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
    duration: "85+ Hours",
    totalVideos: 120,
    difficulty: "Beginner to Advanced",
    certificateTitle: "Certified Data Structures & Algorithms Master Specialist",
    projectBenchmark: "Solve and verify all 450+ coding interview benchmarks across Arrays, Trees, Graphs, and DP.",
    curriculumModules: [
      "Step 1 & 2: Learn the basics, C++/Java STL, Math & Recursion",
      "Step 3 & 4: Arrays Easy/Medium/Hard & Binary Search on Answers",
      "Step 5 to 9: Strings, LinkedList, Bit Manipulation, Stack & Queues",
      "Step 10 to 16: Binary Trees, BSTs, Graphs, and Dynamic Programming",
    ],
    skillsLearned: ["Binary Search", "Dynamic Programming", "Graphs & BFS/DFS", "Binary Trees", "Recursion", "Two Pointers"],
    description:
      "The undisputed most popular DSA interview curriculum in India. Trusted by over 1,000,000 engineering students placing into Google, Amazon, Microsoft, and Uber.",
    recommendedGithubRepos: [
      {
        name: "kdn251/interviews",
        repoUrl: "https://github.com/kdn251/interviews",
        stars: "62k ⭐",
        description: "Everything you need to know to get the software engineering job.",
      },
    ],
    relatedProblemCategory: "Dynamic Programming",
  },

  // 7. NEETCODE 150 - ALGORITHMIC PATTERNS
  {
    id: "neetcode-150",
    title: "NeetCode 150: Coding Interview Patterns",
    creator: "NeetCode",
    creatorSubscribers: "850K+",
    category: "DSA",
    subcategory: "FAANG Coding Interview Prep",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf",
    embedPlaylistId: "PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf",
    duration: "45+ Hours",
    totalVideos: 150,
    difficulty: "Intermediate",
    certificateTitle: "Certified Algorithmic Problem Solving & Pattern Specialist",
    projectBenchmark: "Complete the 15 core algorithmic patterns including Sliding Window, Two Pointers, and Monotonic Stack.",
    curriculumModules: [
      "Arrays & Hashing (Two Sum, Group Anagrams, Top K Elements)",
      "Two Pointers & Sliding Window (3Sum, Trapping Rain Water, Min Window)",
      "Trees & Tries (Invert Tree, Word Search II, Lowest Common Ancestor)",
      "Dynamic Programming (Coin Change, Longest Increasing Subsequence)",
    ],
    skillsLearned: ["Sliding Window", "Two Pointers", "Monotonic Stack", "Dynamic Programming", "Heap / Priority Queue"],
    description:
      "The world's most structured pattern-based coding interview curriculum. Categorizes 150 problems into repeatable algorithmic mental models.",
    recommendedGithubRepos: [
      {
        name: "neetcode-gh/leetcode",
        repoUrl: "https://github.com/neetcode-gh/leetcode",
        stars: "22k ⭐",
        description: "Complete solutions in Python, C++, Java, and JavaScript for NeetCode 150.",
      },
    ],
    relatedProblemCategory: "Sliding Window",
  },

  // 8. KUNAL KUSHWAHA - JAVA & DSA
  {
    id: "kunal-java-dsa",
    title: "Complete Java + DSA + Open Source Masterclass",
    creator: "Kunal Kushwaha",
    creatorSubscribers: "600K+",
    category: "DSA",
    subcategory: "Java Foundations & Competitive Programming",
    youtubeUrl: "https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ",
    embedPlaylistId: "PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ",
    duration: "60+ Hours",
    totalVideos: 65,
    difficulty: "Beginner to Intermediate",
    certificateTitle: "Certified Java & Algorithmic Foundations Developer",
    projectBenchmark: "Implement all fundamental data structures in pure Java from scratch and submit open source PRs.",
    curriculumModules: [
      "Java Language Syntax, Memory Model & Garbage Collection",
      "Time & Space Complexity with Big-O Analysis",
      "Linear & Binary Search with Real Interview Questions",
      "Recursion, Backtracking & Object-Oriented System Architecture",
    ],
    skillsLearned: ["Java", "Time Complexity", "Recursion", "OOP Design", "Trees & Graphs", "Git & Open Source"],
    description:
      "Comprehensive, beginner-friendly masterclass taking students from zero coding experience all the way to solving LeetCode Medium/Hard problems in Java.",
    recommendedGithubRepos: [
      {
        name: "kunal-kushwaha/DSA-Bootcamp-Java",
        repoUrl: "https://github.com/kunal-kushwaha/DSA-Bootcamp-Java",
        stars: "18k ⭐",
        description: "Complete notes, practice assignments, and code solutions for the Java DSA bootcamp.",
      },
    ],
    relatedProblemCategory: "Binary Search",
  },

  // 9. BYTEBYTEGO - SYSTEM DESIGN INTERVIEW FUNDAMENTALS
  {
    id: "bytebytego-system-design",
    title: "System Design Interview Architecture Masterclass",
    creator: "ByteByteGo (Alex Xu)",
    creatorSubscribers: "1.2M+",
    category: "SYSTEM_DESIGN",
    subcategory: "Large-Scale Distributed Systems",
    youtubeUrl: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9gU0K_R6cO453YF8F59eWj-",
    embedPlaylistId: "PL4cUxeGkcC9gU0K_R6cO453YF8F59eWj-",
    duration: "18+ Hours",
    totalVideos: 25,
    difficulty: "Intermediate to Advanced",
    certificateTitle: "Certified Distributed Systems & High-Scale Architect",
    projectBenchmark: "Design and document a high-availability URL Shortener or Distributed Rate Limiter handling 100k QPS.",
    curriculumModules: [
      "Vertical vs Horizontal Scaling, Load Balancers & Reverse Proxies",
      "Consistent Hashing & Distributed Caching with Redis",
      "Database Sharding, Replication & CAP Theorem Tradeoffs",
      "Message Queues (Kafka vs RabbitMQ) & Idempotent API Design",
    ],
    skillsLearned: ["Load Balancing", "Consistent Hashing", "Rate Limiting", "Distributed Caching", "Kafka", "Database Sharding"],
    description:
      "The definitive visual guide to cracking senior engineering and staff architecture interviews at tier-1 tech companies.",
    recommendedGithubRepos: [
      {
        name: "donnemartin/system-design-primer",
        repoUrl: "https://github.com/donnemartin/system-design-primer",
        stars: "270k ⭐",
        description: "Learn how to design large-scale systems. Prep for the system design interview.",
      },
    ],
  },

  // 10. HUSSEIN NASSER - BACKEND ARCHITECTURE & DB INTERNALS
  {
    id: "hussein-backend",
    title: "Backend Engineering, Protocols & Database Internals",
    creator: "Hussein Nasser",
    creatorSubscribers: "450K+",
    category: "SYSTEM_DESIGN",
    subcategory: "Networking, Databases & Protocols",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLQnljOFTspQXjD0twZq44zRMTzEGu83jO",
    embedPlaylistId: "PLQnljOFTspQXjD0twZq44zRMTzEGu83jO",
    duration: "25+ Hours",
    totalVideos: 35,
    difficulty: "Advanced",
    certificateTitle: "Certified Advanced Backend Systems Engineer",
    projectBenchmark: "Build an event-driven TCP/HTTP reverse proxy with connection pooling and TLS termination.",
    curriculumModules: [
      "HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC) Transport Protocols",
      "Database Internals: B-Trees, LSM Trees, WAL & Isolation Levels",
      "Connection Pooling, Keep-Alive & TCP Three-Way Handshakes",
      "gRPC vs Protocol Buffers vs WebSockets Performance Benchmarks",
    ],
    skillsLearned: ["HTTP/3 & QUIC", "Database Internals", "B-Trees", "Connection Pooling", "gRPC", "TCP/IP"],
    description:
      "Deep architectural exploration of how backend servers, operating system sockets, network protocols, and database storage engines really work.",
    recommendedGithubRepos: [
      {
        name: "danistefanovic/build-your-own-x",
        repoUrl: "https://github.com/danistefanovic/build-your-own-x",
        stars: "315k ⭐",
        description: "Master programming by recreating your favorite technologies from scratch.",
      },
    ],
  },

  // 11. TECHWORLD WITH NANA - DOCKER & KUBERNETES
  {
    id: "nana-devops",
    title: "Complete Docker & Kubernetes Cloud Native Bootcamp",
    creator: "TechWorld with Nana",
    creatorSubscribers: "1.1M+",
    category: "DEVOPS_CLOUD",
    subcategory: "Containerization & Orchestration",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLy7NrYWoggjwPggqtPfAhkwLBI342A5Mr",
    embedPlaylistId: "PLy7NrYWoggjwPggqtPfAhkwLBI342A5Mr",
    duration: "22+ Hours",
    totalVideos: 24,
    difficulty: "Beginner to Intermediate",
    certificateTitle: "Certified Cloud Native Containers & Kubernetes Specialist",
    projectBenchmark: "Containerize a multi-tier web application, write Helm charts, and deploy to a production Kubernetes cluster with ingress.",
    curriculumModules: [
      "Docker Core: Images, Containers, Multi-Stage Builds & Volumes",
      "Docker Compose for Local Multi-Service Development Environments",
      "Kubernetes Architecture: Pods, Deployments, Services & Ingress",
      "ConfigMaps, Secrets, Persistent Volumes & Helm Package Management",
    ],
    skillsLearned: ["Docker", "Kubernetes", "YAML Configs", "CI/CD Pipelines", "Helm Charts", "Prometheus"],
    description:
      "Visual, crystal-clear explanation of modern cloud infrastructure. From running your first Docker container to deploying microservices on Kubernetes.",
    recommendedGithubRepos: [
      {
        name: "bregman-arie/devops-exercises",
        repoUrl: "https://github.com/bregman-arie/devops-exercises",
        stars: "64k ⭐",
        description: "Linux, Jenkins, AWS, SRE, Prometheus, Docker, Python, Ansible interview questions and practical tasks.",
      },
    ],
  },

  // 12. ABHISHEK VEERAMALLA - ZERO TO HERO DEVOPS ON AWS
  {
    id: "abhishek-devops-aws",
    title: "DevOps Zero to Hero with AWS, Terraform & CI/CD",
    creator: "Abhishek Veeramalla",
    creatorSubscribers: "420K+",
    category: "DEVOPS_CLOUD",
    subcategory: "AWS Cloud & Infrastructure as Code",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLdpzxOOAlwvIcETUpywJ9FxnJpks5X_jE",
    embedPlaylistId: "PLdpzxOOAlwvIcETUpywJ9FxnJpks5X_jE",
    duration: "30+ Hours",
    totalVideos: 40,
    difficulty: "Beginner to Intermediate",
    certificateTitle: "Certified AWS Cloud & Infrastructure Automation Engineer",
    projectBenchmark: "Provision complete AWS infrastructure using Terraform and deploy a containerized app with GitHub Actions.",
    curriculumModules: [
      "AWS Core Services: EC2, S3, IAM, VPC & Security Groups",
      "Infrastructure as Code (IaC) with Terraform & State Management",
      "CI/CD Automation Pipelines using GitHub Actions & SonarQube",
      "Production Monitoring with Prometheus, Node Exporter & Grafana",
    ],
    skillsLearned: ["AWS", "Terraform", "GitHub Actions", "CI/CD", "Linux", "Prometheus", "Grafana"],
    description:
      "Hands-on, project-heavy curriculum built specifically for Indian tech students targeting high-paying Cloud Engineer & DevOps roles.",
    recommendedGithubRepos: [
      {
        name: "iam-veeramalla/complete-devops-zero-to-hero",
        repoUrl: "https://github.com/iam-veeramalla/complete-devops-zero-to-hero",
        stars: "14k ⭐",
        description: "Hands-on projects and tutorials for AWS, Terraform, Docker, and Kubernetes.",
      },
    ],
  },

  // 13. NETWORKCHUCK - ETHICAL HACKING & SECURITY
  {
    id: "networkchuck-hacking",
    title: "Certified Ethical Hacking & Cybersecurity Foundations",
    creator: "NetworkChuck",
    creatorSubscribers: "3.5M+",
    category: "CYBERSECURITY",
    subcategory: "Penetration Testing & Network Defense",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLS1QulWo1RIZLfZ5k8_p2hGzpF3hN11fF",
    embedPlaylistId: "PLS1QulWo1RIZLfZ5k8_p2hGzpF3hN11fF",
    duration: "20+ Hours",
    totalVideos: 22,
    difficulty: "Beginner to Intermediate",
    certificateTitle: "Certified Cybersecurity & Network Defense Specialist",
    projectBenchmark: "Conduct a vulnerability assessment on a local sandbox lab with Nmap, Wireshark, and Metasploit.",
    curriculumModules: [
      "Networking Fundamentals: Subnetting, TCP Handshakes & Port Scans",
      "Reconnaissance with Nmap, Gobuster & OSINT Frameworks",
      "Packet Sniffing and Protocol Analysis with Wireshark",
      "Exploitation, Metasploit Payloads & Defensive Hardening",
    ],
    skillsLearned: ["Nmap", "Wireshark", "Metasploit", "Network Defense", "Kali Linux", "Vulnerability Scanning"],
    description:
      "Fast-paced, hyper-engaging introduction to cybersecurity, ethical hacking, and defending servers against modern exploits.",
    recommendedGithubRepos: [
      {
        name: "swisskyrepo/PayloadsAllTheThings",
        repoUrl: "https://github.com/swisskyrepo/PayloadsAllTheThings",
        stars: "58k ⭐",
        description: "A list of useful payloads and bypasses for Web Application Security and Pentesting.",
      },
    ],
  },

  // 14. COREY SCHAFER - ADVANCED PYTHON PROGRAMMING
  {
    id: "corey-python",
    title: "Python Programming Masterclass & Engineering Patterns",
    creator: "Corey Schafer",
    creatorSubscribers: "1.3M+",
    category: "PYTHON_DATA",
    subcategory: "Python Systems & Architecture",
    youtubeUrl: "https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyMTDIRhPWOoE3v7",
    embedPlaylistId: "PL-osiE80TeTt2d9bfVyMTDIRhPWOoE3v7",
    duration: "24+ Hours",
    totalVideos: 32,
    difficulty: "Beginner to Advanced",
    certificateTitle: "Certified Python Systems & Software Engineering Specialist",
    projectBenchmark: "Build an asynchronous web scraping and ETL data pipeline with custom decorators, generators, and unit tests.",
    curriculumModules: [
      "Object-Oriented Python: Inheritance, Dunder Methods & Encapsulation",
      "Advanced Functions: Decorators, Closures, Generators & Iterators",
      "Multithreading vs Multiprocessing & Asynchronous IO",
      "Python Logging, Unit Testing & Virtual Environment Management",
    ],
    skillsLearned: ["Python OOP", "Decorators", "Generators", "Multithreading", "Unit Testing", "Logging"],
    description:
      "Universally acclaimed as the cleanest Python programming series ever created. Teaches true software engineering design patterns in Python.",
    recommendedGithubRepos: [
      {
        name: "vinta/awesome-python",
        repoUrl: "https://github.com/vinta/awesome-python",
        stars: "230k ⭐",
        description: "A curated list of awesome Python frameworks, libraries, software and resources.",
      },
    ],
    relatedProblemCategory: "Arrays & Hashing",
  },

  // 31. STRIVER (take U forward) - A2Z DSA SHEET
  {
    id: "striver-a2z-dsa",
    title: "Striver's Complete A2Z DSA Sheet Masterclass",
    creator: "Striver (take U forward)",
    creatorSubscribers: "800K+",
    category: "DSA",
    subcategory: "Complete Data Structures & Competitive Programming",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_st8",
    embedPlaylistId: "PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_st8",
    duration: "100+ Hours",
    totalVideos: 120,
    difficulty: "Beginner to Advanced",
    certificateTitle: "Certified Data Structures & Algorithms Specialist (A2Z)",
    projectBenchmark: "Solve 100+ curated LeetCode medium/hard problems covering trees, graphs, and dynamic programming.",
    curriculumModules: [
      "Step 1: Learn the Basics (Time Complexity, Arrays, Math, Recursion)",
      "Step 2: Sorting Techniques (Merge Sort, Quick Sort, Bubble, Insertion)",
      "Step 3: Arrays (Easy, Medium, Hard - Kadane's, Pascal's Triangle)",
      "Step 4: Binary Search on 1D/2D Arrays and Search Space",
      "Step 5: Strings (Reverse Words, Roman to Integer, KMP Algorithm)",
      "Step 6: Linked List (Singly, Doubly, Medium/Hard Interview Problems)",
      "Step 7: Recursion & Backtracking (Subsets, Permutations, N-Queens)",
      "Step 8: Bit Manipulation (XOR properties, Power Set, Single Number)",
      "Step 9: Stack and Queues (Monotonic Stack, Sliding Window Maximum)",
      "Step 10: Binary Trees & BST (Traversals, LCA, Serialization)",
      "Step 11: Graphs (BFS/DFS, Dijkstra, Bellman Ford, Topo Sort)",
      "Step 12: Dynamic Programming (1D, 2D, DP on Grids, Stocks, LIS)",
    ],
    skillsLearned: ["Arrays", "Binary Search", "Linked Lists", "Trees", "Graphs", "Dynamic Programming", "C++", "Java"],
    description:
      "The most famous coding interview prep series in India. Step-by-step video solutions to Striver's acclaimed A2Z DSA sheet.",
    recommendedGithubRepos: [
      {
        name: "striver005/A2Z-DSA-Sheet",
        repoUrl: "https://github.com/striver005",
        stars: "18k ⭐",
        description: "Official GitHub code repository and cheat sheet for Striver's A2Z DSA curriculum.",
      },
    ],
    relatedProblemCategory: "Arrays & Hashing",
  },

  // 32. NEETCODE - NEETCODE 150 & CORE PATTERNS
  {
    id: "neetcode-150-patterns",
    title: "NeetCode 150: Coding Interview Blueprint",
    creator: "NeetCode",
    creatorSubscribers: "900K+",
    category: "DSA",
    subcategory: "FAANG / Tier-1 Technical Interview Patterns",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLot-Xpze53lf5C3HSjCnyFghlW0G1QKXo",
    embedPlaylistId: "PLot-Xpze53lf5C3HSjCnyFghlW0G1QKXo",
    duration: "50+ Hours",
    totalVideos: 150,
    difficulty: "Intermediate to Advanced",
    certificateTitle: "Certified Technical Interview Problem Solver (NeetCode 150)",
    projectBenchmark: "Implement all 18 core algorithmic patterns with verified time and space complexity explanations.",
    curriculumModules: [
      "Pattern 1: Two Pointers & Sliding Window Mastery",
      "Pattern 2: Monotonic Stack & Queue Tricks",
      "Pattern 3: Binary Search on Monotonic Answer Spaces",
      "Pattern 4: Trees: Lowest Common Ancestor & Diameter",
      "Pattern 5: Graphs: Cycle Detection, Disjoint Set Union & Topological Sort",
      "Pattern 6: Dynamic Programming: 0/1 Knapsack & Longest Common Subsequence",
    ],
    skillsLearned: ["Algorithmic Patterns", "Two Pointers", "Sliding Window", "Binary Trees", "Graphs", "DP", "Python"],
    description:
      "World-standard algorithmic problem-solving breakdown by former Google/Amazon engineer. Focuses on reusable patterns rather than memorization.",
    recommendedGithubRepos: [
      {
        name: "neetcode-gh/leetcode",
        repoUrl: "https://github.com/neetcode-gh/leetcode",
        stars: "22k ⭐",
        description: "Clean, idiomatic Python/C++/Java solutions for all NeetCode 150 problems.",
      },
    ],
    relatedProblemCategory: "Two Pointers",
  },

  // 33. KUNAL KUSHWAHA - COMPLETE JAVA + DSA
  {
    id: "kunal-kushwaha-dsa",
    title: "Complete Java & DSA Placement Bootcamp",
    creator: "Kunal Kushwaha",
    creatorSubscribers: "750K+",
    category: "DSA",
    subcategory: "Java Programming & Algorithmic Foundations",
    youtubeUrl: "https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_UmhsJytxGJEG242801W9",
    embedPlaylistId: "PL9gnSGHSqcnr_UmhsJytxGJEG242801W9",
    duration: "80+ Hours",
    totalVideos: 65,
    difficulty: "Beginner to Advanced",
    certificateTitle: "Certified Java & Algorithms Foundations Specialist",
    projectBenchmark: "Build an algorithmic visualizer in Java demonstrating sorting algorithms and tree traversals.",
    curriculumModules: [
      "Module 1: Java Basics, Control Flow, and Memory Architecture",
      "Module 2: Time & Space Complexity Deep Dive",
      "Module 3: Linear & Binary Search in Infinite Arrays and Matrices",
      "Module 4: Sorting: Cyclic Sort, Merge Sort, Quick Sort",
      "Module 5: Recursion & Backtracking: Permutations, Dice Throw, N-Queens",
      "Module 6: Object-Oriented Programming (OOP) in Java",
    ],
    skillsLearned: ["Java", "OOP", "Cyclic Sort", "Recursion", "Backtracking", "DSA Foundations"],
    description:
      "Comprehensive, beginner-friendly Java and DSA boot camp by Kunal Kushwaha covering everything from scratch to advanced recursion.",
    recommendedGithubRepos: [
      {
        name: "kunal-kushwaha/DSA-Bootcamp-Java",
        repoUrl: "https://github.com/kunal-kushwaha/DSA-Bootcamp-Java",
        stars: "16k ⭐",
        description: "Assignments, lecture notes, and solution templates for the entire Java DSA Bootcamp.",
      },
    ],
    relatedProblemCategory: "Binary Search",
  },

  // 34. ABDUL BARI - ALGORITHMS ANALYSIS & DESIGN
  {
    id: "abdul-bari-algorithms",
    title: "Analysis & Design of Algorithms (ADA)",
    creator: "Abdul Bari",
    creatorSubscribers: "1.2M+",
    category: "DSA",
    subcategory: "Theoretical & Practical Algorithm Engineering",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLDN4rrl48X7TsC8x5G9p7yXzU6W8QJ5c3",
    embedPlaylistId: "PLDN4rrl48X7TsC8x5G9p7yXzU6W8QJ5c3",
    duration: "30+ Hours",
    totalVideos: 80,
    difficulty: "All Levels",
    certificateTitle: "Certified Algorithmic Complexity & Design Specialist",
    projectBenchmark: "Derive asymptotic recurrence bounds and design optimal greedy & dynamic programming algorithms.",
    curriculumModules: [
      "Master Theorem & Recurrence Relations",
      "Divide and Conquer: Strassen's Matrix Multiplication, Merge & Quick Sort",
      "Greedy Method: Knapsack, Prim's, Kruskal's, Huffman Coding, Dijkstra",
      "Dynamic Programming: Bellman-Ford, Floyd-Warshall, Matrix Chain Multiplication",
      "Branch and Bound & Backtracking: 0/1 Knapsack, TSP",
      "NP-Hard and NP-Complete Reductions",
    ],
    skillsLearned: ["Asymptotic Analysis", "Master Theorem", "Greedy Method", "Dynamic Programming", "Graph Theory"],
    description:
      "The undisputed gold standard for computer science academic fundamentals. Abdul Bari's whiteboard derivations are revered worldwide.",
    recommendedGithubRepos: [
      {
        name: "TheAlgorithms/Python",
        repoUrl: "https://github.com/TheAlgorithms/Python",
        stars: "190k ⭐",
        description: "All algorithms implemented in Python for analysis and learning.",
      },
    ],
    relatedProblemCategory: "Trees",
  },

  // 35. HARKIRAT SINGH (100xDevs) - FULL STACK 0 TO 100
  {
    id: "harkirat-fullstack-100x",
    title: "Complete Full-Stack Web Development (0 to 100)",
    creator: "Harkirat Singh (100xDevs)",
    creatorSubscribers: "450K+",
    category: "WEB_DEV",
    subcategory: "Modern Web Engineering, Monorepos & Docker",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLinedj3B308-4O_B_JgK9fC5b-xW1C5wO",
    embedPlaylistId: "PLinedj3B308-4O_B_JgK9fC5b-xW1C5wO",
    duration: "60+ Hours",
    totalVideos: 40,
    difficulty: "Beginner to Advanced",
    certificateTitle: "Certified Full-Stack Software Engineer (100xDevs)",
    projectBenchmark: "Deploy a production Turborepo monorepo with Next.js, Express backend, PostgreSQL, and WebSocket server.",
    curriculumModules: [
      "Module 1: JavaScript & Node.js Runtime Internals (Event Loop, Callbacks)",
      "Module 2: TypeScript Deep Dive: Generics, Interfaces & Zod Validation",
      "Module 3: PostgreSQL & Prisma/Drizzle ORM with Connection Pooling",
      "Module 4: Next.js 14/15: Server Components, Server Actions & Middlewares",
      "Module 5: Real-Time Communication with WebSockets & Pub/Sub (Redis)",
      "Module 6: Turborepo Monorepos, Docker Containers & Cloud Deployment",
    ],
    skillsLearned: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "WebSockets", "Docker", "Turborepo"],
    description:
      "Highly practical, production-oriented cohort teaching real software engineering, monorepos, and cloud deployments from day one.",
    recommendedGithubRepos: [
      {
        name: "hkirat/complete-web-development",
        repoUrl: "https://github.com/hkirat",
        stars: "8k ⭐",
        description: "Reference projects, code walkthroughs, and assignments from 100xDevs.",
      },
    ],
    relatedProblemCategory: "Arrays & Hashing",
  },

  // 36. HITESH CHOUDHARY (Chai aur Code) - REACT & NEXT.JS
  {
    id: "chai-aur-react",
    title: "Chai aur React & Next.js Complete Series",
    creator: "Hitesh Choudhary",
    creatorSubscribers: "1.2M+",
    category: "WEB_DEV",
    subcategory: "Production React Hooks, Virtual DOM & Next.js",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLu71SKxNbfoDqgPchmvIsL4hTnJIrtige",
    embedPlaylistId: "PLu71SKxNbfoDqgPchmvIsL4hTnJIrtige",
    duration: "40+ Hours",
    totalVideos: 30,
    difficulty: "All Levels",
    certificateTitle: "Certified Modern React & Frontend Architect",
    projectBenchmark: "Build a production blog platform using Appwrite, Redux Toolkit, and Tailwind CSS with authentication.",
    curriculumModules: [
      "Virtual DOM, Reconciliation & React Fiber Architecture",
      "Custom Hooks, Context API & Prop Drilling Solutions",
      "State Management with Redux Toolkit and Zustand",
      "React Router DOM: Dynamic Routes, Loaders & Error Boundaries",
      "Mega Project: Full-Stack React App with Appwrite Backend",
    ],
    skillsLearned: ["React 19", "Next.js", "Tailwind CSS", "Redux Toolkit", "Context API", "Appwrite"],
    description:
      "Clear, engaging, and in-depth video series unpacking React fiber, hooks, and clean code principles in Hindi/English.",
    recommendedGithubRepos: [
      {
        name: "hiteshchoudhary/chai-aur-react",
        repoUrl: "https://github.com/hiteshchoudhary/chai-aur-react",
        stars: "7.5k ⭐",
        description: "Official GitHub code samples and project source for Chai aur React.",
      },
    ],
    relatedProblemCategory: "Arrays & Hashing",
  },

  // 37. HUSSEIN NASSER - BACKEND ENGINEERING MASTERCLASS
  {
    id: "hussein-nasser-backend",
    title: "Backend Engineering Deep Dive & Protocols",
    creator: "Hussein Nasser",
    creatorSubscribers: "400K+",
    category: "SYSTEM_DESIGN",
    subcategory: "Database Engines, Networking & Proxy Architecture",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLQnljOFTspQXjD0twZq48E_Jz7WdJ5FfA",
    embedPlaylistId: "PLQnljOFTspQXjD0twZq48E_Jz7WdJ5FfA",
    duration: "35+ Hours",
    totalVideos: 45,
    difficulty: "Intermediate to Advanced",
    certificateTitle: "Certified High-Performance Backend Engineer",
    projectBenchmark: "Configure an Nginx reverse proxy with TCP connection pooling, gRPC streaming, and database read replicas.",
    curriculumModules: [
      "TCP, UDP, HTTP/1.1, HTTP/2, and HTTP/3 QUIC Protocol Deep Dive",
      "Database Internals: B-Trees, LSM Trees, WAL, and Isolation Levels",
      "Proxies: Reverse Proxies, Sidecars, Envoy, and Load Balancers",
      "Message Brokers: RabbitMQ vs Kafka vs Redis Pub/Sub",
      "Database Replication: Synchronous vs Asynchronous & Split-Brain Mitigation",
    ],
    skillsLearned: ["Backend Engineering", "PostgreSQL Internals", "HTTP/3", "gRPC", "Nginx", "Connection Pooling"],
    description:
      "One of the best technical channels in existence. Breaks down real distributed systems, database engines, and networking sockets.",
    recommendedGithubRepos: [
      {
        name: "donnemartin/system-design-primer",
        repoUrl: "https://github.com/donnemartin/system-design-primer",
        stars: "280k ⭐",
        description: "Learn how to design large-scale systems and prepare for the system design interview.",
      },
    ],
    relatedProblemCategory: "Design",
  },

  // 38. GAURAV SEN - HIGH-LEVEL SYSTEM DESIGN (HLD)
  {
    id: "gaurav-sen-system-design",
    title: "System Design & Distributed Architecture",
    creator: "Gaurav Sen",
    creatorSubscribers: "500K+",
    category: "SYSTEM_DESIGN",
    subcategory: "Scalability, Caching & Distributed Consensus",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLMC9HnG_svuoMS4g_L_m0_E7p_Y746v6n",
    embedPlaylistId: "PLMC9HnG_svuoMS4g_L_m0_E7p_Y746v6n",
    duration: "25+ Hours",
    totalVideos: 35,
    difficulty: "Intermediate to Advanced",
    certificateTitle: "Certified Distributed Systems Architect",
    projectBenchmark: "Design the high-level architecture for WhatsApp, Tinder, or Netflix with failover and caching strategy.",
    curriculumModules: [
      "Consistent Hashing & Distributed Key-Value Stores",
      "Database Sharding, Replication & CAP Theorem Trade-offs",
      "System Design Case Study: WhatsApp Instant Messaging Architecture",
      "System Design Case Study: Netflix Video Transcoding & CDN Delivery",
      "Microservice Decomposition & Saga Distributed Transactions",
    ],
    skillsLearned: ["System Design", "HLD", "Consistent Hashing", "Sharding", "CAP Theorem", "Distributed Caching"],
    description:
      "World-class visual system design explanations from an ex-Uber engineer. Essential for SDE-2 and senior engineering interviews.",
    recommendedGithubRepos: [
      {
        name: "karanpratapsingh/system-design",
        repoUrl: "https://github.com/karanpratapsingh/system-design",
        stars: "31k ⭐",
        description: "Comprehensive guide to System Design concepts, diagrams, and interview preparation.",
      },
    ],
    relatedProblemCategory: "Design",
  },

  // 39. BYTEBYTEGO - SYSTEM DESIGN INTERVIEW VISUALS
  {
    id: "bytebytego-system-design",
    title: "ByteByteGo: Visual System Design Breakdown",
    creator: "ByteByteGo (Alex Xu)",
    creatorSubscribers: "700K+",
    category: "SYSTEM_DESIGN",
    subcategory: "Large Scale Real-World Systems Breakdown",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLCRMIe5FDP3d9E493b2a2u9v9x0f4WJ0S",
    embedPlaylistId: "PLCRMIe5FDP3d9E493b2a2u9v9x0f4WJ0S",
    duration: "20+ Hours",
    totalVideos: 30,
    difficulty: "All Levels",
    certificateTitle: "Certified Visual System Design Professional",
    projectBenchmark: "Design a distributed URL shortener and real-time collaborative document editor architecture.",
    curriculumModules: [
      "How to Design a Rate Limiter (Token Bucket vs Leaky Bucket)",
      "How Disney+ Streams Video to Millions of Concurrent Devices",
      "How Uber Matches Drivers & Riders in Real-Time (Geohash & Quadtrees)",
      "How Payment Gateways Prevent Double Spending (Idempotency Keys)",
      "Deep Dive into API Gateways vs Load Balancers",
    ],
    skillsLearned: ["System Design", "Rate Limiting", "Geohash", "Idempotency", "Microservices", "Event-Driven"],
    description:
      "Bite-sized, animated visual explanations of real-world system design by author Alex Xu. The clearest system design series online.",
    recommendedGithubRepos: [
      {
        name: "alexxu0108/bytebytego-charts",
        repoUrl: "https://github.com/alexxu0108",
        stars: "14k ⭐",
        description: "Official visual architecture charts and system diagrams from ByteByteGo.",
      },
    ],
    relatedProblemCategory: "Design",
  },

  // 40. TECHWORLD WITH NANA - DOCKER & KUBERNETES
  {
    id: "nana-devops-k8s",
    title: "Docker & Kubernetes DevOps Masterclass",
    creator: "TechWorld with Nana",
    creatorSubscribers: "1.0M+",
    category: "DEVOPS_CLOUD",
    subcategory: "Containerization & Cloud Native Orchestration",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLy7NrYWoggjwPggqtPsI_z6xAwiCa045u",
    embedPlaylistId: "PLy7NrYWoggjwPggqtPsI_z6xAwiCa045u",
    duration: "30+ Hours",
    totalVideos: 25,
    difficulty: "Beginner to Advanced",
    certificateTitle: "Certified Kubernetes & Cloud-Native DevOps Engineer",
    projectBenchmark: "Deploy a multi-tier microservice app on a local Minikube/K8s cluster with Ingress, Services, and PersistentVolumes.",
    curriculumModules: [
      "Docker: Images, Containers, Port Mapping, Dockerfile & Compose",
      "Kubernetes Core: Pods, Services, Deployments, and Namespaces",
      "K8s Architecture: API Server, etcd, Kubelet, and Scheduler",
      "ConfigMaps, Secrets, Ingress Controllers & Persistent Volume Claims",
      "Helm: Packaging K8s Applications & Automated Deployments",
    ],
    skillsLearned: ["Docker", "Kubernetes", "Helm", "YAML", "Containers", "DevOps", "Ingress"],
    description:
      "The highest-rated Kubernetes and Docker educator on YouTube. Nana makes complex cloud infrastructure straightforward and accessible.",
    recommendedGithubRepos: [
      {
        name: "brennerm/kubernetes-overview",
        repoUrl: "https://github.com/brennerm/kubernetes-overview",
        stars: "8k ⭐",
        description: "Visual overview of Kubernetes components, resources, and architectural workflows.",
      },
    ],
    relatedProblemCategory: "Design",
  },

  // 41. ABHISHEK VEERAMALLA - AWS & DEVOPS PROJECTS
  {
    id: "abhishek-aws-devops",
    title: "Complete AWS & DevOps Real-World Projects",
    creator: "Abhishek Veeramalla",
    creatorSubscribers: "550K+",
    category: "DEVOPS_CLOUD",
    subcategory: "CI/CD Pipelines, Terraform & Cloud Architecture",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLdpzxOOAlwvIKMhk8WhzN1pYoJ1Ag8CDB",
    embedPlaylistId: "PLdpzxOOAlwvIKMhk8WhzN1pYoJ1Ag8CDB",
    duration: "45+ Hours",
    totalVideos: 50,
    difficulty: "Intermediate to Advanced",
    certificateTitle: "Certified AWS Cloud DevOps Automation Engineer",
    projectBenchmark: "Build an automated end-to-end GitOps pipeline using GitHub Actions, ArgoCD, Docker, and AWS EKS.",
    curriculumModules: [
      "AWS Core Compute: EC2, IAM, VPC Peering & Security Groups",
      "Infrastructure as Code (IaC) with Terraform & State Locking",
      "CI/CD with GitHub Actions & Jenkins Declarative Pipelines",
      "GitOps with ArgoCD deploying onto AWS EKS Kubernetes Cluster",
      "Monitoring & Observability: Prometheus, Grafana & CloudWatch",
    ],
    skillsLearned: ["AWS", "Terraform", "GitHub Actions", "ArgoCD", "Kubernetes", "Prometheus", "Grafana"],
    description:
      "Real-world, hands-on production DevOps projects by staff cloud engineer Abhishek Veeramalla. Real code, real pipelines, real cloud infrastructure.",
    recommendedGithubRepos: [
      {
        name: "iam-veeramalla/aws-devops-zero-to-hero",
        repoUrl: "https://github.com/iam-veeramalla/aws-devops-zero-to-hero",
        stars: "15k ⭐",
        description: "Official companion code, Terraform files, and project manifests for AWS DevOps Zero to Hero.",
      },
    ],
    relatedProblemCategory: "Design",
  },

  // 42. FAST.AI - PRACTICAL DEEP LEARNING FOR CODERS
  {
    id: "fastai-practical-deep-learning",
    title: "Practical Deep Learning for Coders",
    creator: "Fast.ai / Jeremy Howard",
    creatorSubscribers: "200K+",
    category: "AI_ML",
    subcategory: "Top-Down Deep Learning, PyTorch & Computer Vision",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLfYUBJiXbdtSvpQecCLWhS53zL2178v52",
    embedPlaylistId: "PLfYUBJiXbdtSvpQecCLWhS53zL2178v52",
    duration: "30+ Hours",
    totalVideos: 9,
    difficulty: "All Levels",
    certificateTitle: "Certified Practical Deep Learning Specialist",
    projectBenchmark: "Train and deploy a state-of-the-art vision classifier model to a web application with Gradio/HuggingFace Spaces.",
    curriculumModules: [
      "Getting Started: Training a computer vision model in 5 lines of code",
      "Deployment: Exporting weights and serving inference APIs",
      "Neural Net Foundations: Loss functions, SGD, and learning rates",
      "Tabular Data Analysis and Collaborative Filtering",
      "Natural Language Processing & Fine-Tuning Pre-trained Transformers",
    ],
    skillsLearned: ["PyTorch", "Fast.ai", "Computer Vision", "Fine-Tuning", "HuggingFace", "Gradio"],
    description:
      "Jeremy Howard's world-renowned top-down course. Teaches how to build world-class AI models first, then peels back the mathematics.",
    recommendedGithubRepos: [
      {
        name: "fastai/fastbook",
        repoUrl: "https://github.com/fastai/fastbook",
        stars: "21k ⭐",
        description: "The complete Deep Learning for Coders with Fastai and PyTorch book in Jupyter Notebooks.",
      },
    ],
    relatedProblemCategory: "Dynamic Programming",
  },

  // 43. STATQUEST WITH JOSH STARMER - ML FUNDAMENTALS
  {
    id: "statquest-machine-learning",
    title: "Machine Learning & Neural Networks Fundamentals",
    creator: "StatQuest with Josh Starmer",
    creatorSubscribers: "1.2M+",
    category: "AI_ML",
    subcategory: "Mathematical Intuition & Core ML Algorithms",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF",
    embedPlaylistId: "PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF",
    duration: "25+ Hours",
    totalVideos: 40,
    difficulty: "Beginner to Intermediate",
    certificateTitle: "Certified Machine Learning Theoretical & Mathematical Analyst",
    projectBenchmark: "Implement Linear Regression, Decision Trees, and Gradient Descent from scratch in NumPy.",
    curriculumModules: [
      "Linear Regression, Logistic Regression & ROC/AUC Curves",
      "Decision Trees, Random Forests & Gradient Boosted Trees (XGBoost)",
      "Principal Component Analysis (PCA) & Dimensionality Reduction",
      "Neural Networks: Forward Pass, Cost Functions, and Backpropagation",
      "Support Vector Machines (SVM) & Kernel Methods",
    ],
    skillsLearned: ["Machine Learning", "Mathematics", "Statistics", "PCA", "Random Forest", "XGBoost", "Backprop"],
    description:
      "BAM! Josh Starmer explains complex machine learning and statistics concepts with crystal-clear visual clarity and zero hand-waving.",
    recommendedGithubRepos: [
      {
        name: "rasbt/deeplearning-models",
        repoUrl: "https://github.com/rasbt/deeplearning-models",
        stars: "18k ⭐",
        description: "A collection of various deep learning architectures and ML models implemented in PyTorch.",
      },
    ],
    relatedProblemCategory: "Math & Geometry",
  },

  // 44. DAVE GRAY - NEXT.JS 15 & REST APIS
  {
    id: "dave-gray-nextjs",
    title: "Full-Stack Next.js & Node.js Masterclass",
    creator: "Dave Gray",
    creatorSubscribers: "300K+",
    category: "WEB_DEV",
    subcategory: "Full-Stack React Server Components & APIs",
    youtubeUrl: "https://www.youtube.com/playlist?list=PL0Zuz27SZ-6Pk-QJIdGd1tGZEzy9RTgtj",
    embedPlaylistId: "PL0Zuz27SZ-6Pk-QJIdGd1tGZEzy9RTgtj",
    duration: "25+ Hours",
    totalVideos: 20,
    difficulty: "All Levels",
    certificateTitle: "Certified Full-Stack Next.js Application Developer",
    projectBenchmark: "Build an SEO-optimized blog platform with dynamic routes, ISR (Incremental Static Regeneration), and search API.",
    curriculumModules: [
      "Next.js App Router Architecture: Pages, Layouts & Loading Templates",
      "Server Components (RSC) vs Client Components ('use client')",
      "Data Fetching: SSR, SSG, ISR & Cache Revalidation",
      "Route Handlers: Building Full REST APIs with Zod validation",
      "Authentication with NextAuth.js / Auth.js and secure sessions",
    ],
    skillsLearned: ["Next.js", "React Server Components", "ISR", "REST APIs", "Tailwind CSS", "Auth.js"],
    description:
      "Practical, highly structured walkthrough of the modern Next.js App Router, React Server Components, and full-stack API design.",
    recommendedGithubRepos: [
      {
        name: "gitdagray/next-js-course",
        repoUrl: "https://github.com/gitdagray",
        stars: "4k ⭐",
        description: "Course repository with step-by-step branch commits for Next.js tutorial projects.",
      },
    ],
    relatedProblemCategory: "Arrays & Hashing",
  },

  // 45. NETWORKCHUCK - LINUX & CYBERSECURITY
  {
    id: "networkchuck-linux-hackers",
    title: "Linux for Beginners, Hackers & Cloud Engineers",
    creator: "NetworkChuck",
    creatorSubscribers: "3.5M+",
    category: "CYBERSECURITY",
    subcategory: "Linux Administration, Networking & Ethical Hacking",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLIhvC56v63IJIujb5cyE13oLuyORZpdkL",
    embedPlaylistId: "PLIhvC56v63IJIujb5cyE13oLuyORZpdkL",
    duration: "20+ Hours",
    totalVideos: 25,
    difficulty: "Beginner to Intermediate",
    certificateTitle: "Certified Linux Systems & Security Fundamentals Specialist",
    projectBenchmark: "Harden a Linux server with SSH keys, UFW firewall, fail2ban, and write automated bash maintenance scripts.",
    curriculumModules: [
      "Linux File System Hierarchy, Permissions (chmod/chown), and Sudo",
      "Bash Scripting, Piping, Grep, Sed, and Awk",
      "Networking in Linux: IP routing, Ports, Netcat & SSH Keys",
      "Server Hardening: UFW Firewall, Fail2ban & Process Monitoring (htop)",
      "Ethical Hacking Tools: Nmap, Wireshark & Packet Inspection",
    ],
    skillsLearned: ["Linux", "Bash", "SSH", "UFW Firewall", "Networking", "Nmap", "System Administration"],
    description:
      "High-energy, practical introduction to Linux commands, server administration, and security fundamentals for developers.",
    recommendedGithubRepos: [
      {
        name: "jlevy/the-art-of-command-line",
        repoUrl: "https://github.com/jlevy/the-art-of-command-line",
        stars: "150k ⭐",
        description: "Master the command line in one page. Highly recommended companion guide.",
      },
    ],
    relatedProblemCategory: "Bit Manipulation",
  },
];

export function getCourseChapters(course: CoursePlaylist): VideoChapter[] {
  if (course.videoChapters && course.videoChapters.length > 0) {
    return course.videoChapters;
  }
  const defaultTimestamps = [
    { ts: "00:00", sec: 0 },
    { ts: "06:15", sec: 375 },
    { ts: "15:40", sec: 940 },
    { ts: "27:10", sec: 1630 },
    { ts: "41:25", sec: 2485 },
    { ts: "58:00", sec: 3480 },
  ];
  return (course.curriculumModules || []).map((mod, idx) => {
    const time = defaultTimestamps[idx % defaultTimestamps.length] || {
      ts: `${(idx + 1) * 12}:00`,
      sec: (idx + 1) * 720,
    };
    return {
      timestamp: time.ts,
      seconds: time.sec,
      title: mod.replace(/^Module \d+:\s*/, ""),
      notes: `Core mental model, edge cases, implementation caveats, and production trade-offs for ${mod}.`,
    };
  });
}
