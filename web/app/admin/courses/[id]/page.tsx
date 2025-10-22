import { redirect, notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseForm } from "@/components/course-form";

export default async function AdminCourseEditPage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") redirect("/");

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, subtitle, price, discount_price, tag, category_id, whatsapp_link, thumbnail_url")
    .eq("id", params.id)
    .single();
  if (!course) return notFound();

  return (
    <div className="min-h-screen w-full p-6">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Edit Course</CardTitle>
          </CardHeader>
          <CardContent>
            <CourseForm initial={course} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



