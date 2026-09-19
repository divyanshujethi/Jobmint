import { z } from "zod";
import { UserRole, JobType, WorkMode } from "./enums";

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
