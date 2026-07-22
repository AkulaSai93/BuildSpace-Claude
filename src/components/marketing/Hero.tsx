"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  ArrowRightIcon,
  BranchIcon,
  CheckCircleIcon,
  LogoIcon,
  PlayIcon,
  SparklesIcon,
  ZapIcon,
} from "@/components/dashboard/icons";
import { Reveal } from "@/components/marketing/Reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const aiReviewRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const assistantRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cards = [dashboardRef.current, aiReviewRef.current, progressRef.current, codeRef.current, assistantRef.current];

    if (prefersReduced) {
      // Skip the assembly entirely: show the finished composition instantly, no pin.
      gsap.set(cards, { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, clearProps: "willChange" });
      gsap.set(textRef.current, { scale: 1, opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 768px) and (max-width: 1023px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isTablet, isMobile } = context.conditions as { isTablet: boolean; isMobile: boolean };

          const distance = isMobile ? 0.5 : isTablet ? 0.72 : 1;
          const endDistance = isMobile ? "+=160%" : isTablet ? "+=220%" : "+=260%";

          let completed = false;

          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: endDistance,
              scrub: 0.6,
              pin: true,
              anticipatePin: 1,
              onUpdate: (self) => {
                // Once fully assembled, lock it — scrolling back up must never
                // re-scatter the composition. Only a full refresh replays it.
                if (completed && self.progress < 1) {
                  tl.progress(1);
                }
              },
              onLeave: () => {
                completed = true;
                tl.progress(1);
              },
              onEnterBack: () => {
                if (completed) tl.progress(1);
              },
            },
          });

          // The text block gently compresses to make room as the cards arrive.
          tl.to(textRef.current, { scale: 0.94, opacity: 0.88, y: -10, duration: 0.4 }, 0);

          tl.fromTo(
            dashboardRef.current,
            { opacity: 0, scale: 0.7, y: 140 * distance, rotate: -6 },
            { opacity: 1, scale: 1, y: 0, rotate: 0, duration: 0.5 },
            0.05
          )
            .fromTo(
              aiReviewRef.current,
              { opacity: 0, x: -150 * distance, y: 60 * distance, rotate: 8 },
              { opacity: 1, x: 0, y: 0, rotate: 0, duration: 0.4 },
              0.35
            )
            .fromTo(
              progressRef.current,
              { opacity: 0, x: 150 * distance, y: 60 * distance, rotate: -8 },
              { opacity: 1, x: 0, y: 0, rotate: 0, duration: 0.4 },
              0.5
            )
            .fromTo(
              codeRef.current,
              { opacity: 0, y: -110 * distance, scale: 0.8 },
              { opacity: 1, y: 0, scale: 1, duration: 0.4 },
              0.65
            )
            .fromTo(
              assistantRef.current,
              { opacity: 0, scale: 0.6, y: 90 * distance },
              { opacity: 1, scale: 1, y: 0, duration: 0.4 },
              0.8
            )
            .to(stageRef.current, { scale: 1.02, duration: 0.05 }, 0.95)
            .to(stageRef.current, { scale: 1, duration: 0.08, ease: "back.out(2)" }, 1.0);
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="mesh-gradient relative h-screen w-full overflow-hidden">
      <div className="relative mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-6 pb-6 pt-20 text-center">
        <div ref={textRef}>
          <Reveal direction="up" duration={600}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-brand shadow-[0_1px_2px_rgba(0,0,0,0.03)] backdrop-blur">
              <SparklesIcon className="size-3.5" />
              AI-Powered Learning Platform
            </span>
          </Reveal>

          <Reveal direction="up" delay={90} duration={700}>
            <h1 className="mt-6 font-serif text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-6xl">
              The AI-powered platform
              <br />
              to learn, build and ship
            </h1>
          </Reveal>

          <Reveal direction="up" delay={170} duration={700}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
              Hands-on projects. AI code review. Real engineering practice.
              <br />
              Go from learning to shipping production-ready software.
            </p>
          </Reveal>

          <Reveal direction="up" delay={260} duration={700}>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                <Link
                  href="/dashboard"
                  className="group flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
                >
                  Start Building for Free
                  <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                <Link
                  href="#projects"
                  className="flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/80 px-6 py-3.5 text-sm font-semibold text-ink backdrop-blur transition-colors hover:bg-white"
                >
                  <PlayIcon className="size-3.5" />
                  Watch Demo
                </Link>
              </motion.div>
            </div>
          </Reveal>
        </div>

        {/* Assembling BuildSpace visual — converges as the section stays pinned */}
        <div
          ref={stageRef}
          role="img"
          aria-label="BuildSpace product preview: dashboard, AI code review, build progress, and AI assistant coming together"
          className="relative mt-10 h-[220px] w-full max-w-[640px] sm:h-[260px]"
        >
          <div
            ref={dashboardRef}
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 w-[64%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_20px_50px_-24px_rgba(0,0,0,0.18)]"
          >
            <div className="flex items-center gap-1.5 border-b border-black/[0.06] bg-[#faf9f7]/60 px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-red-300" />
              <span className="size-2.5 rounded-full bg-amber-300" />
              <span className="size-2.5 rounded-full bg-emerald-300" />
            </div>
            <div className="p-4 text-left">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded bg-brand text-white">
                  <LogoIcon className="size-3" />
                </span>
                <span className="text-xs font-semibold text-ink">BuildSpace Dashboard</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["Active Builds", "Time Invested", "Tasks Done"].map((label, i) => (
                  <div key={label} className="rounded-lg border border-black/[0.06] bg-[#faf9f7] p-2 text-center">
                    <p className="text-sm font-bold text-ink">{[3, "47h", 28][i]}</p>
                    <p className="text-[9px] leading-tight text-ink-muted">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            ref={aiReviewRef}
            aria-hidden="true"
            className="absolute -bottom-3 left-0 hidden items-center gap-2 rounded-2xl border border-black/[0.08] bg-white px-3.5 py-2.5 shadow-[0_16px_36px_-20px_rgba(0,0,0,0.16)] sm:flex"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ecfdf5] text-brand">
              <CheckCircleIcon className="size-4" />
            </span>
            <div className="text-left">
              <p className="text-[11px] font-semibold leading-tight text-ink">AI Review Passed</p>
              <p className="text-[10px] text-ink-muted">Score: 94/100</p>
            </div>
          </div>

          <div
            ref={progressRef}
            aria-hidden="true"
            className="absolute -bottom-3 right-0 hidden w-[38%] rounded-2xl border border-black/[0.08] bg-white px-3.5 py-3 shadow-[0_16px_36px_-20px_rgba(0,0,0,0.16)] sm:block"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-ink">Build Progress</p>
              <span className="text-[10px] font-semibold text-brand">82%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#f2f1ee]">
              <div className="h-full w-[82%] rounded-full bg-brand" />
            </div>
          </div>

          <div
            ref={codeRef}
            aria-hidden="true"
            className="absolute -top-3 left-2 hidden items-center gap-2 rounded-2xl border border-black/[0.08] bg-white px-3.5 py-2.5 shadow-[0_16px_36px_-20px_rgba(0,0,0,0.16)] md:flex"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f2f1ee] text-ink">
              <BranchIcon className="size-4" />
            </span>
            <div className="text-left">
              <p className="text-[11px] font-semibold leading-tight text-ink">12 commits pushed</p>
              <p className="text-[10px] text-ink-muted">feature/ai-review · 2h ago</p>
            </div>
          </div>

          <div
            ref={assistantRef}
            aria-hidden="true"
            className="absolute -top-3 right-2 hidden items-center gap-2 rounded-2xl bg-brand px-3.5 py-2.5 text-white shadow-[0_16px_36px_-20px_rgba(6,95,70,0.35)] md:flex"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/15">
              <ZapIcon className="size-3.5" />
            </span>
            <p className="text-[11px] font-semibold leading-tight">
              Great work —<br />
              ready to ship?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
