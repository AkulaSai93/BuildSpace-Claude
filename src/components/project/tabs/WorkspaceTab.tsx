"use client";

import { useMemo, useState } from "react";
import {
  ArrowRightIcon,
  BranchIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  CpuIcon,
  EditIcon,
  GithubIcon,
  GlobeIcon,
  LayersIcon,
  LightbulbIcon,
  ListIcon,
  LockIcon,
  LibraryIcon,
  MonitorIcon,
  PackageIcon,
  RefreshIcon,
  SendIcon,
  ShieldIcon,
  SparklesIcon,
} from "@/components/dashboard/icons";

const scoreIconMap: Record<string, { icon: typeof LayersIcon; color: string }> = {
  Architecture: { icon: LayersIcon, color: "text-sky-500" },
  Security: { icon: ShieldIcon, color: "text-red-500" },
  Scalability: { icon: MonitorIcon, color: "text-purple-500" },
  Performance: { icon: CpuIcon, color: "text-amber-500" },
  Maintainability: { icon: CheckBadgeIcon, color: "text-emerald-500" },
};

function ScoreIcon({ label }: { label: string }) {
  const entry = scoreIconMap[label];
  if (!entry) return null;
  const Icon = entry.icon;
  return <Icon className={`size-3 shrink-0 ${entry.color}`} />;
}

const chipColorMap: Record<string, string> = {
  Architecture: "bg-sky-50 text-sky-700",
  Security: "bg-red-50 text-red-700",
  Scalability: "bg-purple-50 text-purple-700",
  Performance: "bg-amber-50 text-amber-700",
  Maintainability: "bg-emerald-50 text-emerald-700",
};
import { getWorkspaceData, mentorTips, workflowSteps, type WorkflowStep } from "@/lib/workspace-data";

const stepOrder: WorkflowStep[] = [...workflowSteps];
type Screen = "Overview" | WorkflowStep;

function scoreColor(v: number) {
  if (v >= 80) return "bg-emerald-500";
  if (v >= 60) return "bg-amber-500";
  return "bg-red-500";
}

const journeySteps = [
  { key: "Learning Hub", title: "Learning Hub", desc: "Understand the problem and architecture", tag: "Completed" },
  { key: "Engineering Plan", title: "Engineering Plan", desc: "Think before you build", tag: "Up Next" },
  { key: "AI Review", title: "AI Review", desc: "Get feedback from an AI senior engineer", tag: "" },
  { key: "Build", title: "Build", desc: "Implement your solution", tag: "" },
  { key: "GitHub Engineering", title: "GitHub Engineering", desc: "Track your progress and activity", tag: "" },
  { key: "Submit Project", title: "Submit Project", desc: "Ship and get graded", tag: "" },
];

export function WorkspaceTab({
  unlocked,
  slug,
  onProjectSubmitted,
  onViewPhase2Videos,
  resumeAsSubmitted = false,
}: {
  unlocked: boolean;
  slug: string;
  onProjectSubmitted?: () => void;
  onViewPhase2Videos?: () => void;
  // When true, this instance is opened after the project has already been
  // submitted (e.g. revisiting the "Workspace" tab post-submission). Seeds
  // every step as already complete so the returning-user Overview shows
  // instead of resetting back to the very first onboarding screen.
  resumeAsSubmitted?: boolean;
}) {
  const data = useMemo(() => getWorkspaceData(slug), [slug]);
  const [screen, setScreen] = useState<Screen>("Overview");
  const [hasStarted, setHasStarted] = useState(resumeAsSubmitted);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [reviewMode, setReviewMode] = useState<"side" | "detailed">("side");
  const [buildTasks, setBuildTasks] = useState(data.buildTasks);
  const [deployUrl, setDeployUrl] = useState("");
  const [finalSubmitted, setFinalSubmitted] = useState(resumeAsSubmitted);
  const [openCommitDay, setOpenCommitDay] = useState<string | null>(null);
  const [showCriteria, setShowCriteria] = useState(false);
  const [showReferences, setShowReferences] = useState(false);
  const [chartRange, setChartRange] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [githubDone, setGithubDone] = useState(resumeAsSubmitted);
  const [engineeringPlanLocked, setEngineeringPlanLocked] = useState(resumeAsSubmitted);
  const [buildLocked, setBuildLocked] = useState(resumeAsSubmitted);

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-black/[0.08] bg-white px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-[#f2f1ee] text-ink-muted">
          <LockIcon className="size-5" />
        </span>
        <p className="text-sm font-semibold text-ink">Complete the Learning Hub to unlock</p>
        <p className="max-w-sm text-sm text-ink-muted">
          Finish every required Learning Hub section, then hit &quot;Continue to Workspace&quot; to start
          your Engineering Plan.
        </p>
      </div>
    );
  }

  const question = data.questions[qIndex];
  const review = data.reviews[question.id] ?? data.reviews.q1;
  const answeredCount = Object.values(submitted).filter(Boolean).length;
  const overallProgress = 42;
  const doneCount = buildTasks.filter((t) => t.done).length;

  const engineeringPlanDone = answeredCount === data.questions.length;
  const buildDone = doneCount === buildTasks.length;
  // Once a step has genuinely been passed, it stays marked complete even if the
  // user later edits an answer or unchecks a build task — otherwise the wizard
  // flips a later step back to "incomplete" while a step further along the
  // journey (which the user has already moved past) still shows as done.
  const engineeringPlanCompleted = engineeringPlanLocked || engineeringPlanDone;
  const buildCompleted = buildLocked || buildDone;
  const stepDone: Record<WorkflowStep, boolean> = {
    "Engineering Plan": engineeringPlanCompleted,
    "AI Review": engineeringPlanCompleted,
    Build: buildCompleted,
    "GitHub Engineering": githubDone,
    "Submit Project": finalSubmitted,
  };
  const isStepUnlocked = (s: WorkflowStep) => {
    if (stepDone[s]) return true;
    if (s === "Engineering Plan") return true;
    if (s === "AI Review") return answeredCount > 0;
    if (s === "Build") return engineeringPlanCompleted;
    if (s === "GitHub Engineering") return buildCompleted;
    if (s === "Submit Project") return githubDone;
    return false;
  };

  // Real submission-readiness state, used to drive the Submit Project progress
  // ring and check counts instead of hardcoded numbers.
  const requiredChecks = [
    { label: "Engineering Plan Submitted", passed: engineeringPlanCompleted },
    { label: "AI Review Completed", passed: engineeringPlanCompleted },
    { label: "Build Complete", passed: buildCompleted },
    { label: "GitHub Repo Connected", passed: githubDone },
    { label: "Deploy URL Set", passed: !!deployUrl.trim() },
  ];
  const requiredPassed = requiredChecks.filter((c) => c.passed).length;
  const recommendedTotal = 4;
  const recommendedPassed = Math.min(recommendedTotal, requiredPassed >= 3 ? 2 : requiredPassed >= 1 ? 1 : 0);
  const totalChecks = requiredChecks.length + recommendedTotal;
  const totalPassed = requiredPassed + recommendedPassed;
  const readinessPercent = Math.round((totalPassed / totalChecks) * 100);
  const canSubmitProject = requiredPassed === requiredChecks.length;

  const goToStep = (s: Screen) => setScreen(s);

  const startEngineeringPlan = () => {
    setHasStarted(true);
    setScreen("Engineering Plan");
  };

  const submitForReview = () => {
    setSubmitted((prev) => ({ ...prev, [question.id]: true }));
  };

  const continueToBuild = () => {
    if (qIndex < data.questions.length - 1) {
      setQIndex((i) => i + 1);
      setScreen("Engineering Plan");
    } else {
      setEngineeringPlanLocked(true);
      setScreen("Build");
    }
  };

  const toggleTask = (label: string) => {
    setBuildTasks((prev) =>
      prev.map((t) => (t.label === label ? { ...t, done: !t.done, current: false } : t))
    );
  };

  const openCommitCount = openCommitDay ? data.github.commits.find((c) => c.date === openCommitDay)?.count ?? 0 : 0;
  const commitPopupData =
    openCommitDay &&
    (data.commitDetails[openCommitDay] ?? [
      { message: `${openCommitCount} commits recorded on ${openCommitDay}`, hash: "—", added: openCommitCount * 12, deleted: Math.round(openCommitCount * 1.5) },
    ]);

  return (
    <div className="relative flex w-full">
      {/* Left rail */}
      <aside className="flex w-[240px] shrink-0 flex-col gap-4 border-r border-black/[0.06] bg-white p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Engineering Workspace</p>
          <p className="mt-1 text-xs text-ink-muted">{data.milestone.sprint}</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-black/[0.08]">
            <div className="h-1.5 rounded-full bg-brand" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
        <nav className="flex flex-col gap-0.5 text-sm">
          <button
            type="button"
            onClick={() => setScreen("Overview")}
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left ${
              screen === "Overview" ? "bg-[#ecfdf5] font-semibold text-brand" : "text-ink hover:bg-black/[0.02]"
            }`}
          >
            {hasStarted ? (
              <CheckCircleIcon className="size-4 shrink-0 text-brand" />
            ) : (
              <span className="flex size-4 shrink-0 items-center justify-center text-xs">1</span>
            )}
            Overview
          </button>
          {stepOrder.map((s, i) => {
            const isActive = s === screen;
            const isDone = hasStarted && stepDone[s];
            const isLocked = !hasStarted;
            const isReachable = isDone || isActive || isStepUnlocked(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => !isLocked && isReachable && goToStep(s)}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left ${
                  isActive
                    ? "bg-[#ecfdf5] font-semibold text-brand"
                    : isDone || isReachable
                      ? "text-ink hover:bg-black/[0.02]"
                      : "text-ink-muted/50"
                }`}
              >
                {isDone ? (
                  <CheckCircleIcon className="size-4 shrink-0 text-brand" />
                ) : (
                  <span className="flex size-4 shrink-0 items-center justify-center text-xs">{i + 2}</span>
                )}
                {s}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Center content */}
      <div className="min-w-0 flex-1 p-6">
        {(screen !== "Overview" || hasStarted) && (
          <div className="mb-6 flex items-center">
            {stepOrder.map((s, i) => {
              const isDone = stepDone[s];
              const isActive = screen === "Overview" ? i === 0 : s === screen;
              const isLocked = !isDone && !isActive && !isStepUnlocked(s);
              return (
                <div key={s} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                        isDone || isActive ? "bg-brand text-white" : "bg-[#f2f1ee] text-ink-muted"
                      }`}
                    >
                      {isDone ? "✓" : isLocked ? <LockIcon className="size-3" /> : i + 1}
                    </span>
                    <span className="whitespace-nowrap text-[11px] text-ink-muted">{s}</span>
                  </div>
                  {i < stepOrder.length - 1 && (
                    <div className={`mx-1.5 h-px flex-1 ${isDone ? "bg-brand" : "bg-black/10"}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {screen === "Overview" && !hasStarted && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-semibold text-ink">Welcome to your Engineering Workspace</h2>
              <p className="mt-1 text-sm text-ink-muted">
                This is where you think like a software engineer before writing code. Not a tutorial — a real
                engineering environment.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-black/[0.08] bg-white p-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#f2f1ee] text-ink">
                {"</>"}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">E-Commerce Platform with Next.js 14, Stripe & PostgreSQL</p>
              </div>
              <div className="flex items-center gap-6 text-xs">
                <div>
                  <p className="text-ink-muted">DIFFICULTY</p>
                  <p className="font-semibold text-ink">Intermediate</p>
                </div>
                <div>
                  <p className="text-ink-muted">DURATION</p>
                  <p className="font-semibold text-ink">42h 30m</p>
                </div>
                <div>
                  <p className="text-ink-muted">SPRINT</p>
                  <p className="font-semibold text-ink">{data.milestone.sprint.split("·")[0].trim()} of 3</p>
                </div>
                <div>
                  <p className="text-ink-muted">EST. COMPLETION</p>
                  <p className="font-semibold text-ink">{data.milestone.estCompletion}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">Your Engineering Journey</h3>
              <div className="flex flex-col gap-2">
                {journeySteps.map((j) => {
                  const isCompleted = j.key === "Learning Hub";
                  const isNext = j.key === "Engineering Plan";
                  return (
                    <div
                      key={j.key}
                      className={`flex items-center gap-3 rounded-lg border p-3 ${
                        isCompleted ? "border-black/[0.08] bg-[#f6fdf9]" : isNext ? "border-black/10 bg-white" : "border-black/[0.06] bg-white opacity-60"
                      }`}
                    >
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                          isCompleted ? "bg-brand text-white" : isNext ? "bg-[#ecfdf5] text-brand" : "bg-[#f2f1ee] text-ink-muted"
                        }`}
                      >
                        {isCompleted ? <CheckCircleIcon className="size-4" /> : isNext ? <GlobeIcon className="size-4" /> : <LockIcon className="size-3.5" />}
                      </span>
                      <div className="flex-1">
                        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                          {j.title}
                          {j.tag && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-[#f2f1ee] text-ink-muted"
                              }`}
                            >
                              {j.tag}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-ink-muted">{j.desc}</p>
                      </div>
                      {!isCompleted && !isNext && <LockIcon className="size-3.5 text-ink-muted/60" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-black/[0.08] bg-white p-4 text-center">
                <span className="mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-[#f2f1ee] text-ink-muted">
                  <GlobeIcon className="size-4" />
                </span>
                <p className="text-sm font-semibold text-ink">Think First</p>
                <p className="mt-1 text-xs text-ink-muted">Plan your architecture before writing a single line of code.</p>
              </div>
              <div className="rounded-xl border border-black/[0.08] bg-white p-4 text-center">
                <span className="mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-[#f2f1ee] text-purple-600">
                  <SparklesIcon className="size-4" />
                </span>
                <p className="text-sm font-semibold text-ink">AI Feedback</p>
                <p className="mt-1 text-xs text-ink-muted">A senior engineer AI reviews every engineering decision you make.</p>
              </div>
              <div className="rounded-xl border border-black/[0.08] bg-white p-4 text-center">
                <span className="mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-[#f2f1ee] text-ink-muted">
                  <BranchIcon className="size-4" />
                </span>
                <p className="text-sm font-semibold text-ink">Ship Real Code</p>
                <p className="mt-1 text-xs text-ink-muted">Build against a real GitHub repo with CI/CD, PRs, and deployments.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={startEngineeringPlan}
              className="flex items-center justify-center gap-2 rounded-2xl bg-brand py-3 text-sm font-semibold text-white hover:bg-brand/90"
            >
              <GlobeIcon className="size-4" />
              Start Engineering Plan
              <ArrowRightIcon className="size-3.5" />
            </button>
            <p className="text-center text-xs text-ink-muted">This onboarding screen appears only once.</p>
          </div>
        )}

        {screen === "Overview" && hasStarted && (
          <div className="flex flex-col gap-5">
            {finalSubmitted && (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <CheckCircleIcon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-emerald-800">🎉 Phase 2 Unlocked</p>
                  <p className="text-xs text-emerald-700">
                    Milestone 3 submitted and approved. The full Overview, Tech Stack, and Resources course view is
                    now unlocked, and the Pro Solution walkthroughs for this milestone are available too.
                  </p>
                </div>
                {onViewPhase2Videos && (
                  <button
                    type="button"
                    onClick={onViewPhase2Videos}
                    className="shrink-0 rounded-2xl bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand/90"
                  >
                    Watch Videos
                  </button>
                )}
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-ink">Welcome back, {data.userName}! 👋</h2>
              <p className="mt-1 text-sm text-ink-muted">Continue building your E-Commerce Platform with Next.js.</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-black/[0.08] bg-white p-3">
                <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                  <BranchIcon className="size-3" /> Current Sprint
                </p>
                <p className="text-sm font-semibold text-ink">{data.returningStats.currentSprint}</p>
                <div className="mt-1.5 h-1 w-full rounded-full bg-black/[0.08]">
                  <div className="h-1 rounded-full bg-brand" style={{ width: "60%" }} />
                </div>
              </div>
              <div className="rounded-lg border border-black/[0.08] bg-white p-3">
                <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                  <SparklesIcon className="size-3" /> Current Milestone
                </p>
                <p className="whitespace-pre-line text-sm font-semibold text-ink">{data.returningStats.currentMilestone}</p>
              </div>
              <div className="rounded-lg border border-black/[0.08] bg-white p-3">
                <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                  <CheckCircleIcon className="size-3" /> Tasks Completed
                </p>
                <p className="text-sm font-semibold text-ink">{data.returningStats.tasksCompleted}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-black/[0.08] bg-white p-4">
              <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#1a1410]">
                <span className="text-2xl">🪜</span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="mb-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">In Progress</span>
                <p className="text-sm font-semibold text-ink">{data.milestone.taskLabel}</p>
                <p className="text-xs text-ink-muted">Build RESTful APIs for cart management, product catalog, and inventory validation.</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-black/[0.08]">
                    <div className="h-1.5 rounded-full bg-brand" style={{ width: `${data.milestone.progress + 30}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-ink">{data.milestone.progress + 30}%</span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setScreen("Engineering Plan")}
                  className="rounded-2xl bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand/90"
                >
                  Continue Building →
                </button>
                <button type="button" className="rounded-2xl border border-black/[0.08] px-4 py-2 text-xs font-semibold text-ink hover:bg-black/[0.02]">
                  Open Workspace
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-black/[0.08] bg-white p-4">
                <p className="mb-3 text-sm font-semibold text-ink">Build Progress</p>
                <div className="flex items-center gap-4">
                  <div
                    className="flex size-20 shrink-0 items-center justify-center rounded-full text-sm font-bold text-ink"
                    style={{ background: "conic-gradient(#065f46 126deg, #e7e5e0 126deg)" }}
                  >
                    <span className="flex size-14 flex-col items-center justify-center rounded-full bg-white text-center text-xs">
                      35%<span className="text-[9px] font-normal text-ink-muted">OVERALL</span>
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-1 text-xs">
                    {data.buildBreakdown.map((b) => (
                      <div key={b.label} className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-ink-muted">
                          <span className="size-1.5 rounded-full" style={{ background: b.color }} />
                          {b.label}
                        </span>
                        <span className="font-semibold text-ink">{b.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button type="button" className="mt-3 w-full rounded-2xl border border-black/[0.08] py-2 text-xs font-semibold text-ink hover:bg-black/[0.02]">
                  View Full Progress →
                </button>
              </div>

              <div className="rounded-xl border border-black/[0.08] bg-white p-4">
                <p className="mb-3 text-sm font-semibold text-ink">Validation Center</p>
                <div className="flex flex-col gap-2">
                  {data.validationChecks.map((v) => (
                    <div key={v.label} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-ink">
                        {v.status === "Passed" && <CheckCircleIcon className="size-3.5 text-emerald-500" />}
                        {v.status === "Failed" && <span className="text-red-500">✕</span>}
                        {v.status === "Pending" && <ClockIcon className="size-3.5 text-amber-500" />}
                        {v.label}
                      </span>
                      <span className={`font-semibold ${v.status === "Passed" ? "text-emerald-600" : v.status === "Failed" ? "text-red-500" : "text-amber-600"}`}>
                        {v.status}
                      </span>
                    </div>
                  ))}
                </div>
                <button type="button" className="mt-3 w-full rounded-2xl border border-black/[0.08] py-2 text-xs font-semibold text-ink hover:bg-black/[0.02]">
                  View All Validations →
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-black/[0.08] bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">GitHub Snapshot</p>
                <button type="button" onClick={() => setScreen("GitHub Engineering")} className="text-xs font-medium text-brand">
                  View on GitHub
                </button>
              </div>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between"><span className="text-ink-muted">Repository</span><span className="font-semibold text-ink">{data.repo.name}</span></div>
                <div className="flex justify-between"><span className="text-ink-muted">Current Branch</span><span className="font-semibold text-ink">{data.branch.current}</span></div>
                <div className="flex justify-between"><span className="text-ink-muted">Last Commit</span><span className="font-semibold text-ink">feat: add cart API endpoints</span></div>
                <div className="flex justify-between"><span className="text-ink-muted">Latest Commit</span><span className="font-semibold text-ink">{data.branch.lastCommit}</span></div>
                <div className="flex justify-between"><span className="text-ink-muted">Today&apos;s Commits</span><span className="font-semibold text-ink">8 commits</span></div>
              </div>
              <button
                type="button"
                onClick={() => setScreen("GitHub Engineering")}
                className="mt-3 w-full rounded-2xl border border-black/[0.08] py-2 text-xs font-semibold text-ink hover:bg-black/[0.02]"
              >
                Open GitHub Engineering →
              </button>
            </div>
          </div>
        )}

        {screen === "Engineering Plan" && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-ink">Engineering Plan</h2>
              <p className="text-sm text-ink-muted">Think before you build. Explain your technical approach for each milestone.</p>
            </div>

            <div className="rounded-xl border border-black/[0.08] bg-white p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-muted">
                  {answeredCount} of {data.questions.length} questions answered
                </span>
                <span className="text-ink-muted">{data.questions.length - answeredCount} remaining</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-black/[0.08]">
                <div
                  className="h-1.5 rounded-full bg-brand"
                  style={{ width: `${(answeredCount / data.questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.questions.map((q, i) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setQIndex(i)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    i === qIndex ? "bg-brand text-white" : "bg-[#f2f1ee] text-ink-muted"
                  }`}
                >
                  {i + 1} Q{i + 1}
                  {submitted[q.id] && <CheckCircleIcon className="size-3" />}
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-black/[0.08] bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-[#ecfdf5] px-2.5 py-1 text-xs font-semibold text-brand">
                  {question.category}
                </span>
                {submitted[question.id] && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                    Answered <CheckCircleIcon className="size-3" />
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-ink-muted">
                <span className="flex items-center gap-1">
                  <ClockIcon className="size-3.5" />
                  {question.timeEstimate}
                </span>
                <span>{question.difficulty}</span>
              </div>
              <h3 className="mt-2 text-base font-semibold text-ink">{question.question}</h3>
              <p className="mt-1 text-sm text-ink-muted">{question.description}</p>

              <div className="mt-4 rounded-lg border border-black/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowCriteria((v) => !v)}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-semibold text-ink"
                >
                  <span className="flex items-center gap-2">
                    <ListIcon className="size-4 text-ink-muted" />
                    Evaluation Criteria
                  </span>
                  <ChevronDownIcon className={`size-4 text-ink-muted transition-transform ${showCriteria ? "rotate-180" : ""}`} />
                </button>
                {showCriteria && (
                  <div className="grid grid-cols-2 gap-3 border-t border-black/[0.06] p-3">
                    {question.criteria.map((c) => (
                      <div key={c.title} className="rounded-lg bg-[#faf9f7] p-2.5">
                        <p className="text-xs font-semibold text-ink">{c.title}</p>
                        <p className="text-xs text-ink-muted">{c.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-3 rounded-lg border border-black/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowReferences((v) => !v)}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-semibold text-ink"
                >
                  <span className="flex items-center gap-2">
                    <LibraryIcon className="size-4 text-amber-600" />
                    Reference Materials
                  </span>
                  <ChevronDownIcon className={`size-4 text-ink-muted transition-transform ${showReferences ? "rotate-180" : ""}`} />
                </button>
                {showReferences && (
                  <div className="flex flex-wrap gap-2 border-t border-black/[0.06] p-3">
                    {question.references.map((r) => (
                      <span key={r.label} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.color}`}>
                        {r.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="mt-3 flex items-center gap-1.5 text-sm font-medium text-amber-600"
              >
                <LightbulbIcon className="size-4" />
                Show engineering hint
              </button>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <label className="font-semibold text-ink">Your Engineering Answer</label>
                  <span className="text-xs text-ink-muted">{(answers[question.id] ?? "").length} chars</span>
                </div>
                <textarea
                  value={answers[question.id] ?? ""}
                  readOnly={submitted[question.id]}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))}
                  placeholder="Walk through your technical approach in detail. Consider: data structures, algorithms, trade-offs, edge cases, and how you would handle failures..."
                  className={`h-32 w-full resize-none rounded-lg border border-black/[0.08] p-3 text-sm text-ink outline-none focus:border-brand ${
                    submitted[question.id] ? "bg-[#f2f1ee]" : "bg-[#faf9f7]"
                  }`}
                />
              </div>

              {submitted[question.id] ? (
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSubmitted((prev) => ({ ...prev, [question.id]: false }))}
                    className="flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
                  >
                    <RefreshIcon className="size-3.5" />
                    Edit answer
                  </button>
                  {qIndex < data.questions.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setQIndex((i) => i + 1)}
                      className="flex items-center gap-1.5 rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
                    >
                      Next Question
                      <ArrowRightIcon className="size-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-2xl border border-black/[0.08] px-4 py-2 text-sm font-semibold text-ink hover:bg-black/[0.02]"
                  >
                    <EditIcon className="size-3.5" />
                    Save Draft
                  </button>
                  <button
                    type="button"
                    disabled={!(answers[question.id] ?? "").trim()}
                    onClick={submitForReview}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-black/20"
                  >
                    <SendIcon className="size-3.5" />
                    Submit for AI Review
                  </button>
                  {qIndex < data.questions.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setQIndex((i) => i + 1)}
                      className="flex shrink-0 items-center gap-1.5 rounded-2xl border border-black/[0.08] px-4 py-2 text-sm font-semibold text-ink hover:bg-black/[0.02]"
                    >
                      Next
                      <ArrowRightIcon className="size-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {screen === "AI Review" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">AI Engineering Review</h2>
                <p className="text-sm text-ink-muted">
                  Q{qIndex + 1}: {question.question}
                </p>
              </div>
              <button type="button" className="flex items-center gap-1.5 rounded-full border border-black/[0.08] px-3 py-1.5 text-sm font-medium text-ink hover:bg-black/[0.02]">
                <RefreshIcon className="size-3.5" />
                Regenerate
              </button>
            </div>

            <div className="flex w-full rounded-lg bg-[#f2f1ee] p-1 text-sm">
              <button
                type="button"
                onClick={() => setReviewMode("side")}
                className={`flex-1 rounded-md py-2 font-medium ${reviewMode === "side" ? "bg-white text-ink shadow-sm" : "text-ink-muted"}`}
              >
                Side-By-Side Review
              </button>
              <button
                type="button"
                onClick={() => setReviewMode("detailed")}
                className={`flex-1 rounded-md py-2 font-medium ${reviewMode === "detailed" ? "bg-white text-ink shadow-sm" : "text-ink-muted"}`}
              >
                Detailed Feedback
              </button>
            </div>

            {reviewMode === "side" && (
              <div className="flex flex-wrap gap-2">
                {data.questions.map((q, i) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setQIndex(i)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      i === qIndex ? "bg-brand text-white" : "bg-[#f2f1ee] text-ink-muted"
                    }`}
                  >
                    {i + 1} Q{i + 1}
                    {submitted[q.id] && <CheckCircleIcon className="size-3" />}
                  </button>
                ))}
              </div>
            )}

            {reviewMode === "side" ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-black/[0.08] bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                      <EditIcon className="size-4 text-amber-500" />
                      Your Answer
                    </span>
                    <button type="button" className="text-xs font-medium text-ink-muted">Edit</button>
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-block rounded bg-[#fffbeb] px-2 py-0.5 text-[11px] font-medium text-[#bb4d00]">Submitted Jan 15</span>
                    <span className="text-[11px] text-ink-muted">{(answers[question.id] ?? "").length} chars</span>
                  </div>
                  <p className="text-sm text-ink-muted">{answers[question.id]}</p>
                </div>
                <div className="rounded-xl border border-black/[0.08] bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                      <SparklesIcon className="size-4 text-purple-500" />
                      AI Engineering Review
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                      {review.overall}/100
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {review.scores.map((s) => (
                      <div key={s.label} className="flex items-center gap-2 text-xs">
                        <span className="flex w-24 shrink-0 items-center gap-1 text-ink-muted">
                          <ScoreIcon label={s.label} />
                          {s.label}
                        </span>
                        <div className="h-1.5 flex-1 rounded-full bg-black/[0.08]">
                          <div className={`h-1.5 rounded-full ${scoreColor(s.value)}`} style={{ width: `${s.value}%` }} />
                        </div>
                        <span className="w-6 text-right text-ink">{s.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs font-semibold text-emerald-600">Strengths</p>
                  <ul className="mt-1 flex flex-col gap-1">
                    {review.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-1.5 text-xs text-ink-muted">
                        <CheckCircleIcon className="mt-0.5 size-3 shrink-0 text-emerald-500" />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs font-semibold text-amber-600">Needs Work</p>
                  <ul className="mt-1 flex flex-col gap-1">
                    {review.improvements.map((s) => (
                      <li key={s} className="flex items-start gap-1.5 text-xs text-ink-muted">
                        <span className="mt-0.5">⚠️</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-black/[0.08] bg-white p-5">
                <div className="flex items-center gap-4">
                  <div
                    className="flex size-16 shrink-0 items-center justify-center rounded-full text-sm font-bold text-amber-600"
                    style={{ background: `conic-gradient(#f59e0b ${(review.overall / 100) * 360}deg, #e7e5e0 ${(review.overall / 100) * 360}deg)` }}
                  >
                    <span className="flex size-13 items-center justify-center rounded-full bg-white text-xs">
                      {review.overall}
                      <br />
                      /100
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">Good Engineering Thinking</p>
                    <p className="text-xs text-ink-muted">Solid fundamentals. Two key gaps to address before moving to the Build phase.</p>
                    <div className="mt-1.5 flex flex-wrap gap-2 text-xs">
                      {review.scores.map((s) => (
                        <span
                          key={s.label}
                          className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${chipColorMap[s.label] ?? "bg-[#f2f1ee] text-ink-muted"}`}
                        >
                          <ScoreIcon label={s.label} />
                          {s.label}: {s.value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">Strengths</p>
                <div className="mt-1.5 flex flex-col gap-1.5">
                  {review.strengths.map((s) => (
                    <div key={s} className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                      <CheckCircleIcon className="mt-0.5 size-3.5 shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">Improvement Suggestions</p>
                <div className="mt-1.5 flex flex-col gap-1.5">
                  {review.improvements.map((s) => (
                    <div key={s} className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                      <LightbulbIcon className="mt-0.5 size-3.5 shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-600">Missing Concepts</p>
                  <div className="mt-1.5 flex flex-col gap-1">
                    {review.missing.map((s) => (
                      <p key={s} className="text-xs text-red-600">✕ {s}</p>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-[#faf9f7] p-3">
                    <p className="text-xs font-semibold text-purple-600">Security Recommendations</p>
                    <p className="mt-1 text-xs text-ink-muted">{review.security}</p>
                  </div>
                  <div className="rounded-lg bg-[#faf9f7] p-3">
                    <p className="text-xs font-semibold text-sky-600">Performance Recommendations</p>
                    <p className="mt-1 text-xs text-ink-muted">{review.performance}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-black/[0.08] p-3">
                  <p className="text-xs font-semibold text-ink">Better Engineering Approach</p>
                  <ul className="mt-1.5 flex flex-col gap-1">
                    {review.betterApproach.map((s) => (
                      <li key={s} className="flex items-start gap-1.5 text-xs text-ink-muted">
                        <span className="mt-1 size-1 shrink-0 rounded-full bg-ink-muted" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 rounded-lg border border-black/[0.08] p-3">
                  <p className="text-sm font-semibold text-ink">Ask AI Follow-up</p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      placeholder="Ask a technical follow-up question..."
                      className="flex-1 rounded-lg border border-black/[0.08] bg-[#faf9f7] px-3 py-2 text-xs text-ink outline-none placeholder:text-ink-muted/60"
                    />
                    <button type="button" className="flex items-center gap-1 rounded-full bg-[#a8b5ad] px-3 py-2 text-xs font-semibold text-white">
                      <SparklesIcon className="size-3.5" />
                      Ask
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-[#f2f1ee] px-2.5 py-1 text-[11px] text-ink-muted">Explain SELECT FOR UPDATE</span>
                    <span className="rounded-full bg-[#f2f1ee] px-2.5 py-1 text-[11px] text-ink-muted">When to use Redis vs DB?</span>
                    <span className="rounded-full bg-[#f2f1ee] px-2.5 py-1 text-[11px] text-ink-muted">Show example transaction</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setScreen("Engineering Plan")}
                className="flex items-center gap-1.5 rounded-2xl border border-black/[0.08] px-4 py-2 text-sm font-semibold text-ink hover:bg-black/[0.02]"
              >
                <RefreshIcon className="size-3.5" />
                Improve Answer
              </button>
              <button
                type="button"
                className="rounded-2xl bg-[#ecfdf5] px-4 py-2 text-sm font-semibold text-brand"
              >
                Accept Suggestions
              </button>
              <button
                type="button"
                onClick={continueToBuild}
                className="ml-auto flex items-center gap-1.5 rounded-2xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink/90"
              >
                Continue to Build
                <ArrowRightIcon className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        {screen === "Build" && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-ink">Build</h2>
              <p className="text-sm text-ink-muted">Your repository is connected. Use your professional tools to build.</p>
            </div>

            <div className="rounded-xl border border-black/[0.08] bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <CheckCircleIcon className="size-4 text-brand" />
                  Repository Connected
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">Connected</span>
              </div>
              <p className="ml-6 text-xs text-ink-muted">github.com/{data.repo.owner}/{data.repo.name}</p>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-[#faf9f7] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Current Branch</p>
                  <p className="mt-0.5 text-sm font-semibold text-ink">{data.branch.current}</p>
                </div>
                <div className="rounded-lg bg-[#faf9f7] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Last Commit</p>
                  <p className="mt-0.5 text-sm font-semibold text-ink">{data.branch.lastCommit}</p>
                </div>
                <div className="rounded-lg bg-[#faf9f7] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Latest SHA</p>
                  <p className="mt-0.5 text-sm font-semibold text-ink">{data.branch.sha}</p>
                </div>
                <div className="rounded-lg bg-[#faf9f7] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Open PRs</p>
                  <p className="mt-0.5 text-sm font-semibold text-ink">{data.branch.openPrs} open</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button type="button" className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90">
                  {"</>"} Open in VS Code
                </button>
                <button type="button" className="flex items-center gap-1.5 rounded-2xl border border-black/[0.08] px-4 py-2.5 text-sm font-semibold text-ink hover:bg-black/[0.02]">
                  <GithubIcon className="size-4" />
                  GitHub
                </button>
                <button type="button" className="flex items-center gap-1.5 rounded-2xl border border-black/[0.08] px-4 py-2.5 text-sm font-semibold text-ink hover:bg-black/[0.02]">
                  Preview
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-black/[0.08] bg-white p-4">
              <div className="flex items-center justify-between text-xs text-ink-muted">
                <span>{data.milestone.sprint.toUpperCase()} · ACTIVE MILESTONE</span>
                <span className="font-semibold text-ink">Build Progress {Math.round((doneCount / buildTasks.length) * 100)}%</span>
              </div>
              <p className="mt-0.5 text-sm font-semibold text-ink">{data.milestone.label}</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-black/[0.08]">
                <div className="h-1.5 rounded-full bg-brand" style={{ width: `${(doneCount / buildTasks.length) * 100}%` }} />
              </div>

              <div className="mt-3 flex flex-col gap-1.5">
                {buildTasks.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => toggleTask(t.label)}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm ${
                      t.current ? "bg-[#ecfdf5]" : "bg-[#faf9f7]"
                    }`}
                  >
                    <span
                      className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                        t.done ? "border-brand bg-brand text-white" : "border-black/20"
                      }`}
                    >
                      {t.done && "✓"}
                    </span>
                    <span className={t.done ? "flex-1 text-ink-muted line-through" : "flex-1 text-ink"}>{t.label}</span>
                    {t.current && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Current</span>}
                  </button>
                ))}
              </div>

              <div className="mt-3 rounded-lg bg-[#f2f1ee] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Current Implementation Task</p>
                <p className="mt-0.5 text-sm font-semibold text-ink">{data.currentTask.label}</p>
                <p className="text-xs text-ink-muted">{data.currentTask.hint}</p>
              </div>

              <button
                type="button"
                disabled={!buildDone}
                onClick={() => {
                  setBuildLocked(true);
                  setScreen("GitHub Engineering");
                }}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-brand py-2.5 text-sm font-semibold text-brand hover:bg-[#ecfdf5] disabled:cursor-not-allowed disabled:border-black/10 disabled:text-ink-muted disabled:hover:bg-transparent"
              >
                <CheckCircleIcon className="size-4" />
                {buildDone ? "Mark Milestone Complete" : `Complete all tasks (${doneCount}/${buildTasks.length})`}
              </button>
            </div>
          </div>
        )}

        {screen === "GitHub Engineering" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <GithubIcon className="size-5 text-ink" />
              <div>
                <h2 className="text-lg font-semibold text-ink">GitHub Engineering Activity</h2>
                <p className="text-sm text-ink-muted">Track your coding consistency and engineering progress</p>
              </div>
            </div>

            <div className="rounded-xl border border-black/[0.08] bg-white p-4">
              <p className="mb-2 text-sm font-semibold text-ink">Repository Overview</p>
              <div className="grid grid-cols-4 gap-3">
                <div className="rounded-lg bg-[#faf9f7] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Repository</p>
                  <p className="mt-0.5 text-sm font-semibold text-ink">{data.repo.name}</p>
                </div>
                <div className="rounded-lg bg-[#faf9f7] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Current Branch</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-ink">
                    <BranchIcon className="size-3.5" /> main
                  </p>
                </div>
                <div className="rounded-lg bg-[#faf9f7] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Last Commit</p>
                  <p className="mt-0.5 text-sm font-semibold text-ink">{data.github.lastCommit}</p>
                </div>
                <div className="rounded-lg bg-[#faf9f7] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Working Tree</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                    Clean <CheckCircleIcon className="size-3.5" />
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-black/[0.08] bg-white p-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">Commit Calendar</p>
                <span className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <ClockIcon className="size-3.5" />
                  {data.github.commits[0].date} – {data.github.commits[data.github.commits.length - 1].date}, 2025
                </span>
              </div>
              <div className="mb-4 flex w-fit rounded-full border border-black/[0.08] bg-[#faf9f7] p-1 text-xs">
                {(["Daily", "Weekly", "Monthly"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setChartRange(r)}
                    className={`rounded-full px-3 py-1 font-medium ${chartRange === r ? "bg-white text-brand shadow-sm" : "text-ink-muted"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              {(() => {
                const commits = data.github.commits;
                const maxVal = 50;
                const w = 700;
                const h = 190;
                const padX = 24;
                const padTop = 10;
                const points = commits.map((c, i) => ({
                  x: padX + (i * (w - padX * 2)) / (commits.length - 1),
                  y: padTop + (h - padTop) * (1 - c.count / maxVal),
                  c,
                }));
                const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
                const areaPath = `${linePath} L ${points[points.length - 1].x} ${h} L ${points[0].x} ${h} Z`;
                const hoverPoint = points.find((p) => p.c.date === hoverDate);
                return (
                  <div className="relative">
                    <svg viewBox={`0 0 ${w} ${h + 24}`} className="w-full overflow-visible">
                      {[0, 10, 20, 30, 40, 50].map((g) => {
                        const y = padTop + (h - padTop) * (1 - g / maxVal);
                        return (
                          <g key={g}>
                            <line x1={padX} x2={w - padX} y1={y} y2={y} stroke="#e7e5e0" strokeWidth={1} />
                            <text x={0} y={y + 3} fontSize={9} fill="#8a8578">
                              {g}
                            </text>
                          </g>
                        );
                      })}
                      <path d={areaPath} fill="#065f46" opacity={0.08} />
                      <path d={linePath} fill="none" stroke="#065f46" strokeWidth={2} />
                      {points.map((p) => (
                        <g key={p.c.date}>
                          {/* larger invisible hit area for easier hover/click */}
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={10}
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoverDate(p.c.date)}
                            onMouseLeave={() => setHoverDate((d) => (d === p.c.date ? null : d))}
                            onClick={() => setOpenCommitDay(p.c.date)}
                          />
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={hoverDate === p.c.date || data.commitDetails[p.c.date] ? 4.5 : 2.5}
                            fill="#065f46"
                            className="pointer-events-none"
                          />
                        </g>
                      ))}
                      {points.map((p) => (
                        <text key={`${p.c.date}-label`} x={p.x} y={h + 18} fontSize={9} fill="#8a8578" textAnchor="middle">
                          {p.c.date}
                        </text>
                      ))}
                    </svg>
                    {hoverPoint && (
                      <div
                        className="pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg bg-ink px-2.5 py-1.5 text-center text-xs text-white shadow-lg"
                        style={{ left: `${(hoverPoint.x / w) * 100}%`, top: `${(hoverPoint.y / (h + 24)) * 100}%` }}
                      >
                        <p className="font-semibold">{hoverPoint.c.date}, 2025</p>
                        <p className="text-white/80">{hoverPoint.c.count} commits</p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-ink">Quick Stats</p>
              <div className="grid grid-cols-4 gap-3">
                {data.github.stats.map((s) => (
                  <div key={s.label} className="rounded-xl border border-black/[0.08] bg-white p-3">
                    <p className="text-lg font-semibold text-ink">{s.value}</p>
                    <p className="text-[10px] uppercase tracking-wide text-ink-muted">{s.label}</p>
                    <p className="text-xs font-medium text-emerald-600">↑ {s.delta} from last 30 days</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setGithubDone(true);
                setScreen("Submit Project");
              }}
              className="ml-auto flex items-center gap-1.5 rounded-2xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90"
            >
              Continue to Submit
              <ArrowRightIcon className="size-3.5" />
            </button>
          </div>
        )}

        {screen === "Submit Project" && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-ink">Submit Project</h2>
              <p className="text-sm text-ink-muted">Complete all requirements before submitting for final review.</p>
            </div>

            {finalSubmitted ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-black/[0.08] bg-white px-6 py-14 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircleIcon className="size-6" />
                </span>
                <p className="text-sm font-semibold text-ink">Project submitted for review</p>
                <p className="max-w-sm text-sm text-ink-muted">
                  Your mentor will review your submission and get back to you within 2-3 business days.
                </p>
                <span className="mt-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  🎉 Phase 2 Unlocked — Milestone 4 videos are ready
                </span>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setScreen("Overview")}
                    className="rounded-2xl border border-black/[0.08] px-4 py-2 text-sm font-semibold text-ink hover:bg-black/[0.02]"
                  >
                    Back to Overview
                  </button>
                  {onViewPhase2Videos && (
                    <button
                      type="button"
                      onClick={onViewPhase2Videos}
                      className="rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
                    >
                      Watch Phase 2 Videos
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-black/[0.08] bg-white p-5">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex size-16 shrink-0 items-center justify-center rounded-full text-sm font-bold text-amber-600"
                      style={{ background: `conic-gradient(#f59e0b ${(readinessPercent / 100) * 360}deg, #e7e5e0 ${(readinessPercent / 100) * 360}deg)` }}
                    >
                      <span className="flex size-13 items-center justify-center rounded-full bg-white text-xs">{readinessPercent}%</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{canSubmitProject ? "Ready to Submit" : "Almost There"}</p>
                      <p className="text-xs text-ink-muted">{totalPassed} of {totalChecks} checks passed</p>
                      <div className="mt-1.5 flex gap-2 text-xs">
                        <span
                          className={`rounded-full px-2 py-0.5 font-semibold ${
                            canSubmitProject ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {requiredPassed}/{requiredChecks.length} Required {canSubmitProject ? "✓" : ""}
                        </span>
                        <span className="rounded-full bg-[#f2f1ee] px-2 py-0.5 font-semibold text-ink-muted">
                          {recommendedPassed}/{recommendedTotal} Recommended
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-black/[0.08] bg-white p-5">
                  <label className="text-sm font-semibold text-ink">
                    Deployment URL <span className="text-red-500">*</span>
                  </label>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    Your project must be live and accessible. Railway, Render, or Fly.io recommended.
                  </p>
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-black/[0.08] bg-[#faf9f7] px-3 py-2.5">
                    <GlobeIcon className="size-4 text-ink-muted" />
                    <input
                      value={deployUrl}
                      onChange={(e) => setDeployUrl(e.target.value)}
                      placeholder="https://cartflow-api.railway.app"
                      className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted/60"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!canSubmitProject}
                  onClick={() => {
                    setFinalSubmitted(true);
                    onProjectSubmitted?.();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-brand py-3 text-sm font-semibold text-white hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-black/20"
                >
                  <PackageIcon className="size-4" />
                  {canSubmitProject ? "Submit Project for Review" : `Complete Required Checks (${requiredPassed}/${requiredChecks.length})`}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right context panel */}
      <aside className="flex w-[260px] shrink-0 flex-col gap-4 border-l border-black/[0.06] bg-white p-5 text-sm">
        {screen === "Engineering Plan" && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Question Progress</p>
            <div className="mt-2 flex flex-col gap-2 text-xs">
              <div className="flex justify-between"><span className="text-ink-muted">Active Question</span><span className="font-semibold text-ink">Q{qIndex + 1} of {data.questions.length}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Answered</span><span className="font-semibold text-ink">{answeredCount} / {data.questions.length}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Est. Time Left</span><span className="font-semibold text-ink">60 min</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">AI Reviews Ready</span><span className="font-semibold text-ink">{answeredCount}</span></div>
            </div>
          </div>
        )}
        {screen === "AI Review" && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Review Scores</p>
            <div className="mt-2 flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between"><span className="text-ink-muted">Overall Score</span><span className="font-semibold text-ink">{review.overall}/100</span></div>
              {review.scores.map((s) => (
                <div key={s.label} className="flex justify-between">
                  <span className="text-ink-muted">{s.label}</span>
                  <span className="font-semibold text-ink">{s.value}/100</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {screen === "Build" && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Repository Status</p>
            <div className="mt-2 flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between"><span className="text-ink-muted">Branch</span><span className="font-semibold text-ink">{data.branch.current}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Last Commit</span><span className="font-semibold text-ink">{data.branch.lastCommit}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Build</span><span className="font-semibold text-emerald-600">Passing ✓</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Coverage</span><span className="font-semibold text-ink">72%</span></div>
            </div>
          </div>
        )}
        {screen === "Submit Project" && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Submission Readiness</p>
            <div className="mt-2 flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between"><span className="text-ink-muted">Required Checks</span><span className="font-semibold text-ink">{requiredPassed}/{requiredChecks.length} passed</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Engineering Plan</span><span className="font-semibold text-ink">{engineeringPlanCompleted ? "Done ✓" : "Pending"}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Build</span><span className="font-semibold text-ink">{buildCompleted ? "Done ✓" : "Pending"}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Repo Connected</span><span className="font-semibold text-ink">{githubDone ? "Yes ✓" : "Pending"}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Deploy URL</span><span className="font-semibold text-ink">{deployUrl.trim() ? "Set ✓" : "Pending"}</span></div>
            </div>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Overall Progress</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-black/[0.08]">
            <div className="h-1.5 rounded-full bg-brand" style={{ width: `${overallProgress}%` }} />
          </div>
          <p className="mt-1 text-xs text-ink-muted">{data.milestone.sprint}</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Workflow Steps</p>
          <div className="mt-1.5 flex flex-col gap-1.5 text-xs">
            {stepOrder.map((s, i) => (
              <span key={s} className={stepDone[s] || s === screen ? "font-semibold text-brand" : "text-ink-muted"}>
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">AI Mentor Tips</p>
          <div className="mt-1.5 flex flex-col gap-1.5">
            {mentorTips.map((tip) => (
              <p key={tip} className="flex items-start gap-1.5 text-xs text-ink-muted">
                <LightbulbIcon className="mt-0.5 size-3 shrink-0 text-amber-500" />
                {tip}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-purple-50 p-2.5">
          <p className="flex items-center gap-1 text-xs font-semibold text-purple-700">
            <ShieldIcon className="size-3.5" /> SECURITY
          </p>
          <p className="mt-0.5 text-xs text-purple-700">Plan auth before building any endpoint.</p>
        </div>

        <div className="rounded-lg bg-sky-50 p-2.5">
          <p className="flex items-center gap-1 text-xs font-semibold text-sky-700">
            <CpuIcon className="size-3.5" /> PERFORMANCE
          </p>
          <p className="mt-0.5 text-xs text-sky-700">Add indexes as you design the schema.</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Ask AI Mentor</p>
          <textarea
            placeholder="Ask about your current task..."
            className="mt-1.5 h-16 w-full resize-none rounded-lg border border-black/[0.08] bg-[#faf9f7] p-2 text-xs outline-none"
          />
          <button type="button" className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-full bg-[#a8b5ad] py-1.5 text-xs font-semibold text-white">
            <SparklesIcon className="size-3.5" /> Ask
          </button>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-[#f2f1ee] px-2 py-1 text-[11px] text-ink-muted">How do I fix this?</span>
            <span className="rounded-full bg-[#f2f1ee] px-2 py-1 text-[11px] text-ink-muted">Best practice?</span>
            <span className="rounded-full bg-[#f2f1ee] px-2 py-1 text-[11px] text-ink-muted">Security concern?</span>
          </div>
        </div>
      </aside>

      {commitPopupData && openCommitDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6" onClick={() => setOpenCommitDay(null)}>
          <div
            className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-ink">Commits on {openCommitDay}, 2025</h3>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  {commitPopupData.length} commits
                </span>
              </div>
              <button type="button" onClick={() => setOpenCommitDay(null)} className="text-ink-muted hover:text-ink">
                ✕
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-ink-muted">
                  <th className="pb-2 font-semibold">Commit Message</th>
                  <th className="pb-2 font-semibold">Commit Hash</th>
                  <th className="pb-2 text-right font-semibold">Lines Added</th>
                  <th className="pb-2 text-right font-semibold">Lines Deleted</th>
                </tr>
              </thead>
              <tbody>
                {commitPopupData.map((c) => (
                  <tr key={c.hash} className="border-t border-black/[0.06]">
                    <td className="flex items-center gap-2 py-2.5 text-ink">
                      <span className="text-ink-muted">⚡</span>
                      {c.message}
                    </td>
                    <td className="py-2.5 font-mono text-xs text-ink-muted">{c.hash}</td>
                    <td className="py-2.5 text-right font-semibold text-emerald-600">+{c.added}</td>
                    <td className="py-2.5 text-right font-semibold text-red-500">-{c.deleted}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-black/[0.08] font-semibold text-ink">
                  <td className="py-2.5">Total</td>
                  <td />
                  <td className="py-2.5 text-right text-emerald-600">
                    +{commitPopupData.reduce((sum, c) => sum + c.added, 0)}
                  </td>
                  <td className="py-2.5 text-right text-red-500">
                    -{commitPopupData.reduce((sum, c) => sum + c.deleted, 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
