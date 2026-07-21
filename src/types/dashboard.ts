import type { ReactNode } from "react";

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  iconBg: string;
  icon: ReactNode;
}

export interface InProgressProject {
  id: string;
  title: string;
  thumbnail: string;
  percentComplete: number;
  estimatedWeeks: number;
  tags: string[];
}

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export interface TrendingCourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  isPro: boolean;
  tags: string[];
  rating: number;
  reviewCount: number;
  level: CourseLevel;
  videoCount: number;
  duration: string;
  learners: string;
}
