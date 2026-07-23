import { NextResponse } from "next/server";
import { listProjects } from "@/lib/projectsData";

// Public, read-only. No auth required — this is the same catalog anyone
// sees on /library. Mutations only happen through /api/admin/projects.
export async function GET() {
  try {
    const projects = await listProjects();
    // Drafts/archived only show up in the admin panel, never the public library.
    const visible = projects.filter((p) => !p.publishStatus || p.publishStatus === "published");
    return NextResponse.json({ projects: visible });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load projects";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
