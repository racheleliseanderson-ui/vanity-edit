import { useEffect, useRef, useState, type ReactNode } from "react";

/** Horizontally scrollable row with edge fades and arrow affordances. */
export function ScrollRail({
  children,
  label,
  className = "",
}: {
  children: ReactNode;
  label?: string;
  className?: string;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [moreLeft, setMoreLeft] = useState(false);
  const [moreRight, setMoreRight] = useState(false);

  const measure = () => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setMoreLeft(el.scrollLeft > 8);
    setMoreRight(max - el.scrollLeft > 8);
  };

  useEffect(() => {
    measure();
    const el = rail.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const jump = (dir: -1 | 1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(160, el.clientWidth * 0.7), behavior: "smooth" });
  };

  return (
    <div className={`relative min-w-0 ${className}`}>
      {moreLeft && (
        <button
          type="button"
          aria-label="Scroll back"
          onClick={() => jump(-1)}
          className="absolute left-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-border bg-background/90 text-champagne sm:flex"
        >
          ←
        </button>
      )}
      <div
        ref={rail}
        role={label ? "group" : undefined}
        aria-label={label}
        onScroll={measure}
        className="flex min-w-0 w-full items-center gap-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      {moreLeft && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-8"
          style={{ background: "linear-gradient(90deg, var(--background), transparent)" }}
        />
      )}
      {moreRight && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-10"
          style={{ background: "linear-gradient(270deg, var(--background), transparent)" }}
        />
      )}
      {moreRight && (
        <button
          type="button"
          aria-label="Scroll further"
          onClick={() => jump(1)}
          className="absolute right-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-border bg-background/90 text-champagne sm:flex"
        >
          →
        </button>
      )}
    </div>
  );
}
