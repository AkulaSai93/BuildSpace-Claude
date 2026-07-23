"use client";

import { useEffect, useState } from "react";
import { SettingsSubNav } from "../page";
import type { StudioRole } from "@/types/studio";

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<StudioRole[] | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Record<string, boolean>>>({});
  const [newPermKey, setNewPermKey] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    const res = await fetch("/api/admin/roles", { cache: "no-store" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Failed to load roles");
      return;
    }
    const items = body.items as StudioRole[];
    setRoles(items);
    const nextDrafts: Record<string, Record<string, boolean>> = {};
    for (const r of items) nextDrafts[r.id] = { ...(r.permissions ?? {}) };
    setDrafts(nextDrafts);
  };

  useEffect(() => {
    load();
  }, []);

  const togglePermission = (roleId: string, key: string) => {
    setDrafts((d) => ({ ...d, [roleId]: { ...d[roleId], [key]: !d[roleId]?.[key] } }));
  };

  const addPermission = (roleId: string) => {
    const key = (newPermKey[roleId] ?? "").trim();
    if (!key) return;
    setDrafts((d) => ({ ...d, [roleId]: { ...d[roleId], [key]: true } }));
    setNewPermKey((s) => ({ ...s, [roleId]: "" }));
  };

  const save = async (role: StudioRole) => {
    setSavingId(role.id);
    setSavedId(null);
    setError(null);
    const res = await fetch(`/api/admin/roles/${encodeURIComponent(role.id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: role.label, permissions: drafts[role.id] ?? {} }),
    });
    const body = await res.json();
    setSavingId(null);
    if (!res.ok) {
      setError(body.error ?? `Failed to save ${role.label}`);
      return;
    }
    setSavedId(role.id);
    await load();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand">Roles & Permissions</h1>
        <p className="text-sm text-ink-muted">Manage role definitions and their permission flags.</p>
      </div>

      <SettingsSubNav />

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Definitions only, not enforced yet.</strong> This page manages the <code>roles</code> table (labels
        and permission flags) as reference data. Assigning a specific admin user to one of these richer roles is not
        wired up in this pass — the existing simple <code>profiles.role</code> (&quot;admin&quot; / &quot;user&quot;) flag remains the
        only thing that actually gates access to the /admin section today.
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}
      {!roles && !error && <p className="text-sm text-ink-muted">Loading roles…</p>}

      {roles && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {roles.map((role) => {
            const draft = drafts[role.id] ?? {};
            return (
              <div key={role.id} className="rounded-xl border border-black/[0.08] bg-white p-5">
                <h2 className="text-sm font-semibold text-ink">{role.label}</h2>
                <p className="text-xs text-ink-muted">id: {role.id}</p>

                <div className="mt-4 flex flex-col gap-2">
                  {Object.keys(draft).length === 0 && <p className="text-xs text-ink-muted">No permission keys yet.</p>}
                  {Object.entries(draft).map(([permKey, enabled]) => (
                    <label key={permKey} className="flex items-center gap-2 text-sm text-ink">
                      <input type="checkbox" checked={!!enabled} onChange={() => togglePermission(role.id, permKey)} />
                      {permKey}
                    </label>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    value={newPermKey[role.id] ?? ""}
                    onChange={(e) => setNewPermKey((s) => ({ ...s, [role.id]: e.target.value }))}
                    placeholder="new permission key"
                    className="flex-1 rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-1.5 text-sm text-ink outline-none focus:border-brand"
                  />
                  <button
                    type="button"
                    onClick={() => addPermission(role.id)}
                    className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-ink hover:bg-black/[0.03]"
                  >
                    + Add
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    disabled={savingId === role.id}
                    onClick={() => save(role)}
                    className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
                  >
                    {savingId === role.id ? "Saving…" : "Save"}
                  </button>
                  {savedId === role.id && <span className="text-xs font-medium text-emerald-600">Saved.</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
