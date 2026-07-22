import { NextRequest, NextResponse } from "next/server";
import { getUser, refreshSession } from "@/lib/auth/supabaseAuth";
import { ACCESS_COOKIE, REFRESH_COOKIE, setSessionCookies, clearSessionCookies } from "@/lib/auth/cookies";
import { ensureProfile, getProfile } from "@/lib/auth/profile";

async function withRole(user: { id: string; email: string | null }) {
  await ensureProfile(user);
  const profile = await getProfile(user.id);
  return { id: user.id, email: user.email, role: profile?.role ?? "user" };
}

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const user = await getUser(accessToken);
    return NextResponse.json({ user: await withRole({ id: user.id, email: user.email }) });
  } catch {
    // Access token likely expired — try a silent refresh before giving up.
    if (!refreshToken) {
      const res = NextResponse.json({ user: null });
      clearSessionCookies(res);
      return res;
    }
    try {
      const session = await refreshSession(refreshToken);
      const res = NextResponse.json({ user: await withRole({ id: session.user.id, email: session.user.email }) });
      setSessionCookies(res, session);
      return res;
    } catch {
      const res = NextResponse.json({ user: null });
      clearSessionCookies(res);
      return res;
    }
  }
}
