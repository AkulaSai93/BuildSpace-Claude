import Link from "next/link";
import { LogoIcon } from "@/components/dashboard/icons";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="mesh-gradient relative flex min-h-screen w-full items-center justify-center px-4 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.09) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 65% 60% at 50% 35%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 60% at 50% 35%, black 30%, transparent 100%)",
        }}
      />

      <div className="relative w-full max-w-[400px]">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 text-sm font-semibold text-ink">
          <span className="flex size-8 items-center justify-center rounded-2xl bg-brand text-white">
            <LogoIcon className="size-4" />
          </span>
          BuildSpace
        </Link>

        <div className="rounded-2xl border border-black/[0.08] bg-white/90 p-8 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.18)] backdrop-blur">
          <h1 className="font-serif text-2xl font-medium tracking-tight text-ink">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>

          <div className="mt-6">{children}</div>
        </div>

        <p className="mt-6 text-center text-sm text-ink-muted">{footer}</p>
      </div>
    </div>
  );
}
