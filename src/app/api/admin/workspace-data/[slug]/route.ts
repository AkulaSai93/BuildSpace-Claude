import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { studioRest, logAudit } from "@/lib/studio/db";
import type { WorkspaceData } from "@/lib/workspace-data";

// Sensible empty default so the admin Workspace Builder always has
// something to render/edit even for a project that has no workspace_data
// row yet. Mirrors the shape consumed by the student-facing Workspace tab.
const emptyWorkspaceData: WorkspaceData = {
  userName: "",
  repo: { name: "", owner: "" },
  branch: { current: "main", lastCommit: "", sha: "", openPrs: 0 },
  milestone: { sprint: "", label: "", progress: 0, estCompletion: "", taskLabel: "" },
  questions: [],
  reviews: {},
  buildTasks: [],
  currentTask: { label: "", hint: "" },
  github: { lastCommit: "", workingTree: "", commits: [], stats: [] },
  commitDetails: {},
  returningStats: { currentSprint: "", currentMilestone: "", tasksCompleted: "" },
  buildBreakdown: [],
  validationChecks: [],
  unlockRules: {
    minScore: 0,
    requiredSections: [],
    creditsRequired: 0,
    unlockVideos: false,
    unlockResources: false,
    unlockCertificate: false,
  },
};

async function fetchWorkspaceData(slug: string): Promise<WorkspaceData> {
  const rows = await studioRest<{ data: WorkspaceData }[]>(
    `/workspace_data?slug=eq.${encodeURIComponent(slug)}&select=data`
  );
  if (!rows[0]) return emptyWorkspaceData;
  return { ...emptyWorkspaceData, ...rows[0].data };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  const { slug } = await params;
  try {
    const data = await fetchWorkspaceData(slug);
    return NextResponse.json({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load workspace data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Body: full WorkspaceData object — always replaces the whole JSONB blob
// for this slug (same check-then-POST/PATCH pattern as project_content).
export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  const { slug } = await params;
  const body = (await request.json().catch(() => null)) as WorkspaceData | null;
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  try {
    const existing = await studioRest<{ slug: string }[]>(
      `/workspace_data?slug=eq.${encodeURIComponent(slug)}&select=slug`
    );
    if (existing.length) {
      await studioRest(`/workspace_data?slug=eq.${encodeURIComponent(slug)}`, {
        method: "PATCH",
        body: JSON.stringify({ data: body, updated_at: new Date().toISOString() }),
      });
    } else {
      await studioRest(`/workspace_data`, {
        method: "POST",
        body: JSON.stringify({ slug, data: body }),
      });
    }
    await logAudit(guard.user.email, "update:workspace_data", slug, { questionCount: body.questions?.length ?? 0 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save workspace data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
