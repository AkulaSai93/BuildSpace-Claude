import { hubSections } from "@/lib/learning-hub-data";
import { CheckCircleIcon } from "@/components/dashboard/icons";

export function LearningHubSidebar({
  activeSection,
  completedSections,
  onSelect,
}: {
  activeSection: string;
  completedSections: Set<string>;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="flex w-[282px] shrink-0 flex-col gap-4 border-r border-black/[0.06] bg-white p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Learning Hub</p>
        <p className="mt-1 text-sm text-ink-muted">
          {completedSections.size}/{hubSections.length} sections complete
        </p>
        <div className="mt-2 h-1.5 w-full rounded-full bg-black/[0.08]">
          <div
            className="h-1.5 rounded-full bg-brand"
            style={{ width: `${(completedSections.size / hubSections.length) * 100}%` }}
          />
        </div>
      </div>

      <nav className="flex flex-col gap-0.5">
        {hubSections.map((section, i) => {
          const isActive = section.id === activeSection;
          const isComplete = completedSections.has(section.id);
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(section.id)}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm ${
                isActive ? "bg-[#ecfdf5] font-semibold text-brand" : "text-ink hover:bg-black/[0.02]"
              }`}
            >
              {isComplete ? (
                <CheckCircleIcon className="size-4 shrink-0 text-brand" />
              ) : (
                <span className="flex size-4 shrink-0 items-center justify-center text-xs text-ink-muted">
                  {i + 1}
                </span>
              )}
              <span className="flex-1">{section.label}</span>
              {section.required && !isComplete && (
                <span className="rounded-[10px] bg-[#f2f1ee] px-1.5 py-0.5 text-[10px] font-semibold text-ink-muted">
                  REQ
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
