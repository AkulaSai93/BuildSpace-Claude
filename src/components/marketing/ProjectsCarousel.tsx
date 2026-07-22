"use client";

import { useRef } from "react";
import Link from "next/link";
import { projects } from "@/lib/library-data";
import { ArrowRightIcon, ClockIcon, VideoIcon } from "@/components/dashboard/icons";

const featuredSlugs = ["ecommerce-platform", "realtime-chat", "ai-resume-builder", "netflix-clone"];
const featured = featuredSlugs
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

const levelStyles: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-600",
  Intermediate: "bg-[#fffbeb] text-[#bb4d00]",
  Advanced: "bg-red-50 text-red-600",
};

export function ProjectsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 py-14">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">Build real projects</p>
          <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">
            Build in-demand projects
            <br />
            and create your portfolio
          </h2>
        </div>
        <Link
          href="/dashboard"
          className="hidden shrink-0 items-center gap-1.5 rounded-full border border-black/[0.1] bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-black/[0.02] sm:flex"
        >
          View all projects
          <ArrowRightIcon className="size-3.5" />
        </Link>
      </div>

      <div ref={trackRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
        {featured.map((p) => (
          <Link
            key={p.slug}
            href="/dashboard"
            className="group w-[300px] shrink-0 snap-start overflow-hidden rounded-xl border border-black/[0.08] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-black/[0.16]"
          >
            <div className="h-[150px] w-full overflow-hidden bg-stone-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={encodeURI(p.thumbnail)}
                alt={p.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold leading-snug text-ink">{p.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted line-clamp-2">{p.shortDescription}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.slice(0, 2).map((t) => (
                  <span key={t} className="rounded-[14px] bg-[#f2f1ee] px-2 py-0.5 text-[11px] font-medium text-ink/65">
                    {t}
                  </span>
                ))}
                {p.tags.length > 2 && (
                  <span className="rounded-[14px] bg-[#f2f1ee] px-2 py-0.5 text-[11px] font-medium text-ink/65">
                    +{p.tags.length - 2}
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-ink-muted">
                <span className="flex items-center gap-1">
                  <VideoIcon className="size-3" />
                  {p.videoCount} lessons
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${levelStyles[p.level]}`}>
                  {p.level}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Previous projects"
          className="flex size-9 items-center justify-center rounded-full border border-black/[0.1] text-ink hover:bg-black/[0.02]"
        >
          <ArrowRightIcon className="size-3.5 rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Next projects"
          className="flex size-9 items-center justify-center rounded-full border border-black/[0.1] text-ink hover:bg-black/[0.02]"
        >
          <ArrowRightIcon className="size-3.5" />
        </button>
      </div>
    </section>
  );
}
