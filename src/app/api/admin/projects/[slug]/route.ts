import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { updateProject, deleteProject, getProject } from "@/lib/projectsData";
import type { ProjectSummary } from "@/types/library";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  const { slug } = await params;
  const body = (await request.json().catch(() => null)) as ProjectSummary | null;
  if (!body?.title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  try {
    const existing = await getProject(slug);
    if (!existing) {
      return NextResponse.json({ error: `No project found for slug "${slug}"` }, { status: 404 });
    }
    // Keep the slug in the stored payload consistent with the URL/primary key.
    await updateProject(slug, { ...body, slug });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  const { slug } = await params;

  try {
    await deleteProject(slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
