import { z } from "zod";
import { UserRole, JobType, WorkMode } from "./enums";
import { isDirectAtsOrCompanyUrl } from "./url-safety";
import { cleanCompanyName, isValidCompanyName } from "./company-sanitizer";

export const RegisterInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum([UserRole.CANDIDATE, UserRole.EMPLOYER]),
});

export const LoginInputSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const CandidateProfileSchema = z.object({
  headline: z.string().max(120, "Headline too long").optional(),
  bio: z.string().max(1000, "Bio too long").optional(),
  location: z.string().min(2, "Location is required"),
  phone: z.string().optional(),
  preferredRoles: z.array(z.string()).min(1, "Select at least one preferred role"),
  preferredLocations: z.array(z.string()).default([]),
  workModes: z.array(z.enum([WorkMode.REMOTE, WorkMode.HYBRID, WorkMode.ON_SITE])).min(1, "Select at least one work mode"),
  expectedSalaryMin: z.number().nonnegative().optional(),
  isFresher: z.boolean().default(true),
  githubUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
});

export const CompanyProfileSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  website: z.string().url("Must be a valid URL"),
  location: z.string().min(2, "Company location is required"),
  industry: z.string().min(2, "Industry is required"),
  description: z.string().min(20, "Please provide at least a short description"),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type CandidateProfileInput = z.infer<typeof CandidateProfileSchema>;
export type CompanyProfileInput = z.infer<typeof CompanyProfileSchema>;

/**
 * Strict Runtime Zod Ingestion Schema for Crawled / Ingested Job Payloads.
 * Rejects:
 * 1. Secondary scraped aggregator links (Naukri, Foundit, Internshala, Indeed, etc.)
 * 2. Scraper artifact company names ("Foundit Verified Employer", "Manager Opentext")
 * 3. Ghost jobs & listings with truthScore < 50
 * 4. Empty or corrupt descriptions (< 20 characters)
 */
export const CrawledJobPayloadSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(160, "Title cannot exceed 160 characters")
    .transform((t) => t.trim()),
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name cannot exceed 100 characters")
    .transform(cleanCompanyName)
    .refine((c) => isValidCompanyName(c), "Company name is invalid, generic, or an aggregator artifact"),
  companyWebsite: z.string().url().optional().or(z.literal("")),
  location: z.string().min(2, "Location is required"),
  workMode: z.nativeEnum(WorkMode),
  jobType: z.nativeEnum(JobType),
  salaryOrStipend: z.string().default("Competitive (Official)"),
  minSalary: z.number().optional(),
  maxSalary: z.number().optional(),
  currency: z.string().default("INR"),
  experienceYears: z.number().min(0).max(40).default(0),
  source: z.string().default("EXTERNAL"),
  sourceUrl: z
    .string()
    .url("sourceUrl must be a valid URL")
    .refine(
      (url) => isDirectAtsOrCompanyUrl(url),
      "sourceUrl must be a direct ATS or official employer portal, not a secondary aggregator"
    ),
  externalId: z.string().min(1, "externalId is required"),
  description: z.string().min(20, "Job description must be at least 20 characters"),
  rawRequirements: z.string().optional(),
  responsibilities: z.array(z.string()).optional(),
  skills: z.array(z.string()).default([]),
  isGhostRisk: z.boolean().default(false),
  truthScore: z.number().min(50, "Truth score must be >= 50"),
  publishedAt: z.string().optional(),
  country: z.string().default("India"),
  city: z.string().optional(),
  remoteScope: z.string().optional(),
  roleCategory: z.string().optional(),
});

export type CrawledJobPayload = z.infer<typeof CrawledJobPayloadSchema>;

