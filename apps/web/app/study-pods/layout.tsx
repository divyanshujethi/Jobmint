import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Study Pods & Cohorts — StudyNest Academy",
  },
  description:
    "Join focused peer cohorts, solve daily engineering challenges, and stay accountable with StudyNest Cohorts.",
  alternates: {
    canonical: "https://study.rolenest.in/study-pods",
  },
  openGraph: {
    title: "Study Pods & Cohorts — StudyNest Academy",
    description:
      "Join focused peer cohorts, solve daily engineering challenges, and stay accountable with StudyNest Cohorts.",
    url: "https://study.rolenest.in/study-pods",
    siteName: "StudyNest Academy",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "StudyNest Cohorts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Pods & Cohorts — StudyNest Academy",
    description:
      "Join focused peer cohorts, solve daily engineering challenges, and stay accountable with StudyNest Cohorts.",
    images: ["/icon-512.png"],
    creator: "@RoleNest",
  },
};

export default function StudyPodsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
