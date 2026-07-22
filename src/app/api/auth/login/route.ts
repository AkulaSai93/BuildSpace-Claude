import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth/supabaseAuth";
import { setSessionCookies } from "@/lib/auth/cookies";
import { ensureProfile, getProfile } from "@/lib/auth/profile";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    const session = await signIn(email, password);
    await ensureProfile({ id: session.user.id, email: session.user.email });
    const profile = await getProfile(session.user.id);
    const res = NextResponse.json({
      user: { id: session.user.id, email: session.user.email, role: profile?.role ?? "user" },
    });
    setSessionCookies(res, session);
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid email or password";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
