import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/supabaseAuth";
import { ACCESS_COOKIE } from "@/lib/auth/cookies";
import { listProjects } from "@/lib/projectsData";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProjectProgressCard } from "@/components/dashboard/ProjectProgressCard";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { ArrowRightIcon, CompassIcon, FlameIcon, PlayIcon, ClockIcon, DownloadIcon, ChatIcon } from "@/components/dashboard/icons";
import type { InProgressProject, TrendingCourse, DashboardStat } from "@/types/dashboard";

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

// Placeholder activity metrics — not tied to real usage tracking yet, so
// these stay static for now (unlike the project cards below, which now come
// straight from Supabase instead of a hardcoded file).
const dashboardStats: DashboardStat[] = [
  { id: "projects-started", label: "Projects Started", value: "3", iconBg: "bg-[#ecfdf5] text-brand", icon: <PlayIcon className="size-4" /> },
  { id: "hours-building", label: "Hours Building", value: "47h", iconBg: "bg-[#eff6ff] text-blue-600", icon: <ClockIcon className="size-4" /> },
  { id: "files-downloaded", label: "Files Downloaded", value: "28", iconBg: "bg-[#f5f3ff] text-violet-600", icon: <DownloadIcon className="size-4" /> },
  { id: "discussions", label: "Discussions", value: "12", iconBg: "bg-[#fffbeb] text-amber-600", icon: <ChatIcon className="size-4" /> },
];

export default async function DashboardPage() {
  const accessToken = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!accessToken) {
    redirect("/login");
  }
  try {
    await getUser(accessToken);
  } catch {
    redirect("/login");
  }

  const projects = await listProjects();

  const inProgressProjects: InProgressProject[] = projects
    .filter((p) => p.status === "in-progress")
    .map((p) => ({
      id: p.slug,
      title: p.title,
      thumbnail: p.thumbnail,
      percentComplete: p.progress?.percentComplete ?? 0,
      estimatedWeeks: p.progress?.weeksLeft ?? 0,
      tags: p.tags.slice(0, 2),
    }));

  const trendingCourses: TrendingCourse[] = projects.slice(0, 6).map((p) => ({
    id: p.slug,
    title: p.title,
    description: p.shortDescription,
    thumbnail: p.thumbnail,
    isPro: p.isPro,
    tags: p.tags,
    rating: p.rating,
    reviewCount: p.reviewCount,
    level: p.level,
    videoCount: p.videoCount,
    duration: p.duration,
    learners: p.learners,
  }));

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <DashboardHeader />

      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-7 px-4 pb-10 pt-10 sm:px-8 lg:px-20">
        {/* Greeting */}
        <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-[470px] flex-col items-start gap-[5px]">
            <p className="text-xs font-medium uppercase text-ink-muted">{today}</p>
            <h1 className="text-2xl font-semibold text-ink">Good morning, Sai.</h1>
            <p className="text-sm text-ink-muted">
              You&apos;re 34% through the e-commerce build. Keep the momentum going.
            </p>
          </div>
          <Link
            href="/library"
            className="flex items-center gap-2 rounded-[20px] bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand/90"
          >
            <CompassIcon className="size-4" />
            Explore Library
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {dashboardStats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        {/* Continue Building */}
        <section className="flex flex-col gap-[18px]">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-base font-semibold text-ink">Continue Building</h2>
            <Link href="/my-learning" className="text-sm text-brand hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2">
            {inProgressProjects.map((project) => (
              <Link key={project.id} href={`/library/${project.id}`} className="flex h-full">
                <ProjectProgressCard project={project} />
              </Link>
            ))}
            {inProgressProjects.length === 0 && (
              <p className="text-sm text-ink-muted">No projects in progress yet — explore the library to start one.</p>
            )}
          </div>
        </section>

        {/* Trending This Week */}
        <section className="flex flex-col gap-[18px]">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-1.5">
              <FlameIcon className="size-4 text-orange-500" />
              <h2 className="text-base font-semibold text-ink">Trending This Week</h2>
            </div>
            <Link
              href="/library"
              className="flex items-center gap-1 text-sm text-brand hover:underline"
            >
              Browse all
              <ArrowRightIcon className="size-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trendingCourses.map((course) => (
              <Link key={course.id} href={`/library/${course.id}`} className="flex h-full">
                <CourseCard course={course} />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
