import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminCoursesClient } from "@/components/AdminCoursesClient";

export default async function AdminCoursesPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") redirect("/");

  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, price, discount_price, tag, category_id, is_active")
    .order("created_at", { ascending: false });

  return <AdminCoursesClient courses={courses || []} />;
}



