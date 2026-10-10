import { pgTable, text, timestamp, boolean, integer, index } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { CompanyRole } from "@repo/shared";

export const companies = pgTable(
  "companies",
  {
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

    // ATS Board & Career Discovery Registry
    careersUrl: text("careers_url"),
    atsProvider: text("ats_provider"), // 'greenhouse' | 'lever' | 'ashby' | 'smartrecruiters' | 'workable' | 'bamboohr' | 'breezy' | 'recruitee' | 'darwinbox' | 'custom'
    atsToken: text("ats_token"),
    discoveryStatus: text("discovery_status").default("UNTESTED").notNull(), // 'VERIFIED' | 'FAILED' | 'MANUAL_REVIEW' | 'UNTESTED'
    discoveryMethod: text("discovery_method"), // 'REDIRECT' | 'HTML_SNIFF' | 'FALLBACK_PROBE' | 'MANUAL'
    sector: text("sector"), // 'Fintech' | 'AI/ML' | 'SaaS' | 'DevTools' | 'Ecommerce' | 'Cybersecurity' | 'Product'
    tier: text("tier"), // 'UNICORN' | 'SOONICORN' | 'GROWTH' | 'SEED'
    lastProbedAt: timestamp("last_probed_at", { mode: "date" }),
    activeJobsCount: integer("active_jobs_count").default(0),

    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_companies_slug").on(table.slug),
    index("idx_companies_is_verified").on(table.isVerified),
    index("idx_companies_domain").on(table.domain),
    index("idx_companies_ats_provider").on(table.atsProvider),
    index("idx_companies_discovery_status").on(table.discoveryStatus),
  ]
);

export const companyMembers = pgTable(
  "company_members",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    companyId: text("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull().default(CompanyRole.RECRUITER),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_company_members_company_id").on(table.companyId),
    index("idx_company_members_user_id").on(table.userId),
  ]
);
