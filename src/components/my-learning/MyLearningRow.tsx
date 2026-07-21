import Link from "next/link";
import type { ProjectSummary } from "@/types/library";
import { AwardIcon, CheckCircleIcon, ClockIcon, PlayIcon, StarIcon, UsersIcon, VideoIcon } from "@/components/dashboard/icons";

const levelStyles: Record<ProjectSummary["level"], string> = {
  Beginner: "bg-emerald-50 text-emerald-600",
  Intermediate: "bg-[#fffbeb] text-[#bb4d00]",
  Advanced: "bg-red-50 text-red-600",
};

export function MyLearningRow({ project }: { project: ProjectSummary }) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-black/[0.08] bg-white p-5">
      <div className="flex w-full items-start gap-4">
        <div className="relative h-[134px] w-[176px] shrink-0 overflow-hidden rounded bg-stone-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={encodeURI(project.thumbnail)} alt={project.title} className="h-full w-full object-cover" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[15px] font-semibold leading-tight text-ink">{project.title}</h3>
              <p className="text-xs text-ink-muted">{project.instructor.title}</p>
            </div>
            {project.status === "completed" ? (
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                <CheckCircleIcon className="size-3.5" />
                Completed
              </span>
            ) : (
              <span className={`shrink-0 rounded-[14px] px-2.5 py-1 text-xs font-medium ${levelStyles[project.level]}`}>
                {project.level}
              </span>
            )}
          </div>

          {project.status === "completed" && project.yourRating && (
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  className={`size-3.5 ${i < project.yourRating! ? "text-amber-500" : "text-black/15"}`}
                />
              ))}
              <span className="text-xs text-ink-muted">Your rating</span>
            </div>
          )}

          {project.status === "in-progress" && project.progress && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-muted">{project.progress.percentComplete}% complete</span>
                <span className="text-ink-muted">{project.progress.weeksLeft} weeks left</span>
              </div>
              <div className="h-2 w-full rounded-full bg-black/[0.08]">
                <div className="h-2 rounded-full bg-brand" style={{ width: `${project.progress.percentComplete}%` }} />
              </div>
            </>
          )}

          {project.status === "completed" && (
            <div className="h-2 w-full rounded-full bg-brand" />
          )}

          {project.status === "bookmarked" && (
            <div className="flex items-center gap-4 text-xs text-ink-muted">
              <span className="flex items-center gap-1">
                <StarIcon className="size-3 text-amber-500" />
                {project.rating} ({project.reviewCount.toLocaleString()})
              </span>
              <span className="flex items-center gap-1">
                <UsersIcon className="size-3" />
                {project.learners}
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="size-3" />
                {project.duration}
              </span>
              <span className="flex items-center gap-1">
                <VideoIcon className="size-3" />
                {project.videoCount}
              </span>
            </div>
          )}

          {project.status !== "bookmarked" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-ink-muted">
                {project.status === "completed" ? (
                  <span>{project.completedOn}</span>
                ) : (
                  <span className="flex items-center gap-1">
                    <VideoIcon className="size-3" />
                    {project.videoCount} videos
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <ClockIcon className="size-3" />
                  {project.duration}
                </span>
              </div>

              {project.status === "completed" ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-brand">
                  <AwardIcon className="size-3.5" />
                  Certificate
                </span>
              ) : (
                <Link
                  href={`/library/${project.slug}`}
                  className="flex items-center gap-1.5 rounded-2xl bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand/90"
                >
                  <PlayIcon className="size-3" />
                  Start
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pl-[192px]">
        {project.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-[14px] bg-[#f2f1ee] px-1.5 py-0.5 text-[11px] font-medium text-ink/65">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
