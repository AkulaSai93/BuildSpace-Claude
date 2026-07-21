import { PlayIcon, CheckCircleIcon, ClockIcon, FlagIcon } from "@/components/dashboard/icons";

export const myLearningStats = [
  { id: "enrolled", label: "Enrolled", value: "4", iconBg: "bg-[#ecfdf5] text-brand", icon: <PlayIcon className="size-4" /> },
  { id: "completed", label: "Completed", value: "2", iconBg: "bg-[#eff6ff] text-blue-600", icon: <CheckCircleIcon className="size-4" /> },
  { id: "hours-built", label: "Hours Built", value: "48h", iconBg: "bg-[#f5f3ff] text-violet-600", icon: <ClockIcon className="size-4" /> },
  { id: "day-streak", label: "Day Streak", value: "6", iconBg: "bg-[#fffbeb] text-amber-600", icon: <FlagIcon className="size-4" /> },
];

export const skillsCovered = [
  { name: "Next.js", percent: 68 },
  { name: "TypeScript", percent: 72 },
  { name: "PostgreSQL", percent: 45 },
  { name: "React", percent: 85 },
  { name: "Node.js", percent: 52 },
];

export const achievements = [
  "First Build",
  "7-Day Streak",
  "Reviewer",
  "Explorer",
  "Helper",
  "Graduate",
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
