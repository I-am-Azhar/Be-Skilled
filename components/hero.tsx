"use client";

// import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, MessageCircle } from "lucide-react";
import { trackHeroCTA } from "@/lib/analytics";

export function Hero() {
  return (
    <section 
      className="w-full flex items-center justify-center min-h-screen sm:min-h-screen"
      aria-labelledby="hero-heading"
    >
      <div className="relative z-10 w-full max-w-4xl px-4 pt-0 pb-16 md:py-32 flex flex-col items-center justify-center">
        <div className="w-full flex flex-col items-center justify-center text-center">
          <h1 
            id="hero-heading"
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
          >
            Learn. Connect. Grow with BeSkilled.
          </h1>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Buy courses and join real learning communities on WhatsApp.
          </p>

          {/* Value Props */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-sm text-muted-foreground" role="list" aria-label="Key features">
            <div className="flex items-center gap-2" role="listitem">
              <Users className="w-4 h-4" aria-hidden="true" />
              <span>Community-led learning</span>
            </div>
            <div className="flex items-center gap-2" role="listitem">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>Practical projects</span>
            </div>
            <div className="flex items-center gap-2" role="listitem">
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>WhatsApp support</span>
            </div>
          </div>



          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center" role="group" aria-label="Call to action buttons">
            <Link href="/courses" onClick={() => trackHeroCTA('primary')}>
              <Button size="lg" aria-describedby="primary-cta-desc">
                Check All Courses
              </Button>
            </Link>
            <Link href="/login" onClick={() => trackHeroCTA('secondary')}>
              <Button size="lg" variant="outline" aria-describedby="secondary-cta-desc">
                Join WhatsApp Community
              </Button>
            </Link>
          </div>
          <div id="primary-cta-desc" className="sr-only">
            Browse all available courses and start learning today
          </div>
          <div id="secondary-cta-desc" className="sr-only">
            Join our WhatsApp community for support and networking
          </div>
        </div>
      </div>
    </section>
  );
}


