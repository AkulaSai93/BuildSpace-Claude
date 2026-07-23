import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { makeTableClient, logAudit, studioRest } from "@/lib/studio/db";
import { setUserBanned, deleteAuthUser, listAuthUsers } from "@/lib/auth/adminUsers";
import { deleteProfile } from "@/lib/auth/profile";
import type { StudentProfile, XpTransaction, CreditTransaction, Certificate, MentorSession } from "@/types/studio";

const profiles = makeTableClient<StudentProfile>("profiles", "id");
const xpTransactions = makeTableClient<XpTransaction>("xp_transactions");
const creditTransactions = makeTableClient<CreditTransaction>("credit_transactions");

// GET returns everything the Student Profile deep page needs in one call:
// the joined auth+profile record, certificates, XP/credit ledgers, and
// mentor sessions for this student. Kept on this route (rather than a
// separate endpoint) since it's all keyed by the same :id.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  const { id } = await params;

  try {
    const [profile, authUsers, certificates, xp, credits, mentorSessions] = await Promise.all([
      profiles.get(id),
      listAuthUsers(),
      studioRest<Certificate[]>(`/certificates?user_id=eq.${encodeURIComponent(id)}&select=*&order=issued_at.desc`),
      studioRest<XpTransaction[]>(`/xp_transactions?user_id=eq.${encodeURIComponent(id)}&select=*&order=created_at.desc`),
      studioRest<CreditTransaction[]>(`/credit_transactions?user_id=eq.${encodeURIComponent(id)}&select=*&order=created_at.desc`),
      studioRest<MentorSession[]>(`/mentor_sessions?student_id=eq.${encodeURIComponent(id)}&select=*&order=scheduled_at.desc`),
    ]);

    const authUser = authUsers.find((u) => u.id === id) ?? null;
    if (!authUser) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({
      student: {
        id,
        email: authUser.email,
        displayName: profile?.display_name ?? null,
        role: profile?.role ?? "user",
        status: profile?.status ?? "active",
        xp: profile?.xp ?? 0,
        credits: profile?.credits ?? 0,
        avatarUrl: profile?.avatar_url ?? null,
        createdAt: authUser.created_at,
        lastSignInAt: authUser.last_sign_in_at,
        banned: !!authUser.banned_until && new Date(authUser.banned_until) > new Date(),
      },
      certificates,
      xpTransactions: xp,
      creditTransactions: credits,
      mentorSessions,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load student";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH supports three shapes of request body, dispatched by presence of key:
//   - { displayName?, xp?, credits? }  -> profile edit (writes ledger rows for xp/credit deltas)
//   - { resetCredits: true }           -> sets credits to 0 + logs a credit_transactions row
//   - { suspended: boolean }           -> bans/unbans the Supabase Auth user AND syncs profiles.status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    // --- suspend / unsuspend ---
    if (typeof body.suspended === "boolean") {
      if (id === guard.user.id && body.suspended) {
        return NextResponse.json({ error: "You cannot suspend your own account" }, { status: 400 });
      }
      await setUserBanned(id, body.suspended);
      const item = await profiles.update(id, { status: body.suspended ? "suspended" : "active" } as Partial<StudentProfile>);
      await logAudit(guard.user.email, "suspend:profile", id, { suspended: body.suspended });
      return NextResponse.json({ item });
    }

    // --- reset credits ---
    if (body.resetCredits === true) {
      const current = await profiles.get(id);
      if (!current) return NextResponse.json({ error: "Student not found" }, { status: 404 });
      const delta = 0 - (current.credits ?? 0);
      const item = await profiles.update(id, { credits: 0 } as Partial<StudentProfile>);
      if (delta !== 0) {
        await creditTransactions.create({ user_id: id, amount: delta, reason: "Admin reset" } as Partial<CreditTransaction>);
      }
      await logAudit(guard.user.email, "reset_credits:profile", id, { previous: current.credits });
      return NextResponse.json({ item });
    }

    // --- general profile edit (displayName / xp / credits) ---
    const patch: Partial<StudentProfile> = {};
    if (typeof body.displayName === "string") patch.display_name = body.displayName.trim() || null;

    const current = await profiles.get(id);
    if (!current) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    if (body.xp !== undefined) {
      const nextXp = Number(body.xp);
      if (!Number.isFinite(nextXp) || nextXp < 0) {
        return NextResponse.json({ error: "'xp' must be a non-negative number" }, { status: 400 });
      }
      patch.xp = Math.round(nextXp);
      const delta = patch.xp - (current.xp ?? 0);
      if (delta !== 0) {
        await xpTransactions.create({ user_id: id, amount: delta, reason: "Admin adjustment" } as Partial<XpTransaction>);
      }
    }

    if (body.credits !== undefined) {
      const nextCredits = Number(body.credits);
      if (!Number.isFinite(nextCredits) || nextCredits < 0) {
        return NextResponse.json({ error: "'credits' must be a non-negative number" }, { status: 400 });
      }
      patch.credits = Math.round(nextCredits);
      const delta = patch.credits - (current.credits ?? 0);
      if (delta !== 0) {
        await creditTransactions.create({ user_id: id, amount: delta, reason: "Admin adjustment" } as Partial<CreditTransaction>);
      }
    }

    const item = await profiles.update(id, patch);
    await logAudit(guard.user.email, "update:profile", id, patch);
    return NextResponse.json({ item });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update student";
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
    await logAudit(guard.user.email, "delete:profile", id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete student";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
