import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import { APP_CONFIG } from "@repo/shared";

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: `${APP_CONFIG.name} — Job & Internship Platform`,
  description: APP_CONFIG.tagline,
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col font-sans antialiased bg-slate-50/50 text-slate-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
