import { pgTable, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const bootcampEnrollments = pgTable("bootcamp_enrollments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  trackId: text("track_id").notNull(),
  studentName: text("student_name").notNull(),
  studentEmail: text("student_email").notNull(),
  studentPhone: text("student_phone"),
  collegeName: text("college_name").notNull(),
  degreeBranch: text("degree_branch").notNull(),
  rollNumber: text("roll_number").notNull(),
  githubUsername: text("github_username"),
  status: text("status").notNull().default("ACTIVE"),
  offerLetterId: text("offer_letter_id").notNull().unique(),
  nocLetterId: text("noc_letter_id").notNull().unique(),
  currentDay: integer("current_day").notNull().default(1),
  unlockedDay: integer("unlocked_day").notNull().default(1),
  
  // Open Source Contribution (target: https://github.com/RitualDev-Lab/DevShelf)
  githubForkUrl: text("github_fork_url"),
  osContributionPrUrl: text("os_contribution_pr_url"),
  osContributionStatus: text("os_contribution_status").notNull().default("NOT_STARTED"),
  
  // Final Capstone & Certificate
  capstoneRepoUrl: text("capstone_repo_url"),
  certificateId: text("certificate_id"),
  finalGrade: text("final_grade"),
  finalScore: integer("final_score"),

  // Payment details
  paymentOrderId: text("payment_order_id"),
  paymentStatus: text("payment_status").notNull().default("PAID"),
  amountPaid: integer("amount_paid").notNull().default(499),

  enrolledAt: timestamp("enrolled_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
});

export const bootcampDailySubmissions = pgTable("bootcamp_daily_submissions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  enrollmentId: text("enrollment_id")
    .notNull()
    .references(() => bootcampEnrollments.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  trackId: text("track_id").notNull(),
  dayNumber: integer("day_number").notNull(),
  dayTitle: text("day_title").notNull(),
  
  // Submission proof in git repo
  githubCommitUrl: text("github_commit_url").notNull(),
  assignmentNotes: text("assignment_notes"),
  codeSnippet: text("code_snippet"),
  passedCodeChallenge: boolean("passed_code_challenge").default(false),

  status: text("status").notNull().default("SUBMITTED"),
  mentorFeedback: text("mentor_feedback"),

  submittedAt: timestamp("submitted_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
});
