import type { Architecture } from "@/lib/mi/types";

export function RiskDial({ arch, compact = false }: { arch: Architecture; compact?: boolean }) {
  const r = 54;
  const circ = Math.PI * r; // semicircle
  const dash = (arch.risk / 100) * circ;
  const tone =
    arch.risk < 25 ? "oklch(0.72 0.05 150)" : arch.risk < 45 ? "oklch(0.83 0.085 82)" : arch.risk < 65 ? "oklch(0.66 0.14 34)" : "oklch(0.55 0.18 18)";
  return (
    <div className="flex items-center gap-5">
      <svg width={140} height={84} viewBox="0 0 140 84" className="shrink-0" aria-hidden>
        <path d="M16 76 A54 54 0 0 1 124 76" fill="none" stroke="oklch(0.98 0.01 80 / 12%)" strokeWidth="9" strokeLinecap="round" />
        <path
          d="M16 76 A54 54 0 0 1 124 76"
          fill="none"
          stroke={tone}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray 600ms cubic-bezier(0.16,1,0.3,1), stroke 400ms" }}
        />
        <text x="70" y="66" textAnchor="middle" className="display" fill="currentColor" fontSize="30">
          {arch.risk}
        </text>
      </svg>
      <div>
        <p className="eyebrow">Pancake risk</p>
        <p className="display mt-1 text-2xl" style={{ color: tone }}>
          {arch.headline}
        </p>
        {!compact && <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{arch.verdict}</p>}
      </div>
    </div>
  );
}

export function Spectrum({ value, labels }: { value: number; labels?: [string, string] }) {
  return (
    <div>
      <div className="relative h-[6px] w-full rounded-full spectrum-bar">
        <span
          className="absolute -top-[7px] h-5 w-5 -translate-x-1/2 rounded-full border border-background bg-foreground shadow-[0_0_18px_oklch(0.83_0.085_82/60%)]"
          style={{ left: `${value}%`, transition: "left 600ms cubic-bezier(0.16,1,0.3,1)" }}
        />
      </div>
      <div className="mt-3 flex justify-between text-[0.65rem] tracking-[0.22em] uppercase text-muted-foreground">
        <span>{labels?.[0] ?? "Skin-like"}</span>
        <span>{labels?.[1] ?? "Pancake"}</span>
      </div>
    </div>
  );
}

export function Meter({ value, label, right, tone = "champagne" }: { value: number; label: string; right?: string; tone?: "champagne" | "oxblood" }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm">{label}</span>
        <span className="text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground">{right ?? value}</span>
      </div>
      <div className="mt-2 h-[3px] w-full bg-secondary">
        <div
          className="h-full"
          style={{
            width: `${value}%`,
            background: tone === "champagne" ? "var(--gradient-champagne)" : "var(--oxblood)",
            transition: "width 600ms cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </div>
    </div>
  );
}

export function Chip({
  active,
  onClick,
  children,
  note,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  note?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group text-left transition-all duration-300 ${
        active
          ? "border-champagne/60 bg-champagne/10 text-foreground"
          : "border-border text-muted-foreground hover:border-champagne/40 hover:text-foreground"
      } border px-4 py-3`}
    >
      <span className="block text-sm">{children}</span>
      {note && <span className="mt-1 block text-xs leading-snug opacity-70">{note}</span>}
    </button>
  );
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  hint,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  hint: string;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-4">
        <span className="text-sm">{label}</span>
        <span className="text-[0.7rem] tracking-[0.2em] uppercase text-champagne">{hint}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-[3px] w-full appearance-none bg-secondary accent-[oklch(0.83_0.085_82)]"
      />
    </label>
  );
}