"use client";

import { useCallback, useEffect, useState } from "react";

export interface AuthUser {
  id: string;
  email: string | null;
}

// This hook never talks to Supabase directly — it only calls our own
// same-origin API routes (src/app/api/auth/*), which hold the Supabase
// service role key server-side. The browser only ever sees httpOnly
// session cookies it can't read or forge.
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const body = await res.json();
      setUser(body.user ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Login failed");
      return false;
    }
    setUser(body.user);
    return true;
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Registration failed");
      return false;
    }
    setUser(body.user);
    return true;
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  return { user, loading, error, login, register, logout, refresh };
}
