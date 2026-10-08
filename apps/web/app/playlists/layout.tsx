import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Masterclasses & Playlists — StudyNest Academy",
  },
  description:
    "Curated deep-dive masterclasses, verified university lectures, and chapter-by-chapter system walkthroughs.",
  alternates: {
    canonical: "https://study.rolenest.in/playlists",
  },
  openGraph: {
    title: "Masterclasses & Playlists — StudyNest Academy",
    description:
      "Curated deep-dive masterclasses, verified university lectures, and chapter-by-chapter system walkthroughs.",
    url: "https://study.rolenest.in/playlists",
    siteName: "StudyNest Academy",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "StudyNest Masterclasses & Playlists",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Masterclasses & Playlists — StudyNest Academy",
    description:
      "Curated deep-dive masterclasses, verified university lectures, and chapter-by-chapter system walkthroughs.",
    images: ["/icon-512.png"],
    creator: "@RoleNest",
  },
};

export default function PlaylistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
