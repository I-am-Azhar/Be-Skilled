import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Course = {
  id: string;
  title: string;
  subtitle: string | null;
  price: number;
  discount_price: number | null;
  tag: string | null;
  whatsapp_link: string | null;
};

export default async function CoursePage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseServerClient();
  const { data: course, error } = await supabase
    .from("courses")
    .select("id, title, subtitle, price, discount_price, tag, whatsapp_link")
    .eq("id", params.id)
    .single();

  if (error || !course) return notFound();

  const hasDiscount = course.discount_price && course.discount_price < course.price;

  return (
    <div className="min-h-screen w-full p-6">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>{course.subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-6">
              {hasDiscount ? (
                <>
                  <span className="text-2xl font-semibold">₹{course.discount_price}</span>
                  <span className="text-sm line-through text-muted-foreground">₹{course.price}</span>
                </>
              ) : (
                <span className="text-2xl font-semibold">₹{course.price}</span>
              )}
              {course.tag ? (
                <span className="ml-auto text-xs px-2 py-1 rounded bg-muted">{course.tag}</span>
              ) : null}
            </div>

            <form action={`/api/checkout`} method="POST" className="flex gap-3">
              <input type="hidden" name="course_id" value={course.id} />
              <Button type="submit">Buy now</Button>
              <Link href="/" className="inline-flex">
                <Button type="button" variant="outline">Back</Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


