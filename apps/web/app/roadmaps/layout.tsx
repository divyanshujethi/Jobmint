import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Roadmaps — StudyNest Academy",
  description:
    "Interactive developer career roadmaps, step-by-step skill trees, and milestones from junior to staff engineer.",
  openGraph: {
    title: "Engineering Roadmaps — StudyNest Academy",
    description:
      "Interactive developer career roadmaps, step-by-step skill trees, and milestones from junior to staff engineer.",
    siteName: "StudyNest Academy",
  },
};

export default function RoadmapsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
