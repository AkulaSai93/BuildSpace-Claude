import { collectionFilters, technologyFilters } from "@/lib/library-data";

const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];
const accessOptions = ["Free Projects", "Premium Projects"];
const durationOptions = ["Under 20 hours", "20–40 hours", "40+ hours"];

function CheckboxRow({ label }: { label: string }) {
  return (
    <label className="flex items-center gap-2.5 py-1 text-sm text-ink cursor-pointer">
      <span className="size-4 rounded border border-black/20" />
      {label}
    </label>
  );
}

export function FilterSidebar() {
  return (
    <aside className="flex w-[302px] shrink-0 flex-col gap-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Difficulty</h3>
        <div className="flex flex-col">
          {difficultyOptions.map((d) => (
            <CheckboxRow key={d} label={d} />
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-black/[0.08]" />

      <div>
        <h3 className="mb-3 text-xs font-semibold tracking-wide text-ink-muted">TECHNOLOGIES</h3>
        <div className="flex flex-col">
          {technologyFilters.map((t) => (
            <CheckboxRow key={t} label={t} />
          ))}
        </div>
        <button type="button" className="mt-2 flex items-center gap-1.5 text-sm font-medium text-brand">
          + Show more
        </button>
      </div>

      <div className="h-px w-full bg-black/[0.08]" />

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Access</h3>
        <div className="flex flex-col">
          {accessOptions.map((a) => (
            <CheckboxRow key={a} label={a} />
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-black/[0.08]" />

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Duration</h3>
        <div className="flex flex-col">
          {durationOptions.map((d) => (
            <CheckboxRow key={d} label={d} />
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-black/[0.08]" />

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Collections</h3>
        <div className="flex flex-col gap-2">
          {collectionFilters.map((c) => (
            <button
              key={c.label}
              type="button"
              className="flex w-full items-center justify-between text-sm text-ink hover:text-brand"
            >
              <span>{c.label}</span>
              <span className="text-ink-muted">{c.count}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
