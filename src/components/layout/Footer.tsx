import Link from "next/link";
import { LogoIcon } from "@/components/dashboard/icons";

const columns = [
  {
    title: "Product",
    links: ["Features", "AI Tools", "Projects", "Pricing", "Changelog"],
  },
  {
    title: "Solutions",
    links: ["For Students", "For Educators", "For Institutions", "For Bootcamps"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Guides", "Blog", "Tutorials", "Help Center"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Contact", "Affiliate Program"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-ink">
              <span className="flex size-7 items-center justify-center rounded-lg bg-brand text-white">
                <LogoIcon className="size-4" />
              </span>
              BuildSpace
            </Link>
            <p className="mt-3 max-w-xs text-sm text-ink-muted">
              The AI-powered platform for the next generation of software engineers.
            </p>
            <div className="mt-4 flex items-center gap-3 text-ink-muted">
              {["github", "discord", "twitter", "linkedin"].map((s) => (
                <span key={s} className="flex size-8 items-center justify-center rounded-full border border-black/[0.08] text-xs">
                  {s[0].toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-ink">{col.title}</p>
              <ul className="mt-3 flex flex-col gap-2.5 text-sm text-ink-muted">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="hover:text-ink">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-sm font-semibold text-ink">Newsletter</p>
            <p className="mt-3 text-sm text-ink-muted">Get the latest updates and resources in your inbox.</p>
            <div className="mt-3 flex items-center gap-2">
              <input
                placeholder="Enter your email"
                className="w-full min-w-0 rounded-full border border-black/[0.08] bg-[#faf9f7] px-3 py-2 text-xs text-ink outline-none placeholder:text-ink-muted/60"
              />
              <button
                type="button"
                className="flex shrink-0 items-center justify-center rounded-full bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand/90"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-black/[0.06] pt-6 text-xs text-ink-muted sm:flex-row">
          <span>© {new Date().getFullYear()} BuildSpace. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-ink">Privacy Policy</Link>
            <Link href="#" className="hover:text-ink">Terms of Service</Link>
            <Link href="#" className="hover:text-ink">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
