export const UserRole = {
  CANDIDATE: "CANDIDATE",
  EMPLOYER: "EMPLOYER",
  ADMIN: "ADMIN",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const JobType = {
  INTERNSHIP: "INTERNSHIP",
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  CONTRACT: "CONTRACT",
  FREELANCE: "FREELANCE",
} as const;
export type JobType = (typeof JobType)[keyof typeof JobType];

export const WorkMode = {
  REMOTE: "REMOTE",
  HYBRID: "HYBRID",
  ON_SITE: "ON_SITE",
} as const;
export type WorkMode = (typeof WorkMode)[keyof typeof WorkMode];

export const JobSource = {
  DIRECT: "DIRECT",
  PARTNER: "PARTNER",
  EXTERNAL: "EXTERNAL",
} as const;
export type JobSource = (typeof JobSource)[keyof typeof JobSource];

export const ApplicationStatus = {
  APPLIED: "APPLIED",
  RESUME_VIEWED: "RESUME_VIEWED",
  SHORTLISTED: "SHORTLISTED",
  INTERVIEW: "INTERVIEW",
  OFFER: "OFFER",
  REJECTED: "REJECTED",
  HIRED: "HIRED",
  WITHDRAWN: "WITHDRAWN",
} as const;
export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export const CompanyRole = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  RECRUITER: "RECRUITER",
} as const;
export type CompanyRole = (typeof CompanyRole)[keyof typeof CompanyRole];
