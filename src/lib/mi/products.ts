import type { FilterKey, Region } from "./types";
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
  /** Where it is easiest to buy. Absent means North America. */
  region?: Region;
  /** Claim-literacy tags: spf | treatment | hybrid | barrier | actives */
  claims?: string[];
  /** When NOT to buy — honest, product-specific. */
  whenNot?: string;
}

type ProductExtras = {
  shades?: number;
  region?: Region;
  claims?: string[];
  whenNot?: string;
};

/** Overload-friendly helper: 6th arg is either filters array or extras object. */
const P = (
  brand: string,
  name: string,
  typeId: string,
  price: number,
  note: string,
  filtersOrExtras: FilterKey[] | ProductExtras = [],
  shadesOrExtras?: number | ProductExtras,
  region?: Region,
): DeskProduct => {
  let filters: FilterKey[] = [];
  let extras: ProductExtras = {};
  if (Array.isArray(filtersOrExtras)) {
    filters = filtersOrExtras;
    if (typeof shadesOrExtras === "number") {
      extras = { shades: shadesOrExtras, ...(region ? { region } : {}) };
    } else if (shadesOrExtras && typeof shadesOrExtras === "object") {
      extras = shadesOrExtras;
    } else if (region) {
      extras = { region };
    }
  } else {
    extras = filtersOrExtras;
  }
  return {
    id: `${brand}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    brand,
    name,
    typeId,
    price,
    note,
    filters,
    ...(extras.shades ? { shades: extras.shades } : {}),
    ...(extras.region ? { region: extras.region } : {}),
    ...(extras.claims && extras.claims.length ? { claims: extras.claims } : {}),
    ...(extras.whenNot ? { whenNot: extras.whenNot } : {}),
  };
};

export const PRODUCTS: DeskProduct[] = [
  /* ── Serum tints and hybrid bases ── */
  P("ILIA", "Super Serum Skin Tint SPF 40", "skin-tint", 54, "Tint, SPF and serum in one film — the default anti-pancake base. SPF still needs a continuous film.", ["vegan"], { shades: 30, claims: ["spf", "hybrid", "treatment"], whenNot: "Sheered to a stain on a high-UV day with no reapplication." }),
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

  /* ── Beyond North America. Region is availability, not a quality ranking. ── */
  P("Laneige", "Neo Cushion Glow", "cushion-compact", 38, "Water-led cushion; one pass, and stop.", [], 8, "Korea"),
  P("Tirtir", "Mask Fit Red Cushion", "cushion-compact", 30, "The cushion that extended its depth range properly — 30 shades.", [], 30, "Korea"),
  P("Hera", "Black Cushion", "cushion-compact", 62, "Thin film, high polish; the touch-up habit is the risk.", [], 6, "Korea"),
  P("Laneige", "Lip Sleeping Mask", "lip-oil", 24, "Overnight repair rather than a daytime layer.", [], 6, "Korea"),
  P("Shiseido", "Synchro Skin Radiant Lifting Foundation SPF 30", "serum-foundation", 52, "Technical, unsentimental medium base with real UV numbers.", [], 30, "Japan"),
  P("Shiseido", "Clear Sunscreen Stick SPF 50+", "mineral-spf", 30, "Reapply over makeup without disturbing the film.", [], 1, "Japan"),
  P("Suqqu", "Melting Powder Blush", "powder-blush", 68, "Powder that behaves like a cream. Expensive, and it shows why.", [], 8, "Japan"),
  P("Canmake", "Cream Cheek", "cream-blush", 8, "The cheapest credible cream colour on the desk.", [], 12, "Japan"),
  P("Canmake", "Stay-On Balm Rouge", "tinted-balm", 9, "Pharmacy-priced balm tint that holds through lunch.", [], 14, "Japan"),
  P("Kay Beauty", "Hydrating Foundation", "light-foundation", 22, "Built for Indian depth and olive undertone bands from the start.", ["vegan"], 26, "India"),
  P("Kay Beauty", "Blurring Setting Powder", "setting-powder", 18, "Set two panels in heat, not the whole face.", ["vegan"], 3, "India"),
  P("Forest Essentials", "Tinted Lip Balm", "tinted-balm", 16, "Ayurvedic prep house; lip lane only.", [], 5, "India"),
  P("Juicy Chemistry", "Lip and Cheek Tint", "lip-cheek-balm", 14, "Short-list organic formula for reactive skin in humid heat.", ["fragranceFree", "vegan"], 4, "India"),
  P("Zaron Cosmetics", "Fluid Foundation", "serum-foundation", 20, "Deep and red-leaning bands treated as the centre of the range.", [], 18, "West Africa"),
  P("Zaron Cosmetics", "Sheer Tint Moisturiser", "skin-tint", 16, "Thin film built for humid heat.", [], 8, "West Africa"),
  P("House of Tara", "Foundation Stick", "multi-stick", 24, "High pigment load — a light hand is the whole instruction.", [], 16, "West Africa"),
  P("Huda Beauty", "Faux Filter Skin Tint", "skin-tint", 36, "Longevity-first house making a genuinely thin product.", [], 30, "Middle East"),
  P("Huda Beauty", "Easy Blur Natural Angel Powder", "pressed-powder", 39, "Portable set; portable is the risk.", [], 4, "Middle East"),
  P("Ghawali", "Satin Lipstick", "satin-lipstick", 28, "Heritage colour house; the lip carries the whole look.", [], 12, "Middle East"),
  P("Quem Disse, Berenice?", "Match Base Fluid", "light-foundation", 14, "Broad depth coverage at pharmacy pricing, built for heat.", [], 20, "Brazil"),
  P("Océane", "Lip Tint", "lip-stain", 12, "Stains rather than sits — survives a humid afternoon.", [], 8, "Brazil"),
  P("Natura", "Una Liquid Foundation", "serum-foundation", 26, "Biodiversity-sourced botanical base with real availability.", ["vegan"], 24, "Brazil"),
  P("Vive Cosmetics", "Liquid Lipstick", "lip-stain", 18, "Lip-led finish with no complexion cost.", ["vegan"], 14, "Latin America"),
  P("Trinny London", "BFF Skin Tint SPF 30", "skin-tint", 46, "Stackable pots designed around a ceiling.", [], 12, "United Kingdom"),
  P("Trinny London", "Lip2Cheek", "lip-cheek-balm", 34, "Two jobs, one pot, built for a zip case.", [], 20, "United Kingdom"),
  P("Lisa Eldridge Beauty", "Elevated Glow", "cream-highlighter", 42, "One lit plane, chosen by a working artist.", [], 6, "United Kingdom"),
  P("Dr. Hauschka", "Tinted Day Cream", "tinted-moisturiser", 42, "Biodynamic, sheer by temperament.", ["fragranceFree"], 3, "Europe"),
  P("Lavera", "Natural Liquid Foundation", "light-foundation", 18, "Certified natural at EU pharmacy pricing.", ["mineral", "vegan"], 8, "Europe"),
  P("Kiko Milano", "Unlimited Stylo Eye Pencil", "eyeliner-pencil", 12, "Cheap, competent, European high street.", [], 12, "Europe"),
  P("Frank Body", "Cheek Tint", "liquid-blush", 20, "Plainspoken colour with no ceremony attached.", ["vegan"], 4, "Australia"),
  P("INIKA Organic", "Certified Organic Perfection Concealer", "strategic-concealer", 34, "Organic spot work from the Australian mineral lane.", ["mineral", "vegan"], 6, "Australia"),

  /* ── Drugstore tier ── */
  P("e.l.f. Cosmetics", "Halo Glow Skin Tint", "skin-tint", 14, "Drugstore serum-tint logic: sheer, buildable, cheap enough to learn on.", ["vegan"], { shades: 12, claims: ["hybrid"], whenNot: "When you need full event opacity — this will not become foundation by wishing." }),
  P("e.l.f. Cosmetics", "Camo Hydrating Multi-Stick", "drugstore-stick", 10, "Capsule stick at ten dollars — architecture without the tax.", ["vegan"], { shades: 8, claims: ["hybrid"], whenNot: "When you need precise liquid match across a deep olive band — ranges are shorter." }),
  P("e.l.f. Cosmetics", "Camo Concealer", "blemish-concealer", 7, "Highest opacity on the smallest area — place, do not paint the face.", ["vegan"], { shades: 25, whenNot: "As a full-face base. That is how drugstore cake is born." }),
  P("NYX Professional Makeup", "Bare With Me Tinted Skin Veil", "skin-tint", 16, "Veil, not mask. The name is the instruction.", ["vegan"], { shades: 12, claims: ["hybrid", "barrier"], whenNot: "Fragrance-sensitive days without reading the current label." }),
  P("NYX Professional Makeup", "Color Correcting Concealer Green", "green-corrector", 10, "Green for redness — placement first, base second.", ["vegan"], { shades: 6, whenNot: "All over the face as a filter. Correctors are spots." }),
  P("Maybelline", "Super Stay Skin Tint", "skin-tint", 15, "Pharmacy anti-pancake entry with real wear.", [], { shades: 18, claims: ["hybrid"], whenNot: "Dry altitude without prep — long-wear can cling to flakes." }),
  P("Maybelline", "Instant Age Rewind Concealer", "brightening-concealer", 12, "Placed brightening, not a triangle of cake.", [], 18),
  P("L'Oréal Paris", "True Match Nude Hyaluronic Tint", "tinted-moisturiser", 18, "Hyaluronic is named; dose is makeup-level. Buy the texture, not the serum fantasy.", [], { shades: 24, claims: ["treatment", "hybrid"], whenNot: "When a leave-on HA serum already does the job and you only need pigment." }),
  P("Milani", "Cheek Kiss Cream Blush", "cream-blush", 11, "Cream architecture at drugstore price.", ["vegan"], 8),
  P("Catrice", "HD Perfect Finish Powder", "setting-powder", 6, "HD powder — two panels only. Full-face is the failure mode.", ["vegan"], { shades: 3, region: "Europe", claims: ["hybrid"], whenNot: "As an all-over midday rebuild. That is cake with a German accent." }),
  P("Essence", "Baby Got Blush", "powder-blush", 4, "Prove powder blush logic for pocket change.", ["vegan"], { shades: 6, region: "Europe" }),
  P("Wet n Wild", "MegaGlo Highlighting Stick", "cream-highlighter", 6, "One lit plane experiment under $10.", ["vegan"], 6),
  P("Neutrogena", "Purescreen Mineral UV Tint", "tinted-spf", 16, "Pharmacy mineral tint — SPF is the job; reapply still required.", ["fragranceFree", "mineral"], { shades: 4, claims: ["spf", "hybrid"], whenNot: "As all-day beach cover sheered to a stain with no reapplication." }),
  P("CeraVe", "Hydrating Mineral Sunscreen SPF 30", "mineral-spf", 18, "Untinted mineral UV kept separate from colour — claim-literate prep.", ["fragranceFree", "mineral"], { claims: ["spf", "barrier"], whenNot: "When you need tint and buy this hoping it is makeup." }),
  P("The Ordinary", "Niacinamide 10% + Zinc 1%", "hydrating-prep", 6, "Named and dosed — lives under makeup, not inside a foundation claim.", [], { claims: ["treatment", "actives"], whenNot: "As a reason to buy a thicker treatment foundation on top." }),

  /* ── Mid / prestige / luxury expansions ── */
  P("Glossier", "Skin Tint", "skin-tint", 36, "Sheerness as a feature. Short range is the known limit.", [], { shades: 12, claims: ["hybrid"], whenNot: "Deep bands needing fine undertone splits — the map is short." }),
  P("Glossier", "Cloud Paint", "liquid-blush", 20, "Gel-cream flush that reads as circulation.", [], 8),
  P("Rare Beauty", "Soft Pinch Liquid Blush", "liquid-blush", 23, "Long-wear liquid colour without base weight.", ["vegan"], { shades: 16, whenNot: "Layering half the shade range into a full glam stack daily." }),
  P("Fenty Beauty", "Eaze Drop Blurring Skin Tint", "blur-balm", 34, "Blur and tint with a depth map that takes deep bands seriously.", [], { shades: 25, claims: ["hybrid"], whenNot: "When you need waterproof sport performance — different job." }),
  P("Fenty Beauty", "Match Stix Matte Skinstick", "multi-stick", 30, "Contour and base placement stick — build, do not mask.", [], 20),
  P("NARS", "Radiant Creamy Concealer", "strategic-concealer", 32, "Placed coverage that still flexes — a desk classic for a reason.", [], 30),
  P("Laura Mercier", "Tinted Moisturizer Natural Skin Perfector", "tinted-moisturiser", 52, "The original tinted moisturiser lesson: moisture first, tone second.", [], { shades: 20, claims: ["hybrid"], whenNot: "Full-coverage event days — this will not densify on command." }),
  P("Laura Mercier", "Translucent Loose Setting Powder", "setting-powder", 43, "Strategic set icon — T-zone only, or it becomes the cake lesson.", [], { shades: 3, whenNot: "Full-face application twice a day. That is the product villain origin story." }),
  P("MAC", "Face and Body Foundation", "skin-tint", 39, "Pro sheer workhorse — build with sponge, stop early.", [], 24),
  P("Bobbi Brown", "Vitamin Enriched Face Base", "hydrating-prep", 64, "Prep that makes every base more honest.", [], { claims: ["treatment", "hybrid"], whenNot: "As a thick silicone mask under already-heavy foundation." }),
  P("Uoma Beauty", "Say What?! Foundation", "serum-foundation", 42, "Deep-range buildable medium — match first, sheer second.", ["vegan"], { shades: 51, claims: ["hybrid"], whenNot: "Defaulting to full opacity every weekday because the range finally fits." }),
  P("Mented Cosmetics", "Skin by Mented Foundation", "light-foundation", 34, "Nude-for-deep logic in a buildable base.", ["vegan"], 12),
  P("Sculpted by Aimee", "Skin Tint", "skin-tint", 28, "Irish weather-honest thin tint.", [], { shades: 14, region: "United Kingdom" }),
  P("Charlotte Tilbury", "Hollywood Flawless Filter", "hd-blur", 49, "Optical glow as a single plane — HD friend when not stacked under a second base.", [], { shades: 12, claims: ["hybrid"], whenNot: "Under full foundation + powder + spray. Then it is just more film." }),
  P("Charlotte Tilbury", "Beautiful Skin Foundation", "serum-foundation", 54, "Medium that can sheer — keep the hand light for skin-like.", [], 30),
  P("Armani Beauty", "Luminous Silk Foundation", "serum-foundation", 69, "Reference luminous medium fluid. One film is the whole argument.", [], { shades: 40, whenNot: "Buying three backups and a full wardrobe because the bottle is glass." }),
  P("Dior", "Backstage Face & Body Foundation", "skin-tint", 42, "Runway-honest sheer-buildable — the anti-pancake Dior.", [], { shades: 40, claims: ["hybrid"], whenNot: "When you wanted Forever full coverage and bought this by accident." }),
  P("Chanel", "Les Beiges Water-Fresh Tint", "skin-tint", 62, "Quiet luxury sheerness — restraint is the flex.", [], { shades: 12, claims: ["hybrid"], whenNot: "Full glam opacity days." }),
  P("Pat McGrath Labs", "Skin Fetish Sublime Perfection Foundation", "light-foundation", 68, "Sublime skin thin-to-medium; spend desire on eyes instead.", [], 36),
  P("Make Up For Ever", "Ultra HD Skin Booster", "hd-blur", 48, "Camera diffusion — mist and press, do not paint.", [], { shades: 15, claims: ["hybrid"], whenNot: "Grocery-store daylight full coverage. HD tools are not weekday masks." }),
  P("NARS", "Light Reflecting Foundation", "serum-foundation", 52, "Light over opacity — sheer on purpose.", [], 30),
  P("Fenty Beauty", "Pro Filt'r Soft Matte Longwear Foundation", "light-foundation", 40, "Match-first prestige matte — sheer the first pass, stop.", [], { shades: 50, whenNot: "Full opaque weekday cake because the shade finally matches." }),
  P("Rare Beauty", "Positive Light Under Eye Brightener", "brightening-concealer", 25, "Brighten without a dense concealer triangle.", ["vegan"], 12),
  P("Tower 28", "SOS Daily Rescue Spray", "setting-spray", 20, "Sensitive-aware mist — not a fragrance cloud.", ["fragranceFree", "vegan"], { claims: ["barrier"], whenNot: "As medical treatment for dermatitis. Education only." }),
  P("Supergoop!", "Glowscreen SPF 40", "tinted-spf", 38, "SPF-first glow primer hybrid — reapply or it is just pretty.", [], { shades: 4, claims: ["spf", "hybrid"], whenNot: "As sole beach protection under sweat with no reapplication." }),
  P("Colorescience", "Total Eye 3-in-1 Renewal SPF 35", "brightening-concealer", 75, "Eye SPF hybrid — named filters; still not a 12-hour beach plan.", ["mineral"], { shades: 4, claims: ["spf", "treatment"], whenNot: "When the lure is treatment alone and the tint mismatches your undertone." }),
  P("e.l.f. Cosmetics", "Camo Liquid Blush", "longwear-stain", 8, "Stain-like colour that survives humidity at drugstore pricing.", ["vegan"], { shades: 10, whenNot: "Dry under-eyes as cream highlight substitute." }),
  P("Maybelline", "Fit Me Matte + Poreless (sheer pass only)", "light-foundation", 10, "Pharmacy medium — architecture says sheer the first pass and stop.", [], { shades: 40, whenNot: "Full-face matte cake as a daily personality." }),

];

export const productRegion = (p: DeskProduct): Region => p.region ?? "North America";

export const PRODUCT_REGIONS: Region[] = [...new Set(PRODUCTS.map(productRegion))].sort() as Region[];

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
  regions?: string[] | undefined;
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
    if (query.regions?.length && !query.regions.includes(productRegion(p))) return false;
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
  const trials: { field: string; label: string; next: ProductQuery }[] = [];
  if (query.q) trials.push({ field: "q", label: "clear the search words", next: { ...query, q: "" } });
  if (query.lanes?.length)
    trials.push({ field: "lanes", label: `drop the ${query.lanes.join(" / ")} lane filter`, next: { ...query, lanes: [] } });
  if (query.brands?.length)
    trials.push({ field: "brands", label: `open it past ${query.brands.join(" / ")}`, next: { ...query, brands: [] } });
  if (query.band) trials.push({ field: "band", label: "widen the price band", next: { ...query, band: undefined } });
  if (query.minPrice !== undefined || query.maxPrice !== undefined)
    trials.push({ field: "price", label: "release the price range", next: { ...query, minPrice: undefined, maxPrice: undefined } });
  if (query.filters?.length)
    trials.push({ field: "filters", label: "release the preference filters", next: { ...query, filters: [] } });
  if (query.maxLayer !== undefined)
    trials.push({ field: "maxLayer", label: "allow thicker films", next: { ...query, maxLayer: undefined } });
  if (query.typeId)
    trials.push({ field: "typeId", label: "look past that one product type", next: { ...query, typeId: undefined } });
  const scored = trials
    .map((t) => ({ field: t.field, label: t.label, count: searchProducts(t.next).length }))
    .sort((a, b) => b.count - a.count);
  return scored[0] ?? null;
}

/** The nearest results when the exact combination returns nothing: keep the words, drop the filters. */
export function closestResults(query: ProductQuery, sort: SortKey = "relevance", limit = 6): RankedProduct[] {
  return rankProducts({ q: query.q, typeId: query.typeId }, sort).slice(0, limit);
}

/* ─────────── Recent searches (this browser only) ─────────── */

const RECENT_KEY = "vov_recent_searches_v1";

export function loadRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string").slice(0, 8) : [];
  } catch {
    return [];
  }
}

export function rememberSearch(term: string): string[] {
  const clean = term.trim().slice(0, 48);
  if (!clean || typeof window === "undefined") return loadRecentSearches();
  const next = [clean, ...loadRecentSearches().filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 8);
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
  return next;
}

export function clearRecentSearches(): string[] {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(RECENT_KEY);
    } catch {
      /* storage unavailable */
    }
  }
  return [];
}
