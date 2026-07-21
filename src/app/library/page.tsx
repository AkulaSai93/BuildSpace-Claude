"use client";

import { useMemo, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FilterSidebar } from "@/components/library/FilterSidebar";
import { ProjectGridCard } from "@/components/library/ProjectGridCard";
import { ProjectListRow } from "@/components/library/ProjectListRow";
import {
  ChevronDownIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
  SearchIcon,
} from "@/components/dashboard/icons";
import { libraryCategories, projects } from "@/lib/library-data";

type ViewMode = "grid" | "list";

export default function LibraryPage() {
  const [activeCategory, setActiveCategory] = useState("All Projects");
  const [view, setView] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = activeCategory === "All Projects" || p.category === activeCategory;
      const matchesQuery =
        query.trim() === "" ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <DashboardHeader />

      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-7 px-20 pb-16 pt-10">
        <div className="flex w-[470px] flex-col items-start gap-[5px]">
          <h1 className="text-2xl font-semibold text-ink">Project Library</h1>
          <p className="text-sm text-ink-muted">
            You&apos;re 34% through the e-commerce build. Keep the momentum going.
          </p>
        </div>

        <div className="flex w-full flex-col gap-6 rounded-xl border border-black/[0.08] bg-white p-4">
          <div className="flex h-10 w-full items-center gap-2 rounded-full bg-[#f2f1ee]/70 px-4">
            <SearchIcon className="size-4 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search by project name, technology, framework, or instructor..."
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {libraryCategories.map((cat) => {
              const active = cat.label === activeCategory;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setActiveCategory(cat.label)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    active ? "bg-brand text-white" : "bg-[#f2f1ee] text-ink hover:bg-black/10"
                  }`}
                >
                  {cat.label}
                  <span className={active ? "text-white/80" : "text-ink-muted"}>{cat.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex w-full gap-6">
          <FilterSidebar />

          <div className="flex min-w-0 flex-1 flex-col gap-[18px]">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-1.5 text-sm font-medium text-ink"
                >
                  <FilterIcon className="size-3.5" />
                  Filters
                </button>
                <span className="text-sm text-ink-muted">{filtered.length} projects</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-sm text-ink"
                >
                  Most Popular
                  <ChevronDownIcon className="size-4" />
                </button>
                <div className="flex overflow-hidden rounded-lg border border-black/10">
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    className={`flex items-center justify-center p-1.5 ${view === "grid" ? "bg-brand text-white" : "text-ink-muted"}`}
                    aria-label="Grid view"
                  >
                    <GridIcon className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    className={`flex items-center justify-center p-1.5 ${view === "list" ? "bg-brand text-white" : "text-ink-muted"}`}
                    aria-label="List view"
                  >
                    <ListIcon className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {view === "grid" ? (
              <div className="grid grid-cols-3 gap-6">
                {filtered.map((project) => (
                  <ProjectGridCard key={project.slug} project={project} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col rounded-xl border border-black/[0.08] bg-white px-5">
                {filtered.map((project) => (
                  <ProjectListRow key={project.slug} project={project} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
