import { getSupabaseServerClient } from "@/lib/supabase/server";
import { CoursesPageClient } from "@/components/CoursesPageClient";

type Course = {
  id: string;
  title: string;
  subtitle: string | null;
  price: number;
  discount_price: number | null;
  tag: string | null;
  thumbnail_url: string | null;
  category_id: string | null;
  course_categories: {
    name: string;
  } | null;
};

export default async function CoursesPage() {
  const supabase = await getSupabaseServerClient();
  const { data: courses, error } = await supabase
    .from("courses")
    .select(`
      id, 
      title, 
      subtitle, 
      price, 
      discount_price, 
      tag, 
      thumbnail_url,
      category_id,
      course_categories!inner(name)
    `)
    .order("title", { ascending: true });

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Failed to load courses</h1>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  return <CoursesPageClient courses={courses || []} />;
}
