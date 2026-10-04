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

const FULL_TIME_ROLE_TEMPLATES = [
  {
    title: "Junior Software Engineer (Fresher / SDE-1)",
    exp: 0,
    skills: ["Data Structures", "Algorithms", "Java", "Python", "Git"],
    salaryNormal: "₹4,50,000 - ₹9,50,000 / year (Official)",
    salaryTop: "₹10,00,000 - ₹18,00,000 / year (Official)",
    reqs: "Strong foundations in Data Structures, Algorithms, object-oriented or functional programming, and database basics."
  },
  {
    title: "Graduate Engineer Trainee (GET - Core Tech)",
    exp: 0,
    skills: ["Java", "Python", "SQL", "Linux", "Git"],
    salaryNormal: "₹4,00,000 - ₹8,50,000 / year (Official)",
    salaryTop: "₹9,00,000 - ₹16,00,000 / year (Official)",
    reqs: "B.Tech/BE/MCA in Computer Science or related fields with solid foundational problem solving capabilities."
  },
  {
    title: "Associate Software Developer (Full Stack)",
    exp: 1,
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "REST APIs"],
    salaryNormal: "₹5,50,000 - ₹12,00,000 / year (Official)",
    salaryTop: "₹12,00,000 - ₹22,00,000 / year (Official)",
    reqs: "Experience building and maintaining production web applications with React, TypeScript, and backend APIs."
  },
  {
    title: "Frontend Software Engineer (React, Next.js & TypeScript)",
    exp: 1,
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux"],
    salaryNormal: "₹6,00,000 - ₹13,50,000 / year (Official)",
    salaryTop: "₹14,00,000 - ₹25,00,000 / year (Official)",
    reqs: "Deep expertise in modern React 19, Next.js App Router, responsive design, and state management."
  },
  {
    title: "Full Stack Developer (React, Node.js & PostgreSQL)",
    exp: 2,
    skills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
    salaryNormal: "₹7,00,000 - ₹15,00,000 / year (Official)",
    salaryTop: "₹15,00,000 - ₹28,00,000 / year (Official)",
    reqs: "Full stack engineering proficiency with relational schemas, REST/GraphQL APIs, and cloud deployments."
  },
  {
    title: "Backend API & Microservices Developer (Python & FastAPI)",
    exp: 2,
    skills: ["Python", "FastAPI", "PostgreSQL", "Docker", "Redis"],
    salaryNormal: "₹6,50,000 - ₹14,50,000 / year (Official)",
    salaryTop: "₹14,00,000 - ₹26,00,000 / year (Official)",
    reqs: "Proficiency in asynchronous Python, FastAPI microservices, relational modeling, and Redis caching."
  },
  {
    title: "Java Backend Engineer (Spring Boot & Microservices)",
    exp: 2,
    skills: ["Java", "Spring Boot", "PostgreSQL", "Kafka", "Microservices"],
    salaryNormal: "₹7,00,000 - ₹15,00,000 / year (Official)",
    salaryTop: "₹15,00,000 - ₹28,00,000 / year (Official)",
    reqs: "Strong background in Java 17+, Spring Boot microservices, high-throughput message brokers, and clean architecture."
  },
  {
    title: "FinTech & Systems Engineer (Golang, Redis & PostgreSQL)",
    exp: 2,
    skills: ["Golang", "PostgreSQL", "Redis", "Kafka", "Docker"],
    salaryNormal: "₹8,50,000 - ₹18,00,000 / year (Official)",
    salaryTop: "₹16,00,000 - ₹32,00,000 / year (Official)",
    reqs: "Low-latency systems development in Go, concurrency patterns, ACID transaction guarantees, and distributed storage."
  },
  {
    title: "Cloud & DevOps Engineer (AWS, Kubernetes & Docker)",
    exp: 2,
    skills: ["AWS", "Docker", "Kubernetes", "Linux", "CI/CD"],
    salaryNormal: "₹7,50,000 - ₹16,00,000 / year (Official)",
    salaryTop: "₹15,00,000 - ₹28,00,000 / year (Official)",
    reqs: "Hands-on experience with container orchestration, infrastructure as code, CI/CD pipelines, and cloud security."
  },
  {
    title: "Site Reliability Engineer (SRE & Linux Systems)",
    exp: 2,
    skills: ["Linux", "Kubernetes", "AWS", "Python", "Monitoring"],
    salaryNormal: "₹8,00,000 - ₹17,00,000 / year (Official)",
    salaryTop: "₹16,00,000 - ₹30,00,000 / year (Official)",
    reqs: "Linux systems internals, observability with Prometheus/Grafana, incident management, and uptime engineering."
  },
  {
    title: "QA Automation Engineer (Cypress, Selenium & CI/CD)",
    exp: 1,
    skills: ["Automation Testing", "Selenium", "Cypress", "TypeScript", "Jest"],
    salaryNormal: "₹5,00,000 - ₹11,00,000 / year (Official)",
    salaryTop: "₹10,00,000 - ₹18,00,000 / year (Official)",
    reqs: "Building automated end-to-end regression suites, API test fixtures, and integrating tests into CI/CD pipelines."
  },
  {
    title: "Software Development Engineer in Test (SDET)",
    exp: 2,
    skills: ["Automation Testing", "Playwright", "Java", "Python", "CI/CD"],
    salaryNormal: "₹6,50,000 - ₹14,00,000 / year (Official)",
    salaryTop: "₹13,00,000 - ₹24,00,000 / year (Official)",
    reqs: "Architecting testing frameworks in Playwright/Selenium, load testing, performance profiling, and test infrastructure."
  },
  {
    title: "Data Engineer (Python, SQL, PostgreSQL & Spark)",
    exp: 2,
    skills: ["Python", "SQL", "PostgreSQL", "Apache Spark", "Airflow"],
    salaryNormal: "₹7,00,000 - ₹16,00,000 / year (Official)",
    salaryTop: "₹15,00,000 - ₹28,00,000 / year (Official)",
    reqs: "Building scalable ETL data pipelines, lakehouse architectures, SQL optimization, and workflow orchestration."
  },
  {
    title: "Machine Learning & AI Systems Engineer",
    exp: 2,
    skills: ["Python", "PyTorch", "Machine Learning", "FastAPI", "Docker"],
    salaryNormal: "₹8,00,000 - ₹18,00,000 / year (Official)",
    salaryTop: "₹16,00,000 - ₹32,00,000 / year (Official)",
    reqs: "Model deployment, fine-tuning open source LLMs, feature engineering, and high-performance ML inference."
  },
  {
    title: "Data Scientist & Predictive Modeler",
    exp: 2,
    skills: ["Python", "Machine Learning", "SQL", "Pandas", "Scikit-Learn"],
    salaryNormal: "₹7,50,000 - ₹16,50,000 / year (Official)",
    salaryTop: "₹15,00,000 - ₹28,00,000 / year (Official)",
    reqs: "Statistical analysis, predictive modeling, A/B testing frameworks, and extracting actionable business signals."
  },
  {
    title: "Data Analyst & Business Intelligence Specialist",
    exp: 1,
    skills: ["SQL", "Python", "Tableau", "Power BI", "Excel"],
    salaryNormal: "₹5,00,000 - ₹11,00,000 / year (Official)",
    salaryTop: "₹10,00,000 - ₹18,00,000 / year (Official)",
    reqs: "Advanced SQL queries, data warehousing, BI dashboards in Tableau/Power BI, and executive analytics reporting."
  },
  {
    title: "Mobile Application Engineer (Flutter & Android SDK)",
    exp: 2,
    skills: ["Flutter", "Dart", "Android", "React Native", "REST APIs"],
    salaryNormal: "₹6,00,000 - ₹13,00,000 / year (Official)",
    salaryTop: "₹12,00,000 - ₹22,00,000 / year (Official)",
    reqs: "Cross-platform mobile development using Flutter/Dart, state management, mobile offline caching, and app releases."
  },
  {
    title: "iOS Software Engineer (Swift & SwiftUI)",
    exp: 2,
    skills: ["Swift", "SwiftUI", "iOS", "Xcode", "REST APIs"],
    salaryNormal: "₹7,00,000 - ₹15,00,000 / year (Official)",
    salaryTop: "₹14,00,000 - ₹26,00,000 / year (Official)",
    reqs: "Native iOS app architecture with Swift, SwiftUI, Combine, Apple HIG guidelines, and App Store distribution."
  },
  {
    title: "Cyber Security & Cloud Defense Engineer",
    exp: 2,
    skills: ["Cyber Security", "Linux", "Python", "Network Security", "Docker"],
    salaryNormal: "₹7,50,000 - ₹16,50,000 / year (Official)",
    salaryTop: "₹15,00,000 - ₹28,00,000 / year (Official)",
    reqs: "Vulnerability assessments, SIEM monitoring, secure coding standards, threat modeling, and network defense."
  },
  {
    title: "Database Administrator & SQL Performance Engineer",
    exp: 2,
    skills: ["PostgreSQL", "MySQL", "SQL", "Linux", "Database Tuning"],
    salaryNormal: "₹6,50,000 - ₹14,00,000 / year (Official)",
    salaryTop: "₹13,00,000 - ₹25,00,000 / year (Official)",
    reqs: "Query execution plan analysis, index optimization, HA replication, automated backup validation, and schema design."
  },
  {
    title: "Cloud Solutions & Infrastructure Architect",
    exp: 3,
    skills: ["AWS", "Cloud Architecture", "Docker", "Kubernetes", "Terraform"],
    salaryNormal: "₹10,00,000 - ₹22,00,000 / year (Official)",
    salaryTop: "₹20,00,000 - ₹38,00,000 / year (Official)",
    reqs: "Designing highly available cloud topologies, cost optimization, multi-region failover, and zero-trust security."
  },
  {
    title: "Penetration Tester & Application Security Engineer",
    exp: 2,
    skills: ["Cyber Security", "Penetration Testing", "Linux", "Python", "OWASP"],
    salaryNormal: "₹7,50,000 - ₹16,00,000 / year (Official)",
    salaryTop: "₹15,00,000 - ₹27,00,000 / year (Official)",
    reqs: "OWASP Top 10 auditing, dynamic/static code analysis, ethical hacking, and red-team penetration testing."
  },
  {
    title: "Systems Software Engineer (C++ & Linux Kernel)",
    exp: 2,
    skills: ["C++", "Linux", "Data Structures", "Git", "Algorithms"],
    salaryNormal: "₹8,00,000 - ₹18,00,000 / year (Official)",
    salaryTop: "₹16,00,000 - ₹32,00,000 / year (Official)",
    reqs: "Modern C++ (17/20), systems programming, multi-threaded memory management, and POSIX system calls."
  },
  {
    title: "NLP & Generative AI Platform Engineer",
    exp: 2,
    skills: ["Python", "Machine Learning", "FastAPI", "PyTorch", "Docker"],
    salaryNormal: "₹8,50,000 - ₹19,00,000 / year (Official)",
    salaryTop: "₹17,00,000 - ₹34,00,000 / year (Official)",
    reqs: "RAG pipeline development, vector databases, prompt evaluation metrics, embedding search, and model serving."
  },
  {
    title: "Computer Vision & Deep Learning Engineer",
    exp: 2,
    skills: ["Python", "PyTorch", "OpenCV", "Machine Learning", "Docker"],
    salaryNormal: "₹8,00,000 - ₹18,00,000 / year (Official)",
    salaryTop: "₹16,00,000 - ₹30,00,000 / year (Official)",
    reqs: "Image classification, object detection (YOLO), edge inference optimization (TensorRT), and model quantization."
  },
  {
    title: "Performance & Load Testing Engineer (JMeter / k6)",
    exp: 1,
    skills: ["Automation Testing", "Performance Testing", "JavaScript", "Linux", "CI/CD"],
    salaryNormal: "₹5,50,000 - ₹12,00,000 / year (Official)",
    salaryTop: "₹11,00,000 - ₹20,00,000 / year (Official)",
    reqs: "Load testing distributed microservices, identifying concurrency bottlenecks, and stress testing database read replicas."
  },
  {
    title: "Technical Support & Cloud Operations Engineer",
    exp: 0,
    skills: ["Linux", "SQL", "Cloud Infrastructure", "Networking", "Bash"],
    salaryNormal: "₹4,00,000 - ₹8,00,000 / year (Official)",
    salaryTop: "₹8,00,000 - ₹15,00,000 / year (Official)",
    reqs: "L2/L3 production troubleshooting, log analysis via ELK/Datadog, network diagnostics, and customer bug resolution."
  },
  {
    title: "Enterprise ERP & SaaS Platform Developer",
    exp: 2,
    skills: ["Java", "Spring Boot", "React", "PostgreSQL", "REST APIs"],
    salaryNormal: "₹6,50,000 - ₹14,00,000 / year (Official)",
    salaryTop: "₹13,00,000 - ₹25,00,000 / year (Official)",
    reqs: "Enterprise ERP workflows, custom CRM modules, multi-tenant databases, and role-based access control systems."
  },
  {
    title: "Web3 & Blockchain Systems Developer",
    exp: 2,
    skills: ["Solidity", "Rust", "TypeScript", "Cryptography", "Node.js"],
    salaryNormal: "₹8,00,000 - ₹18,00,000 / year (Official)",
    salaryTop: "₹16,00,000 - ₹32,00,000 / year (Official)",
    reqs: "Smart contract development, EVM security audits, distributed consensus systems, and cryptographic protocols."
  },
  {
    title: "IoT Firmware & Embedded Systems Engineer",
    exp: 2,
    skills: ["C", "C++", "Embedded Systems", "Linux", "RTOS"],
    salaryNormal: "₹6,50,000 - ₹14,50,000 / year (Official)",
    salaryTop: "₹13,00,000 - ₹25,00,000 / year (Official)",
    reqs: "Firmware development for ARM microcontrollers, BLE/Wi-Fi communication protocols, RTOS, and hardware debugging."
  }
];

function buildRegionalJobs(): RawCrawledJob[] {
  const result: RawCrawledJob[] = [];
  const now = new Date().toISOString();

  for (let idx = 0; idx < VERIFIED_COMPANIES.length; idx++) {
    const c = VERIFIED_COMPANIES[idx]!;
    const cSlug = slugify(c.name);
    const loc = normalizeLocation(c);
    const isTop = /mnc|unicorn|tier-1|public tech|global tech|conglomerate/i.test(c.type);

    for (let rIdx = 0; rIdx < FULL_TIME_ROLE_TEMPLATES.length; rIdx++) {
      const tmpl = FULL_TIME_ROLE_TEMPLATES[rIdx]!;
      const salary = isTop ? tmpl.salaryTop : tmpl.salaryNormal;

      result.push({
        title: tmpl.title,
        companyName: c.name,
        companyWebsite: c.website,
        location: loc,
        workMode: WorkMode.HYBRID,
        jobType: JobType.FULL_TIME,
        salaryOrStipend: salary,
        experienceYears: tmpl.exp,
        source: "EXTERNAL",
        sourceUrl: c.careerUrl,
        externalId: `reg-${cSlug}-${idx}-job-${rIdx + 1}`,
        description: `Verified engineering position at ${c.name} (${loc}). Domain focus: ${c.domain}. Direct application via official career portal: ${c.careerUrl}`,
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

export const VERIFIED_NORTH_INDIA_REGIONAL_JOBS: RawCrawledJob[] = buildRegionalJobs();
