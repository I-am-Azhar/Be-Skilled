"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  text: string | null | undefined;
  initialChars?: number;
};

export function ExpandableText({ text, initialChars = 160 }: Props) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const isLong = text.length > initialChars;
  const display = expanded || !isLong ? text : text.slice(0, initialChars) + "…";

  return (
    <div className="space-y-2">
      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{display}</p>
      {isLong ? (
        <Button type="button" variant="ghost" size="sm" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "View less" : "View more"}
        </Button>
      ) : null}
    </div>
  );
}



