import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="w-full flex items-center justify-center min-h-screen">
      <div className="relative z-10 w-full max-w-4xl px-4 py-24 md:py-32 flex flex-col items-center justify-center">
        <div className="w-full flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Learn. Connect. Grow with BeSkilled.
          </h1>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Buy courses and join real learning communities on WhatsApp.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/#courses">
              <Button size="lg">Browse Courses</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">Login</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


