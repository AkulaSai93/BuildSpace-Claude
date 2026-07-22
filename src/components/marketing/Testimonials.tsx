"use client";

import { useRef } from "react";
import { ArrowRightIcon, StarIcon } from "@/components/dashboard/icons";
import { Reveal } from "@/components/marketing/Reveal";

const testimonials = [
  {
    quote: "BuildSpace changed the way I learn and build. The AI code review is just like having a senior dev by my side.",
    name: "Rohit Verma",
    title: "Full Stack Developer",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    quote: "I built 6 real-world projects in 2 months and landed my dream internship. Highly recommended!",
    name: "Ananya Sharma",
    title: "SDE Intern @ Microsoft",
    color: "bg-sky-100 text-sky-700",
  },
  {
    quote: "The platform is so smooth and intuitive. Everything I need to become a better engineer.",
    name: "Arjun Mehta",
    title: "CS Graduate",
    color: "bg-purple-100 text-purple-700",
  },
];

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => trackRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <Reveal direction="up">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">Loved by builders</p>
            <h2 className="mt-1 font-serif text-2xl font-medium text-ink sm:text-3xl">
              See what our
              <br />
              community says
            </h2>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Previous testimonials"
              className="flex size-9 items-center justify-center rounded-full border border-black/[0.1] text-ink hover:bg-black/[0.02]"
            >
              <ArrowRightIcon className="size-3.5 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Next testimonials"
              className="flex size-9 items-center justify-center rounded-full border border-black/[0.1] text-ink hover:bg-black/[0.02]"
            >
              <ArrowRightIcon className="size-3.5" />
            </button>
          </div>
        </div>
      </Reveal>

      <div ref={trackRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} direction="up" delay={i * 100} className="shrink-0 snap-start">
            <div className="w-[320px] rounded-xl border border-black/[0.08] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-black/[0.16]">
              <p className="text-sm leading-relaxed text-ink">&quot;{t.quote}&quot;</p>
              <div className="mt-4 flex items-center gap-3">
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${t.color}`}>
                  {t.name[0]}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-ink-muted">{t.title}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i2) => (
                  <StarIcon key={i2} className="size-3.5 text-amber-500" />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
