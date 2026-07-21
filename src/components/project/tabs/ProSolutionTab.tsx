import { BookmarkIcon } from "@/components/dashboard/icons";

export function ProSolutionTab() {
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
