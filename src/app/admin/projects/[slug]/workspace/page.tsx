"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { WorkspaceData, EngineeringQuestion, AiReview } from "@/lib/workspace-data";

const inputClass =
  "rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-normal text-ink outline-none focus:border-brand";
const cardClass = "rounded-lg border border-black/10 bg-[#faf9f7] p-3";
const addBtnClass =
  "self-start rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-black/[0.03]";
const removeBtnClass = "mt-2 self-start text-xs font-semibold text-red-600 hover:underline";

function Field({
  label,
  value,
  onChange,
  textarea = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
      {label}
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`h-20 resize-y ${inputClass}`}
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />
      )}
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
      {label}
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className={inputClass}
      />
    </label>
  );
}

function CheckboxField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-ink">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function StringArrayField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
      {label} <span className="font-normal text-ink-muted">(one item per line)</span>
      <textarea
        value={value.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n"))}
        className={`h-24 resize-y ${inputClass}`}
      />
    </label>
  );
}

function ArrayEditor<T>({
  items,
  onChange,
  newItem,
  renderItem,
  addLabel = "+ Add",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  addLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={i} className={cardClass}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {renderItem(item, (patch) => {
              const next = [...items];
              next[i] = { ...next[i], ...patch };
              onChange(next);
            })}
          </div>
          <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className={removeBtnClass}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, newItem()])} className={addBtnClass}>
        {addLabel}
      </button>
    </div>
  );
}

type SaveState = { status: "idle" | "saving" | "saved" | "error"; message?: string };

function emptyQuestion(): EngineeringQuestion {
  return {
    id: `q${Date.now()}`,
    category: "",
    timeEstimate: "",
    difficulty: "Intermediate",
    question: "",
    description: "",
    criteria: [],
    references: [],
    hint: "",
    expectedAnswer: "",
    aiPrompt: "",
    weight: 1,
    required: true,
    hints: [],
    maxHints: 4,
    hintCooldownSeconds: 0,
  };
}

function emptyReview(): AiReview {
  return {
    overall: 0,
    scores: [],
    strengths: [],
    improvements: [],
    missing: [],
    security: "",
    performance: "",
    betterApproach: [],
    rubric: "",
    passingPercent: 70,
    suggestedAnswer: "",
  };
}

export default function WorkspaceBuilderPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [data, setData] = useState<WorkspaceData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle" });

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/workspace-data/${encodeURIComponent(slug)}`, { cache: "no-store" });
        const body = await res.json();
        if (!res.ok) {
          setLoadError(body.error ?? "Failed to load workspace data");
          return;
        }
        setData(body.data);
      } catch {
        setLoadError("Failed to load workspace data");
      }
    })();
  }, [slug]);

  async function save() {
    if (!data) return;
    setSaveState({ status: "saving" });
    try {
      const res = await fetch(`/api/admin/workspace-data/${encodeURIComponent(slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveState({ status: "error", message: body.error ?? "Failed to save" });
        return;
      }
      setSaveState({ status: "saved" });
      setTimeout(() => setSaveState({ status: "idle" }), 2500);
    } catch {
      setSaveState({ status: "error", message: "Network error while saving" });
    }
  }

  if (loadError) {
    return (
      <div className="flex flex-col gap-4">
        <Link href={`/admin/projects/${slug}/content`} className="text-sm font-medium text-brand hover:underline">
          ← Back to content editor
        </Link>
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{loadError}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col gap-4">
        <Link href={`/admin/projects/${slug}/content`} className="text-sm font-medium text-brand hover:underline">
          ← Back to content editor
        </Link>
        <p className="text-sm text-ink-muted">Loading workspace data…</p>
      </div>
    );
  }

  const questions = data.questions;
  const reviews = data.reviews;

  const setQuestions = (next: EngineeringQuestion[]) => setData({ ...data, questions: next });
  const setReviewFor = (questionId: string, review: AiReview) =>
    setData({ ...data, reviews: { ...reviews, [questionId]: review } });

  const unlockRules = data.unlockRules ?? {
    minScore: 0,
    requiredSections: [],
    creditsRequired: 0,
    unlockVideos: false,
    unlockResources: false,
    unlockCertificate: false,
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link href={`/admin/projects/${slug}/content`} className="text-sm font-medium text-brand hover:underline">
          ← Back to content editor
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-ink">Workspace Builder</h1>
        <p className="text-sm text-ink-muted">{slug}</p>
      </div>

      <div className="rounded-xl border border-black/[0.08] bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink">Questions</h2>
        <ArrayEditor
          items={questions}
          onChange={setQuestions}
          newItem={emptyQuestion}
          addLabel="+ Add question"
          renderItem={(q, update) => {
            const review = reviews[q.id] ?? emptyReview();
            const hints = q.hints ?? [];
            return (
              <>
                <Field label="Category" value={q.category} onChange={(v) => update({ category: v })} />
                <Field label="Time estimate" value={q.timeEstimate} onChange={(v) => update({ timeEstimate: v })} />
                <Field label="Difficulty" value={q.difficulty} onChange={(v) => update({ difficulty: v })} />
                <NumberField label="Weight" value={q.weight ?? 1} onChange={(v) => update({ weight: v })} />
                <div className="col-span-full">
                  <Field label="Question" value={q.question} onChange={(v) => update({ question: v })} textarea />
                </div>
                <div className="col-span-full">
                  <Field label="Description" value={q.description} onChange={(v) => update({ description: v })} textarea />
                </div>

                <div className="col-span-full">
                  <p className="mb-2 text-xs font-semibold text-ink">Criteria</p>
                  <ArrayEditor
                    items={q.criteria}
                    onChange={(criteria) => update({ criteria })}
                    newItem={() => ({ title: "", desc: "" })}
                    renderItem={(item, u) => (
                      <>
                        <Field label="Title" value={item.title} onChange={(v) => u({ title: v })} />
                        <Field label="Description" value={item.desc} onChange={(v) => u({ desc: v })} textarea />
                      </>
                    )}
                  />
                </div>

                <div className="col-span-full">
                  <p className="mb-2 text-xs font-semibold text-ink">References</p>
                  <ArrayEditor
                    items={q.references}
                    onChange={(references) => update({ references })}
                    newItem={() => ({ label: "", color: "text-sky-600 bg-sky-50" })}
                    renderItem={(item, u) => (
                      <>
                        <Field label="Label" value={item.label} onChange={(v) => u({ label: v })} />
                        <Field label="Color classes" value={item.color} onChange={(v) => u({ color: v })} />
                      </>
                    )}
                  />
                </div>

                <div className="col-span-full">
                  <Field label="Legacy hint (single, back-compat)" value={q.hint} onChange={(v) => update({ hint: v })} textarea />
                </div>

                <div className="col-span-full">
                  <p className="mb-2 text-xs font-semibold text-ink">Progressive hints (up to 4)</p>
                  <div className="flex flex-col gap-2">
                    {[0, 1, 2, 3].map((i) => (
                      <textarea
                        key={i}
                        value={hints[i] ?? ""}
                        onChange={(e) => {
                          const next = [...hints];
                          next[i] = e.target.value;
                          update({ hints: next.slice(0, 4) });
                        }}
                        placeholder={`Hint ${i + 1}`}
                        className={`h-16 resize-y ${inputClass}`}
                      />
                    ))}
                  </div>
                </div>
                <NumberField label="Max hints" value={q.maxHints ?? 4} onChange={(v) => update({ maxHints: v })} />
                <NumberField
                  label="Hint cooldown (seconds)"
                  value={q.hintCooldownSeconds ?? 0}
                  onChange={(v) => update({ hintCooldownSeconds: v })}
                />

                <div className="col-span-full">
                  <Field label="Expected answer" value={q.expectedAnswer ?? ""} onChange={(v) => update({ expectedAnswer: v })} textarea />
                </div>
                <div className="col-span-full">
                  <Field label="AI prompt" value={q.aiPrompt ?? ""} onChange={(v) => update({ aiPrompt: v })} textarea />
                </div>
                <div className="col-span-full">
                  <CheckboxField label="Required" checked={q.required ?? true} onChange={(v) => update({ required: v })} />
                </div>

                <div className="col-span-full rounded-lg border border-black/10 bg-white p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">AI Review config</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="col-span-full">
                      <Field
                        label="Rubric"
                        value={review.rubric ?? ""}
                        onChange={(v) => setReviewFor(q.id, { ...review, rubric: v })}
                        textarea
                      />
                    </div>
                    <NumberField
                      label="Passing percent"
                      value={review.passingPercent ?? 70}
                      onChange={(v) => setReviewFor(q.id, { ...review, passingPercent: v })}
                    />
                    <div className="col-span-full">
                      <Field
                        label="Suggested answer"
                        value={review.suggestedAnswer ?? ""}
                        onChange={(v) => setReviewFor(q.id, { ...review, suggestedAnswer: v })}
                        textarea
                      />
                    </div>
                  </div>
                </div>
              </>
            );
          }}
        />
      </div>

      <div className="rounded-xl border border-black/[0.08] bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink">Unlock Rules</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <NumberField
            label="Minimum score"
            value={unlockRules.minScore}
            onChange={(v) => setData({ ...data, unlockRules: { ...unlockRules, minScore: v } })}
          />
          <NumberField
            label="Credits required"
            value={unlockRules.creditsRequired}
            onChange={(v) => setData({ ...data, unlockRules: { ...unlockRules, creditsRequired: v } })}
          />
          <div className="col-span-full">
            <StringArrayField
              label="Required sections"
              value={unlockRules.requiredSections}
              onChange={(v) => setData({ ...data, unlockRules: { ...unlockRules, requiredSections: v } })}
            />
          </div>
          <CheckboxField
            label="Unlock videos"
            checked={unlockRules.unlockVideos}
            onChange={(v) => setData({ ...data, unlockRules: { ...unlockRules, unlockVideos: v } })}
          />
          <CheckboxField
            label="Unlock resources"
            checked={unlockRules.unlockResources}
            onChange={(v) => setData({ ...data, unlockRules: { ...unlockRules, unlockResources: v } })}
          />
          <CheckboxField
            label="Unlock certificate"
            checked={unlockRules.unlockCertificate}
            onChange={(v) => setData({ ...data, unlockRules: { ...unlockRules, unlockCertificate: v } })}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-black/[0.08] pt-4">
        <button
          type="button"
          disabled={saveState.status === "saving"}
          onClick={save}
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
        >
          {saveState.status === "saving" ? "Saving…" : "Save Workspace"}
        </button>
        {saveState.status === "saved" && <span className="text-sm font-medium text-brand">Saved.</span>}
        {saveState.status === "error" && (
          <span className="text-sm font-medium text-red-600">{saveState.message ?? "Failed to save."}</span>
        )}
      </div>
    </div>
  );
}
