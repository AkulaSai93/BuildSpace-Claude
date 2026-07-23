// Generates admin-gated Next.js route handlers for a simple studio table,
// so every new entity (mentors, media assets, notifications, roles, etc.)
// doesn't need hand-written boilerplate. Every handler runs requireAdmin()
// first and logs the mutation to audit_logs.
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { makeTableClient, logAudit } from "@/lib/studio/db";

export function collectionRoutes<T extends Record<string, unknown>>(table: string, idColumn = "id") {
  const client = makeTableClient<T>(table, idColumn);

  return {
    async GET(request: NextRequest) {
      const guard = await requireAdmin(request);
      if ("response" in guard) return guard.response;
      try {
        const items = await client.list();
        return NextResponse.json({ items });
      } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load" }, { status: 500 });
      }
    },
    async POST(request: NextRequest) {
      const guard = await requireAdmin(request);
      if ("response" in guard) return guard.response;
      const body = await request.json().catch(() => null);
      if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
      try {
        const item = await client.create(body);
        await logAudit(guard.user.email, `create:${table}`, String((item as Record<string, unknown>)[idColumn] ?? ""), body);
        return NextResponse.json({ item }, { status: 201 });
      } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to create" }, { status: 500 });
      }
    },
  };
}

export function itemRoutes<T extends Record<string, unknown>>(table: string, idColumn = "id") {
  const client = makeTableClient<T>(table, idColumn);

  return {
    async PUT(request: NextRequest, { params }: { params: Promise<Record<string, string>> }) {
      const guard = await requireAdmin(request);
      if ("response" in guard) return guard.response;
      const p = await params;
      const id = p[idColumn] ?? Object.values(p)[0];
      const body = await request.json().catch(() => null);
      if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
      try {
        const item = await client.update(id, body);
        await logAudit(guard.user.email, `update:${table}`, id, body);
        return NextResponse.json({ item });
      } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to update" }, { status: 500 });
      }
    },
    async DELETE(request: NextRequest, { params }: { params: Promise<Record<string, string>> }) {
      const guard = await requireAdmin(request);
      if ("response" in guard) return guard.response;
      const p = await params;
      const id = p[idColumn] ?? Object.values(p)[0];
      try {
        await client.remove(id);
        await logAudit(guard.user.email, `delete:${table}`, id);
        return NextResponse.json({ ok: true });
      } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to delete" }, { status: 500 });
      }
    },
  };
}
