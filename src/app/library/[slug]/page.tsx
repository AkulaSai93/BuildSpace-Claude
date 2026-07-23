"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BuildJourneySidebar } from "@/components/project/BuildJourneySidebar";
import { CourseMetaSidebar } from "@/components/project/CourseMetaSidebar";
import { LearningHubTab } from "@/components/project/tabs/LearningHubTab";
import { WorkspaceTab } from "@/components/project/tabs/WorkspaceTab";
import { ProSolutionTab } from "@/components/project/tabs/ProSolutionTab";
import { BuildJourneyContentTabs, type BuildJourneySubTab } from "@/components/project/tabs/BuildJourneyContentTabs";
import {
  BackIcon,
  BookmarkIcon,
  ClockIcon,
  ForwardIcon,
  LockIcon,
  PlayIcon,
  ShareIcon,
  StarIcon,
  VideoIcon,
} from "@/components/dashboard/icons";
import type { ProjectSummary } from "@/types/library";

// Interview Prep, Discussion, and Reviews are shared, not phase-exclusive —
// they show the same real content (sourced from the Phase 2 data/components)
// regardless of which phase chip you're on or whether the project has been
// submitted yet, so clicking them never locks or switches phase.
const sharedTabs = ["Interview Prep", "Discussion", "Reviews"] as const;

const baseTabs = ["Learning Hub", "Workspace", "Interview Prep", "Discussion", "Reviews", "Pro Solution"] as const;
const phase2Tabs = ["Overview", "Tech Stack", "Resources", "Interview Prep", "Discussion", "Reviews", "Pro Solution"] as const;
type Tab = (typeof baseTabs)[number] | (typeof phase2Tabs)[number];

type Phase = "phase1" | "phase2";

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const [project, setProject] = useState<ProjectSummary | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Learning Hub");
  const [workspaceUnlocked, setWorkspaceUnlocked] = useState(false);
  const [projectSubmitted, setProjectSubmitted] = useState(false);
  const [activePhase, setActivePhase] = useState<Phase>("phase1");

  useEffect(() => {
    let cancelled = false;
    setProject(null);
    setLoadError(null);
    fetch(`/api/projects/${encodeURIComponent(params.slug)}`, { cache: "no-store" })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? `Failed to load project (${res.status})`);
        return body.project as ProjectSummary;
      })
      .then((p) => {
        if (!cancelled) setProject(p);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Failed to load project");
      });
    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  const goToPhase1 = () => {
    setActivePhase("phase1");
    setActiveTab("Learning Hub");
  };

  const goToPhase2 = () => {
    if (!projectSubmitted) return;
    setActivePhase("phase2");
    setActiveTab("Overview");
  };

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-white px-6 text-center">
        <p className="text-sm font-semibold text-red-700">Couldn&apos;t load this project</p>
        <p className="max-w-sm text-xs text-red-600">{loadError}</p>
        <Link href="/library" className="mt-2 text-sm font-medium text-brand hover:underline">
          Back to Library
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-ink-muted">
        Loading project…
      </div>
    );
  }

  // Interview Prep, Discussion, and Reviews are shared content — like the
  // Learning Hub and Workspace tabs, they render full-width with no video
  // strip and no flanking course sidebars, rather than the narrower
  // sidebar-flanked layout used for Overview/Tech Stack/Resources.
  const isFullWidthTab =
    activeTab === "Learning Hub" ||
    activeTab === "Workspace" ||
    sharedTabs.includes(activeTab as (typeof sharedTabs)[number]);
  const showsVideoLayout = !isFullWidthTab;

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />

      {/* Header block (breadcrumb, title, badges, tags, phase chips) is always
          full-width and lives outside the sidebar flex row below, so it never
          shifts or gets squeezed when the flanking sidebars appear for
          non-Learning-Hub/Workspace tabs (e.g. switching to Phase 2). */}
      <div className="px-4 pt-5 sm:px-8">
        <div className="mb-4 flex items-center gap-2 text-sm text-ink-muted">
          <Link href="/library" className="hover:text-ink">
            Library
          </Link>
          <span>/</span>
          <span>{project.category}</span>
          <span>/</span>
          <span className="truncate text-ink">{project.title}</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
          <div>
            <h1 className="text-2xl font-semibold text-ink">{project.title}</h1>
            <p className="mt-2 max-w-[724px] text-sm leading-relaxed text-ink-muted">
              {project.shortDescription}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              aria-label="Save"
              className="flex size-[34px] items-center justify-center rounded-xl border border-black/10 text-ink-muted hover:bg-black/[0.02]"
            >
              <BookmarkIcon className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Share"
              className="flex size-[34px] items-center justify-center rounded-xl border border-black/10 text-ink-muted hover:bg-black/[0.02]"
            >
              <ShareIcon className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
          <span className="rounded-[14px] bg-[#fffbeb] px-2.5 py-1 text-xs font-medium text-[#bb4d00]">
            {project.level}
          </span>
          <span className="flex items-center gap-1 text-ink-muted">
            <StarIcon className="size-3.5 text-amber-500" />
            <span className="font-semibold text-ink">{project.rating}</span> ({project.reviewCount.toLocaleString()})
          </span>
          <span className="flex items-center gap-1.5 text-ink-muted">{project.learners} students</span>
          <span className="flex items-center gap-1.5 text-ink-muted">
            <ClockIcon className="size-3.5" />
            {project.duration}
          </span>
          <span className="flex items-center gap-1.5 text-ink-muted">
            <VideoIcon className="size-3.5" />
            {project.videoCount} videos
          </span>
          <span className="text-ink-muted">Updated Dec 2024</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-[14px] bg-[#f2f1ee] px-2.5 py-1 text-xs font-medium text-ink/70">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2">
          <button
            type="button"
            onClick={goToPhase1}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ${
              activePhase === "phase1" ? "bg-brand text-white" : "bg-[#f2f1ee] text-ink-muted hover:text-ink"
            }`}
          >
            Phase 1
          </button>
          <button
            type="button"
            onClick={goToPhase2}
            disabled={!projectSubmitted}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ${
              activePhase === "phase2"
                ? "bg-brand text-white"
                : projectSubmitted
                  ? "bg-[#f2f1ee] text-ink-muted hover:text-ink"
                  : "cursor-not-allowed bg-[#f2f1ee] text-ink-muted/50"
            }`}
          >
            {!projectSubmitted && <LockIcon className="size-3.5" />}
            Phase 2
          </button>
          {!projectSubmitted && (
            <span className="text-xs text-ink-muted">Complete Phase 1 and submit your project to unlock Phase 2</span>
          )}
        </div>
      </div>

      <div className="flex w-full">
        {!isFullWidthTab && <BuildJourneySidebar />}

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-8">
          {showsVideoLayout && (
            <>
              <div className="mt-6 overflow-hidden rounded-xl border border-black/[0.08] bg-black">
                <div className="relative flex aspect-video w-full items-center justify-center bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/source/Image (Video preview).png"
                    alt="Video preview"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute left-4 top-4 flex items-center gap-2 text-xs text-white/80">
                    <span className="rounded bg-black/40 px-2 py-1 font-semibold tracking-wide">LESSON 6</span>
                    <span className="rounded bg-black/40 px-2.5 py-1">Database Schema Design · 20:45</span>
                  </div>
                  <button
                    type="button"
                    aria-label="Play"
                    className="flex size-16 items-center justify-center rounded-full bg-white/90 text-brand hover:bg-white"
                  >
                    <PlayIcon className="size-7" />
                  </button>
                </div>
                <div className="flex items-center justify-between px-4 py-3 text-xs text-white/70">
                  <span>4:46</span>
                  <span>20:45</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm">
                <button type="button" className="flex items-center gap-1.5 text-ink-muted hover:text-ink">
                  <BackIcon className="size-4" />
                  Previous
                </button>
                <span className="text-ink-muted">Lesson 6 of 41</span>
                <button type="button" className="flex items-center gap-1.5 text-ink-muted hover:text-ink">
                  Next
                  <ForwardIcon className="size-4" />
                </button>
              </div>
            </>
          )}

          <div className="mt-6 flex flex-nowrap items-center gap-1 overflow-x-auto border-b border-black/[0.08] [scrollbar-width:none]">
            {(activePhase === "phase2" ? phase2Tabs : baseTabs).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-brand text-brand"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={activeTab === "Learning Hub" || activeTab === "Workspace" ? "-mx-8 -mb-5" : "py-6"}>
            {activeTab === "Learning Hub" && (
              <LearningHubTab
                project={project}
                onContinueToWorkspace={() => {
                  setWorkspaceUnlocked(true);
                  setActiveTab("Workspace");
                }}
              />
            )}
            {activeTab === "Workspace" && (
              <WorkspaceTab
                unlocked={workspaceUnlocked || projectSubmitted}
                slug={project.slug}
                resumeAsSubmitted={projectSubmitted}
                onProjectSubmitted={() => {
                  setProjectSubmitted(true);
                  setActivePhase("phase2");
                  setActiveTab("Overview");
                }}
                onViewPhase2Videos={() => {
                  setActivePhase("phase2");
                  setActiveTab("Overview");
                }}
              />
            )}
            {((projectSubmitted && (activeTab === "Overview" || activeTab === "Tech Stack" || activeTab === "Resources")) ||
              sharedTabs.includes(activeTab as (typeof sharedTabs)[number])) && (
              <BuildJourneyContentTabs initialSubTab={activeTab as BuildJourneySubTab} slug={project.slug} />
            )}
            {activeTab === "Pro Solution" && <ProSolutionTab unlocked={projectSubmitted} slug={project.slug} />}
          </div>
        </main>

        {!isFullWidthTab && <CourseMetaSidebar project={project} />}
      </div>
    </div>
  );
}
