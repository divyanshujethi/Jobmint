import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Visual Skill Canvas — StudyNest Academy",
  },
  description:
    "Interactive node-based skill canvases. Master backend architecture, AI & LLM systems, fullstack engineering, and cloud DevOps step-by-step.",
  openGraph: {
    title: "Visual Skill Canvas — StudyNest Academy",
    description:
      "Interactive node-based skill canvases. Master backend architecture, AI & LLM systems, fullstack engineering, and cloud DevOps step-by-step.",
    siteName: "StudyNest Academy",
  },
};

export default function CanvasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
