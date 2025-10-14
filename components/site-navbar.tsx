"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SiteNavbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">BeSkilled</Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link href="/" className={pathname === "/" ? "font-medium" : "text-muted-foreground"}>Home</Link>
          <Link href="/dashboard" className={pathname === "/dashboard" ? "font-medium" : "text-muted-foreground"}>Dashboard</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button size="sm" variant="outline">Sign in</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}


