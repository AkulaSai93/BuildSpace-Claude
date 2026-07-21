import type { InProgressProject } from "@/types/dashboard";
import { PlayIcon } from "./icons";

export function ProjectProgressCard({ project }: { project: InProgressProject }) {
  const angle = Math.round((project.percentComplete / 100) * 360);

  return (
    <div className="flex h-full w-full flex-col items-start rounded-xl border border-black/[0.08] bg-white p-5">
      <div className="flex w-full items-center gap-3">
        <div className="relative h-[116px] w-[109px] shrink-0 overflow-hidden rounded bg-stone-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={encodeURI(project.thumbnail)}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex h-[116px] w-full flex-col gap-[14px]">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex h-[28px] items-center justify-between gap-3">
              <p className="text-[13px] font-semibold leading-tight text-ink">
                {project.title}
              </p>
              <div
                className="relative flex size-[42px] shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#065f46 ${angle}deg, #e7e5e0 ${angle}deg)`,
                }}
              >
                <div className="flex size-[34px] items-center justify-center rounded-full bg-white">
                  <span className="text-[9px] font-semibold text-brand">{project.percentComplete}%</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-ink-muted">
              {project.percentComplete}% complete · {project.estimatedWeeks} weeks estimated
            </p>
            <div className="flex items-center gap-1">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#f2f1ee] px-1.5 py-[3px] text-[10px] font-medium text-ink/65"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="flex w-fit items-center gap-1 text-xs font-semibold text-brand"
          >
            <PlayIcon className="size-3" />
            Resume
          </button>
        </div>
      </div>
    </div>
  );
}
