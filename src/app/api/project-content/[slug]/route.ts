import { NextRequest, NextResponse } from "next/server";
import { getProjectContent } from "@/lib/projectContentData";

// Public, read-only — used by LearningHubTab, BuildJourneyContentTabs (and
// its sub-tabs), and ProSolutionTab to render admin-authored content.
export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const content = await getProjectContent(slug);
    return NextResponse.json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load project content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
