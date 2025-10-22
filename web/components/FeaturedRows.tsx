"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseCover } from "@/components/CourseCover";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Course = {
  id: string;
  title: string;
  subtitle: string | null;
  price: number;
  discount_price: number | null;
  tag: string | null;
  thumbnail_url: string | null;
  created_at?: string;
};

interface FeaturedRowsProps {
  courses: Course[];
}

export function FeaturedRows({ courses }: FeaturedRowsProps) {
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Filter courses for different rows
  const newCourses = courses
    .filter(course => {
      if (!course.created_at) return false;
      const courseDate = new Date(course.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return courseDate > thirtyDaysAgo;
    })
    .slice(0, 6);

  const bestSellers = courses
    .filter(course => course.tag === "bestseller" || course.tag === "popular")
    .slice(0, 6);

  const under499 = courses
    .filter(course => course.discount_price ? course.discount_price < 499 : course.price < 499)
    .slice(0, 6);

  const featuredRows = [
    {
      id: "new",
      title: "New Courses",
      courses: newCourses,
      href: "/courses?sort=newest"
    },
    {
      id: "bestsellers",
      title: "Best Sellers",
      courses: bestSellers,
      href: "/courses?tag=bestseller"
    },
    {
      id: "under499",
      title: "Under ₹499",
      courses: under499,
      href: "/courses?maxPrice=499"
    }
  ];

  const scroll = (direction: "left" | "right", rowId: string) => {
    const container = scrollRefs.current[rowId];
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const CourseCard = ({ course }: { course: Course }) => {
    const hasDiscount = course.discount_price && course.discount_price < course.price;
    const discountPercent = hasDiscount 
      ? Math.round(((course.price - course.discount_price) / course.price) * 100)
      : 0;

    return (
      <Card className="flex flex-col overflow-hidden relative min-w-[280px] max-w-[280px]">
        {hasDiscount && (
          <Badge className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600">
            {discountPercent}% OFF
          </Badge>
        )}
        <CourseCover src={course.thumbnail_url} alt={course.title} />
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-2 text-sm">{course.title}</CardTitle>
          <CardDescription className="line-clamp-2 text-xs">{course.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0 mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            {hasDiscount ? (
              <>
                <span className="text-lg font-semibold text-green-600">
                  {formatCurrency(course.discount_price)}
                </span>
                <span className="text-xs line-through text-muted-foreground">
                  {formatCurrency(course.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold">{formatCurrency(course.price)}</span>
            )}
            {course.tag && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {course.tag}
              </Badge>
            )}
          </div>
          <Link href={`/course/${course.id}`} className="w-full">
            <Button size="sm" className="w-full text-xs">View details</Button>
          </Link>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-12">
      {featuredRows.map((row) => (
        <div key={row.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{row.title}</h2>
            <Link href={row.href}>
              <Button variant="outline" size="sm">
                View all
              </Button>
            </Link>
          </div>
          
          {row.courses.length > 0 ? (
            <div className="relative">
              <div
                ref={(el) => (scrollRefs.current[row.id] = el)}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
                onMouseEnter={() => setActiveRow(row.id)}
                onMouseLeave={() => setActiveRow(null)}
              >
                {row.courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
              
              {/* Scroll buttons - only show on hover and if there are more courses */}
              {activeRow === row.id && row.courses.length > 3 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={() => scroll("left", row.id)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={() => scroll("right", row.id)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No courses found in this category.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}



