import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Problem of the Day — ProblemNest Arena",
  description:
    "Solve the daily coding challenge on ProblemNest Arena. Real-time multi-language sandbox runner (Python, TypeScript, C++, Java), automated test cases, and company interview tracking.",
  alternates: {
    canonical: "https://problem.rolenest.in/potd",
  },
  openGraph: {
    title: "Problem of the Day — ProblemNest Arena",
    description:
      "Solve curated daily algorithmic problems with instant multi-language execution, automated test runner, and company interview insights.",
    url: "https://problem.rolenest.in/potd",
    siteName: "ProblemNest Arena",
    type: "website",
    images: [
      {
        url: "https://problem.rolenest.in/icon-512.png",
        width: 512,
        height: 512,
        alt: "ProblemNest Coding Arena Problem of the Day",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Problem of the Day — ProblemNest Arena",
    description:
      "Daily coding problems with multi-language execution, instant test verdicts, and company interview tagging.",
    images: ["https://problem.rolenest.in/icon-512.png"],
    creator: "@RoleNest",
  },
};

export default function PotdLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
