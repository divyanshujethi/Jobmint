/**
 * RoleNest Autonomous Study & Engineering Curriculum Crawler Daemon
 * Periodically crawls:
 * 1. Engineering Career Roadmaps (Refreshes curriculum, verifies live resources)
 * 2. Top-tier YouTube Video Courses & Masterclasses
 *
 * Runs every 7 days (or configurable interval) with auto-restart via PM2.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Auto-load root .env or apps/web/.env if CRON_SECRET is not yet in process.env
if (!process.env.CRON_SECRET) {
  for (const envRel of ["../apps/web/.env", "../.env"]) {
    const envFile = path.resolve(__dirname, envRel);
    if (fs.existsSync(envFile)) {
      const lines = fs.readFileSync(envFile, "utf-8").split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const [k, ...v] = trimmed.split("=");
          if (k && v && !process.env[k.trim()]) {
            process.env[k.trim()] = v.join("=").trim().replace(/^["']|["']$/g, "");
          }
        }
      }
    }
  }
}

const INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // Crawl every 7 days (weekly)
const LOCAL_WEB_BASE = process.env.WEB_BASE_URL || "http://localhost:3000";
const CRON_SECRET = process.env.CRON_SECRET || "";

async function executeStudyCrawl() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [StudyCrawlerDaemon] Starting scheduled study curriculum & YouTube crawl cycle...`);

  try {
    const url = `${LOCAL_WEB_BASE}/api/cron/study-crawler?type=all&verify=true&limit=8`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CRON_SECRET}`,
      },
    });

    if (!res.ok) {
      console.error(`[${new Date().toISOString()}] [StudyCrawlerDaemon] HTTP error ${res.status}: ${res.statusText}`);
      return;
    }

    const data = await res.json();
    if (data.success && data.data) {
      const { roadmaps, youtube } = data.data;
      console.log(
        `[${new Date().toISOString()}] [StudyCrawlerDaemon] Success: Roadmaps updated: ${
          roadmaps?.totalRoadmapsUpdated ?? 0
        }, YouTube refreshed: ${youtube?.refreshedCount ?? 0} (+${youtube?.newAdditions ?? 0} new).`
      );
    } else {
      console.log(`[${new Date().toISOString()}] [StudyCrawlerDaemon] Response:`, data);
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] [StudyCrawlerDaemon] Crawl failed with error:`, err.message || err);
  }
}

// Initial crawl 45 seconds after process launch (allowing Next.js to start completely)
setTimeout(() => {
  executeStudyCrawl();
}, 45 * 1000);

// Recurring weekly execution
setInterval(executeStudyCrawl, INTERVAL_MS);

console.log("[StudyCrawlerDaemon] Initialized. Recurring execution configured for every 7 days (weekly).");
