// Server-only helpers for the `projects` table (slug, data jsonb) — the
// project catalog shown in /library. Called from /api/projects (public
// read) and /api/admin/projects (admin-only CRUD).
import type { ProjectSummary } from "@/types/library";

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

export async function listProjects(): Promise<ProjectSummary[]> {
  const rows = (await rest("/projects?select=data&order=created_at.asc")) as { data: ProjectSummary }[];
  return rows.map((r) => r.data);
}

export async function getProject(slug: string): Promise<ProjectSummary | null> {
  const rows = (await rest(`/projects?slug=eq.${encodeURIComponent(slug)}&select=data`)) as { data: ProjectSummary }[];
  return rows[0]?.data ?? null;
}

export interface ProjectRow {
  data: ProjectSummary;
  created_at: string;
  updated_at: string;
}

export async function getProjectRow(slug: string): Promise<ProjectRow | null> {
  const rows = (await rest(
    `/projects?slug=eq.${encodeURIComponent(slug)}&select=data,created_at,updated_at`
  )) as ProjectRow[];
  return rows[0] ?? null;
}

export async function createProject(project: ProjectSummary): Promise<void> {
  await rest("/projects", {
    method: "POST",
    body: JSON.stringify({ slug: project.slug, data: project }),
  });
}

export async function updateProject(slug: string, project: ProjectSummary): Promise<void> {
  await rest(`/projects?slug=eq.${encodeURIComponent(slug)}`, {
    method: "PATCH",
    body: JSON.stringify({ data: project, updated_at: new Date().toISOString() }),
  });
}

export async function deleteProject(slug: string): Promise<void> {
  await rest(`/projects?slug=eq.${encodeURIComponent(slug)}`, { method: "DELETE" });
}
