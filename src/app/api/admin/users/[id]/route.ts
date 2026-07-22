import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { setUserBanned, deleteAuthUser } from "@/lib/auth/adminUsers";
import { deleteProfile } from "@/lib/auth/profile";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  const { id } = await params;
  const { banned } = await request.json().catch(() => ({}));

  if (typeof banned !== "boolean") {
    return NextResponse.json({ error: "'banned' (boolean) is required" }, { status: 400 });
  }

  if (id === guard.user.id && banned) {
    return NextResponse.json({ error: "You cannot ban your own account" }, { status: 400 });
  }

  try {
    await setUserBanned(id, banned);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  const { id } = await params;

  if (id === guard.user.id) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  try {
    await deleteAuthUser(id);
    await deleteProfile(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
