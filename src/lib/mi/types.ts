export type SkinType = "dry" | "normal" | "combination" | "oily";
export type Climate = "humid" | "temperate" | "dry" | "altitude";
export type Budget = "lean" | "mid" | "open";

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
}

export type Tier = "core" | "consider" | "hold";

export interface Contribution {
  label: string;
  delta: number;
  note: string;
}

export interface Architecture {
  risk: number; // 0-100 pancake risk
  skinlike: number; // 0-100
  headline: string;
  verdict: string;
  contributions: Contribution[];
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
}

export interface Pathway {
  id: string;
  name: string;
  promise: string;
  fit: number;
  because: string[];
  tradeoff: string;
  types: string[];
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
}

export interface Edit {
  architecture: Architecture;
  types: TypeScore[];
  pathways: Pathway[];
  tools: ToolCall[];
  bag: BagCall[];
  kit: Kit;
  coach: { title: string; body: string }[];
}