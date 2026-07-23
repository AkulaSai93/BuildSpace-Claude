"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutGrid,
  Users,
  FolderKanban,
  GraduationCap,
  MessageSquare,
  ImageIcon,
  Bell,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Award,
  Coins,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutGrid },
  { label: "Users", href: "/admin/students", icon: Users },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Mentors", href: "/admin/mentors", icon: GraduationCap },
  { label: "Certificates", href: "/admin/certificates", icon: Award },
  { label: "Credits & XP", href: "/admin/credits", icon: Coins },
  { label: "Community", href: "/admin/community", icon: MessageSquare },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Reports", href: "/admin/reports", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const STORAGE_KEY = "buildspace-admin-sidebar-collapsed";

// Shared collapse state, persisted to localStorage and broadcast via a
// custom window event so the sidebar and the main content offset (rendered
// by AdminShell) stay in sync without needing React context/prop drilling
// across the server layout boundary.
export function useSidebarCollapsed() {
  const [collapsed, setCollapsedState] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "1") setCollapsedState(true);
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<boolean>).detail;
      setCollapsedState(detail);
    };
    window.addEventListener("buildspace-sidebar-toggle", handler as EventListener);
    return () => window.removeEventListener("buildspace-sidebar-toggle", handler as EventListener);
  }, []);

  const setCollapsed = (value: boolean) => {
    setCollapsedState(value);
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    window.dispatchEvent(new CustomEvent("buildspace-sidebar-toggle", { detail: value }));
  };

  return { collapsed, setCollapsed };
}

export function AdminSidebar({ email }: { email: string | null }) {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarCollapsed();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col overflow-y-auto border-r border-black/[0.08] bg-white transition-[width] duration-200 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className={`flex items-center gap-2 border-b border-black/[0.08] px-5 py-5 ${collapsed ? "justify-center px-0" : ""}`}>
        <span className="flex size-7 shrink-0 items-center justify-center rounded-2xl bg-brand text-white">
          <span className="text-xs font-bold">B</span>
        </span>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-[-0.35px] text-ink">BuildSpace</span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Studio</span>
          </div>
        )}
      </div>

      <nav className={`flex flex-1 flex-col gap-0.5 py-4 ${collapsed ? "items-center px-2" : "px-3"}`}>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname?.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-2.5 rounded-full text-sm font-medium transition-colors ${
                collapsed ? "size-10 justify-center px-0" : "px-3.5 py-2"
              } ${active ? "bg-brand-light text-brand" : "text-ink hover:bg-black/[0.03]"}`}
            >
              <Icon strokeWidth={1.75} className="size-4 shrink-0" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      <div className={`border-t border-black/[0.08] py-4 ${collapsed ? "flex flex-col items-center gap-3 px-2" : "px-4"}`}>
        {!collapsed && (
          <>
            <p className="truncate text-xs text-ink-muted">Signed in as</p>
            <p className="mb-3 truncate text-sm font-medium text-ink">{email ?? "—"}</p>
          </>
        )}
        <Link
          href="/dashboard"
          title={collapsed ? "Back to app" : undefined}
          className={`flex items-center gap-1.5 text-sm font-medium text-brand hover:underline ${collapsed ? "size-8 justify-center" : ""}`}
        >
          <ChevronLeft strokeWidth={1.75} className="size-4 shrink-0" />
          {!collapsed && "Back to app"}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`mt-3 flex items-center gap-1.5 rounded-full border border-black/10 text-xs font-semibold text-ink-muted hover:bg-black/[0.03] ${
            collapsed ? "size-8 justify-center" : "w-full justify-center px-3 py-1.5"
          }`}
        >
          {collapsed ? <ChevronsRight className="size-3.5" /> : <ChevronsLeft className="size-3.5" />}
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}
