"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  GraduationCap,
  Award,
  BookOpen,
  ExternalLink,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Search,
  Sparkles,
  Clock,
  Coins,
  Briefcase,
  ArrowRight,
  Info,
  Calendar,
  Layers,
  Check,
  ChevronRight
} from "lucide-react";

interface GovJob {
  id: string;
  orgName: string;
  orgCategory: "Research" | "Ministry" | "PSU" | "Banking" | "State" | "Apprenticeship" | "ThirdPartyAgency";
  title: string;
  employmentType?: "Permanent / Gazetted" | "Short-Term Contract / Apprenticeship" | "Third-Party Agency Vendor";
  contractDuration?: string;
  payLevel: string;
  approxMonthlySalary: string;
  qualification: string;
  selectionProcess: "GATE Score + Interview" | "Written Exam (CBT) + Interview" | "Prelims + Mains + Interview" | "Direct Interview / Project Assessment" | "Merit-based (B.Tech % / NATS Portal)" | "Technical Assessment + Vendor Interview";
  officialPortalUrl: string;
  notificationUrl: string;
  applicationDeadline: string;
  tags: string[];
  status: "Active / Ongoing" | "Upcoming Annual Drive" | "Rolling Recruitment";
  description: string;
  vacancies: string;
}

const GOV_TECH_JOBS: GovJob[] = [
  {
    id: "nic-scientist-b",
    orgName: "National Informatics Centre (NIC / NIELIT)",
    orgCategory: "Ministry",
    title: "Scientist 'B' & Scientific/Technical Assistant 'A'",
    payLevel: "7th CPC Level 10 (₹56,100 - ₹1,77,500)",
    approxMonthlySalary: "₹1,12,000 / month (Gross)",
    qualification: "B.E. / B.Tech (CS / IT / ECE) or MCA / M.Sc (CS/IT)",
    selectionProcess: "Written Exam (CBT) + Interview",
    officialPortalUrl: "https://recruitment.nic.in",
    notificationUrl: "https://www.calicut.nielit.in/nic23/",
    applicationDeadline: "Annual National Recruitment Cycle",
    tags: ["Central Govt", "Group A Gazetted", "National Informatics", "Permanent"],
    status: "Upcoming Annual Drive",
    description: "Architect and scale India's digital public infrastructure including DigiLocker, Aadhaar integrations, PM-Kisan, and state cloud data centers.",
    vacancies: "598+ Posts (Typical Annual Intake)"
  },
  {
    id: "isro-scientist-sc",
    orgName: "Indian Space Research Organisation (ISRO / ICRB)",
    orgCategory: "Research",
    title: "Scientist / Engineer 'SC' (Computer Science & Software)",
    payLevel: "7th CPC Level 10 (₹56,100 - ₹1,77,500)",
    approxMonthlySalary: "₹1,15,000 / month (Gross + Space Allowance)",
    qualification: "B.Tech in CS/IT with min 65% aggregate or 6.84 CGPA",
    selectionProcess: "Written Exam (CBT) + Interview",
    officialPortalUrl: "https://www.isro.gov.in/Careers.html",
    notificationUrl: "https://www.isro.gov.in/Careers.html",
    applicationDeadline: "ICRB National Examination Drive",
    tags: ["Space Tech", "ISRO", "Satellite Mission Systems", "Permanent"],
    status: "Upcoming Annual Drive",
    description: "Develop real-time flight software, telemetry processing engines, satellite image analysis pipelines, and mission control systems.",
    vacancies: "80+ Tech Positions"
  },
  {
    id: "drdo-scientist-b",
    orgName: "Defence Research & Development Organisation (DRDO / RAC)",
    orgCategory: "Research",
    title: "Scientist 'B' (Computer Science & Cybersecurity)",
    payLevel: "7th CPC Level 10 (₹56,100 - ₹1,77,500)",
    approxMonthlySalary: "₹1,12,000 / month (Gross + Defence Perks)",
    qualification: "First Class B.E./B.Tech in CS/IT + Valid GATE Score",
    selectionProcess: "GATE Score + Interview",
    officialPortalUrl: "https://rac.gov.in",
    notificationUrl: "https://rac.gov.in/index.php?lang=en&id=0",
    applicationDeadline: "Rolling / Annual GATE Shortlist",
    tags: ["Defence", "Cybersecurity", "Cryptanalysis", "AI/ML Systems"],
    status: "Active / Ongoing",
    description: "Build secure operating kernels, military-grade cryptosystems, tactical edge AI models, and electronic warfare software suites at CAIR and SAG.",
    vacancies: "150+ Scientist Posts"
  },
  {
    id: "cdac-project-engineer",
    orgName: "Centre for Development of Advanced Computing (C-DAC)",
    orgCategory: "PSU",
    title: "Project Engineer / Senior Project Engineer (AI & HPC)",
    payLevel: "Consolidated ₹4.5 - ₹14.5 Lakhs per Annum",
    approxMonthlySalary: "₹65,000 - ₹1,20,000 / month",
    qualification: "B.E. / B.Tech / MCA in CS / IT / Electronics",
    selectionProcess: "Direct Interview / Project Assessment",
    officialPortalUrl: "https://www.cdac.in/index.aspx?id=current_jobs",
    notificationUrl: "https://www.cdac.in/index.aspx?id=current_jobs",
    applicationDeadline: "Continuous / Rolling Recruitment",
    tags: ["High Performance Computing", "PARAM Supercomputer", "AI Research", "National Mission"],
    status: "Active / Ongoing",
    description: "Lead development on India's National Supercomputing Mission (NSM), distributed parallel algorithms, and indigenous microprocessor software ecosystems.",
    vacancies: "250+ Multi-Centre Openings"
  },
  {
    id: "npci-tech",
    orgName: "National Payments Corporation of India (NPCI)",
    orgCategory: "PSU",
    title: "Core Software Engineer / Blockchain Specialist",
    payLevel: "Competitive Market CTC (₹8 - ₹24 Lakhs/yr)",
    approxMonthlySalary: "₹85,000 - ₹1,80,000 / month",
    qualification: "B.Tech/M.Tech (CS/IT) with strong Distributed Systems foundation",
    selectionProcess: "Written Exam (CBT) + Interview",
    officialPortalUrl: "https://www.npci.org.in/who-we-are/careers",
    notificationUrl: "https://www.npci.org.in/who-we-are/careers",
    applicationDeadline: "Active Lateral & Graduate Hiring",
    tags: ["Fintech", "UPI Platform", "High Throughput", "Real-Time Settlement"],
    status: "Active / Ongoing",
    description: "Design and maintain high-concurrency payment architectures powering billions of UPI, IMPS, NETC FASTag, and RuPay transactions each month.",
    vacancies: "45+ Openings"
  },
  {
    id: "cris-software-engineer",
    orgName: "Centre for Railway Information Systems (CRIS / Indian Railways)",
    orgCategory: "PSU",
    title: "Assistant Software Engineer (ASE) & Data Analyst",
    payLevel: "7th CPC Level 7/8 (₹44,900 - ₹1,42,400 + Railway Perks)",
    approxMonthlySalary: "₹92,000 / month (Gross)",
    qualification: "B.E./B.Tech in CS/IT/MCA with valid GATE Score",
    selectionProcess: "GATE Score + Interview",
    officialPortalUrl: "https://cris.org.in/crisweb/design1/careers.jsp",
    notificationUrl: "https://cris.org.in/crisweb/design1/careers.jsp",
    applicationDeadline: "Annual Post-GATE Drive",
    tags: ["Railways", "IRCTC Engine", "Distributed DB", "GATE Mandatory"],
    status: "Upcoming Annual Drive",
    description: "Build mission-critical ticketing systems (PRS), National Train Enquiry System (NTES), and high-availability freight operations management databases.",
    vacancies: "150+ Posts"
  },
  {
    id: "barc-scientific-officer",
    orgName: "Bhabha Atomic Research Centre (BARC / DAE)",
    orgCategory: "Research",
    title: "Scientific Officer 'C' (Computer Science / Cybernetics)",
    payLevel: "7th CPC Level 10 (₹56,100 - ₹1,77,500)",
    approxMonthlySalary: "₹1,18,000 / month (Gross + Nuclear Allowance)",
    qualification: "B.E./B.Tech in CS with min 60% or valid GATE Score",
    selectionProcess: "GATE Score + Interview",
    officialPortalUrl: "https://barcocesexam.in",
    notificationUrl: "https://barcocesexam.in",
    applicationDeadline: "OCES / DGFS Annual Selection",
    tags: ["Nuclear Research", "Scientific Computing", "Cybernetics", "Permanent"],
    status: "Upcoming Annual Drive",
    description: "Develop SCADA reactor safety telemetry systems, embedded real-time software, and nuclear computational models in Trombay and Kalpakkam.",
    vacancies: "40+ Specialist Posts"
  },
  {
    id: "cert-in-security-analyst",
    orgName: "Indian Computer Emergency Response Team (CERT-In / MeitY)",
    orgCategory: "Ministry",
    title: "Cyber Security Analyst & Threat Intelligence Engineer",
    payLevel: "7th CPC Level 10 / Contract ₹85k-₹1.6L/mo",
    approxMonthlySalary: "₹1,10,000 / month",
    qualification: "B.E./B.Tech (CS/IT/InfoSec) or M.Tech (Cyber Security)",
    selectionProcess: "Written Exam (CBT) + Interview",
    officialPortalUrl: "https://www.cert-in.org.in",
    notificationUrl: "https://www.meity.gov.in/vacancies",
    applicationDeadline: "MeitY Regular Recruitment",
    tags: ["Cyber Defense", "Incident Response", "Malware Analysis", "National Security"],
    status: "Active / Ongoing",
    description: "Guard India's critical information infrastructure from advanced persistent threats (APTs), zero-day exploits, and foreign state cyber intrusions.",
    vacancies: "25+ Security Roles"
  },
  {
    id: "bel-software-engineer",
    orgName: "Bharat Electronics Limited (BEL - Navratna PSU)",
    orgCategory: "PSU",
    title: "Project Engineer / Trainee Engineer (Software Systems)",
    payLevel: "Consolidated ₹40,000 - ₹55,000 / month + Incentives",
    approxMonthlySalary: "₹52,000 / month",
    qualification: "B.E. / B.Tech in CS / IT / Electronics (First Class)",
    selectionProcess: "Written Exam (CBT) + Interview",
    officialPortalUrl: "https://bel-india.in/Careers/",
    notificationUrl: "https://bel-india.in/Careers/",
    applicationDeadline: "Rolling Unit Notifications",
    tags: ["Defence Electronics", "Radar Systems", "Avionics Software", "Navratna"],
    status: "Active / Ongoing",
    description: "Develop software for defence radars, naval sonars, electronic voting machines (EVMs), and secure military communication transceivers.",
    vacancies: "110+ Posts across Bangalore/Ghaziabad"
  },
  {
    id: "ecil-technical-officer",
    orgName: "Electronics Corporation of India Limited (ECIL)",
    orgCategory: "PSU",
    title: "Technical Officer (Software & Embedded Applications)",
    payLevel: "Consolidated ₹25,000 - ₹35,000 / month",
    approxMonthlySalary: "₹35,000 / month",
    qualification: "Engineering Graduate in CS / IT / ECE with 60% marks",
    selectionProcess: "Direct Interview / Project Assessment",
    officialPortalUrl: "https://www.ecil.co.in/jobs.html",
    notificationUrl: "https://www.ecil.co.in/jobs.html",
    applicationDeadline: "Walk-in & Online Application",
    tags: ["Embedded Tech", "Hardware Interface", "Hyderabad Base"],
    status: "Active / Ongoing",
    description: "Work on control instrumentation software, communication hardware interfaces, and security equipment deployment.",
    vacancies: "60+ Openings"
  },
  {
    id: "iocl-is-officer",
    orgName: "Indian Oil Corporation Limited (IOCL - Maharatna PSU)",
    orgCategory: "PSU",
    title: "Information Systems Officer (Grade A / CS)",
    payLevel: "E-2 Grade (₹50,000 - ₹1,60,000 + Maharatna Allowances)",
    approxMonthlySalary: "₹1,25,000 / month (Gross CTC ~₹17.3 LPA)",
    qualification: "Full-time B.E. / B.Tech in CS / IT with min 65% aggregate + Valid GATE",
    selectionProcess: "GATE Score + Interview",
    officialPortalUrl: "https://iocl.com/latest-job",
    notificationUrl: "https://iocl.com/latest-job",
    applicationDeadline: "Annual Post-GATE Cycle",
    tags: ["Maharatna", "Enterprise ERP", "Industrial IoT", "Cloud Infrastructure"],
    status: "Upcoming Annual Drive",
    description: "Architect refinery automation software, nationwide SAP ERP systems, smart terminal pipelines, and digital supply chain analytics.",
    vacancies: "35+ Officers"
  },
  {
    id: "ntpc-it-executive",
    orgName: "NTPC Limited (Maharatna PSU)",
    orgCategory: "PSU",
    title: "Executive Trainee (IT / Systems)",
    payLevel: "E-1 Grade (₹40,000 - ₹1,40,000 + Performance Related Pay)",
    approxMonthlySalary: "₹1,05,000 / month (Gross CTC ~₹15 LPA)",
    qualification: "Engineering Degree in CS / IT / Data Science with min 65% marks",
    selectionProcess: "GATE Score + Interview",
    officialPortalUrl: "https://careers.ntpc.co.in",
    notificationUrl: "https://careers.ntpc.co.in",
    applicationDeadline: "Annual National Recruitment",
    tags: ["Maharatna", "Power Grid SCADA", "Data Engineering", "Permanent"],
    status: "Upcoming Annual Drive",
    description: "Oversee mission-critical power generation SCADA databases, IT infrastructure networks, and enterprise renewable energy dashboards.",
    vacancies: "25+ Posts"
  },
  {
    id: "ongc-programming-officer",
    orgName: "Oil and Natural Gas Corporation (ONGC - Maharatna PSU)",
    orgCategory: "PSU",
    title: "Programming Officer (Class I Executive)",
    payLevel: "E-1 Level (₹60,000 - ₹1,80,000 + 35% Cafeteria Perks)",
    approxMonthlySalary: "₹1,30,000 / month (Gross CTC ~₹21 LPA)",
    qualification: "Graduate Engineering in CS/IT or Post Graduate in CS/IT with min 60%",
    selectionProcess: "GATE Score + Interview",
    officialPortalUrl: "https://ongcindia.com/web/eng/career",
    notificationUrl: "https://ongcindia.com/web/eng/career",
    applicationDeadline: "Annual GATE Shortlist",
    tags: ["Maharatna", "Subsurface Computing", "Seismic Data Processing", "Permanent"],
    status: "Upcoming Annual Drive",
    description: "High-performance cluster management, seismic imaging algorithms, deepwater telemetry systems, and geological cloud infrastructure.",
    vacancies: "20+ Posts"
  },
  {
    id: "bhel-engineer-trainee",
    orgName: "Bharat Heavy Electricals Limited (BHEL)",
    orgCategory: "PSU",
    title: "Engineer Trainee (Computer Science)",
    payLevel: "E-1 Grade (₹50,000 - ₹1,60,000 + Industrial Perks)",
    approxMonthlySalary: "₹95,000 / month",
    qualification: "Full time B.Tech in CS / IT with min 65% marks or 6.5 CGPA",
    selectionProcess: "Written Exam (CBT) + Interview",
    officialPortalUrl: "https://careers.bhel.in",
    notificationUrl: "https://careers.bhel.in",
    applicationDeadline: "Central CBT Drive",
    tags: ["Maharatna", "Industrial Automation", "Simulation Systems"],
    status: "Upcoming Annual Drive",
    description: "Develop embedded controls for heavy turbines, industrial plant simulation engines, and enterprise defence telemetry systems.",
    vacancies: "30+ Trainees"
  },
  {
    id: "sbi-sco-it",
    orgName: "State Bank of India (SBI Central Recruitment)",
    orgCategory: "Banking",
    title: "Specialist Cadre Officer (SCO) - Deputy Manager / Manager (IT)",
    payLevel: "MMGS-II / MMGS-III (Basic ₹64,820 - ₹1,00,000 + Bank Perks)",
    approxMonthlySalary: "₹1,35,000 / month (Gross CTC ~₹19 - ₹24 LPA)",
    qualification: "B.E. / B.Tech (CS / IT / ECE) or MCA / M.Sc (CS/IT) with 60% aggregate",
    selectionProcess: "Written Exam (CBT) + Interview",
    officialPortalUrl: "https://sbi.co.in/web/careers",
    notificationUrl: "https://sbi.co.in/web/careers/current-openings",
    applicationDeadline: "Annual SBI SCO Notification",
    tags: ["Public Sector Bank", "Core Banking YONO", "Cloud Infra", "Fintech Scale"],
    status: "Upcoming Annual Drive",
    description: "Scale YONO super-app architecture, secure core banking transaction switches (CBS), handle anti-fraud telemetry, and microservices cloud clusters.",
    vacancies: "150+ IT Specialist Posts"
  },
  {
    id: "ibps-so-it",
    orgName: "Institute of Banking Personnel Selection (IBPS)",
    orgCategory: "Banking",
    title: "IT Officer (Scale I) - Public Sector Banks (PNB, BOB, Canara)",
    payLevel: "Junior Management Grade Scale I (₹48,480 - ₹85,920)",
    approxMonthlySalary: "₹72,000 / month (Gross + Lease Allowance)",
    qualification: "4-year Engineering Degree in CS / IT / Electronics or PG in CS/IT",
    selectionProcess: "Prelims + Mains + Interview",
    officialPortalUrl: "https://www.ibps.in",
    notificationUrl: "https://www.ibps.in",
    applicationDeadline: "Annual CRP SPL Nationwide Cycle",
    tags: ["PSB Banking", "National Recruitment", "Fintech Ops", "Permanent"],
    status: "Upcoming Annual Drive",
    description: "Manage bank core IT infrastructure, database replication, ATM switch interconnects, cyber security audits, and payment gateway APIs.",
    vacancies: "220+ Across 11 Nationalized Banks"
  },
  {
    id: "rbi-grade-b-depr",
    orgName: "Reserve Bank of India (RBI Services Board)",
    orgCategory: "Banking",
    title: "Officer Grade 'B' (Information Technology / Data Science)",
    payLevel: "RBI Grade B Pay Scale (Basic ₹55,200 + ₹1.16L Perks & Allowances)",
    approxMonthlySalary: "₹1,45,000 / month (Gross CTC ~₹24 LPA)",
    qualification: "B.Tech in CS/IT or MCA with min 60% marks + 2 years tech experience",
    selectionProcess: "Prelims + Mains + Interview",
    officialPortalUrl: "https://opportunities.rbi.org.in",
    notificationUrl: "https://opportunities.rbi.org.in/scripts/vacancies.aspx",
    applicationDeadline: "Annual RBI Services Board Drive",
    tags: ["Central Bank", "Monetary Policy Tech", "RTGS / NEFT Core", "High Prestige"],
    status: "Upcoming Annual Drive",
    description: "Develop monetary data warehouse pipelines, RTGS/NEFT national clearing systems, digital rupee (CBDC) platforms, and systemic cyber defense architecture.",
    vacancies: "35+ Grade B Officers"
  },
  {
    id: "sebi-it-officer",
    orgName: "Securities and Exchange Board of India (SEBI)",
    orgCategory: "Banking",
    title: "Officer Grade 'A' (Assistant Manager - Information Technology)",
    payLevel: "SEBI Grade A (Basic ₹44,500 + Heavy Allowances)",
    approxMonthlySalary: "₹1,40,000 / month (Gross CTC ~₹22.5 LPA)",
    qualification: "Engineering Graduate in CS/IT or MCA or Post Graduate in CS/IT",
    selectionProcess: "Prelims + Mains + Interview",
    officialPortalUrl: "https://www.sebi.gov.in/sebiweb/other/career.jsp",
    notificationUrl: "https://www.sebi.gov.in/sebiweb/other/career.jsp",
    applicationDeadline: "Annual Phase I/II Selection",
    tags: ["Capital Markets", "Stock Exchange Telemetry", "Algo Trading Audits"],
    status: "Upcoming Annual Drive",
    description: "Build market surveillance AI systems, high-frequency algorithmic trading auditing pipelines, and stock exchange clearing interconnects.",
    vacancies: "24+ Grade A Officers"
  },
  {
    id: "nabard-it-officer",
    orgName: "NABARD (National Bank for Agriculture and Rural Development)",
    orgCategory: "Banking",
    title: "Assistant Manager (Grade 'A' - Information Technology)",
    payLevel: "Grade A Pay Scale (Basic ₹44,500 + Allowances)",
    approxMonthlySalary: "₹1,20,000 / month (Gross CTC ~₹18.5 LPA)",
    qualification: "Bachelor's Degree in CS/IT/Computer Applications with min 60% marks",
    selectionProcess: "Prelims + Mains + Interview",
    officialPortalUrl: "https://www.nabard.org/careers-notices1.aspx",
    notificationUrl: "https://www.nabard.org/careers-notices1.aspx",
    applicationDeadline: "Annual Grade A Recruitment",
    tags: ["Development Bank", "Agri-Fintech", "Rural Banking Systems", "Permanent"],
    status: "Upcoming Annual Drive",
    description: "Manage national rural banking cloud infrastructures, financial inclusion data analytics, and cooperative bank core IT modernizations.",
    vacancies: "18+ Officers"
  },
  {
    id: "powergrid-et-cs",
    orgName: "Power Grid Corporation of India Limited (POWERGRID - Maharatna)",
    orgCategory: "PSU",
    title: "Engineer Trainee (Computer Science / IT)",
    payLevel: "E-1 Grade (₹40,000 - ₹1,40,000 + Maharatna Benefits)",
    approxMonthlySalary: "₹1,15,000 / month (Gross CTC ~₹16.5 LPA)",
    qualification: "B.E. / B.Tech in CS/IT with min 65% aggregate + Valid GATE Score",
    selectionProcess: "GATE Score + Interview",
    officialPortalUrl: "https://www.powergrid.in/careers",
    notificationUrl: "https://www.powergrid.in/job-opportunities",
    applicationDeadline: "Annual Post-GATE Drive",
    tags: ["Maharatna", "Smart Grid SCADA", "Substation Telemetry", "Permanent"],
    status: "Upcoming Annual Drive",
    description: "Build national transmission grid monitoring SCADA networks, optical fiber telemetry routers, and renewable energy dispatch algorithms.",
    vacancies: "25+ Engineers"
  },
  {
    id: "coal-india-mt-cs",
    orgName: "Coal India Limited (CIL - Maharatna PSU)",
    orgCategory: "PSU",
    title: "Management Trainee (Systems / Computer Science)",
    payLevel: "E-2 Grade (₹50,000 - ₹1,60,000 + Coal Field Allowances)",
    approxMonthlySalary: "₹1,10,000 / month (Gross CTC ~₹16 LPA)",
    qualification: "B.E. / B.Tech / B.Sc (Engg) in CS/IT or MCA with min 60% marks",
    selectionProcess: "Written Exam (CBT) + Interview",
    officialPortalUrl: "https://www.coalindia.in/career-at-cil/",
    notificationUrl: "https://www.coalindia.in/career-at-cil/",
    applicationDeadline: "Open CBT / GATE Recruitment",
    tags: ["Maharatna", "Mining Telemetry", "Enterprise ERP", "Permanent"],
    status: "Upcoming Annual Drive",
    description: "Deploy automated mine dispatch software, IoT vehicle tracking sensor grids, enterprise SAP ERP systems, and environmental monitoring portals.",
    vacancies: "45+ Management Trainees"
  },
  {
    id: "gail-et-it",
    orgName: "GAIL (India) Limited (Maharatna PSU)",
    orgCategory: "PSU",
    title: "Executive Trainee (Information Technology / BIS)",
    payLevel: "E-1 Grade (₹60,000 - ₹1,80,000 + 35% PRP)",
    approxMonthlySalary: "₹1,25,000 / month (Gross CTC ~₹18 LPA)",
    qualification: "B.E. / B.Tech in CS / IT with min 65% aggregate + Valid GATE Score",
    selectionProcess: "GATE Score + Interview",
    officialPortalUrl: "https://gailonline.com/CRApplyingGail.html",
    notificationUrl: "https://gailonline.com/CRApplyingGail.html",
    applicationDeadline: "Annual GATE Shortlist",
    tags: ["Maharatna", "Gas Pipeline SCADA", "Cyber Security", "Permanent"],
    status: "Upcoming Annual Drive",
    description: "Architect natural gas pipeline control SCADA networks, industrial process control cybersecurity, and cross-country enterprise networks.",
    vacancies: "15+ Posts"
  },
  {
    id: "hal-engineer-cs",
    orgName: "Hindustan Aeronautics Limited (HAL - Navratna PSU)",
    orgCategory: "PSU",
    title: "Management Trainee / Design Trainee (Computer Science / Avionics)",
    payLevel: "Grade II (₹40,000 - ₹1,40,000 + Aviation Perks)",
    approxMonthlySalary: "₹90,000 / month (Gross CTC ~₹13.5 LPA)",
    qualification: "Full time Bachelor's Degree in Engineering / Technology in CS/IT (min 65%)",
    selectionProcess: "Written Exam (CBT) + Interview",
    officialPortalUrl: "https://hal-india.co.in/Careers/",
    notificationUrl: "https://hal-india.co.in/Careers/",
    applicationDeadline: "Annual All-India CBT Selection",
    tags: ["Defence Aerospace", "Fighter Jet Avionics", "Real-Time Embedded OS"],
    status: "Upcoming Annual Drive",
    description: "Write safety-critical real-time flight mission software, HUD avionics displays, and radar tracking digital signal processing algorithms.",
    vacancies: "40+ Positions"
  },
  {
    id: "bis-scientist-b-it",
    orgName: "Bureau of Indian Standards (BIS / Ministry of Consumer Affairs)",
    orgCategory: "Ministry",
    title: "Scientist 'B' (Computer Engineering / Information Technology)",
    payLevel: "7th CPC Level 10 (₹56,100 - ₹1,77,500)",
    approxMonthlySalary: "₹1,12,000 / month (Gross + Central Govt Perks)",
    qualification: "Bachelor's Degree in Engineering/Technology in CS/IT + Valid GATE Score",
    selectionProcess: "GATE Score + Interview",
    officialPortalUrl: "https://www.bis.gov.in/career-opportunities/",
    notificationUrl: "https://www.bis.gov.in/career-opportunities/",
    applicationDeadline: "Annual GATE Selection Window",
    tags: ["Central Govt", "Group A Gazetted", "National Standards", "Permanent"],
    status: "Upcoming Annual Drive",
    description: "Formulate national software quality benchmarks, smart grid IoT standards, AI ethics standards, and manage national certification databases.",
    vacancies: "20+ Scientist Posts"
  },
  {
    id: "state-discom-it-engineer",
    orgName: "State Electricity Transmission & DISCOMs (UPPCL / MSEDCL / BESCOM)",
    orgCategory: "State",
    title: "Assistant Engineer (Information Technology / Systems)",
    payLevel: "State 7th CPC Pay Scale (₹56,100 - ₹1,77,500)",
    approxMonthlySalary: "₹92,000 / month",
    qualification: "B.Tech in CS/IT from a recognized university with min 60% marks",
    selectionProcess: "Written Exam (CBT) + Interview",
    officialPortalUrl: "https://www.upenergy.in",
    notificationUrl: "https://www.upenergy.in/vacancies",
    applicationDeadline: "Periodic State Board Drives",
    tags: ["State Govt", "Smart Metering", "Billing Engines", "State PSUs"],
    status: "Active / Ongoing",
    description: "Architect statewide smart electrical metering (AMI) ingestion clusters, billing transaction systems, and real-time power outage tracking portals.",
    vacancies: "85+ Across State Entities"
  },
  {
    id: "state-psc-programmer",
    orgName: "State Public Service Commissions & NIC State Units (TNPSC / UPPSC / WBPSC)",
    orgCategory: "State",
    title: "Programmer Grade-I / Systems Manager",
    payLevel: "State Gazetted Level 9/10 (₹53,100 - ₹1,67,800)",
    approxMonthlySalary: "₹88,000 / month",
    qualification: "B.E./B.Tech (CS/IT) or MCA with First Class",
    selectionProcess: "Written Exam (CBT) + Interview",
    officialPortalUrl: "https://uppsc.up.nic.in",
    notificationUrl: "https://uppsc.up.nic.in",
    applicationDeadline: "State PSC Gazette Notification",
    tags: ["State Gazetted", "e-Governance", "State Portals", "Permanent"],
    status: "Active / Ongoing",
    description: "Develop state e-Governance public portals, land record digitisation engines (Bhoomi/Bhulekh), and state cloud data center operations.",
    vacancies: "110+ Posts"
  },
  {
    id: "nats-mhrd-graduate-apprentice",
    orgName: "National Apprenticeship Training Scheme (NATS / MoE India)",
    orgCategory: "Apprenticeship",
    employmentType: "Short-Term Contract / Apprenticeship",
    contractDuration: "1 Year Non-Renewable Apprenticeship",
    title: "Graduate Apprentice (Computer Science & Information Technology)",
    payLevel: "Government Stipend Norms (₹9,000 – ₹15,000 / month)",
    approxMonthlySalary: "₹12,000 / month (Govt Direct Benefit Transfer / DBT)",
    qualification: "B.E. / B.Tech in CS/IT (Graduated within last 3 years)",
    selectionProcess: "Merit-based (B.Tech % / NATS Portal)",
    officialPortalUrl: "https://nats.education.gov.in",
    notificationUrl: "https://nats.education.gov.in",
    applicationDeadline: "Continuous / Rolling NATS Portal Enrolment",
    tags: ["Short-Term Contract", "Apprenticeship", "Ministry of Education", "NATS DBT", "Fresher"],
    status: "Active / Ongoing",
    description: "⚠️ SHORT-TERM CONTRACT: 12-month structured industrial engineering training across central/state government departments and laboratories. Hands-on public infrastructure maintenance with zero commitment for regular absorption.",
    vacancies: "5,000+ Nationwide Vacancies"
  },
  {
    id: "state-dit-contract-developer",
    orgName: "State Department of IT & Electronics (HARTRON / UPDESCO / KELTRON)",
    orgCategory: "Apprenticeship",
    employmentType: "Short-Term Contract / Apprenticeship",
    contractDuration: "1 Year Contract (Extendable based on Project Budget)",
    title: "Contractual Software Developer / District IT Associate",
    payLevel: "Consolidated Fixed Honorarium (₹25,000 – ₹40,000 / month)",
    approxMonthlySalary: "₹32,000 / month (No DA / No HRA / No Pension)",
    qualification: "B.Tech (CS/IT) / BCA / MCA with minimum 55% marks",
    selectionProcess: "Written Exam (CBT) + Interview",
    officialPortalUrl: "https://hartron.org.in",
    notificationUrl: "https://hartron.org.in",
    applicationDeadline: "District-wise Rolling Notifications",
    tags: ["Short-Term Contract", "State e-Gov", "District IT", "Non-Permanent", "Contractual"],
    status: "Active / Ongoing",
    description: "⚠️ SHORT-TERM CONTRACT: Temporary project assignment maintaining district portal dashboards, citizen service CSC centers, and state beneficiary databases. Strictly temporary contractual honorarium with no government permanent status.",
    vacancies: "300+ State District Posts"
  },
  {
    id: "isro-drdo-jrf-contract",
    orgName: "ISRO / DRDO Sponsored Research Laboratories (SAC / DRDL / CAIR)",
    orgCategory: "Apprenticeship",
    employmentType: "Short-Term Contract / Apprenticeship",
    contractDuration: "2 Years JRF + 1 Year SRF (Project Tenure)",
    title: "Junior Research Fellow (JRF) - Computer Vision & Edge AI",
    payLevel: "DST Fellowship Norms: ₹37,000/mo + HRA (JRF) / ₹42,000/mo (SRF)",
    approxMonthlySalary: "₹45,000 / month (Fellowship + HRA)",
    qualification: "B.E. / B.Tech in CS/IT with valid GATE Score OR M.E. / M.Tech",
    selectionProcess: "GATE Score + Interview",
    officialPortalUrl: "https://www.isro.gov.in/Careers.html",
    notificationUrl: "https://rac.gov.in",
    applicationDeadline: "Lab-Specific Project Drives",
    tags: ["Short-Term Contract", "Research Fellowship", "JRF / SRF", "DST Norms", "AI/ML"],
    status: "Active / Ongoing",
    description: "⚠️ SHORT-TERM CONTRACT: Fixed 2 to 3-year term research fellowship on specific mission defense or space computing tasks. Ideal stepping stone to PhDs; does NOT carry regular Scientist appointment rights.",
    vacancies: "45+ Fellowships"
  },
  {
    id: "nicsi-tcs-vendor-contractor",
    orgName: "NICSI Empanelled Vendor - TCS / Wipro (National Portal Deployments)",
    orgCategory: "ThirdPartyAgency",
    employmentType: "Third-Party Agency Vendor",
    contractDuration: "Private Agency Employment (Deputed to Govt Sites)",
    title: "Third-Party Vendor Software Engineer (Deputed to NIC / Govt Ministries)",
    payLevel: "Private Agency CTC (₹4.0 LPA – ₹8.5 LPA)",
    approxMonthlySalary: "₹35,000 – ₹65,000 / month (Paid by Vendor)",
    qualification: "B.E. / B.Tech in CS/IT / MCA (Hired through Vendor Placement)",
    selectionProcess: "Technical Assessment + Vendor Interview",
    officialPortalUrl: "https://nicsi.com",
    notificationUrl: "https://nicsi.com/tenders",
    applicationDeadline: "Corporate Agency Lateral Hiring",
    tags: ["Third-Party Vendor", "Agency Staffing", "NICSI Empanelled", "Private Contract", "Onsite Deputation"],
    status: "Active / Ongoing",
    description: "⚠️ THIRD-PARTY VENDOR: You are legally employed by a private agency / SI (such as TCS, Wipro, or NICSI manpower vendors) and deputed on-site to build government ministry applications (e.g., Passport Seva, Income Tax 2.0). Governed entirely by private corporate contracts, not government payroll.",
    vacancies: "800+ Agency Deputations"
  },
  {
    id: "gem-manpower-agency-engineer",
    orgName: "GeM Government e-Marketplace Agency Staffing (Third-Party SIs)",
    orgCategory: "ThirdPartyAgency",
    employmentType: "Third-Party Agency Vendor",
    contractDuration: "Outsourced Agency Contract (Client Project Basis)",
    title: "Third-Party Cloud & Network Support Engineer (GeM Agency Outsource)",
    payLevel: "Agency Market Rate (₹22,000 – ₹45,000 / month)",
    approxMonthlySalary: "₹28,000 – ₹42,000 / month",
    qualification: "Diploma / B.Tech in CS/IT/ECE or BCA with networking certs",
    selectionProcess: "Technical Assessment + Vendor Interview",
    officialPortalUrl: "https://gem.gov.in",
    notificationUrl: "https://gem.gov.in",
    applicationDeadline: "Third-Party Staffing Pools",
    tags: ["Third-Party Vendor", "GeM Outsource", "Cloud Support", "Manpower Agency", "Private Payroll"],
    status: "Active / Ongoing",
    description: "⚠️ THIRD-PARTY VENDOR: Outsourced tech staff procured via the Government e-Marketplace (GeM) by ministries for IT helpdesk, data center rack maintenance, and LAN/WAN cabling. Hired and paid directly by third-party staffing agencies with zero civil service perks.",
    vacancies: "650+ Vendor Openings"
  }
];

export default function GovTechPage() {
  const [activeTab, setActiveTab] = useState<"openings" | "howToApply" | "payScale" | "syllabus" | "crawlerPolicy">("openings");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredJobs = useMemo(() => {
    return GOV_TECH_JOBS.filter((job) => {
      if (selectedCategory !== "ALL" && job.orgCategory !== selectedCategory) {
        return false;
      }
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesOrg = job.orgName.toLowerCase().includes(q);
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesTags = job.tags.some((t) => t.toLowerCase().includes(q));
        const matchesQual = job.qualification.toLowerCase().includes(q);
        if (!matchesOrg && !matchesTitle && !matchesQual) return false;
      }
      return true;
    });
  }, [selectedCategory, searchTerm]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ANTI-SCAM VERIFICATION BANNER & CRAWLER STATUS */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-4 text-emerald-200 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                100% Verified Government & PSU Recruitment
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                Direct .gov.in & .nic.in Portals
              </span>
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                Automated Deadline & Expiry Crawler Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              RoleNest continuously crawls official gazettes & PSU career portals. Expired recruitment windows are automatically archived by our TTL verification engine so you never apply to closed notifications.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("crawlerPolicy")}
            className="rounded-xl border border-teal-500/40 bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-300 hover:bg-teal-500/20 transition-colors cursor-pointer"
          >
            How Our Crawler Works &rarr;
          </button>
          <Link
            href="/jobs"
            className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition-colors"
          >
            Startup & Corporate Jobs &rarr;
          </Link>
        </div>
      </div>

      {/* HEADER SECTION */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
              <Building2 className="h-3.5 w-3.5 text-emerald-600" /> Ministry of Electronics & IT (MeitY) & PSU Careers
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl flex items-center gap-3">
              <span>🇮🇳 Indian Government Tech Jobs Guide</span>
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-3xl">
              Complete blueprint for software engineers, cybersecurity specialists, and researchers targeting Scientist & Engineer roles in ISRO, DRDO, NIC, C-DAC, and top Indian PSUs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
              <Coins className="h-4 w-4 text-emerald-600" /> 7th CPC Level 10: ₹1.12L/mo
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
              <Award className="h-4 w-4 text-teal-600" /> Group 'A' Gazetted
            </span>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {[
            { id: "openings", label: "Live & Upcoming Tech Openings", icon: Briefcase },
            { id: "howToApply", label: "Step-by-Step 'How to Apply' Guide", icon: FileText },
            { id: "payScale", label: "7th CPC Pay Scale & Perks Breakdown", icon: Coins },
            { id: "syllabus", label: "Exam Pattern & Technical Syllabus", icon: BookOpen },
            { id: "crawlerPolicy", label: "Live Crawler & Expiry Watchdog", icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: LIVE & UPCOMING TECH OPENINGS */}
      {activeTab === "openings" && (
        <div className="mt-6 space-y-6">
          {/* SEARCH & FILTER BAR */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by organisation, role, or qualification (e.g. NIC, ISRO, GATE, B.Tech)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { label: "All Sectors (29+)", value: "ALL" },
                { label: "Research Labs (ISRO/DRDO)", value: "Research" },
                { label: "Ministries (NIC/MeitY)", value: "Ministry" },
                { label: "Maharatna PSUs", value: "PSU" },
                { label: "Banking (RBI/SBI)", value: "Banking" },
                { label: "State Govt & DISCOMs", value: "State" },
                { label: "⚡ Short-Term Contract / Apprenticeship", value: "Apprenticeship" },
                { label: "🏢 Third-Party Agency Vendor", value: "ThirdPartyAgency" },
              ].map((c) => (
                <button
                  key={c.value}
                  onClick={() => setSelectedCategory(c.value)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === c.value
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* JOB LISTINGS */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200/60">
                        {job.orgName}
                      </span>
                      {job.employmentType === "Short-Term Contract / Apprenticeship" && (
                        <span className="rounded-md bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-700 border border-amber-300 flex items-center gap-1">
                          ⚠️ Short-Term Contract / Apprenticeship
                        </span>
                      )}
                      {job.employmentType === "Third-Party Agency Vendor" && (
                        <span className="rounded-md bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-extrabold text-purple-700 border border-purple-300 flex items-center gap-1">
                          🏢 Third-Party Agency Vendor (Deputation)
                        </span>
                      )}
                      <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                        job.status === "Active / Ongoing"
                          ? "bg-teal-50 text-teal-700 border border-teal-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}>
                        {job.status}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {job.vacancies}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {job.title}
                    </h2>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-2 text-xs text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Coins className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span><strong>Salary:</strong> {job.approxMonthlySalary}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span><strong>Eligibility:</strong> {job.qualification}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                        <span><strong>Selection:</strong> {job.selectionProcess}</span>
                      </div>
                      {job.contractDuration && (
                        <div className="flex items-center gap-1.5 sm:col-span-2 lg:col-span-3 text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200/60 font-medium">
                          <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          <span><strong>Tenure / Duration:</strong> {job.contractDuration}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {job.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ACTION LINKS */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0">
                    <a
                      href={job.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-500 transition-colors"
                    >
                      Official Apply Portal
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>

                    <a
                      href={job.notificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <FileText className="h-3.5 w-3.5 text-slate-500" />
                      View Notification
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: STEP-BY-STEP HOW TO APPLY GUIDE */}
      {activeTab === "howToApply" && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Master Guide: How & Where to Apply for Indian Government Tech Roles
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Follow this step-by-step roadmap to apply smoothly without getting caught in fake scam websites or rejected for improper documentation.
            </p>

            <div className="mt-8 space-y-6">
              {[
                {
                  step: "01",
                  title: "Identify Verified Official Notification Portals",
                  desc: "NEVER register on third-party domains (like .com, .org.in clones) that ask for UPI processing charges. Legitimate central recruitment only occurs on official .gov.in or .nic.in subdomains.",
                  links: [
                    { name: "NIC Recruitment Portal", url: "https://recruitment.nic.in" },
                    { name: "DRDO RAC Portal", url: "https://rac.gov.in" },
                    { name: "ISRO Careers", url: "https://www.isro.gov.in/Careers.html" },
                    { name: "C-DAC Careers", url: "https://www.cdac.in/index.aspx?id=current_jobs" },
                    { name: "IOCL Careers", url: "https://iocl.com/latest-job" },
                    { name: "NTPC Careers", url: "https://careers.ntpc.co.in" },
                  ]
                },
                {
                  step: "02",
                  title: "One-Time Registration (OTR) & Profile Setup",
                  desc: "Most central portals require a permanent OTR registration before you can submit an application for an open notification:",
                  details: [
                    "UPSC / OTR Portals: Upload verified DigiLocker credentials, Class 10 Board certificate (mandatory for DOB proof), and active Aadhaar authentication.",
                    "DRDO RAC Portal: Complete Bio-Data profiling. Ensure your name matches verbatim across your Degree certificate, Aadhaar, and GATE Admit Card.",
                    "PSU Career Portals (IOCL, NTPC, ONGC): Create candidate profiles during the annual Post-GATE notification window. Have your GATE Registration ID and normalized score ready."
                  ]
                },
                {
                  step: "03",
                  title: "Choose Your Examination Pathway: GATE vs Non-GATE",
                  desc: "Government tech positions fall into two distinct pathways:",
                  details: [
                    "GATE Pathway (DRDO RAC, IOCL, ONGC, NTPC, CRIS, BARC, NPCI): Requires a valid GATE Score in CS/IT within the last 3 years. Shortlisting is done directly for Tier-2 Technical Interviews or Group Discussions (GD/GT) based on GATE normalized marks.",
                    "Direct CBT Exam Pathway (NIC / NIELIT, ISRO ICRB, BEL, BHEL, C-DAC): Conducts independent 120-150 question Computer-Based Tests (CBT). No GATE score is required. Any recognized B.Tech/MCA/M.Sc graduate can sit for the exam."
                  ]
                },
                {
                  step: "04",
                  title: "Document Preparation Checklist (Strict Central Government Formats)",
                  desc: "Before opening the application form, prepare digital scans according to precise government upload specifications:",
                  checklist: [
                    "Degree Certificate or Provisional Degree (B.E./B.Tech/MCA/M.Sc in CS or IT) with minimum 60% or 6.5 CGPA.",
                    "Valid Category Certificate (OBC-NCL / EWS must be issued within the current financial year in Government of India format; state certificates are often rejected).",
                    "GATE Scorecard (for DRDO/CRIS/BARC/PSUs) with clear registration number and qualifying cutoffs.",
                    "Passport Photo (White background, 20 KB - 50 KB, JPEG) and Signature (Black ink on white paper, 10 KB - 20 KB).",
                    "Government Photo Identity Card (Aadhaar, Voter ID, or Passport).",
                    "No Objection Certificate (NOC): Mandatory if you are currently employed in a Central/State Government dept or PSU."
                  ]
                },
                {
                  step: "05",
                  title: "Fee Payment & Exemption Norms",
                  desc: "Central Government norms provide extensive fee exemptions:",
                  feeRules: [
                    "General & OBC Male Candidates: Typical examination fee is ₹100 - ₹1,000 depending on the ministry.",
                    "Exempted Categories: Female candidates of all categories, SC, ST, and Persons with Benchmark Disabilities (PwD) are 100% exempt from application fees under Central Govt rules.",
                    "Always pay via official SBI ePay or Treasury BharatKosh gateways. Never pay via third-party UPI handles or external payment links."
                  ]
                },
                {
                  step: "06",
                  title: "Biometric Verification, CBT & Technical Interview",
                  desc: "Upon qualifying the CBT or GATE screening:",
                  details: [
                    "Admit Card & Biometric Check: Download admit card from the official portal. Exam centers enforce strict biometric iris/fingerprint scanning against Aadhaar data.",
                    "Technical Panel Interview: For Scientist 'B' / E-2 Executive roles, interviews carry 15-20% weightage. Panels probe deeply into Data Structures, Operating Systems, Computer Networks, and your final year engineering capstone project.",
                    "Medical Examination: Final selection is contingent on passing standard Central Health Service (CHS) medical fitness standards."
                  ]
                }
              ].map((item) => (
                <div key={item.step} className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 sm:p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-extrabold text-sm shadow-xs">
                    {item.step}
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600">{item.desc}</p>

                    {item.links && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {item.links.map((l) => (
                          <a
                            key={l.name}
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
                          >
                            {l.name}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    )}

                    {item.details && (
                      <ul className="space-y-1.5 pt-1">
                        {item.details.map((d, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                            <ChevronRight className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.checklist && (
                      <ul className="space-y-1 pt-1">
                        {item.checklist.map((c, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.feeRules && (
                      <ul className="space-y-1 pt-1">
                        {item.feeRules.map((f, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 7TH PAY COMMISSION CALCULATOR & PERKS */}
      {activeTab === "payScale" && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Coins className="h-5 w-5 text-emerald-600" />
              7th Central Pay Commission (7th CPC) Salary Breakdown: Scientist 'B'
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Accurate calculation for entry-level Scientist 'B' / Scientist 'SC' (Pay Matrix Level 10, Index 1) in Class X Cities (Delhi, Bengaluru, Mumbai).
            </p>

            {/* SALARY TABLE */}
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 shadow-2xs">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 font-semibold text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Salary Component</th>
                    <th className="px-4 py-3">Formula / Percentage</th>
                    <th className="px-4 py-3">Amount (₹ Monthly)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-slate-900">Basic Pay</td>
                    <td className="px-4 py-2.5">Level 10 Cell 1 (7th CPC)</td>
                    <td className="px-4 py-2.5 font-mono font-semibold text-slate-900">₹56,100</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-slate-900">Dearness Allowance (DA)</td>
                    <td className="px-4 py-2.5">Current Rate: 50% of Basic Pay</td>
                    <td className="px-4 py-2.5 font-mono font-semibold text-slate-900">₹28,050</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-slate-900">House Rent Allowance (HRA)</td>
                    <td className="px-4 py-2.5">Class X City (30% of Basic Pay)</td>
                    <td className="px-4 py-2.5 font-mono font-semibold text-slate-900">₹16,830</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-slate-900">Transport Allowance (TA)</td>
                    <td className="px-4 py-2.5">Higher TPTA City (₹7,200 + 50% DA)</td>
                    <td className="px-4 py-2.5 font-mono font-semibold text-slate-900">₹10,800</td>
                  </tr>
                  <tr className="bg-emerald-50/70 font-bold text-emerald-950">
                    <td className="px-4 py-3">Gross Total Monthly Emoluments</td>
                    <td className="px-4 py-3">Basic + DA + HRA + TA</td>
                    <td className="px-4 py-3 font-mono text-sm text-emerald-700">₹1,11,780 / month</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-slate-500">Government NPS Contribution (14%)</td>
                    <td className="px-4 py-2.5 text-slate-500">14% of (Basic + DA)</td>
                    <td className="px-4 py-2.5 font-mono text-slate-500">+₹11,781 / month</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ADDITIONAL PERKS */}
            <div className="mt-8 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Exclusive Government Tech Perks</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  {
                    title: "CGHS Comprehensive Health",
                    desc: "100% cashless medical coverage for self, spouse, children, and dependent parents in empanelled super-specialty hospitals."
                  },
                  {
                    title: "Quarter Allotment / HRA",
                    desc: "Eligibility for Type-IV / Type-V central government housing accommodation in prime metro locations."
                  },
                  {
                    title: "Leave Travel Concession (LTC)",
                    desc: "Annual paid airfare for family to home town and Bharat Darshan destinations across India."
                  },
                  {
                    title: "Professional Update Allowance",
                    desc: "Annual grant for purchasing technical books, laptop allowances, and attending IEEE/ACM international conferences."
                  },
                  {
                    title: "National Pension System (NPS)",
                    desc: "Government contributes 14% matching towards your pension corpus with complete tax exemption."
                  },
                  {
                    title: "Job Stability & Tenure",
                    desc: "Zero private-sector layoff volatility. Full statutory protections and guaranteed annual increments (3%)."
                  }
                ].map((p) => (
                  <div key={p.title} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <h4 className="text-xs font-bold text-slate-900">{p.title}</h4>
                    <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SYLLABUS & EXAM PATTERN */}
      {activeTab === "syllabus" && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              Scientist 'B' & CS Technical Exam Pattern & Detailed Syllabus
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Comprehensive topic breakdown used by NIC, NIELIT, ISRO ICRB, and DRDO Scientist examinations.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  section: "Section A: Core Computer Science (65% Weightage)",
                  topics: [
                    "Data Structures & Algorithms: Asymptotic analysis, Trees, Graphs, Sorting, Dynamic Programming.",
                    "Operating Systems: Process synchronization, Semaphores, Deadlocks, Memory Management, Virtual Memory, File Systems.",
                    "DBMS: Relational Algebra, SQL, Normalization (1NF to BCNF), ACID Properties, Concurrency Control, Indexing.",
                    "Computer Networks: OSI & TCP/IP stack, Routing protocols (OSPF, BGP), TCP Flow/Congestion control, IP addressing & Subnetting, Cryptography basics (RSA, AES, SSL/TLS).",
                    "Theory of Computation & Compilers: Regular expressions, Finite Automata, Context-Free Grammars, Lexical & Syntax analysis, Code generation.",
                    "Computer Architecture: Instruction pipelining, Cache memory hierarchies, Addressing modes, Interrupts."
                  ]
                },
                {
                  section: "Section B: Generic / Analytical Reasoning (35% Weightage)",
                  topics: [
                    "Logical Reasoning: Syllogisms, Direction sense, Seating arrangements, Blood relations.",
                    "Quantitative Aptitude: Number theory, Probability, Permutations & Combinations, Time and Work, Percentages.",
                    "General Mental Ability: Pattern recognition, Series completion, Data interpretation (Charts & Graphs).",
                    "Cyber Law & IT Act Basics: Information Technology Act 2000, DPDP Act 2023 fundamentals, Intellectual Property in software."
                  ]
                }
              ].map((s) => (
                <div key={s.section} className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                    {s.section}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {s.topics.map((t, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* PREVIOUS YEAR CUTOFF INSIGHTS */}
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-950">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                GATE Cutoff Tracker & Interview Thresholds (Past Trends)
              </div>
              <p className="mt-1 leading-relaxed text-slate-700">
                For DRDO RAC Scientist 'B' (Computer Science), the typical shortlisting cutoff score for General Category candidates ranges between <strong>720 - 780 GATE Score</strong> (Rank ~300 - 800). For NIC Scientist 'B' direct CBT exam, scoring <strong>75% or higher in Section A</strong> reliably guarantees an interview call.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUTOMATED CRAWLER & EXPIRY WATCHDOG */}
      {activeTab === "crawlerPolicy" && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  RoleNest GovTech Crawler & Deadline Watchdog
                </h2>
                <p className="mt-1 text-xs text-slate-600">
                  How our automated data pipeline indexes, validates, and purges expired Indian Government and PSU tech recruitment notifications.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                Crawler Status: Operational (Daily Sync)
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Search className="h-4 w-4 text-blue-600" />
                  1. Official Gazette & Portal Ingestion
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our crawler targets verified government domains (<code className="text-emerald-700 font-mono">.gov.in</code>, <code className="text-emerald-700 font-mono">.nic.in</code>, <code className="text-emerald-700 font-mono">.res.in</code>), Employment News India, and official PSU career handles (ISRO, DRDO RAC, NIC, C-DAC, IOCL, NTPC).
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Clock className="h-4 w-4 text-amber-600" />
                  2. Automated Deadline & Expiry Tracking
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every notification parsed is stamped with its submission cut-off date. Our automated TTL daemon (<code className="text-emerald-700 font-mono">/api/cron/jobs-ttl</code>) evaluates deadlines: postings past their last date are auto-flagged and removed from the active feed.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  3. Zero Fake Links & Anti-Phishing Filter
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All apply buttons link directly to official registrar portals. Any third-party intermediary, payment gateway asking for unauthorized fees, or deceptive ad-link is hard-blocked by our security heuristics.
                </p>
              </div>
            </div>

            {/* ARE THESE ALL GOV TECH JOBS FAQ */}
            <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 space-y-4">
              <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                <Info className="h-4 w-4 text-emerald-700" />
                Frequently Asked Questions: Coverage & Crawler Behavior
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="bg-white/80 rounded-lg p-3.5 border border-emerald-200/60">
                  <p className="font-bold text-slate-900">Q: Does this cover all government and public sector tech jobs in India?</p>
                  <p className="mt-1 leading-relaxed text-slate-600">
                    A: <strong>Yes!</strong> RoleNest now indexes across all 7 categories: (1) <strong>Research & Defence Labs</strong> (ISRO, DRDO, BARC), (2) <strong>Central Ministries & Standards</strong> (NIC/MeitY, CERT-In, BIS), (3) <strong>Maharatna & Navratna PSUs</strong> (IOCL, NTPC, ONGC, BHEL, GAIL, Coal India, PowerGrid, HAL, BEL, ECIL, C-DAC, CRIS, NPCI), (4) <strong>Public Sector Banking & Financial Regulators</strong> (RBI, SEBI, SBI, IBPS, NABARD), (5) <strong>State Gazetted & DISCOM Infrastructure</strong> (UPPCL, MSEDCL, BESCOM, State PSC Programmers), (6) <strong>Short-Term Contractual Apprenticeships</strong> (NATS, HARTRON/State DIT, ISRO/DRDO JRF), and (7) <strong>Third-Party Agency Vendors</strong> (TCS/Wipro NICSI deputation, GeM manpower contractors).
                  </p>
                </div>

                <div className="bg-white/80 rounded-lg p-3.5 border border-amber-200/80 bg-amber-50/40">
                  <p className="font-bold text-amber-950">Q: What is the difference between Permanent Gov Jobs, Short-Term Contracts, and Third-Party Agency Vendors?</p>
                  <p className="mt-1 leading-relaxed text-slate-700">
                    • <strong>Permanent / Gazetted (ISRO, DRDO, NIC, PSUs):</strong> Regular central/state civil service or public enterprise cadre with 7th CPC pay scale, DA/HRA allowances, National Pension System (NPS), CGHS medical, and statutory tenure.<br />
                    • <strong>Short-Term Contract / Apprenticeship (NATS, HARTRON, JRF):</strong> Fixed-term tenure (typically 1 to 3 years) with a consolidated stipend/honorarium. These do <em>not</em> carry regular civil service status or absorption guarantees upon project completion.<br />
                    • <strong>Third-Party Agency Vendor (NICSI SIs, GeM Manpower):</strong> Legally employed and paid by a private contractor/vendor (e.g. TCS, Wipro, private staffing agencies) and deputed on-site to government offices. Governed entirely by private corporate contracts.
                  </p>
                </div>

                <div className="bg-white/80 rounded-lg p-3.5 border border-emerald-200/60">
                  <p className="font-bold text-slate-900">Q: How often does the crawler discover new notifications?</p>
                  <p className="mt-1 leading-relaxed text-slate-600">
                    A: Central government organizations typically recruit on annual or bi-annual cycles (such as ISRO ICRB or DRDO RAC post-GATE release in March/April). Our crawler syncs daily to pick up rolling project appointments (like C-DAC and BEL) as well as freshly gazetted annual drives.
                  </p>
                </div>

                <div className="bg-white/80 rounded-lg p-3.5 border border-emerald-200/60">
                  <p className="font-bold text-slate-900">Q: Does RoleNest charge any fee for government job applications?</p>
                  <p className="mt-1 leading-relaxed text-slate-600">
                    A: <strong>Never.</strong> Application fees are payable solely to the official Government of India treasury (via BharatKosh or SBI ePay) on the official government website. RoleNest provides 100% free discovery and guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
