/**
 * Wear & Longevity engine — ported intelligence from the Edit Instrument
 * (vanity-vice-studio), adapted to sit beside Makeup Match / pathways / bag.
 * Local/browser only. Educational — never medical.
 */

import { TYPE_MAP } from "./catalog";
import type { Climate, Profile, SkinType } from "./types";

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const has = <T extends string>(arr: T[], g: T) => arr.includes(g);

export type WearTexture = "smooth" | "pores" | "lines" | "both";
export type WearClimate = "humid" | "temperate" | "arid";
export type WearActivity = "desk" | "onfeet" | "active";
export type WearTouchups = "none" | "once" | "often";
export type WearLighting = "daylight" | "office" | "evening" | "flash";
export type WearBagCap = "none" | "clutch" | "tote";
export type WearIntent =
  | "looks_like_skin"
  | "even_tone"
  | "blur_pores"
  | "luminosity"
  | "longwear"
  | "camera"
  | "calm_redness"
  | "no_transfer"
  | "quick_am";

export type WearPathwayId = "veil" | "edit" | "editorial";

export interface WearDay {
  skinType: SkinType;
  texture: WearTexture;
  dehydration: number; // 0–3
  reactivity: number; // 0–3
  unevenness: number; // 0–3
  intents: WearIntent[];
  hours: number; // 4–16
  climate: WearClimate;
  heat: number; // 0–4
  acIndoor: boolean;
  activity: WearActivity;
  touchups: WearTouchups;
  /** Maintenance / step ceiling (1–6). */
  tolerance: number;
  desire: number; // 0–4
  bagCap: WearBagCap;
  lighting: WearLighting;
  /** Product-type ids already in the bag (from the instrument). */
  owned: string[];
}

export interface ScoreWeight {
  label: string;
  delta: number;
  note: string;
  weight: string;
}

export interface LiveScore {
  id: string;
  label: string;
  value: number;
  /** Which direction is "good" for this meter. */
  better: "low" | "high";
  formula: string;
  weights: ScoreWeight[];
}

export interface WearStep {
  order: number;
  name: string;
  amount: string;
  placement: string;
  note: string;
}

export interface WearPathway {
  id: WearPathwayId;
  name: string;
  claim: string;
  steps: WearStep[];
  pancake: number;
  architecture: number;
  longevity: number;
  load: number;
  recommended: boolean;
  coaching: string[];
  verdict: string;
  why: string[];
}

export interface ForecastPoint {
  hour: number;
  integrity: number;
  event?: "refresh" | "break";
  note?: string;
}

export interface FailureMode {
  id: string;
  name: string;
  likelihood: number;
  hour: number;
  fix: string;
}

export interface BagReadItem {
  id: string;
  name: string;
  verdict: "earns the bag" | "stays home" | "out of scope";
  why: string;
  score?: number;
  source: "scenario" | "owned";
}

export interface WearReading {
  day: WearDay;
  scores: LiveScore[];
  pancake: number;
  architecture: number;
  longevity: number;
  luminosity: number;
  confidence: number;
  coverageDemand: number;
  load: number;
  pathways: WearPathway[];
  recommended: WearPathway;
  forecast: ForecastPoint[];
  breakHour: number | null;
  failures: FailureMode[];
  bag: BagReadItem[];
  headline: string;
  drivers: { label: string; weight: number; note: string }[];
}

export const WEAR_INTENTS: { id: WearIntent; label: string; hint: string }[] = [
  { id: "looks_like_skin", label: "Reads as skin", hint: "legible skin, not a mask" },
  { id: "even_tone", label: "Even the tone", hint: "quiet the map without thickness" },
  { id: "blur_pores", label: "Soften texture", hint: "optical, not plastered" },
  { id: "luminosity", label: "Keep luminosity", hint: "light on the high planes" },
  { id: "longwear", label: "All-day wear", hint: "hold without rebuild" },
  { id: "camera", label: "Camera & flash", hint: "close range, hard light" },
  { id: "calm_redness", label: "Calm redness", hint: "neutralise before covering" },
  { id: "no_transfer", label: "No transfer", hint: "collars, masks, heat" },
  { id: "quick_am", label: "Five-minute morning", hint: "fewer steps than you think" },
];

export const WEAR_PRESETS: { id: string; name: string; tagline: string; day: Partial<WearDay> }[] = [
  {
    id: "quiet",
    name: "Quiet Luxury",
    tagline: "Read as skin. Nobody names the product.",
    day: {
      skinType: "normal",
      texture: "smooth",
      dehydration: 1,
      reactivity: 1,
      unevenness: 1,
      intents: ["looks_like_skin", "luminosity"],
      hours: 8,
      climate: "temperate",
      heat: 1,
      touchups: "once",
      tolerance: 3,
      desire: 2,
      bagCap: "clutch",
      lighting: "daylight",
      activity: "desk",
    },
  },
  {
    id: "fourteen",
    name: "The Fourteen-Hour Day",
    tagline: "Still standing at the end of it.",
    day: {
      skinType: "combination",
      texture: "pores",
      dehydration: 1,
      reactivity: 1,
      unevenness: 2,
      intents: ["longwear", "even_tone", "blur_pores"],
      hours: 14,
      climate: "temperate",
      heat: 2,
      touchups: "once",
      tolerance: 4,
      desire: 3,
      bagCap: "tote",
      lighting: "office",
      activity: "onfeet",
    },
  },
  {
    id: "heat",
    name: "Heat & Humidity",
    tagline: "Survive the weather, not fight it.",
    day: {
      skinType: "oily",
      texture: "pores",
      dehydration: 0,
      reactivity: 1,
      unevenness: 1,
      intents: ["longwear", "no_transfer", "looks_like_skin"],
      hours: 10,
      climate: "humid",
      heat: 4,
      touchups: "once",
      tolerance: 3,
      desire: 2,
      bagCap: "clutch",
      lighting: "daylight",
      activity: "active",
    },
  },
  {
    id: "camera",
    name: "Camera & Flash",
    tagline: "Close range. Hard light.",
    day: {
      skinType: "normal",
      texture: "both",
      dehydration: 1,
      reactivity: 1,
      unevenness: 2,
      intents: ["camera", "blur_pores", "even_tone"],
      hours: 8,
      climate: "temperate",
      heat: 1,
      touchups: "once",
      tolerance: 5,
      desire: 4,
      bagCap: "tote",
      lighting: "flash",
      activity: "onfeet",
    },
  },
  {
    id: "five",
    name: "Five Minutes",
    tagline: "Low ceiling. High honesty.",
    day: {
      skinType: "normal",
      texture: "smooth",
      dehydration: 1,
      reactivity: 1,
      unevenness: 1,
      intents: ["quick_am", "looks_like_skin"],
      hours: 9,
      climate: "temperate",
      heat: 1,
      touchups: "none",
      tolerance: 2,
      desire: 1,
      bagCap: "none",
      lighting: "daylight",
      activity: "desk",
    },
  },
  {
    id: "reactive",
    name: "Reactive & Red",
    tagline: "Neutralise hue. Leave the rest alone.",
    day: {
      skinType: "dry",
      texture: "lines",
      dehydration: 2,
      reactivity: 3,
      unevenness: 3,
      intents: ["calm_redness", "looks_like_skin"],
      hours: 8,
      climate: "arid",
      heat: 1,
      touchups: "none",
      tolerance: 3,
      desire: 1,
      bagCap: "clutch",
      lighting: "office",
      activity: "desk",
    },
  },
];

function mapClimate(c: Climate): WearClimate {
  if (c === "humid") return "humid";
  if (c === "dry" || c === "altitude") return "arid";
  return "temperate";
}

function mapTexture(p: Profile): WearTexture {
  const pores = p.concerns.some((c) => /pore/i.test(c));
  const lines = p.concerns.some((c) => /line|texture|mature/i.test(c));
  if (pores && lines) return "both";
  if (pores) return "pores";
  if (lines) return "lines";
  return "smooth";
}

function mapIntents(p: Profile): WearIntent[] {
  const out: WearIntent[] = [];
  if (p.goals.includes("escape-pancake") || p.goals.includes("wear-less") || p.coverage < 25) out.push("looks_like_skin");
  if (p.goals.includes("even-tone") || p.coverage >= 35) out.push("even_tone");
  if (p.concerns.some((c) => /pore|texture/i.test(c))) out.push("blur_pores");
  if (p.goals.includes("glow") || p.desire >= 2) out.push("luminosity");
  if (p.goals.includes("longwear") || p.outdoors >= 2) out.push("longwear");
  if (p.goals.includes("event") || p.goals.includes("hd-photo")) out.push("camera");
  if (p.goals.includes("rosacea") || p.concerns.includes("redness")) out.push("calm_redness");
  if (p.goals.includes("performance-sport")) out.push("no_transfer");
  if (p.timeBudget <= 8) out.push("quick_am");
  return out.length ? [...new Set(out)] : ["looks_like_skin"];
}

export function defaultWearDay(p?: Profile): WearDay {
  if (!p) {
    return {
      skinType: "combination",
      texture: "smooth",
      dehydration: 1,
      reactivity: 1,
      unevenness: 1,
      intents: ["looks_like_skin", "longwear"],
      hours: 10,
      climate: "temperate",
      heat: 2,
      acIndoor: false,
      activity: "onfeet",
      touchups: "once",
      tolerance: 3,
      desire: 2,
      bagCap: "clutch",
      lighting: "daylight",
      owned: [],
    };
  }
  const touchups: WearTouchups = p.maintenance === 0 ? "none" : p.maintenance >= 3 ? "often" : "once";
  const bagCap: WearBagCap = p.bag.length === 0 && p.ceiling <= 3 ? "none" : p.ceiling <= 5 ? "clutch" : "tote";
  const activity: WearActivity =
    p.goals.includes("performance-sport") || p.outdoors >= 3 ? "active" : p.outdoors >= 2 ? "onfeet" : "desk";
  const lighting: WearLighting = p.goals.includes("hd-photo") || p.goals.includes("event") ? "flash" : "daylight";
  return {
    skinType: p.skin,
    texture: mapTexture(p),
    dehydration: p.skin === "dry" || p.climate === "altitude" || p.climate === "dry" ? 2 : p.skin === "oily" ? 0 : 1,
    reactivity: p.sensitivity,
    unevenness: Math.min(3, Math.round(p.coverage / 35) + (p.concerns.includes("redness") ? 1 : 0)),
    intents: mapIntents(p),
    hours: Math.min(16, Math.max(6, 8 + (p.outdoors >= 2 ? 2 : 0) + (p.goals.includes("event") ? 4 : 0))),
    climate: mapClimate(p.climate),
    heat: Math.min(4, p.outdoors + (p.climate === "humid" ? 1 : 0)),
    acIndoor: p.outdoors === 0,
    activity,
    touchups,
    tolerance: Math.min(6, Math.max(2, Math.round(p.ceiling / 2) || 3)),
    desire: Math.min(4, p.desire),
    bagCap,
    lighting,
    owned: [...p.bag],
  };
}

/* ─────────────── core maths (from Edit Instrument) ─────────────── */

function coverageDemand(d: WearDay): { value: number; weights: ScoreWeight[] } {
  const w: ScoreWeight[] = [];
  let t = 18;
  const u = d.unevenness * 12;
  t += u;
  w.push({ label: "Unevenness map", delta: u, note: "How much the eye stops on the face.", weight: "unevenness × 12" });
  if (d.texture === "both") {
    t += 14;
    w.push({ label: "Texture (pores + lines)", delta: 14, note: "Both texture maps raise coverage demand.", weight: "+14" });
  } else if (d.texture === "pores" || d.texture === "lines") {
    t += 8;
    w.push({ label: `Texture (${d.texture})`, delta: 8, note: "Visible texture asks for optical work, not mass.", weight: "+8" });
  }
  if (has(d.intents, "camera")) {
    t += 16;
    w.push({ label: "Camera intent", delta: 16, note: "Close range and hard light raise the coverage brief.", weight: "+16" });
  }
  if (has(d.intents, "even_tone")) {
    t += 10;
    w.push({ label: "Even-tone intent", delta: 10, note: "Evenness without thickness is still a demand.", weight: "+10" });
  }
  if (has(d.intents, "calm_redness")) {
    t += 12;
    w.push({ label: "Redness intent", delta: 12, note: "Neutralise first — coverage second.", weight: "+12" });
  }
  if (has(d.intents, "looks_like_skin")) {
    t -= 12;
    w.push({ label: "Reads-as-skin intent", delta: -12, note: "Sheerness is a feature, not a failure.", weight: "−12" });
  }
  if (d.reactivity >= 3) {
    t += 8;
    w.push({ label: "High reactivity", delta: 8, note: "Reactive maps often get over-covered.", weight: "+8" });
  }
  if (d.tolerance <= 2) {
    t -= 8;
    w.push({ label: "Low step ceiling", delta: -8, note: "Few steps force lighter coverage.", weight: "−8" });
  }
  return { value: Math.round(clamp(t)), weights: w.filter((x) => x.delta !== 0) };
}

function pancakeRisk(d: WearDay, load: number, setCount: number): { value: number; weights: ScoreWeight[] } {
  const w: ScoreWeight[] = [];
  let r = 12;
  w.push({ label: "Base", delta: 12, note: "Starting mass before the day speaks.", weight: "12" });
  const loadTerm = load * 9;
  r += loadTerm;
  w.push({ label: `Step load (${load})`, delta: loadTerm, note: "Every step is a film or a pass.", weight: "load × 9" });
  const setTerm = setCount * 7;
  r += setTerm;
  w.push({ label: `Set / lock steps (${setCount})`, delta: setTerm, note: "Powder and lock steps add edges.", weight: "setCount × 7" });
  if (d.skinType === "dry") {
    r += 14;
    w.push({ label: "Dry skin", delta: 14, note: "Mass on dry maps is how cake is born.", weight: "+14" });
  }
  if (d.dehydration >= 3) {
    r += 12;
    w.push({ label: "Dehydration", delta: 12, note: "Water leaving the film turns opacity into cake.", weight: "+12" });
  }
  if (d.texture === "lines" || d.texture === "both") {
    r += 10;
    w.push({ label: "Fine lines", delta: 10, note: "Opaque product settles into texture.", weight: "+10" });
  }
  if (d.texture === "pores" || d.texture === "both") {
    r += 6;
    w.push({ label: "Visible pores", delta: 6, note: "Piled product emphasises pores by midday.", weight: "+6" });
  }
  if (d.climate === "arid") {
    r += 10;
    w.push({ label: "Arid climate", delta: 10, note: "Thin air pulls water from the film.", weight: "+10" });
  }
  if (d.hours >= 12) {
    r += 8;
    w.push({ label: "Long day", delta: 8, note: "Hours compound every edge.", weight: "+8 (≥12h)" });
  }
  if (has(d.intents, "looks_like_skin")) {
    r -= 10;
    w.push({ label: "Skin-first intent", delta: -10, note: "You asked for sheerness — risk drops.", weight: "−10" });
  }
  const heatTerm = d.heat * 3;
  r += heatTerm;
  if (heatTerm) w.push({ label: "Heat", delta: heatTerm, note: "Heat thins and moves product.", weight: "heat × 3" });
  if (d.climate === "humid") {
    r += 4;
    w.push({ label: "Humidity", delta: 4, note: "Humidity slides unset mass.", weight: "+4" });
  }
  if (d.acIndoor) {
    r -= 3;
    w.push({ label: "Mostly AC / indoor", delta: -3, note: "Stable air is gentler on a thin film.", weight: "−3" });
  }
  return { value: Math.round(clamp(r)), weights: w };
}

function architectureScore(
  d: WearDay,
  load: number,
  placeCount: number,
  prepCount: number,
): { value: number; weights: ScoreWeight[] } {
  const w: ScoreWeight[] = [];
  let i = 48;
  w.push({ label: "Base architecture", delta: 48, note: "Neutral starting credit for structure.", weight: "48" });
  const prep = prepCount * 10;
  i += prep;
  w.push({ label: "Prep steps", delta: prep, note: "Prep is architecture, not filler.", weight: "prep × 10" });
  const place = placeCount * 12;
  i += place;
  w.push({ label: "Placement steps", delta: place, note: "Correct where the eye stops.", weight: "placement × 12" });
  const over = Math.max(0, load - d.tolerance) * 14;
  if (over) {
    i -= over;
    w.push({ label: "Over ceiling", delta: -over, note: "Steps past tolerance get skipped on a real morning.", weight: "−(load − tolerance) × 14" });
  }
  if (has(d.intents, "looks_like_skin")) {
    i += 8;
    w.push({ label: "Skin-first goal", delta: 8, note: "Architecture over opacity.", weight: "+8" });
  }
  if (d.reactivity >= 3) {
    i += 6;
    w.push({ label: "Reactive restraint", delta: 6, note: "Fewer films protect barrier and finish.", weight: "+6" });
  }
  if (load <= 2) {
    i += 10;
    w.push({ label: "Short load", delta: 10, note: "Two steps or fewer — structure is doing the work.", weight: "+10" });
  }
  if (load >= 5) {
    i -= 12;
    w.push({ label: "Heavy load", delta: -12, note: "Five-plus steps fight architecture.", weight: "−12" });
  }
  return { value: Math.round(clamp(i)), weights: w };
}

function longevityScore(d: WearDay, holdSteps: number): { value: number; weights: ScoreWeight[] } {
  const w: ScoreWeight[] = [];
  let n = 50;
  w.push({ label: "Base hold", delta: 50, note: "Starting wear resilience.", weight: "50" });
  const hold = holdSteps * 8;
  n += hold;
  w.push({ label: "Grip / set / lock steps", delta: hold, note: "Structural hold without cake.", weight: "holdSteps × 8" });
  const long = Math.max(0, d.hours - 8) * 3;
  if (long) {
    n -= long;
    w.push({ label: "Hours past 8", delta: -long, note: "Time is the adversary.", weight: "−(hours − 8) × 3" });
  }
  const heat = d.heat * 5;
  if (heat) {
    n -= heat;
    w.push({ label: "Heat load", delta: -heat, note: "Heat moves the base.", weight: "−heat × 5" });
  }
  if (d.climate === "humid") {
    n -= 8;
    w.push({ label: "Humidity", delta: -8, note: "Humidity is a slide risk.", weight: "−8" });
  }
  if (d.touchups === "often") {
    n += 8;
    w.push({ label: "Frequent touch-ups", delta: 8, note: "You will defend the finish.", weight: "+8" });
  }
  if (d.touchups === "none") {
    n -= 6;
    w.push({ label: "No touch-ups", delta: -6, note: "Must hold unattended.", weight: "−6" });
  }
  if (d.activity === "active") {
    n -= 10;
    w.push({ label: "Active / sweat", delta: -10, note: "Friction is the failure mode.", weight: "−10" });
  } else if (d.activity === "onfeet") {
    n -= 5;
    w.push({ label: "On your feet", delta: -5, note: "Movement warms the base from underneath.", weight: "−5" });
  }
  if (d.acIndoor) {
    n += 4;
    w.push({ label: "Indoor AC", delta: 4, note: "Stable climate buys hours.", weight: "+4" });
  }
  return { value: Math.round(clamp(n)), weights: w };
}

function luminosityScore(d: WearDay, veilBias: number, load: number): { value: number; weights: ScoreWeight[] } {
  const w: ScoreWeight[] = [];
  let r = 52;
  w.push({ label: "Base light", delta: 52, note: "Neutral starting luminosity.", weight: "52" });
  const vb = Math.round(veilBias * 8);
  r += vb;
  w.push({ label: "Pathway light bias", delta: vb, note: "Veil keeps light; editorial spends it.", weight: "pathway bias × 8" });
  const loadDrag = load * 4;
  r -= loadDrag;
  w.push({ label: "Load drag", delta: -loadDrag, note: "More films mute light.", weight: "−load × 4" });
  if (has(d.intents, "luminosity")) {
    r += 14;
    w.push({ label: "Luminosity intent", delta: 14, note: "You asked for light on high planes.", weight: "+14" });
  }
  if (d.lighting === "evening") {
    r += 10;
    w.push({ label: "Evening light", delta: 10, note: "Low light forgives coverage, punishes flatness.", weight: "+10" });
  }
  if (d.lighting === "flash") {
    r -= 8;
    w.push({ label: "Flash", delta: -8, note: "Flash reads mass and powder first.", weight: "−8" });
  }
  if (d.skinType === "oily") {
    r -= 6;
    w.push({ label: "Oily skin", delta: -6, note: "Shine is not luminosity — control first.", weight: "−6" });
  }
  if (d.dehydration >= 3) {
    r += 6;
    w.push({ label: "Dehydration (prep light)", delta: 6, note: "Hydrated maps read lighter when prep is in.", weight: "+6" });
  }
  return { value: Math.round(clamp(r)), weights: w };
}

function confidenceScore(d: WearDay): { value: number; weights: ScoreWeight[] } {
  const w: ScoreWeight[] = [];
  let n = 74;
  w.push({ label: "Base confidence", delta: 74, note: "Inputs are internally consistent until proven otherwise.", weight: "74" });
  if (d.tolerance <= 2 && d.desire >= 4) {
    n -= 6;
    w.push({ label: "Desire vs ceiling", delta: -6, note: "Editorial desire against a two-step ceiling argues with itself.", weight: "−6" });
  }
  if (d.hours >= 14) {
    n -= 5;
    w.push({ label: "Very long day", delta: -5, note: "Fourteen-hour claims need a refresh plan.", weight: "−5" });
  }
  if (d.intents.length === 0) {
    n -= 8;
    w.push({ label: "No intent set", delta: -8, note: "Without intent the forecast is provisional.", weight: "−8" });
  }
  if (d.intents.length >= 3) {
    n += 4;
    w.push({ label: "Clear intent set", delta: 4, note: "Multiple stated intents sharpen the reading.", weight: "+4" });
  }
  if (d.touchups === "none" && d.hours >= 12 && d.activity === "active") {
    n -= 8;
    w.push({ label: "Unattended sport day", delta: -8, note: "No touch-ups + sweat + long hours is a hard brief.", weight: "−8" });
  }
  return { value: Math.round(clamp(n)), weights: w };
}

function buildPathway(d: WearDay, id: WearPathwayId): WearPathway {
  const steps: WearStep[] = [];
  let order = 1;
  const push = (name: string, amount: string, placement: string, note: string) => {
    if (steps.length >= d.tolerance && id !== "editorial") return;
    steps.push({ order: order++, name, amount, placement, note });
  };

  const dry = d.skinType === "dry" || d.dehydration >= 3;
  const oily = d.skinType === "oily";
  const demand = coverageDemand(d).value;

  if (dry || has(d.intents, "luminosity") || id === "veil") {
    push("Hydrating prep", "thin film", "all over, press don't rub", "Prep is architecture. It is not a wasted step.");
  } else if (oily || d.heat >= 3 || d.climate === "humid") {
    push("Grip primer", "pea", "T-zone and places that move", "Give the base something to hold without mass.");
  }

  if (has(d.intents, "calm_redness") || d.reactivity >= 3 || d.unevenness >= 3) {
    push("Placed correct / conceal", "dot", "two places only", "Neutralise the map. Leave the rest of the skin alone.");
  }

  if (id === "veil") {
    if (demand >= 25) push("Skin tint or cushion", "sheer pass", "where uneven, blend out", "Evenness, not a mask.");
  } else if (id === "edit") {
    push(
      demand >= 55 ? "Serum foundation" : "Skin tint",
      "thin pass, build once",
      "centre out",
      "Architecture first, coverage second.",
    );
    if (oily || d.hours >= 10 || d.heat >= 2) {
      push("Targeted powder", "dust", "T-zone only", "Two zones. Never a full-face chalk.");
    }
  } else {
    push("Built base in passes", "two thin passes", "full map", "Desire is allowed — still bounded by the ceiling.");
    push("Placed conceal", "pat", "under-eye and high planes", "Precision after base, not before.");
    push("Set + mist", "lock then melt", "friction planes then all over mist", "Lock transfer planes; melt powder edges.");
  }

  if ((oily || d.heat >= 3) && id !== "veil" && !steps.some((s) => /powder/i.test(s.name))) {
    push("Targeted set", "whisper", "T-zone", "Only where oil will break through.");
  }
  if (has(d.intents, "no_transfer") || d.activity !== "desk") {
    push("Transfer-lock on friction", "press", "jaw, sides of nose, collar line", "Friction is the failure mode.");
  }

  const load = steps.length;
  const setCount = steps.filter((s) => /powder|Set|lock/i.test(s.name)).length;
  const placeCount = steps.filter((s) => /Placed|two places|correct/i.test(s.name)).length;
  const prepCount = steps.filter((s) => /prep|primer|Hydrating/i.test(s.name)).length;
  const holdSteps = steps.filter((s) => /lock|powder|Grip|cushion/i.test(s.name)).length;

  const pancake = pancakeRisk(d, load, setCount).value;
  const architecture = architectureScore(d, load, placeCount, prepCount).value;
  const longevity = longevityScore(d, holdSteps).value;

  const coaching: string[] = [];
  coaching.push(`Load ${load} against a ${d.tolerance}-step ceiling.`);
  if (pancake >= 55) coaching.push("Pancake risk is elevated — cut mass before you add product.");
  if (architecture >= 70) coaching.push("Architecture is doing the work that coverage usually fakes.");
  if (longevity < 50 && d.hours >= 10) {
    coaching.push(`Longevity ${longevity} against a stated all-day goal — plan a refresh, not a heavier morning.`);
  }
  if (id === "veil") coaching.push("The Veil wins when technique leverage is high and coverage need is low.");
  if (id === "editorial") coaching.push("Editorial only earns when desire, light, and ceiling all agree.");

  const why: string[] = [];
  why.push(
    id === "veil"
      ? "Minimal mass: prep and placement carry the finish so hours cannot cake it."
      : id === "edit"
        ? "Targeted base with controlled set — the daily instrument that balances hold and skin-like finish."
        : "Fuller presence in thin passes; only defensible when desire and conditions clear the ceiling.",
  );
  why.push(`Pancake ${pancake} · architecture ${architecture} · longevity ${longevity} on this load.`);
  if (d.heat >= 3) why.push("Heat is in the brief — fewer grams, locked at the surface, refreshed rather than rebuilt.");
  if (d.hours >= 12) why.push(`${d.hours}-hour wear is a structural requirement, not a product promise.`);

  return {
    id,
    name: id === "veil" ? "The Veil" : id === "edit" ? "The Edit" : "The Editorial",
    claim:
      id === "veil"
        ? "Almost nothing, placed perfectly."
        : id === "edit"
          ? "Targeted correction with a controlled base."
          : "Fuller presence when the day actually earns it.",
    steps,
    pancake,
    architecture,
    longevity,
    load,
    recommended: false,
    coaching,
    verdict:
      id === "veil"
        ? "Recommended when the face needs correction, not coverage."
        : id === "edit"
          ? "The daily instrument — architecture over cake."
          : "Only when desire and conditions both clear the ceiling.",
    why,
  };
}

function wearForecast(d: WearDay, pathway: WearPathway): ForecastPoint[] {
  const points: ForecastPoint[] = [];
  let integrity = 92;
  for (let h = 0; h <= d.hours; h++) {
    integrity -= 3 + d.heat * 0.6 + (d.skinType === "oily" ? 0.8 : 0) + (d.activity === "active" ? 0.7 : 0);
    integrity += pathway.architecture * 0.02;
    integrity -= pathway.pancake * 0.015;
    if (d.climate === "humid") integrity -= 0.35;
    if (d.acIndoor) integrity += 0.2;

    const point: ForecastPoint = {
      hour: h,
      integrity: Math.round(clamp(integrity)),
    };
    if (h > 0 && h % 4 === 0 && d.touchups !== "none" && d.bagCap !== "none") {
      point.event = "refresh";
      point.note = "Blot first, then press one zone.";
      integrity = Math.min(88, integrity + (d.touchups === "often" ? 14 : 12));
      point.integrity = Math.round(clamp(integrity));
    }
    if (integrity < 42 && !points.some((p) => p.event === "break")) {
      point.event = "break";
      point.note = "Finish integrity drops below defendable — refresh or accept the fade.";
    }
    points.push(point);
  }
  return points;
}

function failureModes(d: WearDay, pathway: WearPathway): FailureMode[] {
  const modes: FailureMode[] = [
    {
      id: "oil",
      name: "Oil break-through",
      likelihood: Math.round(
        clamp((d.skinType === "oily" ? 55 : d.skinType === "combination" ? 38 : 22) + d.heat * 8 + (d.climate === "humid" ? 12 : 0)),
      ),
      hour: d.heat >= 3 ? 3 : 5,
      fix: "Blot first. Do not add a second full layer — product on oil is cake.",
    },
    {
      id: "transfer",
      name: "Transfer / mask-wear",
      likelihood: Math.round(
        clamp(18 + (d.activity === "active" ? 28 : d.activity === "onfeet" ? 14 : 0) + (has(d.intents, "no_transfer") ? 10 : 0)),
      ),
      hour: 2,
      fix: "Transfer-lock only where fabric meets skin — jaw, collar line, mask edges.",
    },
    {
      id: "flaking",
      name: "Flaking / dry patch emphasis",
      likelihood: Math.round(
        clamp((d.skinType === "dry" ? 50 : 18) + d.dehydration * 10 + (d.climate === "arid" ? 12 : 0) + pathway.pancake * 0.15),
      ),
      hour: 6,
      fix: "Hydrating prep; skip powder on dry zones; press, don't pile.",
    },
    {
      id: "oxidation",
      name: "Oxidation / darkening",
      likelihood: Math.round(
        clamp(20 + (d.skinType === "oily" ? 14 : 0) + d.heat * 4 + (pathway.pancake > 50 ? 12 : 0) + (d.hours >= 10 ? 8 : 0)),
      ),
      hour: 4,
      fix: "Thinner first pass; match depth in daylight; blot oil before any refresh tint.",
    },
    {
      id: "humidity",
      name: "Humidity slide",
      likelihood: Math.round(
        clamp((d.climate === "humid" ? 48 : 14) + d.heat * 6 + (d.activity === "active" ? 12 : 0) - (pathway.architecture > 70 ? 8 : 0)),
      ),
      hour: 3,
      fix: "Less mass, more grip. Targeted set two zones only; mist to melt edges, never rebuild.",
    },
    {
      id: "texture",
      name: "Settling into texture",
      likelihood: Math.round(clamp(28 + pathway.pancake * 0.45 + (d.texture === "smooth" ? 0 : 15))),
      hour: 4,
      fix: "Keep mass low at the start; optical blur over opacity; press, don't pile.",
    },
  ];
  return modes.sort((a, b) => b.likelihood - a.likelihood);
}

function drivers(d: WearDay): { label: string; weight: number; note: string }[] {
  const t: { label: string; weight: number; note: string }[] = [];
  const n = (label: string, weight: number, note: string) => t.push({ label, weight, note });
  if (d.hours >= 10) n(`${d.hours}-hour wear`, 3, "Longevity is structural — build to refresh, not to cake.");
  if (d.tolerance <= 2) n("Low maintenance tolerance", 4, `Ceiling is ${d.tolerance} steps. Anything past it will be skipped.`);
  if (d.desire >= 4) n("Editorial desire", 3, "Desire gets its own pathway — it does not inflate the daily one.");
  if (d.heat >= 3) n("Heat exposure", 3, "Heat thins product and moves it. Set two zones only, then mist.");
  if (d.activity !== "desk") {
    n(
      d.activity === "active" ? "Movement and sweat" : "On your feet",
      d.activity === "active" ? 5 : 3,
      d.activity === "active"
        ? "Friction is the failure mode, not oil. Fewer grams, locked, refreshed."
        : "Standing warms the base from underneath. Structure over coverage.",
    );
  }
  if (d.lighting === "flash") n("Flash and close range", 4, "Flash reads mass and powder first. Diffusion survives; volume does not.");
  if (has(d.intents, "no_transfer")) n("Transfer resistance", 4, "Transfer comes from unset mass. Thin, then lock.");
  if (has(d.intents, "quick_am")) n("Five-minute constraint", 4, "Every step justifies itself against the clock.");
  if (d.dehydration >= 3) n("Dehydration", 4, "Dry maps punish mass. Hydrate, place, skip powder on dry zones.");
  if (d.skinType === "oily") n("Oil breakthrough", 3, "Oil is a failure mode of time, not of insufficient powder.");
  if (d.climate === "humid") n("Humidity", 3, "Humidity slides unset mass — less film, more grip.");
  if (d.acIndoor) n("Indoor AC day", 1, "Stable air is a free longevity bonus.");
  return t.sort((a, b) => b.weight - a.weight);
}

function bagRead(d: WearDay, pathway: WearPathway): BagReadItem[] {
  const sunscreen: BagReadItem = {
    id: "spf",
    name: "Sunscreen (any format)",
    verdict: "out of scope",
    why: "Never scored against cosmetics for bag space. Reapply per product directions — independent of this edit.",
    source: "scenario",
  };

  if (d.bagCap === "none") {
    return [
      {
        id: "nothing",
        name: "Nothing cosmetic",
        verdict: "stays home",
        why: "You said no bag. The morning must survive unattended — prep over mass.",
        source: "scenario",
      },
      sunscreen,
    ];
  }

  const slots = d.bagCap === "clutch" ? 3 : 5;
  const candidates: { id: string; name: string; score: number; why: string }[] = [
    {
      id: "blot",
      name: "Blotting paper",
      score: 92 + (d.skinType === "oily" ? 6 : 0),
      why: "Weighs nothing, fixes the actual failure mode. Near-unconditional in the refresh kit.",
    },
    {
      id: "cushion",
      name: "Cushion / water base for refresh",
      score: 74 + (pathway.id === "editorial" ? 10 : 0) - (d.touchups === "none" ? 30 : 0) - (d.bagCap === "clutch" ? 8 : 0),
      why: "Reapplies coverage without stacking mass — the one base format that survives a handbag honestly.",
    },
    {
      id: "powder",
      name: "Pressed powder, one zone",
      score: (d.skinType === "oily" ? 78 : 46) + d.heat * 5 - (d.skinType === "dry" ? 26 : 0),
      why:
        d.skinType === "dry"
          ? "On dry maps this is how a good morning becomes a cakey afternoon."
          : "For the T-zone only. Not a re-set of the whole face.",
    },
    {
      id: "conceal",
      name: "Placed concealer",
      score: 66 - (pathway.id === "veil" ? 12 : 0) + (d.unevenness >= 2 ? 8 : 0),
      why: "Under-eye is the first thing to break down. Small format, high return.",
    },
    {
      id: "mist",
      name: "Finishing mist, travel",
      score: (d.climate === "arid" ? 70 : 52) + (pathway.id === "editorial" ? 12 : 0) - (d.bagCap === "clutch" ? 20 : 0),
      why: "Re-melts powder edges. Earns space when powder is in the bag at all.",
    },
    {
      id: "full-foundation",
      name: "Full-size foundation",
      score: 18,
      why: "Heavy, invites a second full layer, and a second full layer is the cake. Declined.",
    },
    {
      id: "dense-brush",
      name: "Dense buffing brush",
      score: 12,
      why: "Nothing in a bag needs a dense brush. Declined.",
    },
  ];

  const ranked: BagReadItem[] = candidates
    .sort((a, b) => b.score - a.score)
    .map((c, i) => {
      const item: BagReadItem = {
        id: c.id,
        name: c.name,
        score: c.score,
        verdict: i < slots && c.score >= 50 ? "earns the bag" : "stays home",
        why: c.why,
        source: "scenario",
      };
      return item;
    });

  const ownedReads: BagReadItem[] = d.owned.map((id) => {
    const t = TYPE_MAP[id];
    const label = t?.label ?? id;
    const layer = t?.layerWeight ?? 1;
    let score = 55 - layer * 12;
    let why = `${label} is already in your bag.`;
    if (layer >= 3) {
      score -= 20;
      why = `${label} is high mass — for this scenario it stays home unless the Editorial pathway is live and you will maintain it.`;
    } else if (t?.lane === "care" || /prep|spf|blot|mist|spray/i.test(label)) {
      score += 25;
      why = `${label} supports architecture without opacity — earns carry space.`;
    } else if (/tint|balm|stick|multi/i.test(label)) {
      score += 15;
      why = `${label} is thin enough to refresh without rebuilding.`;
    } else if (/powder|foundation/i.test(label) && d.skinType === "dry") {
      score -= 18;
      why = `${label} on a dry map is a cake path midday — leave it home.`;
    } else if (d.hours >= 10 && /set|longwear|stain/i.test(label)) {
      score += 10;
      why = `${label} supports the hour count without a second base.`;
    }
    const item: BagReadItem = {
      id: `owned-${id}`,
      name: label,
      score: Math.round(clamp(score)),
      verdict: score >= 50 ? "earns the bag" : "stays home",
      why,
      source: "owned",
    };
    return item;
  });

  return [...ranked, ...ownedReads, sunscreen];
}

export function runWear(d: WearDay): WearReading {
  const demand = coverageDemand(d);
  const ids: WearPathwayId[] = ["veil", "edit", "editorial"];
  const raw = ids.map((id) => buildPathway(d, id));

  const scored = raw.map((p) => {
    let s =
      p.architecture * 0.42 +
      (100 - p.pancake) * 0.38 +
      Math.max(0, 100 - Math.abs(p.load - d.tolerance) * 14) * 0.2;
    if (d.desire >= 4 && p.id === "editorial") s += 6;
    if (demand.value > 62 && p.id === "veil") s -= 10;
    if (demand.value < 30 && p.id === "veil") s += 8;
    if ((has(d.intents, "camera") || d.lighting === "flash") && p.id === "editorial") s += 8;
    if (has(d.intents, "quick_am") && p.id === "veil") s += 6;
    if (d.hours >= 12 && p.id === "edit") s += 4;
    return { p, s };
  });
  const best = scored.reduce((a, b) => (b.s > a.s ? b : a));

  const pathways = scored.map(({ p }) => ({
    ...p,
    recommended: p.id === best.p.id,
    steps: p.id === "editorial" ? p.steps : p.steps.slice(0, Math.max(1, d.tolerance)),
    load: p.id === "editorial" ? p.load : Math.min(p.load, d.tolerance),
  }));

  const recommended = pathways.find((p) => p.recommended)!;
  const forecast = wearForecast(d, recommended);
  const failures = failureModes(d, recommended);
  const conf = confidenceScore(d);
  const veilBias = recommended.id === "veil" ? 1.8 : recommended.id === "edit" ? 0.7 : -0.4;
  const lum = luminosityScore(d, veilBias, recommended.load);
  const holdSteps = recommended.steps.filter((s) => /lock|powder|Grip|cushion/i.test(s.name)).length;
  const setCount = recommended.steps.filter((s) => /powder|Set|lock/i.test(s.name)).length;
  const placeCount = recommended.steps.filter((s) => /Placed|two places|correct/i.test(s.name)).length;
  const prepCount = recommended.steps.filter((s) => /prep|primer|Hydrating/i.test(s.name)).length;
  const pan = pancakeRisk(d, recommended.load, setCount);
  const arch = architectureScore(d, recommended.load, placeCount, prepCount);
  const long = longevityScore(d, holdSteps);

  const scores: LiveScore[] = [
    {
      id: "pancake",
      label: "Day-brief pancake",
      value: pan.value,
      better: "low",
      formula: "12 + load×9 + set×7 + skin/climate/hours − skin-first",
      weights: pan.weights,
    },
    {
      id: "architecture",
      label: "Architecture",
      value: arch.value,
      better: "high",
      formula: "48 + prep×10 + placement×12 − over-ceiling − heavy load",
      weights: arch.weights,
    },
    {
      id: "longevity",
      label: "Longevity",
      value: long.value,
      better: "high",
      formula: "50 + hold×8 − (hours−8)×3 − heat×5 − climate/activity",
      weights: long.weights,
    },
    {
      id: "luminosity",
      label: "Luminosity",
      value: lum.value,
      better: "high",
      formula: "52 + pathway bias − load×4 + light/intent terms",
      weights: lum.weights,
    },
    {
      id: "confidence",
      label: "Confidence",
      value: conf.value,
      better: "high",
      formula: "74 − input contradictions + clear intent",
      weights: conf.weights,
    },
  ];

  const headline =
    recommended.id === "veil"
      ? "Your skin does not need to be covered. It needs to be corrected in two places and left alone."
      : recommended.id === "edit"
        ? "Architecture, then coverage where the eye stops. This is the finish that survives the hours."
        : "You want the full finish and the inputs can carry it — provided every layer goes on in passes.";

  return {
    day: d,
    scores,
    pancake: pan.value,
    architecture: arch.value,
    longevity: long.value,
    luminosity: lum.value,
    confidence: conf.value,
    coverageDemand: demand.value,
    load: recommended.load,
    pathways,
    recommended,
    forecast,
    breakHour: forecast.find((f) => f.event === "break")?.hour ?? null,
    failures,
    bag: bagRead(d, recommended),
    headline,
    drivers: drivers(d),
  };
}
