import Link from "next/link";
import { ArrowRightIcon } from "@/components/dashboard/icons";
import { Reveal } from "@/components/marketing/Reveal";

export function CTABand() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <Reveal direction="scale" duration={800}>
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-brand px-8 py-8 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="font-serif text-xl font-medium text-white sm:text-2xl">
              Ready to build <span className="text-emerald-300">the future?</span>
            </h2>
            <p className="mt-1 text-sm text-white/80">Join thousands of students building, learning and growing together.</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand hover:bg-white/90"
            >
              Start Building for Free
              <ArrowRightIcon className="size-3.5" />
            </Link>
            <Link
              href="#projects"
              className="flex items-center gap-1.5 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Explore Projects
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
