"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Technology } from "@/types/studio";

export default function AdminTechnologiesPage() {
  const [items, setItems] = useState<Technology[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyName, setBusyName] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    const res = await fetch("/api/admin/technologies", { cache: "no-store" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Failed to load technologies");
      return;
    }
    setItems(body.items);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/technologies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    const body = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(body.error ?? "Failed to create technology");
      return;
    }
    setName("");
    await load();
  };

  const remove = async (n: string) => {
    if (!confirm(`Delete technology "${n}"?`)) return;
    setBusyName(n);
    const res = await fetch(`/api/admin/technologies/${encodeURIComponent(n)}`, { method: "DELETE" });
    const body = await res.json();
    setBusyName(null);
    if (!res.ok) {
      setError(body.error ?? "Failed to delete technology");
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
        <h1 className="mt-1 text-xl font-semibold text-ink">Technologies</h1>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}

      <div className="rounded-xl border border-black/[0.08] bg-white p-5">
        <h2 className="text-sm font-semibold text-ink">Add technology</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              placeholder="React"
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
            {saving ? "Saving…" : "Add technology"}
          </button>
        </div>
      </div>

      {!items && !error && <p className="text-sm text-ink-muted">Loading technologies…</p>}

      {items && (
        <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/[0.08] bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.name} className="border-b border-black/[0.06] last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{t.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        disabled={busyName === t.name}
                        onClick={() => remove(t.name)}
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
                  <td colSpan={2} className="px-4 py-8 text-center text-ink-muted">
                    No technologies yet.
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
