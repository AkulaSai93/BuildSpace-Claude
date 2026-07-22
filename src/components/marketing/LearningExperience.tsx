import { PlayIcon, SparklesIcon, TargetIcon, TrophyIcon } from "@/components/dashboard/icons";
import { Reveal } from "@/components/marketing/Reveal";

const items = [
  { icon: PlayIcon, title: "Interactive Lessons", desc: "Hands-on, bite-sized lessons with real code." },
  { icon: TrophyIcon, title: "Progress Tracking", desc: "Track your progress and celebrate achievements." },
  { icon: SparklesIcon, title: "Gamification", desc: "Earn XP, badges and climb the leaderboard." },
  { icon: TargetIcon, title: "Smart Recommendations", desc: "AI recommends what you should learn next." },
];

export function LearningExperience() {
  return (
    <section id="solutions" className="mx-auto max-w-7xl px-6 py-14">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <Reveal direction="scale" duration={800}>
          <div className="relative overflow-hidden rounded-2xl border border-black/[0.08] bg-gradient-to-br from-[#0f1a15] to-[#1a1410] p-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-white">{"</>"}</span>
                <span className="text-sm font-semibold text-white/90">Engineering Workspace</span>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <div className="h-2 w-3/4 rounded-full bg-white/20" />
                <div className="mt-2 h-2 w-1/2 rounded-full bg-white/10" />
              </div>
              <div className="rounded-lg bg-white/5 p-3 font-mono text-[11px] leading-relaxed text-emerald-300/80">
                <p>{"function CartAPI() {"}</p>
                <p className="pl-3 text-white/50">{"// building with AI assistance..."}</p>
                <p>{"}"}</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal direction="left">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">Designed for effective learning</p>
            <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">
              A learning experience
              <br />
              you&apos;ll love
            </h2>
            <p className="mt-3 max-w-md text-sm text-ink-muted">
              Interactive lessons, gamification, progress tracking and more to keep you motivated.
            </p>
          </Reveal>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((it, i) => (
              <Reveal key={it.title} direction="left" delay={120 + i * 90}>
                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#ecfdf5] text-brand">
                    <it.icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{it.title}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">{it.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
