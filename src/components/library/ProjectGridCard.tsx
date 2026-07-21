import Link from "next/link";
import type { ProjectSummary } from "@/types/library";
import {
  ClockIcon,
  StarIcon,
  UsersIcon,
  VideoIcon,
} from "@/components/dashboard/icons";

const levelStyles: Record<ProjectSummary["level"], string> = {
  Beginner: "bg-emerald-50 text-emerald-600",
  Intermediate: "bg-[#fffbeb] text-[#bb4d00]",
  Advanced: "bg-red-50 text-red-600",
};

export function ProjectGridCard({ project }: { project: ProjectSummary }) {
  return (
    <Link
      href={`/library/${project.slug}`}
      className="flex w-full flex-col items-start overflow-hidden rounded-lg border border-black/[0.08] bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative h-[197px] w-full shrink-0 bg-stone-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={encodeURI(project.thumbnail)}
          alt={project.title}
          className="h-full w-full object-cover"
        />
        {project.isPro && (
          <span className="absolute left-[9px] top-3 rounded-[14px] bg-brand/90 px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.5px] text-white">
            PRO
          </span>
        )}
      </div>

      <div className="flex w-full flex-col items-start gap-3.5 p-5">
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-2.5">
            <p className="text-[13px] font-semibold leading-tight text-ink">{project.title}</p>
            <p className="text-[11px] leading-relaxed text-ink-muted line-clamp-2">
              {project.shortDescription}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-[14px] bg-[#f2f1ee] px-1.5 py-0.5 text-[10px] font-medium tracking-[-0.25px] text-ink/65"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-[10px] text-ink-muted">+{project.tags.length - 3} more</span>
            )}
          </div>
        </div>

        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <StarIcon className="size-3 text-amber-500" />
            <span className="text-xs font-semibold text-ink">{project.rating}</span>
            <span className="text-[10px] text-ink-muted">({project.reviewCount.toLocaleString()})</span>
          </div>
          <span className={`rounded-[14px] px-2 py-[3px] text-[11px] font-medium ${levelStyles[project.level]}`}>
            {project.level}
          </span>
        </div>

        <div className="h-px w-full bg-black/[0.08]" />

        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <VideoIcon className="size-3 text-ink-muted" />
            <span className="text-[10px] text-ink-muted">{project.videoCount} videos</span>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="size-3 text-ink-muted" />
            <span className="text-[10px] text-ink-muted">{project.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <UsersIcon className="size-3 text-ink-muted" />
            <span className="text-[10px] text-ink-muted">{project.learners}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
