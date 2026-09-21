import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { CompanyRole } from "@repo/shared";

export const companies = pgTable("companies", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  website: text("website").notNull(),
  domain: text("domain"),
  description: text("description"),
  location: text("location").notNull(),
  industry: text("industry").notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  corporateEmail: text("corporate_email"),
  gstin: text("gstin"),
  verificationMethod: text("verification_method"), // 'DNS_TXT' | 'WORK_EMAIL' | 'GSTIN' | 'MANUAL'
  verifiedAt: timestamp("verified_at", { mode: "date" }),
  
  // Factual Truth Teller Aggregates (Updated periodically or on review actions)
  totalApplications: text("total_applications").default("0").notNull(),
  reviewedApplications: text("reviewed_applications").default("0").notNull(),
  medianFirstReviewDays: text("median_first_review_days"),
  lastActiveAt: timestamp("last_active_at", { mode: "date" }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const companyMembers = pgTable("company_members", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull().default(CompanyRole.RECRUITER),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
