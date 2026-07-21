import { techStackDetail } from "@/lib/course-content";

const avatarColors: Record<string, string> = {
  Framework: "bg-ink text-white",
  Language: "bg-blue-500 text-white",
  Database: "bg-blue-800 text-white",
  ORM: "bg-stone-800 text-white",
  Payments: "bg-violet-500 text-white",
  Cache: "bg-red-500 text-white",
  Auth: "bg-indigo-600 text-white",
  Styling: "bg-cyan-500 text-white",
};

const difficultyStyles: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-600",
  Intermediate: "bg-[#fffbeb] text-[#bb4d00]",
  Advanced: "bg-red-50 text-red-600",
};

export function TechStackTab() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-ink">Tech Stack</h2>
      <div className="grid grid-cols-2 gap-4">
        {techStackDetail.map((tech) => (
          <div
            key={tech.name}
            className="flex flex-col justify-between gap-4 rounded-xl border border-black/[0.08] bg-white p-4"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                      avatarColors[tech.category] ?? "bg-stone-700 text-white"
                    }`}
                  >
                    {tech.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{tech.name}</p>
                    <p className="text-xs text-ink-muted">{tech.version}</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#f2f1ee] px-2.5 py-1 text-xs font-medium text-ink-muted">
                  {tech.category}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-ink-muted">{tech.role}</p>

              <div className="rounded-lg bg-[#ecfdf5] p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-brand">Why We Chose It</p>
                <p className="mt-1 text-xs leading-relaxed text-ink/80">{tech.whyWeChoseIt}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`rounded-[14px] px-2.5 py-1 text-xs font-medium ${difficultyStyles[tech.difficulty]}`}>
                {tech.difficulty}
              </span>
              <button type="button" className="flex items-center gap-1 text-xs font-medium text-brand hover:underline">
                Docs
                <svg viewBox="0 0 16 16" fill="none" className="size-3">
                  <path d="M6 3h7v7M13 3L3 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
