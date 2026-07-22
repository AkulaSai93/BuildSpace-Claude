import { NextRequest, NextResponse } from "next/server";
import { getProject } from "@/lib/projectsData";

// Public, read-only single-project lookup used by /library/[slug].
export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const project = await getProject(slug);
    if (!project) {
      return NextResponse.json({ error: `No project found for slug "${slug}"` }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
