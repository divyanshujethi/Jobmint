/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/shared", "@repo/database"],
  experimental: {},
};

export default nextConfig;
