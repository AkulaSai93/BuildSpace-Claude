"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin/community/discussions", label: "Discussions" },
  { href: "/admin/community/reviews", label: "Reviews" },
  { href: "/admin/community/reports", label: "Reports" },
];

export default function CommunityTabs() {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-2 border-b border-black/[0.08] pb-3">
      {tabs.map((t) => {
        const active = pathname?.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              active ? "bg-brand text-white" : "border border-black/10 text-ink hover:bg-black/[0.03]"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
