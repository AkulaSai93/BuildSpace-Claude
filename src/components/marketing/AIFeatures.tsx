import Link from "next/link";
import { ChatIcon, EditIcon, ListIcon, RefreshIcon, ShieldIcon, CheckBadgeIcon, ArrowRightIcon } from "@/components/dashboard/icons";
import { Reveal } from "@/components/marketing/Reveal";

const features = [
  { icon: EditIcon, title: "AI Code Completion", desc: "Write code faster with intelligent suggestions." },
  { icon: RefreshIcon, title: "AI Refactor", desc: "Improve code quality and performance automatically." },
  { icon: ShieldIcon, title: "AI Debugger", desc: "Find and fix bugs with AI explanations." },
  { icon: CheckBadgeIcon, title: "AI Test Generator", desc: "Generate unit tests and coverage instantly." },
  { icon: ListIcon, title: "AI Documentation", desc: "Generate docs, comments and README in one click." },
  { icon: ChatIcon, title: "AI Chat Assistant", desc: "Ask anything. Get help. Anytime." },
];

export function AIFeatures() {
  return (
    <section id="features" className="border-y border-black/[0.06] bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal direction="up">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">Built with AI</p>
            <h2 className="mt-1 whitespace-nowrap font-serif text-xl font-medium text-ink sm:text-2xl lg:text-3xl">
              Your AI engineer at every step
            </h2>
            <p className="mt-3 max-w-lg text-sm text-ink-muted">
              BuildSpace AI assists you throughout your journey — write better code, fix bugs, generate
              documentation and ship faster.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-black/[0.06] sm:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} direction="up" delay={i * 70}>
              <div
                className={`flex items-start gap-3 border-black/[0.06] p-6 ${i > 0 ? "border-t" : ""} ${
                  i > 0 && i < 3 ? "sm:border-t-0" : ""
                } ${i % 3 !== 2 ? "sm:border-r" : ""}`}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#ecfdf5] text-brand">
                  <f.icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{f.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{f.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal direction="up" delay={120}>
          <div className="mt-8 flex justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.1] bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-black/[0.02]"
            >
              Explore AI Features
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
