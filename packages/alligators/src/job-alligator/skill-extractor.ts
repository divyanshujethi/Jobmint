import { CANONICAL_SKILLS } from "@repo/shared";

export function extractCanonicalSkills(text: string): string[] {
  const normalized = text.toLowerCase();
  const matched = new Set<string>();

  for (const skill of CANONICAL_SKILLS) {
    if (normalized.includes(skill.name.toLowerCase())) {
      matched.add(skill.name);
    }
  }

  const supplements: Record<string, string> = {
    nextjs: "Next.js",
    reactjs: "React",
    nodejs: "Node.js",
    golang: "Go",
    postgres: "PostgreSQL",
    k8s: "Kubernetes",
    llm: "Generative AI",
    rag: "Vector Databases",
    ollama: "Local LLM",
    pytorch: "PyTorch",
  };

  for (const [alias, canonical] of Object.entries(supplements)) {
    if (normalized.includes(alias)) {
      matched.add(canonical);
    }
  }

  return Array.from(matched);
}
