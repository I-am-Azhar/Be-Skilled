import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavbarHideOnScroll } from "@/components/NavbarHideOnScroll";

export default async function SiteNavbarServer() {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user ? await supabase.from("users").select("role").eq("id", user.id).single() : { data: null } as any;

  const isAdmin = profile?.role === "admin";

  return (
    <NavbarHideOnScroll>
      <header className="sticky top-3 z-40 w-full">
        <div className="mx-auto max-w-6xl px-4 mt-10">
          <div className="h-14 flex items-center justify-between rounded-full border bg-background/40 backdrop-blur supports-[backdrop-filter]:bg-background/30 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-extrabold text-base pl-10">
            <span className="text-foreground">Be</span>
            <span className="text-primary">Skilled</span>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm ">
          <Link href="/">Home</Link>
          {isAdmin ? (
            <>
              <Link href="/admin">Create Courses</Link>
              <Link href="/admin/courses">Manage</Link>
            </>
          ) : (
            <>
              <Link href="/courses">Courses</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {/* Theme toggle - desktop */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="sm:hidden">
                <Menu className="size-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="p-4">
                <Link href="/" className="font-extrabold text-lg  ">
                  <span className="text-foreground">Be</span>
                  <span className="text-primary">Skilled</span>
                </Link>
              </SheetHeader>
              <div className="flex flex-col gap-2 p-4 text-sm">
                <div className="flex items-center justify-end pb-2">
                  <ThemeToggle />
                </div>
                <Link href="/">Home</Link>
                {isAdmin ? (
                  <>
                    <Link href="/admin">Create Courses</Link>
                    <Link href="/admin/courses">Manage</Link>
                  </>
                ) : (
                  <>
                    <Link href="/courses">Courses</Link>
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                  </>
                )}
                <div className="h-px bg-border my-2" />
                {user ? (
                  <form action="/auth/signout" method="post">
                    <Button size="sm" variant="outline" type="submit" className="w-full">Sign out</Button>
                  </form>
                ) : (
                  <Link href="/login">
                    <Button size="sm" variant="outline" className="w-full">Login / Sign Up</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop auth button */}
          <div className="hidden sm:block pr-10">
            {user ? (
              <form action="/auth/signout" method="post">
                <Button size="sm" variant="outline" type="submit">Sign out</Button>
              </form>
            ) : (
              <Link href="/login">
                <Button size="sm" variant="outline">Login / Sign Up</Button>
              </Link>
            )}
          </div>
        </div>
          </div>
        </div>
      </header>
    </NavbarHideOnScroll>
  );
}


