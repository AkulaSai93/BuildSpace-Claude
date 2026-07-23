"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Collection } from "@/types/studio";

const emptyForm = { label: "", description: "", sort_order: "0" };

export default function AdminCollectionsPage() {
  const [items, setItems] = useState<Collection[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyLabel, setBusyLabel] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    const res = await fetch("/api/admin/collections", { cache: "no-store" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Failed to load collections");
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
    const res = await fetch("/api/admin/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: form.label.trim(),
        description: form.description.trim() || null,
        sort_order: Number(form.sort_order) || 0,
      }),
    });
    const body = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(body.error ?? "Failed to create collection");
      return;
    }
    setForm(emptyForm);
    await load();
  };

  const remove = async (label: string) => {
    if (!confirm(`Delete collection "${label}"?`)) return;
    setBusyLabel(label);
    const res = await fetch(`/api/admin/collections/${encodeURIComponent(label)}`, { method: "DELETE" });
    const body = await res.json();
    setBusyLabel(null);
    if (!res.ok) {
      setError(body.error ?? "Failed to delete collection");
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
        <h1 className="mt-1 text-xl font-semibold text-ink">Collections</h1>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}

      <div className="rounded-xl border border-black/[0.08] bg-white p-5">
        <h2 className="text-sm font-semibold text-ink">Add collection</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
            Label
            <input
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              placeholder="Editor's Picks"
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
          <label className="col-span-full flex flex-col gap-1 text-xs font-semibold text-ink">
            Description
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="h-20 resize-none rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
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
            {saving ? "Saving…" : "Add collection"}
          </button>
        </div>
      </div>

      {!items && !error && <p className="text-sm text-ink-muted">Loading collections…</p>}

      {items && (
        <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/[0.08] bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Label</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Sort order</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.label} className="border-b border-black/[0.06] last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{c.label}</td>
                  <td className="px-4 py-3 text-ink-muted">{c.description ?? "—"}</td>
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
                  <td colSpan={4} className="px-4 py-8 text-center text-ink-muted">
                    No collections yet.
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
