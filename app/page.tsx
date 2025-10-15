import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Hero } from "@/components/hero";

type Course = {
  id: string;
  title: string;
  subtitle: string | null;
  price: number;
  discount_price: number | null;
  tag: string | null;
  thumbnail_url: string | null;
};

export default async function Home() {
  const supabase = getSupabaseServerClient();
  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, title, subtitle, price, discount_price, tag, thumbnail_url")
    .order("title", { ascending: true });

  const hasError = Boolean(error);

  return (
    <div className="min-h-screen w-full">
      <Hero />
      <div className="mx-auto max-w-6xl px-4 py-10">
        {hasError ? (
          <div className="mb-6 rounded border p-4 text-sm">
            <p className="font-medium">Failed to load courses</p>
            <p className="text-muted-foreground mt-1">Ensure Supabase URL and anon key env vars are set and the `courses` table exists.</p>
            <pre className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">{error?.message}</pre>
          </div>
        ) : null}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(courses ?? []).map((course) => {
            const hasDiscount = course.discount_price && course.discount_price < course.price;
            return (
              <Card key={course.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex items-baseline gap-2 mb-4">
                    {hasDiscount ? (
                      <>
                        <span className="text-xl font-semibold">₹{course.discount_price}</span>
                        <span className="text-sm line-through text-muted-foreground">₹{course.price}</span>
                      </>
                    ) : (
                      <span className="text-xl font-semibold">₹{course.price}</span>
                    )}
                    {course.tag ? (
                      <span className="ml-auto text-xs px-2 py-1 rounded bg-muted">{course.tag}</span>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/course/${course.id}`} className="w-full">
                      <Button className="w-full">View details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Link href="/login">
            <Button variant="outline">Sign in / Sign up</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
