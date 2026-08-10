import type { FilterKey, Profile } from "./types";

export const GOALS: { id: string; label: string; note: string }[] = [
  { id: "escape-pancake", label: "Escape pancake makeup", note: "Skin-like finish over mask-like layers." },
  { id: "even-tone", label: "Even my skin tone", note: "Light coverage or strategic concealing — not full face." },
  { id: "redness", label: "Cover redness", note: "Spot work and redness-friendly bases." },
  { id: "fast-polish", label: "Look polished quickly", note: "Multipurpose products, short kit." },
  { id: "dryness", label: "Reduce visible dryness", note: "Hydrating creams, flexible films, fewer powders." },
  { id: "shine", label: "Control shine", note: "Strategic powder and blotting — not full-face matte." },
  { id: "awake", label: "Look more awake", note: "Brightening, cream highlight, brows." },
  { id: "wear-less", label: "Wear less makeup", note: "Permission to simplify; no-product paths allowed." },
  { id: "alternatives", label: "Prefer makeup alternatives", note: "Hybrids, mineral, multi-use, skincare tints." },
  { id: "simplify", label: "Simplify my routine", note: "Fewer products, multi-use first." },
  { id: "sensitive", label: "Sensitive-friendly choices", note: "Lighter layers, fragrance-aware filters." },
  { id: "event", label: "Event-ready polish", note: "More definition when needed — still not cake." },
];

export const CONCERNS = [
  "redness",
  "texture",
  "dryness / flaking",
  "blemishes",
  "pigmentation",
  "fine lines",
  "large pores",
  "dullness",
];

export const FILTERS: { id: FilterKey; label: string }[] = [
  { id: "mineral", label: "Mineral pigment preferred" },
  { id: "fragranceFree", label: "Fragrance-free" },
  { id: "eoFree", label: "Essential-oil-free" },
  { id: "siliconeFree", label: "Silicone-averse" },
  { id: "vegan", label: "Vegan / cruelty-free" },
];

export interface ProductType {
  id: string;
  label: string;
  lane: "base" | "spot" | "colour" | "finish" | "eye" | "lip" | "care";
  layerWeight: number; // 0-3 opacity load
  coverage: number; // 0-100 what it delivers
  oil: number; // -2 bad for oily .. +2 good
  dry: number;
  longevity: number; // 0-3
  upkeep: number; // 0-3 maintenance demanded
  minutes: number;
  job: string;
  examples: string[];
}

export const TYPES: ProductType[] = [
  { id: "skin-tint", label: "Serum skin tint", lane: "base", layerWeight: 1, coverage: 22, oil: 0, dry: 2, longevity: 1, upkeep: 1, minutes: 2, job: "Evens tone without building a film.", examples: ["ILIA Super Serum Skin Tint SPF 40", "Saie Slip Tint SPF 35", "Kosas BB Burst"] },
  { id: "tinted-spf", label: "Tinted mineral SPF", lane: "base", layerWeight: 1, coverage: 20, oil: 0, dry: 1, longevity: 1, upkeep: 1, minutes: 2, job: "UV strategy and tone in one step.", examples: ["Colorescience Flex SPF 50", "EltaMD UV Elements SPF 44", "Supergoop! CC Screen SPF 50"] },
  { id: "light-foundation", label: "Lightweight foundation", lane: "base", layerWeight: 2, coverage: 45, oil: 1, dry: 0, longevity: 2, upkeep: 1, minutes: 4, job: "More evening than a tint, still buildable.", examples: ["ILIA True Skin Serum Foundation", "Merit The Minimalist", "Ere Perez Oat Milk Foundation"] },
  { id: "full-foundation", label: "Full-coverage foundation", lane: "base", layerWeight: 3, coverage: 85, oil: 1, dry: -2, longevity: 3, upkeep: 2, minutes: 6, job: "Maximum evening — highest cake exposure.", examples: ["Jane Iredale Glow Time Pro BB (kept light)", "100% PURE Fruit Pigmented Cream Foundation"] },
  { id: "mineral-powder", label: "Mineral powder base", lane: "base", layerWeight: 2, coverage: 50, oil: 2, dry: -2, longevity: 2, upkeep: 1, minutes: 3, job: "Buildable powder coverage with oil control.", examples: ["bareMinerals Original Loose Powder", "Alima Pure Satin Matte", "Glo Skin Beauty Pressed Base"] },
  { id: "multi-stick", label: "Multipurpose complexion stick", lane: "base", layerWeight: 1, coverage: 35, oil: -1, dry: 2, longevity: 2, upkeep: 1, minutes: 2, job: "Base and contour where you actually need it.", examples: ["Merit The Complexion Stick", "Ogee Sculpted Complexion Stick", "Glo HD Mineral Stick"] },
  { id: "no-base", label: "No base at all", lane: "base", layerWeight: 0, coverage: 0, oil: 2, dry: 2, longevity: 3, upkeep: 0, minutes: 0, job: "Skin as the finish. Spot work does the rest.", examples: ["Skincare + SPF only", "Blotting papers for midday"] },
  { id: "strategic-concealer", label: "Strategic concealer", lane: "spot", layerWeight: 1, coverage: 70, oil: 0, dry: 1, longevity: 2, upkeep: 1, minutes: 2, job: "Coverage placed only where it is needed.", examples: ["Kosas Revealer", "Tower 28 Swipe Serum", "RMS UnCoverup"] },
  { id: "brightening-concealer", label: "Brightening concealer", lane: "spot", layerWeight: 1, coverage: 50, oil: 0, dry: 2, longevity: 1, upkeep: 1, minutes: 1, job: "Light back into the under-eye without weight.", examples: ["Rose Inc Softlight", "Kosas Revealer"] },
  { id: "colour-corrector", label: "Colour corrector", lane: "spot", layerWeight: 1, coverage: 40, oil: 0, dry: 0, longevity: 1, upkeep: 1, minutes: 1, job: "Neutralises redness before any base decision.", examples: ["Tower 28 MakeWaves", "Ere Perez Arnica All-Cover Pot"] },
  { id: "cream-blush", label: "Cream blush", lane: "colour", layerWeight: 1, coverage: 15, oil: -1, dry: 2, longevity: 1, upkeep: 1, minutes: 1, job: "Colour that reads as circulation, not paint.", examples: ["Saie Dew Blush", "Westman Atelier Baby Cheeks", "Merit Flush Balm"] },
  { id: "powder-blush", label: "Powder blush", lane: "colour", layerWeight: 1, coverage: 15, oil: 2, dry: -1, longevity: 2, upkeep: 1, minutes: 1, job: "Colour on oilier or powder-set days.", examples: ["Saie Main Character Soft Matte"] },
  { id: "cream-highlighter", label: "Cream highlight", lane: "colour", layerWeight: 1, coverage: 8, oil: -1, dry: 2, longevity: 1, upkeep: 1, minutes: 1, job: "One lit plane instead of overall glow.", examples: ["Saie Glowy Super Gel", "Jones Road Miracle Balm"] },
  { id: "lip-cheek-balm", label: "Lip + cheek balm", lane: "colour", layerWeight: 1, coverage: 12, oil: -1, dry: 2, longevity: 1, upkeep: 2, minutes: 1, job: "Two jobs, one object — the capsule workhorse.", examples: ["Jones Road Miracle Balm", "ILIA Multi-Stick", "Ere Perez Carrot Colour Pot"] },
  { id: "setting-powder", label: "Strategic setting powder", lane: "finish", layerWeight: 1, coverage: 10, oil: 2, dry: -2, longevity: 2, upkeep: 1, minutes: 1, job: "Set the two panels that move, not the face.", examples: ["Kosas Cloud Set", "Saie Airset Radiant", "bareMinerals Mineral Veil"] },
  { id: "blotting-paper", label: "Blotting papers", lane: "finish", layerWeight: 0, coverage: 0, oil: 2, dry: 0, longevity: 0, upkeep: 1, minutes: 1, job: "Shine control with no added layer.", examples: ["Tatcha Aburatorigami"] },
  { id: "setting-spray", label: "Flexible setting mist", lane: "finish", layerWeight: 0, coverage: 0, oil: 1, dry: 1, longevity: 2, upkeep: 0, minutes: 1, job: "Melts powder edges back into skin.", examples: ["Any humectant-forward flexible mist"] },
  { id: "brow-gel", label: "Brow gel", lane: "eye", layerWeight: 0, coverage: 0, oil: 0, dry: 0, longevity: 2, upkeep: 0, minutes: 1, job: "Structure for the whole face from one product.", examples: ["ILIA Essential Brow Gel"] },
  { id: "mascara", label: "Mascara", lane: "eye", layerWeight: 0, coverage: 0, oil: 0, dry: 0, longevity: 2, upkeep: 0, minutes: 1, job: "Awake without touching the complexion.", examples: ["ILIA Limitless Lash", "Ere Perez Avocado Waterproof"] },
  { id: "shadow-stick", label: "Cream shadow stick", lane: "eye", layerWeight: 1, coverage: 0, oil: -1, dry: 1, longevity: 2, upkeep: 1, minutes: 1, job: "Definition in one swipe, no palette.", examples: ["ILIA Liquid Powder Eye Tint", "RMS Eye Polish"] },
  { id: "tinted-balm", label: "Tinted lip balm", lane: "lip", layerWeight: 0, coverage: 0, oil: 0, dry: 2, longevity: 1, upkeep: 2, minutes: 1, job: "The lowest-effort finish signal there is.", examples: ["ILIA Balmy Tint", "ILIA Balmy Gloss Lip Oil"] },
  { id: "lip-stain", label: "Long-wear lip", lane: "lip", layerWeight: 0, coverage: 0, oil: 0, dry: -1, longevity: 3, upkeep: 0, minutes: 1, job: "Holds through dinner without maintenance.", examples: ["Sheer stain and tint lanes on the desk"] },
  { id: "primer", label: "Grip or blur primer", lane: "care", layerWeight: 1, coverage: 0, oil: 1, dry: 0, longevity: 2, upkeep: 0, minutes: 1, job: "Extra film layer — earns its place rarely.", examples: ["Only when wear failure is documented"] },
];

export const TYPE_MAP = Object.fromEntries(TYPES.map((t) => [t.id, t]));

export const TOOLS: { id: string; label: string }[] = [
  { id: "fingers", label: "Fingers" },
  { id: "damp-sponge", label: "Damp sponge" },
  { id: "buffing-brush", label: "Dense buffing brush" },
  { id: "concealer-brush", label: "Small concealer brush" },
  { id: "powder-brush", label: "Soft powder brush" },
  { id: "fan-brush", label: "Fan brush" },
  { id: "blush-brush", label: "Blush brush" },
  { id: "spoolie", label: "Spoolie" },
  { id: "lash-curler", label: "Lash curler" },
  { id: "airbrush", label: "Airbrush system" },
];

export interface Preset {
  id: string;
  name: string;
  line: string;
  promise: string;
  profile: Partial<Profile>;
}

export const PRESETS: Preset[] = [
  {
    id: "everyday",
    name: "Anti-pancake everyday",
    line: "Sheer base, spot work, cream colour.",
    promise: "The smart alternative to full-face cake.",
    profile: { goals: ["escape-pancake", "even-tone", "fast-polish"], skin: "combination", coverage: 30, ceiling: 6, desire: 2, maintenance: 1, timeBudget: 10 },
  },
  {
    id: "altitude",
    name: "High altitude & dry",
    line: "Flexible tints and balms over powder stacks.",
    promise: "Films that move with dehydrated skin.",
    profile: { goals: ["dryness", "escape-pancake", "alternatives"], skin: "dry", climate: "altitude", coverage: 25, ceiling: 6, outdoors: 2, desire: 2, maintenance: 1, timeBudget: 10 },
  },
  {
    id: "sensitive",
    name: "Sensitive capsule",
    line: "Fewer products, mineral-aware, hard filters kept.",
    promise: "Lighter layers where reactivity is live.",
    profile: { goals: ["sensitive", "redness", "simplify"], sensitivity: 3, concerns: ["redness"], filters: ["fragranceFree", "mineral"], coverage: 28, ceiling: 5, desire: 1, maintenance: 1, timeBudget: 10 },
  },
  {
    id: "event",
    name: "Event-ready, not cake",
    line: "Longevity where it matters only.",
    promise: "Definition earns the bag; the base stays honest.",
    profile: { goals: ["event", "awake", "shine"], coverage: 45, ceiling: 9, desire: 3, maintenance: 2, timeBudget: 20 },
  },
  {
    id: "reset",
    name: "Skin-first reset",
    line: "Spot, brow, balm. Nothing else.",
    promise: "Permission to drop conventional base entirely.",
    profile: { goals: ["wear-less", "simplify", "alternatives"], coverage: 8, ceiling: 4, desire: 0, maintenance: 0, timeBudget: 5 },
  },
];

export const DEFAULT_PROFILE: Profile = {
  goals: ["escape-pancake"],
  skin: "combination",
  sensitivity: 1,
  concerns: [],
  climate: "temperate",
  outdoors: 1,
  timeBudget: 10,
  maintenance: 1,
  desire: 2,
  ceiling: 6,
  coverage: 30,
  filters: [],
  bag: ["full-foundation", "setting-powder", "powder-blush", "mascara"],
  budget: "mid",
};

export interface DeskBrand {
  name: string;
  family: "Mineral" | "Hybrid SPF" | "Skin tint" | "Botanical" | "Multi-use" | "Sensitive";
  also?: string;
  lane: string;
  note: string;
  best: string[];
  less: string[];
  examples: string[];
  filters: FilterKey[];
}

export const BRANDS: DeskBrand[] = [
  { name: "ILIA", family: "Skin tint", also: "Hybrid SPF", lane: "Hybrid skin tint", note: "Serum tints and multi-use sticks for second-skin kits. A strong default for sheer architecture.", best: ["Tint + SPF hybrid days", "Multi-use stick colour", "Skin-first wear"], less: ["Silicone-averse without checking current formulas"], examples: ["Super Serum Skin Tint SPF 40", "True Skin Serum Foundation", "Multi-Stick", "Limitless Lash Mascara", "Balmy Tint"], filters: ["vegan"] },
  { name: "Saie", family: "Skin tint", lane: "Dewy skin tint", note: "Hydrating tints and cream colour. Excellent in dry climates; powder stays strategic.", best: ["Dry or dehydration-prone context", "Cream blush systems"], less: ["Very oily skin wanting matte only"], examples: ["Slip Tint SPF 35", "Dew Blush", "Airset Radiant Loose Powder", "Glowy Super Gel"], filters: ["vegan"] },
  { name: "Kosas", family: "Skin tint", lane: "Skincare hybrid colour", note: "Hybrid textures between makeup and skincare — sheer to light with comfort.", best: ["Skincare-tint preference", "Strategic powder"], less: ["Strict fragrance-free without a label check"], examples: ["BB Burst Tinted Gel Cream", "Revealer Concealer", "Cloud Set Powder"], filters: ["vegan"] },
  { name: "Rose Inc", family: "Skin tint", lane: "Modern clean complexion", note: "Soft-focus complexion for light-to-medium polished wear.", best: ["Polished everyday without full coverage"], less: ["Strict mineral-only filter"], examples: ["Softlight Hydrating Concealer"], filters: ["vegan"] },
  { name: "Merit", family: "Multi-use", also: "Skin tint", lane: "Minimalist capsule", note: "Complexion sticks and multi-use colour that cut drawer clutter.", best: ["Minimalist philosophy", "5–15 minute routines"], less: ["Full glam multi-step systems"], examples: ["The Complexion Stick", "Flush Balm Cream Blush", "The Minimalist Foundation"], filters: ["vegan", "fragranceFree"] },
  { name: "Jones Road", family: "Multi-use", lane: "Balm multi-use", note: "One-balm systems that remove powder blush and highlighter from the kit.", best: ["Simplify / wear less", "Dry climate glow"], less: ["Matte full coverage required"], examples: ["Miracle Balm"], filters: [] },
  { name: "RMS Beauty", family: "Multi-use", lane: "Cream / un-makeup", note: "Cream balms and bases that favour skin-like finish over mask coverage.", best: ["Cream multi-use", "Dewy skin-first looks"], less: ["Hard EO-free without label verification"], examples: ["UnCoverup Concealer", "Eye Polish"], filters: ["vegan"] },
  { name: "Westman Atelier", family: "Multi-use", lane: "Cream luxury multi-use", note: "Cream sticks for colour that still reads as skin.", best: ["Cream colour preference", "Polished everyday"], less: ["Lean budget only"], examples: ["Baby Cheeks Blush Stick"], filters: [] },
  { name: "Ogee", family: "Multi-use", also: "Botanical", lane: "Organic multi-use sticks", note: "One-stick architecture for base and glow when fingers are the tool.", best: ["Capsule kits and travel", "Dry or cream-preferring skin"], less: ["Essential-oil-free is a hard requirement"], examples: ["Sculpted Complexion Stick", "Sculpted Face Stick", "Complexion Perfecting Serum Foundation"], filters: ["vegan"] },
  { name: "Tatcha", family: "Multi-use", lane: "Oil control without powder", note: "Blotting instead of re-powdering — anti-pancake shine control.", best: ["Shine control without cake", "Midday maintenance"], less: ["You never experience shine"], examples: ["Aburatorigami Blotting Papers"], filters: [] },
  { name: "bareMinerals", family: "Mineral", lane: "Classic mineral", note: "Iconic mineral powder foundation — best applied light and built.", best: ["Mineral-preferred filters", "Buildable powder coverage"], less: ["Very dry / high altitude without prep"], examples: ["Original Loose Powder Foundation", "Mineral Veil Finishing Powder"], filters: ["mineral"] },
  { name: "Alima Pure", family: "Mineral", lane: "Short-list mineral", note: "Minimal mineral formulations for “fewer ingredients” as the signal.", best: ["Minimal list preference", "Mineral-only path"], less: ["You want cream balms primarily"], examples: ["Satin Matte Foundation"], filters: ["mineral", "fragranceFree", "vegan"] },
  { name: "Glo Skin Beauty", family: "Mineral", also: "Skin tint", lane: "Pro mineral / hybrid", note: "Pressed mineral bases, moisture tints and sticks used in pro settings.", best: ["Mineral or pro-adjacent formulas", "Buildable powder or stick"], less: ["Sheer balm with zero powder"], examples: ["Pressed Base Mineral Foundation", "C-Shield Moisture Tint SPF 30", "HD Mineral Foundation Stick"], filters: ["mineral"] },
  { name: "Jane Iredale", family: "Mineral", also: "Sensitive", lane: "Mineral / derm-adjacent", note: "Mineral-forward complexion with denser options when events need more.", best: ["Mineral + more coverage than a tint", "Event-ready mineral path"], less: ["Wear-less / no-base goals"], examples: ["PurePressed Base", "Glow Time Pro BB Cream"], filters: ["mineral"] },
  { name: "Lily Lolo", family: "Mineral", lane: "Accessible mineral", note: "Straightforward mineral powder for mineral-preferred filters.", best: ["Mineral preferred", "Buildable powder"], less: ["Cream-only architecture"], examples: ["Mineral Foundation"], filters: ["mineral", "vegan"] },
  { name: "INIKA Organic", family: "Mineral", also: "Botanical", lane: "Organic mineral", note: "Certified organic mineral pigment for dual mineral + botanical preference.", best: ["Mineral + organic preference together"], less: ["Only liquid serum tints"], examples: ["Loose Mineral Foundation"], filters: ["mineral", "vegan"] },
  { name: "Colorescience", family: "Hybrid SPF", also: "Mineral", lane: "Mineral SPF hybrid", note: "SPF-forward mineral colour for outdoor and altitude context.", best: ["Outdoors often", "High altitude", "SPF in makeup"], less: ["Indoor-only with no SPF interest"], examples: ["Flex SPF 50 Tinted"], filters: ["mineral"] },
  { name: "EltaMD", family: "Hybrid SPF", also: "Sensitive", lane: "Derm-adjacent SPF", note: "SPF-first tinted options often used alongside dermatology routines.", best: ["SPF hybrid preference", "Sensitive-aware context"], less: ["Colour pay-off is the only goal"], examples: ["UV Elements Tinted SPF 44"], filters: ["mineral", "fragranceFree"] },
  { name: "Supergoop!", family: "Hybrid SPF", lane: "SPF lifestyle hybrid", note: "SPF as the product job, tint as secondary — hybrid architecture.", best: ["Outdoors often", "SPF-in-makeup preferred"], less: ["No interest in UV strategy via makeup"], examples: ["CC Screen 100% Mineral CC Cream SPF 50"], filters: ["mineral"] },
  { name: "100% PURE", family: "Botanical", lane: "Fruit-pigmented natural", note: "Fruit-pigmented cream and powder pathways; higher coverage needs a light hand.", best: ["Botanical pigment with medium coverage", "Powder pathway for oil days"], less: ["Ultra-sheer tint only", "Dry skin + full matte"], examples: ["Fruit Pigmented Healthy Foundation", "Fruit Pigmented Foundation Powder"], filters: ["vegan"] },
  { name: "Ere Perez", family: "Botanical", lane: "Botanical everyday", note: "Breathable botanical complexion and multi-use pots for anti-pancake wear.", best: ["Dewy buildable light coverage", "Pot multi-use", "Sensitive-aware kits"], less: ["Ultra-matte full coverage all day"], examples: ["Oat Milk Foundation", "Arnica All-Cover Pot", "Carrot Colour Pot", "Avocado Mascara"], filters: ["vegan"] },
  { name: "Fitglow Beauty", family: "Botanical", lane: "Treatment-oriented botanical", note: "Plant-based colour positioned as skin-compatible — descriptive, never medical.", best: ["Botanical concealer for spot work", "Plant-based preference"], less: ["Mineral-pigment-only filters"], examples: ["Foundation +", "Conceal +"], filters: ["vegan"] },
  { name: "Kjaer Weis", family: "Botanical", lane: "Certified-organic cream", note: "Organic cream architecture with refillable packaging; skin-like when sheered.", best: ["Cream textures and refills", "Sheer-to-buildable organic coverage"], less: ["Strict fragrance/EO-free without label check"], examples: ["Cream Foundation", "Cream Blush", "The Beautiful Tint"], filters: [] },
  { name: "La Roche-Posay", family: "Sensitive", lane: "Derm-adjacent base", note: "Sensitive-positioned tinted formulas for cautious everyday wear.", best: ["Sensitive-aware", "Light coverage everyday"], less: ["Full glam colour play"], examples: ["Toleriane-style sensitive tinted moisturiser"], filters: ["fragranceFree"] },
  { name: "Tower 28", family: "Sensitive", lane: "Sensitive-aware clean", note: "Simplified formulas for redness-prone and cautious users. Education, not diagnosis.", best: ["Sensitive / redness-prone", "Fragrance-cautious"], less: ["Full-coverage performance only"], examples: ["SOS Daily Rescue context", "BeachPlease Lip + Cheek", "Swipe Serum Concealer", "MakeWaves Concealer"], filters: ["fragranceFree", "vegan"] },
  { name: "The Desk", family: "Sensitive", lane: "House lane", note: "Sensitive-aware pathway examples held as education, never as ranking or safety score.", best: ["Cautious reintroduction after a reaction"], less: ["Medical clearance — the desk never provides that"], examples: ["Spot-only architecture", "Balm + brow only days"], filters: ["fragranceFree"] },
];

export const FAMILIES = ["Mineral", "Hybrid SPF", "Skin tint", "Botanical", "Multi-use", "Sensitive"] as const;