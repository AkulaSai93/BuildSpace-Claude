"use client";

import { useState } from "react";
import { buildJourney } from "@/lib/course-content";
import { CheckCircleIcon, ChevronDownIcon, PlayIcon } from "@/components/dashboard/icons";

export function BuildJourneySidebar() {
  const [openModule, setOpenModule] = useState(2);

  return (
    <aside className="w-[282px] shrink-0 border-r border-black/[0.06] bg-white">
      <div className="border-b border-black/[0.06] p-4">
        <h3 className="text-sm font-semibold text-ink">Build Journey</h3>
        <div className="mt-2.5 flex items-center justify-between text-xs text-ink-muted">
          <span>5/29 lessons</span>
          <span>17% complete</span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-black/[0.08]">
          <div className="h-1.5 w-[17%] rounded-full bg-brand" />
        </div>
      </div>

      <div className="flex flex-col">
        {buildJourney.map((module) => {
          const isOpen = openModule === module.number;
          return (
            <div key={module.number} className="border-b border-black/[0.06]">
              <button
                type="button"
                onClick={() => setOpenModule(isOpen ? -1 : module.number)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
              >
                {module.completed ? (
                  <CheckCircleIcon className="size-5 shrink-0 text-brand" />
                ) : (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-black/20 text-[11px] text-ink-muted">
                    {module.number}
                  </span>
                )}
                <span className="flex-1">
                  <span className="block text-sm font-medium text-ink">{module.title}</span>
                  <span className="block text-xs text-ink-muted">{module.meta}</span>
                </span>
                {module.lessons.length > 0 && (
                  <ChevronDownIcon
                    className={`size-3.5 shrink-0 text-ink-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {isOpen && module.lessons.length > 0 && (
                <div className="flex flex-col pb-2">
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.title}
                      type="button"
                      className="flex items-center gap-3 py-2 pl-[46px] pr-4 text-left hover:bg-black/[0.02]"
                    >
                      {lesson.completed ? (
                        <CheckCircleIcon className="size-3.5 shrink-0 text-brand" />
                      ) : (
                        <PlayIcon className="size-3.5 shrink-0 text-ink-muted" />
                      )}
                      <span className="flex-1 text-sm text-ink">{lesson.title}</span>
                      <span className="text-xs text-ink-muted">{lesson.duration}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
