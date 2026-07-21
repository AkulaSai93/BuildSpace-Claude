import type { DashboardStat } from "@/types/dashboard";

export function StatCard({ stat }: { stat: DashboardStat }) {
  return (
    <div className="flex w-[302px] items-center rounded-xl border border-black/[0.08] bg-white p-5">
      <div className="flex w-[85px] flex-col items-start gap-3">
        <span className={`flex size-8 items-center justify-center rounded-2xl ${stat.iconBg}`}>
          {stat.icon}
        </span>
        <div className="flex flex-col items-start gap-1.5">
          <p className="text-2xl font-semibold text-ink">{stat.value}</p>
          <p className="text-[11px] text-ink-muted">{stat.label}</p>
        </div>
      </div>
    </div>
  );
}
