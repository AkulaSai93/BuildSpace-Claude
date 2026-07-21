import { BookmarkIcon, CheckCircleIcon, ClockIcon, PlayIcon } from "@/components/dashboard/icons";

export function ProSolutionTab({ unlocked = false }: { unlocked?: boolean }) {
  if (!unlocked) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-black/[0.08] bg-white px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-[#fffbeb] text-[#bb4d00]">
          <BookmarkIcon className="size-5" />
        </span>
        <p className="text-sm font-semibold text-ink">Pro Solution is a Pro feature</p>
        <p className="max-w-sm text-sm text-ink-muted">
          Upgrade to BuildSpace Pro to unlock the full reference solution, line-by-line code walkthroughs,
          and instructor commentary for this project.
        </p>
        <button
          type="button"
          className="mt-1 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
        >
          Upgrade to Pro
        </button>
      </div>
    );
  }

  const walkthroughs = [
    { title: "Cart & Products API — architecture walkthrough", duration: "24:10", desc: "How the reference solution structures the cart, cart_items, and product tables." },
    { title: "Inventory locking & concurrency", duration: "18:32", desc: "Row-level locking vs optimistic concurrency, and why the reference solution picked one." },
    { title: "Deployment & monitoring walkthrough", duration: "15:47", desc: "Instructor commentary on the production deploy, logging, and health-check setup." },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-white">
          <CheckCircleIcon className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-emerald-800">Pro Solution Unlocked</p>
          <p className="text-xs text-emerald-700">
            You submitted your project for Milestone 3, so the reference solution and instructor walkthroughs
            for this milestone are now available below.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {walkthroughs.map((w) => (
          <div key={w.title} className="flex items-center gap-4 rounded-xl border border-black/[0.08] bg-white p-4">
            <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black">
              <button
                type="button"
                aria-label={`Play ${w.title}`}
                className="flex size-9 items-center justify-center rounded-full bg-white/90 text-brand hover:bg-white"
              >
                <PlayIcon className="size-4" />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{w.title}</p>
              <p className="text-xs text-ink-muted">{w.desc}</p>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-xs text-ink-muted">
              <ClockIcon className="size-3.5" />
              {w.duration}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
