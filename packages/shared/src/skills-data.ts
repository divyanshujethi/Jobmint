export interface CanonicalSkill {
  id: string;
  name: string;
  slug: string;
  category: "Frontend" | "Backend" | "AI & Data" | "Mobile" | "DevOps & Cloud" | "Design" | "Core CS";
  aliases: string[];
}

export const CANONICAL_SKILLS: CanonicalSkill[] = [
  // Frontend
  { id: "s-react", name: "React", slug: "react", category: "Frontend", aliases: ["reactjs", "react.js", "react js"] },
  { id: "s-nextjs", name: "Next.js", slug: "nextjs", category: "Frontend", aliases: ["next", "next.js", "nextjs 14", "nextjs 15"] },
  { id: "s-typescript", name: "TypeScript", slug: "typescript", category: "Frontend", aliases: ["ts"] },
  { id: "s-javascript", name: "JavaScript", slug: "javascript", category: "Frontend", aliases: ["js", "es6"] },
  { id: "s-tailwind", name: "Tailwind CSS", slug: "tailwind", category: "Frontend", aliases: ["tailwind", "tailwindcss"] },
  { id: "s-html-css", name: "HTML & CSS", slug: "html-css", category: "Frontend", aliases: ["html", "css", "html5", "css3"] },
  { id: "s-vue", name: "Vue.js", slug: "vue", category: "Frontend", aliases: ["vue", "vuejs", "vue.js"] },

  // AI & Data
  { id: "s-python", name: "Python", slug: "python", category: "AI & Data", aliases: ["python3", "py"] },
  { id: "s-pytorch", name: "PyTorch", slug: "pytorch", category: "AI & Data", aliases: ["torch", "py-torch"] },
  { id: "s-tensorflow", name: "TensorFlow", slug: "tensorflow", category: "AI & Data", aliases: ["tf", "keras"] },
  { id: "s-huggingface", name: "Hugging Face", slug: "huggingface", category: "AI & Data", aliases: ["transformers", "diffusers"] },
  { id: "s-langchain", name: "LangChain", slug: "langchain", category: "AI & Data", aliases: ["langchain", "llamaindex", "rag"] },
  { id: "s-vectordb", name: "Vector Databases", slug: "vectordb", category: "AI & Data", aliases: ["pinecone", "chromadb", "qdrant", "weaviate"] },
  { id: "s-pandas", name: "Pandas & NumPy", slug: "pandas-numpy", category: "AI & Data", aliases: ["pandas", "numpy", "scipy"] },
  { id: "s-machine-learning", name: "Machine Learning", slug: "machine-learning", category: "AI & Data", aliases: ["ml", "scikit-learn", "sklearn"] },
  { id: "s-nlp", name: "Natural Language Processing", slug: "nlp", category: "AI & Data", aliases: ["nlp", "llms", "large language models"] },

  // Backend
  { id: "s-nodejs", name: "Node.js", slug: "nodejs", category: "Backend", aliases: ["node", "node.js", "nodejs"] },
  { id: "s-express", name: "Express.js", slug: "express", category: "Backend", aliases: ["express", "expressjs"] },
  { id: "s-fastapi", name: "FastAPI", slug: "fastapi", category: "Backend", aliases: ["fastapi", "fast-api"] },
  { id: "s-postgresql", name: "PostgreSQL", slug: "postgresql", category: "Backend", aliases: ["postgres", "pgsql", "psql"] },
  { id: "s-sql", name: "SQL", slug: "sql", category: "Backend", aliases: ["relational database", "mysql"] },
  { id: "s-mongodb", name: "MongoDB", slug: "mongodb", category: "Backend", aliases: ["mongo", "nosql"] },
  { id: "s-redis", name: "Redis", slug: "redis", category: "Backend", aliases: ["caching", "in-memory"] },
  { id: "s-graphql", name: "GraphQL", slug: "graphql", category: "Backend", aliases: ["gql"] },

  // Mobile
  { id: "s-react-native", name: "React Native", slug: "react-native", category: "Mobile", aliases: ["rn", "expo"] },
  { id: "s-flutter", name: "Flutter", slug: "flutter", category: "Mobile", aliases: ["dart"] },
  { id: "s-android", name: "Android (Kotlin)", slug: "android-kotlin", category: "Mobile", aliases: ["kotlin", "android dev"] },

  // DevOps & Cloud
  { id: "s-docker", name: "Docker", slug: "docker", category: "DevOps & Cloud", aliases: ["containerization", "containers"] },
  { id: "s-git", name: "Git & GitHub", slug: "git", category: "DevOps & Cloud", aliases: ["git", "github", "version control"] },
  { id: "s-linux", name: "Linux & Bash", slug: "linux-bash", category: "DevOps & Cloud", aliases: ["linux", "bash", "shell"] },
  { id: "s-aws", name: "AWS", slug: "aws", category: "DevOps & Cloud", aliases: ["amazon web services", "ec2", "s3"] },
  { id: "s-cloudflare", name: "Cloudflare", slug: "cloudflare", category: "DevOps & Cloud", aliases: ["cloudflare workers", "r2", "pages"] },

  // Design
  { id: "s-figma", name: "Figma", slug: "figma", category: "Design", aliases: ["ui design", "ux design", "wireframing"] },

  // Core CS
  { id: "s-dsa", name: "Data Structures & Algorithms", slug: "dsa", category: "Core CS", aliases: ["dsa", "leetcode", "problem solving"] },
  { id: "s-system-design", name: "System Design", slug: "system-design", category: "Core CS", aliases: ["distributed systems", "architecture"] },
];

/**
 * Normalizes any freeform user or job skill text into a CanonicalSkill
 */
export function normalizeSkill(input: string): CanonicalSkill | null {
  if (!input) return null;
  const clean = input.trim().toLowerCase();

  for (const skill of CANONICAL_SKILLS) {
    if (skill.slug === clean || skill.name.toLowerCase() === clean) {
      return skill;
    }
    if (skill.aliases.some((alias) => alias.toLowerCase() === clean)) {
      return skill;
    }
  }

  return null;
}

/**
 * Find canonical skill by ID or Slug
 */
export function getSkillBySlugOrId(identifier: string): CanonicalSkill | null {
  return (
    CANONICAL_SKILLS.find(
      (s) => s.id === identifier || s.slug === identifier.toLowerCase()
    ) || null
  );
}
