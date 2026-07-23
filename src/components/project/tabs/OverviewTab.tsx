import type { CourseContentData } from "@/types/projectContent";
import { CheckCircleIcon, PlayIcon } from "@/components/dashboard/icons";

export function OverviewTab({
  learningOutcomes,
  prerequisites,
  systemArchitecture,
  whatYoullBuild,
}: Pick<CourseContentData, "learningOutcomes" | "prerequisites" | "systemArchitecture" | "whatYoullBuild">) {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-3 text-base font-semibold text-ink">Business Problem</h2>
        <p className="text-sm leading-relaxed text-ink-muted">
          Building a production-ready e-commerce platform requires solving for cart persistence
          across sessions, secure and idempotent payment processing, real-time inventory accuracy,
          and an admin experience that non-technical staff can operate confidently. This project
          walks through each of those constraints end-to-end.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-ink">What You&apos;ll Build</h2>
        <div className="grid grid-cols-2 gap-x-10 gap-y-2">
          {whatYoullBuild.map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-brand" />
              <p className="text-sm text-ink">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-ink">System Architecture</h2>
        <div className="grid grid-cols-3 gap-6 rounded-xl border border-black/[0.08] bg-white p-5">
          {Object.entries(systemArchitecture).map(([layer, items]) => (
            <div key={layer}>
              <p className="mb-2.5 text-sm font-semibold text-ink">{layer}</p>
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <div key={item} className="rounded-lg bg-[#f2f1ee] py-2 text-center text-xs text-ink">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-ink">Learning Outcomes</h2>
        <div className="flex flex-col gap-2.5">
          {learningOutcomes.map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <PlayIcon className="mt-0.5 size-4 shrink-0 text-brand" />
              <p className="text-sm text-ink">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-ink">Prerequisites</h2>
        <div className="flex flex-wrap items-center gap-2">
          {prerequisites.map((req) => (
            <span key={req} className="rounded-[14px] bg-[#f2f1ee] px-2.5 py-1 text-sm font-medium text-ink/75">
              {req}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
