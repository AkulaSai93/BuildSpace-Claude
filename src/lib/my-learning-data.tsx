import { LibraryIcon, TrophyIcon, ClockIcon, ZapIcon } from "@/components/dashboard/icons";

export const myLearningStats = [
  { id: "enrolled", label: "Enrolled", value: "4", iconBg: "bg-[#ecfdf5] text-emerald-600", icon: <LibraryIcon className="size-4" /> },
  { id: "completed", label: "Completed", value: "2", iconBg: "bg-[#fffbeb] text-amber-600", icon: <TrophyIcon className="size-4" /> },
  { id: "hours-built", label: "Hours Built", value: "48h", iconBg: "bg-[#eff6ff] text-blue-600", icon: <ClockIcon className="size-4" /> },
  { id: "day-streak", label: "Day Streak", value: "6", iconBg: "bg-red-50 text-orange-600", icon: <ZapIcon className="size-4" /> },
];

export const skillsCovered = [
  { name: "Next.js", percent: 68 },
  { name: "TypeScript", percent: 72 },
  { name: "PostgreSQL", percent: 45 },
  { name: "React", percent: 85 },
  { name: "Node.js", percent: 52 },
];

export const achievements: {
  name: string;
  unlocked: boolean;
  icon: "trophy" | "flame" | "star" | "library" | "users" | "graduation";
  iconBg: string;
  iconColor: string;
}[] = [
  { name: "First Build", unlocked: true, icon: "trophy", iconBg: "bg-[#fffbeb]", iconColor: "text-amber-600" },
  { name: "7-Day Streak", unlocked: false, icon: "flame", iconBg: "bg-[#f2f1ee]", iconColor: "text-ink-muted" },
  { name: "Reviewer", unlocked: true, icon: "star", iconBg: "bg-[#f5f3ff]", iconColor: "text-violet-600" },
  { name: "Explorer", unlocked: true, icon: "library", iconBg: "bg-[#eff6ff]", iconColor: "text-blue-600" },
  { name: "Helper", unlocked: false, icon: "users", iconBg: "bg-[#f2f1ee]", iconColor: "text-ink-muted" },
  { name: "Graduate", unlocked: false, icon: "graduation", iconBg: "bg-[#f2f1ee]", iconColor: "text-ink-muted" },
];

export const weeklyActivity = [
  { day: "M", minutes: 45 },
  { day: "T", minutes: 60 },
  { day: "W", minutes: 0 },
  { day: "T", minutes: 120 },
  { day: "F", minutes: 35 },
  { day: "S", minutes: 0 },
  { day: "S", minutes: 0 },
];
