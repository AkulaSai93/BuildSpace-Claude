"use client";

// Real CRUD against the community_reports table. This is the actual
// moderation queue: reports filed from the Discussions/Reviews tabs land
// here, and an admin can move status between open/resolved/dismissed.
// There is no separate "pin"/"feature"/"spam" flag system — those would
// need new columns on project_content (or a dedicated table) that don't
// exist yet, so we've kept moderation scoped to this open/resolved/dismissed
// status model, which is fully backed by real persistence.
import { useEffect, useState } from "react";
import CommunityTabs from "../_tabs";
import type { CommunityReport } from "@/types/studio";

const statuses: CommunityReport["status"][] = ["open", "resolved", "dismissed"];

export default function AdminCommunityReportsPage() {
  const [reports, setReports] = useState<CommunityReport[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    const res = await fetch("/api/admin/community-reports", { cache: "no-store" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Failed to load reports");
      return;
    }
    const items: CommunityReport[] = body.items;
    items.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    setReports(items);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (r: CommunityReport, status: CommunityReport["status"]) => {
    setBusyId(r.id);
    const res = await fetch(`/api/admin/community-reports/${encodeURIComponent(r.id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const body = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(body.error ?? "Failed to update report");
      return;
    }
    await load();
  };

  const remove = async (r: CommunityReport) => {
    if (!confirm("Delete this report? This cannot be undone.")) return;
    setBusyId(r.id);
    const res = await fetch(`/api/admin/community-reports/${encodeURIComponent(r.id)}`, { method: "DELETE" });
    const body = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(body.error ?? "Failed to delete report");
      return;
    }
    await load();
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-ink">Community</h1>
      <CommunityTabs />

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}

      {!reports && !error && <p className="text-sm text-ink-muted">Loading…</p>}

      {reports && (
        <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/[0.08] bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Reported</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-black/[0.06] last:border-0">
                  <td className="px-4 py-3 capitalize text-ink">{r.target_type}</td>
                  <td className="px-4 py-3 text-ink-muted">{r.project_slug}</td>
                  <td className="px-4 py-3 text-ink-muted">{r.target_id}</td>
                  <td className="px-4 py-3 text-ink-muted">{r.reason ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-muted">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      disabled={busyId === r.id}
                      onChange={(e) => updateStatus(r, e.target.value as CommunityReport["status"])}
                      className="rounded-lg border border-black/10 bg-[#faf9f7] px-2 py-1 text-xs text-ink outline-none focus:border-brand disabled:opacity-50"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      disabled={busyId === r.id}
                      onClick={() => remove(r)}
                      className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-ink-muted">
                    No reports yet.
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
