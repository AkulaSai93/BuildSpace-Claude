import Link from "next/link";
import { LogoIcon } from "@/components/dashboard/icons";

const navItems = [
  { label: "Features", href: "#features", chevron: true },
  { label: "Projects", href: "#projects", chevron: false },
  { label: "Solutions", href: "#solutions", chevron: true },
  { label: "Pricing", href: "#pricing", chevron: false },
  { label: "Resources", href: "#resources", chevron: true },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-ink">
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand text-white">
            <LogoIcon className="size-4" />
          </span>
          BuildSpace
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-muted md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="flex items-center gap-1 hover:text-ink">
              {item.label}
              {item.chevron && (
                <svg viewBox="0 0 10 6" className="size-2.5 fill-current text-ink-muted/70">
                  <path d="M0 0l5 6 5-6z" />
                </svg>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-ink hover:bg-black/[0.03] sm:inline-block"
          >
            Log In
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
          >
            Start Building
          </Link>
        </div>
      </div>
    </header>
  );
}
