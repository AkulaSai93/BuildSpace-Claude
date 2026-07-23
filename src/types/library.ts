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
  // Publishing state for the admin catalog. Missing/undefined is treated as
  // "published" so every project seeded before this field existed keeps
  // showing up in the public library exactly as before.
  publishStatus?: "draft" | "published" | "archived";
}

export interface LibraryCategory {
  label: string;
  count: number;
}
