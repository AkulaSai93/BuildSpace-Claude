"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type {
  ProjectContent,
  ProjectContentSection,
  HubContent,
  CourseContentData,
  ProSolutionData,
  DiscussionData,
  ReviewsData,
} from "@/types/projectContent";
import { hubSections } from "@/lib/learning-hub-data";
import type { ProjectSummary } from "@/types/library";
import type { Certificate } from "@/types/studio";

// ---------------------------------------------------------------------------
// Generic form pieces (styled to match src/app/admin/projects/page.tsx)
// ---------------------------------------------------------------------------

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
  type = "text",
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
      {label} {hint && <span className="font-normal text-ink-muted">{hint}</span>}
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`h-20 resize-y ${inputClass}`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
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

function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className={inputClass}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-ink">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function StringArrayField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
      {label} <span className="font-normal text-ink-muted">(one item per line)</span>
      <textarea
        value={value.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n"))}
        className={`h-28 resize-y ${inputClass}`}
      />
    </label>
  );
}

function ImageUploadField({
  label,
  hint,
  value,
  uploading,
  uploadError,
  onUpload,
  onManualChange,
  onRemove,
}: {
  label: string;
  hint?: string;
  value: string | undefined;
  uploading: boolean;
  uploadError: string | null;
  onUpload: (file: File) => void;
  onManualChange: (v: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 text-xs font-semibold text-ink">
      {label} {hint && <span className="font-normal text-ink-muted">{hint}</span>}
      <div className="flex items-center gap-4">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="size-20 shrink-0 rounded-xl border border-black/[0.08] object-cover"
          />
        ) : (
          <div className="flex size-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-black/15 bg-[#faf9f7] text-[11px] font-normal text-ink-muted">
            No image
          </div>
        )}
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <label className="cursor-pointer rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-black/[0.03]">
              {uploading ? "Uploading…" : value ? "Change image" : "Upload image"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUpload(file);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </label>
            {value && (
              <button
                type="button"
                onClick={onRemove}
                className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            )}
          </div>
          <input
            value={value ?? ""}
            onChange={(e) => onManualChange(e.target.value)}
            placeholder="/images/projects/my-slug/diagram.png"
            className={`text-xs font-normal ${inputClass}`}
          />
          <p className="text-[11px] font-normal text-ink-muted">
            Upload saves to <code>public/images/projects/&lt;slug&gt;/…</code>, or paste a path/URL directly. PNG, JPG, WebP, GIF, SVG — max 8MB.
          </p>
          {uploadError && <p className="text-[11px] font-medium text-red-600">{uploadError}</p>}
        </div>
      </div>
    </div>
  );
}

function ArrayEditor<T>({
  items,
  onChange,
  newItem,
  renderItem,
  addLabel = "+ Add",
  removeLabel = "Remove",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  addLabel?: string;
  removeLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={i} className={cardClass}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {renderItem(
              item,
              (patch) => {
                const next = [...items];
                next[i] = { ...next[i], ...patch };
                onChange(next);
              },
              i
            )}
          </div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className={removeBtnClass}
          >
            {removeLabel}
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, newItem()])} className={addBtnClass}>
        {addLabel}
      </button>
    </div>
  );
}

function RecordArrayField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Record<string, string[]>;
  onChange: (v: Record<string, string[]>) => void;
}) {
  const entries = Object.entries(value);
  const setEntries = (next: [string, string[]][]) => onChange(Object.fromEntries(next));
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-ink">{label}</p>
      {entries.map(([key, items], i) => (
        <div key={i} className={cardClass}>
          <input
            value={key}
            onChange={(e) => {
              const next: [string, string[]][] = [...entries];
              next[i] = [e.target.value, items];
              setEntries(next);
            }}
            placeholder="Key"
            className={`mb-2 w-full font-semibold ${inputClass}`}
          />
          <textarea
            value={items.join("\n")}
            onChange={(e) => {
              const next: [string, string[]][] = [...entries];
              next[i] = [key, e.target.value.split("\n")];
              setEntries(next);
            }}
            placeholder="One item per line"
            className={`h-24 w-full resize-y ${inputClass}`}
          />
          <button
            type="button"
            onClick={() => setEntries(entries.filter((_, idx) => idx !== i))}
            className={removeBtnClass}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => setEntries([...entries, ["", []]])} className={addBtnClass}>
        + Add
      </button>
    </div>
  );
}

type InterviewQ = { type: string; question: string; answer: string };

function InterviewQuestionsField({
  value,
  onChange,
}: {
  value: Record<string, InterviewQ[]>;
  onChange: (v: Record<string, InterviewQ[]>) => void;
}) {
  const entries = Object.entries(value);
  const setEntries = (next: [string, InterviewQ[]][]) => onChange(Object.fromEntries(next));
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-ink">Interview Questions (grouped by category)</p>
      {entries.map(([key, qs], i) => (
        <div key={i} className={cardClass}>
          <input
            value={key}
            onChange={(e) => {
              const next: [string, InterviewQ[]][] = [...entries];
              next[i] = [e.target.value, qs];
              setEntries(next);
            }}
            placeholder="Category (e.g. Technical, Behavioral)"
            className={`mb-2 w-full font-semibold ${inputClass}`}
          />
          <ArrayEditor
            items={qs}
            onChange={(nextQs) => {
              const nextEntries: [string, InterviewQ[]][] = [...entries];
              nextEntries[i] = [key, nextQs];
              setEntries(nextEntries);
            }}
            newItem={() => ({ type: "", question: "", answer: "" })}
            renderItem={(item, update) => (
              <>
                <Field label="Type" value={item.type} onChange={(v) => update({ type: v })} />
                <Field
                  label="Question"
                  value={item.question}
                  onChange={(v) => update({ question: v })}
                  textarea
                />
                <div className="col-span-full">
                  <Field
                    label="Answer"
                    value={item.answer}
                    onChange={(v) => update({ answer: v })}
                    textarea
                  />
                </div>
              </>
            )}
          />
          <button
            type="button"
            onClick={() => setEntries(entries.filter((_, idx) => idx !== i))}
            className={removeBtnClass}
          >
            Remove category
          </button>
        </div>
      ))}
      <button type="button" onClick={() => setEntries([...entries, ["", []]])} className={addBtnClass}>
        + Add category
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Save state + section header
// ---------------------------------------------------------------------------

type SaveState = { status: "idle" | "saving" | "saved" | "error"; message?: string };

function SaveBar({ state, onSave, label }: { state: SaveState; onSave: () => void; label: string }) {
  return (
    <div className="flex items-center gap-3 border-t border-black/[0.08] pt-4">
      <button
        type="button"
        disabled={state.status === "saving"}
        onClick={onSave}
        className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
      >
        {state.status === "saving" ? "Saving…" : `Save ${label}`}
      </button>
      {state.status === "saved" && <span className="text-sm font-medium text-brand">Saved.</span>}
      {state.status === "error" && (
        <span className="text-sm font-medium text-red-600">{state.message ?? "Failed to save."}</span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

const resourceCategories = ["Planning", "Architecture", "Database", "API", "Design", "Code", "DevOps"] as const;

type TopSection =
  | "overview"
  | "learningHub"
  | "courseContent"
  | "discussion"
  | "reviews"
  | "proSolution"
  | "analytics"
  | "settings";

const topSections: { id: TopSection; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "learningHub", label: "Learning Hub" },
  { id: "courseContent", label: "Course Content" },
  { id: "discussion", label: "Discussion" },
  { id: "reviews", label: "Reviews" },
  { id: "proSolution", label: "Pro Solution" },
  { id: "analytics", label: "Analytics" },
  { id: "settings", label: "Settings" },
];

const courseContentSubs = [
  { id: "cc-overview", label: "Overview" },
  { id: "cc-tech-stack", label: "Tech Stack" },
  { id: "cc-resources", label: "Resources" },
  { id: "cc-interview-prep", label: "Interview Prep" },
] as const;

export default function ProjectContentEditorPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;

  const [content, setContent] = useState<ProjectContent | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [hub, setHub] = useState<HubContent | null>(null);
  const [courseContent, setCourseContent] = useState<CourseContentData | null>(null);
  const [proSolution, setProSolution] = useState<ProSolutionData | null>(null);
  const [discussion, setDiscussion] = useState<DiscussionData | null>(null);
  const [reviews, setReviews] = useState<ReviewsData | null>(null);

  const [project, setProject] = useState<ProjectSummary | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);

  const [certificates, setCertificates] = useState<Certificate[] | null>(null);
  const [certError, setCertError] = useState<string | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [activeTop, setActiveTop] = useState<TopSection>("overview");
  const [activeHubSub, setActiveHubSub] = useState<string>(hubSections[0].id);
  const [activeCourseSub, setActiveCourseSub] = useState<string>(courseContentSubs[0].id);

  const [saveStates, setSaveStates] = useState<Record<ProjectContentSection, SaveState>>({
    learningHub: { status: "idle" },
    courseContent: { status: "idle" },
    proSolution: { status: "idle" },
    discussion: { status: "idle" },
    reviews: { status: "idle" },
  });

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/project-content/${encodeURIComponent(slug)}`, { cache: "no-store" });
        const body = await res.json();
        if (!res.ok) {
          setLoadError(body.error ?? "Failed to load project content");
          return;
        }
        const c: ProjectContent = body.content;
        setContent(c);
        setHub(c.learningHub);
        setCourseContent(c.courseContent);
        setProSolution(c.proSolution);
        setDiscussion(c.discussion);
        setReviews(c.reviews);
      } catch {
        setLoadError("Failed to load project content");
      }
    })();
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/projects/${encodeURIComponent(slug)}`, { cache: "no-store" });
        const body = await res.json();
        if (!res.ok) {
          setProjectError(body.error ?? "Failed to load project");
          return;
        }
        setProject(body.project);
        setCreatedAt(body.createdAt ?? null);
        setUpdatedAt(body.updatedAt ?? null);
      } catch {
        setProjectError("Failed to load project");
      }
    })();
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/projects/${encodeURIComponent(slug)}/certificates`, { cache: "no-store" });
        const body = await res.json();
        if (!res.ok) {
          setCertError(body.error ?? "Failed to load certificates");
          return;
        }
        setCertificates(body.certificates);
      } catch {
        setCertError("Failed to load certificates");
      }
    })();
  }, [slug]);

  async function handleDeleteProject() {
    if (!confirm(`Delete "${project?.title ?? slug}"? This cannot be undone.`)) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/projects/${encodeURIComponent(slug)}`, { method: "DELETE" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDeleteError(body.error ?? "Failed to delete project");
        setDeleting(false);
        return;
      }
      router.push("/admin/projects");
    } catch {
      setDeleteError("Network error while deleting");
      setDeleting(false);
    }
  }

  const setSaveState = (section: ProjectContentSection, state: SaveState) =>
    setSaveStates((s) => ({ ...s, [section]: state }));

  async function save(section: ProjectContentSection, data: ProjectContent[ProjectContentSection]) {
    setSaveState(section, { status: "saving" });
    try {
      const res = await fetch(`/api/admin/project-content/${encodeURIComponent(slug)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveState(section, { status: "error", message: body.error ?? "Failed to save" });
        return;
      }
      setSaveState(section, { status: "saved" });
      setContent((c) => (c ? { ...c, [section]: data } : c));
      setTimeout(() => setSaveState(section, { status: "idle" }), 2500);
    } catch {
      setSaveState(section, { status: "error", message: "Network error while saving" });
    }
  }

  if (loadError) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/admin/projects" className="text-sm font-medium text-brand hover:underline">
          ← Back to projects
        </Link>
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{loadError}</p>
      </div>
    );
  }

  if (!content || !hub || !courseContent || !proSolution || !discussion || !reviews) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/admin/projects" className="text-sm font-medium text-brand hover:underline">
          ← Back to projects
        </Link>
        <p className="text-sm text-ink-muted">Loading project content…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link href="/admin/projects" className="text-sm font-medium text-brand hover:underline">
          ← Back to projects
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-brand">Project Studio</h1>
        <p className="text-sm text-ink-muted">{slug}</p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Second-level sidebar */}
        <aside className="flex shrink-0 flex-col gap-4 lg:w-56">
          <nav className="flex flex-col gap-1 rounded-xl border border-black/[0.08] bg-white p-2">
            {topSections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveTop(s.id)}
                className={`rounded-full px-3.5 py-2 text-left text-sm font-medium transition-colors ${
                  activeTop === s.id ? "bg-brand-light text-brand" : "text-ink hover:bg-black/[0.03]"
                }`}
              >
                {s.label}
              </button>
            ))}
            <Link href={`/admin/projects/${slug}/workspace`} className="rounded-full px-3.5 py-2 text-left text-sm font-medium text-ink hover:bg-black/[0.03]">Workspace Builder</Link>
          </nav>

          {activeTop === "learningHub" && (
            <nav className="flex flex-col gap-1 rounded-xl border border-black/[0.08] bg-white p-2">
              <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                Learning Hub
              </p>
              {hubSections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveHubSub(s.id)}
                  className={`rounded-full px-3.5 py-2 text-left text-xs font-medium transition-colors ${
                    activeHubSub === s.id ? "bg-brand-light text-brand" : "text-ink hover:bg-black/[0.03]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          )}

          {activeTop === "courseContent" && (
            <nav className="flex flex-col gap-1 rounded-xl border border-black/[0.08] bg-white p-2">
              <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                Course Content
              </p>
              {courseContentSubs.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveCourseSub(s.id)}
                  className={`rounded-full px-3.5 py-2 text-left text-xs font-medium transition-colors ${
                    activeCourseSub === s.id ? "bg-brand-light text-brand" : "text-ink hover:bg-black/[0.03]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          )}
        </aside>

        {/* Editor panel */}
        <div className="min-w-0 flex-1 rounded-xl border border-black/[0.08] bg-white p-5">
          {activeTop === "overview" && (
            <OverviewTab slug={slug} project={project} error={projectError} />
          )}
          {activeTop === "analytics" && (
            <AnalyticsTab project={project} certificates={certificates} error={certError} />
          )}
          {activeTop === "settings" && (
            <SettingsTab
              slug={slug}
              createdAt={createdAt}
              updatedAt={updatedAt}
              deleting={deleting}
              deleteError={deleteError}
              onDelete={handleDeleteProject}
            />
          )}
          {activeTop === "learningHub" && (
            <LearningHubEditor
              sub={activeHubSub}
              hub={hub}
              setHub={setHub}
              saveState={saveStates.learningHub}
              onSave={() => save("learningHub", hub)}
              slug={slug}
            />
          )}
          {activeTop === "courseContent" && (
            <CourseContentEditor
              sub={activeCourseSub}
              data={courseContent}
              setData={setCourseContent}
              saveState={saveStates.courseContent}
              onSave={() => save("courseContent", courseContent)}
            />
          )}
          {activeTop === "discussion" && (
            <DiscussionEditor
              data={discussion}
              setData={setDiscussion}
              saveState={saveStates.discussion}
              onSave={() => save("discussion", discussion)}
            />
          )}
          {activeTop === "reviews" && (
            <ReviewsEditor
              data={reviews}
              setData={setReviews}
              saveState={saveStates.reviews}
              onSave={() => save("reviews", reviews)}
            />
          )}
          {activeTop === "proSolution" && (
            <ProSolutionEditor
              data={proSolution}
              setData={setProSolution}
              saveState={saveStates.proSolution}
              onSave={() => save("proSolution", proSolution)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Learning Hub
// ---------------------------------------------------------------------------

type HubImageKind = "architecture-diagram" | "database-diagram" | "folder-structure";

function LearningHubEditor({
  sub,
  hub,
  setHub,
  saveState,
  onSave,
  slug,
}: {
  sub: string;
  hub: HubContent;
  setHub: (h: HubContent) => void;
  saveState: SaveState;
  onSave: () => void;
  slug: string;
}) {
  const label = hubSections.find((s) => s.id === sub)?.label ?? "Learning Hub";

  const [imageState, setImageState] = useState<
    Record<HubImageKind, { uploading: boolean; error: string | null }>
  >({
    "architecture-diagram": { uploading: false, error: null },
    "database-diagram": { uploading: false, error: null },
    "folder-structure": { uploading: false, error: null },
  });

  async function uploadHubImage(kind: HubImageKind, file: File, onSuccess: (path: string) => void) {
    setImageState((s) => ({ ...s, [kind]: { uploading: true, error: null } }));
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("slug", slug);
      fd.append("kind", kind);
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setImageState((s) => ({ ...s, [kind]: { uploading: false, error: body.error ?? "Failed to upload image" } }));
        return;
      }
      setImageState((s) => ({ ...s, [kind]: { uploading: false, error: null } }));
      onSuccess(body.path);
    } catch {
      setImageState((s) => ({ ...s, [kind]: { uploading: false, error: "Network error while uploading" } }));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-ink">{label}</h2>

      {sub === "overview" && (
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Meta</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Difficulty" value={hub.meta.difficulty} onChange={(v) => setHub({ ...hub, meta: { ...hub.meta, difficulty: v } })} />
            <Field label="Duration" value={hub.meta.duration} onChange={(v) => setHub({ ...hub, meta: { ...hub.meta, duration: v } })} />
            <Field label="Students" value={hub.meta.students} onChange={(v) => setHub({ ...hub, meta: { ...hub.meta, students: v } })} />
            <Field label="Resources" value={hub.meta.resources} onChange={(v) => setHub({ ...hub, meta: { ...hub.meta, resources: v } })} />
            <Field label="Certificate" value={hub.meta.certificate} onChange={(v) => setHub({ ...hub, meta: { ...hub.meta, certificate: v } })} />
            <Field label="Status" value={hub.meta.status} onChange={(v) => setHub({ ...hub, meta: { ...hub.meta, status: v } })} />
            <Field
              label="Instructor name"
              value={hub.meta.instructor.name}
              onChange={(v) => setHub({ ...hub, meta: { ...hub.meta, instructor: { ...hub.meta.instructor, name: v } } })}
            />
            <Field
              label="Instructor title"
              value={hub.meta.instructor.title}
              onChange={(v) => setHub({ ...hub, meta: { ...hub.meta, instructor: { ...hub.meta.instructor, title: v } } })}
            />
            <div className="col-span-full">
              <StringArrayField
                label="Tech stack"
                value={hub.meta.techStack}
                onChange={(v) => setHub({ ...hub, meta: { ...hub.meta, techStack: v } })}
              />
            </div>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Overview</p>
          <Field
            label="Description"
            textarea
            value={hub.overview.description}
            onChange={(v) => setHub({ ...hub, overview: { ...hub.overview, description: v } })}
          />
          <Field
            label="Why this project"
            textarea
            value={hub.overview.whyThisProject}
            onChange={(v) => setHub({ ...hub, overview: { ...hub.overview, whyThisProject: v } })}
          />
          <StringArrayField
            label="What you'll build"
            value={hub.overview.whatYoullBuild}
            onChange={(v) => setHub({ ...hub, overview: { ...hub.overview, whatYoullBuild: v } })}
          />
          <StringArrayField
            label="Success criteria"
            value={hub.overview.successCriteria}
            onChange={(v) => setHub({ ...hub, overview: { ...hub.overview, successCriteria: v } })}
          />
          <div>
            <p className="mb-2 text-xs font-semibold text-ink">Timeline</p>
            <ArrayEditor
              items={hub.overview.timeline}
              onChange={(timeline) => setHub({ ...hub, overview: { ...hub.overview, timeline } })}
              newItem={() => ({ range: "", label: "", detail: "" })}
              renderItem={(item, update) => (
                <>
                  <Field label="Range" value={item.range} onChange={(v) => update({ range: v })} />
                  <Field label="Label" value={item.label} onChange={(v) => update({ label: v })} />
                  <div className="col-span-full">
                    <Field label="Detail" value={item.detail} onChange={(v) => update({ detail: v })} textarea />
                  </div>
                </>
              )}
            />
          </div>
        </div>
      )}

      {sub === "business-problem" && (
        <div className="flex flex-col gap-4">
          <Field label="Intro" textarea value={hub.businessProblem.intro} onChange={(v) => setHub({ ...hub, businessProblem: { ...hub.businessProblem, intro: v } })} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Industry" value={hub.businessProblem.industry} onChange={(v) => setHub({ ...hub, businessProblem: { ...hub.businessProblem, industry: v } })} />
            <Field label="Stat" value={hub.businessProblem.stat} onChange={(v) => setHub({ ...hub, businessProblem: { ...hub.businessProblem, stat: v } })} />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-ink">Pain points</p>
            <ArrayEditor
              items={hub.businessProblem.painPoints}
              onChange={(painPoints) => setHub({ ...hub, businessProblem: { ...hub.businessProblem, painPoints } })}
              newItem={() => ({ title: "", desc: "" })}
              renderItem={(item, update) => (
                <>
                  <Field label="Title" value={item.title} onChange={(v) => update({ title: v })} />
                  <Field label="Description" value={item.desc} onChange={(v) => update({ desc: v })} textarea />
                </>
              )}
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-ink">Target users</p>
            <ArrayEditor
              items={hub.businessProblem.targetUsers}
              onChange={(targetUsers) => setHub({ ...hub, businessProblem: { ...hub.businessProblem, targetUsers } })}
              newItem={() => ({ title: "", desc: "" })}
              renderItem={(item, update) => (
                <>
                  <Field label="Title" value={item.title} onChange={(v) => update({ title: v })} />
                  <Field label="Description" value={item.desc} onChange={(v) => update({ desc: v })} textarea />
                </>
              )}
            />
          </div>
        </div>
      )}

      {sub === "learning-objectives" && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold text-ink">Objective categories</p>
            <ArrayEditor
              items={hub.learningObjectives}
              onChange={(learningObjectives) => setHub({ ...hub, learningObjectives })}
              newItem={() => ({ category: "", items: [] })}
              renderItem={(item, update) => (
                <>
                  <Field label="Category" value={item.category} onChange={(v) => update({ category: v })} />
                  <StringArrayField label="Items" value={item.items} onChange={(v) => update({ items: v })} />
                </>
              )}
            />
          </div>
          <Field
            label="Closing statement"
            textarea
            value={hub.learningObjectivesClosing}
            onChange={(v) => setHub({ ...hub, learningObjectivesClosing: v })}
          />
        </div>
      )}

      {sub === "product-requirements" && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold text-ink">Core requirements</p>
            <ArrayEditor
              items={hub.productRequirements.core}
              onChange={(core) => setHub({ ...hub, productRequirements: { ...hub.productRequirements, core } })}
              newItem={() => ({ feature: "", spec: "", priority: "" })}
              renderItem={(item, update) => (
                <>
                  <Field label="Feature" value={item.feature} onChange={(v) => update({ feature: v })} />
                  <Field label="Priority" value={item.priority} onChange={(v) => update({ priority: v })} />
                  <div className="col-span-full">
                    <Field label="Spec" value={item.spec} onChange={(v) => update({ spec: v })} textarea />
                  </div>
                </>
              )}
            />
          </div>
          <StringArrayField
            label="Optional requirements"
            value={hub.productRequirements.optional}
            onChange={(optional) => setHub({ ...hub, productRequirements: { ...hub.productRequirements, optional } })}
          />
          <StringArrayField
            label="Constraints"
            value={hub.productRequirements.constraints}
            onChange={(constraints) => setHub({ ...hub, productRequirements: { ...hub.productRequirements, constraints } })}
          />
        </div>
      )}

      {sub === "user-journey" && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold text-ink">Journey steps</p>
            <ArrayEditor
              items={hub.userJourney}
              onChange={(userJourney) => setHub({ ...hub, userJourney })}
              newItem={() => ({ actor: "", step: "" })}
              renderItem={(item, update) => (
                <>
                  <Field label="Actor" value={item.actor} onChange={(v) => update({ actor: v })} />
                  <Field label="Step" value={item.step} onChange={(v) => update({ step: v })} textarea />
                </>
              )}
            />
          </div>
          <StringArrayField label="Edge cases" value={hub.edgeCases} onChange={(edgeCases) => setHub({ ...hub, edgeCases })} />
        </div>
      )}

      {sub === "architecture" && (
        <div className="flex flex-col gap-4">
          <ImageUploadField
            label="Architecture diagram (optional)"
            value={hub.architecture.diagramUrl}
            uploading={imageState["architecture-diagram"].uploading}
            uploadError={imageState["architecture-diagram"].error}
            onUpload={(file) =>
              uploadHubImage("architecture-diagram", file, (path) =>
                setHub({ ...hub, architecture: { ...hub.architecture, diagramUrl: path } })
              )
            }
            onManualChange={(v) => setHub({ ...hub, architecture: { ...hub.architecture, diagramUrl: v } })}
            onRemove={() => setHub({ ...hub, architecture: { ...hub.architecture, diagramUrl: "" } })}
          />
          <Field
            label="Description"
            textarea
            value={hub.architecture.description}
            onChange={(v) => setHub({ ...hub, architecture: { ...hub.architecture, description: v } })}
          />
          <StringArrayField
            label="Service communication"
            value={hub.architecture.serviceCommunication}
            onChange={(v) => setHub({ ...hub, architecture: { ...hub.architecture, serviceCommunication: v } })}
          />
          <RecordArrayField
            label="Layers"
            value={hub.architecture.layers}
            onChange={(layers) => setHub({ ...hub, architecture: { ...hub.architecture, layers } })}
          />
          <Field
            label="Notes"
            textarea
            value={hub.architecture.notes}
            onChange={(v) => setHub({ ...hub, architecture: { ...hub.architecture, notes: v } })}
          />
        </div>
      )}

      {sub === "database-design" && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold text-ink">Tables</p>
            <ArrayEditor
              items={hub.databaseDesign}
              onChange={(databaseDesign) => setHub({ ...hub, databaseDesign })}
              newItem={() => ({ table: "", columns: "" })}
              renderItem={(item, update) => (
                <>
                  <Field label="Table" value={item.table} onChange={(v) => update({ table: v })} />
                  <Field label="Columns" value={item.columns} onChange={(v) => update({ columns: v })} textarea />
                </>
              )}
            />
          </div>
          <Field label="Sample schema (SQL)" textarea value={hub.sampleSchema} onChange={(v) => setHub({ ...hub, sampleSchema: v })} />
          <ImageUploadField
            label="Database ERD / schema diagram (optional)"
            value={hub.databaseDiagramUrl}
            uploading={imageState["database-diagram"].uploading}
            uploadError={imageState["database-diagram"].error}
            onUpload={(file) =>
              uploadHubImage("database-diagram", file, (path) => setHub({ ...hub, databaseDiagramUrl: path }))
            }
            onManualChange={(v) => setHub({ ...hub, databaseDiagramUrl: v })}
            onRemove={() => setHub({ ...hub, databaseDiagramUrl: "" })}
          />
        </div>
      )}

      {sub === "api-documentation" && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold text-ink">Endpoints</p>
            <ArrayEditor
              items={hub.apiDocumentation}
              onChange={(apiDocumentation) => setHub({ ...hub, apiDocumentation })}
              newItem={() => ({ method: "GET", path: "", description: "" })}
              renderItem={(item, update) => (
                <>
                  <Field label="Method" value={item.method} onChange={(v) => update({ method: v })} />
                  <Field label="Path" value={item.path} onChange={(v) => update({ path: v })} />
                  <div className="col-span-full">
                    <Field label="Description" value={item.description} onChange={(v) => update({ description: v })} textarea />
                  </div>
                </>
              )}
            />
          </div>
          <Field label="Auth note" textarea value={hub.apiAuthNote} onChange={(v) => setHub({ ...hub, apiAuthNote: v })} />
          <Field label="Example (request/response)" textarea value={hub.apiExample} onChange={(v) => setHub({ ...hub, apiExample: v })} />
        </div>
      )}

      {sub === "folder-structure" && (
        <div className="flex flex-col gap-4">
          <ImageUploadField
            label="Folder structure screenshot (optional)"
            value={hub.folderStructureImageUrl}
            uploading={imageState["folder-structure"].uploading}
            uploadError={imageState["folder-structure"].error}
            onUpload={(file) =>
              uploadHubImage("folder-structure", file, (path) => setHub({ ...hub, folderStructureImageUrl: path }))
            }
            onManualChange={(v) => setHub({ ...hub, folderStructureImageUrl: v })}
            onRemove={() => setHub({ ...hub, folderStructureImageUrl: "" })}
          />
          <StringArrayField label="Folder structure" value={hub.folderStructure} onChange={(folderStructure) => setHub({ ...hub, folderStructure })} />
          <div>
            <p className="mb-2 text-xs font-semibold text-ink">Naming conventions</p>
            <ArrayEditor
              items={hub.namingConventions}
              onChange={(namingConventions) => setHub({ ...hub, namingConventions })}
              newItem={() => ({ label: "", value: "" })}
              renderItem={(item, update) => (
                <>
                  <Field label="Label" value={item.label} onChange={(v) => update({ label: v })} />
                  <Field label="Value" value={item.value} onChange={(v) => update({ value: v })} />
                </>
              )}
            />
          </div>
        </div>
      )}

      {sub === "resources" && (
        <p className="text-sm text-ink-muted">
          Downloadable resource files are managed under <span className="font-semibold text-ink">Course Content → Resources</span>.
        </p>
      )}

      {sub === "faqs" && (
        <ArrayEditor
          items={hub.faqs}
          onChange={(faqs) => setHub({ ...hub, faqs })}
          newItem={() => ({ question: "", answer: "" })}
          renderItem={(item, update) => (
            <>
              <div className="col-span-full">
                <Field label="Question" value={item.question} onChange={(v) => update({ question: v })} />
              </div>
              <div className="col-span-full">
                <Field label="Answer" value={item.answer} onChange={(v) => update({ answer: v })} textarea />
              </div>
            </>
          )}
        />
      )}

      {sub !== "resources" && <SaveBar state={saveState} onSave={onSave} label="Learning Hub" />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Course Content
// ---------------------------------------------------------------------------

function CourseContentEditor({
  sub,
  data,
  setData,
  saveState,
  onSave,
}: {
  sub: string;
  data: CourseContentData;
  setData: (d: CourseContentData) => void;
  saveState: SaveState;
  onSave: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-ink">
        Course Content — {courseContentSubs.find((s) => s.id === sub)?.label}
      </h2>

      {sub === "cc-overview" && (
        <div className="flex flex-col gap-4">
          <Field
            label="Business problem paragraph"
            textarea
            value={data.businessProblemParagraph}
            onChange={(v) => setData({ ...data, businessProblemParagraph: v })}
          />
          <StringArrayField label="What you'll build" value={data.whatYoullBuild} onChange={(v) => setData({ ...data, whatYoullBuild: v })} />
          <StringArrayField label="Learning outcomes" value={data.learningOutcomes} onChange={(v) => setData({ ...data, learningOutcomes: v })} />
          <StringArrayField label="Prerequisites" value={data.prerequisites} onChange={(v) => setData({ ...data, prerequisites: v })} />
          <RecordArrayField label="System architecture" value={data.systemArchitecture} onChange={(systemArchitecture) => setData({ ...data, systemArchitecture })} />
        </div>
      )}

      {sub === "cc-tech-stack" && (
        <ArrayEditor
          items={data.techStackDetail}
          onChange={(techStackDetail) => setData({ ...data, techStackDetail })}
          newItem={() => ({
            name: "",
            initials: "",
            version: "",
            role: "",
            category: "",
            whyWeChoseIt: "",
            difficulty: "Beginner",
          })}
          renderItem={(item, update) => (
            <>
              <Field label="Name" value={item.name} onChange={(v) => update({ name: v })} />
              <Field label="Initials" value={item.initials} onChange={(v) => update({ initials: v })} />
              <Field label="Version" value={item.version} onChange={(v) => update({ version: v })} />
              <Field label="Role" value={item.role} onChange={(v) => update({ role: v })} />
              <Field label="Category" value={item.category} onChange={(v) => update({ category: v })} />
              <SelectField
                label="Difficulty"
                value={item.difficulty}
                onChange={(v) => update({ difficulty: v })}
                options={["Beginner", "Intermediate", "Advanced"] as const}
              />
              <div className="col-span-full">
                <Field label="Why we chose it" value={item.whyWeChoseIt} onChange={(v) => update({ whyWeChoseIt: v })} textarea />
              </div>
            </>
          )}
        />
      )}

      {sub === "cc-resources" && (
        <ArrayEditor
          items={data.resourceFiles}
          onChange={(resourceFiles) => setData({ ...data, resourceFiles })}
          newItem={() => ({ name: "", type: "", size: "", downloads: "0", category: "Planning" })}
          renderItem={(item, update) => (
            <>
              <Field label="Name" value={item.name} onChange={(v) => update({ name: v })} />
              <Field label="Type" value={item.type} onChange={(v) => update({ type: v })} />
              <Field label="Size" value={item.size} onChange={(v) => update({ size: v })} />
              <Field label="Downloads" value={item.downloads} onChange={(v) => update({ downloads: v })} />
              <SelectField label="Category" value={item.category} onChange={(v) => update({ category: v })} options={resourceCategories} />
            </>
          )}
        />
      )}

      {sub === "cc-interview-prep" && (
        <InterviewQuestionsField value={data.interviewQuestions} onChange={(interviewQuestions) => setData({ ...data, interviewQuestions })} />
      )}

      <SaveBar state={saveState} onSave={onSave} label="Course Content" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Discussion
// ---------------------------------------------------------------------------

function DiscussionEditor({
  data,
  setData,
  saveState,
  onSave,
}: {
  data: DiscussionData;
  setData: (d: DiscussionData) => void;
  saveState: SaveState;
  onSave: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-ink">Discussion</h2>
      <ArrayEditor
        items={data.comments}
        onChange={(comments) => setData({ comments })}
        newItem={() => ({ initials: "", name: "", time: "", body: "", likes: 0 })}
        renderItem={(item, update) => (
          <>
            <Field label="Initials" value={item.initials} onChange={(v) => update({ initials: v })} />
            <Field label="Name" value={item.name} onChange={(v) => update({ name: v })} />
            <Field label="Time" value={item.time} onChange={(v) => update({ time: v })} placeholder="2 days ago" />
            <NumberField label="Likes" value={item.likes} onChange={(v) => update({ likes: v })} />
            <div className="col-span-full">
              <Field label="Comment body" value={item.body} onChange={(v) => update({ body: v })} textarea />
            </div>

            <div className="col-span-full">
              <CheckboxField
                label="Has a reply"
                checked={!!item.reply}
                onChange={(checked) =>
                  update({
                    reply: checked
                      ? item.reply ?? { initials: "", name: "", time: "", body: "", isInstructor: false }
                      : undefined,
                  })
                }
              />
            </div>

            {item.reply && (
              <div className="col-span-full grid grid-cols-1 gap-2 rounded-lg border border-black/10 bg-white p-3 sm:grid-cols-2">
                <Field
                  label="Reply initials"
                  value={item.reply.initials}
                  onChange={(v) => update({ reply: { ...item.reply!, initials: v } })}
                />
                <Field
                  label="Reply name"
                  value={item.reply.name}
                  onChange={(v) => update({ reply: { ...item.reply!, name: v } })}
                />
                <Field
                  label="Reply time"
                  value={item.reply.time}
                  onChange={(v) => update({ reply: { ...item.reply!, time: v } })}
                />
                <CheckboxField
                  label="Is instructor"
                  checked={!!item.reply.isInstructor}
                  onChange={(v) => update({ reply: { ...item.reply!, isInstructor: v } })}
                />
                <div className="col-span-full">
                  <Field
                    label="Reply body"
                    value={item.reply.body}
                    onChange={(v) => update({ reply: { ...item.reply!, body: v } })}
                    textarea
                  />
                </div>
              </div>
            )}
          </>
        )}
      />
      <SaveBar state={saveState} onSave={onSave} label="Discussion" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

function ReviewsEditor({
  data,
  setData,
  saveState,
  onSave,
}: {
  data: ReviewsData;
  setData: (d: ReviewsData) => void;
  saveState: SaveState;
  onSave: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-ink">Reviews</h2>

      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Summary</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <NumberField
          label="Average rating"
          value={data.summary.average}
          onChange={(v) => setData({ ...data, summary: { ...data.summary, average: v } })}
        />
        <NumberField
          label="Total reviews"
          value={data.summary.total}
          onChange={(v) => setData({ ...data, summary: { ...data.summary, total: v } })}
        />
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold text-ink">Rating breakdown</p>
        <ArrayEditor
          items={data.summary.breakdown}
          onChange={(breakdown) => setData({ ...data, summary: { ...data.summary, breakdown } })}
          newItem={() => ({ stars: 5, percent: 0 })}
          renderItem={(item, update) => (
            <>
              <NumberField label="Stars" value={item.stars} onChange={(v) => update({ stars: v })} />
              <NumberField label="Percent" value={item.percent} onChange={(v) => update({ percent: v })} />
            </>
          )}
        />
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Reviews</p>
      <ArrayEditor
        items={data.reviews}
        onChange={(reviews) => setData({ ...data, reviews })}
        newItem={() => ({ initials: "", name: "", role: "", rating: 5, date: "", title: "", body: "", helpful: 0 })}
        renderItem={(item, update) => (
          <>
            <Field label="Initials" value={item.initials} onChange={(v) => update({ initials: v })} />
            <Field label="Name" value={item.name} onChange={(v) => update({ name: v })} />
            <Field label="Role" value={item.role} onChange={(v) => update({ role: v })} />
            <NumberField label="Rating" value={item.rating} onChange={(v) => update({ rating: v })} />
            <Field label="Date" value={item.date} onChange={(v) => update({ date: v })} />
            <NumberField label="Helpful count" value={item.helpful} onChange={(v) => update({ helpful: v })} />
            <div className="col-span-full">
              <Field label="Title" value={item.title} onChange={(v) => update({ title: v })} />
            </div>
            <div className="col-span-full">
              <Field label="Body" value={item.body} onChange={(v) => update({ body: v })} textarea />
            </div>
          </>
        )}
      />
      <SaveBar state={saveState} onSave={onSave} label="Reviews" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------------

function OverviewTab({
  slug,
  project,
  error,
}: {
  slug: string;
  project: ProjectSummary | null;
  error: string | null;
}) {
  if (error) {
    return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>;
  }
  if (!project) {
    return <p className="text-sm text-ink-muted">Loading project overview…</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Overview</h2>
        <Link
          href="/admin/projects"
          className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-black/[0.03]"
        >
          Edit catalog fields
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[160px_1fr]">
        {project.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.thumbnail}
            alt={project.title}
            className="h-32 w-full rounded-lg border border-black/10 object-cover sm:w-40"
          />
        ) : (
          <div className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-black/10 text-xs text-ink-muted sm:w-40">
            No thumbnail
          </div>
        )}
        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold text-ink">{project.title}</p>
          <p className="text-sm text-ink-muted">{project.shortDescription}</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-brand-light px-2.5 py-1 font-semibold text-brand">{project.category}</span>
            <span className="rounded-full bg-black/[0.04] px-2.5 py-1 font-semibold text-ink-muted">{project.level}</span>
            <span className={`rounded-full px-2.5 py-1 font-semibold ${statusBadgeClass(project.publishStatus)}`}>
              {statusLabel(project.publishStatus)}
            </span>
            {project.isPro && (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">Pro</span>
            )}
          </div>
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <span key={t} className="rounded-full border border-black/10 px-2 py-0.5 text-xs text-ink-muted">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox label="Rating" value={project.rating.toFixed(1)} />
        <StatBox label="Reviews" value={String(project.reviewCount)} />
        <StatBox label="Videos" value={String(project.videoCount)} />
        <StatBox label="Learners" value={project.learners} />
      </div>

      <p className="text-xs text-ink-muted">
        Slug: <span className="font-mono">{slug}</span> · Instructor: {project.instructor.name} ({project.instructor.title})
      </p>
    </div>
  );
}

function statusBadgeClass(status: ProjectSummary["publishStatus"]) {
  switch (status ?? "published") {
    case "draft":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "archived":
      return "bg-black/[0.04] text-ink-muted border border-black/10";
    default:
      return "bg-brand-light text-brand border border-brand/20";
  }
}

function statusLabel(status: ProjectSummary["publishStatus"]) {
  switch (status ?? "published") {
    case "draft":
      return "Draft";
    case "archived":
      return "Archived";
    default:
      return "Published";
  }
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

function AnalyticsTab({
  project,
  certificates,
  error,
}: {
  project: ProjectSummary | null;
  certificates: Certificate[] | null;
  error: string | null;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-ink">Analytics</h2>

      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Reviews (from catalog)</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatBox label="Average rating" value={project ? project.rating.toFixed(1) : "—"} />
        <StatBox label="Review count" value={project ? String(project.reviewCount) : "—"} />
        <StatBox label="Learners" value={project ? project.learners : "—"} />
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Certificates issued</p>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}
      {!certificates && !error && <p className="text-sm text-ink-muted">Loading certificate stats…</p>}
      {certificates && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatBox label="Total certificates" value={String(certificates.length)} />
            <StatBox
              label="Elite tier"
              value={String(certificates.filter((c) => c.tier === "elite").length)}
            />
            <StatBox
              label="Standard tier"
              value={String(certificates.filter((c) => c.tier === "standard").length)}
            />
          </div>
          {certificates.length === 0 && (
            <p className="text-sm text-ink-muted">No certificates have been issued for this project yet.</p>
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

function SettingsTab({
  slug,
  createdAt,
  updatedAt,
  deleting,
  deleteError,
  onDelete,
}: {
  slug: string;
  createdAt: string | null;
  updatedAt: string | null;
  deleting: boolean;
  deleteError: string | null;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-ink">Settings</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Slug</p>
          <p className="font-mono text-sm text-ink">{slug}</p>
        </div>
        <div className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Created</p>
          <p className="text-sm text-ink">{createdAt ? new Date(createdAt).toLocaleString() : "—"}</p>
        </div>
        <div className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Last updated</p>
          <p className="text-sm text-ink">{updatedAt ? new Date(updatedAt).toLocaleString() : "—"}</p>
        </div>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-semibold text-red-700">Danger zone</p>
        <p className="mt-1 text-xs text-red-600">
          Deleting this project removes it and all of its content (Learning Hub, Course Content, Discussion,
          Reviews, Pro Solution) permanently. This cannot be undone.
        </p>
        {deleteError && <p className="mt-2 text-xs font-medium text-red-700">{deleteError}</p>}
        <button
          type="button"
          disabled={deleting}
          onClick={onDelete}
          className="mt-3 rounded-full border border-red-300 bg-white px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete this project"}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pro Solution
// ---------------------------------------------------------------------------

function ProSolutionEditor({
  data,
  setData,
  saveState,
  onSave,
}: {
  data: ProSolutionData;
  setData: (d: ProSolutionData) => void;
  saveState: SaveState;
  onSave: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-ink">Pro Solution</h2>
      <ArrayEditor
        items={data.walkthroughs}
        onChange={(walkthroughs) => setData({ walkthroughs })}
        newItem={() => ({ title: "", duration: "", desc: "" })}
        renderItem={(item, update) => (
          <>
            <Field label="Title" value={item.title} onChange={(v) => update({ title: v })} />
            <Field label="Duration" value={item.duration} onChange={(v) => update({ duration: v })} placeholder="12:30" />
            <div className="col-span-full">
              <Field label="Description" value={item.desc} onChange={(v) => update({ desc: v })} textarea />
            </div>
          </>
        )}
      />
      <SaveBar state={saveState} onSave={onSave} label="Pro Solution" />
    </div>
  );
}
