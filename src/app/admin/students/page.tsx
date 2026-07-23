"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface StudentRow {
  id: string;
  email: string | null;
  displayName: string | null;
  role: "user" | "admin";
  status: "active" | "suspended";
  xp: number;
  credits: number;
  avatarUrl: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  banned: boolean;
  certificateCount: number;
}

function initials(row: StudentRow) {
  const source = row.displayName || row.email?.split("@")[0] || "?";
  return source.slice(0, 2).toUpperCase();
}

function nameFor(row: StudentRow) {
  return row.displayName || row.email?.split("@")[0] || "—";
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

interface EditState {
  id: string;
  displayName: string;
  xp: string;
  credits: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setError(null);
    const res = await fetch("/api/admin/students", { cache: "no-store" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Failed to load students");
      return;
    }
    setStudents(body.students);
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (row: StudentRow) => {
    setEdit({ id: row.id, displayName: row.displayName ?? "", xp: String(row.xp), credits: String(row.credits) });
    setEditError(null);
  };

  const saveEdit = async () => {
    if (!edit) return;
    setEditError(null);
    setSaving(true);
    const res = await fetch(`/api/admin/students/${edit.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: edit.displayName, xp: Number(edit.xp), credits: Number(edit.credits) }),
    });
    const body = await res.json();
    setSaving(false);
    if (!res.ok) {
      setEditError(body.error ?? "Failed to save changes");
      return;
    }
    setEdit(null);
    await load();
  };

  const toggleSuspend = async (row: StudentRow) => {
    setBusyId(row.id);
    setError(null);
    const res = await fetch(`/api/admin/students/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suspended: row.status !== "suspended" }),
    });
    const body = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(body.error ?? "Failed to update status");
      return;
    }
    await load();
  };

  const resetCredits = async (row: StudentRow) => {
    if (!confirm(`Reset credits to 0 for ${nameFor(row)}?`)) return;
    setBusyId(row.id);
    setError(null);
    const res = await fetch(`/api/admin/students/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetCredits: true }),
    });
    const body = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(body.error ?? "Failed to reset credits");
      return;
    }
    await load();
  };

  const remove = async (row: StudentRow) => {
    if (!confirm(`Delete ${nameFor(row)}? This permanently removes their account and cannot be undone.`)) return;
    setBusyId(row.id);
    setError(null);
    const res = await fetch(`/api/admin/students/${row.id}`, { method: "DELETE" });
    const body = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(body.error ?? "Failed to delete student");
      return;
    }
    await load();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Students</h1>
          <p className="text-sm text-ink-muted">All registered students, their XP/credits, and certificates.</p>
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}

      {edit && (
        <div className="rounded-xl border border-black/[0.08] bg-white p-5">
          <h2 className="text-sm font-semibold text-ink">Edit student</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
              Display name
              <input
                value={edit.displayName}
                onChange={(e) => setEdit((s) => (s ? { ...s, displayName: e.target.value } : s))}
                className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
              XP
              <input
                type="number"
                min="0"
                value={edit.xp}
                onChange={(e) => setEdit((s) => (s ? { ...s, xp: e.target.value } : s))}
                className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
              Credits
              <input
                type="number"
                min="0"
                value={edit.credits}
                onChange={(e) => setEdit((s) => (s ? { ...s, credits: e.target.value } : s))}
                className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </label>
          </div>
          {editError && <p className="mt-3 text-sm font-medium text-red-600">{editError}</p>}
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={saveEdit}
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => setEdit(null)}
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-ink hover:bg-black/[0.03]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!students && !error && <p className="text-sm text-ink-muted">Loading students…</p>}

      {students && (
        <div className="overflow-x-auto rounded-xl border border-black/[0.08] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/[0.08] bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Last active</th>
                <th className="px-4 py-3 text-right">Credits</th>
                <th className="px-4 py-3 text-right">XP</th>
                <th className="px-4 py-3 text-right">Certificates</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((row) => (
                <tr key={row.id} className="border-b border-black/[0.06] last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                        style={{ backgroundImage: "linear-gradient(135deg, rgb(6, 95, 70) 0%, rgb(0, 122, 85) 100%)" }}
                      >
                        {initials(row)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink">{nameFor(row)}</p>
                        <p className="truncate text-xs text-ink-muted">{row.email ?? "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-muted capitalize">{row.role}</td>
                  <td className="px-4 py-3 text-ink-muted">{formatDate(row.createdAt)}</td>
                  <td className="px-4 py-3 text-ink-muted">{formatDate(row.lastSignInAt)}</td>
                  <td className="px-4 py-3 text-right text-ink">{row.credits}</td>
                  <td className="px-4 py-3 text-right text-ink">{row.xp}</td>
                  <td className="px-4 py-3 text-right text-ink">{row.certificateCount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        row.status === "suspended" || row.banned
                          ? "bg-red-50 text-red-600"
                          : "bg-brand-light text-brand"
                      }`}
                    >
                      {row.status === "suspended" || row.banned ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Link
                        href={`/admin/students/${row.id}`}
                        className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-ink hover:bg-black/[0.03]"
                      >
                        View profile
                      </Link>
                      <button
                        type="button"
                        onClick={() => startEdit(row)}
                        className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-ink hover:bg-black/[0.03]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => toggleSuspend(row)}
                        className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-ink hover:bg-black/[0.03] disabled:opacity-50"
                      >
                        {row.status === "suspended" ? "Unsuspend" : "Suspend"}
                      </button>
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => resetCredits(row)}
                        className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-ink hover:bg-black/[0.03] disabled:opacity-50"
                      >
                        Reset credits
                      </button>
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => remove(row)}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-ink-muted">
                    No students yet.
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
