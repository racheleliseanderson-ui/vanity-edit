import { useId, useState } from "react";

/** Tappable definition — `title` tooltips do not fire on touch. */
export function InfoTip({
  label,
  children,
  className = "",
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className={`inline-flex max-w-full flex-wrap items-center gap-1.5 ${className}`}>
      {label ? <span>{label}</span> : null}
      <button
        type="button"
        className="inline-flex size-7 shrink-0 items-center justify-center border border-border font-mono text-[11px] leading-none text-champagne hover:border-champagne/60 focus-visible:outline focus-visible:outline-champagne"
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? "Hide definition" : "Show definition"}
        onClick={() => setOpen((v) => !v)}
      >
        i
      </button>
      {open ? (
        <span id={id} role="note" className="basis-full text-xs leading-relaxed text-muted-foreground">
          {children}
        </span>
      ) : null}
    </span>
  );
}
