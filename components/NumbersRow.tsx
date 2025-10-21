"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Metric {
  value: number;
  label: string;
  suffix?: string;
}

const metrics: Metric[] = [
  { value: 10000, label: "Active Learners", suffix: "+" },
  { value: 4.9, label: "Average Rating", suffix: "/5" },
  { value: 30, label: "Day Refund Policy", suffix: "" },
  { value: 15, label: "WhatsApp Communities", suffix: "+" }
];

function useIsInViewport(threshold = 0.1) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInViewport(true);
        } else {
          setIsInViewport(false);
        }
      },
      { threshold }
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return [ref, isInViewport] as const;
}

export function NumbersRow() {
  const [animatedValues, setAnimatedValues] = useState<number[]>(
    new Array(metrics.length).fill(0)
  );
  const animationRef = useRef<NodeJS.Timeout[]>([]);
  const [containerRef, isInViewport] = useIsInViewport(0.3);

  const animateNumbers = useCallback(() => {
    const duration = 1500; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    // Clear any previous intervals before starting new
    animationRef.current.forEach(intervalId => clearInterval(intervalId));
    animationRef.current = [];

    setAnimatedValues(new Array(metrics.length).fill(0));

    metrics.forEach((metric, index) => {
      let currentStep = 0;
      const increment = metric.value / steps;

      const timer = setInterval(() => {
        currentStep++;
        const newValue = Math.min(increment * currentStep, metric.value);

        setAnimatedValues(prev => {
          const newValues = [...prev];
          newValues[index] = newValue;
          return newValues;
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);

      animationRef.current.push(timer);
    });
  }, []);

  // Animate whenever component comes into viewport
  useEffect(() => {
    if (isInViewport) {
      animateNumbers();
    } else {
      // If you want numbers to reset when not visible, uncomment:
      // setAnimatedValues(new Array(metrics.length).fill(0));
    }
    // On unmount: clear timers to avoid memory leaks
    return () => {
      animationRef.current.forEach(intervalId => clearInterval(intervalId));
      animationRef.current = [];
    };
  }, [isInViewport, animateNumbers]);

  const formatValue = (value: number, metric: Metric) => {
    if (metric.label === "Average Rating") {
      return value.toFixed(1);
    }
    return Math.floor(value).toLocaleString();
  };

  return (
    <div
      ref={containerRef}
      className="w-full py-16 bg-transparent"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={metric.label} className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {formatValue(animatedValues[index], metric)}
                  {metric.suffix}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {metric.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
