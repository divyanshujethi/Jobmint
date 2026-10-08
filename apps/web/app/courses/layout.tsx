import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Curated Courses & Certifications — StudyNest Academy",
  },
  description:
    "Accelerate your engineering journey with structured courses, video walkthroughs, and verifiable certificates from StudyNest Academy.",
  alternates: {
    canonical: "https://study.rolenest.in/courses",
  },
  openGraph: {
    title: "Curated Courses & Certifications — StudyNest Academy",
    description:
      "Accelerate your engineering journey with structured courses, video walkthroughs, and verifiable certificates from StudyNest Academy.",
    url: "https://study.rolenest.in/courses",
    siteName: "StudyNest Academy",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "StudyNest Courses & Certifications",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Curated Courses & Certifications — StudyNest Academy",
    description:
      "Accelerate your engineering journey with structured courses, video walkthroughs, and verifiable certificates from StudyNest Academy.",
    images: ["/icon-512.png"],
    creator: "@RoleNest",
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
