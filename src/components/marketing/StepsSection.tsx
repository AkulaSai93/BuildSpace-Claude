import { CheckBadgeIcon, GraduationIcon, LayersIcon, PackageIcon, ZapIcon } from "@/components/dashboard/icons";
import { Reveal } from "@/components/marketing/Reveal";

const steps = [
  { icon: PackageIcon, title: "Plan", desc: "Choose a path or project. AI helps you plan the roadmap." },
  { icon: GraduationIcon, title: "Learn", desc: "Learn concepts with interactive lessons and AI assistance." },
  { icon: LayersIcon, title: "Build", desc: "Build your project with our powerful in-browser workspace." },
  { icon: CheckBadgeIcon, title: "Review", desc: "Get AI code review and improve your code quality." },
  { icon: ZapIcon, title: "Ship", desc: "Deploy your project and showcase it to the world." },
];

export function StepsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 text-center">
      <Reveal direction="up">
        <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">From learning to shipping in 5 simple steps</h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-5">
        {steps.map((s, i) => (
          <Reveal key={s.title} direction="up" delay={100 + i * 110}>
            <div className="relative flex flex-col items-center">
              {i < steps.length - 1 && (
                <div className="absolute left-1/2 top-6 hidden h-px w-full bg-black/10 sm:block" />
              )}
              <span className="relative z-10 flex size-12 items-center justify-center rounded-full border border-black/[0.08] bg-[#f6fdf9] text-brand">
                <s.icon className="size-5" />
              </span>
              <p className="mt-3 text-sm font-semibold text-ink">{s.title}</p>
              <p className="mt-1 text-xs leading-snug text-ink-muted">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
