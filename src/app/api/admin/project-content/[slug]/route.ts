import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getProjectContent, saveProjectContentSection } from "@/lib/projectContentData";
import type { ProjectContentSection } from "@/types/projectContent";

const VALID_SECTIONS: ProjectContentSection[] = [
  "learningHub",
  "courseContent",
  "proSolution",
  "discussion",
  "reviews",
];

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  const { slug } = await params;
  try {
    const content = await getProjectContent(slug);
    return NextResponse.json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load project content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Body: { section: "learningHub" | "courseContent" | "proSolution" | "discussion" | "reviews", data: <section shape> }
// Only the named section is replaced — every other section is left as-is.
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  const { slug } = await params;
  const body = await request.json().catch(() => null);

  if (!body || !VALID_SECTIONS.includes(body.section)) {
    return NextResponse.json(
      { error: `'section' must be one of: ${VALID_SECTIONS.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    await saveProjectContentSection(slug, body.section as ProjectContentSection, body.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save project content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
