import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study Pods & Cohorts — StudyNest Academy",
  description:
    "Join focused peer cohorts, solve daily engineering challenges, and stay accountable with StudyNest Cohorts.",
  openGraph: {
    title: "Study Pods & Cohorts — StudyNest Academy",
    description:
      "Join focused peer cohorts, solve daily engineering challenges, and stay accountable with StudyNest Cohorts.",
    siteName: "StudyNest Academy",
  },
};

export default function StudyPodsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
