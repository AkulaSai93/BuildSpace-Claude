import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { collectionRoutes } from "@/lib/studio/apiFactory";
import { makeTableClient, logAudit } from "@/lib/studio/db";
import type { Certificate, CertificateTemplate, XpTransaction } from "@/types/studio";

// GET (list) reuses the generic factory — plain read, no side effects.
export const { GET } = collectionRoutes<Certificate>("certificates", "id");

const certificatesClient = makeTableClient<Certificate>("certificates", "id");
const templatesClient = makeTableClient<CertificateTemplate>("certificate_templates", "tier");
const xpTransactionsClient = makeTableClient<XpTransaction>("xp_transactions", "id");

// Manually issuing a certificate is more than a plain insert: it also
// credits the student with the tier's xp_required XP via an xp_transactions
// row, so POST here is hand-written instead of using the generic factory.
export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  const body = (await request.json().catch(() => null)) as {
    user_id?: string;
    project_slug?: string;
    tier?: "elite" | "standard";
    score?: number | null;
  } | null;

  if (!body || !body.user_id || !body.project_slug || !body.tier) {
    return NextResponse.json({ error: "user_id, project_slug, and tier are required" }, { status: 400 });
  }

  try {
    const template = await templatesClient.get(body.tier);
    const xpRequired = template?.xp_required ?? 0;

    const certificate = await certificatesClient.create({
      user_id: body.user_id,
      project_slug: body.project_slug,
      tier: body.tier,
      score: body.score ?? null,
    });

    if (xpRequired > 0) {
      await xpTransactionsClient.create({
        user_id: body.user_id,
        amount: xpRequired,
        reason: "Certificate issued",
      });
    }

    await logAudit(guard.user.email, "create:certificates", certificate.id, body);
    return NextResponse.json({ item: certificate }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to issue certificate" },
      { status: 500 }
    );
  }
}
