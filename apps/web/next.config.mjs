import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "rolenest.in",
      },
    ],
  },
  transpilePackages: [
    "@repo/shared",
    "@repo/database",
    "@repo/ai",
    "@repo/alligators",
    "@repo/matching",
    "@repo/storage",
    "@repo/email",
  ],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://cdn.jsdelivr.net https://sdk.cashfree.com https://challenges.cloudflare.com",
              "worker-src blob: 'self'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https: https://avatars.githubusercontent.com https://images.unsplash.com https://lh3.googleusercontent.com https://rolenest.in https://www.google.com https://*.cashfree.com https://cashfreelogo.cashfree.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "connect-src 'self' https://api.cashfree.com https://sandbox.cashfree.com https://*.cashfree.com https://payments.cashfree.com https://*.sentry.io https://rolenest.in https://api.github.com https://cdn.jsdelivr.net blob:",
              "frame-src 'self' https://sdk.cashfree.com https://api.cashfree.com https://sandbox.cashfree.com https://*.cashfree.com https://payments.cashfree.com https://www.youtube-nocookie.com https://www.youtube.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://api.cashfree.com https://sandbox.cashfree.com https://*.cashfree.com https://payments.cashfree.com https://payments-test.cashfree.com",
            ].join("; "),
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },
  experimental: {},
};

export default withSentryConfig(nextConfig, {
  org: "ritualdev",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
});
