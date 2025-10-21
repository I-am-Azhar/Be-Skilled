"use client";
import LogoLoop from "./LogoLoop";
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from "react-icons/si";

const techLogos = [
  { node: <SiReact size={48} />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs size={48} />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript size={48} />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss size={48} />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

export default function TrustBar() {
  return (
    <div className="relative overflow-hidden py-8">
      <div className="mx-auto max-w-6xl px-4">
        <p className="mb-4 text-center text-sm text-muted-foreground">Trusted by modern web technologies</p>
      </div>
      <div style={{ height: "96px", position: "relative", overflow: "hidden" }}>
        <LogoLoop
          logos={techLogos}
          speed={120}
          direction="left"
          logoHeight={48}
          gap={40}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutColor="var(--background)"
          ariaLabel="Technology partners"
        />
      </div>
    </div>
  );
}


