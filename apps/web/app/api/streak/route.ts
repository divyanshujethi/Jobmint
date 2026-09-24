import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, userStreaks, users, eq } from "@repo/database";

export const dynamic = "force-dynamic";

interface BadgeInfo {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
}

const ALL_BADGES: Omit<BadgeInfo, "unlocked">[] = [
  {
    id: "FIRST_STEP",
    name: "First Step",
    emoji: "🌱",
    description: "Started your daily engineering streak on JobMint.",
    tier: "BRONZE",
  },
  {
    id: "WEEK_WARRIOR",
    name: "Week Warrior",
    emoji: "🔥",
    description: "Maintained a 7-day uninterrupted daily streak.",
    tier: "SILVER",
  },
  {
    id: "MONTHLY_MAESTRO",
    name: "Monthly Maestro",
    emoji: "🏆",
    description: "Maintained a 30-day streak of active learning and building.",
    tier: "GOLD",
  },
  {
    id: "CODE_PRODIGY",
    name: "Code Prodigy",
    emoji: "⚡",
    description: "Achieved a Verified Dev Score of 800+ from real GitHub commits.",
    tier: "GOLD",
  },
  {
    id: "CERTIFIED_SCHOLAR",
    name: "Certified Scholar",
    emoji: "🎓",
    description: "Passed an anti-fraud technical examination & claimed a diploma.",
    tier: "SILVER",
  },
  {
    id: "OPPORTUNITY_HUNTER",
    name: "Opportunity Hunter",
    emoji: "💼",
    description: "Applied to 3+ verified jobs with verified credentials.",
    tier: "BRONZE",
  },
  {
    id: "COMMUNITY_CHAMPION",
    name: "Community Champion",
    emoji: "🤝",
    description: "Referred 3+ developer peers to JobMint.",
    tier: "PLATINUM",
  },
];

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    // Default preview streak data for guests / unauthenticated users
    if (!session?.user) {
      return NextResponse.json({
        isAuthenticated: false,
        currentStreak: 3,
        longestStreak: 5,
        totalXp: 180,
        lastCheckInDate: new Date().toISOString().split("T")[0],
        streakFreezes: 1,
        canCheckInToday: false,
        referralCode: "JM-GUEST",
        referralCount: 0,
        badges: ALL_BADGES.map((b) => ({
          ...b,
          unlocked: ["FIRST_STEP", "OPPORTUNITY_HUNTER"].includes(b.id),
        })),
        todayTasks: [
          { id: "checkin", title: "Daily Check-in & Warmup", completed: true, xp: 25 },
          { id: "prep", title: "Review 1 Interview Question", completed: true, xp: 30 },
          { id: "github", title: "Sync GitHub Commits / Dev Score", completed: false, xp: 50 },
          { id: "referral", title: "Invite 1 Developer Peer", completed: false, xp: 100 },
        ],
      });
    }

    const userId = session.user.id || session.user.email!;
    const todayStr = new Date().toISOString().split("T")[0];

    // Query DB for user streak
    let [record] = await db
      .select()
      .from(userStreaks)
      .where(eq(userStreaks.userId, userId))
      .limit(1);

    if (!record) {
      // Auto-initialize streak record for user
      const defaultRefCode = "JM-" + (session.user.name?.replace(/\s+/g, "").toUpperCase().slice(0, 6) || "DEV") + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
      try {
        const [inserted] = await db
          .insert(userStreaks)
          .values({
            userId,
            currentStreak: 1,
            longestStreak: 1,
            totalXp: 50,
            lastCheckInDate: todayStr,
            streakFreezes: 1,
            referralCode: defaultRefCode,
            unlockedBadges: ["FIRST_STEP"],
          })
          .returning();
        record = inserted;
      } catch {
        // Fallback in-memory
        record = {
          id: "temp",
          userId,
          currentStreak: 1,
          longestStreak: 1,
          totalXp: 50,
          lastCheckInDate: todayStr,
          streakFreezes: 1,
          referralCode: defaultRefCode,
          referredBy: null,
          referralCount: 0,
          unlockedBadges: ["FIRST_STEP"],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }

    const canCheckInToday = record.lastCheckInDate !== todayStr;

    return NextResponse.json({
      isAuthenticated: true,
      currentStreak: record.currentStreak,
      longestStreak: record.longestStreak,
      totalXp: record.totalXp,
      lastCheckInDate: record.lastCheckInDate,
      streakFreezes: record.streakFreezes,
      canCheckInToday,
      referralCode: record.referralCode,
      referralCount: record.referralCount,
      badges: ALL_BADGES.map((b) => ({
        ...b,
        unlocked: record.unlockedBadges.includes(b.id),
      })),
      todayTasks: [
        { id: "checkin", title: "Daily Check-in & Warmup", completed: !canCheckInToday, xp: 25 },
        { id: "prep", title: "Review 1 Interview Question", completed: true, xp: 30 },
        { id: "github", title: "Sync GitHub Commits / Dev Score", completed: false, xp: 50 },
        { id: "referral", title: "Invite 1 Developer Peer", completed: record.referralCount > 0, xp: 100 },
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to load streak telemetry" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Please sign in to save your daily streak" },
        { status: 401 }
      );
    }

    const userId = session.user.id || session.user.email!;
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let [record] = await db
      .select()
      .from(userStreaks)
      .where(eq(userStreaks.userId, userId))
      .limit(1);

    if (!record) {
      const defaultRefCode = "JM-" + (session.user.name?.replace(/\s+/g, "").toUpperCase().slice(0, 6) || "DEV") + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
      const [inserted] = await db
        .insert(userStreaks)
        .values({
          userId,
          currentStreak: 1,
          longestStreak: 1,
          totalXp: 75,
          lastCheckInDate: todayStr,
          streakFreezes: 1,
          referralCode: defaultRefCode,
          unlockedBadges: ["FIRST_STEP"],
        })
        .returning();
      return NextResponse.json({
        success: true,
        currentStreak: 1,
        totalXp: 75,
        streakIncreased: true,
        xpEarned: 25,
        newBadgesUnlocked: ["FIRST_STEP"],
      });
    }

    // Already checked in today
    if (record.lastCheckInDate === todayStr) {
      return NextResponse.json({
        success: true,
        alreadyCheckedIn: true,
        currentStreak: record.currentStreak,
        totalXp: record.totalXp,
      });
    }

    let newStreak = record.currentStreak;
    let newFreezes = record.streakFreezes;
    let freezeUsed = false;

    if (record.lastCheckInDate === yesterdayStr) {
      newStreak += 1;
    } else {
      // More than 1 day missed
      if (newFreezes > 0) {
        newFreezes -= 1;
        freezeUsed = true;
        newStreak += 1; // Protected by freeze
      } else {
        newStreak = 1;
      }
    }

    const newLongest = Math.max(record.longestStreak, newStreak);
    const xpGained = 25 + (newStreak % 7 === 0 ? 100 : 0);
    const newXp = record.totalXp + xpGained;

    // Badges checks
    const badges = [...record.unlockedBadges];
    const newBadges: string[] = [];

    if (newStreak >= 7 && !badges.includes("WEEK_WARRIOR")) {
      badges.push("WEEK_WARRIOR");
      newBadges.push("WEEK_WARRIOR");
    }
    if (newStreak >= 30 && !badges.includes("MONTHLY_MAESTRO")) {
      badges.push("MONTHLY_MAESTRO");
      newBadges.push("MONTHLY_MAESTRO");
    }

    await db
      .update(userStreaks)
      .set({
        currentStreak: newStreak,
        longestStreak: newLongest,
        totalXp: newXp,
        lastCheckInDate: todayStr,
        streakFreezes: newFreezes,
        unlockedBadges: badges,
        updatedAt: new Date(),
      })
      .where(eq(userStreaks.userId, userId));

    return NextResponse.json({
      success: true,
      currentStreak: newStreak,
      longestStreak: newLongest,
      totalXp: newXp,
      xpEarned: xpGained,
      streakIncreased: true,
      freezeUsed,
      newBadgesUnlocked: newBadges,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process daily check-in" },
      { status: 500 }
    );
  }
}
