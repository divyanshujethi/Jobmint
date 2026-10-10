import { describe, it, expect } from "vitest";
import {
  isDirectAtsOrCompanyUrl,
  cleanCompanyName,
  isValidCompanyName,
  CrawledJobPayloadSchema,
  JobType,
  WorkMode,
} from "@repo/shared";
import {
  evaluateIndiaTechGatekeeper,
  classifyTechRole,
} from "../job-alligator/india-gatekeeper";
import { extractResponsibilities } from "../../../../apps/web/lib/db-jobs";

describe("Phase 1: Ingestion Pipeline & Data Integrity Gatekeeper", () => {
  describe("1. Direct ATS vs Secondary Aggregator URL Enforcement", () => {
    it("accepts authentic enterprise ATS endpoints", () => {
      expect(isDirectAtsOrCompanyUrl("https://boards.greenhouse.io/gitlab/jobs/12345")).toBe(true);
      expect(isDirectAtsOrCompanyUrl("https://jobs.lever.co/cred/abcdef")).toBe(true);
      expect(isDirectAtsOrCompanyUrl("https://jobs.ashbyhq.com/postman/98765")).toBe(true);
      expect(isDirectAtsOrCompanyUrl("https://browserstack.wd3.myworkdayjobs.com/External/job/1")).toBe(true);
      expect(isDirectAtsOrCompanyUrl("https://jobs.smartrecruiters.com/Freshworks/54321")).toBe(true);
      expect(isDirectAtsOrCompanyUrl("https://razorpay.darwinbox.in/ms/candidate/careers")).toBe(true);
      expect(isDirectAtsOrCompanyUrl("https://company.breezy.hr/p/12345")).toBe(true);
      expect(isDirectAtsOrCompanyUrl("https://careers.google.com/jobs/results/123")).toBe(true);
    });

    it("strictly rejects secondary scraped aggregator and middleman URLs", () => {
      expect(isDirectAtsOrCompanyUrl("https://www.foundit.in/job/sde-1-12345")).toBe(false);
      expect(isDirectAtsOrCompanyUrl("https://www.naukri.com/job-listings-python-dev-12345")).toBe(false);
      expect(isDirectAtsOrCompanyUrl("https://internshala.com/internship/detail/web-dev-at-xyz123")).toBe(false);
      expect(isDirectAtsOrCompanyUrl("https://in.indeed.com/viewjob?jk=abcdef")).toBe(false);
      expect(isDirectAtsOrCompanyUrl("https://www.shine.com/jobs/react-dev/123")).toBe(false);
      expect(isDirectAtsOrCompanyUrl("https://in.adzuna.com/details/12345")).toBe(false);
      expect(isDirectAtsOrCompanyUrl("https://in.jooble.org/desc/12345")).toBe(false);
      expect(isDirectAtsOrCompanyUrl("https://jobspipe.com/job/12345")).toBe(false);
    });
  });

  describe("2. Company Entity Resolution & Sanitization", () => {
    it("cleans scraper artifact suffixes from company names", () => {
      expect(cleanCompanyName("Amazon at Foundit Verified Employer")).toBe("Amazon");
      expect(cleanCompanyName("Foundit Verified Employer")).toBe("");
      expect(cleanCompanyName("Flipkart at Naukri Verified Employer")).toBe("Flipkart");
      expect(cleanCompanyName("Zomato at Internshala")).toBe("Zomato");
    });

    it("strips accidental trailing city and location bleeding", () => {
      expect(cleanCompanyName("Razorpay India Bengaluru")).toBe("Razorpay");
      expect(cleanCompanyName("Swiggy Bengaluru")).toBe("Swiggy");
      expect(cleanCompanyName("PhonePe Hyderabad")).toBe("PhonePe");
      expect(cleanCompanyName("Cred Pune")).toBe("Cred");
    });

    it("strips misclassified role prefixes", () => {
      expect(cleanCompanyName("Manager OpenText")).toBe("OpenText");
      expect(cleanCompanyName("Lead Experian")).toBe("Experian");
    });

    it("validates company entity legitimacy", () => {
      expect(isValidCompanyName("Amazon")).toBe(true);
      expect(isValidCompanyName("Razorpay")).toBe(true);
      expect(isValidCompanyName("Foundit Verified Employer")).toBe(false);
      expect(isValidCompanyName("Naukri Verified Employer")).toBe(false);
      expect(isValidCompanyName("Engineers Llp")).toBe(false);
      expect(isValidCompanyName("India")).toBe(false);
      expect(isValidCompanyName("A")).toBe(false);
    });
  });

  describe("3. Strict Role-Level Tech Gatekeeper (Non-Tech Elimination)", () => {
    it("strictly rejects sales, marketing, and non-tech titles", () => {
      const salesRole = classifyTechRole("Part Time Business Development Sales");
      expect(salesRole.isTech).toBe(false);
      expect(salesRole.roleCategory).toBe("non_tech");

      const marketingRole = classifyTechRole("Digital Marketing Intern");
      expect(marketingRole.isTech).toBe(false);
      expect(marketingRole.roleCategory).toBe("non_tech");

      const bpoRole = classifyTechRole("Customer Support Associate - Voice Process");
      expect(bpoRole.isTech).toBe(false);

      const hrRole = classifyTechRole("Technical Recruiter & Talent Sourcing Specialist");
      expect(hrRole.isTech).toBe(false);

      const financeRole = classifyTechRole("Accounts Payable & Billing Executive");
      expect(financeRole.isTech).toBe(false);
    });

    it("accepts genuine software, AI, and technical roles", () => {
      const sde = classifyTechRole("Software Development Engineer I (Backend)");
      expect(sde.isTech).toBe(true);
      expect(sde.roleCategory).toBe("software");

      const ai = classifyTechRole("Generative AI & LLM Research Engineer");
      expect(ai.isTech).toBe(true);
      expect(ai.roleCategory).toBe("ai_ml");

      const devops = classifyTechRole("Site Reliability Engineer (Kubernetes/AWS)");
      expect(devops.isTech).toBe(true);
      expect(devops.roleCategory).toBe("devops_cloud");

      const intern = classifyTechRole("Frontend Engineering Intern (React/TypeScript)");
      expect(intern.isTech).toBe(true);
    });

    it("evaluates end-to-end gatekeeper decisions", () => {
      const evalReject = evaluateIndiaTechGatekeeper(
        "Part Time Business Development Sales",
        "Bengaluru, Karnataka"
      );
      expect(evalReject.accepted).toBe(false);
      expect(evalReject.role.isTech).toBe(false);

      const evalAccept = evaluateIndiaTechGatekeeper(
        "Backend Developer (Go / Distributed Systems)",
        "Bengaluru, Karnataka"
      );
      expect(evalAccept.accepted).toBe(true);
      expect(evalAccept.role.isTech).toBe(true);
      expect(evalAccept.location.isIndiaEligible).toBe(true);
    });
  });

  describe("4. Strict Zod Runtime Ingestion Schema", () => {
    it("validates authentic direct ATS payload", () => {
      const validPayload = {
        title: "Software Engineer - Payments Infrastructure",
        companyName: "Razorpay India Bengaluru", // will be cleaned to "Razorpay"
        location: "Bengaluru, Karnataka",
        workMode: WorkMode.HYBRID,
        jobType: JobType.FULL_TIME,
        salaryOrStipend: "₹18,00,000 - ₹28,00,000 PA",
        sourceUrl: "https://boards.greenhouse.io/razorpay/jobs/99999",
        externalId: "razorpay-99999",
        description: "Join the core banking engineering team building high-availability ledger and transaction processors.",
        skills: ["Go", "PostgreSQL", "Kafka", "Distributed Systems"],
        isGhostRisk: false,
        truthScore: 92,
      };

      const result = CrawledJobPayloadSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.companyName).toBe("Razorpay");
      }
    });

    it("rejects payload with secondary aggregator URL", () => {
      const invalidUrlPayload = {
        title: "Senior Java Developer",
        companyName: "Cognizant",
        location: "Pune, Maharashtra",
        workMode: WorkMode.ON_SITE,
        jobType: JobType.FULL_TIME,
        sourceUrl: "https://www.naukri.com/job-listings-java-dev-12345",
        externalId: "naukri-12345",
        description: "Enterprise Java development role with microservices and Spring Boot.",
        skills: ["Java", "Spring Boot"],
        truthScore: 80,
      };

      const result = CrawledJobPayloadSchema.safeParse(invalidUrlPayload);
      expect(result.success).toBe(false);
    });

    it("rejects payload with generic scraper entity name", () => {
      const invalidCompanyPayload = {
        title: "Frontend Developer",
        companyName: "Foundit Verified Employer",
        location: "Noida, Uttar Pradesh",
        workMode: WorkMode.REMOTE,
        jobType: JobType.FULL_TIME,
        sourceUrl: "https://boards.greenhouse.io/sample/123",
        externalId: "sample-123",
        description: "Build modern web applications with React and Next.js.",
        skills: ["React"],
        truthScore: 85,
      };

      const result = CrawledJobPayloadSchema.safeParse(invalidCompanyPayload);
      expect(result.success).toBe(false);
    });
  });

  describe("5. Dynamic Responsibilities Extraction & Anti-Boilerplate Integrity", () => {
    it("extracts actual responsibilities from job descriptions with bullet points", () => {
      const description = `
        About RoleNest:
        We are building India's developer careers platform.

        Key Responsibilities:
        - Design and maintain real-time telemetry streaming pipelines.
        - Build resilient backend microservices with Go and PostgreSQL.
        - Optimize query execution times across multi-tenant databases.

        Requirements:
        - 3+ years experience with Go.
      `;

      const extracted = extractResponsibilities(description);
      expect(extracted.length).toBe(3);
      expect(extracted[0]).toContain("Design and maintain real-time telemetry streaming pipelines");
      expect(extracted[1]).toContain("Build resilient backend microservices");
    });

    it("returns empty array instead of injecting fake software developer boilerplate when none exist", () => {
      const description = "Short generic overview of the position without bullet points.";
      const extracted = extractResponsibilities(description);
      expect(extracted).toEqual([]);
    });
  });
});
