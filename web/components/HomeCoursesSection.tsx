"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { CourseCover } from "@/components/CourseCover";
import { formatCurrency } from "@/lib/utils";

type Course = {
  id: string;
  title: string;
  subtitle: string | null;
  price: number;
  discount_price: number | null;
  tag: string | null;
  thumbnail_url: string | null;
  created_at?: string;
  category_id: string | null;
  course_categories: {
    name: string;
  } | null;
};

type HomeCoursesSectionProps = {
  courses: Course[];
};

export function HomeCoursesSection({ courses }: HomeCoursesSectionProps) {
  // Initialize with curated selection: 2 from Digital Marketing, 2 from Graphic Designing, 1 from Freelancing & Growth
  const getCuratedCourses = () => {
    const digitalMarketingCourses = courses.filter(course => course.course_categories?.name === "Digital Marketing").slice(0, 2);
    const graphicDesigningCourses = courses.filter(course => course.course_categories?.name === "Graphic Designing").slice(0, 2);
    const freelancingGrowthCourses = courses.filter(course => course.course_categories?.name === "Freelancing & Growth").slice(0, 1);
    
    return [...digitalMarketingCourses, ...graphicDesigningCourses, ...freelancingGrowthCourses];
  };

  const [filteredCourses, setFilteredCourses] = useState<Course[]>(getCuratedCourses());
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Get unique categories for filtering
  const categories = [...new Set(courses.map(course => course.course_categories?.name).filter(Boolean))];
  const tags = [...new Set(courses.map(course => course.tag).filter(Boolean))];
  
  // Define the new category options
  const categoryOptions = [
    "Digital Marketing",
    "Graphic Designing", 
    "Freelancing & Growth"
  ];

  const handleFilter = (filterType: string, value: string) => {
    setActiveFilter(value);
    
    if (value === "all") {
      // Show curated selection: 2 from Digital Marketing, 2 from Graphic Designing, 1 from Freelancing & Growth
      setFilteredCourses(getCuratedCourses());
    } else if (filterType === "category") {
      setFilteredCourses(courses.filter(course => course.course_categories?.name === value));
    } else if (filterType === "tag") {
      setFilteredCourses(courses.filter(course => course.tag === value));
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-4">Our Courses</h2>
        <p className="text-muted-foreground text-center">Choose from our carefully curated selection of courses</p>
      </div>
      
      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 items-center justify-center">
          
          {/* All Categories Filter */}
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={activeFilter === "all" ? "default" : "outline"} 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => handleFilter("category", "all")}
            >
              All Courses
            </Badge>
            
            {/* New Category Filters */}
            {categoryOptions.map((category) => (
              <Badge 
                key={category} 
                variant={activeFilter === category ? "default" : "outline"} 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleFilter("category", category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => {
          const hasDiscount = course.discount_price && course.discount_price < course.price;
          const discountPercent = hasDiscount && course.discount_price
            ? Math.round(((course.price - course.discount_price) / course.price) * 100)
            : 0;
          
          return (
            <Card key={course.id} className="flex flex-col overflow-hidden relative">
              {hasDiscount && (
                <Badge className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600">
                  {discountPercent}% OFF
                </Badge>
              )}
              <CourseCover src={course.thumbnail_url} alt={course.title} />
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.subtitle}</CardDescription>
                {course.course_categories?.name && (
                  <Badge variant="secondary" className="text-xs w-fit mt-2">
                    {course.course_categories.name}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="flex items-baseline gap-2 mb-4">
                  {hasDiscount ? (
                    <>
                      <span className="text-xl font-semibold text-green-600">
                        {formatCurrency(course.discount_price || 0)}
                      </span>
                      <span className="text-sm line-through text-muted-foreground">
                        {formatCurrency(course.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-semibold">{formatCurrency(course.price)}</span>
                  )}
                  {course.tag ? (
                    <div className="ml-auto flex flex-wrap gap-1">
                      {course.tag.split(',').map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs rounded-full bg-transparent border hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <Link href={`/course/${course.id}`} className="w-full">
                    <Button className="w-full">View details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-6">
            We&apos;re working on adding more courses. Check back soon!
          </p>
          <Button variant="outline" onClick={() => handleFilter("category", "all")}>
            Show All Courses
          </Button>
        </div>
      )}
    </div>
  );
}
