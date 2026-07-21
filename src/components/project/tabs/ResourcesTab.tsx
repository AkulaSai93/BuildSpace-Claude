import { resourceFiles } from "@/lib/course-content";
import { DownloadIcon } from "@/components/dashboard/icons";

export function ResourcesTab() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-ink">Downloadable Resources</h2>
      <div className="flex flex-col rounded-xl border border-black/[0.08] bg-white">
        {resourceFiles.map((file, i) => (
          <div
            key={file.name}
            className={`flex items-center justify-between px-5 py-4 ${i !== resourceFiles.length - 1 ? "border-b border-black/[0.06]" : ""}`}
          >
            <div>
              <p className="text-sm font-medium text-ink">{file.name}</p>
              <p className="text-xs text-ink-muted">
                {file.type} · {file.size}
              </p>
            </div>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-ink hover:bg-black/[0.02]"
            >
              <DownloadIcon className="size-3.5" />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
