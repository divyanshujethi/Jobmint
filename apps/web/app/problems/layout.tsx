import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "70 Curated Coding Problems — RoleNest Arena",
  description:
    "Master 70 essential Data Structures & Algorithms coding challenges across Arrays, Trees, Dynamic Programming, and Graphs with in-browser compiler execution.",
  alternates: {
    canonical: "https://problem.rolenest.in/problems",
  },
  openGraph: {
    title: "70 Curated Coding Problems — RoleNest Arena",
    description:
      "Practice high-frequency technical interview questions with live in-browser compiler.",
    url: "https://problem.rolenest.in/problems",
    siteName: "RoleNest Coding Arena",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "RoleNest Coding Arena 70 Problems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "70 Curated Coding Problems — RoleNest Arena",
    description: "70 curated coding interview challenges with live sandbox compilation.",
    images: ["/icon-512.png"],
    creator: "@RoleNest",
  },
};

export default function ProblemsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
