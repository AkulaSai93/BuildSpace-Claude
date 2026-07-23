import { hubSections } from "@/lib/learning-hub-data";
import type { HubContent } from "@/types/projectContent";

export function HubMetaSidebar({
  content,
  activeSection,
  completedSections,
}: {
  content: HubContent;
  activeSection: string;
  completedSections: Set<string>;
}) {
  return (
    <aside className="flex w-[260px] shrink-0 flex-col gap-4 border-l border-black/[0.06] bg-white p-5 text-sm">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Hub Progress</p>
        <div className="flex flex-col gap-2">
          {hubSections.map((section) => {
            const isDone = completedSections.has(section.id);
            const isActive = section.id === activeSection;
            return (
              <span
                key={section.id}
                className={`flex items-center gap-2 text-xs ${
                  isActive ? "font-semibold text-ink" : isDone ? "text-ink-muted line-through" : "text-ink-muted"
                }`}
              >
                <span className={`size-1.5 shrink-0 rounded-full ${isDone || isActive ? "bg-brand" : "bg-black/15"}`} />
                {section.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-black/[0.06] pt-4 text-xs">
        <div className="flex justify-between">
          <span className="uppercase tracking-wide text-ink-muted">Difficulty</span>
        </div>
        <p className="-mt-1 font-semibold text-ink">{content.meta.difficulty}</p>
        <div className="mt-1 flex justify-between">
          <span className="uppercase tracking-wide text-ink-muted">Duration</span>
        </div>
        <p className="-mt-1 font-semibold text-ink">{content.meta.duration}</p>
        <div className="mt-1 flex justify-between">
          <span className="uppercase tracking-wide text-ink-muted">Students</span>
        </div>
        <p className="-mt-1 font-semibold text-ink">{content.meta.students}</p>
        <div className="mt-1 flex justify-between">
          <span className="uppercase tracking-wide text-ink-muted">Resources</span>
        </div>
        <p className="-mt-1 font-semibold text-ink">{content.meta.resources}</p>
        <div className="mt-1 flex justify-between">
          <span className="uppercase tracking-wide text-ink-muted">Certificate</span>
        </div>
        <p className="-mt-1 font-semibold text-ink">{content.meta.certificate}</p>
        <div className="mt-1 flex justify-between">
          <span className="uppercase tracking-wide text-ink-muted">Status</span>
        </div>
        <p className="-mt-1 font-semibold text-brand">{content.meta.status}</p>
      </div>

      <div className="border-t border-black/[0.06] pt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Instructor</p>
        <div className="flex items-center gap-2.5">
          {content.meta.instructor.name === "Alex Chen" ? (
            <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-stone-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/source/Image (Alex Chen).png" alt={content.meta.instructor.name} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="size-8 shrink-0 rounded-full bg-gradient-to-br from-stone-300 to-stone-400" />
          )}
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-ink">{content.meta.instructor.name}</p>
            <p className="truncate text-[11px] text-ink-muted">{content.meta.instructor.title}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-black/[0.06] pt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Tech Stack</p>
        <div className="flex flex-wrap gap-1.5">
          {content.meta.techStack.map((tech) => (
            <span key={tech} className="rounded-full bg-[#f2f1ee] px-2 py-1 text-[11px] font-medium text-ink/75">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
