import { techStackDetail } from "@/lib/course-content";

export function TechStackTab() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-ink">Tech Stack</h2>
      <div className="grid grid-cols-2 gap-4">
        {techStackDetail.map((tech) => (
          <div key={tech.name} className="flex items-start gap-3 rounded-xl border border-black/[0.08] bg-white p-4">
            <span className="mt-0.5 rounded-full bg-[#f2f1ee] px-2 py-0.5 text-[11px] font-medium text-ink-muted">
              {tech.category}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{tech.name}</p>
              <p className="text-xs text-ink-muted">{tech.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
