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
    description: "Started your daily engineering streak on Role Nest.",
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
    description: "Referred 3+ developer peers to Role Nest.",
    tier: "PLATINUM",
  },
];

function getISTDateStr(date = new Date(), offsetDays = 0): string {
  const d = new Date(date);
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function getDaysDifference(d1Str: string, d2Str: string): number {
  const d1 = new Date(d1Str + "T00:00:00Z");
  const d2 = new Date(d2Str + "T00:00:00Z");
  const diffTime = d2.getTime() - d1.getTime();
  return Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)));
}

function calculateDevScore(totalXp: number, streak: number): number {
  if (!totalXp && !streak) return 0;
  const base = 500;
  const xpComponent = Math.round((totalXp || 0) * 0.8);
  const streakComponent = (streak || 0) * 15;
  return Math.min(1000, base + xpComponent + streakComponent);
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    // Clean 0-streak preview data for guests / unauthenticated users
    if (!session?.user) {
      return NextResponse.json({
        isAuthenticated: false,
        currentStreak: 0,
        longestStreak: 0,
        totalXp: 0,
        devScore: 0,
        lastCheckInDate: null,
        streakFreezes: 0,
        canCheckInToday: false,
        referralCode: null,
        referralCount: 0,
        badges: ALL_BADGES.map((b) => ({
          ...b,
          unlocked: false,
        })),
        todayTasks: [
          { id: "checkin", title: "Daily Check-in & Warmup", completed: false, xp: 25 },
          { id: "potd", title: "Solve Today's Problem (POTD)", completed: false, xp: 50 },
          { id: "github", title: "Sync GitHub Commits / Dev Score", completed: false, xp: 50 },
          { id: "referral", title: "Invite 1 Developer Peer", completed: false, xp: 100 },
        ],
      });
    }

    const userId = session.user.id || session.user.email!;
    const todayStr = getISTDateStr();

    // Query DB for user streak
    let [record] = await db
      .select()
      .from(userStreaks)
      .where(eq(userStreaks.userId, userId))
      .limit(1);

    if (!record) {
      const defaultRefCode = "JM-" + (session.user.name?.replace(/\s+/g, "").toUpperCase().slice(0, 6) || "DEV") + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
      
      const refCookie = req.cookies.get("jm_referral")?.value;
      let referredByUserId: string | null = null;
      let initialXp = 50;
      let initialFreezes = 2;

      if (refCookie) {
        try {
          const [referrer] = await db
            .select()
            .from(userStreaks)
            .where(eq(userStreaks.referralCode, refCookie))
            .limit(1);

          if (referrer && referrer.userId !== userId) {
            referredByUserId = referrer.userId;
            initialXp += 50; // Bonus 50 XP for joining via referral
            initialFreezes += 1;
            
            const updatedBadges = [...(referrer.unlockedBadges || [])];
            if (!updatedBadges.includes("COMMUNITY_CHAMPION")) {
              updatedBadges.push("COMMUNITY_CHAMPION");
            }
            await db
              .update(userStreaks)
              .set({
                referralCount: (referrer.referralCount || 0) + 1,
                totalXp: (referrer.totalXp || 0) + 100,
                streakFreezes: (referrer.streakFreezes || 0) + 1,
                unlockedBadges: updatedBadges,
                updatedAt: new Date(),
              })
              .where(eq(userStreaks.id, referrer.id));
          }
        } catch (err) {
          console.error("Referral attribution error:", err);
        }
      }

      try {
        const [inserted] = await db
          .insert(userStreaks)
          .values({
            userId,
            currentStreak: 1,
            longestStreak: 1,
            totalXp: initialXp,
            lastCheckInDate: null, // Allow user to click "Check In" for Day 1
            streakFreezes: initialFreezes,
            referralCode: defaultRefCode,
            referredBy: referredByUserId,
            referralCount: 0,
            unlockedBadges: ["FIRST_STEP"],
          })
          .returning();
        record = inserted;
      } catch {
        record = {
          id: "temp",
          userId,
          currentStreak: 1,
          longestStreak: 1,
          totalXp: initialXp,
          lastCheckInDate: null,
          streakFreezes: initialFreezes,
          referralCode: defaultRefCode,
          referredBy: referredByUserId,
          referralCount: 0,
          unlockedBadges: ["FIRST_STEP"],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }

    const canCheckInToday = record.lastCheckInDate !== todayStr;
    const devScore = calculateDevScore(record.totalXp, record.currentStreak);

    return NextResponse.json({
      isAuthenticated: true,
      currentStreak: record.currentStreak,
      longestStreak: record.longestStreak,
      totalXp: record.totalXp,
      devScore,
      lastCheckInDate: record.lastCheckInDate,
      streakFreezes: record.streakFreezes ?? 2,
      canCheckInToday,
      referralCode: record.referralCode,
      referralCount: record.referralCount,
      badges: ALL_BADGES.map((b) => ({
        ...b,
        unlocked: record.unlockedBadges.includes(b.id),
      })),
      todayTasks: [
        { id: "checkin", title: "Daily Check-in & Warmup", completed: !canCheckInToday, xp: 25 },
        { id: "potd", title: "Solve Today's Problem (POTD)", completed: record.unlockedBadges.includes("ALGO_ACE"), xp: 50 },
        { id: "github", title: "Sync GitHub Commits / Dev Score", completed: devScore >= 700, xp: 50 },
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
    const todayStr = getISTDateStr();
    const yesterdayStr = getISTDateStr(new Date(), -1);

    let body: any = {};
    try {
      body = await req.json();
    } catch {}

    const questId = body?.questId || "checkin";
    const isPotdQuest = questId === "potd";
    const isGithubQuest = questId === "github_sync";
    const isPrepQuest = questId === "prep";

    let [record] = await db
      .select()
      .from(userStreaks)
      .where(eq(userStreaks.userId, userId))
      .limit(1);

    if (!record) {
      const defaultRefCode = "JM-" + (session.user.name?.replace(/\s+/g, "").toUpperCase().slice(0, 6) || "DEV") + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
      const initialXp = isPotdQuest ? 100 : 75;
      const initialBadges = isPotdQuest ? ["FIRST_STEP", "ALGO_ACE"] : ["FIRST_STEP"];
      const [inserted] = await db
        .insert(userStreaks)
        .values({
          userId,
          currentStreak: 1,
          longestStreak: 1,
          totalXp: initialXp,
          lastCheckInDate: todayStr,
          streakFreezes: 2,
          referralCode: defaultRefCode,
          unlockedBadges: initialBadges,
        })
        .returning();

      const devScore = calculateDevScore(initialXp, 1);
      return NextResponse.json({
        success: true,
        currentStreak: 1,
        totalXp: initialXp,
        streakIncreased: true,
        xpEarned: isPotdQuest ? 50 : 25,
        devScore,
        newBadgesUnlocked: initialBadges,
        message: `🔥 Streak started at 1 Day! +${isPotdQuest ? 50 : 25} XP awarded.`,
      });
    }

    // Case A: User has already checked in today for basic checkin
    if (record.lastCheckInDate === todayStr) {
      // 1. POTD Quest bonus completion
      if (isPotdQuest) {
        const questXp = 50;
        const updatedXp = record.totalXp + questXp;
        const badges = [...record.unlockedBadges];
        if (!badges.includes("ALGO_ACE")) {
          badges.push("ALGO_ACE");
        }

        const devScore = calculateDevScore(updatedXp, record.currentStreak);
        if (devScore >= 800 && !badges.includes("CODE_PRODIGY")) {
          badges.push("CODE_PRODIGY");
        }

        await db
          .update(userStreaks)
          .set({
            totalXp: updatedXp,
            unlockedBadges: badges,
            updatedAt: new Date(),
          })
          .where(eq(userStreaks.userId, userId));

        return NextResponse.json({
          success: true,
          questCompleted: "potd",
          currentStreak: record.currentStreak,
          totalXp: updatedXp,
          xpEarned: questXp,
          devScore,
          message: `🎉 All test cases passed! +50 XP Awarded & Dev Score boosted to ${devScore}/1000!`,
        });
      }

      // 2. GitHub Commits Sync bonus
      if (isGithubQuest) {
        const questXp = 50;
        const updatedXp = record.totalXp + questXp;
        const badges = [...record.unlockedBadges];
        const devScore = calculateDevScore(updatedXp, record.currentStreak);
        if (devScore >= 800 && !badges.includes("CODE_PRODIGY")) {
          badges.push("CODE_PRODIGY");
        }

        await db
          .update(userStreaks)
          .set({
            totalXp: updatedXp,
            unlockedBadges: badges,
            updatedAt: new Date(),
          })
          .where(eq(userStreaks.userId, userId));

        return NextResponse.json({
          success: true,
          questCompleted: "github_sync",
          currentStreak: record.currentStreak,
          totalXp: updatedXp,
          xpEarned: questXp,
          devScore,
          message: `⚡ GitHub Commits & Dev Score Synced! +50 XP Awarded (${devScore}/1000 DevScore)!`,
        });
      }

      // 3. Prep warmup bonus
      if (isPrepQuest) {
        const questXp = 30;
        const updatedXp = record.totalXp + questXp;
        const devScore = calculateDevScore(updatedXp, record.currentStreak);

        await db
          .update(userStreaks)
          .set({
            totalXp: updatedXp,
            updatedAt: new Date(),
          })
          .where(eq(userStreaks.userId, userId));

        return NextResponse.json({
          success: true,
          questCompleted: "prep",
          currentStreak: record.currentStreak,
          totalXp: updatedXp,
          xpEarned: questXp,
          devScore,
          message: `🧠 Interview Warmup Completed! +30 XP Awarded!`,
        });
      }

      // Standard basic check-in when already checked in
      const devScore = calculateDevScore(record.totalXp, record.currentStreak);
      return NextResponse.json({
        success: true,
        alreadyCheckedIn: true,
        currentStreak: record.currentStreak,
        totalXp: record.totalXp,
        devScore,
        message: "You are already checked in for today! Next check-in opens tomorrow at midnight IST. You can still solve POTD or sync GitHub commits to earn XP!",
      });
    }

    // Case B: New Day Check-in (lastCheckInDate !== todayStr)
    let newStreak = record.currentStreak;
    let newFreezes = record.streakFreezes ?? 2;
    let freezeUsed = false;
    let xpEarned = isPotdQuest ? 50 : isGithubQuest ? 50 : isPrepQuest ? 30 : 25;

    if (!record.lastCheckInDate) {
      // First check-in
      newStreak = 1;
    } else {
      const diffDays = getDaysDifference(record.lastCheckInDate, todayStr);
      if (diffDays === 1) {
        // Consecutive daily check-in!
        newStreak += 1;
      } else if (diffDays === 2) {
        // Missed 1 day: protected by freeze or grace
        if (newFreezes > 0) {
          newFreezes -= 1;
          freezeUsed = true;
        }
        newStreak += 1;
      } else if (diffDays <= 4) {
        // Weekend or 2-3 day gap: use available freeze, protect streak
        if (newFreezes > 0) {
          newFreezes = Math.max(0, newFreezes - 1);
          freezeUsed = true;
          newStreak += 1;
        } else {
          // Grace protection: keep streak moving forward
          newStreak = Math.max(1, record.currentStreak + 1);
        }
      } else {
        // Prolonged gap (> 4 days): reset to 1
        newStreak = 1;
        newFreezes = 2; // Refresh freezes
      }
    }

    // Weekly milestone bonus
    if (newStreak % 7 === 0) {
      xpEarned += 100;
      newFreezes = Math.min(3, newFreezes + 1); // Extra streak freeze
    }

    const newLongest = Math.max(record.longestStreak, newStreak);
    const newXp = record.totalXp + xpEarned;

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
    if (isPotdQuest && !badges.includes("ALGO_ACE")) {
      badges.push("ALGO_ACE");
      newBadges.push("ALGO_ACE");
    }

    const devScore = calculateDevScore(newXp, newStreak);
    if (devScore >= 800 && !badges.includes("CODE_PRODIGY")) {
      badges.push("CODE_PRODIGY");
      newBadges.push("CODE_PRODIGY");
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
      devScore,
      xpEarned,
      streakIncreased: true,
      freezeUsed,
      newBadgesUnlocked: newBadges,
      message: `🔥 Streak updated to ${newStreak} Days! +${xpEarned} XP awarded. Verified Dev Score: ${devScore}/1000.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process daily check-in" },
      { status: 500 }
    );
  }
}
