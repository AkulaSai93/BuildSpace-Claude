import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { readFile } from "fs/promises";
import path from "path";

// Serves the sample CSV (real seeded catalog rows + one blank example row)
// so admins can download it, see the expected shape, and reuse it as a
// starting point for bulk-adding new projects via the Import CSV flow.
export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  try {
    const filePath = path.join(process.cwd(), "supabase", "projects_import_template.csv");
    const csv = await readFile(filePath, "utf-8");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="projects_import_template.csv"',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load template";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
