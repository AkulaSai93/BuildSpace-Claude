import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/lib/auth/supabaseAuth";
import { ACCESS_COOKIE } from "@/lib/auth/cookies";
import { getProfile } from "@/lib/auth/profile";

// Server-side gate for the whole /admin section: verifies the session
// cookie against Supabase, then checks profiles.role — same check as
// requireAdmin() used by the /api/admin/* routes, just rendered instead of
// returned as JSON. Non-admins (including logged-out visitors) never see
// any admin markup, not even a flash of it.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const accessToken = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!accessToken) redirect("/login");

  let email: string | null = null;
  try {
    const user = await getUser(accessToken);
    email = user.email;
    const profile = await getProfile(user.id);
    if (!profile || profile.role !== "admin") {
      redirect("/dashboard");
    }
  } catch {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-black/[0.08] bg-white px-4 py-4 sm:px-8 lg:px-20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Admin Panel</p>
            <p className="text-sm text-ink-muted">Signed in as {email}</p>
          </div>
          <Link href="/dashboard" className="text-sm font-medium text-brand hover:underline">
            ← Back to app
          </Link>
        </div>
        <nav className="mt-4 flex items-center gap-1">
          <Link
            href="/admin/users"
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-ink hover:bg-black/[0.03]"
          >
            Users
          </Link>
          <Link
            href="/admin/projects"
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-ink hover:bg-black/[0.03]"
          >
            Projects
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8 lg:px-20">{children}</main>
    </div>
  );
}
