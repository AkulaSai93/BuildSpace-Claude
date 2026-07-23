"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ProjectSummary } from "@/types/library";
import {
  MoreVertical,
  X,
  Pencil,
  Copy,
  Eye,
  EyeOff,
  Archive,
  RotateCcw,
  Trash2,
  ExternalLink,
  LayoutPanelTop,
} from "lucide-react";

const categories = [
  "Full Stack",
  "Frontend",
  "Backend",
  "AI / ML",
  "Mobile",
  "Cloud / DevOps",
  "Blockchain",
  "Cyber Security",
  "IoT",
] as const;

const levels = ["Beginner", "Intermediate", "Advanced"] as const;
const publishStatuses = ["draft", "published", "archived"] as const;

type FormState = {
  slug: string;
  title: string;
  shortDescription: string;
  category: (typeof categories)[number];
  thumbnail: string;
  isPro: boolean;
  tags: string;
  level: (typeof levels)[number];
  rating: string;
  reviewCount: string;
  videoCount: string;
  duration: string;
  learners: string;
  instructorName: string;
  instructorTitle: string;
  publishStatus: (typeof publishStatuses)[number];
};

const emptyForm: FormState = {
  slug: "",
  title: "",
  shortDescription: "",
  category: "Full Stack",
  thumbnail: "",
  isPro: false,
  tags: "",
  level: "Intermediate",
  rating: "4.5",
  reviewCount: "0",
  videoCount: "0",
  duration: "",
  learners: "0",
  instructorName: "",
  instructorTitle: "",
  publishStatus: "published",
};

function projectToForm(p: ProjectSummary): FormState {
  return {
    slug: p.slug,
    title: p.title,
    shortDescription: p.shortDescription,
    category: p.category as FormState["category"],
    thumbnail: p.thumbnail,
    isPro: p.isPro,
    tags: p.tags.join(", "),
    level: p.level,
    rating: String(p.rating),
    reviewCount: String(p.reviewCount),
    videoCount: String(p.videoCount),
    duration: p.duration,
    learners: p.learners,
    instructorName: p.instructor.name,
    instructorTitle: p.instructor.title,
    publishStatus: p.publishStatus ?? "published",
  };
}

function formToProject(f: FormState, existing?: ProjectSummary): ProjectSummary {
  return {
    ...existing,
    slug: f.slug.trim(),
    title: f.title.trim(),
    shortDescription: f.shortDescription.trim(),
    category: f.category,
    thumbnail: f.thumbnail.trim(),
    isPro: f.isPro,
    tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean),
    level: f.level,
    rating: Number(f.rating) || 0,
    reviewCount: Number(f.reviewCount) || 0,
    videoCount: Number(f.videoCount) || 0,
    duration: f.duration.trim(),
    learners: f.learners.trim(),
    instructor: { name: f.instructorName.trim(), title: f.instructorTitle.trim() },
    publishStatus: f.publishStatus,
  };
}

function statusBadgeClass(status: ProjectSummary["publishStatus"]) {
  switch (status ?? "published") {
    case "draft":
      return "bg-amber-50 text-amber-700";
    case "archived":
      return "bg-black/[0.04] text-ink-muted";
    default:
      return "bg-brand-light text-brand";
  }
}

function statusDotClass(status: ProjectSummary["publishStatus"]) {
  switch (status ?? "published") {
    case "draft":
      return "bg-amber-500";
    case "archived":
      return "bg-ink-muted";
    default:
      return "bg-brand";
  }
}

function statusLabel(status: ProjectSummary["publishStatus"]) {
  switch (status ?? "published") {
    case "draft":
      return "Draft";
    case "archived":
      return "Archived";
    default:
      return "Published";
  }
}

function useClickAway(onAway: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onAway();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onAway]);
  return ref;
}

function ActionsMenu({
  p,
  busy,
  onEdit,
  onDuplicate,
  onSetStatus,
  onDelete,
}: {
  p: ProjectSummary;
  busy: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onSetStatus: (status: NonNullable<ProjectSummary["publishStatus"]>) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickAway(() => setOpen(false));
  const status = p.publishStatus ?? "published";

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open actions"
        className="flex size-8 items-center justify-center rounded-full text-ink-muted transition hover:bg-black/[0.05] hover:text-ink"
      >
        <MoreVertical className="size-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-20 w-60 overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-lg shadow-black/[0.08]">
          <div className="border-b border-black/[0.06] px-3 py-2">
            <p className="truncate text-xs font-semibold text-ink">{p.title}</p>
            <p className="truncate text-[11px] text-ink-muted">{p.slug}</p>
          </div>
          <div className="flex flex-col py-1">
            <Link
              href={`/admin/projects/${encodeURIComponent(p.slug)}/content`}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink hover:bg-black/[0.03]"
            >
              <LayoutPanelTop className="size-4 text-ink-muted" /> Open Project Studio
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className="flex items-center gap-2.5 px-3 py-2 text-left text-sm text-ink hover:bg-black/[0.03]"
            >
              <Pencil className="size-4 text-ink-muted" /> Edit catalog details
            </button>

            {status === "draft" && (
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setOpen(false);
                  onSetStatus("published");
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-left text-sm text-ink hover:bg-black/[0.03] disabled:opacity-50"
              >
                <Eye className="size-4 text-brand" /> Publish
              </button>
            )}
            {status === "published" && (
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setOpen(false);
                  onSetStatus("draft");
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-left text-sm text-ink hover:bg-black/[0.03] disabled:opacity-50"
              >
                <EyeOff className="size-4 text-amber-600" /> Unpublish
              </button>
            )}
            {status !== "archived" ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setOpen(false);
                  onSetStatus("archived");
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-left text-sm text-ink hover:bg-black/[0.03] disabled:opacity-50"
              >
                <Archive className="size-4 text-ink-muted" /> Archive
              </button>
            ) : (
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setOpen(false);
                  onSetStatus("published");
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-left text-sm text-ink hover:bg-black/[0.03] disabled:opacity-50"
              >
                <RotateCcw className="size-4 text-emerald-600" /> Restore
              </button>
            )}

            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setOpen(false);
                onDuplicate();
              }}
              className="flex items-center gap-2.5 px-3 py-2 text-left text-sm text-ink hover:bg-black/[0.03] disabled:opacity-50"
            >
              <Copy className="size-4 text-ink-muted" /> Duplicate
            </button>

            {status === "draft" ? (
              <span className="flex cursor-not-allowed items-center gap-2.5 px-3 py-2 text-sm text-ink-muted/60">
                <ExternalLink className="size-4" /> Preview (publish first)
              </span>
            ) : (
              <a
                href={`/library/${encodeURIComponent(p.slug)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink hover:bg-black/[0.03]"
              >
                <ExternalLink className="size-4 text-ink-muted" /> Preview live page
              </a>
            )}

            <div className="my-1 border-t border-black/[0.06]" />
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setOpen(false);
                onDelete();
              }}
              className="flex items-center gap-2.5 px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="size-4" /> Delete project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const load = async () => {
    setError(null);
    const res = await fetch("/api/admin/projects", { cache: "no-store" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Failed to load projects");
      return;
    }
    setProjects(body.projects);
  };

  useEffect(() => {
    load();
  }, []);

  const startCreate = () => {
    setCreating(true);
    setEditingSlug(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const startEdit = (p: ProjectSummary) => {
    setEditingSlug(p.slug);
    setCreating(false);
    setForm(projectToForm(p));
    setFormError(null);
  };

  const cancelForm = () => {
    setCreating(false);
    setEditingSlug(null);
    setFormError(null);
  };

  const submit = async () => {
    setFormError(null);
    if (!form.slug.trim() || !form.title.trim()) {
      setFormError("Slug and title are required");
      return;
    }
    setSaving(true);
    const existing = editingSlug ? projects?.find((p) => p.slug === editingSlug) : undefined;
    const payload = formToProject(form, existing);

    const res = creating
      ? await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch(`/api/admin/projects/${encodeURIComponent(editingSlug!)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    const body = await res.json();
    setSaving(false);
    if (!res.ok) {
      setFormError(body.error ?? "Failed to save project");
      return;
    }
    setCreating(false);
    setEditingSlug(null);
    await load();
  };

  const remove = async (p: ProjectSummary) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    setBusySlug(p.slug);
    const res = await fetch(`/api/admin/projects/${encodeURIComponent(p.slug)}`, { method: "DELETE" });
    const body = await res.json();
    setBusySlug(null);
    if (!res.ok) {
      setError(body.error ?? "Failed to delete project");
      return;
    }
    await load();
  };

  const setStatus = async (p: ProjectSummary, publishStatus: NonNullable<ProjectSummary["publishStatus"]>) => {
    setBusySlug(p.slug);
    setError(null);
    const payload: ProjectSummary = { ...p, publishStatus };
    const res = await fetch(`/api/admin/projects/${encodeURIComponent(p.slug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json();
    setBusySlug(null);
    if (!res.ok) {
      setError(body.error ?? "Failed to update status");
      return;
    }
    await load();
  };

  const duplicate = async (p: ProjectSummary) => {
    setBusySlug(p.slug);
    setError(null);
    const newSlug = `${p.slug}-copy`;
    const payload: ProjectSummary = { ...p, slug: newSlug, title: `${p.title} (Copy)`, publishStatus: "draft" };
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json();
    setBusySlug(null);
    if (!res.ok) {
      setError(body.error ?? "Failed to duplicate project");
      return;
    }
    await load();
  };

  const showForm = creating || !!editingSlug;
  const filtered = (projects ?? []).filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand">Projects</h1>
          <p className="text-sm text-ink-muted">Manage the project catalog, its lifecycle, and taxonomy.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, slug, category…"
            className="w-64 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none focus:border-brand"
          />
          <button
            type="button"
            onClick={startCreate}
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
          >
            + New project
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/admin/projects/categories"
          className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-black/[0.03]"
        >
          Categories
        </Link>
        <Link
          href="/admin/projects/technologies"
          className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-black/[0.03]"
        >
          Technologies
        </Link>
        <Link
          href="/admin/projects/collections"
          className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-black/[0.03]"
        >
          Collections
        </Link>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}

      {showForm && (
        <div className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto bg-black/30 px-4 py-8">
          <div className="w-full max-w-3xl rounded-2xl border border-black/[0.08] bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-ink">{creating ? "New project" : `Edit: ${editingSlug}`}</h2>
              <button
                type="button"
                onClick={cancelForm}
                className="flex size-7 items-center justify-center rounded-full text-ink-muted hover:bg-black/[0.05]"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                Slug {creating && <span className="font-normal text-ink-muted">(URL-safe, unique)</span>}
                <input
                  value={form.slug}
                  disabled={!creating}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand disabled:opacity-60"
                  placeholder="my-new-project"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                Title
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                />
              </label>
              <label className="col-span-full flex flex-col gap-1 text-xs font-semibold text-ink">
                Short description
                <textarea
                  value={form.shortDescription}
                  onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
                  className="h-20 resize-none rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                Category
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as FormState["category"] }))}
                  className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                Level
                <select
                  value={form.level}
                  onChange={(e) => setForm((f) => ({ ...f, level: e.target.value as FormState["level"] }))}
                  className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                >
                  {levels.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
              <label className="col-span-full flex flex-col gap-1 text-xs font-semibold text-ink">
                Thumbnail path
                <input
                  value={form.thumbnail}
                  onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))}
                  placeholder="/images/projects/my-slug/thumbnail.png"
                  className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                />
              </label>
              <label className="col-span-full flex flex-col gap-1 text-xs font-semibold text-ink">
                Tags (comma-separated)
                <input
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="React, Node.js, PostgreSQL"
                  className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                Rating
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={form.rating}
                  onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                  className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                Review count
                <input
                  type="number"
                  min="0"
                  value={form.reviewCount}
                  onChange={(e) => setForm((f) => ({ ...f, reviewCount: e.target.value }))}
                  className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                Video count
                <input
                  type="number"
                  min="0"
                  value={form.videoCount}
                  onChange={(e) => setForm((f) => ({ ...f, videoCount: e.target.value }))}
                  className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                Duration
                <input
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                  placeholder="42h 30m"
                  className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                Learners
                <input
                  value={form.learners}
                  onChange={(e) => setForm((f) => ({ ...f, learners: e.target.value }))}
                  placeholder="12,840"
                  className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                Instructor name
                <input
                  value={form.instructorName}
                  onChange={(e) => setForm((f) => ({ ...f, instructorName: e.target.value }))}
                  className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                Instructor title
                <input
                  value={form.instructorTitle}
                  onChange={(e) => setForm((f) => ({ ...f, instructorTitle: e.target.value }))}
                  className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                />
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-ink">
                <input
                  type="checkbox"
                  checked={form.isPro}
                  onChange={(e) => setForm((f) => ({ ...f, isPro: e.target.checked }))}
                />
                Pro project
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                Publish status
                <select
                  value={form.publishStatus}
                  onChange={(e) => setForm((f) => ({ ...f, publishStatus: e.target.value as FormState["publishStatus"] }))}
                  className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                >
                  {publishStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {formError && <p className="mt-3 text-sm font-medium text-red-600">{formError}</p>}

            <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={submit}
                className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
              >
                {saving ? "Saving…" : creating ? "Create project" : "Save changes"}
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
        </div>
      )}

      {!projects && !error && <p className="text-sm text-ink-muted">Loading projects…</p>}

      {projects && (
        <div className="overflow-visible rounded-xl border border-black/[0.08] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/[0.08] bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Pricing</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const isBusy = busySlug === p.slug;
                return (
                  <tr key={p.slug} className="border-b border-black/[0.06] transition last:border-0 hover:bg-[#faf9f7]/70">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.thumbnail}
                            alt=""
                            className="size-9 shrink-0 rounded-lg border border-black/[0.06] object-cover"
                          />
                        ) : (
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-xs text-ink-muted">
                            —
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink">{p.title}</p>
                          <p className="truncate text-xs text-ink-muted">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-xs font-medium text-ink-muted">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{p.level}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          p.isPro ? "bg-violet-50 text-violet-700" : "bg-black/[0.04] text-ink-muted"
                        }`}
                      >
                        {p.isPro ? "Pro" : "Free"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(p.publishStatus)}`}
                      >
                        <span className={`size-1.5 rounded-full ${statusDotClass(p.publishStatus)}`} />
                        {statusLabel(p.publishStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ActionsMenu
                        p={p}
                        busy={isBusy}
                        onEdit={() => startEdit(p)}
                        onDuplicate={() => duplicate(p)}
                        onSetStatus={(status) => setStatus(p, status)}
                        onDelete={() => remove(p)}
                      />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                    {projects.length === 0 ? "No projects yet." : "No projects match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
