"use client";

import { AdminSidebar, useSidebarCollapsed } from "./AdminSidebar";

// Client wrapper so the main content's left offset can react to the
// sidebar's collapse state (shared via useSidebarCollapsed), without having
// to lift state up through the server layout.
export function AdminShell({ email, children }: { email: string | null; children: React.ReactNode }) {
  const { collapsed } = useSidebarCollapsed();

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <AdminSidebar email={email} />
      <main className={`min-h-screen transition-[padding] duration-200 ${collapsed ? "pl-16" : "pl-60"}`}>
        <div className="w-full px-4 py-8 sm:px-8 lg:px-12">{children}</div>
      </main>
    </div>
  );
}
