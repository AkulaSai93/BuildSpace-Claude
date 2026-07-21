"use client";

import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BuildJourneySidebar } from "@/components/project/BuildJourneySidebar";
import { CourseMetaSidebar } from "@/components/project/CourseMetaSidebar";
import { OverviewTab } from "@/components/project/tabs/OverviewTab";
import { TechStackTab } from "@/components/project/tabs/TechStackTab";
import { ResourcesTab } from "@/components/project/tabs/ResourcesTab";
import { InterviewPrepTab } from "@/components/project/tabs/InterviewPrepTab";
import { DiscussionTab } from "@/components/project/tabs/DiscussionTab";
import { ReviewsTab } from "@/components/project/tabs/ReviewsTab";
import { getProjectBySlug } from "@/lib/library-data";
import {
  BackIcon,
  BookmarkIcon,
  ClockIcon,
  ForwardIcon,
  PlayIcon,
  ShareIcon,
  StarIcon,
  VideoIcon,
} from "@/components/dashboard/icons";

const tabs = ["Overview", "Tech Stack", "Resources", "Interview Prep", "Discussion", "Reviews"] as const;
type Tab = (typeof tabs)[number];

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const project = getProjectBySlug(params.slug);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <DashboardHeader />

      <div className="flex w-full">
        <BuildJourneySidebar />

        <main className="min-w-0 flex-1 px-8 py-5">
          <div className="mb-4 flex items-center gap-2 text-sm text-ink-muted">
            <Link href="/library" className="hover:text-ink">
              Library
            </Link>
            <span>/</span>
            <span>{project.category}</span>
            <span>/</span>
            <span className="truncate text-ink">{project.title}</span>
          </div>

          <div className="flex items-start justify-between gap-6">
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

          <div className="mt-6 overflow-hidden rounded-xl border border-black/[0.08] bg-black">
            <div className="relative flex aspect-video w-full items-center justify-center bg-gradient-to-br from-stone-700 to-stone-900">
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

          <div className="mt-6 flex items-center gap-1 border-b border-black/[0.08]">
            {tabs.map((tab) => (
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

          <div className="py-6">
            {activeTab === "Overview" && <OverviewTab />}
            {activeTab === "Tech Stack" && <TechStackTab />}
            {activeTab === "Resources" && <ResourcesTab />}
            {activeTab === "Interview Prep" && <InterviewPrepTab />}
            {activeTab === "Discussion" && <DiscussionTab />}
            {activeTab === "Reviews" && <ReviewsTab />}
          </div>
        </main>

        <CourseMetaSidebar project={project} />
      </div>
    </div>
  );
}
