export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export interface ProjectSummary {
  slug: string;
  title: string;
  shortDescription: string;
  category: "Full Stack" | "Frontend" | "Backend" | "AI / ML" | "Mobile" | "Cloud / DevOps" | "Blockchain" | "Cyber Security" | "IoT";
  thumbnail: string;
  isPro: boolean;
  tags: string[];
  level: DifficultyLevel;
  rating: number;
  reviewCount: number;
  videoCount: number;
  duration: string;
  learners: string;
  instructor: {
    name: string;
    title: string;
  };
  progress?: {
    percentComplete: number;
    weeksLeft: number;
  };
  status?: "in-progress" | "completed" | "bookmarked";
  completedOn?: string;
  yourRating?: number;
}

export interface LibraryCategory {
  label: string;
  count: number;
}
