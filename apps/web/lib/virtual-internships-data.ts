export interface VirtualInternshipProgram {
  id: string;
  company: string;
  title: string;
  provider:
    | "Forage"
    | "Google"
    | "Cisco"
    | "Coursera"
    | "Microsoft"
    | "AWS"
    | "IBM"
    | "freeCodeCamp"
    | "Postman"
    | "MongoDB"
    | "Kaggle"
    | "Linux Foundation"
    | "Harvard University";
  category:
    | "Software Engineering"
    | "Cloud & DevOps"
    | "Data & AI"
    | "Cybersecurity"
    | "Web Development"
    | "Consulting & Product";
  duration: string;
  isFree: boolean;
  hasCertificate: boolean;
  url: string;
  skills: string[];
  tasks: string[];
  description: string;
}

export const VERIFIED_VIRTUAL_INTERNSHIPS: VirtualInternshipProgram[] = [
  // 1. FORAGE - WALMART GLOBAL TECH
  {
    id: "forage-walmart-swe",
    company: "Walmart Global Tech",
    title: "Advanced Software Engineering Virtual Experience",
    provider: "Forage",
    category: "Software Engineering",
    duration: "4-5 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/walmart/advanced-software-engineering-9s4k",
    skills: ["Java", "Data Structures", "Relational Database Design", "Processor Architecture"],
    tasks: [
      "Task 1: Advanced Data Structures (Heap implementation)",
      "Task 2: Software Architecture & Relational Database Design",
      "Task 3: Write performant inventory batch processing scripts",
    ],
    description: "Experience life as a Walmart software engineer. Build backend data structures and design scalable databases used in retail infrastructure.",
  },

  // 2. FORAGE - JPMORGAN CHASE & CO.
  {
    id: "forage-jpmorgan-swe",
    company: "JPMorgan Chase & Co.",
    title: "Software Engineering Virtual Experience Program",
    provider: "Forage",
    category: "Software Engineering",
    duration: "5-6 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/jpmorgan/software-engineering-6s2m",
    skills: ["Python", "TypeScript", "React", "Financial Data Streams"],
    tasks: [
      "Task 1: Interface with a stock price data feed",
      "Task 2: Use JPMorgan Chase open source Perspective library",
      "Task 3: Display real-time visual trader graphs",
    ],
    description: "Learn how developers build high-frequency financial visualization platforms using JPMorgan's open-source Perspective streaming engine.",
  },

  // 3. FORAGE - GOLDMAN SACHS
  {
    id: "forage-goldman-sachs",
    company: "Goldman Sachs",
    title: "Software Engineering & Cryptography Simulation",
    provider: "Forage",
    category: "Software Engineering",
    duration: "4-5 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/goldman-sachs/software-engineering-unb2",
    skills: ["Cryptography", "Password Hashing", "Security Auditing", "Algorithms"],
    tasks: [
      "Task 1: Crack leaked password hashes using rainbow table heuristics",
      "Task 2: Propose cryptographic upgrades to SHA-256 with salt",
      "Task 3: Present security vulnerability audit report",
    ],
    description: "Work directly on cybersecurity defense and cryptographic hash cracking workflows simulation modeled on real Goldman Sachs engineering challenges.",
  },

  // 4. FORAGE - BCG (BOSTON CONSULTING GROUP)
  {
    id: "forage-bcg-genai",
    company: "Boston Consulting Group (BCG)",
    title: "GenAI & Digital Strategy Experience Program",
    provider: "Forage",
    category: "Data & AI",
    duration: "4 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/bcg/strategy-consulting-w7d8",
    skills: ["Generative AI", "LLM Evaluation", "Prompt Engineering", "Business Strategy"],
    tasks: [
      "Task 1: Analyze market disruption vectors for generative AI",
      "Task 2: Evaluate LLM benchmark accuracy against proprietary enterprise data",
      "Task 3: Formulate strategic AI integration recommendations",
    ],
    description: "Advise enterprise executives on adopting generative AI models safely, mitigating hallucinations, and driving measurable workflow automation.",
  },

  // 5. FORAGE - DELOITTE
  {
    id: "forage-deloitte-tech",
    company: "Deloitte",
    title: "Technology Consulting Virtual Internship",
    provider: "Forage",
    category: "Consulting & Product",
    duration: "5 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/deloitte/technology-consulting-o9df",
    skills: ["Cloud Architecture", "System Migration", "Cyber Defense", "Client Advisory"],
    tasks: [
      "Task 1: Plan multi-tenant cloud migration roadmap",
      "Task 2: Perform cybersecurity risk assessment across API gateways",
      "Task 3: Create executive presentation on software cost optimization",
    ],
    description: "Simulate consulting on enterprise-scale cloud migrations, legacy system modernizations, and cloud infrastructure architectures at Deloitte.",
  },

  // 6. FORAGE - LYFT
  {
    id: "forage-lyft-mobile",
    company: "Lyft",
    title: "Mobile App Engineering & Architecture Simulation",
    provider: "Forage",
    category: "Software Engineering",
    duration: "4 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/lyft/back-end-engineering-r79a",
    skills: ["Python", "Object-Oriented Design", "Clean Architecture", "Unit Testing"],
    tasks: [
      "Task 1: Refactor legacy rental car service using Factory Pattern",
      "Task 2: Implement maintenance scheduling criteria with clean TDD",
      "Task 3: Write comprehensive unit test suite with high code coverage",
    ],
    description: "Refactor backend and mobile fleet management systems at Lyft applying SOLID principles and decoupled design patterns.",
  },

  // 7. FORAGE - ACCENTURE
  {
    id: "forage-accenture-dev",
    company: "Accenture",
    title: "Developer & Technology Architecture Experience",
    provider: "Forage",
    category: "Software Engineering",
    duration: "4 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/accenture/developer-program-q8sf",
    skills: ["Agile", "REST APIs", "Debugging", "Code Review"],
    tasks: [
      "Task 1: Architecture review of distributed microservice endpoints",
      "Task 2: Debug failing integration endpoints in staging environment",
      "Task 3: Provide security review for authentication token expiry",
    ],
    description: "Work on full software development lifecycle sprints, code reviews, and enterprise client feature deployments at Accenture.",
  },

  // 8. FORAGE - ELECTRONIC ARTS (EA)
  {
    id: "forage-ea-swe",
    company: "Electronic Arts (EA)",
    title: "Software Engineering & Game Systems Experience",
    provider: "Forage",
    category: "Software Engineering",
    duration: "5 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/electronic-arts/software-engineering-k4v3",
    skills: ["C++", "Game Engines", "Algorithms", "Memory Management"],
    tasks: [
      "Task 1: Implement an inventory and inventory branching system in C++",
      "Task 2: Design real-time collision detection helper",
      "Task 3: Optimize frame rate and memory footprint during peak entity spawns",
    ],
    description: "Explore game engine mechanics, efficient memory management, and performant data structures used in AAA video games at EA.",
  },

  // 9. FORAGE - RED BULL
  {
    id: "forage-redbull-iot",
    company: "Red Bull",
    title: "On-Premise Software & IoT Architecture",
    provider: "Forage",
    category: "Cloud & DevOps",
    duration: "3-4 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/red-bull/on-premise-sales-p39d",
    skills: ["Data Pipelines", "IoT Telemetry", "SQL", "Dashboard Automation"],
    tasks: [
      "Task 1: Stream sensory telemetry data from refrigeration units",
      "Task 2: Build anomaly alerts for supply chain temperatures",
      "Task 3: Output automated SQL inventory restock triggers",
    ],
    description: "Build streaming data telemetry and inventory monitoring pipelines modeled after Red Bull global supply chain operations.",
  },

  // 10. FORAGE - CITI
  {
    id: "forage-citi-markets",
    company: "Citi",
    title: "Markets & Software Engineering Simulation",
    provider: "Forage",
    category: "Software Engineering",
    duration: "5 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/citi/software-development-9s3f",
    skills: ["Java", "Market Orders", "Concurrency", "Financial Systems"],
    tasks: [
      "Task 1: Build a low-latency order routing validation pipeline",
      "Task 2: Prevent concurrency race conditions on matching trade book",
      "Task 3: Generate end-of-day trade settlement ledger",
    ],
    description: "Design low-latency institutional trade matching and compliance calculation tools at Citi.",
  },

  // 11. FORAGE - PWC
  {
    id: "forage-pwc-cyber",
    company: "PwC",
    title: "Cybersecurity & Risk Management Experience",
    provider: "Forage",
    category: "Cybersecurity",
    duration: "4 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/pwc/cybersecurity-consulting-w29z",
    skills: ["Threat Intelligence", "Incident Response", "Firewall Rules", "Network Audits"],
    tasks: [
      "Task 1: Analyze packet capture logs to identify breach origin",
      "Task 2: Quarantine infected subnets and patch zero-day vector",
      "Task 3: Deliver C-suite cyber incident post-mortem brief",
    ],
    description: "Simulate a live cyber incident response drill, forensic packet analysis, and remediation planning at PwC.",
  },

  // 12. FORAGE - TATA CONSULTANCY SERVICES (TCS)
  {
    id: "forage-tcs-cybersecurity",
    company: "Tata Consultancy Services (TCS)",
    title: "Cybersecurity Analyst & Threat Hunting",
    provider: "Forage",
    category: "Cybersecurity",
    duration: "4 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/tata/cybersecurity-analyst-d82e",
    skills: ["SOC Operations", "SIEM Dashboards", "IAM Policies", "Vulnerability Scanning"],
    tasks: [
      "Task 1: Configure SIEM rule triggers for suspicious auth attempts",
      "Task 2: Map vulnerabilities against the MITRE ATT&CK framework",
      "Task 3: Build automated IAM principle-of-least-privilege matrix",
    ],
    description: "Learn how SOC analysts protect global banking and telecom clients at TCS using modern threat hunting techniques.",
  },

  // 13. FORAGE - KPMG
  {
    id: "forage-kpmg-data",
    company: "KPMG",
    title: "Data Analytics Consulting Virtual Internship",
    provider: "Forage",
    category: "Data & AI",
    duration: "5 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/kpmg/data-analytics-9q3f",
    skills: ["Data Quality Assessment", "Data Insights", "Tableau / Power BI", "Cohort Analysis"],
    tasks: [
      "Task 1: Data Quality Assessment (Missing values, formatting anomalies)",
      "Task 2: Data Insights & Customer Segmentation",
      "Task 3: Interactive Dashboard Development & Presentation",
    ],
    description: "Evaluate messy enterprise customer datasets, clean raw data, and communicate visual analytics insights to stakeholders at KPMG.",
  },

  // 14. FORAGE - ANZ
  {
    id: "forage-anz-cyber",
    company: "ANZ Bank",
    title: "Cyber Security & Cloud Defense Program",
    provider: "Forage",
    category: "Cybersecurity",
    duration: "4 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/anz/cybersecurity-6s3f",
    skills: ["Social Engineering Defense", "Phishing Analysis", "Data Loss Prevention"],
    tasks: [
      "Task 1: Analyze phishing emails targeting corporate credentials",
      "Task 2: Implement email header authentication SPF & DKIM validation",
      "Task 3: Audit data leakage vulnerabilities across cloud shares",
    ],
    description: "Protect financial banking transactions, staff credentials, and cloud perimeter endpoints at ANZ.",
  },

  // 15. FORAGE - CLIFFORD CHANCE
  {
    id: "forage-clifford-chance",
    company: "Clifford Chance",
    title: "Cyber Security & Data Privacy Law",
    provider: "Forage",
    category: "Cybersecurity",
    duration: "3-4 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/clifford-chance/cyber-security-5s2a",
    skills: ["GDPR / DPDP Act", "Breach Notification", "Privacy Architecture"],
    tasks: [
      "Task 1: Advise client on cross-border data transfer compliance",
      "Task 2: Draft mandatory regulatory breach disclosure within 72 hours",
      "Task 3: Implement data privacy by design technical checklist",
    ],
    description: "Understand legal and technical compliance for cloud infrastructure, customer data residency, and GDPR requirements.",
  },

  // 16. GOOGLE CLOUD - FOUNDATIONS
  {
    id: "google-cloud-computing-foundations",
    company: "Google Cloud",
    title: "Cloud Computing Foundations & Infrastructure",
    provider: "Google",
    category: "Cloud & DevOps",
    duration: "8 hours (Self-paced)",
    isFree: true,
    hasCertificate: true,
    url: "https://www.cloudskillsboost.google/paths/11",
    skills: ["GCP", "Kubernetes", "IAM", "Cloud Storage", "BigQuery"],
    tasks: [
      "Deploy Compute Engine instances with secure VPC subnets",
      "Configure Google Cloud Storage bucket IAM permissions",
      "Deploy containerized microservices to Google Kubernetes Engine (GKE)",
    ],
    description: "Official Google Cloud Skills Boost curriculum. Earn official Google Cloud skill badges recognized across technical enterprises.",
  },

  // 17. GOOGLE CLOUD - GENERATIVE AI FUNDAMENTALS
  {
    id: "google-genai-fundamentals",
    company: "Google Cloud",
    title: "Generative AI Fundamentals Skill Badge",
    provider: "Google",
    category: "Data & AI",
    duration: "5 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.cloudskillsboost.google/course_templates/536",
    skills: ["Large Language Models", "Transformer Architecture", "Responsible AI", "Prompt Engineering"],
    tasks: [
      "Complete Introduction to Large Language Models course",
      "Complete Introduction to Responsible AI module",
      "Pass final Generative AI Fundamentals assessment on Cloud Skills Boost",
    ],
    description: "Official introductory badge from Google covering core LLM architectures, attention mechanisms, and safety principles for generative AI.",
  },

  // 18. GOOGLE - CLOUD DIGITAL LEADER
  {
    id: "google-cloud-digital-leader",
    company: "Google Cloud",
    title: "Google Cloud Digital Leader Learning Path",
    provider: "Google",
    category: "Cloud & DevOps",
    duration: "10 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.cloudskillsboost.google/paths/9",
    skills: ["Cloud Strategy", "Serverless Architecture", "Cloud Modernization", "FinOps"],
    tasks: [
      "Understand Google Cloud core compute, storage, and networking services",
      "Review multi-cloud architectures and data warehouse modernization with BigQuery",
      "Complete official practice assessment for Cloud Digital Leader credential",
    ],
    description: "High-level architectural curriculum for developers and architects seeking foundational knowledge of Google Cloud services.",
  },

  // 19. GOOGLE - ANALYTICS ACADEMY
  {
    id: "google-analytics-individual",
    company: "Google",
    title: "Google Analytics 4 (GA4) Certification",
    provider: "Google",
    category: "Data & AI",
    duration: "4 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://skillshop.exceedlms.com/student/path/508845-google-analytics-certification",
    skills: ["GA4 Telemetry", "Event Tracking", "User Conversion Funnels", "Data Stream Analysis"],
    tasks: [
      "Configure GA4 event tags and custom event parameters",
      "Build custom funnel exploration and user journey cohorts",
      "Pass official Google Skillshop 50-question examination for 12-month certification",
    ],
    description: "Official Google certification demonstrating mastery of web application traffic instrumentation, user tracking, and conversion analytics.",
  },

  // 20. AWS EDUCATE - CLOUD PRACTITIONER
  {
    id: "aws-educate-cloud-foundations",
    company: "Amazon Web Services (AWS)",
    title: "AWS Educate: Cloud Practitioner Essentials",
    provider: "AWS",
    category: "Cloud & DevOps",
    duration: "6 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://aws.amazon.com/education/awseducate/",
    skills: ["AWS EC2", "AWS S3", "IAM", "VPC", "AWS Lambda"],
    tasks: [
      "Configure secure IAM user roles with least privilege access",
      "Launch auto-scaling EC2 instance cluster behind Application Load Balancer",
      "Earn official digital Credly badge issued directly by Amazon Web Services",
    ],
    description: "Official Amazon learning program for students and developers. Includes hands-on sandboxes and official Credly badges with zero credit card required.",
  },

  // 21. AWS EDUCATE - MACHINE LEARNING FOUNDATIONS
  {
    id: "aws-educate-ml-foundations",
    company: "Amazon Web Services (AWS)",
    title: "AWS Educate: Machine Learning Foundations",
    provider: "AWS",
    category: "Data & AI",
    duration: "5 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://aws.amazon.com/education/awseducate/",
    skills: ["AWS SageMaker", "Computer Vision", "NLP Pipelines", "Model Training"],
    tasks: [
      "Learn data labeling and training pipelines on Amazon SageMaker",
      "Deploy computer vision endpoints using AWS Rekognition",
      "Complete knowledge check for official AWS Educate Machine Learning badge",
    ],
    description: "Hands-on foundation in cloud-based machine learning lifecycle, inference endpoints, and pre-trained AWS AI services.",
  },

  // 22. AWS EDUCATE - SERVERLESS ARCHITECTURE
  {
    id: "aws-educate-serverless",
    company: "Amazon Web Services (AWS)",
    title: "AWS Educate: Serverless Foundations Badge",
    provider: "AWS",
    category: "Cloud & DevOps",
    duration: "4 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://aws.amazon.com/education/awseducate/",
    skills: ["AWS Lambda", "API Gateway", "DynamoDB", "EventBridge"],
    tasks: [
      "Write stateless Python/Node.js functions executed on AWS Lambda",
      "Expose endpoints through AWS API Gateway with request throttling",
      "Connect event-driven workflows to Amazon DynamoDB NoSQL tables",
    ],
    description: "Master event-driven microservices, serverless compute, and NoSQL databases on Amazon Web Services infrastructure.",
  },

  // 23. MICROSOFT LEARN - AZURE FUNDAMENTALS (AZ-900)
  {
    id: "msft-azure-fundamentals",
    company: "Microsoft",
    title: "Microsoft Azure Fundamentals (AZ-900 Path)",
    provider: "Microsoft",
    category: "Cloud & DevOps",
    duration: "9 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
    skills: ["Azure VMs", "Azure Blob Storage", "Entra ID (Azure AD)", "Resource Groups"],
    tasks: [
      "Describe cloud concepts: High Availability, Scalability, and Agility",
      "Configure Azure virtual networks and Network Security Groups (NSG)",
      "Complete interactive Microsoft Learn sandboxes and pass knowledge assessments",
    ],
    description: "Official interactive curriculum from Microsoft preparing candidates for cloud architecture and enterprise Azure deployments.",
  },

  // 24. MICROSOFT LEARN - AI FUNDAMENTALS (AI-900)
  {
    id: "msft-ai-fundamentals",
    company: "Microsoft",
    title: "Microsoft Azure AI Fundamentals (AI-900)",
    provider: "Microsoft",
    category: "Data & AI",
    duration: "6 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://learn.microsoft.com/en-us/training/paths/get-started-with-artificial-intelligence-on-azure/",
    skills: ["Azure OpenAI Service", "Computer Vision", "Azure AI Search", "Vector Embeddings"],
    tasks: [
      "Deploy custom prompt completions using Azure OpenAI models",
      "Implement optical character recognition (OCR) with Azure AI Vision",
      "Earn official Microsoft Learn trophy badge",
    ],
    description: "Official Microsoft interactive track covering artificial intelligence, machine learning, and Azure OpenAI LLM services.",
  },

  // 25. MICROSOFT LEARN - POWER BI DATA ANALYST
  {
    id: "msft-power-bi-analyst",
    company: "Microsoft",
    title: "Power BI Data Analyst Learning Path",
    provider: "Microsoft",
    category: "Data & AI",
    duration: "8 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://learn.microsoft.com/en-us/training/paths/get-started-power-bi-create-reports/",
    skills: ["Power BI", "DAX Formulas", "Data Modeling", "Data Transformation"],
    tasks: [
      "Import and clean relational SQL datasets using Power Query",
      "Write DAX calculated columns and measures for business metrics",
      "Design interactive executive reports with cross-filtering visualizations",
    ],
    description: "Master business intelligence, tabular data modeling, and interactive reporting using Microsoft Power BI.",
  },

  // 26. CISCO - INTRO TO CYBERSECURITY
  {
    id: "cisco-intro-cybersecurity",
    company: "Cisco Networking Academy",
    title: "Introduction to Cybersecurity & Threat Defense",
    provider: "Cisco",
    category: "Cybersecurity",
    duration: "6 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.skillsforall.com/course/introduction-to-cybersecurity",
    skills: ["Network Security", "Penetration Basics", "Threat Mitigation", "Cryptography"],
    tasks: [
      "Understand modern threat vectors (Malware, Phishing, Ransomware)",
      "Configure basic firewall and authorization policies",
      "Pass final Cisco Skills For All exam for verified Credly digital badge",
    ],
    description: "Industry-standard introductory security certification course offered directly by Cisco Networking Academy.",
  },

  // 27. CISCO - PYTHON ESSENTIALS 1
  {
    id: "cisco-python-essentials-1",
    company: "Cisco Networking Academy",
    title: "Python Essentials 1: Fundamentals & Data Types",
    provider: "Cisco",
    category: "Software Engineering",
    duration: "30 hours (Self-paced)",
    isFree: true,
    hasCertificate: true,
    url: "https://www.skillsforall.com/course/python-essentials-1",
    skills: ["Python", "Control Flow", "Data Collections", "Functions & Modules"],
    tasks: [
      "Write algorithms using loops, conditionals, and slice operators",
      "Work with multi-dimensional arrays, dictionaries, and tuples",
      "Pass end-of-course exam for official Cisco & OpenEDG Python Institute certificate",
    ],
    description: "Official Cisco Networking Academy and Python Institute collaboration providing thorough programming fundamentals with verified certification.",
  },

  // 28. CISCO - PYTHON ESSENTIALS 2
  {
    id: "cisco-python-essentials-2",
    company: "Cisco Networking Academy",
    title: "Python Essentials 2: OOP & Package Architecture",
    provider: "Cisco",
    category: "Software Engineering",
    duration: "40 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.skillsforall.com/course/python-essentials-2",
    skills: ["Object-Oriented Programming", "Exceptions", "Generators", "File I/O"],
    tasks: [
      "Implement inheritance, polymorphism, and class encapsulation",
      "Process binary and text file I/O streams safely",
      "Pass official final certification exam for advanced digital badge",
    ],
    description: "Part 2 of Cisco's Python specialization diving into object-oriented design, custom exceptions, and modular libraries.",
  },

  // 29. CISCO - NETWORK BASICS
  {
    id: "cisco-network-basics",
    company: "Cisco Networking Academy",
    title: "Networking Basics & Packet Tracer Simulation",
    provider: "Cisco",
    category: "Cloud & DevOps",
    duration: "20 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.skillsforall.com/course/networking-basics",
    skills: ["TCP/IP", "Subnetting", "DNS", "HTTP/HTTPS", "Routers & Switches"],
    tasks: [
      "Calculate IPv4 subnet masks and CIDR prefixes",
      "Simulate router and switch packet flow in Cisco Packet Tracer",
      "Pass Cisco Network Basics certification assessment",
    ],
    description: "The classic foundational curriculum for computer networking, protocols, and topology design from the networking industry leader.",
  },

  // 30. FREECODECAMP - RESPONSIVE WEB DESIGN
  {
    id: "fcc-responsive-web-design",
    company: "freeCodeCamp.org",
    title: "Responsive Web Design Developer Certification",
    provider: "freeCodeCamp",
    category: "Web Development",
    duration: "300 hours (Comprehensive)",
    isFree: true,
    hasCertificate: true,
    url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
    skills: ["HTML5", "CSS3", "Flexbox", "CSS Grid", "Responsive Design", "Accessibility"],
    tasks: [
      "Build a Survey Form with accessible markup",
      "Build a Tribute Page with responsive typography",
      "Build a Technical Documentation Page with fixed sidebar navigation",
      "Build a Personal Portfolio Webpage demonstrating responsive layouts",
    ],
    description: "Globally recognized verified certification from freeCodeCamp with 5 audited capstone projects tested automatically by the test suite.",
  },

  // 31. FREECODECAMP - JAVASCRIPT ALGORITHMS & DS
  {
    id: "fcc-js-algorithms",
    company: "freeCodeCamp.org",
    title: "JavaScript Algorithms & Data Structures Certification",
    provider: "freeCodeCamp",
    category: "Software Engineering",
    duration: "300 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/",
    skills: ["JavaScript (ES6+)", "Algorithms", "Regex", "Object-Oriented JS", "Functional Programming"],
    tasks: [
      "Build a Palindrome Checker algorithm",
      "Build a Roman Numeral Converter",
      "Build a Caesars Cipher decoding engine",
      "Build a Telephone Number Validator with RegEx",
      "Build a Cash Register transaction change engine",
    ],
    description: "Master modern ECMAScript, algorithmic problem-solving, and clean coding paradigms verified through 5 coding project benchmarks.",
  },

  // 32. FREECODECAMP - FRONT END LIBRARIES
  {
    id: "fcc-front-end-libraries",
    company: "freeCodeCamp.org",
    title: "Front End Development Libraries Certification",
    provider: "freeCodeCamp",
    category: "Web Development",
    duration: "300 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.freecodecamp.org/learn/front-end-development-libraries/",
    skills: ["React", "Redux", "Bootstrap", "SASS", "State Management"],
    tasks: [
      "Build a Random Quote Machine in React",
      "Build a Markdown Previewer with real-time parser",
      "Build a Drum Machine with keyboard bindings",
      "Build a JavaScript Calculator with order-of-operations evaluation",
      "Build a 25 + 5 Pomodoro Clock with state timers",
    ],
    description: "Learn component lifecycle, state machines, and modern UI library integration with 5 interactive web applications.",
  },

  // 33. FREECODECAMP - BACK END & APIS
  {
    id: "fcc-backend-development",
    company: "freeCodeCamp.org",
    title: "Back End Development and APIs Certification",
    provider: "freeCodeCamp",
    category: "Software Engineering",
    duration: "300 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/",
    skills: ["Node.js", "Express.js", "MongoDB", "Mongoose", "REST APIs"],
    tasks: [
      "Build a Timestamp Microservice returning UNIX and UTC timestamps",
      "Build a Request Header Parser Microservice",
      "Build a URL Shortener Microservice with DNS lookup",
      "Build an Exercise Tracker API with multi-document aggregation",
      "Build a File Metadata Microservice inspecting binary multipart uploads",
    ],
    description: "Build robust REST APIs, connect persistent database layers, and handle HTTP microservice routing with automated test runners.",
  },

  // 34. FREECODECAMP - RELATIONAL DATABASE
  {
    id: "fcc-relational-database",
    company: "freeCodeCamp.org",
    title: "Relational Database Certification (PostgreSQL & Bash)",
    provider: "freeCodeCamp",
    category: "Software Engineering",
    duration: "300 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.freecodecamp.org/learn/relational-database/",
    skills: ["PostgreSQL", "Bash Scripting", "Git Internals", "Relational Schemas", "Nano"],
    tasks: [
      "Build a Celestial Database in PostgreSQL",
      "Build a World Cup Database with automated Bash ingestion scripts",
      "Build a Salon Appointment Scheduler with SQL transactions",
      "Build a Periodic Table Database with foreign key joins",
      "Build a Number Guessing Game stored in PostgreSQL",
    ],
    description: "Hands-on Linux terminal and PostgreSQL curriculum running in actual virtual containers with interactive unit validation.",
  },

  // 35. POSTMAN - STUDENT EXPERT
  {
    id: "postman-student-expert",
    company: "Postman",
    title: "Postman Student Expert Certification & Digital Badge",
    provider: "Postman",
    category: "Software Engineering",
    duration: "3-4 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://academy.postman.com/path/postman-student-expert",
    skills: ["REST APIs", "API Testing", "Postman Collections", "JavaScript Test Scripts", "Authentication"],
    tasks: [
      "Construct parameterized GET, POST, PUT, DELETE requests",
      "Write JavaScript assertions verifying response status codes and schema",
      "Chain API requests by setting and resolving dynamic collection variables",
      "Pass official Postman automated test submission for verified Credly badge",
    ],
    description: "The gold standard for API development and automated integration testing. Verified directly by Postman with public Credly badge.",
  },

  // 36. MONGODB UNIVERSITY - DEVELOPER CERTIFICATION
  {
    id: "mongodb-developer-path",
    company: "MongoDB University",
    title: "MongoDB Node.js & Python Developer Path",
    provider: "MongoDB",
    category: "Software Engineering",
    duration: "8 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://learn.mongodb.com/learning-paths/mongodb-nodejs-developer-path",
    skills: ["MongoDB Atlas", "BSON / Document Modeling", "Aggregation Pipeline", "Indexing", "Mongoose"],
    tasks: [
      "Perform CRUD operations using MongoDB official driver",
      "Construct multi-stage aggregation pipelines ($match, $group, $sort)",
      "Create compound indexes and analyze query execution plans with explain()",
      "Pass final assessment for official MongoDB University course completion certificate",
    ],
    description: "Official interactive curriculum from MongoDB covering document database modeling, index optimization, and aggregation frameworks.",
  },

  // 37. IBM SKILLSBUILD - AI FOUNDATIONS
  {
    id: "ibm-skillsbuild-ai",
    company: "IBM SkillsBuild",
    title: "Artificial Intelligence Foundations & Ethics",
    provider: "IBM",
    category: "Data & AI",
    duration: "6 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://skillsbuild.org/students",
    skills: ["AI Ethics", "Machine Learning", "Neural Networks", "NLP", "Computer Vision"],
    tasks: [
      "Understand machine learning model bias and ethical governance",
      "Examine natural language processing pipelines and intent classifiers",
      "Pass final exam for official IBM Credly verifiable digital credential",
    ],
    description: "Industry-backed introductory artificial intelligence credentials awarded by IBM SkillsBuild for aspiring engineers and students.",
  },
  // 38. GOOGLE CLOUD - INTRODUCTION TO GENERATIVE AI
  {
    id: "google-cloud-genai-path",
    company: "Google Cloud",
    title: "Introduction to Generative AI Learning Path",
    provider: "Google",
    category: "Data & AI",
    duration: "5 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.cloudskillsboost.google/paths/118",
    skills: ["Generative AI", "Large Language Models", "Attention Mechanism", "Transformer Models", "Responsible AI"],
    tasks: [
      "Understand foundational differences between traditional ML and Generative AI",
      "Explore Large Language Models and natural language generation architectures",
      "Pass final quiz to earn the official Google Cloud Skills Boost digital badge and completion credential",
    ],
    description: "Official microlearning path from Google Cloud introducing generative AI, transformers, and Google's responsible AI principles.",
  },

  // 39. AWS EDUCATE - CLOUD COMPUTING FOUNDATIONS
  {
    id: "aws-educate-cloud-foundations",
    company: "Amazon Web Services",
    title: "AWS Educate Cloud Computing Foundations & Builder Badges",
    provider: "AWS",
    category: "Cloud & DevOps",
    duration: "10 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://aws.amazon.com/education/awseducate/",
    skills: ["AWS Cloud", "Amazon S3", "Amazon EC2", "IAM Security", "Cloud Architecture"],
    tasks: [
      "Complete hands-on cloud labs without needing a credit card",
      "Configure IAM policies and deploy scalable compute instances on EC2",
      "Earn official AWS Educate digital badges on Credly",
    ],
    description: "100% free hands-on training directly from Amazon Web Services for students and early-career cloud builders.",
  },

  // 40. MICROSOFT LEARN - AZURE AI FUNDAMENTALS
  {
    id: "ms-azure-ai-fundamentals",
    company: "Microsoft",
    title: "Microsoft Azure AI Fundamentals Learning Path",
    provider: "Microsoft",
    category: "Data & AI",
    duration: "6 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://learn.microsoft.com/en-us/training/paths/get-started-with-artificial-intelligence-on-azure/",
    skills: ["Azure Cognitive Services", "Computer Vision", "Natural Language Processing", "Conversational AI"],
    tasks: [
      "Explore automated machine learning on Microsoft Azure",
      "Detect visual objects using Azure Computer Vision models",
      "Complete all knowledge checkpoints for official Microsoft Learn trophies and badges",
    ],
    description: "Comprehensive official learning path by Microsoft exploring artificial intelligence capabilities and services on Microsoft Azure.",
  },

  // 41. CISCO NETWORKING ACADEMY - PYTHON ESSENTIALS
  {
    id: "cisco-python-essentials",
    company: "Cisco Networking Academy",
    title: "Python Essentials 1 & 2 (OpenEDG Python Institute)",
    provider: "Cisco",
    category: "Software Engineering",
    duration: "30 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.netacad.com/courses/programming/pcap-programming-essentials-python",
    skills: ["Python", "Object-Oriented Programming", "Algorithm Design", "File I/O", "Data Structures"],
    tasks: [
      "Master fundamental algorithmic problem-solving in Python",
      "Complete interactive browser-based coding labs and quizzes",
      "Pass final comprehensive exam for official Cisco NetAcad Certificate of Completion",
    ],
    description: "Rigorous official programming certification track prepared by Cisco Networking Academy in partnership with OpenEDG Python Institute.",
  },

  // 42. CISCO NETWORKING ACADEMY - INTRODUCTION TO CYBERSECURITY
  {
    id: "cisco-intro-cybersecurity",
    company: "Cisco Networking Academy",
    title: "Introduction to Cybersecurity & Threat Defense",
    provider: "Cisco",
    category: "Cybersecurity",
    duration: "15 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity",
    skills: ["Cybersecurity", "Network Defense", "Threat Analysis", "Cryptography", "Security Ethics"],
    tasks: [
      "Understand enterprise threat vectors, malware taxonomy, and phishing campaigns",
      "Explore defensive countermeasures and security governance standards",
      "Earn official Cisco NetAcad certificate and verifiable digital badge",
    ],
    description: "Official introductory cybersecurity credential from global networking leader Cisco, covering modern threat landscapes and network hygiene.",
  },

  // 43. LINUX FOUNDATION - INTRODUCTION TO LINUX (LFS101x)
  {
    id: "linux-foundation-intro",
    company: "The Linux Foundation",
    title: "Introduction to Linux Systems & Open Source (LFS101x)",
    provider: "Linux Foundation",
    category: "Cloud & DevOps",
    duration: "40 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://training.linuxfoundation.org/training/introduction-to-linux/",
    skills: ["Linux", "Bash Scripting", "System Architecture", "Process Management", "Command Line"],
    tasks: [
      "Navigate graphical and command-line Linux distributions",
      "Perform user and group permissions management and bash scripting",
      "Complete self-paced assessments directly from the non-profit Linux Foundation",
    ],
    description: "Authoritative course from the creators and maintainers of the Linux operating system, teaching essential sysadmin and CLI workflows.",
  },

  // 44. HARVARD CS50x - COMPUTER SCIENCE CERTIFICATE
  {
    id: "harvard-cs50x-certificate",
    company: "Harvard University",
    title: "CS50x: Introduction to Computer Science",
    provider: "Harvard University",
    category: "Software Engineering",
    duration: "60 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://cs50.harvard.edu/x/",
    skills: ["C", "Python", "SQL", "HTML/CSS", "JavaScript", "Algorithms", "Memory Management"],
    tasks: [
      "Implement Speller with custom hashtables in pure C",
      "Develop a full-stack financial stock trading application in Python/Flask",
      "Score 70%+ on all 10 problem sets for the free official Harvard CS50 Certificate",
    ],
    description: "Harvard University's legendary introductory CS course. Completely free to audit and earn an official verifiable Harvard certificate of completion.",
  },

  // 45. KAGGLE LEARN - INTRO & INTERMEDIATE MACHINE LEARNING
  {
    id: "kaggle-machine-learning-cert",
    company: "Kaggle",
    title: "Kaggle Machine Learning & Feature Engineering Certificates",
    provider: "Kaggle",
    category: "Data & AI",
    duration: "8 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.kaggle.com/learn",
    skills: ["Scikit-Learn", "Machine Learning", "XGBoost", "Data Imputation", "Categorical Encoding"],
    tasks: [
      "Build Random Forest and XGBoost regression models on real housing datasets",
      "Handle missing values and target encoding with pipeline cross-validation",
      "Submit competitive models to receive official Kaggle verified certificates",
    ],
    description: "Fast-track hands-on machine learning micro-courses from Google Kaggle with instant execution and official certificate generation.",
  },

  // 46. KAGGLE LEARN - DEEP LEARNING & COMPUTER VISION
  {
    id: "kaggle-deep-learning-cert",
    company: "Kaggle",
    title: "Kaggle Deep Learning & Computer Vision Certification",
    provider: "Kaggle",
    category: "Data & AI",
    duration: "8 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.kaggle.com/learn/deep-learning",
    skills: ["TensorFlow", "Keras", "Convolutional Neural Networks", "Computer Vision", "Overfitting"],
    tasks: [
      "Construct sequential and functional Keras neural network architectures",
      "Implement convolutional filter strides and max pooling layers",
      "Apply stochastic gradient descent with dropout to earn Kaggle Deep Learning Diploma",
    ],
    description: "Practical deep learning track using TensorFlow and Keras to train computer vision models directly in cloud GPU notebooks.",
  },

  // 47. FORAGE - ACCENTURE DEVELOPER PROGRAM
  {
    id: "forage-accenture-dev",
    company: "Accenture",
    title: "Developer Virtual Experience Program",
    provider: "Forage",
    category: "Software Engineering",
    duration: "4-5 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/accenture-nam/developer-w54q",
    skills: ["Software Architecture", "Debugging", "User Stories", "SDLC", "Testing"],
    tasks: [
      "Task 1: Architecture review and debugging code defects",
      "Task 2: Define technical requirements from business user stories",
      "Task 3: Execute integration test suites and earn verified Accenture diploma",
    ],
    description: "Simulate consulting software engineering at Accenture. Review enterprise architectures and debug mission-critical application defects.",
  },

  // 48. FORAGE - DELOITTE TECHNOLOGY EXPERIENCE
  {
    id: "forage-deloitte-tech",
    company: "Deloitte",
    title: "Technology Virtual Experience Simulation",
    provider: "Forage",
    category: "Consulting & Product",
    duration: "4-5 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/deloitte-au/technology-7h6z",
    skills: ["Cloud Strategy", "Solution Architecture", "Data Analytics", "Client Advisory"],
    tasks: [
      "Assess client cloud migration readiness and define cost projections",
      "Architect microservice integration topologies for enterprise clients",
      "Produce executive summary report and receive verified Deloitte certificate",
    ],
    description: "Step into the shoes of a Deloitte technology consultant designing digital transformations and cloud architecture solutions.",
  },

  // 49. FORAGE - BCG DATA SCIENCE & STRATEGY
  {
    id: "forage-bcg-gamma",
    company: "Boston Consulting Group (BCG)",
    title: "Strategy Consulting & Data Science Simulation (BCG X)",
    provider: "Forage",
    category: "Data & AI",
    duration: "5-6 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/bcg/data-science-x23z",
    skills: ["Customer Churn Modeling", "Feature Engineering", "Python", "Executive Storytelling", "Random Forests"],
    tasks: [
      "Task 1: Business understanding and formulating customer churn hypotheses",
      "Task 2: Exploratory data analysis and feature engineering on energy billing records",
      "Task 3: Train machine learning churn classifier and pitch recommendations to C-suite",
    ],
    description: "Experience data science consulting at BCG X. Predict customer churn and translate analytical findings into strategic business value.",
  },

  // 50. FORAGE - PWC POWER BI ANALYTICS
  {
    id: "forage-pwc-powerbi",
    company: "PwC",
    title: "Power BI Data Analytics & Executive Dashboards",
    provider: "Forage",
    category: "Data & AI",
    duration: "5-6 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/pwc-ch/power-bi-data-analytics-23b9",
    skills: ["Power BI", "DAX Formulas", "Data Modeling", "Business Intelligence", "KPIs"],
    tasks: [
      "Task 1: Call center trend analysis and customer satisfaction dashboards",
      "Task 2: Customer retention risk modeling with DAX calculated measures",
      "Task 3: Diversity and executive inclusion scorecard for PwC client review",
    ],
    description: "Official PwC digital simulation teaching executive Power BI dashboard engineering, DAX formula calculations, and business storytelling.",
  },

  // 51. FORAGE - HEWLETT PACKARD SOFTWARE ENGINEERING
  {
    id: "forage-hp-swe",
    company: "HP (Hewlett Packard)",
    title: "Software Engineering Virtual Experience",
    provider: "Forage",
    category: "Software Engineering",
    duration: "4-5 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/hp/software-engineering-9s4k",
    skills: ["C++", "Device Drivers", "Firmware Architecture", "System Performance"],
    tasks: [
      "Review firmware architecture specifications and peripheral bus protocols",
      "Optimize memory throughput and debug device communication buffers",
      "Earn official HP completion certificate for LinkedIn profile",
    ],
    description: "Learn embedded and system software engineering practices directly from HP hardware and firmware specialists.",
  },

  // 52. FORAGE - DATACOM JUNIOR CLOUD DEVELOPER
  {
    id: "forage-datacom-cloud",
    company: "Datacom",
    title: "Junior Cloud & DevOps Developer Simulation",
    provider: "Forage",
    category: "Cloud & DevOps",
    duration: "4-5 hours",
    isFree: true,
    hasCertificate: true,
    url: "https://www.theforage.com/simulations/datacom/cloud-development-9s4k",
    skills: ["Cloud Architecture", "AWS Lambda", "Serverless", "Infrastructure Security"],
    tasks: [
      "Deploy serverless function backend using AWS Lambda and API Gateway",
      "Configure cloud monitoring alerts and diagnose latency bottlenecks",
      "Receive official Datacom verified completion credential",
    ],
    description: "Hands-on cloud development simulation with Datacom engineers focusing on serverless cloud backends and automated monitoring.",
  },

];
