import Link from "next/link";
import type { ProjectSummary } from "@/types/library";
import { ClockIcon, StarIcon, VideoIcon } from "@/components/dashboard/icons";

const levelStyles: Record<ProjectSummary["level"], string> = {
  Beginner: "bg-emerald-50 text-emerald-600",
  Intermediate: "bg-[#fffbeb] text-[#bb4d00]",
  Advanced: "bg-red-50 text-red-600",
};

export function ProjectListRow({ project }: { project: ProjectSummary }) {
  return (
    <Link
      href={`/library/${project.slug}`}
      className="relative flex w-full items-center gap-5 rounded-xl border border-black/[0.08] bg-white p-4 transition-shadow hover:shadow-md"
    >
      {project.isPro && (
        <span className="absolute right-4 top-4 rounded-[14px] bg-brand/90 px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.5px] text-white">
          PRO
        </span>
      )}

      <div className="relative h-[116px] w-[176px] shrink-0 overflow-hidden rounded bg-stone-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={encodeURI(project.thumbnail)}
          alt={project.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex w-full items-start justify-between gap-4 pr-14">
          <h3 className="text-[15px] font-semibold leading-tight text-ink">{project.title}</h3>
          <span className={`shrink-0 rounded-[14px] px-2 py-[3px] text-[11px] font-medium ${levelStyles[project.level]}`}>
            {project.level}
          </span>
        </div>
        <p className="text-sm leading-snug text-ink-muted line-clamp-2">{project.shortDescription}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-[14px] bg-[#f2f1ee] px-1.5 py-0.5 text-[11px] font-medium text-ink/65">
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs text-ink-muted">+{project.tags.length - 3} more</span>
          )}
        </div>
        <div className="flex items-center gap-5 text-xs text-ink-muted">
          <span className="flex items-center gap-1">
            <StarIcon className="size-3 text-amber-500" />
            <span className="font-semibold text-ink">{project.rating}</span> ({project.reviewCount.toLocaleString()})
          </span>
          <span className="flex items-center gap-1">
            <UsersIconInline /> {project.learners}
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon className="size-3" /> {project.duration}
          </span>
          <span className="flex items-center gap-1">
            <VideoIcon className="size-3" /> {project.videoCount}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center self-stretch">
        <span className="flex items-center gap-1.5 rounded-2xl bg-brand px-3 py-2 text-xs font-semibold text-white">
          Start
        </span>
      </div>
    </Link>
  );
}

function UsersIconInline() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-3">
      <circle cx="6" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 13c0-2.2 1.8-3.5 4-3.5s4 1.3 4 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
