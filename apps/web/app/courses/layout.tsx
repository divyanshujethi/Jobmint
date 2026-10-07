import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curated Courses & Certifications — StudyNest Academy",
  description:
    "Accelerate your engineering journey with structured courses, video walkthroughs, and verifiable certificates from StudyNest Academy.",
  openGraph: {
    title: "Curated Courses & Certifications — StudyNest Academy",
    description:
      "Accelerate your engineering journey with structured courses, video walkthroughs, and verifiable certificates from StudyNest Academy.",
    siteName: "StudyNest Academy",
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
