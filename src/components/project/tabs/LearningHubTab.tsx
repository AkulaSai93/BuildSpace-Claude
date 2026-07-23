"use client";

import { useEffect, useState } from "react";
import type { ProjectSummary } from "@/types/library";
import type { HubContent, ProjectContent } from "@/types/projectContent";
import { LearningHubSidebar } from "@/components/project/LearningHubSidebar";
import { HubMetaSidebar } from "@/components/project/HubMetaSidebar";
import { ResourcesTab } from "@/components/project/tabs/ResourcesTab";
import { hubSections } from "@/lib/learning-hub-data";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  PlayIcon,
} from "@/components/dashboard/icons";

const actorColors: Record<string, string> = {
  SHOPPER: "bg-emerald-50 text-emerald-700",
  SYSTEM: "bg-purple-50 text-purple-700",
  ADMIN: "bg-amber-50 text-amber-700",
  USER: "bg-emerald-50 text-emerald-700",
};

export function LearningHubTab({
  project,
  onContinueToWorkspace,
}: {
  project: ProjectSummary;
  onContinueToWorkspace: () => void;
}) {
  const [activeSection, setActiveSection] = useState("overview");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [fullContent, setFullContent] = useState<ProjectContent | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const content: HubContent | null = fullContent?.learningHub ?? null;

  useEffect(() => {
    let cancelled = false;
    setFullContent(null);
    setLoadError(null);
    fetch(`/api/project-content/${encodeURIComponent(project.slug)}`, { cache: "no-store" })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? `Failed to load content (${res.status})`);
        return body.content as ProjectContent;
      })
      .then((c) => {
        if (!cancelled) setFullContent(c);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Failed to load Learning Hub content");
      });
    return () => {
      cancelled = true;
    };
  }, [project.slug]);

  const requiredSections = hubSections.filter((s) => s.required);
  const requiredRemaining = requiredSections.filter((s) => !completed.has(s.id));
  const canContinue = requiredRemaining.length === 0;

  const markRead = () => {
    setCompleted((prev) => new Set(prev).add(activeSection));
    const idx = hubSections.findIndex((s) => s.id === activeSection);
    if (idx < hubSections.length - 1) {
      setActiveSection(hubSections[idx + 1].id);
    }
  };

  if (loadError) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center">
        <p className="text-sm font-semibold text-red-700">Couldn&apos;t load Learning Hub content</p>
        <p className="max-w-sm text-xs text-red-600">{loadError}</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-black/[0.08] bg-white px-6 py-24 text-sm text-ink-muted">
        Loading Learning Hub…
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <LearningHubSidebar
        activeSection={activeSection}
        completedSections={completed}
        onSelect={setActiveSection}
      />

      <div className="min-w-0 flex-1 p-6">
        <div className="relative mb-5 flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Image (Video preview).png"
            alt="Project introduction preview"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
          <span className="absolute left-3 top-3 rounded bg-black/50 px-2 py-1 text-[10px] font-semibold tracking-wide text-white">
            INTRO
          </span>
          <button
            type="button"
            aria-label="Play intro"
            className="relative flex size-11 items-center justify-center rounded-full bg-white/90 text-brand hover:bg-white"
          >
            <PlayIcon className="size-5" />
          </button>
          <div className="absolute bottom-4 flex flex-col items-center gap-0.5 text-center text-white">
            <p className="text-sm font-medium">Project Introduction</p>
            <p className="flex items-center gap-1 text-xs text-white/70">
              <ClockIcon className="size-3" />8 min · Watch before building
            </p>
          </div>
        </div>

        {activeSection === "overview" && (
          <section className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-semibold text-ink">Project Overview</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{content.overview.description}</p>
            </div>
            <div className="rounded-lg bg-[#ecfdf5] p-3 text-sm text-ink">
              <span className="font-semibold text-brand">Why this project? </span>
              {content.overview.whyThisProject}
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">What You Will Build</h3>
              <div className="flex flex-col gap-2">
                {content.overview.whatYoullBuild.map((item, i) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#f2f1ee] text-[11px] font-semibold text-ink-muted">
                      {i + 1}
                    </span>
                    <p className="text-sm text-ink">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">Project Timeline</h3>
              <div className="flex flex-col gap-2">
                {content.overview.timeline.map((t) => (
                  <div key={t.range} className="flex items-center gap-3 rounded-lg border border-black/[0.08] bg-white px-3 py-2">
                    <span className="w-16 shrink-0 rounded bg-[#f2f1ee] px-2 py-1 text-center text-xs font-semibold text-ink">{t.range}</span>
                    <span className="shrink-0 text-sm font-semibold text-ink">{t.label}</span>
                    <span className="text-sm text-ink-muted">— {t.detail}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">Success Criteria</h3>
              <div className="flex flex-col gap-1.5">
                {content.overview.successCriteria.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-ink">
                    <CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === "business-problem" && (
          <section className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-semibold text-ink">Business Problem</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{content.businessProblem.intro}</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-semibold text-ink">Industry</h3>
              <p className="text-sm text-ink-muted">{content.businessProblem.industry}</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-[#fffbeb] p-3 text-sm text-[#92400e]">
              ⚡ {content.businessProblem.stat}
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">Current Pain Points</h3>
              <div className="flex flex-col gap-3">
                {content.businessProblem.painPoints.map((p, i) => (
                  <div key={p.title} className="flex items-start gap-3">
                    <span className="w-6 shrink-0 text-sm font-semibold text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{p.title}</p>
                      <p className="text-sm text-ink-muted">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">Target Users</h3>
              <div className="grid grid-cols-2 gap-3">
                {content.businessProblem.targetUsers.map((u) => (
                  <div key={u.title} className="rounded-lg border border-black/[0.08] bg-white p-3">
                    <p className="text-sm font-semibold text-ink">{u.title}</p>
                    <p className="text-sm text-ink-muted">{u.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === "learning-objectives" && (
          <section className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-semibold text-ink">Learning Objectives</h2>
              <p className="mt-1.5 text-sm text-ink-muted">
                After completing this project you will have production-level competency across {content.learningObjectives.length} engineering disciplines.
              </p>
            </div>
            {content.learningObjectives.map((group) => (
              <div key={group.category}>
                <h3 className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink">
                  {"</>"} {group.category}
                </h3>
                <ul className="flex flex-col gap-1 pl-1">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-ink-muted">· {item}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="rounded-lg bg-[#ecfdf5] p-3 text-sm text-brand">{content.learningObjectivesClosing}</div>
          </section>
        )}

        {activeSection === "product-requirements" && (
          <section className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-ink">Product Requirements</h2>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">Core Features (MoSCoW)</h3>
              <div className="overflow-hidden rounded-lg border border-black/[0.08]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#faf9f7] text-left text-xs uppercase tracking-wide text-ink-muted">
                      <th className="px-3 py-2 font-semibold">Feature</th>
                      <th className="px-3 py-2 font-semibold">Specification</th>
                      <th className="px-3 py-2 font-semibold">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.productRequirements.core.map((row) => (
                      <tr key={row.feature} className="border-t border-black/[0.06]">
                        <td className="px-3 py-2.5 font-medium text-ink">{row.feature}</td>
                        <td className="px-3 py-2.5 text-ink-muted">{row.spec}</td>
                        <td className="px-3 py-2.5 font-semibold text-brand">{row.priority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">Optional Enhancements</h3>
              <div className="flex flex-wrap gap-2">
                {content.productRequirements.optional.map((o) => (
                  <span key={o} className="rounded-full bg-[#f2f1ee] px-3 py-1.5 text-xs font-medium text-ink/75">{o}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">Engineering Constraints</h3>
              <div className="flex flex-col gap-1.5">
                {content.productRequirements.constraints.map((c) => (
                  <div key={c} className="flex items-center gap-2 text-sm text-ink">
                    <span className="rounded bg-[#f2f1ee] px-1.5 py-0.5 text-[10px] font-semibold text-ink-muted">REQ</span>
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === "user-journey" && (
          <section className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-semibold text-ink">User Journey</h2>
              <p className="mt-1.5 text-sm text-ink-muted">
                The happy-path flow from first visit to order confirmation. Design every API endpoint to support this sequence reliably under concurrent load.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {content.userJourney.map((j, i) => (
                <div key={j.step} className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f2f1ee] text-xs font-semibold text-ink-muted">
                    {i + 1}
                  </span>
                  <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold ${actorColors[j.actor] ?? "bg-[#f2f1ee] text-ink-muted"}`}>
                    {j.actor}
                  </span>
                  <p className="text-sm text-ink">{j.step}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">Key Edge Cases</h3>
              <div className="flex flex-col gap-1.5">
                {content.edgeCases.map((c) => (
                  <p key={c} className="flex items-start gap-2 text-sm text-amber-700">⚠ {c}</p>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === "architecture" && (
          <section className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-semibold text-ink">High-Level Architecture</h2>
              <p className="mt-1.5 text-sm text-ink-muted">{content.architecture.description}</p>
            </div>
            <div className="rounded-lg border border-black/[0.08] bg-[#faf9f7] p-4 font-mono text-xs text-ink">
              <p className="mb-2 text-ink-muted"># Service Communication</p>
              {content.architecture.serviceCommunication.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(content.architecture.layers).map(([layer, items]) => (
                <div key={layer} className="rounded-lg border border-black/[0.08] bg-[#f6f6f3] p-3">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">{layer}</p>
                  {items.map((item) => (
                    <p key={item} className="text-xs text-ink">· {item}</p>
                  ))}
                </div>
              ))}
            </div>
            <div>
              <h3 className="mb-1 text-sm font-semibold text-ink">Architecture Notes</h3>
              <p className="text-sm text-ink-muted">{content.architecture.notes}</p>
            </div>
          </section>
        )}

        {activeSection === "database-design" && (
          <section className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-semibold text-ink">Database Design</h2>
              <p className="mt-1.5 text-sm text-ink-muted">
                PostgreSQL 16 with Prisma ORM. The schema is normalised to 3NF with a denormalised{" "}
                <code className="rounded bg-[#f2f1ee] px-1 py-0.5">price_snapshot</code> on order items to preserve historical accuracy.
              </p>
            </div>
            <div className="overflow-hidden rounded-lg border border-black/[0.08]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#faf9f7] text-left text-xs uppercase tracking-wide text-ink-muted">
                    <th className="px-3 py-2 font-semibold">Table</th>
                    <th className="px-3 py-2 font-semibold">Key Columns</th>
                  </tr>
                </thead>
                <tbody>
                  {content.databaseDesign.map((row) => (
                    <tr key={row.table} className="border-t border-black/[0.06]">
                      <td className="px-3 py-2.5 font-mono font-semibold text-ink">{row.table}</td>
                      <td className="px-3 py-2.5 text-ink-muted">{row.columns}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">Sample Schema (Prisma)</h3>
              <pre className="overflow-x-auto rounded-lg bg-[#1e1e1e] p-4 text-xs leading-relaxed text-emerald-300">
                <code>{content.sampleSchema}</code>
              </pre>
            </div>
          </section>
        )}

        {activeSection === "api-documentation" && (
          <section className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-ink">API Documentation</h2>
            <div className="rounded-lg border border-black/[0.08] bg-[#faf9f7] p-3 text-center text-sm text-ink-muted">
              {content.apiAuthNote}
            </div>
            <div className="flex flex-col rounded-xl border border-black/[0.08] bg-white">
              {content.apiDocumentation.map((row, i) => (
                <div
                  key={row.path}
                  className={`flex items-center gap-3 px-4 py-3 ${i !== content.apiDocumentation.length - 1 ? "border-b border-black/[0.06]" : ""}`}
                >
                  <span
                    className={`w-14 shrink-0 rounded px-2 py-1 text-center text-xs font-semibold ${
                      row.method === "GET" ? "bg-emerald-50 text-emerald-600" : "bg-sky-50 text-sky-600"
                    }`}
                  >
                    {row.method}
                  </span>
                  <span className="w-56 shrink-0 font-mono text-xs text-ink">{row.path}</span>
                  <p className="text-sm text-ink-muted">{row.description}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">Example: POST /api/checkout</h3>
              <pre className="overflow-x-auto rounded-lg bg-[#1e1e1e] p-4 text-xs leading-relaxed text-emerald-300">
                <code>{content.apiExample}</code>
              </pre>
            </div>
          </section>
        )}

        {activeSection === "folder-structure" && (
          <section className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-ink">Folder Structure</h2>
            <pre className="overflow-x-auto rounded-lg bg-[#1e1e1e] p-4 text-xs leading-relaxed text-emerald-300">
              <code>{content.folderStructure.join("\n")}</code>
            </pre>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">Naming Conventions</h3>
              <div className="flex flex-col gap-2">
                {content.namingConventions.map((n) => (
                  <div key={n.label} className="flex items-center gap-3 text-sm">
                    <span className="w-28 shrink-0 font-semibold text-ink">{n.label}</span>
                    <span className="rounded bg-[#f2f1ee] px-2 py-1 font-mono text-xs text-ink-muted">{n.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === "resources" && (
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-ink">Resources</h2>
            <p className="text-sm text-ink-muted">All project assets available for download. Use these to deeply understand the system before building.</p>
            <ResourcesTab resourceFiles={fullContent!.courseContent.resourceFiles} />
          </section>
        )}

        {activeSection === "faqs" && (
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-ink">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-3">
              {content.faqs.map((faq) => {
                const isOpen = openFaq === faq.question;
                return (
                  <div key={faq.question} className="overflow-hidden rounded-xl border border-black/[0.08] bg-white">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : faq.question)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-ink"
                    >
                      {faq.question}
                      <ChevronDownIcon className={`size-4 shrink-0 text-ink-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <p className="border-t border-black/[0.06] px-4 py-3 text-sm text-ink-muted">{faq.answer}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-black/[0.08] pt-5">
          <p className="text-xs text-ink-muted">Read through this section before continuing.</p>
          <button
            type="button"
            onClick={markRead}
            className="flex items-center gap-1.5 rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
          >
            Mark as Read
            <ArrowRightIcon className="size-3.5" />
          </button>
        </div>

        <div
          className={`mt-6 flex items-center justify-between rounded-xl p-4 ${
            canContinue ? "bg-[#ecfdf5]" : "border border-black/[0.08] bg-white"
          }`}
        >
          <div>
            <p className="text-sm font-semibold text-ink">
              {canContinue ? "Ready to Start Building?" : "Complete all required sections to continue"}
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {canContinue
                ? "You have completed the Learning Hub and understood the project. Now build it."
                : `${requiredRemaining.map((s) => s.label).join(" · ")} remaining`}
            </p>
          </div>
          <button
            type="button"
            disabled={!canContinue}
            onClick={onContinueToWorkspace}
            className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-black/20"
          >
            Continue to Workspace
            <ArrowRightIcon className="size-3.5" />
          </button>
        </div>
      </div>

      <HubMetaSidebar content={content} activeSection={activeSection} completedSections={completed} />
    </div>
  );
}
