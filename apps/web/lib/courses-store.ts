import fs from "fs";
import path from "path";
import { redis } from "./redis";
import { CURATED_COURSES, CoursePlaylist } from "./courses-data";

const REDIS_DYNAMIC_PLAYLISTS_KEY = "rolenest:dynamic_playlists:v1";
const LOCAL_FALLBACK_FILE = path.join(process.cwd(), "lib", "dynamic-playlists-cache.json");

/**
 * Read local fallback cache
 */
function readLocalFallback(): CoursePlaylist[] {
  try {
    if (fs.existsSync(LOCAL_FALLBACK_FILE)) {
      const raw = fs.readFileSync(LOCAL_FALLBACK_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[CoursesStore] Failed to read fallback cache:", err);
  }
  return [];
}

/**
 * Write local fallback cache
 */
function writeLocalFallback(playlists: CoursePlaylist[]) {
  try {
    fs.writeFileSync(LOCAL_FALLBACK_FILE, JSON.stringify(playlists, null, 2), "utf-8");
  } catch (err) {
    console.warn("[CoursesStore] Failed to write fallback cache:", err);
  }
}

/**
 * Get all dynamically crawled playlists from Redis or local cache
 */
export async function getDynamicPlaylists(): Promise<CoursePlaylist[]> {
  if (redis) {
    try {
      const raw = await redis.get(REDIS_DYNAMIC_PLAYLISTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CoursePlaylist[];
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("[CoursesStore] Redis read error, using fallback:", err);
    }
  }

  return readLocalFallback();
}

/**
 * Save a newly crawled playlist
 */
export async function saveDynamicPlaylist(playlist: CoursePlaylist): Promise<CoursePlaylist> {
  const current = await getDynamicPlaylists();
  
  // Deduplicate: replace existing with same ID or embedPlaylistId, otherwise prepend
  const filtered = current.filter(
    (p) => p.id !== playlist.id && p.embedPlaylistId !== playlist.embedPlaylistId
  );
  const updated = [playlist, ...filtered];

  // 1. Write to Redis (persistent, no TTL)
  if (redis) {
    try {
      await redis.set(REDIS_DYNAMIC_PLAYLISTS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn("[CoursesStore] Redis write error:", err);
    }
  }

  // 2. Write to local fallback file for offline resilience
  writeLocalFallback(updated);

  return playlist;
}

/**
 * Get all playlists: dynamic crawled playlists + 60 curated courses
 */
export async function getAllPlaylists(): Promise<CoursePlaylist[]> {
  const dynamic = await getDynamicPlaylists();
  const seenIds = new Set(dynamic.map((d) => d.id));
  const seenEmbeds = new Set(dynamic.map((d) => d.embedPlaylistId).filter(Boolean));

  const filteredCurated = CURATED_COURSES.filter(
    (c) => !seenIds.has(c.id) && !seenEmbeds.has(c.embedPlaylistId)
  );

  return [...dynamic, ...filteredCurated];
}

/**
 * Find single playlist by ID
 */
export async function getPlaylistById(id: string): Promise<CoursePlaylist | undefined> {
  const dynamic = await getDynamicPlaylists();
  const foundDynamic = dynamic.find((p) => p.id === id);
  if (foundDynamic) return foundDynamic;

  return CURATED_COURSES.find((p) => p.id === id);
}
