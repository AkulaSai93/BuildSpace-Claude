// Read-only listing of mentor_sessions, optionally filtered by ?mentorId=.
// No booking/scheduling UI is built on top of this — that requires real
// calendar/availability infra that's out of scope for this pass.
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { studioRest } from "@/lib/studio/db";
import type { MentorSession } from "@/types/studio";

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  const mentorId = request.nextUrl.searchParams.get("mentorId");
  const filter = mentorId ? `&mentor_id=eq.${encodeURIComponent(mentorId)}` : "";

  try {
    const items = await studioRest<MentorSession[]>(
      `/mentor_sessions?select=*&order=scheduled_at.desc${filter}`
    );
    return NextResponse.json({ items });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load mentor sessions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
