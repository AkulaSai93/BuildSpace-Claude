import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/supabaseAuth";
import { ACCESS_COOKIE } from "@/lib/auth/cookies";
import { getProfile } from "@/lib/auth/profile";
import { AdminSidebar } from "./AdminSidebar";

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
      <AdminSidebar email={email} />
      <main className="min-h-screen pl-60">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8 lg:px-12">{children}</div>
      </main>
    </div>
  );
}
