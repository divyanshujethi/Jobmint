import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "StudyNest Academy — Interactive Roadmaps, Skill Canvas & Cohorts",
  },
  description:
    "Accelerate your engineering journey with StudyNest Academy. Interactive visual skill trees, structured 30-day syllabi, and peer study cohorts.",
  alternates: {
    canonical: "https://study.rolenest.in",
  },
  openGraph: {
    title: "StudyNest Academy — Interactive Roadmaps & Visual Skill Trees",
    description:
      "Master high-paying tech skills with node-based skill canvases, curated roadmaps, and collaborative study pods.",
    url: "https://study.rolenest.in",
    siteName: "StudyNest Academy",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "StudyNest Academy Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyNest Academy — Interactive Roadmaps, Skill Canvas & Cohorts",
    description:
      "Master high-paying tech skills with node-based skill canvases, curated roadmaps, and collaborative study pods.",
    images: ["/icon-512.png"],
    creator: "@RoleNest",
  },
};

export default function StudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
