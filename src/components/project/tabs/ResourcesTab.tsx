"use client";

import { useMemo, useState } from "react";
import { resourceCategories, type ResourceCategory } from "@/lib/course-content";
import type { CourseContentData } from "@/types/projectContent";
import { DownloadIcon, EyeIcon } from "@/components/dashboard/icons";

const typeColors: Record<string, string> = {
  PDF: "bg-red-50 text-red-600",
  PNG: "bg-purple-50 text-purple-600",
  SQL: "bg-blue-50 text-blue-600",
  YAML: "bg-orange-50 text-orange-600",
  JSON: "bg-amber-50 text-amber-600",
  Figma: "bg-violet-50 text-violet-600",
  ZIP: "bg-stone-100 text-stone-600",
  ENV: "bg-emerald-50 text-emerald-600",
};

export function ResourcesTab({ resourceFiles }: { resourceFiles: CourseContentData["resourceFiles"] }) {
  const [category, setCategory] = useState<ResourceCategory>("All");

  const filtered = useMemo(
    () =>
      category === "All"
        ? resourceFiles
        : resourceFiles.filter((file) => file.category === category),
    [category],
  );

  const totalSizeLabel = "48.2 MB total";

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-ink">Downloadable Resources</h2>

      <div className="flex flex-wrap items-center gap-2">
        {resourceCategories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              category === c ? "bg-brand text-white" : "bg-[#f2f1ee] text-ink hover:bg-black/10"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-col rounded-xl border border-black/[0.08] bg-white">
        {filtered.map((file, i) => (
          <div
            key={file.name}
            className={`group flex items-center gap-4 px-5 py-4 ${
              i !== filtered.length - 1 ? "border-b border-black/[0.06]" : ""
            }`}
          >
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                typeColors[file.type] ?? "bg-stone-100 text-stone-600"
              }`}
            >
              {file.type}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{file.name}</p>
              <p className="text-xs text-ink-muted">
                {file.size} · {file.downloads}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-ink hover:bg-black/[0.02]"
              >
                <EyeIcon className="size-3.5" />
                Preview
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand/90"
              >
                <DownloadIcon className="size-3.5" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-black/[0.08] bg-[#f2fbf7] px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-ink">Download Complete Package</p>
          <p className="text-xs text-ink-muted">All resources · {totalSizeLabel}</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90"
        >
          <DownloadIcon className="size-3.5" />
          Download All
        </button>
      </div>
    </div>
  );
}
