"use client";

import { useState } from "react";

export function CourseCover({ src, alt }: { src: string | null | undefined; alt: string }) {
  const [errored, setErrored] = useState(false);
  const showImage = !!src && !errored;

  return (
    <div className="w-full aspect-video relative overflow-hidden rounded-t-xl bg-gray-200">
      {showImage ? (
        <img
          src={src as string}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <span className="text-gray-500 text-sm">No Image</span>
        </div>
      )}
    </div>
  );
}



