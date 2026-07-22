import { NextRequest, NextResponse } from "next/server";

// Server-only route: reads workspace data from Supabase using the service
// role key. The key never reaches the browser — the client only ever calls
// this same-origin API route.
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") ?? "__default__";

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Supabase is not configured (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)" },
      { status: 500 }
    );
  }

  // Mirror the original getWorkspaceData(slug) logic: only the
  // "ecommerce-platform" slug has bespoke data, everything else falls back
  // to the generic workspace row.
  const lookupSlug = slug === "ecommerce-platform" ? "ecommerce-platform" : "__default__";

  const res = await fetch(
    `${supabaseUrl}/rest/v1/workspace_data?slug=eq.${encodeURIComponent(lookupSlug)}&select=data`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      // Always get fresh data from Supabase; nothing is cached locally.
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: `Supabase query failed: ${text}` }, { status: 502 });
  }

  const rows = (await res.json()) as { data: unknown }[];

  if (!rows.length) {
    return NextResponse.json({ error: `No workspace_data row for slug "${lookupSlug}"` }, { status: 404 });
  }

  return NextResponse.json(rows[0].data);
}
