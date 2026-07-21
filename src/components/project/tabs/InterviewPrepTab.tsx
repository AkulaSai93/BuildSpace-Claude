"use client";

import { useState } from "react";
import { interviewQuestions } from "@/lib/course-content";
import { ChevronDownIcon, TargetIcon } from "@/components/dashboard/icons";

export function InterviewPrepTab() {
  const [openSection, setOpenSection] = useState("Project-Specific Questions");
  const sections = Object.entries(interviewQuestions);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3 rounded-xl border border-black/[0.08] bg-white p-4">
        <TargetIcon className="mt-0.5 size-5 shrink-0 text-brand" />
        <div>
          <p className="text-sm font-semibold text-ink">Interview-Ready After This Project</p>
          <p className="mt-1 text-sm text-ink-muted">
            48 curated questions with STAR-method answers, resources, and technical deep-dives
            drawn directly from what you built.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {sections.map(([section, questions]) => {
          const isOpen = openSection === section;
          return (
            <div key={section} className="overflow-hidden rounded-xl border border-black/[0.08] bg-white">
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? "" : section)}
                className="flex w-full items-center justify-between px-4 py-3"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                  {section}
                  <span className="flex size-[19px] items-center justify-center rounded-full bg-[#f2f1ee] text-xs font-medium text-ink-muted">
                    {questions.length}
                  </span>
                </span>
                <ChevronDownIcon className={`size-4 text-ink-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && questions.length > 0 && (
                <div className="flex flex-col divide-y divide-black/[0.06] border-t border-black/[0.06]">
                  {questions.map((q) => (
                    <div key={q.question} className="flex flex-col gap-1 px-4 py-4">
                      <div className="flex gap-3">
                        <span className="w-[65px] shrink-0 rounded-[14px] bg-[#f2f1ee] px-2 py-0.5 text-center text-xs font-medium text-ink-muted">
                          {q.type}
                        </span>
                        <p className="text-sm font-medium text-ink">{q.question}</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="w-[65px] shrink-0 rounded-[14px] bg-[#f2f1ee] px-2 py-0.5 text-center text-xs font-medium text-ink-muted">
                          Answer
                        </span>
                        <p className="text-sm text-ink-muted">{q.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
