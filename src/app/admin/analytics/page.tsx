import { listAuthUsers } from "@/lib/auth/adminUsers";
import { listProjects } from "@/lib/projectsData";
import { studioRest } from "@/lib/studio/db";
import type { Certificate, CreditTransaction, MentorSession, StudentProfile } from "@/types/studio";

function Bars({ data, formatValue }: { data: { label: string; count: number }[]; formatValue?: (n: number) => string }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex h-32 items-end gap-3">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-1.5">
          <div
            className="w-full rounded-t-md bg-brand/80"
            style={{ height: `${Math.max(4, (d.count / max) * 100)}%` }}
            title={formatValue ? formatValue(d.count) : String(d.count)}
          />
          <span className="truncate text-[10px] text-ink-muted">{d.label}</span>
        </div>
      ))}
      {data.length === 0 && <p className="text-sm text-ink-muted">No data yet.</p>}
    </div>
  );
}

function ListBreakdown({ rows }: { rows: { label: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="flex flex-col gap-2.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3 text-sm">
          <span className="w-32 shrink-0 truncate text-ink-muted">{r.label}</span>
          <div className="h-2 flex-1 rounded-full bg-black/[0.05]">
            <div className="h-2 rounded-full bg-brand/80" style={{ width: `${(r.count / max) * 100}%` }} />
          </div>
          <span className="w-8 shrink-0 text-right font-medium text-ink">{r.count}</span>
        </div>
      ))}
      {rows.length === 0 && <p className="text-sm text-ink-muted">No data yet.</p>}
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const [profiles, authUsers, projects, certificates, creditTx, mentorSessions] = await Promise.all([
    studioRest<StudentProfile[]>("/profiles?select=*").catch(() => [] as StudentProfile[]),
    listAuthUsers(),
    listProjects(),
    studioRest<Certificate[]>("/certificates?select=*").catch(() => [] as Certificate[]),
    studioRest<CreditTransaction[]>("/credit_transactions?select=*").catch(() => [] as CreditTransaction[]),
    studioRest<MentorSession[]>("/mentor_sessions?select=*").catch(() => [] as MentorSession[]),
  ]);

  // --- Students ---
  const totalStudents = authUsers.length;
  const suspendedCount = profiles.filter((p) => p.status === "suspended").length;
  const activeCount = totalStudents - suspendedCount;

  const rangeDays = 14;
  const signupDays = Array.from({ length: rangeDays }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (rangeDays - 1 - i));
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const count = authUsers.filter((u) => {
      const t = new Date(u.created_at).getTime();
      return t >= d.getTime() && t < next.getTime();
    }).length;
    return { label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), count };
  });

  // --- Projects ---
  const byCategory = new Map<string, number>();
  const byStatus = new Map<string, number>();
  for (const p of projects) {
    byCategory.set(p.category, (byCategory.get(p.category) ?? 0) + 1);
    const status = p.publishStatus ?? "published";
    byStatus.set(status, (byStatus.get(status) ?? 0) + 1);
  }
  const categoryRows = [...byCategory.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
  const statusRows = ["draft", "published", "archived"].map((label) => ({ label, count: byStatus.get(label) ?? 0 }));

  // --- Certificates ---
  const certByTier = new Map<string, number>();
  for (const c of certificates) certByTier.set(c.tier, (certByTier.get(c.tier) ?? 0) + 1);
  const certTierRows = [...certByTier.entries()].map(([label, count]) => ({ label, count }));

  const certDays = Array.from({ length: rangeDays }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (rangeDays - 1 - i));
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const count = certificates.filter((c) => {
      const t = new Date(c.issued_at).getTime();
      return t >= d.getTime() && t < next.getTime();
    }).length;
    return { label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), count };
  });

  // --- Credits ---
  const totalCreditsIssued = creditTx.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalCreditsSpent = creditTx.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netCredits = totalCreditsIssued - totalCreditsSpent;
  const byReason = new Map<string, number>();
  for (const t of creditTx) byReason.set(t.reason, (byReason.get(t.reason) ?? 0) + Math.abs(t.amount));
  const reasonRows = [...byReason.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count).slice(0, 8);

  // --- Mentors ---
  const sessionsByStatus = new Map<string, number>();
  for (const s of mentorSessions) sessionsByStatus.set(s.status, (sessionsByStatus.get(s.status) ?? 0) + 1);
  const sessionStatusRows = ["scheduled", "completed", "cancelled"].map((label) => ({ label, count: sessionsByStatus.get(label) ?? 0 }));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-brand">Analytics</h1>
        <p className="text-sm text-ink-muted">
          Deeper platform metrics across students, projects, certificates, credits, and mentors. All charts below are
          hand-rolled from live table data (no charting library is installed in this project).
        </p>
      </div>

      {/* Students */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Students</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-black/[0.08] bg-white p-4">
            <p className="text-xs text-ink-muted">Total</p>
            <p className="text-2xl font-semibold text-ink">{totalStudents}</p>
          </div>
          <div className="rounded-xl border border-black/[0.08] bg-white p-4">
            <p className="text-xs text-ink-muted">Active</p>
            <p className="text-2xl font-semibold text-ink">{activeCount}</p>
          </div>
          <div className="rounded-xl border border-black/[0.08] bg-white p-4">
            <p className="text-xs text-ink-muted">Suspended</p>
            <p className="text-2xl font-semibold text-ink">{suspendedCount}</p>
          </div>
        </div>
        <div className="rounded-xl border border-black/[0.08] bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-ink">Signups (last {rangeDays} days)</h3>
          <Bars data={signupDays} />
        </div>
      </section>

      {/* Projects */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Projects</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-black/[0.08] bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-ink">By category</h3>
            <ListBreakdown rows={categoryRows} />
          </div>
          <div className="rounded-xl border border-black/[0.08] bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-ink">By publish status</h3>
            <ListBreakdown rows={statusRows} />
          </div>
        </div>
      </section>

      {/* Certificates */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Certificates</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-black/[0.08] bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-ink">By tier</h3>
            <ListBreakdown rows={certTierRows} />
          </div>
          <div className="rounded-xl border border-black/[0.08] bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-ink">Issued over time (last {rangeDays} days)</h3>
            <Bars data={certDays} />
          </div>
        </div>
      </section>

      {/* Credits */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Credits</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-black/[0.08] bg-white p-4">
            <p className="text-xs text-ink-muted">Total issued</p>
            <p className="text-2xl font-semibold text-ink">{totalCreditsIssued.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-black/[0.08] bg-white p-4">
            <p className="text-xs text-ink-muted">Total spent</p>
            <p className="text-2xl font-semibold text-ink">{totalCreditsSpent.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-black/[0.08] bg-white p-4">
            <p className="text-xs text-ink-muted">Net balance across all users</p>
            <p className="text-2xl font-semibold text-ink">{netCredits.toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-xl border border-black/[0.08] bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-ink">Volume by reason (top 8)</h3>
          <ListBreakdown rows={reasonRows} />
        </div>
      </section>

      {/* Mentors */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Mentors</h2>
        <div className="rounded-xl border border-black/[0.08] bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-ink">Sessions by status</h3>
          <ListBreakdown rows={sessionStatusRows} />
        </div>
      </section>

      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
        Note: AI usage analytics is out of scope for this build — AI Studio was removed from the product per a prior
        decision, so no AI usage section is included here.
      </p>
    </div>
  );
}
