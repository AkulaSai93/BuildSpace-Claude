import Link from "next/link";
import { ChatIcon, EditIcon, ListIcon, RefreshIcon, ShieldIcon, CheckBadgeIcon, ArrowRightIcon } from "@/components/dashboard/icons";

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
    <section id="features" className="mx-auto max-w-7xl px-6 py-8">
      <div className="grid grid-cols-1 gap-6 rounded-2xl border border-black/[0.08] bg-[#faf9f7] p-8 lg:grid-cols-[minmax(0,280px)_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">Built with AI</p>
          <h2 className="mt-1 text-2xl font-bold text-ink">Your AI engineer at every step</h2>
          <p className="mt-3 text-sm text-ink-muted">
            BuildSpace AI assists you throughout your journey. Write better code, fix bugs, generate
            documentation and ship faster.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-black/[0.1] bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-black/[0.02]"
          >
            Explore AI Features
            <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3 rounded-xl border border-black/[0.06] bg-white p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#ecfdf5] text-brand">
                <f.icon className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{f.title}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
