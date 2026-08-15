import { useState } from "react";
import { Chip, DeltaNumber, Meter, Slider } from "@/components/mi/viz";
import type { Profile, SkinType } from "@/lib/mi/types";
import { TERMS } from "@/lib/mi/vocab";
import {
  WEAR_INTENTS,
  WEAR_PRESETS,
  type WearActivity,
  type WearBagCap,
  type WearClimate,
  type WearDay,
  type WearIntent,
  type WearLighting,
  type WearReading,
  type WearTexture,
  type WearTouchups,
} from "@/lib/mi/wear";

const SKINS: SkinType[] = ["dry", "normal", "combination", "oily"];
const LEVEL = ["None", "Some", "A lot", "Constantly"];
const WEAR_TEXTURES: { id: WearTexture; label: string }[] = [
  { id: "smooth", label: "Smooth" },
  { id: "pores", label: "Visible pores" },
  { id: "lines", label: "Fine lines" },
  { id: "both", label: "Pores + lines" },
];
const WEAR_CLIMATES: WearClimate[] = ["humid", "temperate", "arid"];
const WEAR_ACTIVITIES: { id: WearActivity; label: string }[] = [
  { id: "desk", label: "Seated / desk" },
  { id: "onfeet", label: "On your feet" },
  { id: "active", label: "Moving & sweating" },
];
const WEAR_TOUCH: { id: WearTouchups; label: string }[] = [
  { id: "none", label: "None" },
  { id: "once", label: "Once" },
  { id: "often", label: "Often" },
];
const WEAR_BAG: { id: WearBagCap; label: string }[] = [
  { id: "none", label: "No bag" },
  { id: "clutch", label: "Clutch" },
  { id: "tote", label: "Tote" },
];
const WEAR_LIGHT: { id: WearLighting; label: string }[] = [
  { id: "daylight", label: "Daylight" },
  { id: "office", label: "Office" },
  { id: "evening", label: "Evening / candlelight" },
  { id: "flash", label: "Flash & video" },
];

function toggle<T>(arr: T[], v: T) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function WearStage({
  wear,
  wearDay,
  wearPreset,
  setWear,
  profile,
  faceOverride,
  onFaceOverride,
  onResetDayBrief,
  onApplyPreset,
}: {
  wear: WearReading;
  wearDay: WearDay;
  wearPreset?: string | undefined;
  setWear: (patch: Partial<WearDay>) => void;
  profile: Profile;
  faceOverride: boolean;
  onFaceOverride: (on: boolean) => void;
  onResetDayBrief: () => void;
  onApplyPreset: (id: string) => void;
}) {
  const [openWearScore, setOpenWearScore] = useState<string | null>(null);

  return (
    <section className="stage-in">
      <p className="eyebrow">Wear & Longevity</p>
      <p className="display mt-3 max-w-2xl text-3xl md:text-5xl">
        Will this face hold up over the day? Hour-by-hour integrity, failure modes, and three coached pathways.
      </p>
      <div className="mt-10">
        <div className="panel mb-8 p-6 md:p-8">
          <p className="eyebrow">Day brief · live</p>
          <h3 className="display mt-2 text-3xl md:text-4xl">{wear.headline}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Hours, climate, activity and fussing belong to this day. Skin, dehydration and reactivity come from the
            instrument unless today's face is genuinely different. Day-brief pancake is a different 0–100 from the
            profile risk in the header.
          </p>
          <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted-foreground">{TERMS.dayBriefPancake}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {WEAR_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onApplyPreset(p.id)}
                className={`min-h-11 border px-4 py-2 text-[0.58rem] tracking-[0.24em] uppercase transition-colors ${
                  wearPreset === p.id
                    ? "border-champagne bg-champagne/10 text-champagne"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.name}
              </button>
            ))}
            <button
              type="button"
              onClick={onResetDayBrief}
              className="min-h-11 border border-border px-4 py-2 text-[0.58rem] tracking-[0.24em] uppercase text-muted-foreground transition-colors hover:text-foreground"
            >
              Reset hours to instrument
            </button>
          </div>
        </div>

        <div className="mb-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <p className="text-[0.62rem] tracking-[0.26em] uppercase text-champagne">Skin · from the instrument</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {profile.skin} · dehydration {LEVEL[wearDay.dehydration]} · reactivity {LEVEL[wearDay.reactivity]}. These
                three are locked to the instrument so Wear does not ask them again.
              </p>
              <button
                type="button"
                aria-pressed={faceOverride}
                onClick={() => onFaceOverride(!faceOverride)}
                className={`mt-3 min-h-11 border px-4 py-2 text-[0.58rem] tracking-[0.24em] uppercase transition-colors ${
                  faceOverride
                    ? "border-champagne bg-champagne/10 text-champagne"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {faceOverride ? "Using today's face" : "Today's face is different"}
              </button>
              {faceOverride && (
                <>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {SKINS.map((s) => (
                      <Chip key={s} active={wearDay.skinType === s} onClick={() => setWear({ skinType: s })}>
                        <span className="capitalize">{s}</span>
                      </Chip>
                    ))}
                  </div>
                  <div className="mt-4 space-y-4">
                    <Slider
                      label="Dehydration today"
                      hint={LEVEL[wearDay.dehydration]!}
                      min={0}
                      max={3}
                      value={wearDay.dehydration}
                      onChange={(n) => setWear({ dehydration: n })}
                    />
                    <Slider
                      label="Reactivity today"
                      hint={LEVEL[wearDay.reactivity]!}
                      min={0}
                      max={3}
                      value={wearDay.reactivity}
                      onChange={(n) => setWear({ reactivity: n })}
                    />
                  </div>
                </>
              )}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {WEAR_TEXTURES.map((tex) => (
                  <Chip key={tex.id} active={wearDay.texture === tex.id} onClick={() => setWear({ texture: tex.id })}>
                    {tex.label}
                  </Chip>
                ))}
              </div>
              <div className="mt-4 space-y-4">
                <Slider
                  label="Unevenness"
                  hint={LEVEL[wearDay.unevenness]!}
                  min={0}
                  max={3}
                  value={wearDay.unevenness}
                  onChange={(n) => setWear({ unevenness: n })}
                />
              </div>
            </div>
            <div>
              <p className="text-[0.62rem] tracking-[0.26em] uppercase text-champagne">Intent</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {WEAR_INTENTS.map((g) => (
                  <Chip
                    key={g.id}
                    active={wearDay.intents.includes(g.id)}
                    note={g.hint}
                    onClick={() => setWear({ intents: toggle(wearDay.intents, g.id as WearIntent) })}
                  >
                    {g.label}
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[0.62rem] tracking-[0.26em] uppercase text-champagne">Hours · touch-ups · ceiling</p>
              <div className="mt-4 space-y-4">
                <Slider
                  label="Hours the look must last"
                  hint={`${wearDay.hours} h`}
                  min={4}
                  max={16}
                  value={wearDay.hours}
                  onChange={(n) => setWear({ hours: n })}
                />
                <Slider
                  label="Maintenance ceiling (steps)"
                  hint={`${wearDay.tolerance} steps`}
                  min={1}
                  max={6}
                  value={wearDay.tolerance}
                  onChange={(n) => setWear({ tolerance: n })}
                />
                <Slider
                  label="Desire"
                  hint={["Wear less", "A little", "Enjoy it", "Ceremony", "Editorial"][wearDay.desire] ?? `${wearDay.desire}`}
                  min={0}
                  max={4}
                  value={wearDay.desire}
                  onChange={(n) => setWear({ desire: n })}
                />
              </div>
              <p className="mt-4 text-[0.58rem] tracking-[0.2em] uppercase text-muted-foreground">Touch-up frequency</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {WEAR_TOUCH.map((touch) => (
                  <Chip key={touch.id} active={wearDay.touchups === touch.id} onClick={() => setWear({ touchups: touch.id })}>
                    {touch.label}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[0.62rem] tracking-[0.26em] uppercase text-champagne">Climate · activity · light</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {WEAR_CLIMATES.map((c) => (
                  <Chip key={c} active={wearDay.climate === c} onClick={() => setWear({ climate: c })}>
                    <span className="capitalize">{c}</span>
                  </Chip>
                ))}
              </div>
              <div className="mt-4">
                <Slider
                  label="Heat"
                  hint={["Cool", "Mild", "Warm", "Hot", "Oppressive"][wearDay.heat]!}
                  min={0}
                  max={4}
                  value={wearDay.heat}
                  onChange={(n) => setWear({ heat: n })}
                />
              </div>
              <button
                type="button"
                onClick={() => setWear({ acIndoor: !wearDay.acIndoor })}
                className={`mt-3 w-full border px-4 py-3 text-left text-sm transition-colors ${
                  wearDay.acIndoor ? "border-champagne bg-champagne/10 text-champagne" : "border-border text-muted-foreground"
                }`}
              >
                Mostly AC / indoor day
              </button>
              <div className="mt-3 grid gap-2">
                {WEAR_ACTIVITIES.map((a) => (
                  <Chip key={a.id} active={wearDay.activity === a.id} onClick={() => setWear({ activity: a.id })}>
                    {a.label}
                  </Chip>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {WEAR_LIGHT.map((l) => (
                  <Chip key={l.id} active={wearDay.lighting === l.id} onClick={() => setWear({ lighting: l.id })}>
                    {l.label}
                  </Chip>
                ))}
              </div>
              <p className="mt-4 text-[0.58rem] tracking-[0.2em] uppercase text-muted-foreground">Carry capacity</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {WEAR_BAG.map((b) => (
                  <Chip key={b.id} active={wearDay.bagCap === b.id} onClick={() => setWear({ bagCap: b.id })}>
                    {b.label}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <p className="eyebrow">Live scores · 0–100 · weights named</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {wear.scores.map((s) => {
              const open = openWearScore === s.id;
              const tone =
                s.better === "low" ? (s.value > 50 ? "oxblood" : "champagne") : s.value < 45 ? "oxblood" : "champagne";
              return (
                <article key={s.id} className="panel p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm">{s.label}</p>
                    <span className="text-[0.58rem] tracking-[0.18em] uppercase text-muted-foreground">better · {s.better}</span>
                  </div>
                  <p className="display mt-2 text-4xl tabular-nums">
                    <DeltaNumber value={s.value} />
                  </p>
                  <div className="mt-3">
                    <Meter value={s.value} label=" " right="" tone={tone} />
                  </div>
                  <p className="mt-3 font-mono text-[0.55rem] leading-relaxed tracking-[0.02em] text-champagne/90">{s.formula}</p>
                  {s.id === "pancake" && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{TERMS.dayBriefPancake}</p>}
                  {s.id === "architecture" && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{TERMS.architecture}</p>}
                  {s.id === "confidence" && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{TERMS.confidence}</p>}
                  <button
                    type="button"
                    onClick={() => setOpenWearScore(open ? null : s.id)}
                    className="mt-3 text-[0.58rem] tracking-[0.22em] uppercase text-champagne"
                    aria-expanded={open}
                  >
                    {open ? "Hide weights" : "Show weights"}
                  </button>
                  {open && (
                    <ul className="mt-3 space-y-2 border-l border-champagne/40 pl-4">
                      {s.weights.map((w) => (
                        <li key={w.label} className="text-xs">
                          <span className="flex justify-between gap-3">
                            <span>{w.label}</span>
                            <span
                              className="tabular-nums"
                              style={{
                                color:
                                  (w.delta > 0 && s.better === "low") || (w.delta < 0 && s.better === "high")
                                    ? "var(--tone-warn)"
                                    : "var(--tone-good)",
                              }}
                            >
                              {w.delta > 0 ? `+${w.delta}` : w.delta}
                            </span>
                          </span>
                          <span className="mt-0.5 block font-mono text-[0.52rem] text-muted-foreground">{w.weight}</span>
                          <span className="mt-0.5 block text-muted-foreground">{w.note}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
          {wear.drivers.length > 0 && (
            <div className="mt-6 border border-border p-5">
              <p className="text-[0.62rem] tracking-[0.26em] uppercase text-muted-foreground">What is driving this day</p>
              <ul className="mt-4 space-y-2">
                {wear.drivers.slice(0, 6).map((d) => (
                  <li
                    key={d.label}
                    className="grid gap-1 border-b border-border pb-2 text-sm last:border-0 md:grid-cols-[minmax(0,1fr)_auto]"
                  >
                    <span>
                      {d.label}
                      <span className="mt-0.5 block text-xs text-muted-foreground">{d.note}</span>
                    </span>
                    <span className="text-[0.62rem] tracking-[0.18em] uppercase text-champagne">weight {d.weight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mb-12">
          <p className="eyebrow">Three coached pathways</p>
          <h3 className="display mt-2 text-3xl md:text-4xl">
            Veil · Edit · <span className="gilt-text italic">Editorial</span>
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Each pathway re-scores day-brief pancake, architecture and longevity for this day brief — not the profile
            pancake risk in the header. The recommended column is the one the weights elected — not the one that
            flatters desire.
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {wear.pathways.map((p) => (
              <article
                key={p.id}
                className={`flex flex-col border p-6 ${p.recommended ? "border-champagne bg-champagne/[0.05]" : "border-border"}`}
              >
                <p className="eyebrow">{p.recommended ? "Recommended" : "Alternative"}</p>
                <h4 className="display mt-2 text-3xl">{p.name}</h4>
                <p className="mt-2 text-sm italic text-muted-foreground">{p.claim}</p>
                <div className="mt-5 space-y-3">
                  <Meter
                    value={p.pancake}
                    label="Day-brief pancake (low is good)"
                    right={`${p.pancake}`}
                    tone={p.pancake > 50 ? "oxblood" : "champagne"}
                  />
                  <Meter value={p.architecture} label="Architecture (high is good)" right={`${p.architecture}`} />
                  <Meter value={p.longevity} label="Longevity (high is good)" right={`${p.longevity}`} />
                </div>
                <p className="mt-4 text-[0.58rem] tracking-[0.2em] uppercase text-muted-foreground">
                  {p.load} steps · ceiling {wearDay.tolerance}
                </p>
                <ul className="mt-4 space-y-1 text-xs leading-relaxed text-muted-foreground">
                  {p.why.map((line) => (
                    <li key={line}>— {line}</li>
                  ))}
                </ul>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{p.verdict}</p>
                <ol className="mt-5 space-y-3 border-t border-border pt-5">
                  {p.steps.map((s) => (
                    <li key={`${p.id}-${s.order}`} className="text-sm">
                      <span className="text-[0.58rem] tracking-[0.2em] uppercase text-champagne">
                        {String(s.order).padStart(2, "0")}
                      </span>
                      <span className="mt-1 block">{s.name}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {s.amount} · {s.placement}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{s.note}</span>
                    </li>
                  ))}
                </ol>
                {p.coaching.length > 0 && (
                  <ul className="mt-auto space-y-1 border-t border-border pt-4 text-xs text-muted-foreground">
                    {p.coaching.map((c) => (
                      <li key={c}>· {c}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <p className="eyebrow">Wear forecast · hour by hour</p>
          <h3 className="display mt-2 text-3xl md:text-4xl">
            {wear.breakHour != null
              ? `Starts reading as makeup around hour ${wear.breakHour}`
              : `Holds all ${wearDay.hours} hours on the recommended pathway`}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Integrity starts high and decays with heat, sebum, activity and pancake load. Refresh events appear only when
            you said you will touch up and you have carry capacity.
          </p>
          <div className="mt-8 overflow-x-auto">
            <div className="flex min-w-max gap-1 pb-2">
              {wear.forecast.map((f) => (
                <div key={f.hour} className="flex w-10 flex-col items-center gap-1 sm:w-12">
                  <div className="flex h-28 w-full items-end bg-secondary/40">
                    <div
                      className="w-full transition-all"
                      style={{
                        height: `${f.integrity}%`,
                        background:
                          f.event === "break"
                            ? "var(--oxblood)"
                            : f.event === "refresh"
                              ? "var(--gradient-champagne)"
                              : f.integrity < 50
                                ? "var(--tone-warn)"
                                : "var(--champagne)",
                      }}
                      title={`h${f.hour}: ${f.integrity}${f.event ? ` · ${f.event}` : ""}`}
                    />
                  </div>
                  <span className="text-[0.5rem] tabular-nums tracking-[0.08em] text-muted-foreground">{f.hour}</span>
                  {f.event && (
                    <span className="text-[0.48rem] uppercase tracking-[0.1em] text-champagne">
                      {f.event === "refresh" ? "↻" : "↓"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <ul className="mt-6 space-y-2 text-sm">
            {wear.forecast
              .filter((f) => f.event || f.hour === 0 || f.hour === wearDay.hours)
              .map((f) => (
                <li key={`note-${f.hour}`} className="flex flex-wrap gap-x-3 gap-y-1 border-b border-border pb-2">
                  <span className="text-[0.58rem] tracking-[0.2em] uppercase text-champagne">
                    h {String(f.hour).padStart(2, "0")}
                  </span>
                  <span className="tabular-nums text-muted-foreground">{f.integrity}</span>
                  <span className="text-muted-foreground">
                    {f.note ??
                      (f.hour === 0 ? "Apply, then stop." : f.hour === wearDay.hours ? "End of modelled wear." : "")}
                  </span>
                </li>
              ))}
          </ul>
        </div>

        <div className="mb-12">
          <p className="eyebrow">Most likely failure modes</p>
          <h3 className="display mt-2 text-3xl">Ranked · with one mitigation each</h3>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {wear.failures.map((f, i) => (
              <div key={f.id} className="grid gap-3 py-6 md:grid-cols-[3rem_1fr_auto_1.2fr] md:items-start md:gap-6">
                <span className="display text-xl text-champagne">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h4 className="display text-2xl">{f.name}</h4>
                  <p className="mt-1 text-[0.58rem] tracking-[0.2em] uppercase text-muted-foreground">peak ~hour {f.hour}</p>
                </div>
                <div className="w-full max-w-[140px]">
                  <Meter
                    value={f.likelihood}
                    label="Likelihood"
                    right={`${f.likelihood}`}
                    tone={f.likelihood > 55 ? "oxblood" : "champagne"}
                  />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="text-[0.58rem] tracking-[0.2em] uppercase text-champagne">Mitigation · </span>
                  {f.fix}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="eyebrow">Bag read for this scenario</p>
          <h3 className="display mt-2 text-3xl md:text-4xl">
            What earns the bag · <span className="gilt-text italic">what stays home</span>
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Scenario items first, then anything you marked in the instrument as owned. Sunscreen is never scored for bag
            space.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {wear.bag.map((b) => (
              <article key={b.id} className="panel p-5">
                <p
                  className={`text-[0.58rem] tracking-[0.22em] uppercase ${
                    b.verdict === "earns the bag"
                      ? "text-champagne"
                      : b.verdict === "out of scope"
                        ? "text-muted-foreground"
                        : "text-rouge"
                  }`}
                >
                  {b.verdict}
                  {b.source === "owned" ? " · from your bag" : ""}
                </p>
                <h4 className="display mt-2 text-2xl">{b.name}</h4>
                {b.score != null && (
                  <p className="mt-1 text-[0.58rem] tabular-nums tracking-[0.16em] uppercase text-muted-foreground">
                    score {b.score}
                  </p>
                )}
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.why}</p>
              </article>
            ))}
          </div>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Educational only — not a diagnosis, toxin score or safety ranking. Weather and activity affect wear variables
          only. UV reapplication follows product directions independently of this forecast.
        </p>
      </div>
    </section>
  );
}
