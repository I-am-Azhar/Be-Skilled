import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import UserDashboard from "@/components/UserDashboard";

export default async function DashboardPage() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <UserDashboard />;
}



