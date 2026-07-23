"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";

// Minimal hand-written CSV serializer — no papaparse/csv dependency. Quotes
// any field containing a comma, quote, or newline, doubling embedded quotes
// per RFC 4180.
function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Array.from(rows.reduce((set, r) => { Object.keys(r).forEach((k) => set.add(k)); return set; }, new Set<string>()));
  const escapeField = (value: unknown): string => {
    const s = value === null || value === undefined ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escapeField(row[h])).join(","));
  }
  return lines.join("\n");
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

interface ReportDef {
  id: string;
  title: string;
  description: string;
  fetchRows: () => Promise<Record<string, unknown>[]>;
  filename: string;
}

async function fetchJsonList(url: string, key: string): Promise<Record<string, unknown>[]> {
  const res = await fetch(url, { cache: "no-store" });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? `Failed to load ${url}`);
  const list = body[key] ?? body.items ?? [];
  return list as Record<string, unknown>[];
}

const reports: ReportDef[] = [
  {
    id: "students",
    title: "Student Report",
    description: "All students with role, status, XP, and credits (falls back to /api/admin/users if the richer students endpoint is unavailable).",
    filename: "student-report.csv",
    fetchRows: async () => {
      try {
        return await fetchJsonList("/api/admin/students", "students");
      } catch {
        return await fetchJsonList("/api/admin/users", "users");
      }
    },
  },
  {
    id: "projects",
    title: "Project Report",
    description: "Every project in the catalog with category, level, and publish status.",
    filename: "project-report.csv",
    fetchRows: () => fetchJsonList("/api/admin/projects", "projects"),
  },
  {
    id: "certificates",
    title: "Certificate Report",
    description: "Every certificate issued, with tier, score, and issue date.",
    filename: "certificate-report.csv",
    fetchRows: () => fetchJsonList("/api/admin/certificates", "items"),
  },
  {
    id: "credits",
    title: "Credit Report",
    description: "Every credit transaction (earn/spend) recorded on the platform.",
    filename: "credit-report.csv",
    fetchRows: () => fetchJsonList("/api/admin/credit-transactions", "items"),
  },
];

export default function AdminReportsPage() {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null>(null);

  const run = async (report: ReportDef) => {
    setError(null);
    setDoneId(null);
    setBusyId(report.id);
    try {
      const rows = await report.fetchRows();
      const csv = toCsv(rows);
      downloadCsv(report.filename, csv);
      setDoneId(report.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to generate ${report.title}`);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-ink">Reports</h1>
        <p className="text-sm text-ink-muted">
          Generate CSV exports from live platform data. Exports are built entirely in the browser — no Excel or PDF
          export is available in this build, only CSV.
        </p>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {reports.map((r) => (
          <div key={r.id} className="rounded-xl border border-black/[0.08] bg-white p-5">
            <h2 className="text-sm font-semibold text-ink">{r.title}</h2>
            <p className="mt-1 text-xs text-ink-muted">{r.description}</p>
            <button
              type="button"
              disabled={busyId === r.id}
              onClick={() => run(r)}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
            >
              <FileDown strokeWidth={1.75} className="size-4" />
              {busyId === r.id ? "Generating…" : "Export CSV"}
            </button>
            {doneId === r.id && <p className="mt-2 text-xs font-medium text-emerald-600">Downloaded.</p>}
          </div>
        ))}
      </div>

      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
        Note: AI Usage Report is intentionally not offered — AI Studio was removed from this build per product
        decision, so there is no AI usage data to report on.
      </p>
    </div>
  );
}
