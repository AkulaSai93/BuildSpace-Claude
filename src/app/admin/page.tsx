import { Users, ShieldCheck, FolderKanban, Ban } from "lucide-react";
import { listProfiles } from "@/lib/auth/profile";
import { listAuthUsers } from "@/lib/auth/adminUsers";
import { listProjects } from "@/lib/projectsData";
import { StatCard } from "@/components/dashboard/StatCard";
import type { DashboardStat } from "@/types/dashboard";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function AdminDashboardPage() {
  const [profiles, authUsers, projects] = await Promise.all([
    listProfiles(),
    listAuthUsers(),
    listProjects(),
  ]);

  const totalUsers = authUsers.length;
  const totalProjects = projects.length;
  const adminCount = profiles.filter((p) => p.role === "admin").length;
  const bannedCount = authUsers.filter((u) => {
    if (!u.banned_until) return false;
    return new Date(u.banned_until).getTime() > Date.now();
  }).length;

  const stats: DashboardStat[] = [
    {
      id: "users",
      label: "Total Users",
      value: String(totalUsers),
      iconBg: "bg-brand-light text-brand",
      icon: <Users strokeWidth={1.75} className="size-4" />,
    },
    {
      id: "projects",
      label: "Total Projects",
      value: String(totalProjects),
      iconBg: "bg-[#eef2ff] text-indigo-600",
      icon: <FolderKanban strokeWidth={1.75} className="size-4" />,
    },
    {
      id: "admins",
      label: "Admins",
      value: String(adminCount),
      iconBg: "bg-[#fef3c7] text-amber-600",
      icon: <ShieldCheck strokeWidth={1.75} className="size-4" />,
    },
    {
      id: "banned",
      label: "Banned Users",
      value: String(bannedCount),
      iconBg: "bg-red-50 text-red-600",
      icon: <Ban strokeWidth={1.75} className="size-4" />,
    },
  ];

  const recentSignups = [...authUsers]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // listProjects() returns rows ordered by created_at.asc but doesn't expose
  // the timestamp itself (ProjectSummary has no created_at/updated_at field),
  // so "recently added" here is approximated by reversing that DB order
  // rather than sorting on an actual date.
  const recentProjects = [...projects].reverse().slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-ink">Dashboard</h1>
        <p className="text-sm text-ink-muted">Overview of users and projects across BuildSpace.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
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
            {recentSignups.length === 0 && <li className="text-sm text-ink-muted">No users yet.</li>}
          </ul>
        </div>

        <div className="rounded-xl border border-black/[0.08] bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Recently added projects</h2>
          <ul className="flex flex-col gap-3">
            {recentProjects.map((p) => (
              <li key={p.slug} className="flex items-center justify-between text-sm">
                <span className="truncate font-medium text-ink">{p.title}</span>
                <span className="shrink-0 rounded-full bg-black/[0.04] px-2 py-0.5 text-xs text-ink-muted">
                  {p.category}
                </span>
              </li>
            ))}
            {recentProjects.length === 0 && <li className="text-sm text-ink-muted">No projects yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
