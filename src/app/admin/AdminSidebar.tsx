"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, FolderKanban, ChevronLeft } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutGrid },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
];

export function AdminSidebar({ email }: { email: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-black/[0.08] bg-white">
      <div className="flex items-center gap-2 border-b border-black/[0.08] px-5 py-5">
        <span className="flex size-7 items-center justify-center rounded-2xl bg-brand text-white">
          <span className="text-xs font-bold">B</span>
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-[-0.35px] text-ink">BuildSpace</span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Admin</span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname?.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-2.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                active ? "bg-brand-light text-brand" : "text-ink hover:bg-black/[0.03]"
              }`}
            >
              <Icon strokeWidth={1.75} className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-black/[0.08] px-4 py-4">
        <p className="truncate text-xs text-ink-muted">Signed in as</p>
        <p className="mb-3 truncate text-sm font-medium text-ink">{email ?? "—"}</p>
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
        >
          <ChevronLeft strokeWidth={1.75} className="size-4" />
          Back to app
        </Link>
      </div>
    </aside>
  );
}
