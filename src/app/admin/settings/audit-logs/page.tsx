"use client";

import { useEffect, useState } from "react";
import { SettingsSubNav } from "../page";
import type { AuditLogEntry } from "@/types/studio";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

const PAGE_SIZE = 25;

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      setError(null);
      const res = await fetch("/api/admin/audit-logs", { cache: "no-store" });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Failed to load audit logs");
        return;
      }
      const items = (body.items as AuditLogEntry[]).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setLogs(items);
    })();
  }, []);

  const totalPages = logs ? Math.max(1, Math.ceil(logs.length / PAGE_SIZE)) : 1;
  const pageRows = logs ? logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-ink">Audit Logs</h1>
        <p className="text-sm text-ink-muted">
          Read-only history of admin mutations across every module. Populated automatically whenever an admin
          create/update/delete route runs.
        </p>
      </div>

      <SettingsSubNav />

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}
      {!logs && !error && <p className="text-sm text-ink-muted">Loading audit logs…</p>}

      {logs && (
        <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/[0.08] bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Metadata</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((log) => (
                <tr key={log.id} className="border-b border-black/[0.06] last:border-0 align-top">
                  <td className="px-4 py-3 text-ink">{log.actor_email ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-xs font-semibold text-ink">{log.action}</span>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{log.target ?? "—"}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-xs text-ink-muted" title={JSON.stringify(log.metadata ?? {})}>
                    {log.metadata ? JSON.stringify(log.metadata) : "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-ink-muted">{formatDate(log.created_at)}</td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                    No audit log entries yet — they will appear here as admin actions run across other modules.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {logs && logs.length > PAGE_SIZE && (
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-black/[0.03] disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-ink-muted">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-black/[0.03] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
