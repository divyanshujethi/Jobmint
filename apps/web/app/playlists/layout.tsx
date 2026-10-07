import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masterclasses & Playlists — StudyNest Academy",
  description:
    "Curated deep-dive masterclasses, verified university lectures, and chapter-by-chapter system walkthroughs.",
  openGraph: {
    title: "Masterclasses & Playlists — StudyNest Academy",
    description:
      "Curated deep-dive masterclasses, verified university lectures, and chapter-by-chapter system walkthroughs.",
    siteName: "StudyNest Academy",
  },
};

export default function PlaylistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
