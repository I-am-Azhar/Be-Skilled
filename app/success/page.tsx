import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function SuccessPage({ searchParams }: { searchParams: { course_id?: string } }) {
  const courseId = searchParams?.course_id;
  const supabase = getSupabaseServerClient();

  if (!courseId) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Missing course reference.</p>
      </div>
    );
  }

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, whatsapp_link")
    .eq("id", courseId)
    .single();

  const whatsappUrl = course?.whatsapp_link || "https://wa.me/0000000000?text=Hi%2C%20I%20just%20purchased%20a%20course";

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Payment Successful</CardTitle>
          <CardDescription>Join the WhatsApp community to get started</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex">
            <Button className="w-full">Join WhatsApp Group</Button>
          </a>
          <Link href={`/course/${courseId}`} className="inline-flex">
            <Button variant="outline" className="w-full">Back to course</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}


