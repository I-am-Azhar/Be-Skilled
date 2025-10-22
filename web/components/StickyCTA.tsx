"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RazorpayButton } from "@/components/razorpay-button";

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

export function StickyCTA({ course }: { course: Course }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) return null;

  const hasDiscount = course.discount_price && course.discount_price < course.price;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <span className="text-sm text-muted-foreground">Limited Seats Available</span>
          <div className="flex items-baseline gap-2">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-bold text-green-600">₹{course.discount_price}</span>
                <span className="text-sm line-through text-muted-foreground">₹{course.price}</span>
              </>
            ) : (
              <span className="text-2xl font-bold">₹{course.price}</span>
            )}
          </div>
        </div>
        <RazorpayButton courseId={course.id} label="Enroll Now" />
      </div>
    </div>
  );
}
