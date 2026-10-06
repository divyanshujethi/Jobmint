import * as fs from "fs";
import * as path from "path";
import { LEETCODE_PROBLEMS, Problem } from "./problems-data";
import { db, codingProblems, desc } from "@repo/database";

const CACHE_FILE = path.resolve(process.cwd(), "lib/dynamic-problems-cache.json");

/**
 * Read cached crawled problems from disk
 */
export function getDiskCachedProblems(): Problem[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        return list as Problem[];
      }
    }
  } catch (err) {
    console.warn("[ArenaProblems] Error reading dynamic-problems-cache.json:", err);
  }
  return [];
}

/**
 * Fetch dynamic problems from PostgreSQL with fallback to disk cache
 */
export async function getDynamicProblems(): Promise<Problem[]> {
  try {
    const rows = await db
      .select()
      .from(codingProblems)
      .orderBy(desc(codingProblems.createdAt));

    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id || r.slug,
        slug: r.slug,
        title: r.title,
        difficulty: (r.difficulty as "Easy" | "Medium" | "Hard") || "Medium",
        category: (r.category as Problem["category"]) || "Arrays & Hashing",
        acceptance: r.acceptance || "50.0%",
        description: r.description,
        realWorldContext: r.realWorldContext || "",
        examples: (r.examples as any) || [],
        constraints: (r.constraints as any) || [],
        hints: (r.hints as any) || [],
        starterCodeJs: r.starterCodeJs || "",
        starterCodeTs: r.starterCodeTs || "",
        starterCodePy: r.starterCodePy || "",
        starterCodeCpp: r.starterCodeCpp || "",
        starterCodeJava: r.starterCodeJava || "",
        testCases: (r.testCases as any) || [],
        editorial: r.editorial || "",
        badgeName: r.badgeName || `${r.title} Specialist`,
        companies: (r.companies as any) || [],
        isDailyPotd: r.isDailyPotd ?? false,
        potdDate: r.potdDate ?? undefined,
      }));
    }
  } catch (err: any) {
    // If DB is unreachable or in build mode, use disk cache
    // Silently proceed to disk cache
  }

  return getDiskCachedProblems();
}

/**
 * Get all merged problems (static catalog + dynamically crawled questions)
 * Deduplicated by slug. Dynamic problems take precedence or expand the pool.
 */
export async function getMergedArenaProblems(): Promise<Problem[]> {
  const dynamicList = await getDynamicProblems();
  const map = new Map<string, Problem>();

  // Baseline static problems
  for (const p of LEETCODE_PROBLEMS) {
    map.set(p.slug, p);
  }

  // Overlay dynamic crawled problems (adds newly crawled questions, updates existing)
  for (const p of dynamicList) {
    if (map.has(p.slug)) {
      // Preserve any custom curated editorial if dynamic doesn't have one
      const existing = map.get(p.slug)!;
      map.set(p.slug, {
        ...existing,
        ...p,
        starterCodeJs: p.starterCodeJs || existing.starterCodeJs,
        starterCodeTs: p.starterCodeTs || existing.starterCodeTs,
        starterCodePy: p.starterCodePy || existing.starterCodePy,
        starterCodeCpp: p.starterCodeCpp || existing.starterCodeCpp,
        starterCodeJava: p.starterCodeJava || existing.starterCodeJava,
      });
    } else {
      map.set(p.slug, p);
    }
  }

  return Array.from(map.values());
}

/**
 * Get specific problem by slug
 */
export async function getArenaProblemBySlug(slug: string): Promise<Problem | null> {
  const all = await getMergedArenaProblems();
  return all.find((p) => p.slug === slug) || null;
}

/**
 * Get today's daily POTD and the 3 Super Hard challenges
 */
export async function getDailyArenaChallenge(): Promise<{
  daily: Problem;
  superHard: Problem[];
  date: string;
  totalAvailable: number;
}> {
  const todayDateStr = new Date().toISOString().split("T")[0];
  const allProblems = await getMergedArenaProblems();

  // 1. Look for crawled active daily POTD matching today's date
  let daily = allProblems.find((p) => p.isDailyPotd && p.potdDate === todayDateStr);

  // Fallback: look for latest crawled daily challenge
  if (!daily) {
    daily = allProblems.find((p) => p.isDailyPotd);
  }

  // Fallback 2: deterministic calendar rotation based on day number
  const dayNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  if (!daily) {
    daily = allProblems[dayNumber % allProblems.length] || allProblems[0];
  }

  // 2. Select 2-3 Super Hard problems of the day
  const hardProblems = allProblems.filter((p) => p.difficulty === "Hard");
  const superHard: Problem[] = [];

  if (hardProblems.length >= 3) {
    const h1 = hardProblems[dayNumber % hardProblems.length];
    const h2 = hardProblems[(dayNumber + 1) % hardProblems.length];
    const h3 = hardProblems[(dayNumber + 2) % hardProblems.length];
    superHard.push(h1, h2, h3);
  } else if (hardProblems.length > 0) {
    superHard.push(...hardProblems);
  }

  return {
    daily,
    superHard,
    date: todayDateStr,
    totalAvailable: allProblems.length,
  };
}
