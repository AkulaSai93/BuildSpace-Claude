"use client";

import {
  businessProblemParagraph,
  learningOutcomes,
  prerequisites,
  systemArchitecture,
  techStackDetail,
  whatYoullBuild,
} from "@/lib/course-content";
import { ResourcesTab } from "@/components/project/tabs/ResourcesTab";
import { InterviewPrepTab } from "@/components/project/tabs/InterviewPrepTab";
import { DiscussionTab } from "@/components/project/tabs/DiscussionTab";
import { ReviewsTab } from "@/components/project/tabs/ReviewsTab";
import { CheckCircleIcon, ExternalLinkIcon, LightbulbIcon } from "@/components/dashboard/icons";

const subTabs = ["Overview", "Tech Stack", "Resources", "Interview Prep", "Discussion", "Reviews"] as const;
export type BuildJourneySubTab = (typeof subTabs)[number];

const layerStyles: Record<string, string> = {
  "Client Layer": "bg-[#ecfdf5] text-emerald-700",
  "Application Layer": "bg-[#eff6ff] text-blue-700",
  "Data Layer": "bg-[#f2f1ee] text-ink/70",
};

const avatarStyles: Record<string, string> = {
  "Next.js": "bg-[#0f172a]",
  TypeScript: "bg-[#2563eb]",
  PostgreSQL: "bg-[#1e293b]",
  Prisma: "bg-[#0f766e]",
  Stripe: "bg-[#6d28d9]",
  Redis: "bg-[#dc2626]",
  "NextAuth.js": "bg-[#065f46]",
  "Tailwind CSS": "bg-[#0891b2]",
};

const difficultyStyles: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-600",
  Intermediate: "bg-[#fffbeb] text-[#bb4d00]",
  Advanced: "bg-red-50 text-red-600",
};

function OverviewSubTab() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-base font-semibold text-ink">Business Problem</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{businessProblemParagraph}</p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-ink">What You&apos;ll Build</h2>
        <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2.5">
          {whatYoullBuild.map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm text-ink">
              <CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-brand" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-ink">System Architecture</h2>
        <div className="mt-3 grid grid-cols-3 gap-4">
          {Object.entries(systemArchitecture).map(([layer, items]) => (
            <div key={layer} className="rounded-xl border border-black/[0.08] bg-white p-4">
              <p className="text-center text-xs font-semibold uppercase tracking-wide text-ink-muted">{layer}</p>
              <div className="mt-3 flex flex-col gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className={`rounded-lg px-3 py-2 text-center text-xs font-medium ${layerStyles[layer] ?? "bg-[#f2f1ee] text-ink/70"}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-ink">Learning Outcomes</h2>
        <div className="mt-3 flex flex-col gap-2.5">
          {learningOutcomes.map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm text-ink">
              <LightbulbIcon className="mt-0.5 size-4 shrink-0 text-amber-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-ink">Prerequisites</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {prerequisites.map((item) => (
            <span key={item} className="rounded-[14px] bg-[#f2f1ee] px-3 py-1.5 text-xs font-medium text-ink/70">
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

function TechStackSubTab() {
  const cards = techStackDetail.slice(0, 6);

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((tech) => (
        <div key={tech.name} className="flex flex-col gap-3 rounded-xl border border-black/[0.08] bg-white p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${
                  avatarStyles[tech.name] ?? "bg-stone-500"
                }`}
              >
                {tech.initials}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{tech.name}</p>
                <p className="text-xs text-ink-muted">{tech.version}</p>
              </div>
            </div>
            <span className="shrink-0 rounded-[14px] bg-[#f2f1ee] px-2 py-0.5 text-[11px] font-medium text-ink/70">
              {tech.category}
            </span>
          </div>

          <p className="text-xs leading-relaxed text-ink-muted">{tech.role}</p>

          <div className="rounded-lg bg-[#ecfdf5] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-brand">Why We Chose It</p>
            <p className="mt-1 text-xs leading-relaxed text-emerald-800">{tech.whyWeChoseIt}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className={`rounded-[14px] px-2.5 py-1 text-xs font-medium ${difficultyStyles[tech.difficulty] ?? "bg-[#f2f1ee] text-ink/70"}`}>
              {tech.difficulty}
            </span>
            <button type="button" className="flex items-center gap-1 text-xs font-medium text-brand hover:underline">
              Docs
              <ExternalLinkIcon className="size-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BuildJourneyContentTabs({ initialSubTab = "Overview" }: { initialSubTab?: BuildJourneySubTab }) {
  const subTab = initialSubTab;

  return (
    <div className="flex flex-col">
      {subTab === "Overview" && <OverviewSubTab />}
      {subTab === "Tech Stack" && <TechStackSubTab />}
      {subTab === "Resources" && <ResourcesTab />}
      {subTab === "Interview Prep" && <InterviewPrepTab />}
      {subTab === "Discussion" && <DiscussionTab />}
      {subTab === "Reviews" && <ReviewsTab />}
    </div>
  );
}
