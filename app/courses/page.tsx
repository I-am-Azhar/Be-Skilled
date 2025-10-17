import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { BookOpen, Users, Clock, Star, Filter, Search, MessageCircle } from "lucide-react";
import SearchBar from "@/components/SearchBar";

type Course = {
  id: string;
  title: string;
  subtitle: string | null;
  price: number;
  discount_price: number | null;
  tag: string | null;
  thumbnail_url: string | null;
  description: string | null;
  duration: string | null;
  level: string | null;
  category: string | null;
};

export default async function CoursesPage() {
  const supabase = getSupabaseServerClient();
  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, title, subtitle, price, discount_price, tag, thumbnail_url, description, duration, level, category")
    .order("title", { ascending: true });

  const hasError = Boolean(error);

  // Get unique categories for filtering
  const categories = courses ? [...new Set(courses.map(course => course.category).filter(Boolean))] : [];
  const levels = courses ? [...new Set(courses.map(course => course.level).filter(Boolean))] : [];

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
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                placeholder="Search courses by title, category, or tags..."
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          {hasError ? (
            <div className="mb-6 rounded border p-4 text-sm">
              <p className="font-medium">Failed to load courses</p>
              <p className="text-muted-foreground mt-1">Ensure Supabase URL and anon key env vars are set and the `courses` table exists.</p>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">{error?.message}</pre>
            </div>
          ) : null}

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filter by:</span>
              </div>
              
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    All Categories
                  </Badge>
                  {categories.map((category) => (
                    <Badge key={category} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
              
              {levels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    All Levels
                  </Badge>
                  {levels.map((level) => (
                    <Badge key={level} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {level}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(courses ?? []).map((course) => {
              const hasDiscount = course.discount_price && course.discount_price < course.price;
              return (
                <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                        <CardDescription className="mb-3">{course.subtitle}</CardDescription>
                      </div>
                      {course.thumbnail_url && (
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center ml-4">
                          <BookOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Course Meta */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {course.category && (
                        <Badge variant="secondary" className="text-xs">
                          {course.category}
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
          {courses && courses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-6">
                We&apos;re working on adding more courses. Check back soon!
              </p>
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Browse All Courses
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
