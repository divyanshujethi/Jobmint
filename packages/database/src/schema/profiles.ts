import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { skills } from "./skills";

export const candidateProfiles = pgTable("candidate_profiles", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  headline: text("headline"),
  bio: text("bio"),
  location: text("location"),
  phone: text("phone"),
  preferredRoles: text("preferred_roles").array().notNull().default([]),
  preferredLocations: text("preferred_locations").array().notNull().default([]),
  workModes: text("work_modes").array().notNull().default([]),
  expectedSalaryMin: integer("expected_salary_min"),
  isFresher: boolean("is_fresher").default(true).notNull(),
  collegeName: text("college_name"),
  resumeUrl: text("resume_url"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  portfolioUrl: text("portfolio_url"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const candidateSkills = pgTable("candidate_skills", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  profileId: text("profile_id")
    .notNull()
    .references(() => candidateProfiles.id, { onDelete: "cascade" }),
  skillId: text("skill_id")
    .notNull()
    .references(() => skills.id, { onDelete: "cascade" }),
  proficiency: text("proficiency").default("INTERMEDIATE"), // BEGINNER, INTERMEDIATE, ADVANCED
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const candidateEducation = pgTable("candidate_education", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  profileId: text("profile_id")
    .notNull()
    .references(() => candidateProfiles.id, { onDelete: "cascade" }),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  fieldOfStudy: text("field_of_study").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  isCurrent: boolean("is_current").default(false).notNull(),
  grade: text("grade"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const candidateExperience = pgTable("candidate_experience", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  profileId: text("profile_id")
    .notNull()
    .references(() => candidateProfiles.id, { onDelete: "cascade" }),
  company: text("company").notNull(),
  title: text("title").notNull(),
  location: text("location"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  isCurrent: boolean("is_current").default(false).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const candidateProjects = pgTable("candidate_projects", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  profileId: text("profile_id")
    .notNull()
    .references(() => candidateProfiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  liveUrl: text("live_url"),
  repoUrl: text("repo_url"),
  skillsUsed: text("skills_used").array().notNull().default([]),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
