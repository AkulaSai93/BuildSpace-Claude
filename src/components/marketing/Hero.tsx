import Link from "next/link";
import { ArrowRightIcon, CheckCircleIcon, LogoIcon, SparklesIcon, StarIcon } from "@/components/dashboard/icons";

const avatarColors = [
  "bg-emerald-200 text-emerald-800",
  "bg-sky-200 text-sky-800",
  "bg-purple-200 text-purple-800",
  "bg-amber-200 text-amber-800",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-12rem] size-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(6,95,70,0.12),transparent)]" />
        <div className="absolute -right-24 top-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgba(6,95,70,0.08),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-20 pt-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-10">
          <div>
            <span
              className="inline-flex animate-fade-in-up items-center gap-1.5 rounded-full border border-brand/20 bg-white px-3 py-1.5 text-xs font-semibold text-brand"
              style={{ animationDelay: "0ms" }}
            >
              <SparklesIcon className="size-3.5" />
              AI-Powered Learning Platform
            </span>

            <h1
              className="mt-5 animate-fade-in-up text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-[3.25rem]"
              style={{ animationDelay: "80ms" }}
            >
              The AI-powered platform to{" "}
              <span className="bg-gradient-to-r from-brand to-emerald-500 bg-clip-text text-transparent">learn,</span>
              <br />
              <span className="bg-gradient-to-r from-brand to-emerald-500 bg-clip-text text-transparent">build</span>{" "}
              and{" "}
              <span className="bg-gradient-to-r from-brand to-emerald-500 bg-clip-text text-transparent">ship</span>{" "}
              real
              <br />
              software.
            </h1>

            <p
              className="mt-5 max-w-md animate-fade-in-up text-base leading-relaxed text-ink-muted"
              style={{ animationDelay: "160ms" }}
            >
              BuildSpace helps students and early engineers go from learning to building production-ready
              projects with AI by their side.
            </p>

            <div className="mt-8 flex animate-fade-in-up flex-wrap items-center gap-3" style={{ animationDelay: "240ms" }}>
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand/90"
              >
                Start Building for Free
                <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#projects"
                className="rounded-full border border-black/[0.1] bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-black/[0.16] hover:bg-black/[0.02]"
              >
                Explore Projects
              </Link>
            </div>

            <div
              className="mt-6 flex animate-fade-in-up flex-wrap items-center gap-4 text-xs text-ink-muted"
              style={{ animationDelay: "300ms" }}
            >
              {["No credit card required", "Free forever plan", "Cancel anytime"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircleIcon className="size-3.5 text-brand" />
                  {t}
                </span>
              ))}
            </div>

            <div
              className="mt-7 flex animate-fade-in-up items-center gap-3 border-t border-black/[0.06] pt-6"
              style={{ animationDelay: "360ms" }}
            >
              <div className="flex -space-x-2.5">
                {avatarColors.map((c, i) => (
                  <span
                    key={i}
                    className={`flex size-8 items-center justify-center rounded-full border-2 border-[#faf9f7] text-[11px] font-semibold ${c}`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                ))}
              </div>
              <div className="text-xs text-ink-muted">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="size-3 text-amber-500" />
                  ))}
                  <span className="ml-1 font-semibold text-ink">4.9/5</span>
                </div>
                Loved by 10,000+ builders
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-up" style={{ animationDelay: "160ms" }}>
            <div className="rounded-2xl border border-black/[0.08] bg-gradient-to-br from-[#f6fdf9] to-[#faf9f7] p-3">
              <div className="overflow-hidden rounded-xl border border-black/[0.06] bg-white">
                <div className="flex items-center gap-1.5 border-b border-black/[0.06] bg-[#faf9f7]/60 px-4 py-2.5">
                  <span className="size-2.5 rounded-full bg-red-300" />
                  <span className="size-2.5 rounded-full bg-amber-300" />
                  <span className="size-2.5 rounded-full bg-emerald-300" />
                </div>
                <div className="p-4">
                  <div className="mb-3 flex items-center gap-2 border-b border-black/[0.06] pb-3">
                    <span className="flex size-5 items-center justify-center rounded bg-brand text-white">
                      <LogoIcon className="size-3" />
                    </span>
                    <span className="text-xs font-semibold text-ink">BuildSpace</span>
                    <span className="ml-auto flex items-center gap-1 rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[10px] font-semibold text-brand">
                      Explore Library
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-ink">Good morning, Sai 👋</p>
                  <p className="text-xs text-ink-muted">Ready to keep building today?</p>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {[
                      { value: "3", label: "Active Builds" },
                      { value: "47h", label: "Time Invested" },
                      { value: "28", label: "Tasks Done" },
                      { value: "12", label: "Discussions" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-lg border border-black/[0.06] bg-[#faf9f7] p-2 text-center">
                        <p className="text-sm font-bold text-ink">{s.value}</p>
                        <p className="text-[9px] leading-tight text-ink-muted">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] font-semibold text-ink">Continue Building</p>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 rounded-lg border border-black/[0.06] bg-[#faf9f7] p-2">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded bg-[#ecfdf5] text-brand">◧</span>
                      <p className="text-[10px] font-medium leading-tight text-ink">
                        E-Commerce Platform with Next.js 14, Stripe &amp; PostgreSQL
                      </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-black/[0.06] bg-[#faf9f7] p-2">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded bg-purple-50 text-purple-600">◨</span>
                      <p className="text-[10px] font-medium leading-tight text-ink">
                        Real-Time Chat App with Socket.io, Redis &amp; React
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] font-semibold text-ink">Trending This Week</p>
                  <div className="mt-1.5 grid grid-cols-3 gap-2">
                    {["#1a1410", "#e7e5e0", "#0a0f1a"].map((bg, i) => (
                      <div key={i} className="h-10 rounded-lg" style={{ background: bg }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden items-center gap-2 rounded-2xl border border-black/[0.08] bg-white px-3.5 py-2.5 sm:flex">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ecfdf5] text-brand">
                <CheckCircleIcon className="size-4" />
              </span>
              <div>
                <p className="text-[11px] font-semibold leading-tight text-ink">AI Review Passed</p>
                <p className="text-[10px] text-ink-muted">Score: 94/100</p>
              </div>
            </div>

            <div className="absolute -right-4 -top-4 hidden size-14 rotate-6 items-center justify-center rounded-2xl bg-brand text-lg font-semibold text-white sm:flex">
              {"</>"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
