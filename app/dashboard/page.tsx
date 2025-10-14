import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: items } = await supabase
    .from("user_courses")
    .select("course_id, courses:course_id(id, title, subtitle)")
    .eq("user_id", user.id)
    .order("purchase_date", { ascending: false });

  return (
    <div className="min-h-screen w-full p-6">
      <div className="mx-auto max-w-3xl grid gap-6">
        <h1 className="text-2xl font-semibold">My Courses</h1>
        <div className="grid gap-3">
          {(items ?? []).map((it) => (
            <Link key={it.course_id} href={`/course/${it.course_id}`} className="border p-3 rounded">
              <div className="font-medium">{it.courses?.title}</div>
              <div className="text-sm text-muted-foreground">{it.courses?.subtitle}</div>
            </Link>
          ))}
          {(!items || items.length === 0) ? (
            <div className="text-sm text-muted-foreground">No purchases yet. <Link href="/" className="underline">Browse courses</Link></div>
          ) : null}
        </div>
      </div>
    </div>
  );
}



