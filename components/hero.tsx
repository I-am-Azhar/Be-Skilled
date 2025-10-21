import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";

export function Hero() {
  return (
    <section className="w-full flex items-center justify-center min-h-[60vh] sm:min-h-screen">
      <div className="relative z-10 w-full max-w-4xl px-4 pt-0 pb-16 md:py-32 flex flex-col items-center justify-center">
        <div className="w-full flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Learn. Connect. Grow with BeSkilled.
          </h1>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Buy courses and join real learning communities on WhatsApp.
          </p>

          {/* Search Bar
          <div className="mt-8 w-full max-w-2xl">
            <SearchBar 
              placeholder="Search courses by title, category, or tags..."
              className="w-full"
            />
          </div> */}

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/courses">
              <Button size="lg" className="text-base sm:text-lg">Check All Courses</Button>
            </Link>
            {/* <Link href="/login">
              <Button size="lg" variant="outline">Login</Button>
            </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
}


