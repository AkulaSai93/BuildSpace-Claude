import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { listAuthUsers } from "@/lib/auth/adminUsers";
import { studioRest } from "@/lib/studio/db";
import type { StudentProfile, Certificate } from "@/types/studio";

// Richer version of /api/admin/users: joins Supabase Auth users with the
// `profiles` table (xp/credits/status/display_name) and a per-user
// certificate count. There is no per-student "projects completed" tracker
// table yet, so we surface the certificate count as the closest honest proxy
// and let the UI label it accordingly rather than fabricating a percentage.
export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  try {
    const [authUsers, profiles, certificates] = await Promise.all([
      listAuthUsers(),
      studioRest<StudentProfile[]>("/profiles?select=*"),
      studioRest<Pick<Certificate, "id" | "user_id">[]>("/certificates?select=id,user_id"),
    ]);

    const profileById = new Map(profiles.map((p) => [p.id, p]));
    const certCountByUser = new Map<string, number>();
    for (const c of certificates) {
      certCountByUser.set(c.user_id, (certCountByUser.get(c.user_id) ?? 0) + 1);
    }

    const students = authUsers.map((u) => {
      const profile = profileById.get(u.id);
      return {
        id: u.id,
        email: u.email,
        displayName: profile?.display_name ?? null,
        role: profile?.role ?? "user",
        status: profile?.status ?? "active",
        xp: profile?.xp ?? 0,
        credits: profile?.credits ?? 0,
        avatarUrl: profile?.avatar_url ?? null,
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at,
        banned: !!u.banned_until && new Date(u.banned_until) > new Date(),
        certificateCount: certCountByUser.get(u.id) ?? 0,
      };
    });

    return NextResponse.json({ students });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list students";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
