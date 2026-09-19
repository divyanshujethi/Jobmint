import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { skills } from "./skills";
import { users } from "./auth";
import { JobType, WorkMode, JobSource } from "@repo/shared";

export const jobs = pgTable("jobs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  jobType: text("job_type").notNull().default(JobType.INTERNSHIP),
  workMode: text("work_mode").notNull().default(WorkMode.REMOTE),
  location: text("location").notNull(),
  salaryOrStipend: text("salary_or_stipend").notNull(),
  minSalary: integer("min_salary"),
  maxSalary: integer("max_salary"),
  experienceYears: integer("experience_years").default(0),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  benefits: text("benefits"),
  source: text("source").notNull().default(JobSource.DIRECT),
  sourceUrl: text("source_url"),
  externalJobId: text("external_job_id"),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  firstSeenAt: timestamp("first_seen_at", { mode: "date" }).defaultNow().notNull(),
  lastCheckedAt: timestamp("last_checked_at", { mode: "date" }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const jobSkills = pgTable("job_skills", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  jobId: text("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  skillId: text("skill_id")
    .notNull()
    .references(() => skills.id, { onDelete: "cascade" }),
  isRequired: boolean("is_required").default(true).notNull(),
});

export const savedJobs = pgTable("saved_jobs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  jobId: text("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
