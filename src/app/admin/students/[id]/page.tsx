"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import type { Certificate, XpTransaction, CreditTransaction, MentorSession } from "@/types/studio";

interface StudentDetail {
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
}

interface StudentResponse {
  student: StudentDetail;
  certificates: Certificate[];
  xpTransactions: XpTransaction[];
  creditTransactions: CreditTransaction[];
  mentorSessions: MentorSession[];
}

type TabKey = "overview" | "projects" | "certificates" | "activity" | "mentors";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "projects", label: "Certificates & completed projects" },
  { key: "certificates", label: "Certificates" },
  { key: "activity", label: "Activity timeline" },
  { key: "mentors", label: "Mentor sessions" },
];

function formatDateTime(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initials(row: StudentDetail) {
  const source = row.displayName || row.email?.split("@")[0] || "?";
  return source.slice(0, 2).toUpperCase();
}

function nameFor(row: StudentDetail) {
  return row.displayName || row.email?.split("@")[0] || "—";
}

export default function AdminStudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<StudentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabKey>("overview");

  const load = async () => {
    setError(null);
    const res = await fetch(`/api/admin/students/${id}`, { cache: "no-store" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Failed to load student");
      return;
    }
    setData(body);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/admin/students" className="text-sm font-medium text-brand hover:underline">
          ← Back to Students
        </Link>
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return <p className="text-sm text-ink-muted">Loading student…</p>;
  }

  const { student, certificates, xpTransactions, creditTransactions, mentorSessions } = data;

  // Combined, sorted activity feed. There is no single "events" table today,
  // so this is assembled client-side from the three ledgers we do have.
  type ActivityItem = { at: string; label: string; detail: string };
  const activity: ActivityItem[] = [
    ...xpTransactions.map((t) => ({
      at: t.created_at,
      label: t.amount >= 0 ? `+${t.amount} XP` : `${t.amount} XP`,
      detail: t.reason,
    })),
    ...creditTransactions.map((t) => ({
      at: t.created_at,
      label: t.amount >= 0 ? `+${t.amount} credits` : `${t.amount} credits`,
      detail: t.reason,
    })),
    ...certificates.map((c) => ({
      at: c.issued_at,
      label: `Certificate issued (${c.tier})`,
      detail: c.project_slug,
    })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return (
    <div className="flex flex-col gap-4">
      <Link href="/admin/students" className="text-sm font-medium text-brand hover:underline">
        ← Back to Students
      </Link>

      <div className="flex flex-col gap-4 rounded-xl border border-black/[0.08] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span
            className="flex size-12 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white"
            style={{ backgroundImage: "linear-gradient(135deg, rgb(6, 95, 70) 0%, rgb(0, 122, 85) 100%)" }}
          >
            {initials(student)}
          </span>
          <div>
            <p className="text-lg font-semibold text-ink">{nameFor(student)}</p>
            <p className="text-sm text-ink-muted">{student.email ?? "—"}</p>
          </div>
        </div>
        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
            student.status === "suspended" || student.banned ? "bg-red-50 text-red-600" : "bg-brand-light text-brand"
          }`}
        >
          {student.status === "suspended" || student.banned ? "Suspended" : "Active"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-black/[0.08] pb-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key ? "bg-brand-light text-brand" : "text-ink-muted hover:bg-black/[0.03]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-black/[0.08] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Role</p>
            <p className="mt-1 text-lg font-semibold capitalize text-ink">{student.role}</p>
          </div>
          <div className="rounded-xl border border-black/[0.08] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Joined</p>
            <p className="mt-1 text-lg font-semibold text-ink">{formatDateTime(student.createdAt)}</p>
          </div>
          <div className="rounded-xl border border-black/[0.08] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Credits</p>
            <p className="mt-1 text-lg font-semibold text-ink">{student.credits}</p>
          </div>
          <div className="rounded-xl border border-black/[0.08] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">XP</p>
            <p className="mt-1 text-lg font-semibold text-ink">{student.xp}</p>
          </div>
          <div className="rounded-xl border border-black/[0.08] bg-white p-5 sm:col-span-2 lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Badges (from issued certificates — there is no separate badges table yet)
            </p>
            {certificates.length === 0 ? (
              <p className="mt-2 text-sm text-ink-muted">No certificates issued yet.</p>
            ) : (
              <ul className="mt-2 flex flex-wrap gap-2">
                {certificates.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-ink"
                  >
                    {c.tier === "elite" ? "🏆" : "🎖️"} {c.project_slug} ({c.tier})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {tab === "projects" && (
        <div className="rounded-xl border border-black/[0.08] bg-white p-5">
          <p className="mb-3 text-sm text-ink-muted">
            Certificates &amp; completed projects — there is no separate per-student project-progress table yet, so this
            section only shows projects for which a certificate has actually been issued. No fabricated completion
            percentages are shown.
          </p>
          {certificates.length === 0 ? (
            <p className="text-sm text-ink-muted">No completed projects on record.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {certificates.map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded-lg border border-black/[0.06] px-3 py-2 text-sm">
                  <span className="font-medium text-ink">{c.project_slug}</span>
                  <span className="text-ink-muted">
                    {c.tier} · score {c.score ?? "—"} · {formatDateTime(c.issued_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "certificates" && (
        <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/[0.08] bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Certificate #</th>
                <th className="px-4 py-3">Issued</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((c) => (
                <tr key={c.id} className="border-b border-black/[0.06] last:border-0">
                  <td className="px-4 py-3 text-ink">{c.project_slug}</td>
                  <td className="px-4 py-3 capitalize text-ink-muted">{c.tier}</td>
                  <td className="px-4 py-3 text-ink-muted">{c.score ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-muted">{c.certificate_number ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-muted">{formatDateTime(c.issued_at)}</td>
                </tr>
              ))}
              {certificates.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                    No certificates yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "activity" && (
        <div className="rounded-xl border border-black/[0.08] bg-white p-5">
          {activity.length === 0 ? (
            <p className="text-sm text-ink-muted">No activity recorded yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {activity.map((a, i) => (
                <li key={i} className="flex items-start justify-between gap-4 border-b border-black/[0.06] pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-ink">{a.label}</p>
                    <p className="text-xs text-ink-muted">{a.detail}</p>
                  </div>
                  <span className="shrink-0 text-xs text-ink-muted">{formatDateTime(a.at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "mentors" && (
        <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white">
          <p className="px-5 pt-4 text-sm text-ink-muted">Read-only list — booking/scheduling UI lives in the Mentors module.</p>
          <table className="mt-2 w-full text-left text-sm">
            <thead className="border-b border-black/[0.08] bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Scheduled</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {mentorSessions.map((s) => (
                <tr key={s.id} className="border-b border-black/[0.06] last:border-0">
                  <td className="px-4 py-3 text-ink">{s.project_slug ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-muted">{formatDateTime(s.scheduled_at)}</td>
                  <td className="px-4 py-3 capitalize text-ink-muted">{s.status}</td>
                  <td className="px-4 py-3 text-ink-muted">{s.notes ?? "—"}</td>
                </tr>
              ))}
              {mentorSessions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-ink-muted">
                    No mentor sessions yet.
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
