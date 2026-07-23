import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

// Generic admin-only image upload, used for the project thumbnail as well
// as Learning Hub diagram/screenshot images (architecture, database design,
// folder structure, etc). Saves to
// public/images/projects/<slug>/<kind>.<ext> so every image for a project
// lives in one predictable place.
const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

const MAX_BYTES = 8 * 1024 * 1024; // 8MB — diagrams/screenshots can be larger than a thumbnail.

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const slugRaw = form?.get("slug");
  const kindRaw = form?.get("kind");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  const slug = typeof slugRaw === "string" ? slugRaw.trim() : "";
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "A valid (lowercase, hyphenated) project slug is required before uploading" }, { status: 400 });
  }
  const kind = typeof kindRaw === "string" ? kindRaw.trim() : "thumbnail";
  if (!/^[a-z0-9-]+$/.test(kind)) {
    return NextResponse.json({ error: "Invalid image kind" }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: `Unsupported file type: ${file.type || "unknown"}` }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is too large (max 8MB)" }, { status: 400 });
  }

  try {
    const dir = path.join(process.cwd(), "public", "images", "projects", slug);
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, `${kind}.${ext}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const publicPath = `/images/projects/${slug}/${kind}.${ext}`;
    return NextResponse.json({ path: publicPath });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save file";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
