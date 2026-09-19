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

export interface CareerRoadmap {
  slug: string;
  title: string;
  shortDescription: string;
  category: "AI & ML" | "Web Development" | "Data Science" | "Mobile";
  durationWeeks: string;
  level: "Beginner to Pro" | "Intermediate";
  keySkills: string[];
  phases: RoadmapPhase[];
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
