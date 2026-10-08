import crypto from "crypto";
import { BOOTCAMP_TRACKS, BootcampTrack, getBootcampTrackBySlug } from "./bootcamp-data";

export interface InternshipCertificate {
  id: string; // e.g. RN-INT-2026-AIML-9F2B84
  trackId: string;
  trackTitle: string;
  certificateTitle: string;
  recipientName: string;
  recipientEmail?: string;
  collegeName: string;
  degreeBranch: string;
  rollNumber?: string;
  issuedAt: string;
  durationLabel: string; // "4 Weeks / 160 Hours Intensive Industrial Internship"
  skills: string[];
  capstoneTitle: string;
  githubUrl?: string;
  verificationHash: string;
  score: number; // e.g. 96/100
  grade: "A+" | "A" | "O" | "DISTINCTION";
  verified: boolean;
  status: "ISSUED" | "VERIFIED" | "HONOR_ROLL" | "REVOKED" | "REFUNDED" | "CANCELLED";
  mentorName: string;
  mentorTitle: string;
  academicCredits: string;
  aicteCompliant: boolean;
}

const HASH_SALT = process.env.CERTIFICATE_SALT || "rolenest-internship-ledger-2026";

export function computeInternshipVerificationHash(
  id: string,
  recipientName: string,
  trackId: string,
  issuedAt: string
): string {
  return crypto
    .createHmac("sha256", HASH_SALT)
    .update(`${id}|${recipientName.trim().toLowerCase()}|${trackId}|${issuedAt}`)
    .digest("hex")
    .slice(0, 16)
    .toUpperCase();
}

export function generateInternshipCertificateId(track: BootcampTrack): string {
  const prefix = track.certificateSpec.prefix || "TECH";
  const randomHex = crypto.randomBytes(8).toString("hex").toUpperCase();
  return `RN-INT-2026-${prefix}-${randomHex}`;
}

// Built-in verified showcase certificates for college inspection & public demonstration
export const SHOWCASE_INTERNSHIP_CERTIFICATES: InternshipCertificate[] = [
  {
    id: "RN-INT-2026-AIML-9F2B84",
    trackId: "ai-ml",
    trackTitle: "AI & Machine Learning Engineering Industrial Internship",
    certificateTitle: "Certified AI & Machine Learning Engineering Intern",
    recipientName: "John Dao",
    recipientEmail: "john.dao@example.com",
    collegeName: "Apex Institute of Engineering & Technology",
    degreeBranch: "B.Tech Computer Science & Engineering",
    rollNumber: "2022-CSE-1042",
    issuedAt: "2026-09-24T12:00:00.000Z",
    durationLabel: "4 Weeks / 160 Hours Intensive Industrial Internship",
    skills: ["PyTorch", "Transformers", "NumPy & Vector Math", "Vector Databases", "LangChain", "FastAPI", "Model Deployment"],
    capstoneTitle: "Enterprise Multi-Modal RAG & Agentic Knowledge Core",
    githubUrl: "https://github.com/johndao/enterprise-multimodal-rag",
    verificationHash: computeInternshipVerificationHash(
      "RN-INT-2026-AIML-9F2B84",
      "John Dao",
      "ai-ml",
      "2026-09-24T12:00:00.000Z"
    ),
    score: 98,
    grade: "O",
    verified: true,
    status: "HONOR_ROLL",
    mentorName: "Dr. Aryan Verma",
    mentorTitle: "RoleNest Technical Education Lead & Ex-Google Staff AI Engineer",
    academicCredits: "4 Credits Recommended (AICTE/UGC Credit Framework)",
    aicteCompliant: true,
  },
  {
    id: "RN-INT-2026-CYBER-3A7D11",
    trackId: "cyber-security",
    trackTitle: "Cyber Security & Ethical Hacking Industrial Internship",
    certificateTitle: "Certified Cyber Security & Ethical Hacking Intern",
    recipientName: "Rohan Kulkarni",
    recipientEmail: "rohan.kulkarni@college.edu.in",
    collegeName: "Pune Institute of Computer Technology (PICT)",
    degreeBranch: "B.E. Information Technology",
    rollNumber: "IT-2022-892",
    issuedAt: "2026-09-22T10:30:00.000Z",
    durationLabel: "4 Weeks / 160 Hours Intensive Industrial Internship",
    skills: ["Network Security", "OWASP Top 10", "Burp Suite", "Penetration Testing", "Wireshark", "Cryptography", "Linux Hardening"],
    capstoneTitle: "Enterprise Vulnerability Assessment & Defensive Blueprint",
    githubUrl: "https://github.com/rohan-cyber/penetration-audit-suite",
    verificationHash: computeInternshipVerificationHash(
      "RN-INT-2026-CYBER-3A7D11",
      "Rohan Kulkarni",
      "cyber-security",
      "2026-09-22T10:30:00.000Z"
    ),
    score: 94,
    grade: "A+",
    verified: true,
    status: "VERIFIED",
    mentorName: "Col. Sanjeev Nair (Retd.)",
    mentorTitle: "Principal Information Defense Advisor • RoleNest Virtual Labs",
    academicCredits: "4 Credits Recommended (AICTE/UGC Credit Framework)",
    aicteCompliant: true,
  },
  {
    id: "RN-INT-2026-FSNEXT-7E81C4",
    trackId: "fullstack-nextjs",
    trackTitle: "Full-Stack Next.js 15 & Cloud Architecture Internship",
    certificateTitle: "Certified Full-Stack Next.js 15 & Cloud Developer",
    recipientName: "Sneha Reddy",
    recipientEmail: "sneha.reddy@gmail.com",
    collegeName: "Vellore Institute of Technology (VIT Vellore)",
    degreeBranch: "B.Tech Computer Science with Spec. in Cloud Computing",
    rollNumber: "22BCE1492",
    issuedAt: "2026-09-20T16:45:00.000Z",
    durationLabel: "4 Weeks / 160 Hours Intensive Industrial Internship",
    skills: ["React 19", "Next.js 15", "TypeScript", "Drizzle ORM", "PostgreSQL", "Redis", "Server Actions", "Tailwind CSS"],
    capstoneTitle: "Commercial Multi-Tenant SaaS Platform with Subscriptions",
    githubUrl: "https://github.com/sneha-reddy/enterprise-saas-cloud",
    verificationHash: computeInternshipVerificationHash(
      "RN-INT-2026-FSNEXT-7E81C4",
      "Sneha Reddy",
      "fullstack-nextjs",
      "2026-09-20T16:45:00.000Z"
    ),
    score: 96,
    grade: "A+",
    verified: true,
    status: "VERIFIED",
    mentorName: "Divyanshu Jethi",
    mentorTitle: "Chief Technology Officer & Lead Architect • RoleNest India",
    academicCredits: "4 Credits Recommended (AICTE/UGC Credit Framework)",
    aicteCompliant: true,
  },
  {
    id: "RN-INT-2026-JAVA-5C42F9",
    trackId: "enterprise-java",
    trackTitle: "Enterprise Java & Spring Boot Cloud Backend Internship",
    certificateTitle: "Certified Enterprise Java & Spring Boot Developer",
    recipientName: "Aditya Verma",
    recipientEmail: "aditya.v@iitbhu.ac.in",
    collegeName: "Indian Institute of Technology (BHU) Varanasi",
    degreeBranch: "B.Tech Electrical & Computer Engineering",
    rollNumber: "21085012",
    issuedAt: "2026-09-18T14:15:00.000Z",
    durationLabel: "4 Weeks / 160 Hours Intensive Industrial Internship",
    skills: ["Java 21", "Spring Boot 3", "Spring Data JPA", "Hibernate", "Apache Kafka", "PostgreSQL", "Microservices", "Docker"],
    capstoneTitle: "Enterprise Distributed Banking Transaction Engine",
    githubUrl: "https://github.com/aditya-verma/banking-core-kafka",
    verificationHash: computeInternshipVerificationHash(
      "RN-INT-2026-JAVA-5C42F9",
      "Aditya Verma",
      "enterprise-java",
      "2026-09-18T14:15:00.000Z"
    ),
    score: 97,
    grade: "O",
    verified: true,
    status: "HONOR_ROLL",
    mentorName: "Vikram Malhotra",
    mentorTitle: "Senior Staff Cloud Systems Architect • RoleNest Advisory",
    academicCredits: "4 Credits Recommended (AICTE/UGC Credit Framework)",
    aicteCompliant: true,
  },
];

export function lookupInternshipCertificate(id: string): InternshipCertificate | null {
  const normalized = id.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
  const match = SHOWCASE_INTERNSHIP_CERTIFICATES.find((c) => c.id === normalized);
  if (match) return match;

  if (
    normalized === "JOHN-DAO" ||
    normalized === "JOHNDAO" ||
    normalized === "JOHN-DOE" ||
    normalized === "JOHNDOE" ||
    normalized === "AIML-SAMPLE" ||
    normalized === "SAMPLE"
  ) {
    return SHOWCASE_INTERNSHIP_CERTIFICATES[0] || null;
  }

  return null;
}
