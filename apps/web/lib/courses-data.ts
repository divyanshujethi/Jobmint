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
];
