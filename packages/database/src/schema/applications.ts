import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { jobs } from "./jobs";
import { candidateProfiles } from "./profiles";
import { ApplicationStatus } from "@repo/shared";

export const applications = pgTable("applications", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  jobId: text("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  candidateProfileId: text("candidate_profile_id")
    .notNull()
    .references(() => candidateProfiles.id, { onDelete: "cascade" }),
  resumeUrl: text("resume_url").notNull(),
  status: text("status").notNull().default(ApplicationStatus.APPLIED),
  coverNote: text("cover_note"),
  appliedAt: timestamp("applied_at", { mode: "date" }).defaultNow().notNull(),
  lastViewedAt: timestamp("last_viewed_at", { mode: "date" }),
  lastStatusChangeAt: timestamp("last_status_change_at", { mode: "date" }).defaultNow().notNull(),
});

export const applicationEvents = pgTable("application_events", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  applicationId: text("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(), // APPLIED, RESUME_VIEWED, SHORTLISTED, etc.
  note: text("note"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
