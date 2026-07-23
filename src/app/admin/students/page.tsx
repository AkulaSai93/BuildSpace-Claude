"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MoreVertical, User as UserIcon, Pencil, Ban, CheckCircle2, RotateCcw, Trash2, X } from "lucide-react";

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
  row,
  busy,
  onEdit,
  onToggleSuspend,
  onResetCredits,
  onDelete,
}: {
  row: StudentRow;
  busy: boolean;
  onEdit: () => void;
  onToggleSuspend: () => void;
  onResetCredits: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickAway(() => setOpen(false));
  const suspended = row.status === "suspended" || row.banned;

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
        <div className="absolute right-0 top-9 z-20 w-56 overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-lg shadow-black/[0.08]">
          <div className="border-b border-black/[0.06] px-3 py-2">
            <p className="truncate text-xs font-semibold text-ink">{nameFor(row)}</p>
            <p className="truncate text-[11px] text-ink-muted">{row.email ?? "—"}</p>
          </div>
          <div className="flex flex-col py-1">
            <Link
              href={`/admin/students/${row.id}`}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink hover:bg-black/[0.03]"
            >
              <UserIcon className="size-4 text-ink-muted" /> View profile
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className="flex items-center gap-2.5 px-3 py-2 text-left text-sm text-ink hover:bg-black/[0.03]"
            >
              <Pencil className="size-4 text-ink-muted" /> Edit details
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setOpen(false);
                onToggleSuspend();
              }}
              className="flex items-center gap-2.5 px-3 py-2 text-left text-sm text-ink hover:bg-black/[0.03] disabled:opacity-50"
            >
              {suspended ? (
                <CheckCircle2 className="size-4 text-emerald-600" />
              ) : (
                <Ban className="size-4 text-amber-600" />
              )}
              {suspended ? "Reactivate account" : "Suspend account"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setOpen(false);
                onResetCredits();
              }}
              className="flex items-center gap-2.5 px-3 py-2 text-left text-sm text-ink hover:bg-black/[0.03] disabled:opacity-50"
            >
              <RotateCcw className="size-4 text-ink-muted" /> Reset credits
            </button>
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
              <Trash2 className="size-4" /> Delete user
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const load = async () => {
    setError(null);
    const res = await fetch("/api/admin/students", { cache: "no-store" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Failed to load users");
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
      setError(body.error ?? "Failed to delete user");
      return;
    }
    await load();
  };

  const filtered = (students ?? []).filter((row) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return nameFor(row).toLowerCase().includes(q) || (row.email ?? "").toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand">Users</h1>
          <p className="text-sm text-ink-muted">All registered users, their XP/credits, and certificates.</p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email…"
          className="w-64 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none focus:border-brand"
        />
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}

      {edit && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-2xl border border-black/[0.08] bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-ink">Edit user</h2>
              <button
                type="button"
                onClick={() => setEdit(null)}
                className="flex size-7 items-center justify-center rounded-full text-ink-muted hover:bg-black/[0.05]"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                Display name
                <input
                  value={edit.displayName}
                  onChange={(e) => setEdit((s) => (s ? { ...s, displayName: e.target.value } : s))}
                  className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
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
            </div>
            {editError && <p className="mt-3 text-sm font-medium text-red-600">{editError}</p>}
            <div className="mt-5 flex items-center gap-2">
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
        </div>
      )}

      {!students && !error && <p className="text-sm text-ink-muted">Loading users…</p>}

      {students && (
        <div className="overflow-visible rounded-xl border border-black/[0.08] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/[0.08] bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">User</th>
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
              {filtered.map((row) => {
                const suspended = row.status === "suspended" || row.banned;
                return (
                  <tr key={row.id} className="border-b border-black/[0.06] transition last:border-0 hover:bg-[#faf9f7]/70">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
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
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          row.role === "admin" ? "bg-violet-50 text-violet-700" : "bg-black/[0.04] text-ink-muted"
                        }`}
                      >
                        {row.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{formatDate(row.createdAt)}</td>
                    <td className="px-4 py-3 text-ink-muted">{formatDate(row.lastSignInAt)}</td>
                    <td className="px-4 py-3 text-right font-medium text-ink">{row.credits}</td>
                    <td className="px-4 py-3 text-right font-medium text-ink">{row.xp}</td>
                    <td className="px-4 py-3 text-right text-ink">{row.certificateCount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          suspended ? "bg-red-50 text-red-600" : "bg-brand-light text-brand"
                        }`}
                      >
                        <span className={`size-1.5 rounded-full ${suspended ? "bg-red-500" : "bg-brand"}`} />
                        {suspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ActionsMenu
                        row={row}
                        busy={busyId === row.id}
                        onEdit={() => startEdit(row)}
                        onToggleSuspend={() => toggleSuspend(row)}
                        onResetCredits={() => resetCredits(row)}
                        onDelete={() => remove(row)}
                      />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-ink-muted">
                    {students.length === 0 ? "No users yet." : "No users match your search."}
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
