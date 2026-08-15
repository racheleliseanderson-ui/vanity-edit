import type { ReactNode } from "react";

export function PrintBar({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children?: ReactNode;
}) {
  return (
    <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-3 border border-border bg-card/40 px-5 py-4">
      <div>
        <p className="text-[0.62rem] tracking-[0.24em] uppercase text-champagne">{title}</p>
        <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">{note}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-11 items-center border border-champagne/60 px-6 text-[0.62rem] tracking-[0.24em] uppercase text-champagne transition-colors hover:bg-champagne/10"
        >
          Print / save as PDF
        </button>
      </div>
    </div>
  );
}
