import type { FilterKey, Profile, Region, Undertone } from "./types";

/** Undertone is used for shade families and warmth direction only — never a claim about who a formula is "for". */
export const UNDERTONES: { id: Undertone; label: string; note: string }[] = [
  { id: "cool", label: "Cool", note: "Rose or blue-leaning. Veins read blue; silver sits easily." },
  { id: "neutral", label: "Neutral", note: "No dominant lean. Most short shade ranges are built here." },
  { id: "warm", label: "Warm", note: "Golden or peach-leaning. Gold sits easily." },
  { id: "olive", label: "Olive", note: "Green-grey cast that most bases over-correct into pink." },
  { id: "golden-olive", label: "Golden olive", note: "Olive with warmth on top — sits between yellow and green." },
  { id: "deep-neutral", label: "Deep neutral", note: "Depth without a strong lean; ashiness is the failure mode." },
  { id: "red-leaning", label: "Red-leaning", note: "Red or mahogany cast; orange-yellow bases turn grey on it." },
];

export const REGIONS: Region[] = [
  "North America",
  "United Kingdom",
  "Europe",
  "Korea",
  "Japan",
  "India",
  "West Africa",
  "Middle East",
  "Brazil",
  "Latin America",
  "Australia",
];

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
  { id: "mature-skin", label: "Mature / fine-line aware", note: "Flexible films over powder that settles into lines." },
  { id: "rosacea", label: "Rosacea-prone cautious", note: "Placement and fragrance-aware — never full-face opacity as the reflex." },
  { id: "fragrance-sensitive", label: "Fragrance-sensitive", note: "Hard fragrance filter; short lists over pretty stories." },
  { id: "minimalist", label: "Minimalist capsule", note: "Few objects, each with a job that survives a Monday." },
  { id: "performance-sport", label: "Performance / sport", note: "Sweat-honest: thin, stain, blot — not a powder rebuild." },
  { id: "hd-photo", label: "HD / photography", note: "Lenses punish layers before colour. Diffusion over opacity." },
  { id: "deep-undertone", label: "Deep + undertone match", note: "Match first on deep, olive, red-leaning and deep-neutral bands." },
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
  "rosacea flare",
  "melasma / uneven depth",
  "under-eye hollowness",
  "post-workout transfer",
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

  /* ── Base, extended ── */
  { id: "tinted-moisturiser", label: "Tinted moisturiser", lane: "base", layerWeight: 1, coverage: 28, oil: -1, dry: 2, longevity: 1, upkeep: 1, minutes: 2, job: "Hydration first, tone second.", examples: ["Kosas BB Burst", "Glo C-Shield Moisture Tint SPF 30", "Chantecaille Just Skin"] },
  { id: "cushion-compact", label: "Cushion compact", lane: "base", layerWeight: 2, coverage: 40, oil: 1, dry: 1, longevity: 2, upkeep: 2, minutes: 2, job: "Portable base — the touch-up temptation is the risk.", examples: ["Hybrid cushion lanes on the desk"] },
  { id: "blur-balm", label: "Skin blur balm", lane: "base", layerWeight: 1, coverage: 18, oil: 0, dry: 2, longevity: 1, upkeep: 1, minutes: 2, job: "Softens texture optically instead of covering it.", examples: ["Jones Road Miracle Balm", "Hourglass Veil Hybrid"] },
  { id: "serum-foundation", label: "Serum foundation", lane: "base", layerWeight: 2, coverage: 55, oil: 0, dry: 1, longevity: 2, upkeep: 1, minutes: 4, job: "Medium coverage with a fluid, moveable film.", examples: ["ILIA True Skin Serum Foundation", "Fitglow Foundation +", "Ogee Complexion Perfecting Serum Foundation"] },

  /* ── Spot, extended ── */
  { id: "blemish-concealer", label: "Blemish concealer", lane: "spot", layerWeight: 1, coverage: 80, oil: 2, dry: -1, longevity: 3, upkeep: 1, minutes: 2, job: "Highest opacity on the smallest possible area.", examples: ["Fitglow Conceal +", "Clove + Hallow Conceal + Correct"] },
  { id: "hydrating-corrector", label: "Hydrating under-eye corrector", lane: "spot", layerWeight: 1, coverage: 45, oil: -1, dry: 2, longevity: 1, upkeep: 1, minutes: 1, job: "Peach-toned light, no creasing seam.", examples: ["Kosas Revealer", "Rose Inc Softlight"] },

  /* ── Colour, extended ── */
  { id: "liquid-blush", label: "Liquid blush", lane: "colour", layerWeight: 1, coverage: 12, oil: 1, dry: 1, longevity: 2, upkeep: 1, minutes: 1, job: "Stain-like colour that survives a warm room.", examples: ["Tower 28 BeachPlease Lip + Cheek", "Saie Dew Blush"] },
  { id: "cream-bronzer", label: "Cream bronzer", lane: "colour", layerWeight: 1, coverage: 14, oil: -1, dry: 2, longevity: 1, upkeep: 1, minutes: 2, job: "Warmth as a plane, not a stripe.", examples: ["Ogee Sculpted Face Stick", "Westman Atelier Beauty Butter"] },
  { id: "powder-bronzer", label: "Powder bronzer", lane: "colour", layerWeight: 1, coverage: 16, oil: 2, dry: -2, longevity: 2, upkeep: 1, minutes: 2, job: "Warmth on oilier or powder-set days.", examples: ["Youngblood Pressed Mineral Bronzer"] },
  { id: "bronzing-drops", label: "Bronzing drops", lane: "colour", layerWeight: 1, coverage: 10, oil: -1, dry: 1, longevity: 1, upkeep: 1, minutes: 1, job: "Mixes into base instead of sitting on it.", examples: ["Mix a drop into any serum tint"] },
  { id: "powder-highlighter", label: "Powder highlight", lane: "colour", layerWeight: 1, coverage: 8, oil: 1, dry: -2, longevity: 2, upkeep: 1, minutes: 1, job: "Sparkle over powder — reads dry on dry skin.", examples: ["Athr Beauty Crystal Highlighter"] },

  /* ── Finish, extended ── */
  { id: "pressed-powder", label: "Pressed powder compact", lane: "finish", layerWeight: 1, coverage: 20, oil: 2, dry: -2, longevity: 2, upkeep: 2, minutes: 1, job: "Portable set — the classic afternoon cake mechanism.", examples: ["bareMinerals Mineral Veil Pressed", "Jane Iredale PurePressed Base"] },
  { id: "shine-stick", label: "Shine-control stick", lane: "finish", layerWeight: 0, coverage: 0, oil: 2, dry: 0, longevity: 1, upkeep: 1, minutes: 1, job: "Mattifies two panels without powder pigment.", examples: ["Clear balm-format shine sticks"] },

  /* ── Eye, extended ── */
  { id: "brow-pencil", label: "Brow pencil", lane: "eye", layerWeight: 0, coverage: 0, oil: 1, dry: 0, longevity: 2, upkeep: 1, minutes: 2, job: "Builds a brow shape where hair is missing.", examples: ["Zao Organic Brow Pencil", "Elate Brow Pencil"] },
  { id: "eyeliner-pencil", label: "Soft eyeliner", lane: "eye", layerWeight: 0, coverage: 0, oil: 0, dry: 0, longevity: 2, upkeep: 1, minutes: 2, job: "Definition at the lash line, no complexion cost.", examples: ["NUDESTIX Magnetic Eye Pencil", "Lawless Smokey Liner"] },
  { id: "shadow-duo", label: "Powder shadow duo", lane: "eye", layerWeight: 1, coverage: 0, oil: 1, dry: -1, longevity: 2, upkeep: 1, minutes: 4, job: "Gradient control — costs minutes, not layers.", examples: ["Athr Beauty shadow palettes", "W3LL PEOPLE Elitist Shadow"] },

  /* ── Lip, extended ── */
  { id: "lip-oil", label: "Lip oil", lane: "lip", layerWeight: 0, coverage: 0, oil: 0, dry: 2, longevity: 0, upkeep: 3, minutes: 1, job: "Shine and comfort, reapplied constantly.", examples: ["ILIA Balmy Gloss Lip Oil"] },
  { id: "satin-lipstick", label: "Satin lipstick", lane: "lip", layerWeight: 0, coverage: 0, oil: 0, dry: 1, longevity: 2, upkeep: 2, minutes: 1, job: "The single most visible effort signal on the face.", examples: ["Axiology Balmies", "Kjaer Weis Lipstick", "Vapour Siren Lipstick"] },
  { id: "lip-liner", label: "Lip liner", lane: "lip", layerWeight: 0, coverage: 0, oil: 0, dry: 0, longevity: 3, upkeep: 0, minutes: 1, job: "Holds a lip through dinner without a second coat.", examples: ["Elate Lip Liner", "Zao Lip Pencil"] },

  /* ── Care / prep ── */
  { id: "hydrating-prep", label: "Hydrating prep layer", lane: "care", layerWeight: 0, coverage: 0, oil: 0, dry: 2, longevity: 1, upkeep: 0, minutes: 1, job: "The only reliable anti-cake step, and it is not makeup.", examples: ["Any humectant serum under base"] },
  { id: "mineral-spf", label: "Untinted mineral SPF", lane: "care", layerWeight: 0, coverage: 0, oil: 0, dry: 1, longevity: 2, upkeep: 1, minutes: 1, job: "UV strategy kept separate from colour.", examples: ["EltaMD UV Clear", "Coola Mineral Face SPF 30"] },
  /* ── Persona-extended types ── */
  { id: "sport-tint", label: "Performance sport tint", lane: "base", layerWeight: 1, coverage: 24, oil: 2, dry: 0, longevity: 2, upkeep: 1, minutes: 2, job: "Thin pigment that survives sweat without inviting powder.", examples: ["Supergoop! Glowscreen sport-leaning tints", "Coola Mineral Face Matte Tint", "Huda Beauty Faux Filter Skin Tint (sheered)"] },
  { id: "hd-blur", label: "HD optical blur base", lane: "base", layerWeight: 1, coverage: 30, oil: 0, dry: 1, longevity: 2, upkeep: 1, minutes: 3, job: "Diffusion for lenses — soft-focus without a mask.", examples: ["Hourglass Veil Hydrating Skin Tint", "Makeup by Mario SoftSculpt (light pass)", "Laura Mercier Flawless Fusion (sheer)"] },
  { id: "green-corrector", label: "Green redness corrector", lane: "spot", layerWeight: 1, coverage: 35, oil: 0, dry: 0, longevity: 1, upkeep: 1, minutes: 1, job: "Neutralises rosacea and flare redness before any base.", examples: ["Tower 28 SOS Daily Rescue Corrector", "NYX Color Correcting Concealer (green)", "LA Girl Pro Conceal green"] },
  { id: "longwear-stain", label: "Long-wear cheek stain", lane: "colour", layerWeight: 0, coverage: 10, oil: 2, dry: 0, longevity: 3, upkeep: 0, minutes: 1, job: "Colour that survives humidity and sweat without a cream film.", examples: ["Benefit Benetint-style stains", "Océane Lip Tint", "e.l.f. Camo Liquid Blush (sheer stain pass)"] },
  { id: "drugstore-stick", label: "Accessible multi-stick", lane: "base", layerWeight: 1, coverage: 32, oil: 0, dry: 1, longevity: 2, upkeep: 1, minutes: 2, job: "Capsule architecture at drugstore pricing.", examples: ["e.l.f. Camo Hydrating Multi-Stick", "NYX Bare With Me Tinted Skin Veil", "Maybelline Super Stay Skin Tint"] },

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
  { id: "duo-fibre-brush", label: "Duo-fibre brush" },
  { id: "mini-sponge", label: "Mini precision sponge" },
  { id: "shadow-blender", label: "Shadow blending brush" },
  { id: "lip-brush", label: "Lip brush" },
  { id: "brow-brush", label: "Angled brow brush" },
];

export interface Preset {
  id: string;
  name: string;
  line: string;
  promise: string;
  /** the feeling the path is reaching for */
  feeling?: string;
  /** what it gives up to get there */
  trade?: string;
  profile: Partial<Profile>;
}

export const PRESETS: Preset[] = [
  {
    id: "everyday",
    name: "Anti-pancake everyday",
    line: "Sheer base, spot work, cream colour.",
    promise: "The smart alternative to full-face cake.",
    feeling: "Looked-after rather than made-up.",
    trade: "Gives up the comfort of full coverage on the days you want to hide.",
    profile: { goals: ["escape-pancake", "even-tone", "fast-polish"], skin: "combination", coverage: 30, ceiling: 6, desire: 2, maintenance: 1, timeBudget: 10 },
  },
  {
    id: "altitude",
    name: "High altitude & dry",
    line: "Flexible tints and balms over powder stacks.",
    promise: "Films that move with dehydrated skin.",
    feeling: "Lit from inside, even in thin air.",
    trade: "Gives up matte control; shine is treated as health, not failure.",
    profile: { goals: ["dryness", "escape-pancake", "alternatives"], skin: "dry", climate: "altitude", coverage: 25, ceiling: 6, outdoors: 2, desire: 2, maintenance: 1, timeBudget: 10 },
  },
  {
    id: "sensitive",
    name: "Sensitive capsule",
    line: "Fewer products, mineral-aware, hard filters kept.",
    promise: "Lighter layers where reactivity is live.",
    feeling: "Calm. Nothing on the face arguing with it.",
    trade: "Gives up range — the shortlist stays deliberately narrow.",
    profile: { goals: ["sensitive", "redness", "simplify"], sensitivity: 3, concerns: ["redness"], filters: ["fragranceFree", "mineral"], coverage: 28, ceiling: 5, desire: 1, maintenance: 1, timeBudget: 10 },
  },
  {
    id: "event",
    name: "Event-ready, not cake",
    line: "Longevity where it matters only.",
    promise: "Definition earns the bag; the base stays honest.",
    feeling: "Photographed at midnight and still yourself.",
    trade: "Gives up speed — this is the longest morning on the desk.",
    profile: { goals: ["event", "awake", "shine"], coverage: 45, ceiling: 9, desire: 3, maintenance: 2, timeBudget: 20 },
  },
  {
    id: "reset",
    name: "Skin-first reset",
    line: "Spot, brow, balm. Nothing else.",
    promise: "Permission to drop conventional base entirely.",
    feeling: "Relief. The face left alone on purpose.",
    trade: "Gives up evening tone; texture and colour stay visible.",
    profile: { goals: ["wear-less", "simplify", "alternatives"], coverage: 8, ceiling: 4, desire: 0, maintenance: 0, timeBudget: 5 },
  },
  {
    id: "sebum-city",
    name: "Sebum city",
    line: "Thin base, blotting over re-powdering.",
    promise: "Oil moves the base — so the base has to be thin.",
    feeling: "Composed through a humid afternoon.",
    trade: "Gives up the security blanket of pressed powder in the bag.",
    profile: { goals: ["shine", "escape-pancake", "even-tone"], skin: "oily", climate: "humid", coverage: 32, ceiling: 6, desire: 1, maintenance: 1, timeBudget: 10, bag: ["full-foundation", "pressed-powder", "primer"] },
  },
  {
    id: "carry-on",
    name: "Carry-on capsule",
    line: "Four objects, every one doing two jobs.",
    promise: "Travel is a complexity ceiling with a zip.",
    feeling: "Unbothered, wherever you land.",
    trade: "Gives up specialists — every object has to compromise a little.",
    profile: { goals: ["simplify", "fast-polish", "alternatives"], coverage: 22, ceiling: 4, desire: 2, maintenance: 0, timeBudget: 7, budget: "mid", bag: ["multi-stick", "lip-cheek-balm", "mascara"] },
  },
  {
    id: "on-camera",
    name: "Photographed & on camera",
    line: "Definition and diffusion, never opacity.",
    promise: "Lenses punish layers before they punish colour.",
    feeling: "Legible on a screen without reading as makeup.",
    trade: "Gives up minutes and asks for a proper light check.",
    profile: { goals: ["event", "awake", "even-tone"], coverage: 42, ceiling: 8, desire: 3, maintenance: 2, timeBudget: 22, concerns: ["texture"], bag: ["full-foundation", "setting-powder", "powder-highlighter"] },
  },
  {
    id: "five-minute",
    name: "Five honest minutes",
    line: "Three objects, no mirror negotiation.",
    promise: "The fastest route that still reads as considered.",
    feeling: "Out of the door with the face already settled.",
    trade: "Gives up correction entirely — what shows, shows.",
    profile: { goals: ["fast-polish", "simplify", "escape-pancake"], coverage: 18, ceiling: 3, desire: 1, maintenance: 0, timeBudget: 5, bag: ["lip-cheek-balm", "mascara"] },
  },
  {
    id: "reactive-repair",
    name: "Reactive skin, mid-flare",
    line: "Corrector and prep before any base decision.",
    promise: "Redness handled by placement, not by opacity.",
    feeling: "Covered enough to stop thinking about it.",
    trade: "Gives up glow products that sit on inflamed texture.",
    profile: {
      goals: ["redness", "sensitive", "escape-pancake"],
      skin: "dry",
      sensitivity: 3,
      concerns: ["redness", "texture"],
      filters: ["fragranceFree", "eoFree"],
      coverage: 34,
      ceiling: 5,
      desire: 1,
      maintenance: 1,
      timeBudget: 9,
    },
  },
  {
    id: "mature",
    name: "Mature skin, flexible film",
    line: "Prep, tint, cream colour — nothing that settles.",
    promise: "Fine lines get architecture, not more powder.",
    feeling: "Lit, not masked. The face still moves.",
    trade: "Gives up matte full coverage and glitter highlight that catches every line.",
    profile: {
      goals: ["mature-skin", "escape-pancake", "dryness", "awake"],
      skin: "dry",
      concerns: ["fine lines", "dullness", "texture"],
      climate: "temperate",
      coverage: 28,
      ceiling: 6,
      desire: 2,
      maintenance: 1,
      timeBudget: 12,
      bag: ["full-foundation", "setting-powder", "powder-highlighter"],
    },
  },
  {
    id: "humid-oily",
    name: "Oily skin, humid climate",
    line: "Thin base, stains, blotting — humidity is the boss.",
    promise: "Oil and air moisture will move anything heavy. So stay thin.",
    feeling: "Composed through a monsoon commute.",
    trade: "Gives up dewy balm stacks and cream highlight that becomes slip.",
    profile: {
      goals: ["shine", "escape-pancake", "even-tone", "fast-polish"],
      skin: "oily",
      climate: "humid",
      coverage: 30,
      ceiling: 5,
      desire: 1,
      maintenance: 1,
      timeBudget: 8,
      bag: ["full-foundation", "pressed-powder", "cream-highlighter"],
    },
  },
  {
    id: "deep-undertone",
    name: "Deep skin + undertone match",
    line: "Match first. Layers never fix a grey cast.",
    promise: "Olive, red-leaning and deep-neutral bands treated as the centre, not the edge.",
    feeling: "Actually your colour, in daylight.",
    trade: "Gives up pretty short ranges that almost work — almost is how cake starts.",
    profile: {
      goals: ["deep-undertone", "even-tone", "escape-pancake", "event"],
      skin: "combination",
      undertone: "olive",
      depth: 9,
      coverage: 38,
      ceiling: 7,
      desire: 2,
      maintenance: 1,
      timeBudget: 12,
      concerns: ["pigmentation", "melasma / uneven depth"],
      bag: ["full-foundation", "setting-powder"],
    },
  },
  {
    id: "rosacea",
    name: "Rosacea-prone, mid-caution",
    line: "Corrector, sheer film, fragrance out.",
    promise: "Redness is placement, not a full-face problem.",
    feeling: "Calm enough to stop negotiating with the mirror.",
    trade: "Gives up scented glow balms and heavy base as emotional armour.",
    profile: {
      goals: ["rosacea", "redness", "sensitive", "fragrance-sensitive", "escape-pancake"],
      skin: "combination",
      sensitivity: 3,
      concerns: ["redness", "rosacea flare", "texture"],
      filters: ["fragranceFree", "eoFree"],
      coverage: 32,
      ceiling: 5,
      desire: 1,
      maintenance: 1,
      timeBudget: 10,
    },
  },
  {
    id: "fragrance-guard",
    name: "Fragrance-sensitive desk",
    line: "Hard filters, short list, verify every unit.",
    promise: "Preference as architecture — not a purity contest.",
    feeling: "Nothing on the face arguing with your nervous system.",
    trade: "Gives up most 'botanical treatment' balms that smell like a spa.",
    profile: {
      goals: ["fragrance-sensitive", "sensitive", "simplify", "escape-pancake"],
      sensitivity: 2,
      filters: ["fragranceFree", "eoFree"],
      coverage: 26,
      ceiling: 5,
      desire: 1,
      maintenance: 1,
      timeBudget: 9,
      bag: ["lip-cheek-balm", "cream-blush"],
    },
  },
  {
    id: "minimalist",
    name: "Minimalist three-object",
    line: "Ceiling of three. Every object earns rent.",
    promise: "The opposite of a drawer that shops for you.",
    feeling: "Done. Out. No negotiation.",
    trade: "Gives up specialists — contour, highlight and a second lip all lose.",
    profile: {
      goals: ["minimalist", "simplify", "fast-polish", "wear-less"],
      coverage: 15,
      ceiling: 3,
      desire: 1,
      maintenance: 0,
      timeBudget: 5,
      bag: ["full-foundation", "setting-powder", "powder-blush", "mascara", "lip-stain"],
    },
  },
  {
    id: "sport",
    name: "Performance & sport",
    line: "Sweat-honest tint, stain, brows, blot.",
    promise: "If it cannot survive a workout, it does not earn the bag.",
    feeling: "Still looks like you after mile three.",
    trade: "Gives up cream highlight, satin lip and any powder rebuild fantasy.",
    profile: {
      goals: ["performance-sport", "shine", "fast-polish", "escape-pancake"],
      skin: "combination",
      climate: "humid",
      outdoors: 3,
      coverage: 22,
      ceiling: 4,
      desire: 1,
      maintenance: 1,
      timeBudget: 6,
      concerns: ["post-workout transfer"],
      bag: ["full-foundation", "cream-highlighter", "lip-oil"],
    },
  },
  {
    id: "hd-photo",
    name: "HD & photography",
    line: "Blur, place, define — never cake for the lens.",
    promise: "Hard light punishes layers before it punishes colour.",
    feeling: "Legible on a 4K feed without reading as a filter.",
    trade: "Gives up glitter highlight, heavy powder and full-face opacity 'for camera'.",
    profile: {
      goals: ["hd-photo", "event", "awake", "even-tone"],
      coverage: 40,
      ceiling: 8,
      desire: 3,
      maintenance: 2,
      timeBudget: 22,
      concerns: ["texture", "fine lines"],
      bag: ["full-foundation", "setting-powder", "powder-highlighter"],
    },
  },

];

export const DEFAULT_PROFILE: Profile = {
  goals: [],
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
  bag: [],
  budget: "mid",
  undertone: "neutral",
  depth: 5,
};

export type PriceTier = "drugstore" | "mid" | "prestige" | "luxury";

export const PRICE_TIERS: { id: PriceTier; label: string; band: string }[] = [
  { id: "drugstore", label: "Drugstore", band: "Typically under ~$25 for colour; bases often under ~$20" },
  { id: "mid", label: "Mid", band: "Roughly $25–$45 — accessible specialty and pharmacy-plus" },
  { id: "prestige", label: "Prestige", band: "Roughly $45–$70 — department and specialty counters" },
  { id: "luxury", label: "Luxury", band: "Typically $70+ — craft, refill, or couture pricing" },
];

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
  /** Price tier — access and positioning, never a quality ranking. */
  tier: PriceTier;
  /** What earns a place in the bag for this house. */
  earns: string;
  /** What loses the bag — honest, not cruel. */
  loses: string;
  /** Where the house is easiest to buy. Defaults to North America when unstated. */
  region?: Region;
  /** Practical availability note — shipping, counters, retailer reality. */
  availability?: string;
}

export const brandRegion = (b: DeskBrand): Region => b.region ?? "North America";

export const BRANDS: DeskBrand[] = [
  { name: "ILIA", family: "Skin tint", also: "Hybrid SPF", lane: "Hybrid skin tint", note: "Serum tints and multi-use sticks for second-skin kits. A strong default for sheer architecture.", best: ["Tint + SPF hybrid days", "Multi-use stick colour", "Skin-first wear"], less: ["Silicone-averse without checking current formulas"], examples: ["Super Serum Skin Tint SPF 40", "True Skin Serum Foundation", "Multi-Stick", "Limitless Lash Mascara", "Balmy Tint"], filters: ["vegan"] , tier: "prestige", earns: "Serum tint + multi-stick architecture that actually sheers.", loses: "Buying the full opaque range and stacking it like a foundation wardrobe."},
  { name: "Saie", family: "Skin tint", lane: "Dewy skin tint", note: "Hydrating tints and cream colour. Excellent in dry climates; powder stays strategic.", best: ["Dry or dehydration-prone context", "Cream blush systems"], less: ["Very oily skin wanting matte only"], examples: ["Slip Tint SPF 35", "Dew Blush", "Airset Radiant Loose Powder", "Glowy Super Gel"], filters: ["vegan"] , tier: "prestige", earns: "Dewy tints and cream colour in dry air.", loses: "Matte-only oily days and anyone who powders the whole face on top."},
  { name: "Kosas", family: "Skin tint", lane: "Skincare hybrid colour", note: "Hybrid textures between makeup and skincare — sheer to light with comfort.", best: ["Skincare-tint preference", "Strategic powder"], less: ["Strict fragrance-free without a label check"], examples: ["BB Burst Tinted Gel Cream", "Revealer Concealer", "Cloud Set Powder"], filters: ["vegan"] , tier: "prestige", earns: "Hybrid textures and strategic powder.", loses: "Fragrance-sensitive kits without a label check."},
  { name: "Rose Inc", family: "Skin tint", lane: "Modern clean complexion", note: "Soft-focus complexion for light-to-medium polished wear.", best: ["Polished everyday without full coverage"], less: ["Strict mineral-only filter"], examples: ["Softlight Hydrating Concealer"], filters: ["vegan"] , tier: "prestige", earns: "Soft-focus light-to-medium polish.", loses: "Mineral-only hard filters."},
  { name: "Merit", family: "Multi-use", also: "Skin tint", lane: "Minimalist capsule", note: "Complexion sticks and multi-use colour that cut drawer clutter.", best: ["Minimalist philosophy", "5–15 minute routines"], less: ["Full glam multi-step systems"], examples: ["The Complexion Stick", "Flush Balm Cream Blush", "The Minimalist Foundation"], filters: ["vegan", "fragranceFree"] , tier: "prestige", earns: "Capsule sticks that cut drawer clutter.", loses: "Full glam multi-step systems."},
  { name: "Jones Road", family: "Multi-use", lane: "Balm multi-use", note: "One-balm systems that remove powder blush and highlighter from the kit.", best: ["Simplify / wear less", "Dry climate glow"], less: ["Matte full coverage required"], examples: ["Miracle Balm"], filters: [] , tier: "prestige", earns: "One-balm systems that delete three products.", loses: "Matte full coverage requirements."},
  { name: "RMS Beauty", family: "Multi-use", lane: "Cream / un-makeup", note: "Cream balms and bases that favour skin-like finish over mask coverage.", best: ["Cream multi-use", "Dewy skin-first looks"], less: ["Hard EO-free without label verification"], examples: ["UnCoverup Concealer", "Eye Polish"], filters: ["vegan"] , tier: "prestige", earns: "Cream un-makeup that still reads intentional.", loses: "Hard EO-free without verification."},
  { name: "Westman Atelier", family: "Multi-use", lane: "Cream luxury multi-use", note: "Cream sticks for colour that still reads as skin.", best: ["Cream colour preference", "Polished everyday"], less: ["Lean budget only"], examples: ["Baby Cheeks Blush Stick"], filters: [] , tier: "luxury", earns: "Cream colour that reads as circulation.", loses: "Lean budgets and matte powder architecture."},
  { name: "Ogee", family: "Multi-use", also: "Botanical", lane: "Organic multi-use sticks", note: "One-stick architecture for base and glow when fingers are the tool.", best: ["Capsule kits and travel", "Dry or cream-preferring skin"], less: ["Essential-oil-free is a hard requirement"], examples: ["Sculpted Complexion Stick", "Sculpted Face Stick", "Complexion Perfecting Serum Foundation"], filters: ["vegan"] , tier: "luxury", earns: "Organic multi-use sticks for finger application.", loses: "Essential-oil-free hard requirements."},
  { name: "Tatcha", family: "Multi-use", lane: "Oil control without powder", note: "Blotting instead of re-powdering — anti-pancake shine control.", best: ["Shine control without cake", "Midday maintenance"], less: ["You never experience shine"], examples: ["Aburatorigami Blotting Papers"], filters: [] , tier: "prestige", earns: "Blotting over re-powdering — the free anti-cake move.", loses: "If you never experience shine."},
  { name: "bareMinerals", family: "Mineral", lane: "Classic mineral", note: "Iconic mineral powder foundation — best applied light and built.", best: ["Mineral-preferred filters", "Buildable powder coverage"], less: ["Very dry / high altitude without prep"], examples: ["Original Loose Powder Foundation", "Mineral Veil Finishing Powder"], filters: ["mineral"] , tier: "mid", earns: "Buildable mineral powder applied light.", loses: "Very dry or altitude skin without prep."},
  { name: "Alima Pure", family: "Mineral", lane: "Short-list mineral", note: "Minimal mineral formulations for “fewer ingredients” as the signal.", best: ["Minimal list preference", "Mineral-only path"], less: ["You want cream balms primarily"], examples: ["Satin Matte Foundation"], filters: ["mineral", "fragranceFree", "vegan"] , tier: "mid", earns: "Short-list mineral for fewer-ingredients preference.", loses: "Cream-balm-only kits."},
  { name: "Glo Skin Beauty", family: "Mineral", also: "Skin tint", lane: "Pro mineral / hybrid", note: "Pressed mineral bases, moisture tints and sticks used in pro settings.", best: ["Mineral or pro-adjacent formulas", "Buildable powder or stick"], less: ["Sheer balm with zero powder"], examples: ["Pressed Base Mineral Foundation", "C-Shield Moisture Tint SPF 30", "HD Mineral Foundation Stick"], filters: ["mineral"] , tier: "prestige", earns: "Pro mineral and hybrid moisture tints.", loses: "Sheer balm-only desire."},
  { name: "Jane Iredale", family: "Mineral", also: "Sensitive", lane: "Mineral / derm-adjacent", note: "Mineral-forward complexion with denser options when events need more.", best: ["Mineral + more coverage than a tint", "Event-ready mineral path"], less: ["Wear-less / no-base goals"], examples: ["PurePressed Base", "Glow Time Pro BB Cream"], filters: ["mineral"] , tier: "prestige", earns: "Mineral denser options when events need more.", loses: "Wear-less / no-base goals."},
  { name: "Lily Lolo", family: "Mineral", lane: "Accessible mineral", note: "Straightforward mineral powder for mineral-preferred filters.", best: ["Mineral preferred", "Buildable powder"], less: ["Cream-only architecture"], examples: ["Mineral Foundation"], filters: ["mineral", "vegan"] , tier: "mid", earns: "Accessible mineral entry.", loses: "Cream-only architecture."},
  { name: "INIKA Organic", family: "Mineral", also: "Botanical", region: "Australia", lane: "Organic mineral", note: "Certified organic mineral pigment for dual mineral + botanical preference.", best: ["Mineral + organic preference together"], less: ["Only liquid serum tints"], examples: ["Loose Mineral Foundation"], filters: ["mineral", "vegan"] , tier: "prestige", earns: "Certified organic mineral pigment.", loses: "Only liquid serum tints."},
  { name: "Colorescience", family: "Hybrid SPF", also: "Mineral", lane: "Mineral SPF hybrid", note: "SPF-forward mineral colour for outdoor and altitude context.", best: ["Outdoors often", "High altitude", "SPF in makeup"], less: ["Indoor-only with no SPF interest"], examples: ["Flex SPF 50 Tinted"], filters: ["mineral"] , tier: "prestige", earns: "SPF-forward mineral colour for outdoors.", loses: "Indoor-only with no UV interest."},
  { name: "EltaMD", family: "Hybrid SPF", also: "Sensitive", lane: "Derm-adjacent SPF", note: "SPF-first tinted options often used alongside dermatology routines.", best: ["SPF hybrid preference", "Sensitive-aware context"], less: ["Colour pay-off is the only goal"], examples: ["UV Elements Tinted SPF 44"], filters: ["mineral", "fragranceFree"] , tier: "mid", earns: "Derm-adjacent SPF hybrid.", loses: "Colour pay-off as the only goal."},
  { name: "Supergoop!", family: "Hybrid SPF", lane: "SPF lifestyle hybrid", note: "SPF as the product job, tint as secondary — hybrid architecture.", best: ["Outdoors often", "SPF-in-makeup preferred"], less: ["No interest in UV strategy via makeup"], examples: ["CC Screen 100% Mineral CC Cream SPF 50"], filters: ["mineral"] , tier: "mid", earns: "SPF as the job, tint secondary.", loses: "No UV strategy via makeup."},
  { name: "100% PURE", family: "Botanical", lane: "Fruit-pigmented natural", note: "Fruit-pigmented cream and powder pathways; higher coverage needs a light hand.", best: ["Botanical pigment with medium coverage", "Powder pathway for oil days"], less: ["Ultra-sheer tint only", "Dry skin + full matte"], examples: ["Fruit Pigmented Healthy Foundation", "Fruit Pigmented Foundation Powder"], filters: ["vegan"] , tier: "mid", earns: "Fruit pigment medium coverage with a light hand.", loses: "Ultra-sheer tint only."},
  { name: "Ere Perez", family: "Botanical", region: "Australia", lane: "Botanical everyday", note: "Breathable botanical complexion and multi-use pots for anti-pancake wear.", best: ["Dewy buildable light coverage", "Pot multi-use", "Sensitive-aware kits"], less: ["Ultra-matte full coverage all day"], examples: ["Oat Milk Foundation", "Arnica All-Cover Pot", "Carrot Colour Pot", "Avocado Mascara"], filters: ["vegan"] , tier: "prestige", earns: "Botanical everyday breathable coverage.", loses: "Ultra-matte full coverage all day."},
  { name: "Fitglow Beauty", family: "Botanical", lane: "Treatment-oriented botanical", note: "Plant-based colour positioned as skin-compatible — descriptive, never medical.", best: ["Botanical concealer for spot work", "Plant-based preference"], less: ["Mineral-pigment-only filters"], examples: ["Foundation +", "Conceal +"], filters: ["vegan"] , tier: "prestige", earns: "Plant-based spot and base hybrids.", loses: "Mineral-pigment-only filters."},
  { name: "Kjaer Weis", family: "Botanical", lane: "Certified-organic cream", note: "Organic cream architecture with refillable packaging; skin-like when sheered.", best: ["Cream textures and refills", "Sheer-to-buildable organic coverage"], less: ["Strict fragrance/EO-free without label check"], examples: ["Cream Foundation", "Cream Blush", "The Beautiful Tint"], filters: [] , tier: "luxury", earns: "Refillable organic cream architecture.", loses: "Strict fragrance/EO-free without label check."},
  { name: "La Roche-Posay", family: "Sensitive", region: "Europe", lane: "Derm-adjacent base", note: "Sensitive-positioned tinted formulas for cautious everyday wear.", best: ["Sensitive-aware", "Light coverage everyday"], less: ["Full glam colour play"], examples: ["Toleriane-style sensitive tinted moisturiser"], filters: ["fragranceFree"] , tier: "mid", earns: "Sensitive-positioned everyday tint.", loses: "Full glam colour play."},
  { name: "Tower 28", family: "Sensitive", lane: "Sensitive-aware clean", note: "Simplified formulas for redness-prone and cautious users. Education, not diagnosis.", best: ["Sensitive / redness-prone", "Fragrance-cautious"], less: ["Full-coverage performance only"], examples: ["SOS Daily Rescue context", "BeachPlease Lip + Cheek", "Swipe Serum Concealer", "MakeWaves Concealer"], filters: ["fragranceFree", "vegan"] , tier: "mid", earns: "Sensitive-aware colour and correctors.", loses: "Full-coverage performance only."},
  { name: "The Desk", family: "Sensitive", lane: "House lane", note: "Sensitive-aware pathway examples held as education, never as ranking or safety score.", best: ["Cautious reintroduction after a reaction"], less: ["Medical clearance — the desk never provides that"], examples: ["Spot-only architecture", "Balm + brow only days"], filters: ["fragranceFree"] , tier: "mid", earns: "Education pathway examples, not a ranking.", loses: "Anyone seeking medical clearance — the desk never provides that."},
  { name: "Hourglass", family: "Multi-use", also: "Skin tint", lane: "Optical luxury complexion", note: "Soft-focus, light-diffusing textures — the polished end of skin-like.", best: ["Photographed and on-camera days", "Blur without opacity"], less: ["Strict mineral-only filters", "Lean budget"], examples: ["Veil Hydrating Skin Tint", "Vanish Airbrush Powder (used sparingly)", "Ambient Lighting Powder"], filters: ["vegan"] , tier: "luxury", earns: "Optical blur without opacity.", loses: "Strict mineral-only or lean budget."},
  { name: "Chantecaille", family: "Botanical", also: "Skin tint", lane: "Botanical luxury", note: "Floral-water complexion with a genuinely sheer film. Expensive by design.", best: ["Sheer luminous base", "Dry or mature skin"], less: ["Full coverage", "Lean budget"], examples: ["Just Skin Tinted Moisturizer", "Cheek Shade"], filters: [] , tier: "luxury", earns: "Genuinely sheer botanical luxury film.", loses: "Full coverage or lean budget."},
  { name: "Vapour Beauty", family: "Botanical", also: "Multi-use", lane: "Organic stick multi-use", note: "Stick complexion and colour that press in with fingers alone.", best: ["Capsule kits", "Cream colour preference"], less: ["Matte powder architecture"], examples: ["Soft Focus Foundation Stick", "Aura Multi Use Blush", "Siren Lipstick"], filters: ["vegan"] , tier: "prestige", earns: "Organic stick multi-use.", loses: "Matte powder architecture."},
  { name: "Axiology", family: "Botanical", lane: "Zero-waste lip", note: "Balm-to-lip crayons — the lip lane with no packaging weight.", best: ["Lip-led finish signal", "Plastic-free preference"], less: ["Long-wear transfer-proof lip"], examples: ["Balmies", "Lip-to-Lid Balmie"], filters: ["vegan"] , tier: "mid", earns: "Zero-waste lip-led finish.", loses: "Long-wear transfer-proof lip needs."},
  { name: "Clove + Hallow", family: "Sensitive", also: "Multi-use", lane: "Accessible clean colour", note: "Straightforward clean formulas at a real-world price.", best: ["Lean budget with clean filters", "Spot concealing"], less: ["Luxury texture expectations"], examples: ["Conceal + Correct", "Liquid Lip Velvet"], filters: ["vegan", "fragranceFree"] , tier: "mid", earns: "Accessible clean spot and lip.", loses: "Luxury texture expectations."},
  { name: "Athr Beauty", family: "Botanical", lane: "Crystal-infused colour", note: "Palette-led colour for eye and highlight without base weight.", best: ["Eye definition", "Powder highlight on non-dry skin"], less: ["Very dry skin wanting cream only"], examples: ["Eyeshadow Palettes", "Crystal Highlighter"], filters: ["vegan"] , tier: "prestige", earns: "Palette colour without base weight.", loses: "Very dry skin wanting cream only."},
  { name: "Odacité", family: "Botanical", also: "Sensitive", lane: "Skincare-first house", note: "Prep and hydration lane — the step that prevents cake before makeup starts.", best: ["Hydrating prep under any base"], less: ["Colour pay-off is the goal"], examples: ["Serum Concentrates", "Mineral SPF"], filters: ["vegan"] , tier: "prestige", earns: "Prep that prevents cake before makeup starts.", loses: "Colour pay-off as the goal."},
  { name: "Coola", family: "Hybrid SPF", lane: "Lifestyle SPF", note: "Outdoor-first SPF including untinted mineral fluids.", best: ["Outdoors often", "SPF separate from colour"], less: ["Indoor-only with no UV interest"], examples: ["Mineral Face SPF 30", "Mineral Silk Crème"], filters: ["mineral", "vegan"] , tier: "mid", earns: "Outdoor SPF including untinted mineral.", loses: "Indoor-only no UV interest."},
  { name: "Zao Organic", family: "Botanical", also: "Mineral", region: "Europe", lane: "Refillable organic", note: "Bamboo refill system across brow, liner and lip — low-waste definition lane.", best: ["Brow and liner definition", "Refill preference"], less: ["Serum tint sheerness"], examples: ["Brow Pencil", "Lip Pencil", "Mineral Cooked Powder"], filters: ["mineral", "vegan"] , tier: "mid", earns: "Refillable brow and liner definition.", loses: "Serum tint sheerness as the only goal."},
  { name: "W3LL PEOPLE", family: "Mineral", also: "Sensitive", lane: "Mineral everyday", note: "Mineral colour and bio-tints for uncomplicated everyday wear.", best: ["Mineral filters", "Light everyday base"], less: ["Luxury finish expectations"], examples: ["Bio Tint Multi-Action Moisturizer", "Elitist Shadow"], filters: ["mineral", "vegan"] , tier: "mid", earns: "Mineral everyday bio-tints.", loses: "Luxury finish expectations."},
  { name: "Youngblood", family: "Mineral", lane: "Pro mineral", note: "Pro-counter mineral powders and bronzers used in salon settings.", best: ["Mineral powder pathway", "Oilier skin"], less: ["Dry skin without hydrating prep"], examples: ["Natural Loose Mineral Foundation", "Pressed Mineral Bronzer"], filters: ["mineral"] , tier: "prestige", earns: "Pro mineral for oilier skin.", loses: "Dry skin without hydrating prep."},
  { name: "Mineral Fusion", family: "Mineral", lane: "Pharmacy mineral", note: "Widely available mineral formulas — the accessible mineral entry point.", best: ["Lean budget with mineral filter"], less: ["Shade-precision liquid match"], examples: ["Pressed Powder Foundation", "Sheer Tint Base"], filters: ["mineral", "vegan"] , tier: "drugstore", earns: "Pharmacy mineral entry.", loses: "Shade-precision liquid match."},
  { name: "Sappho New Paradigm", family: "Botanical", also: "Skin tint", lane: "Pro botanical", note: "Film-industry-adjacent botanical complexion built for close-up light.", best: ["On-camera botanical base", "Medium coverage without powder"], less: ["Ultra-sheer no-base days"], examples: ["Essential Foundation", "New Light Concealer"], filters: ["vegan"] , tier: "prestige", earns: "Close-up botanical medium base.", loses: "Ultra-sheer no-base days."},
  { name: "Elate Cosmetics", family: "Botanical", lane: "Refillable botanical", note: "Bamboo-refill palettes and pencils for a low-waste definition kit.", best: ["Brow and eye definition", "Refill preference"], less: ["High-coverage base"], examples: ["Brow Pencil", "Lip Liner", "Pressed Blush"], filters: ["vegan"] , tier: "mid", earns: "Refillable definition kit.", loses: "High-coverage base."},
  { name: "NUDESTIX", family: "Multi-use", lane: "Pencil multi-use", note: "Everything in pencil format — the fastest definition lane there is.", best: ["Five-minute routines", "Eye and lip in one object"], less: ["Sheer liquid base preference"], examples: ["Magnetic Eye Pencil", "Nudies Matte Blush + Bronze"], filters: ["vegan"] , tier: "mid", earns: "Pencil multi-use speed.", loses: "Sheer liquid base preference."},
  { name: "Trèstique", family: "Multi-use", lane: "Travel multi-use", note: "Dual-ended sticks with the tool attached — built for a carry-on ceiling.", best: ["Travel capsules", "Tool-free application"], less: ["Precision liquid work"], examples: ["Cream Blush Stick", "Brow Pencil"], filters: ["vegan"] , tier: "mid", earns: "Travel dual-ended sticks.", loses: "Precision liquid work."},
  { name: "Honest Beauty", family: "Sensitive", lane: "Accessible sensitive", note: "Fragrance-cautious everyday colour at pharmacy access.", best: ["Fragrance-free filters", "Lean budget"], less: ["Long-wear event performance"], examples: ["Tinted Lip Balm", "Everything Cream Blush"], filters: ["fragranceFree", "vegan"] , tier: "drugstore", earns: "Fragrance-cautious pharmacy colour.", loses: "Long-wear event performance."},
  { name: "Beautycounter", family: "Skin tint", also: "Sensitive", lane: "Screened complexion", note: "Ingredient-screened complexion with a full base-to-colour range.", best: ["Light-to-medium base", "Screened-formula preference"], less: ["Mineral-pigment-only filters"], examples: ["Skin Twin Featherweight Foundation", "Cheeky Clean Cream Blush"], filters: ["vegan"] , tier: "prestige", earns: "Screened light-to-medium complexion.", loses: "Mineral-pigment-only filters."},
  { name: "Lawless Beauty", family: "Multi-use", lane: "Clean glam", note: "Clean formulas aimed at definition and longevity rather than sheerness.", best: ["Event definition", "Liner and lip longevity"], less: ["Wear-less and no-base goals"], examples: ["Smokey Liner", "Forget the Filler Lip Plumper"], filters: ["vegan"] , tier: "prestige", earns: "Clean definition and longevity.", loses: "Wear-less and no-base goals."},

  /* ── Beyond North America. Region is availability, not a quality ranking. ── */
  { name: "Laneige", family: "Skin tint", lane: "Korean hydration hybrid", region: "Korea", availability: "Wide Western retail; Korean line is broader than the export line.", note: "Water-led hydration under a thin tint — the K-beauty answer to a dry base.", best: ["Dehydrated skin under a thin film", "Cushion architecture done carefully"], less: ["Deep depth bands, where the export shade range runs short"], examples: ["Neo Cushion", "Skin Veil Base", "Lip Sleeping Mask"], filters: [] , tier: "mid", earns: "Water-led thin cushion film.", loses: "Deep depth when export range runs short."},
  { name: "Hera", family: "Skin tint", lane: "Korean cushion luxury", region: "Korea", availability: "Mostly Korean counters and importers.", note: "Cushion compacts with a genuinely thin film; the touch-up habit is the risk, not the formula.", best: ["Portable base with restraint"], less: ["Anyone who re-presses a cushion every two hours"], examples: ["Black Cushion", "Silky Stay Foundation"], filters: [] , tier: "prestige", earns: "Thin luxury cushion with restraint.", loses: "Anyone who re-presses every two hours."},
  { name: "Tirtir", family: "Skin tint", lane: "Extended-shade cushion", region: "Korea", availability: "Global e-commerce; the 30-shade line is the one to look for.", note: "The cushion house that actually extended its depth range rather than adding two deep shades.", best: ["Deep and deep-neutral bands", "Cushion coverage without a heavy film"], less: ["Silicone-averse kits"], examples: ["Mask Fit Red Cushion"], filters: [] , tier: "mid", earns: "Extended-shade cushion for deep bands.", loses: "Silicone-averse kits."},
  { name: "Shiseido", family: "Hybrid SPF", also: "Skin tint", lane: "Japanese SPF and base", region: "Japan", availability: "Global counters; Japanese domestic line differs from the export line.", note: "SPF-first bases with a technical, unromantic approach to wear.", best: ["Outdoors and high UV", "Synchro Skin thin bases"], less: ["Fragrance-free as a hard rule"], examples: ["Synchro Skin Radiant Lifting Foundation", "Clear Sunscreen Stick"], filters: [] , tier: "prestige", earns: "Technical SPF-first bases.", loses: "Fragrance-free as a hard rule."},
  { name: "Suqqu", family: "Multi-use", lane: "Japanese cream colour", region: "Japan", availability: "Japan and UK counters; scarce elsewhere.", note: "Cream blush and balm colour with the softest edge on the desk. Expensive, and the finish shows why.", best: ["Cream colour that reads as circulation"], less: ["Lean budget"], examples: ["Melting Powder Blush", "The Cream Foundation"], filters: [] , tier: "luxury", earns: "Japanese cream colour soft edge.", loses: "Lean budget."},
  { name: "Canmake", family: "Multi-use", lane: "Japanese pharmacy colour", region: "Japan", availability: "Japanese pharmacy pricing; easy to import.", note: "The cheapest credible cream colour lane there is.", best: ["Lean budget capsule colour"], less: ["Deep depth base matching"], examples: ["Cream Cheek", "Stay-On Balm Rouge"], filters: [] , tier: "drugstore", earns: "Pharmacy cream colour that actually works.", loses: "Deep depth base matching."},
  { name: "Kay Beauty", family: "Multi-use", lane: "Indian everyday colour", region: "India", availability: "Nykaa and Indian retail.", note: "Built for Indian depth and undertone bands rather than adapted to them afterwards.", best: ["Olive and golden-olive undertones", "Medium to deep bands"], less: ["Ultra-sheer no-base days"], examples: ["Hydrating Foundation", "Lip Crayon", "Blurring Setting Powder"], filters: ["vegan"] , tier: "mid", earns: "Built for Indian olive and deep bands.", loses: "Ultra-sheer no-base days."},
  { name: "Forest Essentials", family: "Botanical", lane: "Ayurvedic prep and tint", region: "India", availability: "Indian retail and global e-commerce.", note: "Prep-led house; the hydration step that stops cake before makeup starts.", best: ["Hydrating prep in dry heat"], less: ["Colour pay-off as the goal"], examples: ["Facial Ubtan", "Tinted Lip Balm"], filters: [] , tier: "mid", earns: "Prep-led hydration in dry heat.", loses: "Colour pay-off as the goal."},
  { name: "Juicy Chemistry", family: "Sensitive", also: "Botanical", lane: "Organic Indian minimal", region: "India", availability: "Indian retail; ships internationally.", note: "Short-list organic formulas for reactive skin in humid heat.", best: ["Sensitive-aware, humid climate"], less: ["Full-coverage base"], examples: ["Lip and Cheek Tint", "Mineral Sunscreen"], filters: ["fragranceFree", "vegan"] , tier: "mid", earns: "Short-list organic for humid heat reactivity.", loses: "Full-coverage base."},
  { name: "Zaron Cosmetics", family: "Multi-use", lane: "West African complexion", region: "West Africa", availability: "Nigerian and West African retail; regional shipping.", note: "Deep and red-leaning bands treated as the centre of the range, not the edge of it.", best: ["Deep, deep-neutral and red-leaning undertones", "Humid heat wear"], less: ["Very fair bands"], examples: ["Fluid Foundation", "Sheer Tint Moisturiser", "Powder Foundation"], filters: [] , tier: "mid", earns: "Deep and red-leaning as the centre of range.", loses: "Very fair bands."},
  { name: "House of Tara", family: "Multi-use", lane: "Nigerian colour house", region: "West Africa", availability: "Nigerian retail and salons.", note: "Colour built for deep skin in strong daylight — pigment load is high, so a light hand matters.", best: ["Deep bands", "Event definition"], less: ["Sheer minimal architecture"], examples: ["Foundation Stick", "Lipstick", "Brow Pomade"], filters: [] , tier: "mid", earns: "Deep-band colour for strong daylight.", loses: "Sheer minimal architecture."},
  { name: "Huda Beauty", family: "Multi-use", lane: "Gulf glam engineering", region: "Middle East", availability: "Global retail; the range was designed around Gulf wear expectations.", note: "Longevity-first formulas. Useful for events, dangerous as a daily base.", best: ["Event and on-camera longevity", "Deep shade coverage"], less: ["Anti-pancake everyday architecture"], examples: ["Faux Filter Skin Tint", "Easy Blur Powder"], filters: [] , tier: "prestige", earns: "Event longevity and deep shade coverage.", loses: "Anti-pancake everyday as the only goal — use the skin tint, not the full glam stack."},
  { name: "Ghawali", family: "Multi-use", lane: "Middle Eastern heritage colour", region: "Middle East", availability: "Gulf retail.", note: "Oud-adjacent house; colour and lip lanes rather than complexion architecture.", best: ["Lip and eye definition"], less: ["Fragrance-free filters"], examples: ["Lipstick", "Kohl"], filters: [] , tier: "prestige", earns: "Lip and kohl definition heritage.", loses: "Fragrance-free filters."},
  { name: "Océane", family: "Multi-use", lane: "Brazilian everyday colour", region: "Brazil", availability: "Brazilian retail.", note: "Humid-climate colour that holds without a powder stack.", best: ["Humid heat", "Cream colour that stains"], less: ["Dry cold climates"], examples: ["Lip Tint", "Cream Blush"], filters: [] , tier: "drugstore", earns: "Humid-climate stain colour.", loses: "Dry cold climates."},
  { name: "Quem Disse, Berenice?", family: "Multi-use", lane: "Brazilian accessible base", region: "Brazil", availability: "Boticário group retail across Brazil.", note: "Broad depth coverage at pharmacy pricing, built for a hot country.", best: ["Lean budget", "Medium to deep bands in humidity"], less: ["Import-free access outside Brazil"], examples: ["Match Base", "Lip Balm Tint"], filters: [] , tier: "drugstore", earns: "Broad depth at pharmacy pricing for heat.", loses: "Import-free access outside Brazil."},
  { name: "Vive Cosmetics", family: "Multi-use", lane: "Latina-founded colour", region: "Latin America", availability: "US and Latin American e-commerce.", note: "Lip-led house; the finish signal without any complexion cost.", best: ["Lip as the whole look"], less: ["Base architecture"], examples: ["Liquid Lipstick", "Lip Gloss"], filters: ["vegan"] , tier: "mid", earns: "Lip-led finish, no complexion cost.", loses: "Base architecture."},
  { name: "Natura", family: "Botanical", lane: "Brazilian botanical", region: "Brazil", availability: "Latin America and Europe.", note: "Biodiversity-sourced botanical colour and prep at scale.", best: ["Botanical preference with real availability"], less: ["Mineral-pigment-only filters"], examples: ["Una Foundation", "Chronos Prep"], filters: ["vegan"] , tier: "mid", earns: "Botanical at scale with real availability.", loses: "Mineral-pigment-only filters."},
  { name: "Lisa Eldridge Beauty", family: "Multi-use", lane: "British cream colour", region: "United Kingdom", availability: "UK-led, ships internationally.", note: "Cream and gloss formulas from a working artist — restrained by design.", best: ["Cream colour", "Lip lane"], less: ["Full-coverage base"], examples: ["Elevated Glow", "Gloss Embrace"], filters: [] , tier: "prestige", earns: "Artist-restrained cream and gloss.", loses: "Full-coverage base."},
  { name: "Trinny London", family: "Skin tint", lane: "British stackable capsule", region: "United Kingdom", availability: "UK, EU, US e-commerce.", note: "Stackable pots designed around a ceiling — the format is the argument.", best: ["Complexity ceilings", "Travel capsules"], less: ["Palette-led glam"], examples: ["BFF Skin Tint SPF 30", "Lip2Cheek"], filters: [] , tier: "prestige", earns: "Stackable pots designed around a ceiling.", loses: "Palette-led glam."},
  { name: "Dr. Hauschka", family: "Botanical", also: "Sensitive", lane: "German biodynamic", region: "Europe", availability: "European pharmacies and health retail.", note: "Biodynamic house with a long sensitive-skin record; sheer by temperament.", best: ["Sensitive-aware botanical"], less: ["High coverage"], examples: ["Tinted Day Cream", "Lipstick"], filters: ["fragranceFree"] , tier: "prestige", earns: "Biodynamic sheer sensitive record.", loses: "High coverage."},
  { name: "Lavera", family: "Mineral", also: "Botanical", lane: "German accessible natural", region: "Europe", availability: "European pharmacy pricing.", note: "Certified natural colour at a real-world price across the EU.", best: ["Lean budget with natural filters"], less: ["Wide deep shade ranges"], examples: ["Natural Liquid Foundation", "Beautiful Mineral Eyeshadow"], filters: ["mineral", "vegan"] , tier: "drugstore", earns: "Certified natural at EU pharmacy pricing.", loses: "Wide deep shade ranges."},
  { name: "Kiko Milano", family: "Multi-use", lane: "Italian accessible colour", region: "Europe", availability: "European high street.", note: "Fast, cheap, competent colour — the European capsule filler.", best: ["Lean budget colour and liner"], less: ["Sensitive-aware fragrance filters"], examples: ["Unlimited Stylo", "Radiant Fusion Baked Powder"], filters: [] , tier: "drugstore", earns: "Fast competent European high-street colour.", loses: "Sensitive fragrance filters."},
  { name: "Frank Body", family: "Multi-use", lane: "Australian minimal colour", region: "Australia", availability: "Australian retail; global shipping.", note: "Plainspoken formulas with no ceremony attached.", best: ["Simplify goals"], less: ["Event definition"], examples: ["Lip Balm", "Cheek Tint"], filters: ["vegan"] , tier: "drugstore", earns: "Plainspoken minimal colour.", loses: "Event definition."},

  /* ── Drugstore through luxury: expanded across price tiers ── */
  { name: "e.l.f. Cosmetics", family: "Multi-use", also: "Skin tint", lane: "Drugstore capsule architecture", tier: "drugstore", note: "The serious drugstore desk: multi-sticks, skin tints and camo coverage at prices that forgive experiment. Architecture over cake still applies — cheap full coverage cakes the same as expensive full coverage.", best: ["Lean budget capsules", "Trying a type before going prestige", "Multi-stick everyday"], less: ["Fragrance-sensitive without a label check", "Expecting prestige texture in every SKU"], examples: ["Camo Hydrating Multi-Stick", "Halo Glow Skin Tint", "Camo Concealer (placed, not full face)"], filters: ["vegan"], earns: "Type exploration and multi-use objects under $20.", loses: "Using every matte full-coverage SKU as a daily stack." },
  { name: "NYX Professional Makeup", family: "Multi-use", lane: "Drugstore colour laboratory", tier: "drugstore", note: "Pro-adjacent colour and correctors at pharmacy pricing. Green correctors and bare skin veils live here honestly.", best: ["Colour correction on a budget", "Lip and liner definition", "Experimenting with undertone"], less: ["Sensitive fragrance-hard filters without checking"], examples: ["Bare With Me Tinted Skin Veil", "Color Correcting Concealer", "This Is Milky Gloss"], filters: ["vegan"], earns: "Correctors and tints that teach placement before you spend prestige money.", loses: "Building a twelve-step glam kit just because the aisle is long." },
  { name: "Maybelline", family: "Skin tint", lane: "Pharmacy skin tint & mascara", tier: "drugstore", note: "Skin tints and mascara that actually reach people. Super Stay Skin Tint is the anti-pancake entry for anyone who was sold fit me as destiny.", best: ["Lean budget sheer base", "Mascara as the awake signal", "Wide retail access"], less: ["Deep olive fine-tuning on every SKU", "Fragrance-free hard rule"], examples: ["Super Stay Skin Tint", "Instant Age Rewind Concealer (placed)", "Lash Sensational"], filters: [], earns: "Accessible sheer base and one great mascara.", loses: "Full-face Fit Me cake as a default personality." },
  { name: "L'Oréal Paris", family: "Skin tint", also: "Hybrid SPF", lane: "Pharmacy hybrid base", tier: "drugstore", note: "True Match and skin tints with real shade counts in many markets. Pharmacy prestige without the counter pressure.", best: ["Broader shade maps at drugstore", "Everyday light-medium"], less: ["Strict clean-filter shopping", "Altitude dry without prep"], examples: ["True Match Nude Hyaluronic Tint", "True Match Super-Blendable"], filters: [], earns: "Shade access and hybrid tints under prestige money.", loses: "Paying attention only to the densest SKUs in the line." },
  { name: "Catrice", family: "Multi-use", lane: "European drugstore colour", tier: "drugstore", region: "Europe", availability: "European drugstores; online export common.", note: "EU pharmacy colour with competent HD powders used lightly. The light hand is the whole product.", best: ["Lean budget in Europe", "Soft powder used strategically"], less: ["Deep-range specialists"], examples: ["HD Perfect Finish Powder (two panels only)", "Cheek Flirt Blush"], filters: ["vegan"], earns: "Cheap strategic powder and blush.", loses: "Full-face powder as a personality." },
  { name: "Essence", family: "Multi-use", lane: "Ultra-accessible European colour", tier: "drugstore", region: "Europe", note: "The lowest-cost credible colour lane in many EU markets. Perfect for proving a type before upgrading.", best: ["Teen and first kits", "Proving multi-use logic cheaply"], less: ["Long-wear event contracts"], examples: ["Baby Got Blush", "Lash Princess (awake signal)"], filters: ["vegan"], earns: "Permission to learn without sunk cost.", loses: "Expecting luxury cream textures." },
  { name: "Milani", family: "Multi-use", lane: "Drugstore cream & powder colour", tier: "drugstore", note: "Cream cheek colour and setting sprays that punch above price. A mid-aisle answer to cream architecture.", best: ["Cream blush on a lean budget", "Flexible setting mist"], less: ["Fragrance-free hard filters"], examples: ["Cheek Kiss Cream Blush", "Make It Last Setting Spray"], filters: ["vegan"], earns: "Cream colour without prestige tax.", loses: "Stacking every powder bronzer on dry skin." },
  { name: "Wet n Wild", family: "Multi-use", lane: "Ultra-lean colour and primer", tier: "drugstore", note: "Almost free experiments in colour and thin primers. Use to test desire, not to build opacity.", best: ["Colour play under $10", "Testing undertone with lip"], less: ["Sensitive-reactive hard filters", "Base architecture"], examples: ["MegaGlo Highlighting Stick (sheer)", "Photo Focus foundation only if sheered hard"], filters: ["vegan"], earns: "Risk-free undertone and colour experiments.", loses: "Full-face Photo Focus as daily cake." },
  { name: "The Ordinary", family: "Sensitive", also: "Botanical", lane: "Actives desk — not a base house", tier: "drugstore", note: "On the desk as claim-literacy context: named, dosed actives belong in skincare, not as an excuse for thicker makeup. Serum first, tint second.", best: ["Separating treatment dose from makeup film", "Prep under sheer base"], less: ["Anyone hunting a foundation range here"], examples: ["Niacinamide 10% (under makeup, not instead of architecture)", "Hyaluronic Acid 2% before tint"], filters: [], earns: "Honest doses that make hybrid makeup claims look thin.", loses: "Using actives as a reason to buy opaque 'treatment foundation'." },
  { name: "CeraVe", family: "Sensitive", lane: "Derm-accessible prep", tier: "drugstore", note: "Fragrance-aware moisturisers and the occasional tinted fluid — prep that keeps films honest on reactive and dry skin.", best: ["Fragrance-cautious prep", "Barrier-support under sheer base"], less: ["Colour pay-off"], examples: ["Hydrating Mineral Sunscreen", "PM Lotion under tint"], filters: ["fragranceFree"], earns: "Prep that prevents cake before makeup starts.", loses: "Expecting a full complexion wardrobe." },
  { name: "Neutrogena", family: "Hybrid SPF", also: "Sensitive", lane: "Pharmacy SPF hybrid", tier: "drugstore", note: "Hydro Boost and clear SPF filters widely available. The claim-literacy house for 'SPF in everything' — still reapply.", best: ["Accessible mineral and hybrid SPF", "Everyday UV under light tint"], less: ["Luxury texture", "Deep shade maps in every tinted SPF"], examples: ["Purescreen Mineral UV Tint", "Hydro Boost Water Gel (prep)"], filters: ["fragranceFree"], earns: "UV strategy at pharmacy prices.", loses: "Counting a sheer tinted SPF as beach cover without reapply." },
  { name: "Glossier", family: "Skin tint", also: "Multi-use", lane: "Skin-first millennial tint", tier: "mid", note: "Skin Tint and Cloud Paint taught a generation that sheerness is a feature. Short base ranges are the known limit.", best: ["Sheer everyday", "Cream colour clouds"], less: ["Deep bands needing wide maps", "Full coverage events"], examples: ["Skin Tint", "Cloud Paint", "Boy Brow"], filters: [], earns: "Permission to be sheer in public.", loses: "Forcing Skin Tint to do foundation work it refused in the lab." },
  { name: "Rare Beauty", family: "Multi-use", lane: "Soft-matte liquid colour", tier: "mid", note: "Liquid blush that survives a room and a mask. Soft Pinch is the longevity argument without base weight.", best: ["Long-wear cream-liquid colour", "Minimal base + strong flush"], less: ["Dry under-eyes wanting only balm"], examples: ["Soft Pinch Liquid Blush", "Positive Light under-eye (sheer)"], filters: ["vegan"], earns: "Colour longevity without a powder face.", loses: "Layering half the range into a full glam stack daily." },
  { name: "Fenty Beauty", family: "Skin tint", also: "Multi-use", lane: "Depth-first complexion", tier: "prestige", note: "The house that made 40-shade maps non-negotiable. Soft Matte and Eaze Drop teach match-first architecture for deep and olive bands.", best: ["Deep and deep-neutral bands", "Undertone-honest matching", "Event with a thin film"], less: ["Wear-less no-base purists", "Fragrance-free hard rule on every SKU"], examples: ["Eaze Drop Blurring Skin Tint", "Pro Filt'r Soft Matte (sheered)", "Match Stix"], filters: [], earns: "Shade democracy and match-first logic.", loses: "Defaulting to the densest Pro Filt'r finish every weekday." },
  { name: "NARS", family: "Multi-use", also: "Skin tint", lane: "Artist colour + light base", tier: "prestige", note: "Orgasm taught cream-powder colour culture; Light Reflecting and soft mattes can stay thin if you refuse the full-coverage reflex.", best: ["Cream and powder colour literacy", "Light-reflecting thin bases"], less: ["Strict mineral-only"], examples: ["Light Reflecting Foundation (sheer pass)", "Afterglow liquid blush", "Radiant Creamy Concealer (placed)"], filters: [], earns: "Colour education and placed concealer excellence.", loses: "Full-coverage NARS as identity." },
  { name: "Charlotte Tilbury", family: "Skin tint", also: "Multi-use", lane: "Hollywood soft-focus prestige", tier: "prestige", note: "Beautiful Control and Hollywood Flawless Filter are optical tools — diffusion and light, not cake — when kept to one film.", best: ["HD soft-focus", "Photography-adjacent glow as a single plane"], less: ["Lean budget", "Anti-sparkle minimalists"], examples: ["Beautiful Skin Foundation (light)", "Hollywood Flawless Filter (one plane)", "Pillow Talk lip"], filters: [], earns: "Optical glow for camera without a second base.", loses: "Filter + foundation + powder + setting spray as a weekday stack." },
  { name: "Armani Beauty", family: "Skin tint", lane: "Luxury fluid luminous", tier: "luxury", note: "Luminous Silk remains the reference for medium coverage that still moves. Price is the point; so is not needing a second base on top.", best: ["Open budget luminous medium", "Event film that still flexes"], less: ["Lean budget", "Matte oily all-day without blot"], examples: ["Luminous Silk Foundation", "Luminous Silk Concealer"], filters: [], earns: "One excellent fluid film.", loses: "Buying the whole wardrobe because the bottle is glass." },
  { name: "Dior", family: "Skin tint", also: "Hybrid SPF", lane: "Luxury couture base", tier: "luxury", note: "Backstage and Forever lines split into thin workhorse versus long-wear. Backstage Face & Body is the anti-pancake Dior.", best: ["Sheer buildable body-and-face tints", "Runway-honest thin films"], less: ["Fragrance-sensitive hard filters", "Lean budget"], examples: ["Backstage Face & Body Foundation", "Forever Skin Glow (light)"], filters: [], earns: "Sheer couture that still photographs.", loses: "Forever full-coverage cake as daily armour." },
  { name: "Chanel", family: "Skin tint", lane: "Luxury restrained complexion", tier: "luxury", note: "Les Beiges and water-fresh tints for the customer who wants less product, not less standard. Restraint is the flex.", best: ["Sheer luxury tint", "Cream colour restrained"], less: ["Full glam opacity", "Lean budget"], examples: ["Les Beiges Water-Fresh Tint", "Les Beiges Healthy Glow"], filters: [], earns: "Quiet luxury sheerness.", loses: "Treating the counter as a full-coverage commission." },
  { name: "Pat McGrath Labs", family: "Multi-use", lane: "Sublime skin + goddess colour", tier: "luxury", note: "Skin Fetish and Divine Blush can be skin-like; the mothership palettes are desire spend done right — eye and lip, not base weight.", best: ["Desire on eyes and lip", "Sublime skin thin base"], less: ["Minimalist ceiling of three", "Lean budget"], examples: ["Skin Fetish Sublime Perfection (sheer)", "Divine Blush", "LiquiLUST lip"], filters: [], earns: "Desire spent on definition, not opacity.", loses: "Building a cake base to 'support' the palette." },
  { name: "Laura Mercier", family: "Multi-use", also: "Skin tint", lane: "Soft-focus setting literacy", tier: "prestige", note: "Translucent Setting Powder taught the industry strategic set — and also taught cake when used full-face. Two panels only.", best: ["Strategic powder knowledge", "Tinted moisturiser lane"], less: ["Dry altitude full-face powder"], examples: ["Tinted Moisturizer Natural Skin Perfector", "Translucent Loose Setting Powder (T-zone)"], filters: [], earns: "The correct powder lesson — placement.", loses: "The incorrect powder lesson — the whole face, twice." },
  { name: "MAC", family: "Multi-use", lane: "Pro colour democracy", tier: "prestige", note: "Studio Skin and Face and Body for thin films; lip and eye for desire. The pro counter that still sells sheerness if you ask.", best: ["Pro colour matching", "Face and Body sheer coverage", "Lip as the look"], less: ["Fragrance-free hard filters on many SKUs"], examples: ["Face and Body Foundation", "Studio Fix (used as spot, not mask)", "Retro Matte lip"], filters: [], earns: "Pro matching and sheer workhorse bases.", loses: "Studio Fix full-face as the only personality." },
  { name: "Bobbi Brown", family: "Skin tint", also: "Multi-use", lane: "Skin finish education", tier: "prestige", note: "The original skin-finish school. Skin Long-Wear and Vitamin Enriched prep still teach that base starts with skin.", best: ["Skin-first education", "Cream blush and lipstick literacy"], less: ["Ultra-matte filter trends"], examples: ["Skin Long-Wear Weightless Foundation", "Pot Rouge", "Vitamin Enriched Face Base"], filters: [], earns: "The curriculum: skin, then product.", loses: "Ignoring the curriculum for a full matte square." },
  { name: "Make Up For Ever", family: "Multi-use", also: "Skin tint", lane: "HD pro longevity", tier: "prestige", note: "HD and Ultra HD lines are photography tools. Mist and thin application keep them from becoming stage cake under daylight.", best: ["HD photography", "Pro longevity with restraint"], less: ["Everyday anti-pancake minimalists"], examples: ["Ultra HD Skin Booster", "HD Skin Foundation (sheer)", "Artist Color Pencil"], filters: [], earns: "Camera-ready thin films.", loses: "Stage opacity at the grocery store." },
  { name: "Sculpted by Aimee", family: "Multi-use", lane: "Irish cream stick literacy", tier: "mid", region: "United Kingdom", availability: "UK and IE retail; ships EU.", note: "Cream sticks and skin tints popularised for real weather — rain, wind, no vanity van.", best: ["Cream architecture in real weather", "Mid budget sticks"], less: ["Deep-range specialists"], examples: ["Skin Tint", "Cream Luxe Blush"], filters: [], earns: "Weather-honest cream colour.", loses: "Over-applying sticks into a mask." },
  { name: "Uoma Beauty", family: "Skin tint", lane: "Black-owned deep-range complexion", tier: "prestige", note: "Say What?! and Black Magic lines treat deep and deep-neutral as default, not an extension pack.", best: ["Deep and rich-deep bands", "Undertone-specific matching"], less: ["Ultra-sheer balm-only kits"], examples: ["Say What?! Foundation (buildable)", "Black Magic Concealer", "Disco Queen highlight (one plane)"], filters: ["vegan"], earns: "Deep-band dignity in shade maps.", loses: "Full coverage every day because the range finally exists." },
  { name: "Mented Cosmetics", family: "Multi-use", lane: "Nude-for-deep lip & face", tier: "mid", note: "Nudes that are actually nude on deep skin. Lip-led architecture that does not require a beige mask.", best: ["Deep-band lip nudes", "Minimal base + honest lip"], less: ["Very fair shade needs"], examples: ["Skin by Mented foundation (buildable)", "Nude lipsticks across deep nudes"], filters: ["vegan"], earns: "Nudes that do not ash out.", loses: "Skipping match work because the brand 'is for deep skin' — still swatch." },
  { name: "Sunnies Face", family: "Skin tint", lane: "Southeast Asian heat tints", tier: "mid", region: "Australia", availability: "PH and SEA retail; some AU/US online.", note: "Built for heat and humidity with thin tints and lip oils. Sebum-city cousins.", best: ["Humid heat", "Thin base + lip oil finish"], less: ["Dry altitude without prep"], examples: ["Skin Soak tint", "Fluffmatte lip"], filters: [], earns: "Heat-honest thin films.", loses: "Importing full-coverage habits into a heat-built line." },

];

export const FAMILIES = ["Mineral", "Hybrid SPF", "Skin tint", "Botanical", "Multi-use", "Sensitive"] as const;