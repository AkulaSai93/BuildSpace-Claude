import { NextRequest, NextResponse } from "next/server";
import { signOut } from "@/lib/auth/supabaseAuth";
import { ACCESS_COOKIE, clearSessionCookies } from "@/lib/auth/cookies";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  if (accessToken) {
    await signOut(accessToken);
  }
  const res = NextResponse.json({ ok: true });
  clearSessionCookies(res);
  return res;
}
