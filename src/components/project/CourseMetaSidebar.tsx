import type { ReactNode } from "react";
import Link from "next/link";
import type { ProjectSummary } from "@/types/library";
import { courseStats, relatedProjects } from "@/lib/course-content";
import {
  BookmarkIcon,
  ClockIcon,
  DownloadIcon,
  EyeIcon,
  PlayIcon,
  ShareIcon,
  UsersIcon,
  VideoIcon,
} from "@/components/dashboard/icons";

function StatRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex w-full items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-ink-muted">
        {icon}
        {label}
      </span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}

export function CourseMetaSidebar({ project }: { project: ProjectSummary }) {
  return (
    <aside className="flex w-[303px] shrink-0 flex-col gap-4 p-5">
      <div className="rounded-xl border border-black/[0.08] bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="relative size-[42px] shrink-0 rounded-full border-2 border-brand/20" />
          <div>
            <p className="text-sm font-semibold text-ink">
              {project.progress?.percentComplete ?? 0}% complete
            </p>
            <p className="text-xs text-ink-muted">6 weeks total</p>
          </div>
        </div>
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand/90"
        >
          <PlayIcon className="size-4" />
          Continue Learning
        </button>
      </div>

      <div className="flex flex-col gap-2.5 rounded-xl border border-black/[0.08] bg-white p-4">
        <StatRow icon={<VideoIcon className="size-3.5" />} label="Total Videos" value={courseStats.totalVideos} />
        <StatRow icon={<ClockIcon className="size-3.5" />} label="Total Duration" value={courseStats.totalDuration} />
        <StatRow icon={<DownloadIcon className="size-3.5" />} label="Resources" value={courseStats.resources} />
        <StatRow icon={<UsersIcon className="size-3.5" />} label="Students" value={courseStats.students} />
        <StatRow icon={<EyeIcon className="size-3.5" />} label="Total Views" value={courseStats.totalViews} />
        <StatRow icon={<BookmarkIcon className="size-3.5" />} label="Bookmarks" value={courseStats.bookmarks} />
      </div>

      <div className="rounded-xl border border-black/[0.08] bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-ink">Instructor</p>
        <div className="flex items-center gap-3">
          <div className="size-10 shrink-0 rounded-full bg-gradient-to-br from-stone-300 to-stone-400" />
          <div>
            <p className="text-sm font-semibold text-ink">{project.instructor.name}</p>
            <p className="text-xs leading-snug text-ink-muted">{project.instructor.title}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-black/[0.08] bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-ink">Related Projects</p>
        <div className="flex flex-col gap-3">
          {relatedProjects.map((rp) => (
            <Link
              key={rp.slug}
              href={`/library/${rp.slug}`}
              className="flex items-center gap-3 rounded-lg hover:bg-black/[0.02]"
            >
              <div className="size-[50px] shrink-0 rounded bg-gradient-to-br from-stone-200 to-stone-300" />
              <div className="min-w-0">
                <p className="line-clamp-2 text-xs font-medium leading-snug text-ink">{rp.title}</p>
                <p className="text-xs text-ink-muted">{rp.duration}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white py-2.5 text-sm font-medium text-ink hover:bg-black/[0.02]"
        >
          <DownloadIcon className="size-4" />
          Download Resources
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white py-2.5 text-sm font-medium text-ink hover:bg-black/[0.02]"
          >
            <BookmarkIcon className="size-4" />
            Save
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white py-2.5 text-sm font-medium text-ink hover:bg-black/[0.02]"
          >
            <ShareIcon className="size-4" />
            Share
          </button>
        </div>
      </div>
    </aside>
  );
}
