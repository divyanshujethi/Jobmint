import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@repo/shared",
    "@repo/database",
    "@repo/ai",
    "@repo/alligators",
    "@repo/matching",
    "@repo/storage",
    "@repo/email",
  ],
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
