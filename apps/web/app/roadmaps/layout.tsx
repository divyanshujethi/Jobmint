import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Engineering Roadmaps — StudyNest Academy",
  },
  description:
    "Interactive developer career roadmaps, step-by-step skill trees, and milestones from junior to staff engineer.",
  alternates: {
    canonical: "https://study.rolenest.in/roadmaps",
  },
  openGraph: {
    title: "Engineering Roadmaps — StudyNest Academy",
    description:
      "Interactive developer career roadmaps, step-by-step skill trees, and milestones from junior to staff engineer.",
    url: "https://study.rolenest.in/roadmaps",
    siteName: "StudyNest Academy",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "StudyNest Engineering Roadmaps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Roadmaps — StudyNest Academy",
    description:
      "Interactive developer career roadmaps, step-by-step skill trees, and milestones from junior to staff engineer.",
    images: ["/icon-512.png"],
    creator: "@RoleNest",
  },
};

export default function RoadmapsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
