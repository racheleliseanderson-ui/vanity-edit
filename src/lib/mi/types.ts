export type SkinType = "dry" | "normal" | "combination" | "oily";
export type Climate = "humid" | "temperate" | "dry" | "altitude";
export type Budget = "lean" | "mid" | "open";
export type Undertone =
  | "cool"
  | "neutral"
  | "warm"
  | "olive"
  | "golden-olive"
  | "deep-neutral"
  | "red-leaning";

/** Price tier — positioning and access, never a quality ranking. */
export type PriceTier = "drugstore" | "mid" | "prestige" | "luxury";

/** Where a house or formula is actually easy to buy. Not a claim about origin quality. */
export type Region =
  | "North America"
  | "United Kingdom"
  | "Europe"
  | "Korea"
  | "Japan"
  | "India"
  | "West Africa"
  | "Middle East"
  | "Brazil"
  | "Latin America"
  | "Australia";

export type FilterKey =
  | "mineral"
  | "fragranceFree"
  | "eoFree"
  | "siliconeFree"
  | "vegan";

export interface Profile {
  goals: string[];
  skin: SkinType;
  sensitivity: number; // 0 none - 3 very reactive
  concerns: string[];
  climate: Climate;
  outdoors: number; // 0 rarely - 3 constantly
  timeBudget: number; // minutes
  maintenance: number; // 0 no touch-ups - 3 happy to maintain
  desire: number; // 0 wear less - 3 wants the ritual
  ceiling: number; // max products in the kit
  coverage: number; // 0 sheer - 100 full
  filters: FilterKey[];
  bag: string[]; // product type ids currently owned
  budget: Budget;
  undertone: Undertone;
  depth: number; // 1 porcelain - 10 rich deep
}

export type Tier = "core" | "consider" | "hold";

export interface Contribution {
  label: string;
  delta: number;
  note: string;
  /** Optional weight/formula line for transparent reasoning. */
  weight?: string;
}

/** Documented variable behind pancake-risk or finish scoring. */
export interface ScoreVariable {
  id: string;
  label: string;
  /** Human-readable weight / coefficient. */
  weight: string;
  /** What a positive delta means for pancake risk. */
  raisesRiskWhen: string;
  /** What a negative delta means for pancake risk. */
  lowersRiskWhen: string;
  /** How this also drives the finish (skin-like) score. */
  finishEffect: string;
}

export interface Architecture {
  risk: number; // 0-100 pancake risk
  skinlike: number; // 0-100 finish / skin-like
  headline: string;
  verdict: string;
  contributions: Contribution[];
  /** Base constant before variable deltas (always 30 in the live model). */
  baseRisk: number;
}

export interface TypeScore {
  id: string;
  label: string;
  lane: string;
  score: number;
  tier: Tier;
  reasons: string[];
  cautions: string[];
  examples: string[];
  layerWeight: number;
  breakdown: Contribution[];
}

export interface Pathway {
  id: string;
  name: string;
  promise: string;
  fit: number;
  because: string[];
  tradeoff: string;
  types: string[];
  layers: number;
  minutes: number;
  upkeep: number;
  ledger: Contribution[];
}

export interface ToolCall {
  id: string;
  label: string;
  verdict: "essential" | "optional" | "probably unnecessary";
  why: string;
}

export interface BagCall {
  id: string;
  label: string;
  verdict: "keep" | "use differently" | "replace when finished";
  why: string;
}

export interface KitItem {
  id: string;
  label: string;
  job: string;
  layerWeight: number;
  example: string;
}

export interface Kit {
  items: KitItem[];
  layers: number;
  minutes: number;
  ceiling: number;
  projectedRisk: number;
  note: string;
  tension: number; // 0-100 how hard the ceiling and desire are pulling apart
  tensionNote: string;
}

export interface WhatIf {
  id: string;
  label: string;
  move: string;
  risk: number;
  delta: number;
  kitSize: number;
  note: string;
}

export interface ScenarioResult {
  id: string;
  label: string;
  move: string;
  note: string;
  risk: number;
  delta: number;
  skinlike: number;
  layers: number;
  minutes: number;
  tension: number;
  objects: number;
  ceiling: number;
  kit: { label: string; lane: string }[];
  top: { label: string; score: number }[];
  bag: { keep: number; differently: number; replace: number; changed: string[] };
  pathway: string;
  pathwayFit: number;
}

export interface Edit {
  architecture: Architecture;
  types: TypeScore[];
  pathways: Pathway[];
  tools: ToolCall[];
  bag: BagCall[];
  kit: Kit;
  coach: { title: string; body: string }[];
  whatIf: WhatIf[];
}

/** Claim-literacy card for makeup that carries skincare language. */
export type ClaimKind = "spf" | "treatment" | "hybrid" | "barrier" | "actives";

export interface ClaimCard {
  id: string;
  kind: ClaimKind;
  claim: string;
  /** What the label must name for the claim to be real. */
  named: string;
  /** Dose / level that matters, or "not stated" guidance. */
  dosed: string;
  /** What testing (if any) would make the claim credible. */
  tested: string;
  /** When this claim should not drive a purchase. */
  whenNotToBuy: string;
  /** Witty-but-useful Vanity or Vice line. */
  verdict: string;
}
