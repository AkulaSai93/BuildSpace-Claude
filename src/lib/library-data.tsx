import type { ReactNode } from "react";
import type { LibraryCategory, ProjectSummary } from "@/types/library";
import {
  BrainIcon,
  CheckBadgeIcon,
  CloudIcon,
  CpuIcon,
  LayersIcon,
  LinkIcon,
  MonitorIcon,
  PhoneIcon,
  ServerIcon,
  ShieldIcon,
} from "@/components/dashboard/icons";

const categoryIcons: Record<string, ReactNode> = {
  "All Projects": <CheckBadgeIcon className="size-3.5" />,
  "Full Stack": <LayersIcon className="size-3.5" />,
  Frontend: <MonitorIcon className="size-3.5" />,
  Backend: <ServerIcon className="size-3.5" />,
  "AI / ML": <BrainIcon className="size-3.5" />,
  Mobile: <PhoneIcon className="size-3.5" />,
  "Cloud / DevOps": <CloudIcon className="size-3.5" />,
  Blockchain: <LinkIcon className="size-3.5" />,
  "Cyber Security": <ShieldIcon className="size-3.5" />,
  IoT: <CpuIcon className="size-3.5" />,
};

const categoryOrder = [
  "All Projects",
  "Full Stack",
  "Frontend",
  "Backend",
  "AI / ML",
  "Mobile",
  "Cloud / DevOps",
  "Blockchain",
  "Cyber Security",
  "IoT",
];

export const technologyFilters = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Java",
];

export const collectionFilters = [
  { label: "Build Before FAANG", count: 12 },
  { label: "Top React Projects", count: 18 },
  { label: "Top AI / ML Projects", count: 15 },
  { label: "Portfolio Essentials", count: 10 },
  { label: "Enterprise Applications", count: 8 },
  { label: "Trending This Month", count: 24 },
];

// The project catalog itself now lives in Supabase (table: projects, one
// row per slug) and is fully admin-managed — see /admin/projects and
// /api/projects. Pages fetch it client-side via fetchProjects() below
// instead of importing a hardcoded array.
export async function fetchProjects(): Promise<ProjectSummary[]> {
  const res = await fetch("/api/projects", { cache: "no-store" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Failed to load projects (${res.status})`);
  }
  const body = await res.json();
  return body.projects as ProjectSummary[];
}

export function getLibraryCategories(projects: ProjectSummary[]): (LibraryCategory & { icon: ReactNode })[] {
  return categoryOrder.map((label) => ({
    label,
    count: label === "All Projects" ? projects.length : projects.filter((p) => p.category === label).length,
    icon: categoryIcons[label],
  }));
}
