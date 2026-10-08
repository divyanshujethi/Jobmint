import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Visual Skill Canvas — StudyNest Academy",
  },
  description:
    "Interactive node-based skill canvases. Master backend architecture, AI & LLM systems, fullstack engineering, and cloud DevOps step-by-step.",
  alternates: {
    canonical: "https://study.rolenest.in/canvas",
  },
  openGraph: {
    title: "Visual Skill Canvas — StudyNest Academy",
    description:
      "Interactive node-based skill canvases. Master backend architecture, AI & LLM systems, fullstack engineering, and cloud DevOps step-by-step.",
    url: "https://study.rolenest.in/canvas",
    siteName: "StudyNest Academy",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "StudyNest Visual Skill Canvas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Visual Skill Canvas — StudyNest Academy",
    description:
      "Interactive node-based skill canvases. Master backend architecture, AI & LLM systems, fullstack engineering, and cloud DevOps step-by-step.",
    images: ["/icon-512.png"],
    creator: "@RoleNest",
  },
};

export default function CanvasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
