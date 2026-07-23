"use client";

// Notification templates/announcements. IMPORTANT: no SMTP/push provider is
// wired up in this environment — creating a row here and setting status to
// "sent" only records that an admin manually marked it sent; it does not
// actually deliver an email, push notification, or in-app banner to anyone.
import { useEffect, useState } from "react";
import type { StudioNotification } from "@/types/studio";

type FormState = {
  title: string;
  body: string;
  channel: StudioNotification["channel"];
  status: StudioNotification["status"];
  scheduled_at: string;
};

const emptyForm: FormState = {
  title: "",
  body: "",
  channel: "email",
  status: "draft",
  scheduled_at: "",
};

function notifToForm(n: StudioNotification): FormState {
  return {
    title: n.title,
    body: n.body,
    channel: n.channel,
    status: n.status,
    scheduled_at: n.scheduled_at ? n.scheduled_at.slice(0, 16) : "",
  };
}

function formToPayload(f: FormState): Partial<StudioNotification> {
  return {
    title: f.title.trim(),
    body: f.body.trim(),
    channel: f.channel,
    status: f.status,
    scheduled_at: f.scheduled_at ? new Date(f.scheduled_at).toISOString() : null,
  };
}

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<StudioNotification[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    const res = await fetch("/api/admin/notifications", { cache: "no-store" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Failed to load notifications");
      return;
    }
    const rows: StudioNotification[] = body.items;
    rows.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    setItems(rows);
  };

  useEffect(() => {
    load();
  }, []);

  const startCreate = () => {
    setCreating(true);
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const startEdit = (n: StudioNotification) => {
    setEditingId(n.id);
    setCreating(false);
    setForm(notifToForm(n));
    setFormError(null);
  };

  const cancelForm = () => {
    setCreating(false);
    setEditingId(null);
    setFormError(null);
  };

  const submit = async () => {
    setFormError(null);
    if (!form.title.trim() || !form.body.trim()) {
      setFormError("Title and body are required");
      return;
    }
    setSaving(true);
    const payload = formToPayload(form);

    const res = creating
      ? await fetch("/api/admin/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch(`/api/admin/notifications/${encodeURIComponent(editingId!)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    const body = await res.json();
    setSaving(false);
    if (!res.ok) {
      setFormError(body.error ?? "Failed to save notification");
      return;
    }
    setCreating(false);
    setEditingId(null);
    await load();
  };

  const remove = async (n: StudioNotification) => {
    if (!confirm(`Delete "${n.title}"? This cannot be undone.`)) return;
    setBusyId(n.id);
    const res = await fetch(`/api/admin/notifications/${encodeURIComponent(n.id)}`, { method: "DELETE" });
    const body = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(body.error ?? "Failed to delete notification");
      return;
    }
    await load();
  };

  const showForm = creating || !!editingId;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-brand">Notifications</h1>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
        >
          + New notification
        </button>
      </div>

      <p className="rounded-lg bg-[#faf9f7] px-3 py-2 text-xs text-ink-muted">
        This stores notification templates/announcements only — no SMTP or push provider is wired up in
        this environment. Setting status to &quot;sent&quot; just records that an admin marked it sent; it
        does not deliver anything to students.
      </p>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}

      {showForm && (
        <div className="rounded-xl border border-black/[0.08] bg-white p-5">
          <h2 className="text-sm font-semibold text-ink">{creating ? "New notification" : "Edit notification"}</h2>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="col-span-full flex flex-col gap-1 text-xs font-semibold text-ink">
              Title
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </label>
            <label className="col-span-full flex flex-col gap-1 text-xs font-semibold text-ink">
              Body
              <textarea
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                className="h-24 resize-none rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
              Channel
              <select
                value={form.channel}
                onChange={(e) => setForm((f) => ({ ...f, channel: e.target.value as FormState["channel"] }))}
                className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              >
                <option value="email">email</option>
                <option value="push">push</option>
                <option value="in_app">in_app</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
              Status
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as FormState["status"] }))}
                className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              >
                <option value="draft">draft</option>
                <option value="scheduled">scheduled</option>
                <option value="sent">sent</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
              Scheduled at
              <input
                type="datetime-local"
                value={form.scheduled_at}
                onChange={(e) => setForm((f) => ({ ...f, scheduled_at: e.target.value }))}
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
              {saving ? "Saving…" : creating ? "Create notification" : "Save changes"}
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

      {!items && !error && <p className="text-sm text-ink-muted">Loading…</p>}

      {items && (
        <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/[0.08] bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Scheduled</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((n) => (
                <tr key={n.id} className="border-b border-black/[0.06] last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{n.title}</p>
                    <p className="max-w-md truncate text-xs text-ink-muted">{n.body}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{n.channel}</td>
                  <td className="px-4 py-3 text-ink-muted">{n.status}</td>
                  <td className="px-4 py-3 text-ink-muted">
                    {n.scheduled_at ? new Date(n.scheduled_at).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(n)}
                        className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-ink hover:bg-black/[0.03]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={busyId === n.id}
                        onClick={() => remove(n)}
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
                  <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                    No notifications yet.
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
