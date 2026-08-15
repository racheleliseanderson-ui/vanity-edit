import { DEFAULT_PROFILE } from "./catalog";
import type { Budget, Climate, FilterKey, Profile, SkinType, Undertone } from "./types";

const SKINS: SkinType[] = ["dry", "normal", "combination", "oily"];
const CLIMATES: Climate[] = ["humid", "temperate", "dry", "altitude"];
const BUDGETS: Budget[] = ["lean", "mid", "open"];
const UNDERTONES: Undertone[] = [
  "cool",
  "neutral",
  "warm",
  "olive",
  "golden-olive",
  "deep-neutral",
  "red-leaning",
];
const FILTERS: FilterKey[] = ["mineral", "fragranceFree", "eoFree", "siliconeFree", "vegan"];

export interface SharePayload {
  profile: Profile;
  path?: string | undefined;
  stage?: string | undefined;
  moves: string[];
  via?: string | undefined;
  viaName?: string | undefined;
  risk?: number | undefined;
}

type Compact = {
  g?: string[];
  s?: SkinType;
  n?: number;
  c?: string[];
  cl?: Climate;
  o?: number;
  t?: number;
  m?: number;
  d?: number;
  k?: number;
  cv?: number;
  f?: FilterKey[];
  b?: string[];
  bd?: Budget;
  u?: Undertone;
  dp?: number;
};

function toB64(s: string) {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64(raw: string) {
  const pad = raw.length % 4 === 0 ? "" : "=".repeat(4 - (raw.length % 4));
  const b64 = raw.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function encodeProfile(p: Profile): string {
  const c: Compact = {
    g: p.goals,
    s: p.skin,
    n: p.sensitivity,
    c: p.concerns,
    cl: p.climate,
    o: p.outdoors,
    t: p.timeBudget,
    m: p.maintenance,
    d: p.desire,
    k: p.ceiling,
    cv: p.coverage,
    f: p.filters,
    b: p.bag,
    bd: p.budget,
    u: p.undertone,
    dp: p.depth,
  };
  return toB64(JSON.stringify(c));
}

function num(v: unknown, lo: number, hi: number, fallback: number) {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback;
}

export function decodeProfile(raw: string | undefined): Partial<Profile> | null {
  if (!raw) return null;
  try {
    const c = JSON.parse(fromB64(raw)) as Compact;
    if (!c || typeof c !== "object") return null;
    const out: Partial<Profile> = {};
    if (Array.isArray(c.g)) out.goals = c.g.filter((x): x is string => typeof x === "string").slice(0, 20);
    if (c.s && SKINS.includes(c.s)) out.skin = c.s;
    if (c.n !== undefined) out.sensitivity = num(c.n, 0, 3, DEFAULT_PROFILE.sensitivity);
    if (Array.isArray(c.c)) out.concerns = c.c.filter((x): x is string => typeof x === "string").slice(0, 16);
    if (c.cl && CLIMATES.includes(c.cl)) out.climate = c.cl;
    if (c.o !== undefined) out.outdoors = num(c.o, 0, 3, DEFAULT_PROFILE.outdoors);
    if (c.t !== undefined) out.timeBudget = num(c.t, 2, 40, DEFAULT_PROFILE.timeBudget);
    if (c.m !== undefined) out.maintenance = num(c.m, 0, 3, DEFAULT_PROFILE.maintenance);
    if (c.d !== undefined) out.desire = num(c.d, 0, 3, DEFAULT_PROFILE.desire);
    if (c.k !== undefined) out.ceiling = num(c.k, 3, 12, DEFAULT_PROFILE.ceiling);
    if (c.cv !== undefined) out.coverage = num(c.cv, 0, 100, DEFAULT_PROFILE.coverage);
    if (Array.isArray(c.f)) out.filters = c.f.filter((x): x is FilterKey => FILTERS.includes(x as FilterKey));
    if (Array.isArray(c.b)) out.bag = c.b.filter((x): x is string => typeof x === "string").slice(0, 40);
    if (c.bd && BUDGETS.includes(c.bd)) out.budget = c.bd;
    if (c.u && UNDERTONES.includes(c.u)) out.undertone = c.u;
    if (c.dp !== undefined) out.depth = num(c.dp, 1, 10, DEFAULT_PROFILE.depth);
    return out;
  } catch {
    return null;
  }
}

export interface EditSearch {
  path?: string | undefined;
  stage?: string | undefined;
  bag?: string | undefined;
  moves?: string | undefined;
  p?: string | undefined;
  via?: string | undefined;
  vn?: string | undefined;
  r?: string | undefined;
  set?: string | undefined;
}

export function parseEditSearch(s: Record<string, unknown>): EditSearch {
  const out: EditSearch = {};
  for (const k of ["path", "stage", "bag", "moves", "p", "via", "vn", "r", "set"] as const) {
    const v = s[k];
    if (typeof v === "string" && v) out[k] = v;
    else if (typeof v === "number" && Number.isFinite(v) && k === "r") out.r = String(v);
  }
  return out;
}

export function buildShareSearch(payload: SharePayload): EditSearch {
  return {
    p: encodeProfile(payload.profile),
    path: payload.path,
    stage: payload.stage && payload.stage !== "Match" ? payload.stage : undefined,
    bag: payload.profile.bag.length ? payload.profile.bag.join(",") : undefined,
    moves: payload.moves.length ? payload.moves.join(",") : undefined,
    via: payload.via,
    vn: payload.viaName,
    r: payload.risk !== undefined ? String(payload.risk) : undefined,
  };
}

export function pageUrl(path: string, search: Record<string, unknown> = {}, origin?: string): string {
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  const url = new URL(path, base || "https://makeup.vanityvice.blog");
  for (const [k, v] of Object.entries(search)) {
    if (v === undefined || v === "" || v === false || v === null) continue;
    url.searchParams.set(k, String(v));
  }
  return url.toString();
}

export function shareUrl(search: EditSearch, origin?: string): string {
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  const url = new URL("/edit", base || "https://makeup.vanityvice.blog");
  for (const [k, v] of Object.entries(search)) {
    if (v) url.searchParams.set(k, v);
  }
  return url.toString();
}

export async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export function profileProgress(p: Profile, base: Profile = DEFAULT_PROFILE) {
  const checks: { id: string; label: string; on: boolean; hot?: boolean }[] = [
    { id: "goals", label: "Goals", on: p.goals.join() !== base.goals.join(), hot: true },
    { id: "skin", label: "Skin", on: p.skin !== base.skin, hot: true },
    { id: "sensitivity", label: "Sensitivity", on: p.sensitivity !== base.sensitivity },
    { id: "concerns", label: "Concerns", on: p.concerns.length > 0 },
    { id: "climate", label: "Climate", on: p.climate !== base.climate },
    { id: "outdoors", label: "Outdoors", on: p.outdoors !== base.outdoors },
    { id: "timeBudget", label: "Morning minutes", on: p.timeBudget !== base.timeBudget },
    { id: "maintenance", label: "Maintenance", on: p.maintenance !== base.maintenance },
    { id: "desire", label: "Desire", on: p.desire !== base.desire },
    { id: "ceiling", label: "Ceiling", on: p.ceiling !== base.ceiling },
    { id: "coverage", label: "Coverage appetite", on: p.coverage !== base.coverage, hot: true },
    { id: "filters", label: "Filters", on: p.filters.length > 0 },
    { id: "bag", label: "Current bag", on: p.bag.join() !== base.bag.join() },
    { id: "budget", label: "Budget", on: p.budget !== base.budget },
    { id: "undertone", label: "Undertone", on: p.undertone !== base.undertone },
    { id: "depth", label: "Depth", on: p.depth !== base.depth },
  ];
  return {
    done: checks.filter((c) => c.on).length,
    total: checks.length,
    checks,
    hottest: checks.filter((c) => c.hot).map((c) => c.label),
  };
}

export function ogCardCopy(risk?: string | number, pathway?: string) {
  const r = typeof risk === "number" ? risk : Number(risk);
  const score = Number.isFinite(r) ? Math.round(r) : null;
  const path = pathway?.trim() || "The Edit";
  return {
    title: score !== null ? `Pancake risk ${score} · ${path}` : `Makeup Intelligence · ${path}`,
    line: score !== null ? `Pancake risk ${score} · ${path} · The Edit` : "Architecture over cake · The Edit",
    description:
      score !== null
        ? `${path}. Profile pancake risk ${score} of 100. A personal edit packet from Vanity or Vice.`
        : "A personal edit instrument from Vanity or Vice.",
  };
}
