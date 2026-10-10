/**
 * RoleNest - Early-Career & Internship Taxonomy Classifier
 *
 * Categorizes early-career positions into precise tracks:
 * - SDE-1 / Graduate Software Engineer / GET (0-1 YOE)
 * - Software / Tech Internships (Summer/Winter/6-Month)
 * - QA Automation / SDET-1
 * - Frontend Developer I
 * - Backend Engineer I
 * - Data Engineer I
 * - AI / ML Engineer I
 */

import { JobType } from "@repo/shared";

export type EarlyCareerCategory =
  | "SDE_1"
  | "INTERNSHIP"
  | "QA_AUTOMATION"
  | "FRONTEND"
  | "BACKEND"
  | "DATA_ENGINEERING"
  | "AI_ML"
  | "GENERAL_TECH";

export interface EarlyCareerProfile {
  isEarlyCareer: boolean;
  category: EarlyCareerCategory;
  categoryLabel: string;
  badgeText: string;
  jobType: JobType;
  experienceYears: number; // 0 for fresher/intern, 1 for SDE-1
  tags: string[];
}

const INTERN_REGEX = /\b(intern|internship|trainee|apprentice|fellow|fellowship|summer\s+intern|winter\s+intern|co-op)\b/i;

const FRESHER_SDE1_REGEX = /\b(sde[- ]?1|sde[- ]?i\b|software\s+engineer[- ]?1|software\s+engineer[- ]?i\b|junior|associate\s+software|graduate\s+engineer|graduate\s+trainee|get\b|campus\s+hire|entry[- ]?level|new\s+grad|fresher|0[- ]?1\s+years?|0[- ]?2\s+years?)\b/i;

const QA_REGEX = /\b(qa|sdet|quality\s+assurance|automation\s+engineer|test\s+engineer|software\s+test|tester)\b/i;
const FRONTEND_REGEX = /\b(frontend|front[- ]?end|react|vue|angular|ui[- ]?developer|web\s+developer|ui[- ]?ux\s+developer|mobile\s+developer|android|ios|flutter)\b/i;
const BACKEND_REGEX = /\b(backend|back[- ]?end|node|nodejs|golang|go\s+developer|java\s+developer|python\s+developer|spring\s+boot|c\+\+|dotnet|\.net|api\s+developer)\b/i;
const DATA_REGEX = /\b(data\s+engineer|data\s+analyst|data\s+analytics|etl|sql\s+developer|analytics\s+engineer|bi\s+developer)\b/i;
const AI_ML_REGEX = /\b(ai\s+engineer|machine\s+learning|ml\s+engineer|data\s+scientist|deep\s+learning|computer\s+vision|nlp|llm|genai)\b/i;

/**
 * Classifies a job title and description into an early career profile.
 */
export function classifyEarlyCareerRole(
  title: string,
  description?: string
): EarlyCareerProfile {
  const t = title.trim();
  const fullText = `${t} ${description || ""}`.toLowerCase();

  const isIntern = INTERN_REGEX.test(t);
  const isFresherOrSde1 = FRESHER_SDE1_REGEX.test(t);

  // If title explicitly requires senior/lead/staff/principal/architect or >3 YOE, it's not early career
  const isSenior = /\b(senior|sr\b|lead|staff|principal|director|head|manager|architect|vp|5\+|6\+|7\+|8\+|10\+)\b/i.test(t);

  if (isSenior && !isIntern) {
    return {
      isEarlyCareer: false,
      category: "GENERAL_TECH",
      categoryLabel: "Experienced Tech",
      badgeText: "Experienced",
      jobType: JobType.FULL_TIME,
      experienceYears: 3,
      tags: [],
    };
  }

  // 1. Internships
  if (isIntern) {
    let cat: EarlyCareerCategory = "INTERNSHIP";
    let label = "Software Engineering Intern";

    if (AI_ML_REGEX.test(fullText)) {
      cat = "AI_ML";
      label = "AI / ML Intern";
    } else if (DATA_REGEX.test(fullText)) {
      cat = "DATA_ENGINEERING";
      label = "Data Engineering Intern";
    } else if (FRONTEND_REGEX.test(fullText)) {
      cat = "FRONTEND";
      label = "Frontend Intern";
    } else if (BACKEND_REGEX.test(fullText)) {
      cat = "BACKEND";
      label = "Backend Intern";
    } else if (QA_REGEX.test(fullText)) {
      cat = "QA_AUTOMATION";
      label = "QA Automation Intern";
    }

    return {
      isEarlyCareer: true,
      category: cat,
      categoryLabel: label,
      badgeText: "🎓 Summer / 6M Intern",
      jobType: JobType.INTERNSHIP,
      experienceYears: 0,
      tags: ["Internship", label, "Campus 2025/2026"],
    };
  }

  // 2. Early-Career / SDE-1 / Freshers
  if (isFresherOrSde1) {
    let cat: EarlyCareerCategory = "SDE_1";
    let label = "SDE-1 / Graduate Software Engineer";

    if (AI_ML_REGEX.test(fullText)) {
      cat = "AI_ML";
      label = "AI / ML Engineer I";
    } else if (DATA_REGEX.test(fullText)) {
      cat = "DATA_ENGINEERING";
      label = "Data Engineer I";
    } else if (QA_REGEX.test(fullText)) {
      cat = "QA_AUTOMATION";
      label = "QA Automation / SDET-1";
    } else if (FRONTEND_REGEX.test(fullText)) {
      cat = "FRONTEND";
      label = "Frontend Developer I";
    } else if (BACKEND_REGEX.test(fullText)) {
      cat = "BACKEND";
      label = "Backend Developer I";
    }

    return {
      isEarlyCareer: true,
      category: cat,
      categoryLabel: label,
      badgeText: "⚡ Fresher / SDE-1",
      jobType: JobType.FULL_TIME,
      experienceYears: 1,
      tags: ["Fresher", "SDE-1", label, "0-1 YOE"],
    };
  }

  // Default fallback
  return {
    isEarlyCareer: false,
    category: "GENERAL_TECH",
    categoryLabel: "Software Engineer",
    badgeText: "Full-Time",
    jobType: JobType.FULL_TIME,
    experienceYears: 2,
    tags: ["Full-Time"],
  };
}
