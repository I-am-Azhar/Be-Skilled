import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminCoursesPage() {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") redirect("/");

  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, price, discount_price, tag")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen w-full p-6">
      <div className="mx-auto max-w-4xl grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Admin • Courses</h1>
          <Link href="/admin">
            <Button size="sm">New course</Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Courses</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {(courses ?? []).map((c) => (
              <div key={c.id} className="flex items-center gap-3 border p-3 rounded">
                <div className="flex-1">
                  <div className="font-medium">{c.title}</div>
                  <div className="text-sm text-muted-foreground">
                    ₹{c.discount_price ?? c.price} {c.discount_price ? <span className="line-through ml-2">₹{c.price}</span> : null}
                    {c.tag ? <span className="ml-3 text-xs px-2 py-0.5 rounded bg-muted">{c.tag}</span> : null}
                  </div>
                </div>
                <Link href={`/admin/courses/${c.id}`}>
                  <Button size="sm" variant="outline">Edit</Button>
                </Link>
              </div>
            ))}
            {(!courses || courses.length === 0) ? (
              <p className="text-sm text-muted-foreground">No courses yet.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


