import { describe, it, expect } from "vitest";
import { calculatePlayerStats } from "../game-engine";

describe("Player Stats Engine", () => {
  it("initializes honest 0-state for guests without synthetic XP", () => {
    const stats = calculatePlayerStats(0, 0);
    expect(stats.xp).toBe(0);
    expect(stats.streakDays).toBe(0);
    expect(stats.level).toBe(1);
    expect(stats.title).toBe("Level 1: Novice Cadet");
    expect(stats.progressPercent).toBe(0);
    expect(stats.solvedChallengesCount).toBe(0);
  });
});
