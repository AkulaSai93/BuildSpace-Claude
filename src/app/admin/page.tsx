import {
  Users,
  UserCheck,
  FolderKanban,
  FileEdit,
  PlayCircle,
  CheckCircle2,
  Award,
  Gem,
  GraduationCap,
} from "lucide-react";
import { listProfiles } from "@/lib/auth/profile";
import { listAuthUsers } from "@/lib/auth/adminUsers";
import { listProjects } from "@/lib/projectsData";
import { studioRest } from "@/lib/studio/db";
import { StatCard } from "@/components/dashboard/StatCard";
import type { DashboardStat } from "@/types/dashboard";
import type { Certificate, Mentor } from "@/types/studio";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function AdminDashboardPage() {
  const [profiles, authUsers, projects, certificates, mentors] = await Promise.all([
    listProfiles(),
    listAuthUsers(),
    listProjects(),
    studioRest<Certificate[]>("/certificates?select=*").catch(() => [] as Certificate[]),
    studioRest<Mentor[]>("/mentors?select=*").catch(() => [] as Mentor[]),
  ]);

  const totalStudents = authUsers.length;
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const activeToday = authUsers.filter((u) => u.last_sign_in_at && new Date(u.last_sign_in_at).getTime() > oneDayAgo).length;

  const published = projects.filter((p) => !p.publishStatus || p.publishStatus === "published").length;
  const drafts = projects.filter((p) => p.publishStatus === "draft").length;

  const eliteCerts = certificates.filter((c) => c.tier === "elite").length;
  const standardCerts = certificates.filter((c) => c.tier === "standard").length;
  const activeMentors = mentors.filter((m) => m.active).length;

  const stats: DashboardStat[] = [
    { id: "students", label: "Total Students", value: String(totalStudents), iconBg: "bg-brand-light text-brand", icon: <Users strokeWidth={1.75} className="size-4" /> },
    { id: "active-today", label: "Active Today", value: String(activeToday), iconBg: "bg-[#eff6ff] text-blue-600", icon: <UserCheck strokeWidth={1.75} className="size-4" /> },
    { id: "published", label: "Projects Published", value: String(published), iconBg: "bg-[#eef2ff] text-indigo-600", icon: <FolderKanban strokeWidth={1.75} className="size-4" /> },
    { id: "drafts", label: "Draft Projects", value: String(drafts), iconBg: "bg-[#fffbeb] text-amber-600", icon: <FileEdit strokeWidth={1.75} className="size-4" /> },
    { id: "started-today", label: "Projects Started Today", value: "—", iconBg: "bg-[#f5f3ff] text-violet-600", icon: <PlayCircle strokeWidth={1.75} className="size-4" /> },
    { id: "completed-today", label: "Projects Completed Today", value: "—", iconBg: "bg-emerald-50 text-emerald-600", icon: <CheckCircle2 strokeWidth={1.75} className="size-4" /> },
    { id: "certificates", label: "Certificates Issued", value: String(certificates.length), iconBg: "bg-amber-50 text-amber-600", icon: <Award strokeWidth={1.75} className="size-4" /> },
    { id: "elite-certs", label: "Elite Certificates", value: String(eliteCerts), iconBg: "bg-purple-50 text-purple-600", icon: <Gem strokeWidth={1.75} className="size-4" /> },
    { id: "standard-certs", label: "Standard Certificates", value: String(standardCerts), iconBg: "bg-sky-50 text-sky-600", icon: <Award strokeWidth={1.75} className="size-4" /> },
    { id: "mentors", label: "Active Mentors", value: String(activeMentors), iconBg: "bg-teal-50 text-teal-600", icon: <GraduationCap strokeWidth={1.75} className="size-4" /> },
  ];

  const recentSignups = [...authUsers]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const recentProjects = [...projects].reverse().slice(0, 5);

  const recentCertificates = [...certificates]
    .sort((a, b) => new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime())
    .slice(0, 5);

  const mostPopular = [...projects].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);

  // Signups over the last 7 days — a lightweight bar visualization built
  // from real data without pulling in a charting library.
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const count = authUsers.filter((u) => {
      const t = new Date(u.created_at).getTime();
      return t >= d.getTime() && t < next.getTime();
    }).length;
    return { label: d.toLocaleDateString("en-US", { weekday: "short" }), count };
  });
  const maxDay = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-ink">Dashboard</h1>
        <p className="text-sm text-ink-muted">Platform health across students, projects, certificates, and mentors.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>
      <p className="-mt-6 text-xs text-ink-muted">
        &ldquo;Projects Started/Completed Today&rdquo; need an analytics events log to populate — shown as &ldquo;—&rdquo; until that&apos;s wired up (see Analytics module).
      </p>

      <div className="rounded-xl border border-black/[0.08] bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink">Student Growth (last 7 days)</h2>
        <div className="flex h-32 items-end gap-3">
          {days.map((d) => (
            <div key={d.label} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className="w-full rounded-t-md bg-brand/80"
                style={{ height: `${Math.max(4, (d.count / maxDay) * 100)}%` }}
                title={`${d.count} signups`}
              />
              <span className="text-[10px] text-ink-muted">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-black/[0.08] bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Recent signups</h2>
          <ul className="flex flex-col gap-3">
            {recentSignups.map((u) => (
              <li key={u.id} className="flex items-center justify-between text-sm">
                <span className="truncate font-medium text-ink">{u.email ?? "—"}</span>
                <span className="shrink-0 text-ink-muted">{formatDate(u.created_at)}</span>
              </li>
            ))}
            {recentSignups.length === 0 && <li className="text-sm text-ink-muted">No students yet.</li>}
          </ul>
        </div>

        <div className="rounded-xl border border-black/[0.08] bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Recently added projects</h2>
          <ul className="flex flex-col gap-3">
            {recentProjects.map((p) => (
              <li key={p.slug} className="flex items-center justify-between text-sm">
                <span className="truncate font-medium text-ink">{p.title}</span>
                <span className="shrink-0 rounded-full bg-black/[0.04] px-2 py-0.5 text-xs text-ink-muted">{p.category}</span>
              </li>
            ))}
            {recentProjects.length === 0 && <li className="text-sm text-ink-muted">No projects yet.</li>}
          </ul>
        </div>

        <div className="rounded-xl border border-black/[0.08] bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Recent certificates</h2>
          <ul className="flex flex-col gap-3">
            {recentCertificates.map((c) => (
              <li key={c.id} className="flex items-center justify-between text-sm">
                <span className="truncate font-medium text-ink">{c.project_slug}</span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    c.tier === "elite" ? "bg-purple-50 text-purple-600" : "bg-sky-50 text-sky-600"
                  }`}
                >
                  {c.tier}
                </span>
              </li>
            ))}
            {recentCertificates.length === 0 && <li className="text-sm text-ink-muted">No certificates issued yet.</li>}
          </ul>
        </div>

        <div className="rounded-xl border border-black/[0.08] bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Most popular projects</h2>
          <ul className="flex flex-col gap-3">
            {mostPopular.map((p) => (
              <li key={p.slug} className="flex items-center justify-between text-sm">
                <span className="truncate font-medium text-ink">{p.title}</span>
                <span className="shrink-0 text-ink-muted">{p.reviewCount.toLocaleString()} reviews</span>
              </li>
            ))}
            {mostPopular.length === 0 && <li className="text-sm text-ink-muted">No projects yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
