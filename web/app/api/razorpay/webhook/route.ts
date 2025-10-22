import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { createHmac } from "crypto";

export const dynamic = "force-dynamic"; // webhooks shouldn't be cached

export async function POST(request: Request) {
  try {
    const text = await request.text();
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string | undefined;
    const signature = request.headers.get("x-razorpay-signature") || "";
    if (!secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });

    const expectedSignature = createHmac("sha256", secret).update(text).digest("hex");
    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(text);
    if (event?.event === "payment.captured") {
      const notes = event?.payload?.payment?.entity?.notes || {};
      const courseId = notes.course_id;
      const userId = notes.user_id;
      if (courseId && userId) {
        const supabase = await getSupabaseServerClient();
        const { error } = await supabase
          .from("user_courses")
          .insert({ user_id: userId, course_id: courseId });
        if (error && error.code !== "23505") {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Webhook error" }, { status: 500 });
  }
}




