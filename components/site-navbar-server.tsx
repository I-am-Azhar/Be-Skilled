import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function SiteNavbarServer() {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user ? await supabase.from("users").select("role").eq("id", user.id).single() : { data: null } as any;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">BeSkilled</Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link href="/">Home</Link>
          {profile?.role === "admin" ? (
            <>
              <Link href="/admin">New Course</Link>
              <Link href="/admin/courses">Admin</Link>
            </>
          ) : (
            <Link href="/dashboard">My Courses</Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <form action="/auth/signout" method="post">
              <Button size="sm" variant="outline" type="submit">Sign out</Button>
            </form>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="outline">Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}


