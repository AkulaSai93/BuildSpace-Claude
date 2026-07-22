"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useClickAway } from "@/hooks/useClickAway";
import {
  BellIcon,
  GraduationIcon,
  GridIcon,
  LibraryIcon,
  LogoIcon,
  SearchIcon,
} from "./icons";

function initialsFromEmail(email: string | null | undefined) {
  if (!email) return "?";
  const name = email.split("@")[0];
  return name.slice(0, 2).toUpperCase();
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: GridIcon },
  { label: "Library", href: "/library", icon: LibraryIcon },
  { label: "My Learning", href: "/my-learning", icon: GraduationIcon },
];

export function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  useClickAway(accountMenuRef, () => setAccountMenuOpen(false));

  const handleLogout = async () => {
    await logout();
    setAccountMenuOpen(false);
    router.push("/login");
  };

  return (
    <header className="w-full border-b border-black/[0.08] bg-white px-4 py-4 sm:px-8 lg:px-20">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-6 lg:gap-9">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-2xl bg-brand text-white">
                <LogoIcon className="size-4" />
              </span>
              <span className="text-sm font-semibold tracking-[-0.35px] text-ink">
                BuildSpace
              </span>
            </Link>

            <span className="hidden h-5 w-px bg-black/[0.08] md:block" />

            <nav className="hidden items-center gap-[26px] md:flex">
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

          <div className="hidden h-10 w-full max-w-[448px] flex-1 items-center gap-2 rounded-full border-[0.3px] border-white/30 bg-[#f2f1ee]/70 px-3 py-2 md:flex">
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
            aria-label="Search"
            className="flex items-center justify-center rounded-2xl p-2 text-ink-muted hover:bg-black/5 md:hidden"
          >
            <SearchIcon className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex items-center justify-center rounded-2xl p-2 text-ink-muted hover:bg-black/5"
          >
            <BellIcon className="size-4" />
            <span className="absolute right-1 top-1.5 size-1.5 rounded-full bg-brand" />
          </button>
          <div className="relative" ref={accountMenuRef}>
            <button
              type="button"
              aria-label="Account"
              onClick={() => setAccountMenuOpen((v) => !v)}
              className="flex size-8 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgb(6, 95, 70) 0%, rgb(0, 122, 85) 100%)",
              }}
            >
              {initialsFromEmail(user?.email)}
            </button>
            {accountMenuOpen && (
              <div className="absolute right-0 top-10 z-50 w-56 rounded-xl border border-black/[0.08] bg-white py-1.5 text-sm shadow-[0_16px_36px_-20px_rgba(0,0,0,0.25)]">
                <div className="border-b border-black/[0.06] px-3 py-2">
                  <p className="truncate text-xs text-ink-muted">Signed in as</p>
                  <p className="truncate font-semibold text-ink">{user?.email ?? "—"}</p>
                </div>
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setAccountMenuOpen(false)}
                    className="block w-full px-3 py-2 text-left text-ink hover:bg-black/[0.03]"
                  >
                    Admin panel
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-left text-ink hover:bg-black/[0.03]"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center justify-center rounded-2xl p-2 text-ink-muted hover:bg-black/5 md:hidden"
          >
            <span className="flex w-5 flex-col gap-1">
              <span className="h-0.5 w-full rounded bg-current" />
              <span className="h-0.5 w-full rounded bg-current" />
              <span className="h-0.5 w-full rounded bg-current" />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mt-4 flex flex-col gap-1 border-t border-black/[0.08] pt-4 md:hidden">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = href === "/dashboard" ? pathname === href : pathname?.startsWith(href);
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium ${
                  active ? "text-brand" : "text-ink-muted hover:text-ink"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
          <div className="mt-2 flex h-10 w-full items-center gap-2 rounded-full border-[0.3px] border-white/30 bg-[#f2f1ee]/70 px-3 py-2">
            <SearchIcon className="size-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Search projects, technologies, instructors..."
              className="w-full bg-transparent text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none"
            />
          </div>
        </div>
      )}
    </header>
  );
}
