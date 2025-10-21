"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { trackCategoryClick } from "@/lib/analytics";

const categories = [
  { id: "all", label: "All Courses", value: null },
  { id: "development", label: "Development", value: "development" },
  { id: "design", label: "Design", value: "design" },
  { id: "marketing", label: "Marketing", value: "marketing" },
  { id: "business", label: "Business", value: "business" },
  { id: "data-science", label: "Data Science", value: "data-science" },
  { id: "mobile", label: "Mobile", value: "mobile" },
];

export function CategoryPills() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  return (
    <div className="w-full overflow-hidden">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => {
          const isActive = currentCategory === category.value || 
            (!currentCategory && category.value === null);
          
          return (
            <Link
              key={category.id}
              href={category.value ? `/courses?category=${category.value}` : "/courses"}
              className="flex-shrink-0"
              onClick={() => trackCategoryClick(category.value || 'all')}
            >
              <Badge
                variant={isActive ? "default" : "outline"}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-muted"
                )}
              >
                {category.label}
              </Badge>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
