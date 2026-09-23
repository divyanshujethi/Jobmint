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

export default nextConfig;
