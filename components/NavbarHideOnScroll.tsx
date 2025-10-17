"use client";

import { useEffect, useRef, useState } from "react";

export function NavbarHideOnScroll({ children }: { children: React.ReactNode }) {
  const lastYRef = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastYRef.current;
      // Hide after a small scroll down beyond threshold; show on scroll up
      const threshold = 80;
      if (y > threshold && delta > 0) {
        setHidden(true);
      } else if (delta < 0) {
        setHidden(false);
      }
      lastYRef.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={
        "transition-all duration-300 will-change-transform" +
        (hidden ? " -translate-y-8 opacity-0 pointer-events-none" : " translate-y-0 opacity-100")
      }
    >
      {children}
    </div>
  );
}








