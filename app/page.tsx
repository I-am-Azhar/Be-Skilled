import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Hero } from "@/components/hero";
import TrustBar from "@/components/TrustBar";
import { CourseCover } from "@/components/CourseCover";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { NumbersRow } from "@/components/NumbersRow";
import { WhatsAppCommunityCTA } from "@/components/WhatsAppCommunityCTA";
import { FAQ } from "@/components/FAQ";
import { CourseCardSkeleton } from "@/components/CourseCardSkeleton";
import { LazySection } from "@/components/LazySection";
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
};

export default async function Home() {
  const supabase = getSupabaseServerClient();
  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, title, subtitle, price, discount_price, tag, thumbnail_url, created_at")
    .order("title", { ascending: true });

  const hasError = Boolean(error);

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "BeSkilled",
            "description": "Learn web development with practical projects and join real learning communities on WhatsApp. Get job-ready skills with industry experts.",
            "url": "https://beskilled.com",
            "logo": "https://beskilled.com/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-9876543210",
              "contactType": "customer service",
              "availableLanguage": "English"
            },
            "sameAs": [
              "https://wa.me/919876543210",
              "https://t.me/beskilled"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "IN"
            }
          })
        }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How much do the courses cost?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our courses range from ₹299 to ₹2,999. We also offer bundle deals and seasonal discounts. Check our pricing page for current offers and use code WELCOME10 for 10% off your first purchase."
                }
              },
              {
                "@type": "Question",
                "name": "Do I get a certificate after completing a course?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! You'll receive a verified certificate of completion for each course you finish. These certificates are recognized by industry professionals and can be shared on LinkedIn and your resume."
                }
              },
              {
                "@type": "Question",
                "name": "How long do I have access to the course materials?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You get lifetime access to all course materials, including video lessons, code files, and resources. You can learn at your own pace and revisit the content anytime."
                }
              },
              {
                "@type": "Question",
                "name": "What's your refund policy?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We offer a 30-day money-back guarantee. If you're not satisfied with the course content or teaching quality, you can request a full refund within 30 days of purchase, no questions asked."
                }
              }
            ]
          })
        }}
      />
      
      <div className="min-h-screen w-full">
        <Hero />
        <TrustBar />
        
        {/* Main Courses Section */}
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center mb-4">Our Courses</h2>
            <p className="text-muted-foreground text-center">Choose from our carefully curated selection of courses</p>
          </div>
          
          {hasError ? (
            <div className="mb-6 rounded border p-4 text-sm">
              <p className="font-medium">Failed to load courses</p>
              <p className="text-muted-foreground mt-1">Ensure Supabase URL and anon key env vars are set and the `courses` table exists.</p>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">{error?.message}</pre>
            </div>
          ) : null}
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses ? (
              courses.map((course) => {
              const hasDiscount = course.discount_price && course.discount_price < course.price;
              const discountPercent = hasDiscount 
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
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-4">
                      {hasDiscount ? (
                        <>
                          <span className="text-xl font-semibold text-green-600">
                            {formatCurrency(course.discount_price)}
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
            })
            ) : (
              // Show skeleton loaders while loading
              Array.from({ length: 6 }).map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))
            )}
          </div>
        </div>
        
        {/* Other Sections */}
        <div className="mx-auto max-w-6xl px-4 py-10">
        
          <LazySection fallback={<div className="h-96" />}>
            <div className="mb-12">
              <TestimonialsCarousel />
            </div>
          </LazySection>
          
          <LazySection fallback={<div className="h-32" />}>
            <NumbersRow />
          </LazySection>
          
          
          <LazySection fallback={<div className="h-96" />}>
            <WhatsAppCommunityCTA />
          </LazySection>
          
          <LazySection fallback={<div className="h-96" />}>
            <FAQ />
          </LazySection>
        </div>
    </div>
    </>
  );
}
