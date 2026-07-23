"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Category } from "@/types/studio";

const emptyForm = { label: "", sort_order: "0" };

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyLabel, setBusyLabel] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    const res = await fetch("/api/admin/categories", { cache: "no-store" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Failed to load categories");
      return;
    }
    setItems(body.items);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!form.label.trim()) {
      setError("Label is required");
      return;
    }
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: form.label.trim(), sort_order: Number(form.sort_order) || 0 }),
    });
    const body = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(body.error ?? "Failed to create category");
      return;
    }
    setForm(emptyForm);
    await load();
  };

  const remove = async (label: string) => {
    if (!confirm(`Delete category "${label}"?`)) return;
    setBusyLabel(label);
    const res = await fetch(`/api/admin/categories/${encodeURIComponent(label)}`, { method: "DELETE" });
    const body = await res.json();
    setBusyLabel(null);
    if (!res.ok) {
      setError(body.error ?? "Failed to delete category");
      return;
    }
    await load();
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link href="/admin/projects" className="text-sm font-medium text-brand hover:underline">
          ← Back to projects
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-ink">Categories</h1>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}

      <div className="rounded-xl border border-black/[0.08] bg-white p-5">
        <h2 className="text-sm font-semibold text-ink">Add category</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
            Label
            <input
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              placeholder="Full Stack"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
            Sort order
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
              className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
            />
          </label>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={submit}
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Add category"}
          </button>
        </div>
      </div>

      {!items && !error && <p className="text-sm text-ink-muted">Loading categories…</p>}

      {items && (
        <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/[0.08] bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Label</th>
                <th className="px-4 py-3">Sort order</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.label} className="border-b border-black/[0.06] last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{c.label}</td>
                  <td className="px-4 py-3 text-ink-muted">{c.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        disabled={busyLabel === c.label}
                        onClick={() => remove(c.label)}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-ink-muted">
                    No categories yet.
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
