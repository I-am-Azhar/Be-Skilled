import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { RazorpayButton } from "@/components/razorpay-button";
import { StickyCTA } from "@/components/StickyCTA";
import { CheckCircle2, Star, Clock, Video, Award, Users, ArrowLeft } from "lucide-react";

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

// Static course data for Meta Ads Mastery
const metaAdsCourseDetails = {
  modules: [
    {
      id: 1,
      title: "Introduction to Meta Advertising",
      duration: "40 mins",
      topics: [
        "What is Meta Ads Manager & how it works",
        "Understanding the business manager setup",
        "Campaign objective types (Awareness, Traffic, Leads, Sales)",
        "How the ad delivery algorithm works"
      ]
    },
    {
      id: 2,
      title: "Audience Targeting",
      duration: "45 mins",
      topics: [
        "Core, Custom & Lookalike audiences",
        "Location, demographic, and behavioral targeting",
        "Retargeting strategies (Website visitors, Instagram engagers)"
      ]
    },
    {
      id: 3,
      title: "Ad Creative Strategy",
      duration: "50 mins",
      topics: [
        "How to design scroll-stopping creatives",
        "Writing ad copy that converts",
        "Video vs static ads – when to use what",
        "Hook, offer, and CTA formula"
      ]
    },
    {
      id: 4,
      title: "Campaign Setup",
      duration: "1 hour",
      topics: [
        "Live step-by-step ad creation",
        "Budget setup and bidding strategies",
        "Pixel setup and conversion tracking",
        "Common mistakes and how to avoid ad disapproval"
      ]
    },
    {
      id: 5,
      title: "Optimization & Scaling",
      duration: "45 mins",
      topics: [
        "Reading metrics (CTR, CPM, CPC, CPA)",
        "Testing different creatives and audiences",
        "Scaling your ad spend safely",
        "Troubleshooting poor-performing campaigns"
      ]
    },
    {
      id: 6,
      title: "Case Study + Q&A",
      duration: "30 mins",
      topics: [
        "Real client campaign breakdown",
        "Strategy + ad creative + results",
        "Open Q&A with participants"
      ]
    }
  ],
  testimonials: [
    {
      name: "Riya Sharma",
      role: "Freelance Designer",
      rating: 5,
      quote: "Very practical and easy to follow! Ran my first ad in 2 days."
    },
    {
      name: "Adnan Khan",
      role: "Social Media Manager",
      rating: 5,
      quote: "This course is more valuable than most ₹10,000 digital marketing programs."
    },
    {
      name: "Praveen Kumar",
      role: "Small Business Owner",
      rating: 5,
      quote: "I finally understood audience targeting! Sha explains like a friend."
    }
  ],
  benefits: [
    "12 weeks of total 4hr of Live Online Training (Google Meet)",
    "Hands-on Tasks & Feedback",
    "Real Case Studies",
    "Downloadable Syllabus PDF",
    "Course Completion Certificate",
    "Access to Private WhatsApp/Telegram Group (Optional)"
  ],
  faq: [
    {
      question: "Is this course suitable for beginners?",
      answer: "Yes! This course is designed for anyone wanting to learn Meta Ads from scratch. No prior experience required."
    },
    {
      question: "What if I miss a live session?",
      answer: "Don't worry! All sessions are recorded and will be available for you to watch anytime. The recording will be available on the next day of class."
    },
    {
      question: "How long will I have access to this course?",
      answer: "You will have access to the course for a full 1.5 years. During this time, you can revisit the lessons, review the content, and practice at your own pace."
    },
    {
      question: "What if I have doubts during the course?",
      answer: "You can join our Discord group from the classroom page by clicking the 'Discord' button. Our mentors will be available there to help resolve your doubts."
    },
    {
      question: "Are there any prerequisites for this course?",
      answer: "Yes, a laptop & internet connection. That's all you need to get your dream job."
    }
  ]
};


export default async function CourseDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await getSupabaseServerClient();
  const { data: course, error } = await supabase
    .from("courses")
    .select("id, title, subtitle, price, discount_price, tag, whatsapp_link, thumbnail_url")
    .eq("id", params.id)
    .single();

  if (error || !course) return notFound();

  const hasDiscount = course.discount_price && course.discount_price < course.price;

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <div className="mt-10 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-4xl">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-6">
            <Link href={`/course/${course.id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
            </Link>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{course.subtitle}</p>
              
              {/* Stats Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Duration: 2 weeks
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Format: Online
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Certificate: YES
                </Badge>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mb-6">
                {hasDiscount ? (
                  <>
                    <span className="text-4xl font-bold text-green-600">₹{course.discount_price}</span>
                    <span className="text-xl line-through text-muted-foreground">₹{course.price}</span>
                  </>
                ) : (
                  <span className="text-4xl font-bold">₹{course.price}</span>
                )}
              </div>

              <RazorpayButton courseId={course.id} label="Enroll Now" />
            </div>

            <div className="relative flex lg:justify-center items-start w-full">
              <div className="bg-card rounded-lg p-6 border w-full max-w-lg">
                <h3 className="text-lg font-semibold mb-4 text-center">Course Preview</h3>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Video className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground">YouTube Video Placeholder</p>
                    <p className="text-sm text-muted-foreground mt-2">Course introduction video will be embedded here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* What You'll Learn & What You'll Get Section */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* What You'll Learn */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Master Meta Ads Manager from scratch</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Create high-converting ad campaigns</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Advanced audience targeting strategies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Optimize campaigns for better ROI</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* What You'll Get */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">What You'll Get</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metaAdsCourseDetails.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Modules Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Course Modules</h2>
          <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
            {metaAdsCourseDetails.modules.map((module) => (
              <AccordionItem key={module.id} value={`module-${module.id}`}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span>Module {module.id}: {module.title}</span>
                    <Badge variant="outline" className="ml-4">
                      {module.duration}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {module.topics.map((topic, index) => (
                      <li key={index}>{topic}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Testimonials Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What Our Students Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {metaAdsCourseDetails.testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
            {metaAdsCourseDetails.faq.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>

      {/* Sticky CTA */}
      <StickyCTA course={course} />
    </div>
  );
}
