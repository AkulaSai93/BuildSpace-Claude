import { ClockIcon, GraduationIcon, LayersIcon, UsersIcon } from "@/components/dashboard/icons";
import { Reveal } from "@/components/marketing/Reveal";

const stats = [
  { icon: UsersIcon, value: "10K+", label: "Active Learners" },
  { icon: LayersIcon, value: "500+", label: "Projects Built" },
  { icon: GraduationIcon, value: "50K+", label: "Hours of Learning" },
  { icon: ClockIcon, value: "95%", label: "Satisfaction Rate" },
];

export function StatsBar() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-black/[0.08] bg-white p-6 sm:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} direction="up" delay={i * 90}>
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f2f1ee] text-ink-muted">
                <s.icon className="size-4" />
              </span>
              <div>
                <p className="text-lg font-bold text-ink">{s.value}</p>
                <p className="text-xs text-ink-muted">{s.label}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
