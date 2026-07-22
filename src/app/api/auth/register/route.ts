import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/lib/auth/supabaseAuth";
import { setSessionCookies } from "@/lib/auth/cookies";
import { ensureProfile } from "@/lib/auth/profile";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  try {
    const session = await signUp(email, password);
    await ensureProfile({ id: session.user.id, email: session.user.email });
    const res = NextResponse.json({ user: { id: session.user.id, email: session.user.email, role: "user" } });
    setSessionCookies(res, session);
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
