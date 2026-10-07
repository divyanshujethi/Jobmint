import fs from "fs";
import path from "path";
import { redis } from "./redis";
import { CAREER_ROADMAPS, CareerRoadmap } from "@repo/shared";
import { RoadmapCrawlResult } from "@repo/alligators";

const REDIS_DYNAMIC_ROADMAPS_KEY = "rolenest:dynamic_roadmaps:v1";
const LOCAL_ROADMAPS_CACHE_FILE = path.join(process.cwd(), "lib", "dynamic-roadmaps-cache.json");

/**
 * Read local fallback cache for roadmaps
 */
function readLocalRoadmapFallback(): Record<string, RoadmapCrawlResult> {
  try {
    if (fs.existsSync(LOCAL_ROADMAPS_CACHE_FILE)) {
      const raw = fs.readFileSync(LOCAL_ROADMAPS_CACHE_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[RoadmapsStore] Failed to read fallback cache:", err);
  }
  return {};
}

/**
 * Write local fallback cache for roadmaps
 */
function writeLocalRoadmapFallback(data: Record<string, RoadmapCrawlResult>) {
  try {
    fs.writeFileSync(LOCAL_ROADMAPS_CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("[RoadmapsStore] Failed to write fallback cache:", err);
  }
}

/**
 * Retrieve cached crawled roadmap data
 */
export async function getDynamicRoadmapUpdates(): Promise<Record<string, RoadmapCrawlResult>> {
  if (redis) {
    try {
      const raw = await redis.get(REDIS_DYNAMIC_ROADMAPS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("[RoadmapsStore] Redis read error, using local fallback:", err);
    }
  }

  return readLocalRoadmapFallback();
}

/**
 * Persist crawled roadmap results
 */
export async function saveDynamicRoadmapUpdates(
  results: RoadmapCrawlResult[]
): Promise<void> {
  const current = await getDynamicRoadmapUpdates();

  for (const r of results) {
    current[r.roadmapSlug] = r;
  }

  if (redis) {
    try {
      await redis.set(REDIS_DYNAMIC_ROADMAPS_KEY, JSON.stringify(current));
    } catch (err) {
      console.warn("[RoadmapsStore] Failed to save to Redis:", err);
    }
  }

  writeLocalRoadmapFallback(current);
}

/**
 * Returns merged Career Roadmaps with dynamically crawled and verified resources
 */
export async function getEnrichedCareerRoadmaps(): Promise<CareerRoadmap[]> {
  const dynamicUpdates = await getDynamicRoadmapUpdates();

  return CAREER_ROADMAPS.map((roadmap) => {
    const update = dynamicUpdates[roadmap.slug];
    if (!update || !update.resources || update.resources.length === 0) {
      return roadmap;
    }

    // Merge crawled resources into phase 1 or appropriate phase
    const clonedPhases = roadmap.phases.map((phase, idx) => {
      if (idx === 0) {
        // Prepend verified crawled resources without duplicating URLs
        const existingUrls = new Set(phase.resources.map((r) => r.url));
        const newResources = update.resources.filter((r) => !existingUrls.has(r.url));
        return {
          ...phase,
          resources: [...newResources, ...phase.resources],
        };
      }
      return phase;
    });

    return {
      ...roadmap,
      phases: clonedPhases,
    };
  });
}
