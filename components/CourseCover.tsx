"use client";

import { useState } from "react";
import Image from "next/image";

export function CourseCover({ src, alt }: { src: string | null | undefined; alt: string }) {
  const [errored, setErrored] = useState(false);
  const showImage = !!src && !errored;

  return (
    <div className="w-full aspect-video relative overflow-hidden rounded-t-xl bg-black">
      {showImage ? (
        <Image
          src={src as string}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 1024px"
          className="object-cover"
          priority
          onError={() => setErrored(true)}
        />
      ) : null}
    </div>
  );
}



