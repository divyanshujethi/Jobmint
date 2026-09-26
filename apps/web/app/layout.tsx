import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import { DPDPConsentManager } from "@/components/dpdp-consent-manager";
import { PaddleProvider } from "@/components/paddle-provider";
import { MobileNav } from "@/components/mobile-nav";
import { APP_CONFIG } from "@repo/shared";

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://rolenest.in"),
  title: {
    default: "Role Nest — Tech Jobs, Internships & Truth Teller Telemetry",
    template: `%s | ${APP_CONFIG.name}`,
  },
  description:
    "Role Nest is the transparent tech careers platform. Explore verified software engineer jobs, high-stipend internships, interactive coding challenges, and honest Truth Teller hiring telemetry.",
  applicationName: "Role Nest",
  keywords: [
    "tech jobs",
    "software engineer internships",
    "fresher developer jobs",
    "remote tech jobs India",
    "verified tech hiring",
    "truth teller application tracker",
    "coding challenges",
    "leetcode alternative",
    "problem of the day",
    "college placement portal",
    "AI engineer jobs",
    "full stack developer careers",
  ],
  authors: [{ name: "Role Nest Team", url: "https://rolenest.in" }],
  creator: "Role Nest",
  publisher: "Role Nest",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Role Nest",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rolenest.in",
    siteName: "Role Nest",
    title: "Role Nest — Tech Jobs, Internships & Truth Teller Telemetry",
    description:
      "Explore verified software engineer jobs, high-stipend internships, and real-time Truth Teller hiring telemetry with zero ghosting.",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Role Nest Tech Careers Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Role Nest — Tech Jobs, Internships & Truth Teller Telemetry",
    description:
      "Explore verified developer jobs, high-stipend tech internships, and real-time Truth Teller application telemetry.",
    images: ["/icon-512.png"],
    creator: "@RoleNest",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://rolenest.in",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://rolenest.in/#organization",
      name: "Role Nest",
      url: "https://rolenest.in",
      logo: "https://rolenest.in/icon-512.png",
      description:
        "Truth Teller-powered tech career platform with verified developer jobs, high-stipend internships, and skill certification.",
      sameAs: [
        "https://twitter.com/RoleNest",
        "https://linkedin.com/company/rolenest",
        "https://github.com/RoleNest",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@rolenest.in",
        contactType: "customer support",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://rolenest.in/#website",
      url: "https://rolenest.in",
      name: "Role Nest",
      description:
        "Find verified software engineering, AI, DevOps, and frontend developer jobs with transparent telemetry.",
      publisher: {
        "@id": "https://rolenest.in/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://rolenest.in/jobs?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col font-sans antialiased bg-slate-50/50 text-slate-900">
        <PaddleProvider />
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileNav />
        <PwaInstallPrompt />
        <DPDPConsentManager />
      </body>
    </html>
  );
}
