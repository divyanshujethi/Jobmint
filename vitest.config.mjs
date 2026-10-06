import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**", "**/.venv/**"],
  },
  resolve: {
    alias: {
      "@repo/matching": path.resolve(import.meta.dirname, "./packages/matching/src"),
      "@repo/alligators": path.resolve(import.meta.dirname, "./packages/alligators/src"),
      "@repo/shared": path.resolve(import.meta.dirname, "./packages/shared/src"),
      "@repo/database": path.resolve(import.meta.dirname, "./packages/database/src"),
      "@repo/storage": path.resolve(import.meta.dirname, "./packages/storage/src"),
      "@": path.resolve(import.meta.dirname, "./apps/web"),
    },
  },
});
