import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// This is a placeholder for initiating checkout. In production, use
// a Supabase Edge Function to create a Razorpay order and handle webhooks.
export async function POST(request: Request) {
  const formData = await request.formData();
  const courseId = String(formData.get("course_id"));

  if (!courseId) {
    return NextResponse.json({ error: "Missing course_id" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Simulate payment success and redirect to success page with course id.
  // Record purchase now so it appears under My Courses.
  try {
    const { error: insertError } = await supabase
      .from("user_courses")
      .insert({ user_id: user.id, course_id: courseId });
    if (insertError && insertError.code !== "23505") {
      // ignore unique violation, otherwise rethrow
      throw insertError;
    }
  } catch (e) {
    // swallow insert errors for now; the success page still renders
  }
  // Replace with Razorpay flow later.
  const successUrl = new URL(`/success?course_id=${encodeURIComponent(courseId)}`, request.url);
  return NextResponse.redirect(successUrl);
}


