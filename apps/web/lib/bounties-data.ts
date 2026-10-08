export interface EmployeeHostedBounty {
  id: string;
  companyName: string;
  companySlug: string;
  companyLogoUrl?: string;
  companyLogoInitial: string;
  roleTitle: string;
  department: "Backend" | "Frontend" | "FullStack" | "AI & ML" | "DevOps & Cloud" | "Mobile" | "Product & Mgmt";
  employeeBonusInr: number;
  candidateRewardInr: number;
  platformFeeCutPercent: number;
  hostEmployeeTitle: string;
  hostEmployeeDomain: string;
  experienceLevel: "FRESHER" | "1-3 YRS" | "3-5 YRS" | "5+ YRS";
  salaryRangeCtcLpa: string;
  location: string;
  workMode: "Remote" | "Hybrid" | "Onsite";
  keySkills: string[];
  openSlots: number;
  referralType: "INTERNAL_ATS_SUBMISSION" | "HIRING_MANAGER_DIRECT";
  postedAgo: string;
  verifiedBadge: boolean;
  description: string;
}

// All fake hardcoded corporate bounties removed per user directive.
export const VERIFIED_EMPLOYEE_BOUNTIES: EmployeeHostedBounty[] = [];
