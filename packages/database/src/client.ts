import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

import * as fs from "fs";
import * as path from "path";

if (!process.env.DATABASE_URL) {
  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../../.env"),
    path.resolve(__dirname, "../../../.env"),
    path.resolve(__dirname, "../../.env"),
    "/opt/jobmint/app/.env",
  ];
  for (const envFile of candidates) {
    try {
      if (fs.existsSync(envFile)) {
        const content = fs.readFileSync(envFile, "utf-8");
        const match = content.match(/^DATABASE_URL\s*=\s*["']?([^"'\r\n]+)["']?/m);
        if (match && match[1]) {
          process.env.DATABASE_URL = match[1].trim();
          break;
        }
      }
    } catch {}
  }
}

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/jobmint";

// Connection with connection pool configuration
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
export type Database = typeof db;
