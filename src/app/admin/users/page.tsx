import { redirect } from "next/navigation";

// Renamed to "Students" as part of the BuildSpace Studio IA — keep this
// route as a redirect so any old links/bookmarks still work.
export default function AdminUsersRedirect() {
  redirect("/admin/students");
}
