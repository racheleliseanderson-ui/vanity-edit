import { useEffect, useRef, useState } from "react";

import type { Architecture, Contribution } from "@/lib/mi/types";
import { TERMS } from "@/lib/mi/vocab";

export function riskTone(risk: number) {
  return risk < 25 ? "var(--tone-good)" : risk < 45 ? "var(--tone-fair)" : risk < 65 ? "var(--tone-warn)" : "var(--tone-bad)";
}

export function RiskDial({ arch, compact = false }: { arch: Architecture; compact?: boolean }) {
  const r = 54;
  const circ = Math.PI * r; // semicircle
  const dash = (arch.risk / 100) * circ;
  const tone = riskTone(arch.risk);
  return (
    <div className="flex items-center gap-5">
      <svg width={140} height={84} viewBox="0 0 140 84" className="shrink-0" aria-hidden>
        <path d="M16 76 A54 54 0 0 1 124 76" fill="none" stroke="var(--track)" strokeWidth="9" strokeLinecap="round" />
        <path
          d="M16 76 A54 54 0 0 1 124 76"
          fill="none"
          stroke={tone}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray 600ms cubic-bezier(0.16,1,0.3,1), stroke 400ms" }}
        />
      </svg>
      <span className="sr-only">Pancake risk {arch.risk} out of 100 · finish skin-like {arch.skinlike}</span>
      <div>
        <p className="eyebrow">Profile pancake risk</p>
        <p className="display text-5xl leading-none" style={{ color: tone }}>
          <DeltaNumber value={arch.risk} />
        </p>
        <p className="display mt-1 text-2xl" style={{ color: tone }}>
          {arch.headline}
        </p>
        <p className="mt-2 text-[0.62rem] tracking-[0.2em] uppercase text-muted-foreground">
          Finish · skin-like <span className="text-foreground tabular-nums">{arch.skinlike}</span>
          <span className="mx-2 opacity-40">·</span>
          base {arch.baseRisk ?? 30} + variables
        </p>
        {!compact && <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{arch.verdict}</p>}
        <p className="mt-3 max-w-md text-xs leading-relaxed text-muted-foreground">{TERMS.pancakeRisk}</p>
        <p className="mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">{TERMS.architecture}</p>
      </div>
    </div>
  );
}

export function Spectrum({ value, labels }: { value: number; labels?: [string, string] }) {
  return (
    <div>
      <div className="relative h-[6px] w-full rounded-full spectrum-bar">
        <span
          className="absolute -top-[7px] h-5 w-5 -translate-x-1/2 rounded-full bg-foreground"
          style={{
            left: `${value}%`,
            border: "1px solid var(--marker-ring)",
            boxShadow: "var(--marker-glow)",
            transition: "left 600ms cubic-bezier(0.16,1,0.3,1)",
          }}
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
      } min-h-11 border px-4 py-3`}
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
        className="mt-3 h-6 w-full cursor-pointer appearance-none bg-transparent accent-[oklch(0.83_0.085_82)] [&::-webkit-slider-runnable-track]:h-[3px] [&::-webkit-slider-runnable-track]:bg-secondary [&::-webkit-slider-thumb]:mt-[-9px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[oklch(0.83_0.085_82)]"
      />
    </label>
  );
}

/* ─────────── Live numbers ─────────── */

export function DeltaNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const prev = useRef(value);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (value === prev.current) return;
    setFlash(value > prev.current ? "up" : "down");
    prev.current = value;
    const t = setTimeout(() => setFlash(null), 1100);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <span key={flash ? `${value}-${flash}` : value} className={flash === "up" ? "flash-up" : flash === "down" ? "flash-down" : undefined}>
      {value}
      {suffix}
    </span>
  );
}

/* ─────────── Signed ledger bars ─────────── */

export function Ledger({ items, caption }: { items: Contribution[]; caption?: string }) {
  const max = Math.max(1, ...items.map((i) => Math.abs(i.delta)));
  return (
    <div className="space-y-3">
      {caption && <p className="text-[0.6rem] tracking-[0.26em] uppercase text-muted-foreground">{caption}</p>}
      {items.map((c) => {
        const pos = c.delta > 0;
        return (
          <div key={`${c.label}-${c.delta}`} className="group">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-xs">{c.label}</span>
              <span className="text-[0.66rem] tracking-[0.18em] tabular-nums" style={{ color: pos ? "var(--tone-good)" : "var(--tone-warn)" }}>
                {pos ? `+${c.delta}` : c.delta}
              </span>
            </div>
            <div className="mt-1.5 flex h-[3px] w-full items-center">
              <div className="flex h-full w-1/2 justify-end">
                {!pos && (
                  <span
                    className="h-full"
                    style={{ width: `${(Math.abs(c.delta) / max) * 100}%`, background: "var(--tone-warn)", transition: "width 600ms cubic-bezier(0.16,1,0.3,1)" }}
                  />
                )}
              </div>
              <span className="h-[7px] w-px bg-border" />
              <div className="flex h-full w-1/2">
                {pos && (
                  <span
                    className="h-full"
                    style={{ width: `${(Math.abs(c.delta) / max) * 100}%`, background: "var(--tone-good)", transition: "width 600ms cubic-bezier(0.16,1,0.3,1)" }}
                  />
                )}
              </div>
            </div>
            {c.weight && (
              <p className="mt-1 font-mono text-[0.58rem] tracking-[0.04em] text-champagne/90">weight · {c.weight}</p>
            )}
            <p className="mt-1 text-[0.68rem] leading-snug text-muted-foreground">{c.note}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────── Kit tension ─────────── */

export function Tension({ value, note }: { value: number; note: string }) {
  const tone = value < 20 ? "var(--tone-good)" : value < 45 ? "var(--tone-fair)" : value < 70 ? "var(--tone-warn)" : "var(--tone-bad)";
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[0.62rem] tracking-[0.26em] uppercase text-muted-foreground">Kit tension</span>
        <span className="display text-2xl tabular-nums" style={{ color: tone }}>
          <DeltaNumber value={value} />
        </span>
      </div>
      <div className="mt-3 flex gap-[3px]">
        {Array.from({ length: 24 }).map((_, i) => {
          const on = (i + 1) / 24 <= value / 100;
          return (
            <span
              key={i}
              className="h-6 flex-1"
              style={{
                background: on ? tone : "var(--track)",
                opacity: on ? 0.35 + (i / 24) * 0.65 : 1,
                transition: "background 400ms, opacity 400ms",
              }}
            />
          );
        })}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{note}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{TERMS.kitTension}</p>
    </div>
  );
}
