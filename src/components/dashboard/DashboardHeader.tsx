"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellIcon,
  GraduationIcon,
  GridIcon,
  LibraryIcon,
  LogoIcon,
  SearchIcon,
} from "./icons";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: GridIcon },
  { label: "Library", href: "/library", icon: LibraryIcon },
  { label: "My Learning", href: "/my-learning", icon: GraduationIcon },
];

export function DashboardHeader() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-black/[0.08] bg-white px-20 py-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-9">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-2xl bg-brand text-white">
                <LogoIcon className="size-4" />
              </span>
              <span className="text-sm font-semibold tracking-[-0.35px] text-ink">
                BuildSpace
              </span>
            </Link>

            <span className="h-5 w-px bg-black/[0.08]" />

            <nav className="flex items-center gap-[26px]">
              {navItems.map(({ label, href, icon: Icon }) => {
                const active = href === "/dashboard" ? pathname === href : pathname?.startsWith(href);
                return (
                  <Link
                    key={label}
                    href={href}
                    className={`flex items-center gap-1.5 text-sm font-medium ${
                      active ? "text-brand" : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    <Icon className="size-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex h-10 w-[448px] items-center gap-2 rounded-full border-[0.3px] border-white/30 bg-[#f2f1ee]/70 px-3 py-2">
            <SearchIcon className="size-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Search projects, technologies, instructors..."
              className="w-full bg-transparent text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex items-center justify-center rounded-2xl p-2 text-ink-muted hover:bg-black/5"
          >
            <BellIcon className="size-4" />
            <span className="absolute right-1 top-1.5 size-1.5 rounded-full bg-brand" />
          </button>
          <button
            type="button"
            aria-label="Account"
            className="flex size-8 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgb(6, 95, 70) 0%, rgb(0, 122, 85) 100%)",
            }}
          >
            JD
          </button>
        </div>
      </div>
    </header>
  );
}
