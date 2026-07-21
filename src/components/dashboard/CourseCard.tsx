import type { CourseLevel, TrendingCourse } from "@/types/dashboard";
import { ClockIcon, StarIcon, UsersIcon, VideoIcon } from "./icons";

const levelStyles: Record<CourseLevel, string> = {
  Beginner: "bg-emerald-50 text-emerald-600",
  Intermediate: "bg-[#fffbeb] text-[#bb4d00]",
  Advanced: "bg-red-50 text-red-600",
};

export function CourseCard({ course }: { course: TrendingCourse }) {
  return (
    <div className="flex w-full flex-col items-start overflow-hidden rounded-lg border border-black/[0.08] bg-white">
      <div className="relative h-[197px] w-full shrink-0 bg-stone-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={encodeURI(course.thumbnail)}
          alt={course.title}
          className="h-full w-full object-cover"
        />
        {course.isPro && (
          <span className="absolute left-[9px] top-3 rounded-[14px] bg-brand/90 px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.5px] text-white">
            PRO
          </span>
        )}
      </div>

      <div className="h-1 w-full bg-black/20">
        <div className="h-1 w-[29%] bg-brand" />
      </div>

      <div className="flex w-full flex-col items-start gap-3.5 p-5">
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-2.5">
            <p className="text-[13px] font-semibold leading-tight text-ink">
              {course.title}
            </p>
            <p className="text-[11px] leading-relaxed text-ink-muted">
              {course.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {course.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-[14px] bg-[#f2f1ee] px-1.5 py-0.5 text-[10px] font-medium tracking-[-0.25px] text-ink/65"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <StarIcon className="size-3 text-amber-500" />
            <span className="text-xs font-semibold text-ink">{course.rating}</span>
            <span className="text-[10px] text-ink-muted">
              ({course.reviewCount.toLocaleString()})
            </span>
          </div>
          <span
            className={`rounded-[14px] px-2 py-[3px] text-[11px] font-medium ${levelStyles[course.level]}`}
          >
            {course.level}
          </span>
        </div>

        <div className="h-px w-full bg-black/[0.08]" />

        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <VideoIcon className="size-3 text-ink-muted" />
            <span className="text-[10px] text-ink-muted">{course.videoCount} videos</span>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="size-3 text-ink-muted" />
            <span className="text-[10px] text-ink-muted">{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <UsersIcon className="size-3 text-ink-muted" />
            <span className="text-[10px] text-ink-muted">{course.learners}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
