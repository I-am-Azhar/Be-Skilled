"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export function RazorpayButton({ courseId, label = "Buy now" }: { courseId: string; label?: string }) {
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.Razorpay) {
      setReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => setReady(true);
    s.onerror = () => setReady(false);
    document.body.appendChild(s);
  }, []);

  const handleClick = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: courseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create order");

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Be-skilled",
        description: data.course?.title || "Course purchase",
        order_id: data.order_id,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              course_id: courseId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            const to = verifyData.redirect_to || `/success?course_id=${encodeURIComponent(courseId)}`;
            window.location.href = to;
          } else {
            alert(verifyData?.error || "Payment verification failed");
          }
        },
        prefill: {
          email: data.user?.email || "",
        },
        notes: { course_id: courseId, user_id: data.user?.id },
        theme: { color: "#0ea5e9" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e: any) {
      alert(e?.message || "Failed to start checkout");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  return (
    <Button type="button" disabled={loading || !ready} onClick={handleClick}>
      {loading ? "Processing..." : label}
    </Button>
  );
}




