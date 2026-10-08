# RoleNest 🪺

> **Find opportunities without being left guessing.**

[![Next.js 15](https://img.shields.io/badge/Next.js-15.2.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-5.8.2_Strict-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.39-C5F74F?style=flat-square)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![DPDP Act 2023](https://img.shields.io/badge/DPDP_Act_2023-Compliant-emerald?style=flat-square)](https://rolenest.in/privacy)
[![Cashfree Payments](https://img.shields.io/badge/Cashfree-Verified_Partner-10b981?style=flat-square)](https://cashfree.com)

**RoleNest** ([rolenest.in](https://rolenest.in)) is an open, transparent, candidate-first tech careers platform built specifically for Indian students, freshers, and early-career software developers. Engineered and maintained by **RitualDev Lab** ([ritualdev.in](https://ritualdev.in)).

---

## 🎯 The Core Problem & Our Mission

Every year, millions of Indian engineering students face an opaque hiring market polluted by:
1. **Ghost Postings**: Postings kept open for months to harvest candidate resumes with no active hiring intent.
2. **Unpaid/Exploitative Roles**: Unpaid "internships" that demand 40+ hours a week without stipends.
3. **Black Box Tracking**: Candidates submit dozens of applications across disparate job boards and are left completely in the dark.
4. **Scam Gatekeeping**: Portals charging candidates upfront fees simply to reveal application links.

**RoleNest dismantles this broken cycle.** We offer direct ATS links, enforce mandatory stipend floors on tech internships, provide zero-paywall application links, and empower candidates with a private application journal and standard ATS resume tools.

---

## 💎 The 3 Core Pillars (Launch Scope)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           ROLENEST CORE                                 │
├───────────────────────┬─────────────────────────┬───────────────────────┤
│       PILLAR 1        │        PILLAR 2         │       PILLAR 3        │
│  Verified Tech Jobs   │   Application Tracker   │   ATS Resume Builder  │
│   & Paid Internships  │   & Smart Journaling    │   & STAR Bullet AI    │
│                       │                         │                       │
│ • Direct ATS links    │ • Status pipeline       │ • Jake's resume style │
│ • 14-21d TTL freshness│ • Smart follow-up pings │ • LaTeX + PDF exports │
│ • Strict stipend rule │ • 100% private to user  │ • Token bucket limits │
│ • Zero candidate fees │ • Ghosting reminders    │ • Explainable match   │
└───────────────────────┴─────────────────────────┴───────────────────────┘
```

### Pillar 1: Verified Tech Jobs & Paid Internships
- **Direct ATS Application Links**: Immediate handoff to company applicant tracking systems (Greenhouse, Lever, Ashby, Workday, BambooHR, Darwinbox).
- **Strict Anti-Exploitation Policy**: All engineering internships must provide fair compensation; unpaid technical roles are rejected by automated truth filters.
- **Automated TTL & Freshness Guarantee**: Postings automatically expire after 14–21 days to prevent stale links.
- **Google for Jobs Schema**: Full `JobPosting` Schema.org JSON-LD support with `directApply: true` on every role.

### Pillar 2: Application Tracker & Personal Journaling
- A clean, organized personal dashboard to manage applied roles, interview rounds, and notes.
- Timely reminders for follow-ups and candidate-reported status changes.
- **Zero Employer Spyware**: Transparently operates as a candidate-owned application journal without claiming unverified employer-side telemetric access.

### Pillar 3: Single-Column ATS Resume Builder & AI Bullet Improver
- Clean, battle-tested single-column standard resume formats (inspired by Jake's Resume and top tech industry standards).
- Real-time LaTeX compilation and PDF downloads.
- AI-assisted STAR methodology bullet refiner with strict Redis token-bucket rate limiting to prevent abuse.

---

## 🧪 RoleNest Labs (Beta & Community Features)

To maintain focus on the core hiring journey, secondary community tools reside in **RoleNest Labs**:
- **Problem of the Day (POTD)**: Daily coding challenges with automated test-case runner and XP.
- **Daily Streaks & Leaderboard**: Gamified engineering consistency tracker.
- **Peer Study Pods**: Collaborative virtual study rooms with live video/chat for interview prep.
- **Visual Skill Canvas**: Interactive graph-based career skill node mastery.
- **Open Career Roadmaps**: Curated milestones for Frontend, Backend, DevOps, and AI/ML.
- **Candidate Salary Benchmarks**: Transparent, community-reported compensation and response time insights.
- **Campus Placement Syndication**: College TPO coordination portal for student cohorts.

---

## 🏗️ Monorepo Architecture

The project is structured as a high-performance **Turborepo** monorepo:

```
jobapp/
├── apps/
│   ├── web/                    # Next.js 15 App Router web application
│   │   ├── app/                # Pages, API routes, RSS feed, sitemap
│   │   ├── components/         # React 19 UI components & modals
│   │   └── lib/                # Client & server utilities, auth, rate limiting
│   └── mobile/                 # React Native / Expo companion app
├── packages/
│   ├── database/               # PostgreSQL schema & Drizzle ORM client
│   ├── shared/                 # Shared TypeScript types, config, constants
│   ├── ai/                     # Multi-key Groq pool & self-hosted Ollama (Zero Google AI)
│   ├── alligators/             # Autonomous ATS crawlers & soft-404 truth verifier
│   ├── storage/                # Encrypted S3/Cloudflare R2 driver with signed URLs
│   ├── email/                  # Transactional email templates & transporter
│   └── matching/               # Real-time explainable candidate matching
├── deploy/                     # OCI Always Free Docker Compose & systemd configs
└── scripts/                    # Database backups, crawler crons, DB seeding
```

---

## 🔒 Security, Hygiene & DPDP Act 2023 Compliance

RoleNest adheres to the **Digital Personal Data Protection (DPDP) Act, 2023** and strict security standards:

- **RBI-Compliant Payment Security**: Cashfree webhook verification uses server-side HMAC-SHA256 signature verification (`x-webhook-signature`).
- **IDOR Protection on Resumes**: All file access streams enforce authenticated session checks and cryptographic permission validation.
- **DPDP Section 11 (Data Portability)**: Authenticated users can instantly download an encrypted personal data archive (`/api/account/export`).
- **DPDP Section 12 (Right to Erasure & Nominee Appointment)**: Complete account deletion cascades across profiles, resumes, and saved applications. Nominee registration is fully supported.
- **Universal AI Rate Limiting**: All generative endpoints are shielded by Redis sliding-window token buckets to prevent DDoS and quota exhaustion.
- **PII Redaction**: Sentry session recordings automatically mask all candidate inputs, passwords, phone numbers, and addresses.
- **Automated Disaster Recovery**: Production-ready automated backup script (`scripts/db-backup.sh`) with gzip compression, checksum hashing, and retention rotation.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.x or v22.x LTS
- **pnpm**: v10.x or v11.x (`corepack enable pnpm`)
- **PostgreSQL**: v16+ (or Supabase / Neon / Docker)
- **Redis**: v7+ (for rate limiting and job queues)

### 1. Clone & Install
```bash
git clone https://github.com/divyanshujethi/Jobmint.git rolenest
cd rolenest
pnpm install
```

### 2. Environment Configuration
Copy the sample environment file and configure your credentials:
```bash
cp .env.example .env
```

Key environment variables:
```ini
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secure-random-secret"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rolenest"
REDIS_URL="redis://localhost:6379"
GROQ_API_KEYS="gsk_key1,gsk_key2,gsk_key3,gsk_key4,gsk_key5"
OLLAMA_BASE_URL="http://127.0.0.1:11434"
CASHFREE_APP_ID="your-cashfree-app-id"
CASHFREE_SECRET_KEY="your-cashfree-secret-key"
```

### 3. Database Migration & Seeding
```bash
# Push schema to database
pnpm --filter @repo/database db:push

# (Optional) Run ATS crawler or sample seeds
pnpm alligator:crawl
```

### 4. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Verification Standard & Transparency

We believe users should always know where job data comes from. Our 3-tier verification hierarchy:
1. **Tier 1 — Direct ATS Verified**: Direct API/RSS feeds from Greenhouse, Lever, Ashby, Workday, etc.
2. **Tier 2 — Direct Company Career Page**: Crawled directly from verified corporate domains.
3. **Tier 3 — Community Reported**: Submitted by users or campus placement cells, flagged as unverified until reviewed.

Read our complete policy at [rolenest.in/transparency](https://rolenest.in/transparency).

---

## 👥 Authors & Maintainers

- **RoleNest** is designed and operated by **RitualDev Lab** ([ritualdev.in](https://ritualdev.in)).
- **Founder & Lead Maintainer**: Divyanshu Jethi ([@divyanshujethi](https://github.com/divyanshujethi))
- **Support & Inquiries**: [support@rolenest.in](mailto:support@rolenest.in)

---

## 📄 License

This monorepo and its core packages are proprietary software managed by RitualDev Lab. All rights reserved.
