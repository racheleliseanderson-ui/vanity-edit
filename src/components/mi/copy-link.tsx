import { useState } from "react";

import { copyText } from "@/lib/mi/share";

export function CopyLinkButton({
  href,
  label = "Copy my link",
  className = "",
}: {
  href: string;
  label?: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle");
  return (
    <button
      type="button"
      onClick={async () => {
        const ok = await copyText(href);
        setState(ok ? "ok" : "fail");
        window.setTimeout(() => setState("idle"), 1800);
      }}
      className={`inline-flex min-h-11 items-center border px-7 py-4 text-[0.72rem] tracking-[0.3em] uppercase transition-colors ${
        state === "ok"
          ? "border-champagne bg-champagne/15 text-champagne"
          : "border-border text-muted-foreground hover:border-champagne/60 hover:text-foreground"
      } ${className}`}
    >
      {state === "ok" ? "Link copied" : state === "fail" ? "Copy failed" : label}
    </button>
  );
}
