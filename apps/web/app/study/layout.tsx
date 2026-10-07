import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StudyNest Academy — Interactive Roadmaps, Skill Canvas & Cohorts",
  description:
    "Accelerate your engineering journey with StudyNest Academy. Interactive visual skill trees, structured 30-day syllabi, and peer study cohorts.",
  openGraph: {
    title: "StudyNest Academy — Interactive Roadmaps & Visual Skill Trees",
    description:
      "Master high-paying tech skills with node-based skill canvases, curated roadmaps, and collaborative study pods.",
    siteName: "StudyNest Academy",
  },
};

export default function StudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
