export interface CoursePlaylist {
  id: string;
  title: string;
  creator: string;
  creatorSubscribers: string;
  category: "AI_ML" | "WEB_DEV" | "DSA" | "DEVOPS_CLOUD" | "CYBERSECURITY" | "PYTHON_DATA";
  subcategory: string;
  youtubeUrl: string;
  duration: string;
  totalVideos: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Beginner to Intermediate" | "Beginner to Advanced" | "All Levels";
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
}

export const CURATED_COURSES: CoursePlaylist[] = [
  // 1. AI & MACHINE LEARNING - KARPATHY
  {
    id: "karpathy-nn",
    title: "Neural Networks: Zero to Hero",
    creator: "Andrej Karpathy",
    creatorSubscribers: "680K+",
    category: "AI_ML",
    subcategory: "Deep Learning & Transformer Architectures",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
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
  },

  // 2. GENERATIVE AI - KRISH NAIK
  {
    id: "krish-genai",
    title: "Complete Generative AI & LangChain Playlist",
    creator: "Krish Naik",
    creatorSubscribers: "1M+",
    category: "AI_ML",
    subcategory: "Generative AI & LLMs",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLZoTAELRMXVORE4VDCg1h34W889kCgnQU",
    duration: "35+ Hours",
    totalVideos: 42,
    difficulty: "Beginner to Intermediate",
    certificateTitle: "Certified Generative AI & LLM Systems Engineer",
    projectBenchmark: "Build an end-to-end Retrieval-Augmented Generation (RAG) agent using LangChain, Vector DB & Open-Weights LLM.",
    curriculumModules: [
      "Foundations of LLMs, Prompt Engineering & Tokenomics",
      "LangChain Architecture, Chains, Memory & Tools",
      "Vector Embeddings, ChromaDB, FAISS & Hybrid Search",
      "Production Multi-Document RAG Application Deployment",
    ],
    skillsLearned: ["OpenAI API", "Hugging Face", "LangChain", "Llama 3", "Vector Databases (Chroma/FAISS)", "RAG Systems"],
    description:
      "End-to-end practical Generative AI roadmap covering RAG pipelines, agents, fine-tuning open-weights models, and deploying production conversational AI apps.",
    recommendedGithubRepos: [
      {
        name: "langchain-ai/langchain",
        repoUrl: "https://github.com/langchain-ai/langchain",
        stars: "96k ⭐",
        description: "Building applications with LLMs through composability and RAG pipelines.",
      },
      {
        name: "vllm-project/vllm",
        repoUrl: "https://github.com/vllm-project/vllm",
        stars: "32k ⭐",
        description: "A high-throughput and memory-efficient inference and serving engine for LLMs.",
      },
    ],
  },

  // 3. 3BLUE1BROWN - MATHEMATICAL FOUNDATIONS
  {
    id: "3b1b-dl",
    title: "Essence of Neural Networks & Calculus",
    creator: "3Blue1Brown (Grant Sanderson)",
    creatorSubscribers: "6.2M+",
    category: "AI_ML",
    subcategory: "Mathematical Foundations",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi",
    duration: "4 Hours",
    totalVideos: 5,
    difficulty: "Beginner",
    certificateTitle: "Certified Neural Network Mathematical Foundations Specialist",
    projectBenchmark: "Implement forward pass and gradient descent optimization from raw mathematical matrices without libraries.",
    curriculumModules: [
      "What is a Neural Network and what are weights and biases?",
      "Gradient Descent and Loss Surface Geometry",
      "What is Backpropagation really doing?",
      "Matrix Calculus of the Backpropagation Algorithm",
    ],
    skillsLearned: ["Gradient Descent", "Loss Functions", "Matrix Transformations", "Backpropagation Intuition"],
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

  // 4. FULL-STACK WEB - HITESH CHOUDHARY
  {
    id: "hitesh-chai-fullstack",
    title: "Chai aur Full Stack Next.js & Node.js",
    creator: "Hitesh Choudhary (Chai aur Code)",
    creatorSubscribers: "1.2M+",
    category: "WEB_DEV",
    subcategory: "Full-Stack React & Next.js",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLu71SKxNbfoBAaWGtn9GA2PTw0HO0tXzq",
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
    skillsLearned: ["React 19", "Next.js App Router", "Server Actions", "PostgreSQL", "Prisma/Drizzle", "Auth.js"],
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
  },

  // 5. TRAVERSY MEDIA - FULL STACK CRASH COURSES
  {
    id: "traversy-modern-web",
    title: "Traversy Media Full-Stack Crash Courses",
    creator: "Traversy Media (Brad Traversy)",
    creatorSubscribers: "2.2M+",
    category: "WEB_DEV",
    subcategory: "Modern Web Foundations & APIs",
    youtubeUrl: "https://www.youtube.com/@TraversyMedia/playlists",
    duration: "40+ Hours",
    totalVideos: 25,
    difficulty: "Beginner",
    certificateTitle: "Certified Modern Web Architecture & REST API Engineer",
    projectBenchmark: "Build and document a production-ready REST API with Express/Node and connect it to a responsive frontend UI.",
    curriculumModules: [
      "Modern JavaScript ES6+ & Async/Await Deep Dive",
      "RESTful API Design & Express Middleware Architecture",
      "Database Modeling, Validation & Error Handling",
      "Deployment with Docker Containers and Environment Management",
    ],
    skillsLearned: ["Modern JavaScript", "REST APIs", "Node.js", "Express", "Docker for Web Developers"],
    description:
      "Crystal-clear, no-nonsense practical project tutorials by veteran educator Brad Traversy. Learn how real backends and frontends glue together.",
    recommendedGithubRepos: [
      {
        name: "goldbergyoni/nodebestpractices",
        repoUrl: "https://github.com/goldbergyoni/nodebestpractices",
        stars: "98k ⭐",
        description: "The largest compilation of Node.js best practices, security guidelines, and architectural rules.",
      },
    ],
  },

  // 6. STRIVER - A2Z DSA
  {
    id: "striver-a2z-dsa",
    title: "A2Z DSA Course & Sheet",
    creator: "Striver (takeUforward)",
    creatorSubscribers: "800K+",
    category: "DSA",
    subcategory: "Complete Coding Interview Prep",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
    duration: "80+ Hours",
    totalVideos: 120,
    difficulty: "Beginner to Advanced",
    certificateTitle: "Certified Algorithmic Problem Solving & Data Structures Specialist",
    projectBenchmark: "Solve and document optimal solutions for 50+ core algorithmic patterns including DP, Graphs, and Trees.",
    curriculumModules: [
      "Arrays, Hashing, Two Pointers & Sliding Window",
      "Binary Search & Recursion Backtracking Paradigms",
      "Binary Trees, BSTs & Disjoint Set Union Graphs",
      "Dynamic Programming (1D, 2D, Grids, Subsequences, MCM)",
    ],
    skillsLearned: ["Arrays", "Sliding Window", "Trees & Graphs", "Dynamic Programming", "Bit Manipulation", "Recursion"],
    description:
      "The #1 coding interview preparation syllabus for Indian and global tech placements (FAANG/MAANG, Unicorns). Step-by-step intuition, brute to optimal approaches.",
    recommendedGithubRepos: [
      {
        name: "kamyu104/LeetCode-Solutions",
        repoUrl: "https://github.com/kamyu104/LeetCode-Solutions",
        stars: "45k ⭐",
        description: "Python and C++ clean optimal solutions to all LeetCode algorithm problems.",
      },
      {
        name: "jwasham/coding-interview-university",
        repoUrl: "https://github.com/jwasham/coding-interview-university",
        stars: "310k ⭐",
        description: "A complete multi-month study plan to become a software engineer for large tech companies.",
      },
    ],
  },

  // 7. NEETCODE - BLIND 75
  {
    id: "neetcode-blind75",
    title: "NeetCode Blind 75 / Roadmap Playlist",
    creator: "NeetCode",
    creatorSubscribers: "850K+",
    category: "DSA",
    subcategory: "Pattern Recognition & LeetCode",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf",
    duration: "30+ Hours",
    totalVideos: 75,
    difficulty: "Intermediate",
    certificateTitle: "Certified Technical Interview Algorithmic Master",
    projectBenchmark: "Pass the Blind 75 Pattern Assessment with optimal space/time complexity explanations.",
    curriculumModules: [
      "Blind 75 Core Arrays & String Inversion Techniques",
      "Linked List Reversal, Fast/Slow Pointers & Cycle Detection",
      "Depth-First Search (DFS) & Breadth-First Search (BFS) on Graphs",
      "Intervals, Greedy Algorithms & Dynamic Programming Memorization",
    ],
    skillsLearned: ["Two Pointers", "Binary Search", "Heap / Priority Queue", "Trie", "Backtracking", "Graph DFS/BFS"],
    description:
      "Taught by an ex-Google software engineer. Visual whiteboard code walkthroughs categorizing interview questions by fundamental algorithmic patterns.",
    recommendedGithubRepos: [
      {
        name: "donnemartin/system-design-primer",
        repoUrl: "https://github.com/donnemartin/system-design-primer",
        stars: "275k ⭐",
        description: "Learn how to design large-scale systems and prepare for the system design interview.",
      },
    ],
  },

  // 8. TECHWORLD WITH NANA - DEVOPS
  {
    id: "nana-devops-bootcamp",
    title: "DevOps Full Course & Kubernetes Mastery",
    creator: "TechWorld with Nana",
    creatorSubscribers: "1.1M+",
    category: "DEVOPS_CLOUD",
    subcategory: "Containers & Orchestration",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLy7NrLnytVU7YfU7pX9K_n2ZzG_Jq76K_",
    duration: "24+ Hours",
    totalVideos: 18,
    difficulty: "Beginner to Intermediate",
    certificateTitle: "Certified Cloud Native DevOps & Kubernetes Associate",
    projectBenchmark: "Containerize a multi-tier microservice with Docker and configure a Kubernetes deployment with Ingress and ConfigMaps.",
    curriculumModules: [
      "Docker Architecture, Multi-Stage Builds & Volume Management",
      "Kubernetes Pods, Deployments, Services & Ingress Controllers",
      "Automated CI/CD Pipelines with GitHub Actions & Webhooks",
      "Monitoring & Metrics Gathering with Prometheus and Grafana",
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

  // 9. NETWORKCHUCK - LINUX & NETWORKING
  {
    id: "networkchuck-linux",
    title: "Linux for Hackers & Cloud Engineers",
    creator: "NetworkChuck",
    creatorSubscribers: "3.5M+",
    category: "DEVOPS_CLOUD",
    subcategory: "Linux CLI & Networking",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLS1QulWo1RIZqA0q9XQoVb1vG2rB_x6qC",
    duration: "15+ Hours",
    totalVideos: 15,
    difficulty: "Beginner",
    certificateTitle: "Certified Linux Systems & Server Security Practitioner",
    projectBenchmark: "Deploy and secure a headless Linux server with SSH key-only access, UFW firewall, and automated Bash maintenance cron scripts.",
    curriculumModules: [
      "Linux Filesystem Hierarchy, Permissions (chmod/chown) & Sudoers",
      "SSH Key Pairs, Hardened Configurations & Port Forwarding",
      "Bash Scripting Automation & Environment Variables",
      "Network Routing, DNS, Netcat & Packet Inspection",
    ],
    skillsLearned: ["Bash Scripting", "SSH Keys", "Permissions (chmod/chown)", "Networking (DNS/TCP)", "Firewalls (ufw)"],
    description:
      "Energetic, engaging terminal mastery for developers. Learn the core Linux command line skills needed for cloud computing, AWS, and server management.",
    recommendedGithubRepos: [
      {
        name: "awesome-selfhosted/awesome-selfhosted",
        repoUrl: "https://github.com/awesome-selfhosted/awesome-selfhosted",
        stars: "215k ⭐",
        description: "A list of Free Software network services and web applications which can be hosted locally on Linux servers.",
      },
    ],
  },

  // 10. ANGELA YU - PYTHON
  {
    id: "angela-python",
    title: "100 Days of Code: Complete Python Pro Mastery",
    creator: "Dr. Angela Yu (London App Brewery)",
    creatorSubscribers: "700K+",
    category: "PYTHON_DATA",
    subcategory: "Python Programming & Automation",
    youtubeUrl: "https://www.youtube.com/@TheAppBrewery/playlists",
    duration: "55+ Hours",
    totalVideos: 60,
    difficulty: "Beginner to Intermediate",
    certificateTitle: "Certified Python Applications & Automation Specialist",
    projectBenchmark: "Develop a Python web scraper and data visualization pipeline with Pandas and Matplotlib.",
    curriculumModules: [
      "Python Core Syntax, Object-Oriented Programming (OOP) & Error Handling",
      "Web Scraping with BeautifulSoup & Automated Selenium Bots",
      "Data Analysis & Visualization with Pandas and NumPy",
      "Building RESTful APIs with Flask and FastAPI",
    ],
    skillsLearned: ["Python 3", "OOP", "Pandas", "NumPy", "Web Scraping", "FastAPI"],
    description:
      "The premier interactive project-driven Python syllabus. Master Python from scratch by building automation scripts, APIs, and data analysis tools.",
    recommendedGithubRepos: [
      {
        name: "vinta/awesome-python",
        repoUrl: "https://github.com/vinta/awesome-python",
        stars: "230k ⭐",
        description: "A curated list of awesome Python frameworks, libraries, software and resources.",
      },
    ],
  },
];
