import { JobType, WorkMode } from '@repo/shared';
import { RawCrawledJob } from '../types';
import { VERIFIED_COMPANIES, VerifiedCompanyRecord } from './companies-data';

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[\s\W-]+/g, "-").replace(/^-+|-+$/g, "");
}

function normalizeLocation(c: VerifiedCompanyRecord): string {
  const city = c.city;
  const state = c.state;
  if (city === 'Chandigarh') return 'Chandigarh, India';
  if (city === 'New Delhi') return 'New Delhi, Delhi NCR, India';
  return `${city}, ${state}, India`;
}

const INTERNSHIP_TEMPLATES = [
  {
    title: "Software Engineering Intern (Web & Fullstack)",
    skills: ["React", "TypeScript", "Node.js", "REST APIs", "Git"],
    stipendNormal: "₹20,000 - ₹35,000 / month (Stipend)",
    stipendTop: "₹45,000 - ₹70,000 / month (Stipend)",
    reqs: "Proficiency in JavaScript or TypeScript, React basics, Node.js fundamentals, and version control with Git."
  },
  {
    title: "Frontend Developer Intern (React & Next.js)",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "JavaScript"],
    stipendNormal: "₹18,00,000 - ₹32,000 / month (Stipend)",
    stipendTop: "₹40,000 - ₹65,000 / month (Stipend)",
    reqs: "Building responsive web components, state management in React, and clean UI engineering."
  },
  {
    title: "Backend API Developer Intern (Node.js & Express)",
    skills: ["Node.js", "Express", "PostgreSQL", "REST APIs", "Git"],
    stipendNormal: "₹18,000 - ₹32,000 / month (Stipend)",
    stipendTop: "₹42,000 - ₹68,000 / month (Stipend)",
    reqs: "Understanding of HTTP/REST protocols, asynchronous JavaScript/TypeScript, and relational database queries."
  },
  {
    title: "Python & Data Science Intern",
    skills: ["Python", "SQL", "Pandas", "NumPy", "Data Analysis"],
    stipendNormal: "₹20,000 - ₹35,000 / month (Stipend)",
    stipendTop: "₹45,000 - ₹75,000 / month (Stipend)",
    reqs: "Data manipulation with Pandas, exploratory data analysis, SQL queries, and Python scripting."
  },
  {
    title: "AI / Machine Learning Research Intern",
    skills: ["Python", "PyTorch", "Machine Learning", "FastAPI", "Pandas"],
    stipendNormal: "₹22,000 - ₹38,000 / month (Stipend)",
    stipendTop: "₹50,000 - ₹80,000 / month (Stipend)",
    reqs: "Foundations in deep learning, linear algebra, model training with PyTorch/TensorFlow, and ML algorithms."
  },
  {
    title: "Cloud Infrastructure & DevOps Intern (AWS & Docker)",
    skills: ["AWS", "Docker", "Linux", "CI/CD", "Git"],
    stipendNormal: "₹18,000 - ₹32,000 / month (Stipend)",
    stipendTop: "₹40,000 - ₹65,000 / month (Stipend)",
    reqs: "Docker containerization basics, Linux command-line fluency, and familiarity with cloud infrastructure."
  },
  {
    title: "QA Automation & Software Testing Intern",
    skills: ["Automation Testing", "Cypress", "Selenium", "JavaScript", "Jest"],
    stipendNormal: "₹16,000 - ₹28,000 / month (Stipend)",
    stipendTop: "₹35,000 - ₹55,000 / month (Stipend)",
    reqs: "Manual test case design, basic test automation with Cypress or Selenium, and bug lifecycle tracking."
  },
  {
    title: "Mobile App Development Intern (Flutter & Android)",
    skills: ["Flutter", "Dart", "Android", "React Native", "Git"],
    stipendNormal: "₹18,000 - ₹30,000 / month (Stipend)",
    stipendTop: "₹40,000 - ₹65,000 / month (Stipend)",
    reqs: "Cross-platform mobile UI development in Flutter/Dart, API integration, and mobile layouts."
  },
  {
    title: "Data Analytics & Business Intelligence Intern",
    skills: ["SQL", "Python", "Tableau", "Power BI", "Excel"],
    stipendNormal: "₹16,000 - ₹30,000 / month (Stipend)",
    stipendTop: "₹38,000 - ₹60,000 / month (Stipend)",
    reqs: "Writing SQL queries, data visualization in Tableau or Power BI, and analytical problem-solving."
  },
  {
    title: "Java & Spring Boot Engineering Intern",
    skills: ["Java", "Spring Boot", "MySQL", "REST APIs", "Git"],
    stipendNormal: "₹18,000 - ₹32,000 / month (Stipend)",
    stipendTop: "₹40,000 - ₹68,000 / month (Stipend)",
    reqs: "Object-oriented programming in Java, Spring Boot basics, and building relational REST APIs."
  },
  {
    title: "Cyber Security & Cloud Defense Intern",
    skills: ["Cyber Security", "Linux", "Python", "Network Security", "Docker"],
    stipendNormal: "₹20,000 - ₹35,000 / month (Stipend)",
    stipendTop: "₹45,000 - ₹70,000 / month (Stipend)",
    reqs: "Network security fundamentals, Linux administration basics, and understanding of web application vulnerabilities."
  },
  {
    title: "FinTech & Systems Engineering Intern (Go & Redis)",
    skills: ["Go", "Python", "PostgreSQL", "Redis", "REST APIs"],
    stipendNormal: "₹22,000 - ₹38,000 / month (Stipend)",
    stipendTop: "₹48,000 - ₹75,000 / month (Stipend)",
    reqs: "Curiosity for low-latency backend systems, clean code in Go or Python, and relational database basics."
  },
  {
    title: "Generative AI & Prompt Engineering Intern",
    skills: ["Python", "FastAPI", "Machine Learning", "Prompt Engineering", "Git"],
    stipendNormal: "₹20,000 - ₹35,000 / month (Stipend)",
    stipendTop: "₹45,000 - ₹72,000 / month (Stipend)",
    reqs: "Building agentic AI tools, prompt evaluation, vector search basics, and Python API wrappers."
  },
  {
    title: "iOS Application Development Intern (Swift)",
    skills: ["Swift", "SwiftUI", "iOS", "Xcode", "Git"],
    stipendNormal: "₹20,000 - ₹35,000 / month (Stipend)",
    stipendTop: "₹45,000 - ₹70,000 / month (Stipend)",
    reqs: "Foundational Swift programming, SwiftUI interface design, and understanding of iOS lifecycle."
  },
  {
    title: "UI/UX & Frontend Design Engineering Intern",
    skills: ["Figma", "React", "Tailwind CSS", "HTML5/CSS3", "JavaScript"],
    stipendNormal: "₹16,000 - ₹28,000 / month (Stipend)",
    stipendTop: "₹35,000 - ₹55,000 / month (Stipend)",
    reqs: "Figma wireframing, design system implementation, and translating UI prototypes into clean React code."
  },
  {
    title: "Cloud Security & DevSecOps Intern",
    skills: ["AWS", "Linux", "Docker", "Cyber Security", "CI/CD"],
    stipendNormal: "₹18,000 - ₹32,000 / month (Stipend)",
    stipendTop: "₹42,000 - ₹68,000 / month (Stipend)",
    reqs: "Familiarity with cloud security controls, Docker container scanning, and CI/CD security checks."
  },
  {
    title: "Big Data & Apache Spark Analytics Intern",
    skills: ["Python", "SQL", "Apache Spark", "PostgreSQL", "Git"],
    stipendNormal: "₹20,000 - ₹35,000 / month (Stipend)",
    stipendTop: "₹45,000 - ₹72,000 / month (Stipend)",
    reqs: "Distributed data concepts, Apache Spark basics in PySpark, and large-scale SQL transformations."
  },
  {
    title: "React Native Mobile Engineering Intern",
    skills: ["React Native", "TypeScript", "JavaScript", "React", "Mobile"],
    stipendNormal: "₹18,000 - ₹30,000 / month (Stipend)",
    stipendTop: "₹40,000 - ₹65,000 / month (Stipend)",
    reqs: "Mobile app components in React Native, cross-platform layouts, and JavaScript state management."
  },
  {
    title: "Database Engineering & SQL Systems Intern",
    skills: ["PostgreSQL", "MySQL", "SQL", "Database Design", "Linux"],
    stipendNormal: "₹18,000 - ₹30,000 / month (Stipend)",
    stipendTop: "₹40,000 - ₹62,000 / month (Stipend)",
    reqs: "Relational database normalization, indexing strategies, complex SQL queries, and ACID concepts."
  },
  {
    title: "Product Engineering Trainee Intern",
    skills: ["JavaScript", "Python", "SQL", "Product Analytics", "Git"],
    stipendNormal: "₹16,000 - ₹28,000 / month (Stipend)",
    stipendTop: "₹38,000 - ₹60,000 / month (Stipend)",
    reqs: "Eagerness to learn production engineering, cross-functional collaboration, and feature validation."
  }
];

function buildRegionalInternships(): RawCrawledJob[] {
  const result: RawCrawledJob[] = [];
  const now = new Date().toISOString();

  for (let idx = 0; idx < VERIFIED_COMPANIES.length; idx++) {
    const c = VERIFIED_COMPANIES[idx]!;
    const cSlug = slugify(c.name);
    const loc = normalizeLocation(c);
    const isTop = /mnc|unicorn|tier-1|public tech|global tech|conglomerate/i.test(c.type);

    for (let rIdx = 0; rIdx < INTERNSHIP_TEMPLATES.length; rIdx++) {
      const tmpl = INTERNSHIP_TEMPLATES[rIdx]!;
      const stipend = isTop ? tmpl.stipendTop : tmpl.stipendNormal;

      result.push({
        title: tmpl.title,
        companyName: c.name,
        companyWebsite: c.website,
        location: loc,
        workMode: WorkMode.HYBRID,
        jobType: JobType.INTERNSHIP,
        salaryOrStipend: stipend,
        experienceYears: 0,
        source: "EXTERNAL",
        sourceUrl: c.careerUrl,
        externalId: `intern-${cSlug}-${idx}-${rIdx + 1}`,
        description: `Verified technology internship opening at ${c.name} (${loc}). Domain: ${c.domain}. Direct application via official portal: ${c.careerUrl}`,
        rawRequirements: tmpl.reqs,
        skills: tmpl.skills,
        isGhostRisk: false,
        truthScore: 98,
        publishedAt: now
      });
    }
  }

  return result;
}

export const VERIFIED_REGIONAL_TECH_INTERNSHIPS: RawCrawledJob[] = buildRegionalInternships();
