import { NextResponse } from "next/server";
import { listProjects } from "@/lib/projectsData";

// Public, read-only. No auth required — this is the same catalog anyone
// sees on /library. Mutations only happen through /api/admin/projects.
export async function GET() {
  try {
    const projects = await listProjects();
    return NextResponse.json({ projects });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load projects";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
