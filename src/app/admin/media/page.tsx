"use client";

// Asset manager backed by the media_assets table. IMPORTANT: there is no
// storage bucket / file upload backend wired up in this pass — the "add
// asset" form only lets an admin register a URL that already exists (an
// existing /images/... path in the public folder, or an external URL).
// Building real upload requires a Supabase Storage bucket + signed upload
// flow, which is out of scope here.
import { useEffect, useMemo, useState } from "react";
import type { MediaAsset } from "@/types/studio";

type FormState = {
  folder: string;
  name: string;
  url: string;
  type: string;
  tags: string;
  size_bytes: string;
};

const emptyForm: FormState = {
  folder: "general",
  name: "",
  url: "",
  type: "image",
  tags: "",
  size_bytes: "",
};

function formToPayload(f: FormState): Partial<MediaAsset> {
  return {
    folder: f.folder.trim() || "general",
    name: f.name.trim(),
    url: f.url.trim(),
    type: f.type.trim() || "image",
    tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean),
    size_bytes: f.size_bytes ? Number(f.size_bytes) : null,
  };
}

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState("");

  const load = async () => {
    setError(null);
    const res = await fetch("/api/admin/media", { cache: "no-store" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Failed to load media assets");
      return;
    }
    setAssets(body.items);
  };

  useEffect(() => {
    load();
  }, []);

  const folders = useMemo(() => {
    if (!assets) return [];
    return Array.from(new Set(assets.map((a) => a.folder))).sort();
  }, [assets]);

  const filtered = useMemo(() => {
    if (!assets) return [];
    const q = search.trim().toLowerCase();
    return assets.filter((a) => {
      if (folderFilter && a.folder !== folderFilter) return false;
      if (!q) return true;
      return a.name.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q));
    });
  }, [assets, search, folderFilter]);

  const startCreate = () => {
    setCreating(true);
    setForm(emptyForm);
    setFormError(null);
  };

  const cancelForm = () => {
    setCreating(false);
    setFormError(null);
  };

  const submit = async () => {
    setFormError(null);
    if (!form.name.trim() || !form.url.trim()) {
      setFormError("Name and URL are required");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formToPayload(form)),
    });
    const body = await res.json();
    setSaving(false);
    if (!res.ok) {
      setFormError(body.error ?? "Failed to save asset");
      return;
    }
    setCreating(false);
    await load();
  };

  const remove = async (a: MediaAsset) => {
    if (!confirm(`Delete "${a.name}"? This only removes the catalog entry — it does not delete any file.`)) return;
    setBusyId(a.id);
    const res = await fetch(`/api/admin/media/${encodeURIComponent(a.id)}`, { method: "DELETE" });
    const body = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(body.error ?? "Failed to delete asset");
      return;
    }
    await load();
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Media Library</h1>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
        >
          + Add asset
        </button>
      </div>

      <p className="rounded-lg bg-[#faf9f7] px-3 py-2 text-xs text-ink-muted">
        Paste a URL to an existing file — direct upload isn&apos;t wired up yet (no storage bucket is
        connected in this environment). Use an existing <code>/images/...</code> path or an external URL.
      </p>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}

      {creating && (
        <div className="rounded-xl border border-black/[0.08] bg-white p-5">
          <h2 className="text-sm font-semibold text-ink">New asset</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
              Name
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
              Type
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              >
                <option value="image">image</option>
                <option value="video">video</option>
                <option value="document">document</option>
                <option value="other">other</option>
              </select>
            </label>
            <label className="col-span-full flex flex-col gap-1 text-xs font-semibold text-ink">
              URL
              <input
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="/images/my-asset.png or https://..."
                className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
              Folder
              <input
                value={form.folder}
                onChange={(e) => setForm((f) => ({ ...f, folder: e.target.value }))}
                className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
              Size in bytes (optional)
              <input
                type="number"
                min="0"
                value={form.size_bytes}
                onChange={(e) => setForm((f) => ({ ...f, size_bytes: e.target.value }))}
                className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </label>
            <label className="col-span-full flex flex-col gap-1 text-xs font-semibold text-ink">
              Tags (comma-separated)
              <input
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="thumbnail, hero, banner"
                className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </label>
          </div>

          {formError && <p className="mt-3 text-sm font-medium text-red-600">{formError}</p>}

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={submit}
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Add asset"}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-ink hover:bg-black/[0.03]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {assets && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or tag…"
            className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
          />
          <select
            value={folderFilter}
            onChange={(e) => setFolderFilter(e.target.value)}
            className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
          >
            <option value="">All folders</option>
            {folders.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      )}

      {!assets && !error && <p className="text-sm text-ink-muted">Loading…</p>}

      {assets && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((a) => (
            <div key={a.id} className="flex flex-col overflow-hidden rounded-xl border border-black/[0.08] bg-white">
              <div className="flex h-32 items-center justify-center bg-[#faf9f7]">
                {a.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.url} alt={a.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs font-semibold uppercase text-ink-muted">{a.type}</span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1 p-3">
                <p className="truncate text-sm font-medium text-ink" title={a.name}>
                  {a.name}
                </p>
                <p className="text-xs text-ink-muted">{a.folder}</p>
                <p className="text-xs text-ink-muted">{formatSize(a.size_bytes)}</p>
                {a.tags.length > 0 && (
                  <p className="truncate text-xs text-ink-muted" title={a.tags.join(", ")}>
                    {a.tags.join(", ")}
                  </p>
                )}
                <button
                  type="button"
                  disabled={busyId === a.id}
                  onClick={() => remove(a)}
                  className="mt-2 self-start rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-ink-muted">No assets match.</p>
          )}
        </div>
      )}
    </div>
  );
}
