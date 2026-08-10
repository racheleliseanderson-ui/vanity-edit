import type { FilterKey } from "./types";
import { TYPE_MAP } from "./catalog";

/** A named, finished formula on the desk. Education only — never a safety ranking. */
export interface DeskProduct {
  id: string;
  brand: string;
  name: string;
  typeId: string;          // maps into TYPES
  price: number;           // approximate USD, for banding only
  shades?: number;
  note: string;
  filters: FilterKey[];
}

const P = (
  brand: string,
  name: string,
  typeId: string,
  price: number,
  note: string,
  filters: FilterKey[] = [],
  shades?: number,
): DeskProduct => ({
  id: `${brand}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  brand,
  name,
  typeId,
  price,
  note,
  filters,
  ...(shades ? { shades } : {}),
});

export const PRODUCTS: DeskProduct[] = [
  /* ── Serum tints and hybrid bases ── */
  P("ILIA", "Super Serum Skin Tint SPF 40", "skin-tint", 54, "Tint, SPF and serum in one film — the default anti-pancake base.", ["vegan"], 30),
  P("Saie", "Slip Tint Dewy Tinted Moisturizer SPF 35", "skin-tint", 38, "Wettest of the tints; excellent on dehydrated skin, needs blotting on oily.", ["vegan"], 20),
  P("Kosas", "BB Burst Tinted Gel Cream", "tinted-moisturiser", 38, "Gel-cream that reads as skincare, not base.", ["vegan"], 20),
  P("Beautycounter", "Skin Twin Featherweight Foundation", "light-foundation", 46, "Light-to-medium with a matte-satin dry-down.", ["vegan"], 24),
  P("Chantecaille", "Just Skin Tinted Moisturizer", "tinted-moisturiser", 82, "Genuinely sheer luxury film for dry or mature skin.", [], 8),
  P("Hourglass", "Veil Hydrating Skin Tint", "blur-balm", 58, "Optical blur before opacity — kind to visible texture.", ["vegan"], 18),
  P("Jones Road", "What The Foundation", "tinted-moisturiser", 46, "Balm-textured tint; press, do not sweep.", [], 18),
  P("ILIA", "True Skin Serum Foundation", "serum-foundation", 54, "Medium coverage that still moves with the face.", ["vegan"], 30),
  P("Merit", "The Minimalist Perfecting Complexion Foundation", "light-foundation", 38, "Squeeze-tube stick hybrid built for a short kit.", ["vegan", "fragranceFree"], 20),
  P("Ogee", "Complexion Perfecting Serum Foundation", "serum-foundation", 62, "Organic serum base — sheerable to a tint.", ["vegan"], 12),
  P("Fitglow Beauty", "Foundation +", "serum-foundation", 62, "Plant-based medium base with a soft-focus finish.", ["vegan"], 12),
  P("Sappho New Paradigm", "Essential Foundation", "serum-foundation", 48, "Built for close-up light; medium without powder.", ["vegan"], 16),
  P("Ere Perez", "Oat Milk Foundation", "light-foundation", 46, "Breathable botanical light coverage.", ["vegan"], 12),
  P("Kjaer Weis", "The Beautiful Tint", "skin-tint", 58, "Refillable organic tint, sheer by design.", [], 12),
  P("W3LL PEOPLE", "Bio Tint Multi-Action Moisturizer SPF 30", "tinted-spf", 32, "Mineral-leaning tint with the SPF built in.", ["mineral", "vegan"], 8),
  P("Rose Inc", "Skin Enhance Luminous Tinted Serum", "skin-tint", 49, "Luminous film that photographs softly.", ["vegan"], 20),
  P("100% PURE", "Fruit Pigmented Healthy Foundation", "light-foundation", 45, "Fruit pigment, medium — apply thin or it reads as base.", ["vegan"], 12),
  P("Jane Iredale", "Glow Time Pro BB Cream", "full-foundation", 58, "The desk's densest recommendation; only ever pressed, never layered.", ["mineral"], 18),
  P("Glo Skin Beauty", "C-Shield Moisture Tint SPF 30", "tinted-moisturiser", 52, "Pro-counter hydrating tint with UV built in.", [], 8),

  /* ── Sticks and multi-use base ── */
  P("Merit", "The Complexion Stick", "multi-stick", 38, "Base and contour from one object — capsule cornerstone.", ["vegan", "fragranceFree"], 20),
  P("Ogee", "Sculpted Complexion Stick", "multi-stick", 58, "Organic stick that presses in with fingers alone.", ["vegan"], 12),
  P("Vapour Beauty", "Soft Focus Foundation Stick", "multi-stick", 45, "Cream stick with a diffused, not matte, finish.", ["vegan"], 14),
  P("Glo Skin Beauty", "HD Mineral Foundation Stick", "multi-stick", 44, "Mineral stick for buildable placement.", ["mineral"], 12),
  P("Jones Road", "Miracle Balm", "blur-balm", 42, "Removes blush, bronzer and highlighter from the kit at once.", [], 10),

  /* ── Mineral and powder bases ── */
  P("bareMinerals", "Original Loose Powder Foundation SPF 15", "mineral-powder", 37, "The classic — light passes only, never buffed to opacity.", ["mineral"], 30),
  P("Alima Pure", "Satin Matte Foundation", "mineral-powder", 34, "Short ingredient list, genuinely buildable.", ["mineral", "fragranceFree", "vegan"], 40),
  P("Lily Lolo", "Mineral Foundation SPF 15", "mineral-powder", 28, "Accessible mineral entry point.", ["mineral", "vegan"], 20),
  P("INIKA Organic", "Loose Mineral Foundation SPF 25", "mineral-powder", 45, "Certified organic mineral pigment.", ["mineral", "vegan"], 8),
  P("Youngblood", "Natural Loose Mineral Foundation", "mineral-powder", 44, "Pro mineral powder for oilier skin.", ["mineral"], 14),
  P("Jane Iredale", "PurePressed Base Mineral Foundation SPF 20", "pressed-powder", 48, "Pressed mineral — portable, and that is the risk.", ["mineral"], 24),
  P("Mineral Fusion", "Pressed Powder Foundation", "pressed-powder", 30, "Pharmacy-accessible mineral pressed base.", ["mineral", "vegan"], 8),
  P("bareMinerals", "Mineral Veil Finishing Powder", "setting-powder", 28, "Set the two panels that move, not the face.", ["mineral"]),
  P("Kosas", "Cloud Set Setting Powder", "setting-powder", 34, "Blurs without a chalk cast on camera.", ["vegan"]),
  P("Saie", "Airset Radiant Loose Setting Powder", "setting-powder", 32, "Radiant rather than matte — powder that does not read dry.", ["vegan"]),
  P("Hourglass", "Veil Translucent Setting Powder", "setting-powder", 48, "Very fine; a single pass is the whole instruction.", ["vegan"]),
  P("Zao Organic", "Mineral Cooked Powder", "setting-powder", 34, "Refillable bamboo compact.", ["mineral", "vegan"]),

  /* ── SPF ── */
  P("Colorescience", "Flex SPF 50 Tinted Foundation Stick", "tinted-spf", 52, "SPF-first tint for altitude and outdoor days.", ["mineral"], 8),
  P("EltaMD", "UV Elements Tinted Moisturizer SPF 44", "tinted-spf", 43, "Derm-adjacent tinted mineral SPF.", ["mineral", "fragranceFree"], 1),
  P("Supergoop!", "CC Screen 100% Mineral CC Cream SPF 50", "tinted-spf", 46, "Highest coverage of the SPF hybrids.", ["mineral"], 15),
  P("EltaMD", "UV Clear Broad-Spectrum SPF 46", "mineral-spf", 44, "UV strategy kept entirely separate from colour.", ["fragranceFree"]),
  P("Coola", "Mineral Face Matte Tint SPF 30", "tinted-spf", 36, "Outdoor-first, matte-leaning tinted mineral.", ["mineral", "vegan"], 4),
  P("Odacité", "SPF 50 Flex-Perfecting Mineral Sunscreen", "mineral-spf", 44, "Prep-and-protect step before any base decision.", ["vegan"]),

  /* ── Concealers and correctors ── */
  P("Kosas", "Revealer Super Creamy + Brightening Concealer", "brightening-concealer", 32, "Light back into the under-eye with no crease seam.", ["vegan"], 28),
  P("Tower 28", "Swipe Serum Concealer", "strategic-concealer", 22, "Sensitive-aware placed coverage.", ["fragranceFree", "vegan"], 20),
  P("RMS Beauty", "UnCoverup Cream Concealer", "strategic-concealer", 38, "Warm it on the fingertip; it becomes skin.", ["vegan"], 20),
  P("Tower 28", "SOS Daily Rescue Colour Corrector", "colour-corrector", 22, "Neutralises redness before a base is even considered.", ["fragranceFree", "vegan"], 6),
  P("Ere Perez", "Arnica All-Cover Pot", "colour-corrector", 39, "Botanical pot corrector for redness placement.", ["vegan"], 6),
  P("Fitglow Beauty", "Conceal +", "blemish-concealer", 42, "Highest opacity on the smallest possible area.", ["vegan"], 10),
  P("Clove + Hallow", "Conceal + Correct", "blemish-concealer", 24, "Lean-budget spot coverage that holds.", ["vegan", "fragranceFree"], 20),
  P("Rose Inc", "Softlight Hydrating Concealer", "hydrating-corrector", 36, "Peach-toned light for a dry under-eye.", ["vegan"], 20),
  P("Sappho New Paradigm", "New Light Concealer", "hydrating-corrector", 38, "Built for on-camera under-eye work.", ["vegan"], 12),

  /* ── Colour ── */
  P("Saie", "Dew Blush Liquid Cheek Blush", "liquid-blush", 25, "Stain-like colour that survives a warm room.", ["vegan"], 10),
  P("Tower 28", "BeachPlease Lip + Cheek Cream Balm", "lip-cheek-balm", 22, "Two jobs, one object — sensitive-aware.", ["fragranceFree", "vegan"], 12),
  P("Merit", "Flush Balm Cream Blush", "cream-blush", 30, "Cream in a click pen; no brush needed.", ["vegan", "fragranceFree"], 10),
  P("Westman Atelier", "Baby Cheeks Blush Stick", "cream-blush", 52, "Reads as circulation rather than pigment.", [], 8),
  P("Vapour Beauty", "Aura Multi Use Blush", "cream-blush", 38, "Organic stick colour for cheek and lid.", ["vegan"], 8),
  P("Honest Beauty", "Everything Cream Blush", "cream-blush", 20, "Accessible fragrance-cautious cream colour.", ["fragranceFree", "vegan"], 6),
  P("Saie", "Main Character Soft Matte Blush", "powder-blush", 28, "Powder colour for powder-set days.", ["vegan"], 8),
  P("Elate Cosmetics", "Pressed Blush", "powder-blush", 30, "Bamboo refill palette colour.", ["vegan"], 8),
  P("Ogee", "Sculpted Face Stick", "cream-bronzer", 58, "Warmth as a plane, not a stripe.", ["vegan"], 6),
  P("Westman Atelier", "Beauty Butter Powder Bronzer", "powder-bronzer", 75, "Powder that behaves like a cream.", [], 4),
  P("Youngblood", "Pressed Mineral Bronzer", "powder-bronzer", 42, "Mineral warmth for oilier skin.", ["mineral"], 5),
  P("Saie", "Glowy Super Gel", "cream-highlighter", 28, "One lit plane instead of overall glow.", ["vegan"], 6),
  P("Athr Beauty", "Crystal Highlighter", "powder-highlighter", 34, "Sparkle over powder; reads dry on dry skin.", ["vegan"], 4),
  P("NUDESTIX", "Nudies Matte Blush + Bronze", "cream-bronzer", 36, "Pencil format — the fastest colour lane.", ["vegan"], 8),
  P("Trèstique", "Cream Blush Stick", "cream-blush", 26, "Dual-ended with the tool attached, built for travel.", ["vegan"], 6),

  /* ── Eye ── */
  P("ILIA", "Limitless Lash Mascara", "mascara", 30, "Awake without touching the complexion.", ["vegan"], 2),
  P("Ere Perez", "Avocado Waterproof Mascara", "mascara", 34, "Botanical, holds through heat.", ["vegan"], 1),
  P("ILIA", "Essential Brow Gel", "brow-gel", 26, "Structure for the whole face from one object.", ["vegan"], 6),
  P("Zao Organic", "Eyebrow Pencil", "brow-pencil", 24, "Refillable bamboo brow definition.", ["mineral", "vegan"], 4),
  P("Elate Cosmetics", "Brow Pencil", "brow-pencil", 26, "Fine tip; draws hair, not a shape.", ["vegan"], 4),
  P("NUDESTIX", "Magnetic Eye Colour Pencil", "eyeliner-pencil", 26, "Liner and shadow from one pencil.", ["vegan"], 10),
  P("Lawless Beauty", "Smokey Liner", "eyeliner-pencil", 26, "Longevity at the lash line for event nights.", ["vegan"], 6),
  P("ILIA", "Liquid Powder Eye Tint", "shadow-stick", 34, "Definition in one swipe, no palette.", ["vegan"], 12),
  P("RMS Beauty", "Eye Polish", "shadow-stick", 32, "Cream lid colour that stays sheer.", ["vegan"], 8),
  P("Athr Beauty", "The Rose Quartz Eyeshadow Palette", "shadow-duo", 58, "Gradient control — costs minutes, not layers.", ["vegan"]),
  P("W3LL PEOPLE", "Elitist Eyeshadow", "shadow-duo", 24, "Mineral powder shadow, everyday weight.", ["mineral", "vegan"], 8),

  /* ── Lip ── */
  P("ILIA", "Balmy Tint Hydrating Lip Balm", "tinted-balm", 30, "The lowest-effort finish signal there is.", ["vegan"], 12),
  P("ILIA", "Balmy Gloss Lip Oil", "lip-oil", 30, "Shine and comfort, reapplied constantly.", ["vegan"], 10),
  P("Axiology", "Balmies Lip-to-Lid Crayon", "satin-lipstick", 24, "Zero-waste crayon for lip and cheek.", ["vegan"], 12),
  P("Kjaer Weis", "Lipstick", "satin-lipstick", 56, "Refillable satin; the most visible effort signal on the face.", [], 12),
  P("Vapour Beauty", "Siren Lipstick", "satin-lipstick", 32, "Organic satin with a soft edge.", ["vegan"], 14),
  P("Clove + Hallow", "Liquid Lip Velvet", "lip-stain", 20, "Long-wear stain at a real-world price.", ["vegan", "fragranceFree"], 12),
  P("Elate Cosmetics", "Lip Liner", "lip-liner", 24, "Holds a lip through dinner without a second coat.", ["vegan"], 6),
  P("Zao Organic", "Lip Pencil", "lip-liner", 22, "Bamboo refill definition for the lip lane.", ["mineral", "vegan"], 5),
  P("Honest Beauty", "Tinted Lip Balm", "tinted-balm", 14, "Pharmacy access, fragrance-cautious.", ["fragranceFree", "vegan"], 8),

  /* ── Finish and care ── */
  P("Tatcha", "Aburatorigami Japanese Blotting Papers", "blotting-paper", 14, "Shine control with no added layer — the only free move.", []),
  P("Odacité", "Serum Concentrate", "hydrating-prep", 39, "The anti-cake step that is not makeup.", ["vegan"]),
  P("Coola", "Mineral Silk Crème", "hydrating-prep", 42, "Hydrating prep with UV interest.", ["mineral", "vegan"]),
  P("La Roche-Posay", "Toleriane Sensitive Tinted Fluid", "tinted-moisturiser", 30, "Sensitive-positioned everyday tint.", ["fragranceFree"], 3),
];

export const PRODUCT_BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))].sort();

export const PRICE_BANDS = [
  { id: "under-25", label: "Under $25", test: (n: number) => n < 25 },
  { id: "25-45", label: "$25 – $45", test: (n: number) => n >= 25 && n <= 45 },
  { id: "45-60", label: "$45 – $60", test: (n: number) => n > 45 && n <= 60 },
  { id: "over-60", label: "Over $60", test: (n: number) => n > 60 },
] as const;

export interface ProductQuery {
  q?: string | undefined;
  lanes?: string[] | undefined;
  brands?: string[] | undefined;
  band?: string | undefined;
  filters?: FilterKey[] | undefined;
  maxLayer?: number | undefined;
  typeId?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
}

export function searchProducts(query: ProductQuery): DeskProduct[] {
  const q = (query.q ?? "").trim().toLowerCase();
  const terms = q ? q.split(/\s+/) : [];
  return PRODUCTS.filter((p) => {
    const t = TYPE_MAP[p.typeId];
    const haystack = `${p.brand} ${p.name} ${t?.label ?? ""} ${t?.lane ?? ""} ${t?.job ?? ""} ${p.note}`.toLowerCase();
    if (terms.some((term) => !haystack.includes(term))) return false;
    if (query.lanes?.length && !query.lanes.includes(t?.lane ?? "")) return false;
    if (query.brands?.length && !query.brands.includes(p.brand)) return false;
    if (query.band) {
      const band = PRICE_BANDS.find((b) => b.id === query.band);
      if (band && !band.test(p.price)) return false;
    }
    if (query.minPrice !== undefined && p.price < query.minPrice) return false;
    if (query.maxPrice !== undefined && p.price > query.maxPrice) return false;
    if (query.filters?.length && !query.filters.every((f) => p.filters.includes(f))) return false;
    if (query.maxLayer !== undefined && (t?.layerWeight ?? 0) > query.maxLayer) return false;
    if (query.typeId && p.typeId !== query.typeId) return false;
    return true;
  });
}

/* ─────────── Facets ─────────── */

/** How many results each candidate value would return, with the rest of the query held. */
export function facetCounts<K extends keyof ProductQuery>(
  query: ProductQuery,
  field: K,
  values: string[],
  mode: "replace" | "toggle" = "toggle",
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const v of values) {
    const next: ProductQuery = { ...query };
    if (mode === "toggle") {
      const current = (query[field] as string[] | undefined) ?? [];
      (next[field] as unknown) = current.includes(v) ? current.filter((x) => x !== v) : [...current, v];
    } else {
      (next[field] as unknown) = query[field] === v ? undefined : v;
    }
    out[v] = searchProducts(next).length;
  }
  return out;
}

export const PRICE_EXTENT = {
  min: Math.min(...PRODUCTS.map((p) => p.price)),
  max: Math.max(...PRODUCTS.map((p) => p.price)),
};

/* ─────────── Relevance ranking ─────────── */

export type SortKey = "relevance" | "thinnest" | "price-asc" | "price-desc" | "brand";

export const SORTS: { id: SortKey; label: string }[] = [
  { id: "relevance", label: "Relevance" },
  { id: "thinnest", label: "Thinnest film first" },
  { id: "price-asc", label: "Price low to high" },
  { id: "price-desc", label: "Price high to low" },
  { id: "brand", label: "House A–Z" },
];

export interface RankedProduct {
  product: DeskProduct;
  relevance: number;
  /** which field the query matched, for a legible "why this surfaced" line */
  matchedOn: string[];
}

function relevanceOf(p: DeskProduct, terms: string[]): { score: number; matchedOn: string[] } {
  const t = TYPE_MAP[p.typeId];
  const fields: [string, string, number][] = [
    ["name", p.name.toLowerCase(), 40],
    ["house", p.brand.toLowerCase(), 30],
    ["type", (t?.label ?? "").toLowerCase(), 24],
    ["lane", (t?.lane ?? "").toLowerCase(), 14],
    ["job", (t?.job ?? "").toLowerCase(), 10],
    ["note", p.note.toLowerCase(), 8],
  ];
  let score = 0;
  const matchedOn = new Set<string>();
  for (const term of terms) {
    for (const [key, value, weight] of fields) {
      if (!value.includes(term)) continue;
      const boundary = value === term ? 1.6 : value.startsWith(term) ? 1.3 : 1;
      score += weight * boundary;
      matchedOn.add(key);
      break;
    }
  }
  // a thinner film is a better answer to the same question
  score += (3 - (t?.layerWeight ?? 0)) * 3;
  return { score: Math.round(score), matchedOn: [...matchedOn] };
}

export function rankProducts(query: ProductQuery, sort: SortKey = "relevance"): RankedProduct[] {
  const terms = (query.q ?? "").trim().toLowerCase().split(/\s+/).filter(Boolean);
  const ranked = searchProducts(query).map((product) => {
    const { score, matchedOn } = relevanceOf(product, terms);
    return { product, relevance: score, matchedOn };
  });
  const layer = (p: DeskProduct) => TYPE_MAP[p.typeId]?.layerWeight ?? 0;
  ranked.sort((a, b) => {
    switch (sort) {
      case "thinnest":
        return layer(a.product) - layer(b.product) || b.relevance - a.relevance;
      case "price-asc":
        return a.product.price - b.product.price;
      case "price-desc":
        return b.product.price - a.product.price;
      case "brand":
        return a.product.brand.localeCompare(b.product.brand) || a.product.name.localeCompare(b.product.name);
      default:
        return b.relevance - a.relevance || a.product.price - b.product.price;
    }
  });
  return ranked;
}

/** Which single filter, if loosened, would return the most results. */
export function loosenSuggestion(query: ProductQuery): { field: string; label: string; count: number } | null {
  const trials: { field: string; label: string; next: ProductQuery }[] = [
    ...(query.q ? [{ field: "q", label: "clear the search words", next: { ...query, q: "" } }] : []),
    ...(query.lane ? [{ field: "lane", label: `drop the ${query.lane} lane`, next: { ...query, lane: undefined } }] : []),
    ...(query.brand ? [{ field: "brand", label: `open it past ${query.brand}`, next: { ...query, brand: undefined } }] : []),
    ...(query.band ? [{ field: "band", label: "widen the price band", next: { ...query, band: undefined } }] : []),
    ...(query.filters?.length ? [{ field: "filters", label: "release the preference filters", next: { ...query, filters: [] } }] : []),
    ...(query.maxLayer !== undefined ? [{ field: "maxLayer", label: "allow thicker films", next: { ...query, maxLayer: undefined } }] : []),
    ...(query.typeId ? [{ field: "typeId", label: "look past that one product type", next: { ...query, typeId: undefined } }] : []),
  ];
  const scored = trials
    .map((t) => ({ field: t.field, label: t.label, count: searchProducts(t.next).length }))
    .sort((a, b) => b.count - a.count);
  return scored[0] ?? null;
}
