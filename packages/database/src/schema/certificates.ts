import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const courseCertificates = pgTable("course_certificates", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  courseId: text("course_id").notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientEmail: text("recipient_email").notNull(),
  score: integer("score").notNull().default(100),
  githubUrl: text("github_url"),
  verificationHash: text("verification_hash").notNull(),
  issuedAt: timestamp("issued_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
});
