import { NextResponse } from "next/server";

// This endpoint is now deprecated in favor of Razorpay-based checkout.
// Keeping it to provide a helpful message if invoked.
export async function POST() {
  return NextResponse.json(
    {
      error:
        "This endpoint is deprecated. Use the Razorpay checkout button on the course page to initiate payment.",
    },
    { status: 410 }
  );
}


