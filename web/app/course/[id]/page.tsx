import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RazorpayButton } from "@/components/razorpay-button";
import { ExpandableText } from "@/components/ExpandableText";
import { CourseCover } from "@/components/CourseCover";

type Course = {
  id: string;
  title: string;
  subtitle: string | null;
  price: number;
  discount_price: number | null;
  tag: string | null;
  whatsapp_link: string | null;
  thumbnail_url: string | null;
};

export default async function CoursePage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseServerClient();
  const { data: course, error } = await supabase
    .from("courses")
    .select("id, title, subtitle, price, discount_price, tag, whatsapp_link, thumbnail_url")
    .eq("id", params.id)
    .single();

  if (error || !course) return notFound();

  const hasDiscount = course.discount_price && course.discount_price < course.price;

  return (
    <div className="min-h-screen w-full p-6">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CourseCover src={course.thumbnail_url} alt={course.title} />
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <CardTitle className="text-2xl">{course.title}</CardTitle>
                <CardDescription>{course.subtitle}</CardDescription>
              </div>
              {course.tag ? (
                <span className="text-xs px-2 py-1 rounded bg-muted whitespace-nowrap">{course.tag}</span>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-end gap-3">
              {hasDiscount ? (
                <>
                  <span className="text-3xl font-semibold">₹{course.discount_price}</span>
                  <span className="text-sm line-through text-muted-foreground">₹{course.price}</span>
                </>
              ) : (
                <span className="text-3xl font-semibold">₹{course.price}</span>
              )}
            </div>

            <ExpandableText text={course.subtitle} />

            <div className="flex flex-wrap items-center gap-3">
              <RazorpayButton courseId={course.id} label="Buy now" />
              {course.whatsapp_link ? (
                <Link href={course.whatsapp_link} target="_blank" rel="noopener noreferrer" className="inline-flex">
                  <Button variant="outline" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="size-4" aria-hidden="true"><path fill="currentColor" d="M19.11 17.84a5.6 5.6 0 0 1-2.66-.74a10.4 10.4 0 0 1-3.31-3a7.09 7.09 0 0 1-1.39-2.64a2 2 0 0 1 .63-2.05a1 1 0 0 1 .71-.25h.53a.86.86 0 0 1 .64.44l.9 1.63a.86.86 0 0 1 0 .86l-.53.89l-.07.09a6.69 6.69 0 0 0 2.72 2.72l.08-.06l.9-.54a.86.86 0 0 1 .86 0l1.65.92a.85.85 0 0 1 .44.63v.54a1 1 0 0 1-.25.71a2 2 0 0 1-2.05.64Zm-3.1 6.83a9.76 9.76 0 0 1-4.14-.92l-2.62.69a1.9 1.9 0 0 1-.48.07a1 1 0 0 1-.74-.31a1 1 0 0 1-.26-.94l.67-2.51a9.82 9.82 0 0 1-1.11-4.65A10.07 10.07 0 1 1 16 24.67Zm0-18.13a8.07 8.07 0 1 0 8.07 8.07A8.07 8.07 0 0 0 16 6.71Z"/></svg>
                    Community included
                  </Button>
                </Link>
              ) : (
                <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="size-4" aria-hidden="true"><path fill="currentColor" d="M19.11 17.84a5.6 5.6 0 0 1-2.66-.74a10.4 10.4 0 0 1-3.31-3a7.09 7.09 0 0 1-1.39-2.64a2 2 0 0 1 .63-2.05a1 1 0 0 1 .71-.25h.53a.86.86 0 0 1 .64.44l.9 1.63a.86.86 0 0 1 0 .86l-.53.89l-.07.09a6.69 6.69 0 0 0 2.72 2.72l.08-.06l.9-.54a.86.86 0 0 1 .86 0l1.65.92a.85.85 0 0 1 .44.63v.54a1 1 0 0 1-.25.71a2 2 0 0 1-2.05.64Zm-3.1 6.83a9.76 9.76 0 0 1-4.14-.92l-2.62.69a1.9 1.9 0 0 1-.48.07a1 1 0 0 1-.74-.31a1 1 0 0 1-.26-.94l.67-2.51a9.82 9.82 0 0 1-1.11-4.65A10.07 10.07 0 1 1 16 24.67Zm0-18.13a8.07 8.07 0 1 0 8.07 8.07A8.07 8.07 0 0 0 16 6.71Z"/></svg>
                  Community included
                </div>
              )}
              <div className="ml-auto" />
              <Link href="/" className="inline-flex">
                <Button type="button" variant="outline">Back</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


