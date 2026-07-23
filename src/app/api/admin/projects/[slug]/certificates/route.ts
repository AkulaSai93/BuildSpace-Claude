import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { studioRest } from "@/lib/studio/db";
import type { Certificate } from "@/types/studio";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  const { slug } = await params;

  try {
    const certificates = await studioRest<Certificate[]>(
      `/certificates?project_slug=eq.${encodeURIComponent(slug)}&select=*`
    );
    return NextResponse.json({ certificates });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load certificates";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
