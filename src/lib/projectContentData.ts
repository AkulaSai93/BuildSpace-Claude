// Server-only helpers for the `project_content` table (slug, data jsonb).
// Covers everything an admin authors beyond the catalog card and Workspace
// tab: Learning Hub, Course Content, Pro Solution, Discussion, Reviews.
import type { ProjectContent, ProjectContentSection } from "@/types/projectContent";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertConfigured(): asserts SUPABASE_URL is string {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error("Supabase is not configured (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  }
}

async function rest(path: string, init: RequestInit = {}) {
  assertConfigured();
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Prefer: "return=representation",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase request failed (${res.status}): ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// Used for any project that doesn't have its own project_content row yet
// (e.g. brand new projects created in the admin panel). Keeps every public
// page rendering something sensible instead of erroring, and gives the
// admin editor a populated starting point to fill in.
export const defaultProjectContent: ProjectContent = {
  learningHub: {
    meta: {
      difficulty: "Intermediate",
      duration: "20h 00m",
      students: "0",
      resources: "0 files",
      certificate: "Included",
      status: "Draft",
      instructor: { name: "TBD", title: "TBD" },
      techStack: [],
    },
    overview: {
      description: "Add a description for this project in the admin panel.",
      whyThisProject: "",
      whatYoullBuild: [],
      timeline: [],
      successCriteria: [],
    },
    businessProblem: { intro: "", industry: "", stat: "", painPoints: [], targetUsers: [] },
    learningObjectives: [],
    learningObjectivesClosing: "",
    productRequirements: { core: [], optional: [], constraints: [] },
    userJourney: [],
    edgeCases: [],
    architecture: { description: "", serviceCommunication: [], layers: {}, notes: "" },
    databaseDesign: [],
    sampleSchema: "",
    apiDocumentation: [],
    apiAuthNote: "",
    apiExample: "",
    folderStructure: [],
    namingConventions: [],
    faqs: [],
  },
  courseContent: {
    businessProblemParagraph: "",
    whatYoullBuild: [],
    learningOutcomes: [],
    prerequisites: [],
    systemArchitecture: {},
    techStackDetail: [],
    resourceFiles: [],
    interviewQuestions: {},
  },
  proSolution: { walkthroughs: [] },
  discussion: { comments: [] },
  reviews: { summary: { average: 0, total: 0, breakdown: [] }, reviews: [] },
};

export async function getProjectContent(slug: string): Promise<ProjectContent> {
  const rows = (await rest(`/project_content?slug=eq.${encodeURIComponent(slug)}&select=data`)) as { data: ProjectContent }[];
  if (!rows[0]) return defaultProjectContent;
  // Merge over the default so older rows missing a newly-added section
  // (e.g. discussion/reviews added later) don't break page rendering.
  return { ...defaultProjectContent, ...rows[0].data };
}

export async function saveProjectContentSection(
  slug: string,
  section: ProjectContentSection,
  sectionData: ProjectContent[ProjectContentSection]
): Promise<void> {
  const current = await getProjectContent(slug);
  const updated: ProjectContent = { ...current, [section]: sectionData };

  const existing = (await rest(`/project_content?slug=eq.${encodeURIComponent(slug)}&select=slug`)) as { slug: string }[];
  if (existing.length) {
    await rest(`/project_content?slug=eq.${encodeURIComponent(slug)}`, {
      method: "PATCH",
      body: JSON.stringify({ data: updated, updated_at: new Date().toISOString() }),
    });
  } else {
    await rest("/project_content", {
      method: "POST",
      body: JSON.stringify({ slug, data: updated }),
    });
  }
}

export async function deleteProjectContent(slug: string): Promise<void> {
  await rest(`/project_content?slug=eq.${encodeURIComponent(slug)}`, { method: "DELETE" }).catch(() => {});
}
