// Shared cookie names + options for the auth session, used only by the
// server-side API routes in src/app/api/auth/*.
import type { NextResponse } from "next/server";
import type { AuthSession } from "./supabaseAuth";

export const ACCESS_COOKIE = "sb-access-token";
export const REFRESH_COOKIE = "sb-refresh-token";

const isProd = process.env.NODE_ENV === "production";

export function setSessionCookies(res: NextResponse, session: AuthSession) {
  res.cookies.set(ACCESS_COOKIE, session.access_token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: session.expires_in,
  });
  res.cookies.set(REFRESH_COOKIE, session.refresh_token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    // Refresh tokens live much longer than the access token.
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSessionCookies(res: NextResponse) {
  res.cookies.set(ACCESS_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", { path: "/", maxAge: 0 });
}
