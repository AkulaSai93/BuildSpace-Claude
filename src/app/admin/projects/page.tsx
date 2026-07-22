"use client";

import { useEffect, useState } from "react";
import type { ProjectSummary } from "@/types/library";

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
  };
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

  const showForm = creating || !!editingSlug;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Projects</h1>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
        >
          + New project
        </button>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}

      {showForm && (
        <div className="rounded-xl border border-black/[0.08] bg-white p-5">
          <h2 className="text-sm font-semibold text-ink">{creating ? "New project" : `Edit: ${editingSlug}`}</h2>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                placeholder="/images/my-thumbnail.png"
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
          </div>

          {formError && <p className="mt-3 text-sm font-medium text-red-600">{formError}</p>}

          <div className="mt-4 flex items-center gap-2">
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
      )}

      {!projects && !error && <p className="text-sm text-ink-muted">Loading projects…</p>}

      {projects && (
        <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/[0.08] bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Pro</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.slug} className="border-b border-black/[0.06] last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{p.title}</p>
                    <p className="text-xs text-ink-muted">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{p.category}</td>
                  <td className="px-4 py-3 text-ink-muted">{p.level}</td>
                  <td className="px-4 py-3">{p.isPro ? "Pro" : "Free"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-ink hover:bg-black/[0.03]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={busySlug === p.slug}
                        onClick={() => remove(p)}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                    No projects yet.
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
