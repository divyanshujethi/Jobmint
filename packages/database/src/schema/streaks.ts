import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const userStreaks = pgTable("user_streaks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  currentStreak: integer("current_streak").default(1).notNull(),
  longestStreak: integer("longest_streak").default(1).notNull(),
  totalXp: integer("total_xp").default(50).notNull(),
  lastCheckInDate: text("last_check_in_date"), // YYYY-MM-DD
  streakFreezes: integer("streak_freezes").default(1).notNull(),
  referralCode: text("referral_code").notNull().unique(),
  referredBy: text("referred_by"),
  referralCount: integer("referral_count").default(0).notNull(),
  unlockedBadges: text("unlocked_badges").array().notNull().default(["FIRST_STEP"]),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
