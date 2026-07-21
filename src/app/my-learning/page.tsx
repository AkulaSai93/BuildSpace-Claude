"use client";

import { useMemo, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { MyLearningRow } from "@/components/my-learning/MyLearningRow";
import { LearningSidebar } from "@/components/my-learning/LearningSidebar";
import { myLearningStats } from "@/lib/my-learning-data";
import { projects } from "@/lib/library-data";

type LearningTab = "in-progress" | "completed" | "bookmarked";

const tabConfig: { id: LearningTab; label: string }[] = [
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "bookmarked", label: "Bookmarked" },
];

export default function MyLearningPage() {
  const [tab, setTab] = useState<LearningTab>("in-progress");

  const counts = useMemo(
    () => ({
      "in-progress": projects.filter((p) => p.status === "in-progress").length,
      completed: projects.filter((p) => p.status === "completed").length,
      bookmarked: projects.filter((p) => p.status === "bookmarked").length,
    }),
    [],
  );

  const filtered = projects.filter((p) => p.status === tab);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <DashboardHeader />

      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-7 px-20 pb-16 pt-10">
        <div className="flex w-[470px] flex-col items-start gap-[5px]">
          <h1 className="text-2xl font-semibold text-ink">My Learning</h1>
          <p className="text-sm text-ink-muted">
            You&apos;re 34% through the e-commerce build. Keep the momentum going.
          </p>
        </div>

        <div className="flex items-center gap-6">
          {myLearningStats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        <div className="flex w-full gap-6">
          <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-black/[0.08] bg-white">
            <div className="flex border-b border-black/[0.08]">
              {tabConfig.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium ${
                    tab === id ? "border-b-2 border-brand text-brand" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {label}
                  <span className={`flex size-[19px] items-center justify-center rounded-full text-xs ${
                    tab === id ? "bg-brand/10 text-brand" : "bg-[#f2f1ee] text-ink-muted"
                  }`}>
                    {counts[id]}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-col">
              {filtered.length === 0 ? (
                <p className="p-8 text-center text-sm text-ink-muted">No projects here yet.</p>
              ) : (
                filtered.map((project) => <MyLearningRow key={project.slug} project={project} />)
              )}
            </div>
          </div>

          <LearningSidebar />
        </div>
      </main>
    </div>
  );
}
