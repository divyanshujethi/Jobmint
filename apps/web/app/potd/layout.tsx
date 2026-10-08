import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Problem of the Day — RoleNest Coding Arena",
  description:
    "Solve the daily coding challenge on RoleNest ProblemNest. Real-time multi-language sandbox runner (Python, TypeScript, C++, Java), automated test cases, and company interview tracking.",
  alternates: {
    canonical: "https://problem.rolenest.in/potd",
  },
  openGraph: {
    title: "Problem of the Day — RoleNest Coding Arena",
    description:
      "Solve curated daily algorithmic problems with instant multi-language execution, automated test runner, and company interview insights.",
    url: "https://problem.rolenest.in/potd",
    siteName: "RoleNest Coding Arena",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "RoleNest Coding Arena Problem of the Day",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Problem of the Day — RoleNest Coding Arena",
    description:
      "Daily coding problems with multi-language execution, instant test verdicts, and company interview tagging.",
    images: ["/icon-512.png"],
    creator: "@RoleNest",
  },
};

export default function PotdLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
