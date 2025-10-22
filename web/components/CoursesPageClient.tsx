"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Clock, Star, Filter, Search, MessageCircle } from "lucide-react";
import { CourseCover } from "@/components/CourseCover";

type Course = {
  id: string;
  title: string;
  subtitle: string | null;
  price: number;
  discount_price: number | null;
  tag: string | null;
  thumbnail_url: string | null;
  category_id: string | null;
  course_categories: {
    name: string;
  } | null;
  level?: string | null;
  duration?: string | null;
  description?: string | null;
};

type CoursesPageClientProps = {
  courses: Course[];
};

export function CoursesPageClient({ courses }: CoursesPageClientProps) {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Get unique categories for filtering
  const categories = [...new Set(courses.map(course => course.course_categories?.name).filter(Boolean))];
  const levels = [...new Set(courses.map(course => course.level).filter(Boolean))];
  
  // Define the new category options
  const categoryOptions = [
    "Digital Marketing",
    "Graphic Designing", 
    "Freelancing & Growth"
  ];

  const handleFilter = (filterType: string, value: string) => {
    setActiveFilter(value);
    
    if (value === "all") {
      setFilteredCourses(courses);
    } else if (filterType === "category") {
      setFilteredCourses(courses.filter(course => course.course_categories?.name === value));
    } else if (filterType === "tag") {
      setFilteredCourses(courses.filter(course => course.tag === value));
    } else if (filterType === "level") {
      setFilteredCourses(courses.filter(course => course.level === value));
    }
  };

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">
              Explore Our <span className="text-primary">Courses</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover courses that match your interests and join vibrant learning communities
            </p>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filter by:</span>
              </div>
              
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
              
              {/* Level Filters */}
              {levels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={activeFilter === "all-levels" ? "default" : "outline"} 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleFilter("level", "all")}
                  >
                    All Levels
                  </Badge>
                  {levels.map((level) => (
                    <Badge 
                      key={level} 
                      variant={activeFilter === level ? "default" : "outline"} 
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleFilter("level", level!)}
                    >
                      {level}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              const hasDiscount = course.discount_price && course.discount_price < course.price;
              return (
                <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow overflow-hidden">
                  <CourseCover src={course.thumbnail_url} alt={course.title} />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                        <CardDescription className="mb-3">{course.subtitle}</CardDescription>
                      </div>
                    </div>
                    
                    {/* Course Meta */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {course.course_categories?.name && (
                        <Badge variant="secondary" className="text-xs">
                          {course.course_categories.name}
                        </Badge>
                      )}
                      {course.level && (
                        <Badge variant="outline" className="text-xs">
                          {course.level}
                        </Badge>
                      )}
                      {course.tag && (
                        <Badge variant="outline" className="text-xs">
                          {course.tag}
                        </Badge>
                      )}
                    </div>

                    {/* Course Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {course.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Community</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="mt-auto">
                    {/* Description */}
                    {course.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {course.description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      {hasDiscount ? (
                        <>
                          <span className="text-2xl font-bold text-primary">₹{course.discount_price}</span>
                          <span className="text-sm line-through text-muted-foreground">₹{course.price}</span>
                          <Badge variant="destructive" className="text-xs">
                            Save ₹{course.price - course.discount_price!}
                          </Badge>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-primary">₹{course.price}</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link href={`/course/${course.id}`} className="flex-1">
                        <Button className="w-full">View Details</Button>
                      </Link>
                      <Button variant="outline" size="icon">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-6">
                We&apos;re working on adding more courses. Check back soon!
              </p>
              <Button variant="outline" onClick={() => handleFilter("category", "all")}>
                <Search className="h-4 w-4 mr-2" />
                Show All Courses
              </Button>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-muted/30 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Can&apos;t find what you&apos;re looking for?</h3>
              <p className="text-muted-foreground mb-6">
                Let us know what course you&apos;d like to see, or join our community to suggest new topics
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button variant="outline">Request a Course</Button>
                </Link>
                <Button>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Join Community
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
