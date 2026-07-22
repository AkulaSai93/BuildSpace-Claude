import { Reveal } from "@/components/marketing/Reveal";

const logos = ["Google", "Microsoft", "Amazon", "Swiggy", "Stripe", "NVIDIA", "DigitalOcean"];

export function LogoStrip() {
  return (
    <section className="border-y border-black/[0.06] bg-white py-12">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs font-medium text-ink-muted">Trusted by learners and educators from</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {logos.map((name, i) => (
            <Reveal key={name} direction="up" delay={i * 60} duration={500}>
              <span className="text-lg font-semibold tracking-tight text-ink/40 grayscale">{name}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
