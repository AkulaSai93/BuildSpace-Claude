import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { listAuthUsers } from "@/lib/auth/adminUsers";
import { listProfiles } from "@/lib/auth/profile";

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  try {
    const [authUsers, profiles] = await Promise.all([listAuthUsers(), listProfiles()]);
    const roleById = new Map(profiles.map((p) => [p.id, p.role]));

    const users = authUsers.map((u) => ({
      id: u.id,
      email: u.email,
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at,
      banned: !!u.banned_until && new Date(u.banned_until) > new Date(),
      role: roleById.get(u.id) ?? "user",
    }));

    return NextResponse.json({ users });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list users";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
