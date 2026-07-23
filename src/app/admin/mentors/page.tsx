"use client";

import { useEffect, useState } from "react";
import type { Mentor, MentorSession } from "@/types/studio";

type FormState = {
  name: string;
  title: string;
  expertise: string;
  bio: string;
  avatar_url: string;
  zoom_link: string;
  active: boolean;
};

const emptyForm: FormState = {
  name: "",
  title: "",
  expertise: "",
  bio: "",
  avatar_url: "",
  zoom_link: "",
  active: true,
};

function mentorToForm(m: Mentor): FormState {
  return {
    name: m.name,
    title: m.title ?? "",
    expertise: m.expertise.join(", "),
    bio: m.bio ?? "",
    avatar_url: m.avatar_url ?? "",
    zoom_link: m.zoom_link ?? "",
    active: m.active,
  };
}

function formToPayload(f: FormState): Partial<Mentor> {
  return {
    name: f.name.trim(),
    title: f.title.trim() || null,
    expertise: f.expertise.split(",").map((t) => t.trim()).filter(Boolean),
    bio: f.bio.trim() || null,
    avatar_url: f.avatar_url.trim() || null,
    zoom_link: f.zoom_link.trim() || null,
    active: f.active,
  };
}

export default function AdminMentorsPage() {
  const [mentors, setMentors] = useState<Mentor[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [sessions, setSessions] = useState<MentorSession[] | null>(null);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [sessionMentorFilter, setSessionMentorFilter] = useState<string>("");

  const load = async () => {
    setError(null);
    const res = await fetch("/api/admin/mentors", { cache: "no-store" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Failed to load mentors");
      return;
    }
    setMentors(body.items);
  };

  const loadSessions = async (mentorId: string) => {
    setSessionsError(null);
    const qs = mentorId ? `?mentorId=${encodeURIComponent(mentorId)}` : "";
    const res = await fetch(`/api/admin/mentor-sessions${qs}`, { cache: "no-store" });
    const body = await res.json();
    if (!res.ok) {
      setSessionsError(body.error ?? "Failed to load sessions");
      return;
    }
    setSessions(body.items);
  };

  useEffect(() => {
    load();
    loadSessions("");
  }, []);

  const startCreate = () => {
    setCreating(true);
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const startEdit = (m: Mentor) => {
    setEditingId(m.id);
    setCreating(false);
    setForm(mentorToForm(m));
    setFormError(null);
  };

  const cancelForm = () => {
    setCreating(false);
    setEditingId(null);
    setFormError(null);
  };

  const submit = async () => {
    setFormError(null);
    if (!form.name.trim()) {
      setFormError("Name is required");
      return;
    }
    setSaving(true);
    const payload = formToPayload(form);

    const res = creating
      ? await fetch("/api/admin/mentors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch(`/api/admin/mentors/${encodeURIComponent(editingId!)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    const body = await res.json();
    setSaving(false);
    if (!res.ok) {
      setFormError(body.error ?? "Failed to save mentor");
      return;
    }
    setCreating(false);
    setEditingId(null);
    await load();
  };

  const remove = async (m: Mentor) => {
    if (!confirm(`Delete mentor "${m.name}"? This cannot be undone.`)) return;
    setBusyId(m.id);
    const res = await fetch(`/api/admin/mentors/${encodeURIComponent(m.id)}`, { method: "DELETE" });
    const body = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(body.error ?? "Failed to delete mentor");
      return;
    }
    await load();
  };

  const toggleActive = async (m: Mentor) => {
    setBusyId(m.id);
    const res = await fetch(`/api/admin/mentors/${encodeURIComponent(m.id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !m.active }),
    });
    const body = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(body.error ?? "Failed to update mentor");
      return;
    }
    await load();
  };

  const showForm = creating || !!editingId;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-brand">Mentors</h1>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
        >
          + New mentor
        </button>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}

      {showForm && (
        <div className="rounded-xl border border-black/[0.08] bg-white p-5">
          <h2 className="text-sm font-semibold text-ink">{creating ? "New mentor" : `Edit mentor`}</h2>

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
              Title
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Senior Backend Engineer"
                className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </label>
            <label className="col-span-full flex flex-col gap-1 text-xs font-semibold text-ink">
              Expertise (comma-separated)
              <input
                value={form.expertise}
                onChange={(e) => setForm((f) => ({ ...f, expertise: e.target.value }))}
                placeholder="React, Node.js, System Design"
                className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </label>
            <label className="col-span-full flex flex-col gap-1 text-xs font-semibold text-ink">
              Bio
              <textarea
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                className="h-20 resize-none rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
              Avatar URL
              <input
                value={form.avatar_url}
                onChange={(e) => setForm((f) => ({ ...f, avatar_url: e.target.value }))}
                placeholder="/images/mentors/jane.png"
                className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
              Zoom link
              <input
                value={form.zoom_link}
                onChange={(e) => setForm((f) => ({ ...f, zoom_link: e.target.value }))}
                placeholder="https://zoom.us/j/..."
                className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-ink">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
              Active
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
              {saving ? "Saving…" : creating ? "Create mentor" : "Save changes"}
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

      {!mentors && !error && <p className="text-sm text-ink-muted">Loading…</p>}

      {mentors && (
        <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/[0.08] bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Expertise</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mentors.map((m) => (
                <tr key={m.id} className="border-b border-black/[0.06] last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{m.name}</p>
                    <p className="text-xs text-ink-muted">{m.title}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{m.expertise.join(", ") || "—"}</td>
                  <td className="px-4 py-3 text-ink-muted">{m.rating.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        m.active ? "bg-green-50 text-green-700" : "bg-black/[0.04] text-ink-muted"
                      }`}
                    >
                      {m.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        disabled={busyId === m.id}
                        onClick={() => toggleActive(m)}
                        className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-ink hover:bg-black/[0.03] disabled:opacity-50"
                      >
                        {m.active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(m)}
                        className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-ink hover:bg-black/[0.03]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={busyId === m.id}
                        onClick={() => remove(m)}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {mentors.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                    No mentors yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between pt-4">
        <h2 className="text-lg font-semibold text-ink">Sessions</h2>
        <select
          value={sessionMentorFilter}
          onChange={(e) => {
            setSessionMentorFilter(e.target.value);
            loadSessions(e.target.value);
          }}
          className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
        >
          <option value="">All mentors</option>
          {mentors?.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {sessionsError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{sessionsError}</p>
      )}

      {!sessions && !sessionsError && <p className="text-sm text-ink-muted">Loading…</p>}

      {sessions && (
        <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/[0.08] bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Mentor</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Scheduled</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-b border-black/[0.06] last:border-0">
                  <td className="px-4 py-3 text-ink-muted">
                    {mentors?.find((m) => m.id === s.mentor_id)?.name ?? s.mentor_id}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{s.student_id}</td>
                  <td className="px-4 py-3 text-ink-muted">{s.project_slug ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-muted">{new Date(s.scheduled_at).toLocaleString()}</td>
                  <td className="px-4 py-3 text-ink-muted">{s.status}</td>
                  <td className="px-4 py-3 text-ink-muted">{s.notes ?? "—"}</td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                    No sessions yet. (No booking calendar UI is wired up here — this is a read-only list of
                    scheduled sessions.)
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
