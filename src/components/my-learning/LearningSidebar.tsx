import { achievements, skillsCovered, weeklyActivity } from "@/lib/my-learning-data";
import {
  AwardIcon,
  FlagIcon,
  FlameIcon,
  GraduationIcon,
  LibraryIcon,
  StarIcon,
  TargetIcon,
  TrophyIcon,
  UsersIcon,
} from "@/components/dashboard/icons";

const achievementIcons = {
  trophy: TrophyIcon,
  flame: FlameIcon,
  star: StarIcon,
  library: LibraryIcon,
  users: UsersIcon,
  graduation: GraduationIcon,
};

export function LearningSidebar() {
  const maxMinutes = Math.max(...weeklyActivity.map((d) => d.minutes), 1);

  return (
    <aside className="flex w-[351px] shrink-0 flex-col gap-6">
      <div className="rounded-xl border border-black/[0.08] bg-white p-5">
        <div className="flex items-center gap-2">
          <TargetIcon className="size-4 text-brand" />
          <h3 className="text-sm font-semibold text-ink">Weekly Goal</h3>
        </div>
        <div className="mt-4 flex items-baseline gap-1.5">
          <span className="text-xl font-semibold text-ink">4h 20m</span>
          <span className="text-sm text-ink-muted">/ 6h</span>
        </div>
        <p className="mt-1 text-sm text-ink-muted">72% of weekly goal</p>
        <div className="mt-2 h-2 w-full rounded-full bg-black/[0.08]">
          <div className="h-2 w-[72%] rounded-full bg-brand" />
        </div>

        <div className="mt-6 flex items-end justify-between gap-2">
          {weeklyActivity.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[11px] text-ink-muted">{d.minutes > 0 ? `${d.minutes}m` : "0m"}</span>
              <div className="flex h-[70px] w-full items-end">
                <div
                  className="w-full rounded bg-brand/70"
                  style={{ height: `${(d.minutes / maxMinutes) * 100}%`, minHeight: d.minutes > 0 ? 4 : 1 }}
                />
              </div>
              <span className="text-[11px] text-ink-muted">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-black/[0.08] bg-white p-5">
        <div className="flex items-center gap-2">
          <FlagIcon className="size-4 text-brand" />
          <h3 className="text-sm font-semibold text-ink">Learning Streak</h3>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-3xl font-semibold text-ink">6</span>
          <span className="text-sm text-ink-muted">days</span>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className={`size-5 rounded ${i < 6 ? "bg-brand" : "bg-black/[0.08]"}`}
            />
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-muted">Build every day to keep your streak alive.</p>
      </div>

      <div className="rounded-xl border border-black/[0.08] bg-white p-5">
        <div className="flex items-center gap-2">
          <TrophyIcon className="size-4 text-brand" />
          <h3 className="text-sm font-semibold text-ink">Skills Covered</h3>
        </div>
        <div className="mt-4 flex flex-col gap-3.5">
          {skillsCovered.map((skill) => (
            <div key={skill.name}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink">{skill.name}</span>
                <span className="text-ink-muted">{skill.percent}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-black/[0.08]">
                <div className="h-1.5 rounded-full bg-brand" style={{ width: `${skill.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-black/[0.08] bg-white p-5">
        <div className="flex items-center gap-2">
          <AwardIcon className="size-4 text-brand" />
          <h3 className="text-sm font-semibold text-ink">Achievements</h3>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {achievements.map((achievement) => {
            const Icon = achievementIcons[achievement.icon];
            return (
              <div
                key={achievement.name}
                className={`flex flex-col items-center gap-2 rounded-lg p-2 text-center ${
                  achievement.unlocked ? achievement.iconBg : "bg-[#f2f1ee]"
                }`}
              >
                <span className={achievement.iconColor}>
                  <Icon className="size-5" />
                </span>
                <span className={`text-[11px] font-medium leading-tight ${achievement.unlocked ? "text-ink" : "text-ink-muted"}`}>
                  {achievement.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
