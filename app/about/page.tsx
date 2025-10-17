import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Heart, Zap, MessageCircle, BookOpen } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">
              About <span className="text-primary">BeSkilled</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Empowering learners through community-driven education and real-world connections
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                At BeSkilled, we believe that learning doesn&apos;t happen in isolation. We&apos;re building a platform 
                where education meets community, where every course purchase connects you to a real learning 
                community on WhatsApp.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Our goal is to transform passive learning into active, collaborative experiences that help 
                you not just acquire knowledge, but build lasting connections with fellow learners and experts.
              </p>
              <Link href="/contact">
                <Button size="lg">Join Our Community</Button>
              </Link>
            </div>
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Target className="h-6 w-6 text-primary" />
                    <CardTitle>Our Vision</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To create the world&apos;s most connected learning platform where every student becomes part 
                    of a supportive community.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Heart className="h-6 w-6 text-primary" />
                    <CardTitle>Our Values</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Community-first learning, authentic connections, and empowering every learner to achieve 
                    their goals through collaborative education.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose BeSkilled?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We&apos;re not just another online learning platform. Here&apos;s what makes us different:
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-8 w-8 text-primary" />
                  <CardTitle>WhatsApp Communities</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every course comes with access to a dedicated WhatsApp group where you can ask questions, 
                  share progress, and connect with instructors and fellow learners.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-primary" />
                  <CardTitle>Community-Driven</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our courses are created by real experts and practitioners who are passionate about sharing 
                  their knowledge and building meaningful connections.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Zap className="h-8 w-8 text-primary" />
                  <CardTitle>Practical Learning</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Focus on real-world applications with hands-on projects, case studies, and practical 
                  exercises that you can apply immediately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <CardTitle>Quality Content</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Carefully curated courses with high-quality content, structured learning paths, and 
                  comprehensive resources to support your journey.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-primary" />
                  <CardTitle>Goal-Oriented</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every course is designed with clear learning objectives and outcomes to help you achieve 
                  your specific goals and advance your career.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Heart className="h-8 w-8 text-primary" />
                  <CardTitle>Supportive Environment</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Learn in a supportive, inclusive environment where questions are encouraged and every 
                  learner&apos;s journey is valued and supported.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of learners who are already building their skills and connections
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-lg text-muted-foreground">Active Learners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-lg text-muted-foreground">Expert Instructors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">25+</div>
              <div className="text-lg text-muted-foreground">WhatsApp Communities</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join our community of learners and start your journey today. Every course purchase 
            comes with lifetime access to course materials and community support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button size="lg">Browse Courses</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">Get in Touch</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
