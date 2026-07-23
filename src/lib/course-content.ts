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
  {
    title: "Real-Time Chat App with Socket.io, Redis & React",
    duration: "38h 15m",
    slug: "realtime-chat",
    thumbnail: "/images/projects/realtime-chat/thumbnail.png",
  },
  {
    title: "AI-Powered Resume Builder with OpenAI & FastAPI",
    duration: "28h 45m",
    slug: "ai-resume-builder",
    thumbnail: "/images/projects/ai-resume-builder/thumbnail.png",
  },
  {
    title: "Netflix Clone with React, Firebase & TMDb API",
    duration: "22h 10m",
    slug: "netflix-clone",
    thumbnail: "/images/projects/netflix-clone/thumbnail.png",
  },
];

// Fixed UI filter-chip config for the Resources tab — NOT per-project authored
// content, so it is not part of ProjectContent/CourseContentData and stays a
// static import.
export const resourceCategories = ["All", "Planning", "Architecture", "Database", "API", "Design", "Code", "DevOps"] as const;
export type ResourceCategory = (typeof resourceCategories)[number];
