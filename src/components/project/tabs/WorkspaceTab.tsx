"use client";

import { useMemo, useState } from "react";
import {
  ArrowRightIcon,
  BranchIcon,
  CheckCircleIcon,
  ClockIcon,
  EditIcon,
  GithubIcon,
  GlobeIcon,
  LightbulbIcon,
  LockIcon,
  PackageIcon,
  RefreshIcon,
  SendIcon,
  ShieldIcon,
  SparklesIcon,
} from "@/components/dashboard/icons";
import { getWorkspaceData, mentorTips, workflowSteps, type WorkflowStep } from "@/lib/workspace-data";

const stepOrder: WorkflowStep[] = [...workflowSteps];

function scoreColor(v: number) {
  if (v >= 80) return "bg-emerald-500";
  if (v >= 60) return "bg-amber-500";
  return "bg-red-500";
}

export function WorkspaceTab({ unlocked, slug }: { unlocked: boolean; slug: string }) {
  const data = useMemo(() => getWorkspaceData(slug), [slug]);
  const [step, setStep] = useState<WorkflowStep>("Engineering Plan");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [reviewMode, setReviewMode] = useState<"side" | "detailed">("side");
  const [buildTasks, setBuildTasks] = useState(data.buildTasks);
  const [deployUrl, setDeployUrl] = useState("");
  const [finalSubmitted, setFinalSubmitted] = useState(false);

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

  const stepIndex = stepOrder.indexOf(step);

  const goToStep = (s: WorkflowStep) => setStep(s);

  const submitForReview = () => {
    setSubmitted((prev) => ({ ...prev, [question.id]: true }));
    setStep("AI Review");
  };

  const continueToBuild = () => {
    if (qIndex < data.questions.length - 1) {
      setQIndex((i) => i + 1);
      setStep("Engineering Plan");
    } else {
      setStep("Build");
    }
  };

  const toggleTask = (label: string) => {
    setBuildTasks((prev) =>
      prev.map((t) => (t.label === label ? { ...t, done: !t.done, current: false } : t))
    );
  };

  return (
    <div className="flex w-full">
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
          <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-ink-muted">
            <CheckCircleIcon className="size-4 shrink-0 text-brand" />
            Overview
          </div>
          {stepOrder.map((s, i) => {
            const isActive = s === step;
            const isPast = i < stepIndex;
            return (
              <button
                key={s}
                type="button"
                onClick={() => (isPast || isActive) && goToStep(s)}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left ${
                  isActive
                    ? "bg-[#ecfdf5] font-semibold text-brand"
                    : isPast
                      ? "text-ink hover:bg-black/[0.02]"
                      : "text-ink-muted/50"
                }`}
              >
                {isPast ? (
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
        {/* Top stepper */}
        <div className="mb-6 flex items-center">
          {stepOrder.map((s, i) => {
            const isPast = i < stepIndex;
            const isActive = s === step;
            return (
              <div key={s} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                      isPast || isActive ? "bg-brand text-white" : "bg-[#f2f1ee] text-ink-muted"
                    }`}
                  >
                    {isPast ? "✓" : i + 1}
                  </span>
                  <span className="whitespace-nowrap text-[11px] text-ink-muted">{s}</span>
                </div>
                {i < stepOrder.length - 1 && (
                  <div className={`mx-1.5 h-px flex-1 ${isPast ? "bg-brand" : "bg-black/10"}`} />
                )}
              </div>
            );
          })}
        </div>

        {step === "Engineering Plan" && (
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

              <div className="mt-4 rounded-lg border border-black/[0.08] p-3">
                <p className="mb-2 text-sm font-semibold text-ink">Evaluation Criteria</p>
                <div className="grid grid-cols-2 gap-3">
                  {question.criteria.map((c) => (
                    <div key={c.title} className="rounded-lg bg-[#faf9f7] p-2.5">
                      <p className="text-xs font-semibold text-ink">{c.title}</p>
                      <p className="text-xs text-ink-muted">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {question.references.map((r) => (
                  <span key={r.label} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.color}`}>
                    {r.label}
                  </span>
                ))}
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
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))}
                  placeholder="Walk through your technical approach in detail. Consider: data structures, algorithms, trade-offs, edge cases, and how you would handle failures..."
                  className="h-32 w-full resize-none rounded-lg border border-black/[0.08] bg-[#faf9f7] p-3 text-sm text-ink outline-none focus:border-brand"
                />
              </div>

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
              </div>
            </div>
          </div>
        )}

        {step === "AI Review" && (
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

            <div className="flex w-fit rounded-full border border-black/[0.08] bg-white p-1 text-sm">
              <button
                type="button"
                onClick={() => setReviewMode("side")}
                className={`rounded-full px-4 py-1.5 font-medium ${reviewMode === "side" ? "bg-ink text-white" : "text-ink-muted"}`}
              >
                Side-By-Side Review
              </button>
              <button
                type="button"
                onClick={() => setReviewMode("detailed")}
                className={`rounded-full px-4 py-1.5 font-medium ${reviewMode === "detailed" ? "bg-ink text-white" : "text-ink-muted"}`}
              >
                Detailed Feedback
              </button>
            </div>

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
                  <span className="mb-2 inline-block rounded bg-[#fffbeb] px-2 py-0.5 text-[11px] text-[#bb4d00]">Submitted</span>
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
                        <span className="w-24 shrink-0 text-ink-muted">{s.label}</span>
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
                        <span key={s.label} className="rounded-full bg-[#f2f1ee] px-2 py-0.5 text-ink-muted">
                          {s.label} {s.value}
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

                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-red-500">Missing Concepts</p>
                <div className="mt-1.5 flex flex-col gap-1.5 rounded-lg bg-red-50 p-3">
                  {review.missing.map((s) => (
                    <p key={s} className="text-xs text-red-600">✕ {s}</p>
                  ))}
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
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep("Engineering Plan")}
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

        {step === "Build" && (
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
                onClick={() => setStep("GitHub Engineering")}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-brand py-2.5 text-sm font-semibold text-brand hover:bg-[#ecfdf5]"
              >
                <CheckCircleIcon className="size-4" />
                Mark Milestone Complete
              </button>
            </div>
          </div>
        )}

        {step === "GitHub Engineering" && (
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
              <p className="mb-3 text-sm font-semibold text-ink">Commit Calendar</p>
              <div className="flex h-40 items-end gap-2">
                {data.github.commits.map((c) => (
                  <div key={c.date} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-brand/70"
                      style={{ height: `${(c.count / 42) * 100}%` }}
                      title={`${c.date}: ${c.count} commits`}
                    />
                    <span className="text-[9px] text-ink-muted">{c.date}</span>
                  </div>
                ))}
              </div>
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
              onClick={() => setStep("Submit Project")}
              className="ml-auto flex items-center gap-1.5 rounded-2xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90"
            >
              Continue to Submit
              <ArrowRightIcon className="size-3.5" />
            </button>
          </div>
        )}

        {step === "Submit Project" && (
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
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-black/[0.08] bg-white p-5">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex size-16 shrink-0 items-center justify-center rounded-full text-sm font-bold text-amber-600"
                      style={{ background: "conic-gradient(#f59e0b 200deg, #e7e5e0 200deg)" }}
                    >
                      <span className="flex size-13 items-center justify-center rounded-full bg-white text-xs">56%</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">Almost There</p>
                      <p className="text-xs text-ink-muted">5 of 13 checks passed</p>
                      <div className="mt-1.5 flex gap-2 text-xs">
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-600">5 Required ✓</span>
                        <span className="rounded-full bg-[#f2f1ee] px-2 py-0.5 font-semibold text-ink-muted">2/4 Recommended</span>
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
                  disabled={!deployUrl.trim()}
                  onClick={() => setFinalSubmitted(true)}
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-brand py-3 text-sm font-semibold text-white hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-black/20"
                >
                  <PackageIcon className="size-4" />
                  Submit Project for Review
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right context panel */}
      <aside className="flex w-[260px] shrink-0 flex-col gap-4 border-l border-black/[0.06] bg-white p-5 text-sm">
        {step === "Engineering Plan" && (
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
        {step === "AI Review" && (
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
        {step === "Build" && (
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
        {step === "Submit Project" && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Submission Readiness</p>
            <div className="mt-2 flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between"><span className="text-ink-muted">Required Checks</span><span className="font-semibold text-ink">4/5 passed</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">AI Review</span><span className="font-semibold text-ink">78/100 ✓</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Repo Connected</span><span className="font-semibold text-ink">Yes ✓</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Deploy URL</span><span className="font-semibold text-ink">{deployUrl ? "Set ✓" : "Pending"}</span></div>
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
              <span key={s} className={i <= stepIndex ? "font-semibold text-brand" : "text-ink-muted"}>
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

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Ask AI Mentor</p>
          <textarea
            placeholder="Ask about your current task..."
            className="mt-1.5 h-16 w-full resize-none rounded-lg border border-black/[0.08] bg-[#faf9f7] p-2 text-xs outline-none"
          />
          <button type="button" className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-full bg-[#a8b5ad] py-1.5 text-xs font-semibold text-white">
            <SparklesIcon className="size-3.5" /> Ask
          </button>
        </div>
      </aside>
    </div>
  );
}
