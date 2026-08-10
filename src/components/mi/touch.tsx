import { useEffect, useRef, useState, type ReactNode } from "react";

/** Horizontal swipe recogniser. Ignores vertical scrolls and multi-touch pinches. */
export function useSwipe(onLeft: () => void, onRight: () => void, threshold = 56) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onTouchStart: (e: React.TouchEvent) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0]!;
      start.current = { x: t.clientX, y: t.clientY };
    },
    onTouchEnd: (e: React.TouchEvent) => {
      const s = start.current;
      start.current = null;
      const t = e.changedTouches[0];
      if (!s || !t) return;
      const dx = t.clientX - s.x;
      const dy = t.clientY - s.y;
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.4) return;
      if (dx < 0) onLeft();
      else onRight();
    },
  };
}

/** A bottom sheet for small screens: drag handle, swipe-to-dismiss, scroll lock, focus return. */
export function Sheet({
  open,
  onClose,
  title,
  id,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  id?: string;
  children: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);
  const [drag, setDrag] = useState(0);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="no-print fixed inset-0 z-50 flex items-end lg:hidden" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 h-full w-full"
        style={{ background: "var(--veil-strong)" }}
      />
      <div
        ref={panel}
        id={id}
        tabIndex={-1}
        className="panel relative max-h-[86dvh] w-full overflow-y-auto rounded-t-2xl px-5 pb-10 pt-3 outline-none"
        style={{ transform: `translateY(${drag}px)`, transition: startY.current === null ? "transform 300ms cubic-bezier(0.16,1,0.3,1)" : "none" }}
        onTouchStart={(e) => {
          startY.current = e.touches[0]?.clientY ?? null;
        }}
        onTouchMove={(e) => {
          if (startY.current === null) return;
          const dy = (e.touches[0]?.clientY ?? 0) - startY.current;
          if (dy > 0) setDrag(dy);
        }}
        onTouchEnd={() => {
          startY.current = null;
          if (drag > 110) onClose();
          setDrag(0);
        }}
      >
        <div className="sticky top-0 -mx-5 mb-4 flex flex-col items-center gap-3 bg-[var(--veil-strong)] px-5 pb-3 pt-1 backdrop-blur-xl">
          <span aria-hidden className="h-1 w-12 rounded-full bg-champagne/60" />
          <div className="flex w-full items-center justify-between gap-4">
            <span className="text-[0.66rem] tracking-[0.24em] uppercase text-champagne">{title}</span>
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 px-3 text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Snap carousel with edge fade and position dots. */
export function Carousel({ count, label, children }: { count: number; label: string; children: ReactNode }) {
  const rail = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);

  return (
    <div className="relative">
      <div
        ref={rail}
        role="group"
        aria-label={label}
        onScroll={(e) => {
          const el = e.currentTarget;
          const per = el.scrollWidth / Math.max(1, count);
          setAt(Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / per))));
        }}
        className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-5 pb-3 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollBehavior: "smooth" }}
      >
        {children}
      </div>
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 hidden h-[calc(100%-1rem)] w-14 max-md:block"
        style={{ background: "linear-gradient(90deg, transparent, var(--background))" }}
      />
      {count > 1 && (
        <div className="mt-3 flex justify-center gap-2 md:hidden">
          {Array.from({ length: count }).map((_, i) => (
            <span
              key={i}
              aria-hidden
              className="h-1.5 rounded-full transition-all"
              style={{ width: i === at ? "1.5rem" : "0.375rem", background: i === at ? "var(--champagne)" : "var(--track)" }}
            />
          ))}
          <span className="sr-only">
            {at + 1} of {count}
          </span>
        </div>
      )}
    </div>
  );
}

/** A press-friendly action with a brief confirmation flash. */
export function ConfirmButton({
  onPress,
  children,
  confirmed,
  className = "",
}: {
  onPress: () => void;
  children: ReactNode;
  confirmed: string;
  className?: string;
}) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <button
      type="button"
      onClick={() => {
        onPress();
        setDone(true);
      }}
      className={`min-h-11 touch-manipulation select-none px-4 py-2 text-[0.6rem] tracking-[0.24em] uppercase transition-colors active:opacity-70 ${
        done ? "border border-champagne bg-champagne/15 text-champagne" : "border border-champagne/50 text-champagne hover:bg-champagne/10"
      } ${className}`}
    >
      {done ? confirmed : children}
    </button>
  );
}
