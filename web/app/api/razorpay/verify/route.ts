import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { createHmac } from "crypto";

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { course_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body || {};
    if (!course_id || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET as string | undefined;
    if (!keySecret) return NextResponse.json({ error: "Razorpay not configured" }, { status: 500 });

    const signBody = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = createHmac("sha256", keySecret).update(signBody).digest("hex");
    const valid = expectedSignature === razorpay_signature;
    if (!valid) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

    // Idempotent grant of course access
    const { error: insertError } = await supabase
      .from("user_courses")
      .insert({ user_id: user.id, course_id });
    if (insertError && insertError.code !== "23505") {
      // non-unique-violation error
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, redirect_to: `/success?course_id=${encodeURIComponent(course_id)}` });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Verification failed" }, { status: 500 });
  }
}




