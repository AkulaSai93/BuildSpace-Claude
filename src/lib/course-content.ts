export interface Lesson {
  title: string;
  duration: string;
  completed?: boolean;
}

export interface Module {
  number: number;
  title: string;
  meta: string;
  lessons: Lesson[];
  completed?: boolean;
}

export const buildJourney: Module[] = [
  {
    number: 0,
    title: "Introduction",
    meta: "2/2 · 18m",
    completed: true,
    lessons: [
      { title: "Welcome & Project Overview", duration: "5:30", completed: true },
      { title: "What We're Building", duration: "12:45", completed: true },
    ],
  },
  {
    number: 2,
    title: "Business Problem & Requirements",
    meta: "2/3 · 55m",
    lessons: [
      { title: "Business Requirements Document", duration: "18:20", completed: true },
      { title: "System Design Overview", duration: "22:15", completed: true },
      { title: "User Stories & Acceptance Criteria", duration: "14:30" },
    ],
  },
  {
    number: 3,
    title: "Planning & Architecture",
    meta: "1/4 · 1h 20m",
    lessons: [
      { title: "High-Level Architecture Design", duration: "25:10", completed: true },
      { title: "Database Schema Design", duration: "20:45" },
      { title: "API Design with OpenAPI 3.0", duration: "18:30" },
      { title: "Environment & Tooling Setup", duration: "15:20" },
    ],
  },
  { number: 4, title: "Frontend Development", meta: "0/8 · 4h 20m", lessons: [] },
  { number: 5, title: "Backend Development", meta: "0/7 · 3h 45m", lessons: [] },
  { number: 6, title: "Auth & Deployment", meta: "0/5 · 2h 15m", lessons: [] },
];

export const courseStats = {
  totalVideos: "86 lessons",
  totalDuration: "42h 30m",
  resources: "24 files",
  students: "12,840",
  totalViews: "48,200",
  bookmarks: "3,200",
};

export const relatedProjects = [
  { title: "Real-Time Chat App with Socket.io, Redis & React", duration: "38h 15m", slug: "realtime-chat" },
  { title: "AI-Powered Resume Builder with OpenAI & FastAPI", duration: "28h 45m", slug: "ai-resume-builder" },
  { title: "Netflix Clone with React, Firebase & TMDb API", duration: "22h 10m", slug: "netflix-clone" },
];

export const whatYoullBuild = [
  "Product catalog with advanced filtering and search",
  "Stripe Checkout with webhook idempotency handling",
  "NextAuth.js v5 with Google & GitHub OAuth",
  "Shopping cart with server-side session persistence",
  "Admin dashboard with real-time inventory management",
  "Order tracking and transactional email notifications",
];

export const learningOutcomes = [
  "Build production-grade apps with Next.js 14 App Router and React Server Components",
  "Implement secure Stripe payments with webhook handling and idempotency",
  "Design and optimize PostgreSQL schemas for e-commerce workloads",
  "Set up Redis for caching, session management, and rate limiting",
  "Deploy and monitor production apps with Vercel, Sentry, and observability tooling",
];

export const prerequisites = ["React fundamentals", "JavaScript ES6+", "Basic SQL", "Node.js basics", "REST APIs", "Git"];

export const systemArchitecture = {
  "Client Layer": ["Next.js App Router", "React Server Components", "Tailwind CSS"],
  "Application Layer": ["Next.js API Routes", "NextAuth.js v5", "Prisma ORM"],
  "Data Layer": ["PostgreSQL 16", "Redis 7.2", "Cloudinary CDN"],
};

export const techStackDetail = [
  {
    name: "Next.js 14",
    initials: "NE",
    version: "v14.2",
    role: "React framework with App Router, Server Components, and built-in API routes",
    category: "Framework",
    whyWeChoseIt: "Industry standard for production React apps with SSR, SSG, and edge runtime support",
    difficulty: "Intermediate" as const,
  },
  {
    name: "TypeScript",
    initials: "TY",
    version: "v5.3",
    role: "Static type checking, improved IDE support, and safer large-scale refactoring",
    category: "Language",
    whyWeChoseIt: "Required for production-grade apps - catches errors at compile time, not in production",
    difficulty: "Intermediate" as const,
  },
  {
    name: "PostgreSQL",
    initials: "PO",
    version: "v16",
    role: "Primary relational database for products, orders, users, and inventory data",
    category: "Database",
    whyWeChoseIt: "ACID compliance, advanced JSON support, excellent Prisma integration, proven at scale",
    difficulty: "Intermediate" as const,
  },
  {
    name: "Prisma",
    initials: "PR",
    version: "v5.8",
    role: "Type-safe database client, schema management, and auto-generated migrations",
    category: "ORM",
    whyWeChoseIt: "Best-in-class TypeScript ORM with auto-generated types and a readable query API",
    difficulty: "Beginner" as const,
  },
  {
    name: "Stripe",
    initials: "ST",
    version: "vAPI 2024-11",
    role: "Payment processing, Checkout sessions, webhooks, and subscription management",
    category: "Payments",
    whyWeChoseIt: "Industry standard payment infrastructure - best DX, compliance handled out of the box",
    difficulty: "Intermediate" as const,
  },
  {
    name: "Redis",
    initials: "RE",
    version: "v7.2",
    role: "Session storage, rate limiting, cart persistence, and API response caching",
    category: "Cache",
    whyWeChoseIt: "Sub-millisecond reads for hot data, reducing database load by 60-80% under traffic",
    difficulty: "Intermediate" as const,
  },
  {
    name: "NextAuth.js",
    initials: "NA",
    version: "v5",
    role: "Authentication with Google & GitHub OAuth providers and session management",
    category: "Auth",
    whyWeChoseIt: "First-class Next.js integration with secure defaults and minimal boilerplate",
    difficulty: "Intermediate" as const,
  },
  {
    name: "Tailwind CSS",
    initials: "TW",
    version: "v3.4",
    role: "Utility-first styling for consistent, responsive design across the app",
    category: "Styling",
    whyWeChoseIt: "Fast iteration without context-switching to separate CSS files, tiny production bundle",
    difficulty: "Beginner" as const,
  },
];

export const resourceCategories = ["All", "Planning", "Architecture", "Database", "API", "Design", "Code", "DevOps"] as const;
export type ResourceCategory = (typeof resourceCategories)[number];

export const resourceFiles: {
  name: string;
  type: string;
  size: string;
  downloads: string;
  category: Exclude<ResourceCategory, "All">;
}[] = [
  { name: "Product Requirements Document (PRD)", type: "PDF", size: "2.4 MB", downloads: "8,420 downloads", category: "Planning" },
  { name: "Business Requirements Document (BRD)", type: "PDF", size: "1.8 MB", downloads: "6,180 downloads", category: "Planning" },
  { name: "High-Level Design (HLD)", type: "PDF", size: "3.2 MB", downloads: "7,240 downloads", category: "Architecture" },
  { name: "System Architecture Diagram", type: "PNG", size: "1.2 MB", downloads: "9,100 downloads", category: "Architecture" },
  { name: "Entity-Relationship (ER) Diagram", type: "PNG", size: "850 KB", downloads: "7,680 downloads", category: "Database" },
  { name: "Database Schema", type: "SQL", size: "24 KB", downloads: "11,200 downloads", category: "Database" },
  { name: "API Documentation (OpenAPI 3.0)", type: "YAML", size: "48 KB", downloads: "8,940 downloads", category: "API" },
  { name: "Postman Collection", type: "JSON", size: "128 KB", downloads: "10,400 downloads", category: "API" },
  { name: "Figma Design File", type: "Figma", size: "18 MB", downloads: "14,800 downloads", category: "Design" },
  { name: "Starter Code Repository", type: "ZIP", size: "2.8 MB", downloads: "12,100 downloads", category: "Code" },
  { name: "Final Source Code", type: "ZIP", size: "8.4 MB", downloads: "11,800 downloads", category: "Code" },
  { name: "Deployment Guide", type: "PDF", size: "1.1 MB", downloads: "9,200 downloads", category: "DevOps" },
  { name: "Environment Variables Template", type: "ENV", size: "4 KB", downloads: "13,400 downloads", category: "DevOps" },
];

export const interviewQuestions = {
  "Project-Specific Questions": [
    {
      type: "Architecture",
      question: "Walk me through the architecture of this e-commerce platform and the reasoning behind each layer.",
      answer:
        "The system separates concerns into a client layer (Next.js App Router, RSC), an application layer (API routes, auth, ORM), and a data layer (PostgreSQL, Redis, CDN) so each piece can scale and be tested independently.",
    },
    {
      type: "Technical",
      question: "How did you ensure Stripe webhook events are processed exactly once?",
      answer:
        "Each webhook event ID is recorded in a dedicated table with a unique constraint before processing; duplicate deliveries are detected and short-circuited before any side effects run.",
    },
    {
      type: "Technical",
      question: "What was your approach to caching product and inventory data with Redis?",
      answer:
        "Read-heavy product data is cached with a short TTL and invalidated on write, while inventory counts use atomic Redis operations to avoid race conditions during checkout.",
    },
  ],
  "System Design Questions": [],
  "Behavioral Questions": [],
};

export const reviewSummary = {
  average: 4.9,
  total: 2841,
  breakdown: [
    { stars: 5, percent: 78 },
    { stars: 4, percent: 15 },
    { stars: 3, percent: 4 },
    { stars: 2, percent: 2 },
    { stars: 1, percent: 1 },
  ],
};

export const reviews = [
  {
    initials: "AC",
    name: "Aditi Chawla",
    role: "Full-Stack Developer",
    rating: 5,
    date: "3 days ago",
    title: "Best e-commerce course I've taken",
    body: "The Stripe webhook section alone was worth the price. Clear explanations of idempotency, inventory locking, and production deployment. Went from tutorial-level knowledge to actually shipping a real store.",
    helpful: 34,
  },
  {
    initials: "RK",
    name: "Ravi Kumar",
    role: "Backend Engineer",
    rating: 5,
    date: "1 week ago",
    title: "Excellent depth on architecture decisions",
    body: "Loved that every technology choice came with a 'why we chose it' explanation instead of just telling us what to type. The Prisma and Redis sections were especially well paced.",
    helpful: 21,
  },
  {
    initials: "LM",
    name: "Laura Martins",
    role: "Frontend Developer",
    rating: 4,
    date: "2 weeks ago",
    title: "Great content, a bit fast in places",
    body: "The frontend module moves quickly if you're newer to Next.js App Router, but the resources and discussion threads filled in the gaps. Would recommend pausing often.",
    helpful: 12,
  },
];

export const discussionComments = [
  {
    initials: "SM",
    name: "Siddharth Mehta",
    time: "2 hours ago",
    body: "The webhook handling section was incredibly well explained. I never understood idempotency keys until now.",
    likes: 24,
    reply: {
      initials: "S",
      name: "Sai",
      isInstructor: true,
      time: "1 hour ago",
      body: "Great observation - idempotency is one of the most under-taught concepts in payment integrations. Glad it clicked!",
    },
  },
  {
    initials: "PS",
    name: "Priya Sharma",
    time: "5 hours ago",
    body: "Question about the Prisma schema - when should I use a composite index versus two separate indexes?",
    likes: 8,
  },
  {
    initials: "MJ",
    name: "Marcus Johnson",
    time: "1 day ago",
    body: "Completed this project while working full-time. The pacing of the modules made it very manageable.",
    likes: 47,
  },
];
