"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { AuthShell } from "@/components/auth/AuthShell";

export default function LoginPage() {
  const router = useRouter();
  const { login, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await login(email, password);
    setSubmitting(false);
    if (ok) router.push("/dashboard");
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to keep building where you left off."
      footer={
        <>
          No account?{" "}
          <Link href="/register" className="font-semibold text-brand hover:underline">
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-black/10 bg-[#faf9f7] px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-muted/60 focus:border-brand focus:bg-white"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-black/10 bg-[#faf9f7] px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-muted/60 focus:border-brand focus:bg-white"
          />
        </label>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 flex items-center justify-center rounded-full bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}
