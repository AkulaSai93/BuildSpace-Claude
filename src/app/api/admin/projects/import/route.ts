import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getProject, createProject, updateProject } from "@/lib/projectsData";
import { getProjectContent, saveProjectContentSection } from "@/lib/projectContentData";
import { parseCsv, rowsToObjects } from "@/lib/csv";
import type { ProjectSummary } from "@/types/library";
import type { HubContent, CourseContentData } from "@/types/projectContent";

const validCategories = new Set([
  "Full Stack",
  "Frontend",
  "Backend",
  "AI / ML",
  "Mobile",
  "Cloud / DevOps",
  "Blockchain",
  "Cyber Security",
  "IoT",
]);
const validLevels = new Set(["Beginner", "Intermediate", "Advanced"]);

interface RowResult {
  row: number;
  slug: string;
  status: "created" | "updated" | "skipped";
  reason?: string;
}

function toBool(value: string) {
  return ["true", "1", "yes", "pro"].includes(value.trim().toLowerCase());
}

// Optional Learning Hub columns. All are optional — a row with none of
// these filled in only touches the catalog record. Any row that sets at
// least one of these merges into that project's existing learningHub
// section (via project_content), rather than overwriting sections the
// admin hasn't touched from the CSV.
function parseJsonColumn<T>(raw: string | undefined, fallback: T): { value: T; error?: string } {
  if (!raw || !raw.trim()) return { value: fallback };
  try {
    return { value: JSON.parse(raw) as T };
  } catch {
    return { value: fallback, error: `Invalid JSON` };
  }
}

function buildHubPatch(r: Record<string, string>): { patch: Partial<HubContent>; touched: boolean; errors: string[] } {
  const patch: Partial<HubContent> = {};
  const errors: string[] = [];
  let touched = false;

  const setText = (key: keyof HubContent, value: string | undefined) => {
    if (value && value.trim()) {
      (patch as Record<string, unknown>)[key as string] = value.trim();
      touched = true;
    }
  };

  // Simple text fields.
  if (r.overviewDescription?.trim()) {
    patch.overview = { description: r.overviewDescription.trim(), whyThisProject: r.whyThisProject ?? "", whatYoullBuild: [], timeline: [], successCriteria: [] };
    touched = true;
  }
  if (r.problemStatement?.trim() || r.businessProblemIndustry?.trim() || r.businessProblemStat?.trim()) {
    patch.businessProblem = {
      intro: r.problemStatement ?? "",
      industry: r.businessProblemIndustry ?? "",
      stat: r.businessProblemStat ?? "",
      painPoints: [],
      targetUsers: [],
    };
    touched = true;
  }
  if (r.architectureDescription?.trim() || r.architectureNotes?.trim()) {
    patch.architecture = {
      description: r.architectureDescription ?? "",
      notes: r.architectureNotes ?? "",
      serviceCommunication: [],
      layers: {},
    };
    touched = true;
  }
  setText("sampleSchema", r.sampleSchema);
  setText("apiAuthNote", r.apiAuthNote);
  setText("apiExample", r.apiExample);
  setText("learningObjectivesClosing", r.learningObjectivesClosing);

  if (r.productRequirementsJson?.trim()) {
    const { value, error } = parseJsonColumn<HubContent["productRequirements"]>(r.productRequirementsJson, undefined as unknown as HubContent["productRequirements"]);
    if (error) {
      errors.push(`productRequirementsJson: ${error}`);
    } else {
      patch.productRequirements = value;
      touched = true;
    }
  }

  // JSON columns — each replaces the corresponding array/object wholesale
  // when provided and valid.
  const jsonColumns: [string, keyof HubContent][] = [
    ["whatYoullBuildJson", "overview" as keyof HubContent], // handled specially below
    ["painPointsJson", "businessProblem" as keyof HubContent],
    ["targetUsersJson", "businessProblem" as keyof HubContent],
    ["learningObjectivesJson", "learningObjectives"],
    ["userJourneyJson", "userJourney"],
    ["edgeCasesJson", "edgeCases"],
    ["layersJson", "architecture" as keyof HubContent],
    ["serviceCommunicationJson", "architecture" as keyof HubContent],
    ["databaseDesignJson", "databaseDesign"],
    ["apiDocumentationJson", "apiDocumentation"],
    ["folderStructureJson", "folderStructure"],
    ["namingConventionsJson", "namingConventions"],
    ["faqsJson", "faqs"],
  ];

  for (const [column] of jsonColumns) {
    const raw = r[column];
    if (!raw || !raw.trim()) continue;
    const { value, error } = parseJsonColumn<unknown>(raw, undefined);
    if (error || value === undefined) {
      errors.push(`${column}: ${error ?? "invalid"}`);
      continue;
    }
    touched = true;
    switch (column) {
      case "learningObjectivesJson":
        patch.learningObjectives = value as HubContent["learningObjectives"];
        break;
      case "userJourneyJson":
        patch.userJourney = value as HubContent["userJourney"];
        break;
      case "edgeCasesJson":
        patch.edgeCases = value as HubContent["edgeCases"];
        break;
      case "databaseDesignJson":
        patch.databaseDesign = value as HubContent["databaseDesign"];
        break;
      case "apiDocumentationJson":
        patch.apiDocumentation = value as HubContent["apiDocumentation"];
        break;
      case "folderStructureJson":
        patch.folderStructure = value as HubContent["folderStructure"];
        break;
      case "namingConventionsJson":
        patch.namingConventions = value as HubContent["namingConventions"];
        break;
      case "faqsJson":
        patch.faqs = value as HubContent["faqs"];
        break;
      case "whatYoullBuildJson":
        patch.overview = { ...(patch.overview ?? { description: "", whyThisProject: "", timeline: [], successCriteria: [] }), whatYoullBuild: value as string[] };
        break;
      case "painPointsJson":
        patch.businessProblem = { ...(patch.businessProblem ?? { intro: "", industry: "", stat: "", targetUsers: [] }), painPoints: value as HubContent["businessProblem"]["painPoints"] };
        break;
      case "targetUsersJson":
        patch.businessProblem = { ...(patch.businessProblem ?? { intro: "", industry: "", stat: "", painPoints: [] }), targetUsers: value as HubContent["businessProblem"]["targetUsers"] };
        break;
      case "layersJson":
        patch.architecture = { ...(patch.architecture ?? { description: "", notes: "", serviceCommunication: [] }), layers: value as Record<string, string[]> };
        break;
      case "serviceCommunicationJson":
        patch.architecture = { ...(patch.architecture ?? { description: "", notes: "", layers: {} }), serviceCommunication: value as string[] };
        break;
    }
  }

  return { patch, touched, errors };
}

// The "Resources" tab shown under the Learning Hub in the public UI is
// actually rendered from the courseContent.resourceFiles list (a separate
// project_content section from learningHub), not from HubContent itself —
// so it needs its own optional CSV column and its own merge/save step.
function buildCourseContentPatch(r: Record<string, string>): { patch: Partial<CourseContentData>; touched: boolean; errors: string[] } {
  const patch: Partial<CourseContentData> = {};
  const errors: string[] = [];
  let touched = false;

  if (r.resourceFilesJson?.trim()) {
    const { value, error } = parseJsonColumn<CourseContentData["resourceFiles"]>(r.resourceFilesJson, []);
    if (error) {
      errors.push(`resourceFilesJson: ${error}`);
    } else {
      patch.resourceFiles = value;
      touched = true;
    }
  }

  return { patch, touched, errors };
}

// Bulk CSV import for the project catalog. Every row lands as publishStatus
// "archived" regardless of what (if anything) the CSV says, so an admin can
// review/verify each imported project before manually publishing it — per
// the required review-before-publish workflow.
export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No CSV file provided" }, { status: 400 });
  }

  const text = await file.text();
  const rows = rowsToObjects(parseCsv(text));
  if (rows.length === 0) {
    return NextResponse.json({ error: "The CSV file has no data rows" }, { status: 400 });
  }

  const results: RowResult[] = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const rowNumber = i + 2; // +1 for 0-index, +1 for header row
    const slug = (r.slug ?? "").trim();
    const title = (r.title ?? "").trim();

    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      results.push({ row: rowNumber, slug: slug || "(missing)", status: "skipped", reason: "Missing or invalid slug (use lowercase letters, numbers, hyphens only)" });
      continue;
    }
    if (!title) {
      results.push({ row: rowNumber, slug, status: "skipped", reason: "Missing title" });
      continue;
    }

    const category = validCategories.has(r.category) ? (r.category as ProjectSummary["category"]) : "Full Stack";
    const level = validLevels.has(r.level) ? (r.level as ProjectSummary["level"]) : "Intermediate";
    const tags = (r.tags ?? "")
      .split(/[;,]/)
      .map((t) => t.trim())
      .filter(Boolean);

    const project: ProjectSummary = {
      slug,
      title,
      shortDescription: r.shortDescription ?? "",
      category,
      thumbnail: r.thumbnail ?? "",
      isPro: toBool(r.isPro ?? ""),
      tags,
      level,
      rating: Number(r.rating) || 0,
      reviewCount: Number(r.reviewCount) || 0,
      videoCount: Number(r.videoCount) || 0,
      duration: r.duration ?? "",
      learners: r.learners ?? "0",
      instructor: { name: r.instructorName ?? "", title: r.instructorTitle ?? "" },
      // Always archived on import — an admin must explicitly verify and
      // publish each project afterward, never auto-published from a bulk file.
      publishStatus: "archived",
    };

    try {
      const existing = await getProject(slug);
      if (existing) {
        await updateProject(slug, { ...project, publishStatus: existing.publishStatus ?? "archived" });
      } else {
        await createProject(project);
      }

      const { patch: hubPatch, touched: hubTouched, errors: hubErrors } = buildHubPatch(r);
      const { patch: coursePatch, touched: courseTouched, errors: courseErrors } = buildCourseContentPatch(r);

      // The Learning Hub's `meta` block (difficulty/duration/students/
      // instructor/tech stack) duplicates fields the admin already fills in
      // on the catalog card, so it's never a CSV column — it's always
      // derived from the row's own catalog fields and kept in sync on every
      // import instead of asking the admin to re-type the same values twice.
      const currentContent = await getProjectContent(slug);
      const resourceCount = coursePatch.resourceFiles?.length ?? currentContent.courseContent.resourceFiles.length;
      const derivedMeta: HubContent["meta"] = {
        ...currentContent.learningHub.meta,
        difficulty: level,
        duration: project.duration,
        students: project.learners,
        resources: `${resourceCount} file${resourceCount === 1 ? "" : "s"}`,
        instructor: { name: project.instructor.name, title: project.instructor.title },
        techStack: tags,
      };

      await saveProjectContentSection(slug, "learningHub", { ...currentContent.learningHub, ...hubPatch, meta: derivedMeta });
      if (courseTouched) {
        await saveProjectContentSection(slug, "courseContent", { ...currentContent.courseContent, ...coursePatch });
      }

      let note = hubTouched ? " (+ Learning Hub fields)" : "";
      if (courseTouched) note += " (+ Resources)";
      const allErrors = [...hubErrors, ...courseErrors];
      if (allErrors.length) {
        note += ` — skipped invalid JSON columns: ${allErrors.join(", ")}`;
      }

      results.push({ row: rowNumber, slug, status: existing ? "updated" : "created", reason: note || undefined });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save row";
      results.push({ row: rowNumber, slug, status: "skipped", reason: message });
    }
  }

  const created = results.filter((r) => r.status === "created").length;
  const updated = results.filter((r) => r.status === "updated").length;
  const skipped = results.filter((r) => r.status === "skipped").length;

  return NextResponse.json({ created, updated, skipped, results });
}
