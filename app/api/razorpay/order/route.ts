import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const courseId = String(body?.course_id || "");
    if (!courseId) {
      return NextResponse.json({ error: "Missing course_id" }, { status: 400 });
    }

    const { data: course, error } = await supabase
      .from("courses")
      .select("id, title, price, discount_price")
      .eq("id", courseId)
      .single();
    if (error || !course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const amountInPaise = Math.round(
      100 * (course.discount_price && course.discount_price < course.price ? course.discount_price : course.price)
    );

    const keyId = process.env.RAZORPAY_KEY_ID as string | undefined;
    const keySecret = process.env.RAZORPAY_KEY_SECRET as string | undefined;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Razorpay keys not configured" }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `course_${course.id}_${Date.now()}`,
      notes: { course_id: course.id, user_id: user.id },
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
      course: { id: course.id, title: course.title },
      user: { id: user.id, email: user.email },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create order" }, { status: 500 });
  }
}


