import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProjectProgressCard } from "@/components/dashboard/ProjectProgressCard";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { ArrowRightIcon, CompassIcon, FlameIcon } from "@/components/dashboard/icons";
import {
  dashboardStats,
  inProgressProjects,
  trendingCourses,
} from "@/lib/dashboard-data";

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <DashboardHeader />

      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-7 px-20 pb-10 pt-10">
        {/* Greeting */}
        <div className="flex w-full items-center justify-between">
          <div className="flex w-[470px] flex-col items-start gap-[5px]">
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
        <div className="flex items-center gap-6">
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
          <div className="grid grid-cols-2 gap-6">
            {inProgressProjects.map((project) => (
              <Link key={project.id} href={`/library/${project.id}`}>
                <ProjectProgressCard project={project} />
              </Link>
            ))}
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
          <div className="grid grid-cols-3 gap-6">
            {trendingCourses.map((course) => (
              <Link key={course.id} href={`/library/${course.id}`}>
                <CourseCard course={course} />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
