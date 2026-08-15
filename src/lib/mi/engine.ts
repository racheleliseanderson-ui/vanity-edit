import { TOOLS, TYPES, TYPE_MAP, type ProductType } from "./catalog";
import type {
  Architecture,
  BagCall,
  Contribution,
  Edit,
  Kit,
  Pathway,
  Profile,
  ScenarioResult,
  ScoreVariable,
  Tier,
  ToolCall,
  TypeScore,
  WhatIf,
} from "./types";

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const has = (p: Profile, g: string) => p.goals.includes(g);

/* ─────────────── Transparent score model (shown in the edit) ─────────────── */

/** Pancake-risk starts at BASE_RISK, then signed deltas from each variable sum. Finish (skin-like) = 100 − risk. */
export const BASE_RISK = 30;

/**
 * Every lever behind pancake-risk and finish scoring.
 * Positive deltas raise pancake risk (and lower finish). Negative deltas do the opposite.
 * Coefficients match the live architecture() maths — change one place, change both.
 */
export const SCORE_VARIABLES: ScoreVariable[] = [
  {
    id: "coverage",
    label: "Coverage appetite",
    weight: "(coverage − 30) × 0.45",
    raisesRiskWhen: "You ask for more than light evening (coverage over ~30).",
    lowersRiskWhen: "Sheer intent (coverage under ~20) keeps the film thin from the start.",
    finishEffect: "High coverage is the largest single drag on a skin-like finish.",
  },
  {
    id: "layers",
    label: "Layer count",
    weight: "max(0, layers − 3) × 7 − max(0, 3 − layers) × 5",
    raisesRiskWhen: "More than three opacity films on the face.",
    lowersRiskWhen: "Two or fewer films — architecture over product.",
    finishEffect: "Each extra edge is a place the finish can lift, crease or go grey.",
  },
  {
    id: "dehydration",
    label: "Dehydration stress",
    weight: "dryStress × (coverage > 45 ? 1.2 : 0.55); dryStress = skin dry 10 / normal 3 + climate altitude 12 / dry 8",
    raisesRiskWhen: "Dry skin or thin air, especially under medium-plus coverage.",
    lowersRiskWhen: "Temperate/humid context with non-dry skin.",
    finishEffect: "Water leaving the film is what turns opacity into cake.",
  },
  {
    id: "sebum",
    label: "Sebum movement",
    weight: "oilStress × (maintenance ≥ 2 ? 0.5 : 1); oilStress = oily 12 / combination 7",
    raisesRiskWhen: "Oily or combination skin with no planned touch-up.",
    lowersRiskWhen: "Low sebum, or maintenance ≥ 2 (you will blot and reset).",
    finishEffect: "Oil moves the base sideways; thin films and blotting protect finish.",
  },
  {
    id: "maintenance",
    label: "Maintenance tolerance",
    weight: "maintenance ≥ 2 → −6; else 8 − maintenance × 4",
    raisesRiskWhen: "You refuse midday intervention (maintenance 0–1).",
    lowersRiskWhen: "You will blot or reset once (maintenance 2–3).",
    finishEffect: "A slightly richer finish only survives if you will intervene.",
  },
  {
    id: "time",
    label: "Time on the face",
    weight: "≤5 min → −8; ≥25 min → +7; else 0",
    raisesRiskWhen: "Long routines (≥25 min) that tempt undiagnosed layers.",
    lowersRiskWhen: "Five-minute routines that physically cannot over-build.",
    finishEffect: "Minutes are a complexity budget, not a virtue.",
  },
  {
    id: "desire",
    label: "Desire",
    weight: "desire ≥ 3 → +9; desire 0 → −10; else +2",
    raisesRiskWhen: "High ritual appetite spent on opacity instead of definition.",
    lowersRiskWhen: "Low appetite that naturally keeps the stack short.",
    finishEffect: "Desire is allowed — finish stays honest when appetite buys colour, not cake.",
  },
  {
    id: "anti-pancake",
    label: "Anti-pancake / wear-less goals",
    weight: "−9 when escape-pancake or wear-less is selected",
    raisesRiskWhen: "—",
    lowersRiskWhen: "You stated skin-like or wear-less as a goal.",
    finishEffect: "Reorders scoring toward skin-like pathways first.",
  },
  {
    id: "reactivity",
    label: "Reactivity",
    weight: "+5 when sensitivity ≥ 2",
    raisesRiskWhen: "Reactive skin plus heavy removal of thick films.",
    lowersRiskWhen: "Low sensitivity — reactivity term stays off.",
    finishEffect: "Fewer films protect both barrier and finish.",
  },
  {
    id: "texture",
    label: "Texture visibility",
    weight: "+6 when texture or large pores is a concern",
    raisesRiskWhen: "Opaque product will settle into texture.",
    lowersRiskWhen: "No texture concern flagged.",
    finishEffect: "Diffusion and placement beat opacity on visible texture.",
  },
  {
    id: "outdoors",
    label: "Outdoor exposure",
    weight: "+4 when outdoors ≥ 2",
    raisesRiskWhen: "Heat, sweat and UV shorten the honest life of a thick base.",
    lowersRiskWhen: "Mostly indoor days.",
    finishEffect: "Outdoor load pushes the kit toward thin SPF hybrids, not cake.",
  },
  {
    id: "mature",
    label: "Mature / fine-line context",
    weight: "+5 when fine lines concern; +4 when mature-skin goal",
    raisesRiskWhen: "Powder-heavy stacks on textured, mature skin.",
    lowersRiskWhen: "Flexible cream films with prep.",
    finishEffect: "Emollient thin films read as skin; powder cakes in lines.",
  },
  {
    id: "deep-match",
    label: "Deep depth + undertone pressure",
    weight: "+4 when depth ≥ 8; +3 when olive / red-leaning / deep-neutral undertone",
    raisesRiskWhen: "Short shade ranges force over-application to force a match.",
    lowersRiskWhen: "Mid depth with neutral lean — most ranges were built here.",
    finishEffect: "Wrong undertone reads grey; people add layers to compensate. Architecture says match first, layers never.",
  },
  {
    id: "rosacea",
    label: "Rosacea-prone architecture",
    weight: "+6 when rosacea goal or high sensitivity + redness concern",
    raisesRiskWhen: "Full-face opacity as the reflex answer to redness.",
    lowersRiskWhen: "Placement-first, fragrance-aware, thin films.",
    finishEffect: "Corrector + sheer base outperforms a mask on reactive redness.",
  },
  {
    id: "sport",
    label: "Performance / sweat load",
    weight: "+5 when performance-sport goal; +3 when outdoors ≥ 3 with shine goal",
    raisesRiskWhen: "Heavy base under sweat without a blotting plan.",
    lowersRiskWhen: "Tinted SPF + stain colour + no powder stack.",
    finishEffect: "Sport finish is thin, grippy where needed, and honest about reapplication.",
  },
  {
    id: "hd",
    label: "HD / photography load",
    weight: "+4 when hd-photo or on-camera path goals emphasize event + texture",
    raisesRiskWhen: "Opacity under hard light; powder flashback; glitter highlight.",
    lowersRiskWhen: "Blur, place, define — never cake for the lens.",
    finishEffect: "Lenses punish layers before they punish colour. Diffusion is the finish.",
  },
];

/** Type-score (fit) weights — from a neutral 50 before profile stretch. */
export const TYPE_SCORE_WEIGHTS: { label: string; weight: string; note: string }[] = [
  { label: "Coverage match", weight: "−|type.coverage − profile.coverage| × 0.42", note: "Closest delivery to your appetite wins." },
  { label: "Sebum behaviour", weight: "type.oil × 6 (oily) or × 3.5 (combination)", note: "How the texture holds on sebum." },
  { label: "Dehydration behaviour", weight: "type.dry × 6 (altitude) or × 4.5 (dry)", note: "Film flexibility against water loss." },
  { label: "Film cost", weight: "−layerWeight × 7 if anti-pancake else × 4", note: "A film is one continuous layer on the skin. Opacity load is always costly; costlier when escaping cake." },
  { label: "Upkeep demanded", weight: "−upkeep × 5 if maintenance = 0", note: "No touch-ups means high-upkeep objects lose." },
  { label: "Time cost", weight: "−max(0, minutes − 2) × 5 if timeBudget ≤ 5", note: "Slow steps drop out of short routines." },
  { label: "Wear-less / multi-use / goals", weight: "+8 to +22 on pathway-aligned types; −6 to −8 on conflicts", note: "Goals reweight lanes, they do not invent miracles." },
  { label: "Filters & budget", weight: "mineral +7; silicone-averse −7 on silicone-leaning lanes; lean colour −3", note: "Preferences are hard constraints when you set them." },
  { label: "Depth / undertone (base lane)", weight: "+6 when depth ≥ 7 and type is sheer-to-medium; −8 full coverage with depth ≥ 8 and no wide-range signal", note: "Deep bands need placement and range, not more opacity." },
  { label: "Claim-literacy caution", weight: "−4 on full-foundation when SPF-hybrid goal is absent but treatment-hybrid language is the only lure", note: "Do not buy thickness for a skincare claim." },
];

/* ─────────────── Architecture / pancake risk ─────────────── */

export function architecture(p: Profile, plannedLayers?: number): Architecture {
  const c: Contribution[] = [];

  c.push({
    label: "Coverage appetite",
    delta: Math.round((p.coverage - 30) * 0.45),
    note:
      p.coverage > 60
        ? "Full-face opacity is the single largest cake driver."
        : p.coverage < 20
          ? "Sheer intent keeps the film thin from the start."
          : "Moderate coverage stays inside the skin-like band.",
    weight: "(coverage − 30) × 0.45",
  });

  const layers = plannedLayers ?? Math.round(1 + p.coverage / 28 + p.desire * 0.6);
  c.push({
    label: `Layer count (${layers})`,
    delta: Math.round(Math.max(0, layers - 3) * 7 - Math.max(0, 3 - layers) * 5),
    note:
      layers > 4
        ? "Every additional film multiplies edges that can lift or crack."
        : "Few layers — architecture is doing the work instead of product.",
    weight: "max(0, layers−3)×7 − max(0, 3−layers)×5",
  });

  const dryStress =
    (p.skin === "dry" ? 10 : p.skin === "normal" ? 3 : 0) +
    (p.climate === "altitude" ? 12 : p.climate === "dry" ? 8 : 0);
  c.push({
    label: "Dehydration stress",
    delta: Math.round(dryStress * (p.coverage > 45 ? 1.2 : 0.55)),
    note:
      dryStress > 12
        ? "Dry or thin air pulls water out of the film, so opaque bases crack first."
        : "Environment is not fighting the film much.",
    weight: `dryStress ${dryStress} × ${p.coverage > 45 ? "1.2" : "0.55"}`,
  });

  const oilStress = p.skin === "oily" ? 12 : p.skin === "combination" ? 7 : 0;
  c.push({
    label: "Sebum movement",
    delta: Math.round(oilStress * (p.maintenance >= 2 ? 0.5 : 1)),
    note:
      oilStress === 0
        ? "Little sebum travel to break the film."
        : p.maintenance >= 2
          ? "Oil will move the base, but you are willing to blot and reset."
          : "Oil will move the base and you do not want to touch it up — so it has to be thin.",
    weight: `oilStress ${oilStress} × ${p.maintenance >= 2 ? "0.5" : "1"}`,
  });

  c.push({
    label: "Maintenance tolerance",
    delta: p.maintenance >= 2 ? -6 : 8 - p.maintenance * 4,
    note:
      p.maintenance >= 2
        ? "You will intervene at midday, which lets a slightly richer finish survive."
        : "No touch-ups means the finish must be correct at 8am and forgiving by 4pm.",
    weight: p.maintenance >= 2 ? "−6 (maintenance ≥ 2)" : "8 − maintenance × 4",
  });

  c.push({
    label: "Time on the face",
    delta: p.timeBudget <= 5 ? -8 : p.timeBudget >= 25 ? 7 : 0,
    note:
      p.timeBudget <= 5
        ? "A five-minute routine physically cannot cake."
        : p.timeBudget >= 25
          ? "Long routines tempt extra layers that were never diagnosed."
          : "Enough time to place product, not enough to over-build.",
    weight: "≤5 min → −8 · ≥25 min → +7 · else 0",
  });

  c.push({
    label: "Desire",
    delta: p.desire >= 3 ? 9 : p.desire === 0 ? -10 : 2,
    note:
      p.desire >= 3
        ? "Wanting the ritual is allowed — it just has to be spent on definition, not opacity."
        : p.desire === 0
          ? "Low appetite naturally keeps the stack short."
          : "Moderate appetite, easily satisfied with colour rather than base.",
    weight: "desire ≥ 3 → +9 · 0 → −10 · else +2",
  });

  if (has(p, "escape-pancake") || has(p, "wear-less")) {
    c.push({
      label: "Anti-pancake goal",
      delta: -9,
      note: "The stated goal reorders scoring toward skin-like pathways first.",
      weight: "−9 (escape-pancake or wear-less)",
    });
  }
  if (p.sensitivity >= 2) {
    c.push({
      label: "Reactivity",
      delta: 5,
      note: "Reactive skin tolerates fewer films, and heavy removal adds its own insult.",
      weight: "+5 (sensitivity ≥ 2)",
    });
  }
  if (p.concerns.includes("texture") || p.concerns.includes("large pores")) {
    c.push({
      label: "Texture visibility",
      delta: 6,
      note: "Opaque product settles into texture — the cake reads worse, not better.",
      weight: "+6 (texture or large pores)",
    });
  }
  if (p.outdoors >= 2) {
    c.push({
      label: "Outdoor exposure",
      delta: 4,
      note: "Heat, sweat and UV all shorten the honest life of a thick base.",
      weight: "+4 (outdoors ≥ 2)",
    });
  }
  if (p.concerns.includes("fine lines") || has(p, "mature-skin")) {
    c.push({
      label: "Mature / fine-line context",
      delta: (p.concerns.includes("fine lines") ? 5 : 0) + (has(p, "mature-skin") ? 4 : 0),
      note: "Powder stacks settle into lines; flexible cream films and prep protect finish.",
      weight: "fine lines +5 · mature-skin goal +4",
    });
  }
  if (p.depth >= 8 || ["olive", "golden-olive", "deep-neutral", "red-leaning"].includes(p.undertone)) {
    const d = (p.depth >= 8 ? 4 : 0) + (["olive", "golden-olive", "deep-neutral", "red-leaning"].includes(p.undertone) ? 3 : 0);
    c.push({
      label: "Deep depth + undertone pressure",
      delta: d,
      note: "Short ranges force over-application to force a match — match first, never more layers.",
      weight: "depth ≥ 8 → +4 · olive/red/deep-neutral lean → +3",
    });
  }
  if (has(p, "rosacea") || (p.sensitivity >= 2 && (has(p, "redness") || p.concerns.includes("redness")))) {
    c.push({
      label: "Rosacea-prone architecture",
      delta: 6,
      note: "Full-face opacity is the reflex answer to redness and the wrong one. Placement first.",
      weight: "+6 (rosacea goal or reactive + redness)",
    });
  }
  if (has(p, "performance-sport")) {
    c.push({
      label: "Performance / sweat load",
      delta: 5,
      note: "Sweat plus heavy base is a transfer event. Thin films, stains, blotting.",
      weight: "+5 (performance-sport goal)",
    });
  }
  if (has(p, "hd-photo") || (has(p, "event") && p.concerns.includes("texture"))) {
    c.push({
      label: "HD / photography load",
      delta: 4,
      note: "Lenses punish layers before they punish colour. Diffusion over opacity.",
      weight: "+4 (hd-photo or event+texture)",
    });
  }

  const risk = clamp(Math.round(BASE_RISK + c.reduce((s, x) => s + x.delta, 0)));
  const skinlike = 100 - risk;
  const headline =
    risk < 25 ? "Skin-first architecture" : risk < 45 ? "Balanced architecture" : risk < 65 ? "Cake pressure building" : "Pancake likely";
  const verdict =
    risk < 25
      ? "This reads as skin at arm's length and in daylight. Spend any remaining appetite on colour and definition."
      : risk < 45
        ? "Defensible. The base is doing less work than the placement, which is the point."
        : risk < 65
          ? "Two decisions are fighting each other — usually coverage appetite against dehydration or sebum. Trade opacity for placement."
          : "At this coverage and layer count the finish will read as a mask by mid-afternoon. Cut a layer before you change a brand.";

  return {
    risk,
    skinlike,
    headline,
    verdict,
    baseRisk: BASE_RISK,
    contributions: c.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)),
  };
}

/* ─────────────── Product-type scoring ─────────────── */

function scoreType(p: Profile, t: ProductType): TypeScore {
  let s = 50;
  const reasons: string[] = [];
  const cautions: string[] = [];
  const breakdown: Contribution[] = [];
  const bump = (label: string, delta: number, note: string, weight?: string) => {
    if (Math.round(delta) === 0) return;
    s += delta;
    breakdown.push({ label, delta: Math.round(delta), note, ...(weight ? { weight } : {}) });
  };

  const gap = t.coverage - p.coverage;
  bump(
    "Coverage match",
    -Math.abs(gap) * 0.42,
    `Delivers ${t.coverage} against your appetite of ${p.coverage}.`,
    "−|Δ coverage| × 0.42",
  );
  if (Math.abs(gap) <= 12) reasons.push("Delivers almost exactly the coverage you asked for.");
  else if (gap > 25) cautions.push("Gives more opacity than you said you wanted.");
  else if (gap < -25 && t.lane === "base") cautions.push("Sheerer than your stated appetite — pair with spot work.");

  if (p.skin === "oily" || p.skin === "combination") {
    bump("Sebum behaviour", t.oil * (p.skin === "oily" ? 6 : 3.5), `How this texture behaves on ${p.skin} skin.`, `oil × ${p.skin === "oily" ? 6 : 3.5}`);
    if (t.oil >= 2) reasons.push("Holds up against sebum movement.");
    if (t.oil <= -1) cautions.push("Can slide or go patchy on oilier zones.");
  }
  if (p.skin === "dry" || p.climate === "dry" || p.climate === "altitude") {
    bump("Dehydration behaviour", t.dry * (p.climate === "altitude" ? 6 : 4.5), `Film flexibility against ${p.climate === "altitude" ? "thin air" : "dry conditions"}.`, `dry × ${p.climate === "altitude" ? 6 : 4.5}`);
    if (t.dry >= 2) reasons.push("Flexible film that survives dehydrated skin and thin air.");
    if (t.dry <= -2) cautions.push("Powder-heavy texture is the first thing to crack when skin is dry.");
  }

  bump("Film cost", -t.layerWeight * (has(p, "escape-pancake") ? 7 : 4), has(p, "escape-pancake") ? "Weighted harder because escaping pancake is a stated goal." : "Every unit of opacity load costs points.", has(p, "escape-pancake") ? "−layerWeight × 7" : "−layerWeight × 4");
  if (t.layerWeight === 0 && t.lane !== "care") reasons.push("Adds zero opacity to the stack.");
  if (t.layerWeight >= 3) cautions.push("Heaviest film cost on the desk.");

  if (p.maintenance === 0) {
    bump("Upkeep demanded", -t.upkeep * 5, "You have ruled out midday intervention.", "−upkeep × 5");
    if (t.upkeep >= 2) cautions.push("Needs re-application you have said you will not do.");
  }
  if (p.timeBudget <= 5) bump("Time cost", -Math.max(0, t.minutes - 2) * 5, `Takes about ${t.minutes} minutes inside a ${p.timeBudget}-minute routine.`, "−max(0, min−2) × 5");
  if (p.timeBudget >= 20 && t.lane !== "base") bump("Time available", 3, "There is room for a non-base step.", "+3");

  if (has(p, "wear-less") && t.lane === "base") bump("Wear-less goal", -t.layerWeight * 6, "Base weight is penalised while you are wearing less.", "−layerWeight × 6");
  if (has(p, "wear-less") && t.id === "no-base") bump("Wear-less goal", 22, "Bare skin is the literal answer to the goal you set.", "+22");
  if (t.id === "no-base" && p.coverage > 18) {
    bump("Coverage asked for", -(p.coverage - 18) * 0.55, "You asked for visible evening.", "−(coverage−18) × 0.55");
    cautions.push("You asked for visible evening — bare skin cannot deliver it.");
  }
  if (has(p, "simplify") || has(p, "fast-polish") || has(p, "minimalist")) {
    if (["multi-stick", "lip-cheek-balm", "cream-blush", "tinted-balm", "brow-gel", "blur-balm", "liquid-blush", "cream-bronzer", "satin-lipstick", "sport-tint"].includes(t.id)) {
      bump("Multi-use bonus", 9, "One object, several jobs.", "+9");
      reasons.push("One object, several jobs — protects a short kit.");
    }
    if (t.minutes >= 4) bump("Step length", -6, "Slower than a simplified routine tolerates.", "−6");
  }
  if (has(p, "alternatives") && ["skin-tint", "tinted-spf", "multi-stick", "no-base", "mineral-powder", "tinted-moisturiser", "blur-balm", "bronzing-drops", "hydrating-prep", "mineral-spf", "sport-tint"].includes(t.id)) {
    bump("Alternative pathway", 8, "Sits outside conventional base architecture.", "+8");
    reasons.push("Sits on an alternative pathway rather than conventional base.");
  }
  if (has(p, "redness") || has(p, "rosacea") || p.concerns.includes("redness")) {
    if (["colour-corrector", "strategic-concealer", "hydrating-corrector", "green-corrector"].includes(t.id)) {
      bump("Redness targeting", 12, "Treats redness as placement, not a full-face problem.", "+12");
      reasons.push("Targets redness where it is, instead of covering the whole face.");
    }
    if (t.id === "full-foundation") {
      bump("Over-correction risk", -8, "Full base is the reflex answer to redness, and the wrong one.", "−8");
      cautions.push("Full base is the usual over-correction for redness.");
    }
  }
  if (has(p, "awake") && ["brightening-concealer", "cream-highlighter", "brow-gel", "mascara", "hydrating-corrector", "brow-pencil", "eyeliner-pencil"].includes(t.id)) {
    bump("Awake signal", 11, "Buys alertness without complexion cost.", "+11");
    reasons.push("Reads as awake without touching the complexion.");
  }
  if (has(p, "shine") || p.climate === "humid") {
    if (["blotting-paper", "setting-powder", "shine-stick"].includes(t.id)) {
      bump("Shine control", 12, "Controls shine without a full-face matte layer.", "+12");
      reasons.push("Shine control that stays strategic, not full-face matte.");
    }
    if (t.id === "pressed-powder") {
      bump("Re-powder trap", -6, "Portable powder invites the afternoon rebuild.", "−6");
      cautions.push("Portable powder is where most cake is applied, not at 8am.");
    }
  }
  if (has(p, "dryness") && t.dry >= 2) {
    bump("Dryness goal", 8, "Adds flex and water rather than powder.", "+8");
    reasons.push("Adds water and flex rather than powder.");
  }
  if (has(p, "event") || has(p, "hd-photo")) {
    if (t.longevity >= 2 && t.layerWeight <= 1) {
      bump("Event longevity", 9, "Holds without adding opacity.", "+9");
      reasons.push("Longevity earned through the right product, not more base.");
    }
    if (["lip-stain", "shadow-stick", "lip-liner", "eyeliner-pencil", "shadow-duo", "hd-blur"].includes(t.id)) {
      bump("Definition lane", 6, "Definition is where event budget belongs.", "+6");
    }
    if (has(p, "hd-photo") && ["hd-blur", "blur-balm", "serum-foundation"].includes(t.id)) {
      bump("HD diffusion", 10, "Lenses want blur and place, not opacity.", "+10");
      reasons.push("Built for diffusion under hard light.");
    }
    if (has(p, "hd-photo") && t.id === "powder-highlighter") {
      bump("Flash risk", -8, "Powder sparkle flashbacks on camera.", "−8");
      cautions.push("Powder highlight is a flashback risk under HD light.");
    }
  }
  if (p.outdoors >= 2 && ["tinted-spf", "mineral-spf", "sport-tint"].includes(t.id)) {
    bump("Outdoor exposure", 14, "UV strategy becomes the product's real job.", "+14");
    reasons.push("Outdoor exposure makes SPF the product's real job.");
  }
  if (p.outdoors <= 0 && t.id === "tinted-spf") bump("Indoor context", -4, "Little UV load to justify the hybrid.", "−4");
  if (p.coverage > 45 && (p.skin === "dry" || p.climate === "altitude") && t.id === "hydrating-prep") {
    bump("Prep leverage", 14, "The one step that lets a richer base stay honest here.", "+14");
    reasons.push("Prep is the cheapest anti-cake move available at this coverage.");
  }

  if (p.sensitivity >= 2 || has(p, "fragrance-sensitive") || has(p, "rosacea")) {
    bump("Reactivity", -t.layerWeight * 4, "Reactive skin tolerates fewer films.", "−layerWeight × 4");
    if (t.id === "primer") {
      bump("Unjustified film", -10, "No documented wear failure to justify it.", "−10");
      cautions.push("Another film on reactive skin without a documented wear failure.");
    }
    if (t.lane === "spot") {
      bump("Small surface area", 6, "Less area covered means less to react to.", "+6");
      reasons.push("Less surface area covered means less to react to.");
    }
  }
  if (p.filters.includes("mineral") && ["mineral-powder", "tinted-spf", "mineral-spf", "pressed-powder", "powder-bronzer"].includes(t.id)) {
    bump("Mineral filter", 7, "Honours your mineral preference.", "+7");
    reasons.push("Honours your mineral filter.");
  }
  if (p.filters.includes("siliconeFree") && ["full-foundation", "primer", "cushion-compact"].includes(t.id)) {
    bump("Silicone-averse", -7, "This lane leans silicone — verify formulas.", "−7");
    cautions.push("This lane leans silicone — verify formulas.");
  }
  if (p.filters.includes("fragranceFree") && ["colour-corrector", "strategic-concealer", "tinted-moisturiser", "skin-tint"].includes(t.id)) {
    bump("Fragrance-free lane", 4, "Common homes for fragrance-free formulas — still verify the unit.", "+4");
  }
  if (p.budget === "lean" && t.lane === "colour" && !["lip-cheek-balm", "bronzing-drops"].includes(t.id)) bump("Lean budget", -3, "Colour is the easiest lane to postpone.", "−3");
  if (p.budget === "open" && ["serum-foundation", "cream-bronzer", "satin-lipstick", "hd-blur"].includes(t.id)) bump("Open budget", 3, "Texture quality is worth paying for in this lane.", "+3");

  if (p.desire >= 3 && ["cream-blush", "shadow-stick", "lip-stain", "cream-highlighter", "liquid-blush", "satin-lipstick", "cream-bronzer", "eyeliner-pencil"].includes(t.id)) {
    bump("Desire spend", 8, "Desire is allowed — this is where it belongs.", "+8");
    reasons.push("Desire is allowed — this is where to spend it.");
  }
  if (p.desire <= 0 && t.lane === "colour") bump("Low appetite", -6, "You are not asking for colour right now.", "−6");

  // Mature skin: favour flexible cream, penalise powder-heavy
  if (has(p, "mature-skin") || p.concerns.includes("fine lines")) {
    if (["blur-balm", "tinted-moisturiser", "serum-foundation", "cream-blush", "hydrating-prep", "hydrating-corrector", "lip-oil"].includes(t.id)) {
      bump("Mature-skin flex", 9, "Flexible film that does not settle into lines.", "+9");
      reasons.push("Flexible film — kinder on mature texture.");
    }
    if (["mineral-powder", "pressed-powder", "powder-bronzer", "powder-highlighter", "full-foundation"].includes(t.id)) {
      bump("Settling risk", -9, "Powder and heavy opacity settle into lines under daylight.", "−9");
      cautions.push("Powder and full opacity settle into lines — use with extreme restraint.");
    }
  }

  // Deep skin + undertone: reward sheer-to-medium with placement, penalise short-range full coverage reflex
  if (p.depth >= 7 && t.lane === "base") {
    if (t.layerWeight <= 2 && t.coverage <= 55) {
      bump("Deep-band architecture", 6, "Sheer-to-medium leaves undertone visible instead of greying it out.", "+6");
      reasons.push("Lets undertone show — critical on deep and olive bands.");
    }
    if (t.id === "full-foundation") {
      bump("Opacity trap on deep bands", -8, "Full coverage is often used to force a bad match. Match first.", "−8");
      cautions.push("On deep bands, full coverage often hides a mismatch instead of fixing it.");
    }
  }
  if (["olive", "golden-olive", "red-leaning", "deep-neutral"].includes(p.undertone) && ["multi-stick", "serum-foundation", "skin-tint", "strategic-concealer"].includes(t.id)) {
    bump("Undertone-friendly lane", 5, "Buildable, blendable textures that accept olive and red leans.", "+5");
  }

  // Performance / sport
  if (has(p, "performance-sport")) {
    if (["sport-tint", "tinted-spf", "lip-stain", "blotting-paper", "mascara", "brow-gel", "mineral-spf"].includes(t.id)) {
      bump("Sport kit", 11, "Sweat-honest: thin, stain, blot — not a powder rebuild.", "+11");
      reasons.push("Survives sweat without inviting a powder stack.");
    }
    if (["full-foundation", "cream-highlighter", "powder-highlighter", "lip-oil"].includes(t.id)) {
      bump("Sweat liability", -8, "Migrates or slides under sweat.", "−8");
      cautions.push("High migration risk under sweat.");
    }
  }

  // Fragrance-sensitive goal
  if (has(p, "fragrance-sensitive") && t.lane === "base" && t.layerWeight >= 2) {
    bump("Fragrance surface area", -5, "More film = more fragrance contact if the formula is scented — verify labels.", "−5");
  }

  // Claim-literacy: do not reward heavy base solely for hybrid marketing
  if (t.id === "full-foundation" && !has(p, "event") && p.coverage < 50) {
    bump("Claim-literacy caution", -4, "Do not buy thickness for a skincare claim you have not verified as named, dosed and tested.", "−4");
    cautions.push("If the lure is a 'treatment' claim, read the claim-literacy card before the opacity.");
  }

  if (has(p, "even-tone") && ["strategic-concealer", "skin-tint", "light-foundation", "colour-corrector"].includes(t.id)) {
    bump("Even-tone path", 6, "Evening without a mask.", "+6");
  }

  const score = clamp(Math.round(s));
  const tier: Tier = score >= 68 ? "core" : score >= 48 ? "consider" : "hold";
  return {
    id: t.id,
    label: t.label,
    lane: t.lane,
    score,
    tier,
    reasons: reasons.slice(0, 3),
    cautions: cautions.slice(0, 2),
    examples: t.examples,
    layerWeight: t.layerWeight,
    breakdown: [...breakdown].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, 8),
  };
}

export function scoreTypes(p: Profile): TypeScore[] {
  const raw = TYPES.map((t) => scoreType(p, t));
  // Raw scores compress into a narrow band; stretch them across the profile's
  // own range so tiers and meters stay legible whatever the inputs are.
  const lo = Math.min(...raw.map((r) => r.score));
  const hi = Math.max(...raw.map((r) => r.score));
  const span = Math.max(hi - lo, 1);
  return raw
    .map((r) => {
      const score = clamp(Math.round(22 + ((r.score - lo) / span) * 74));
      const tier: Tier = score >= 68 ? "core" : score >= 46 ? "consider" : "hold";
      return { ...r, score, tier };
    })
    .sort((a, b) => b.score - a.score);
}

/* ─────────────── Alternative pathways ─────────────── */

export const PATHWAY_DEFS: { id: string; name: string; promise: string; types: string[]; tradeoff: string }[] = [
  { id: "sheer-hybrid", name: "Sheer hybrid base", promise: "One serum tint or tinted SPF, sheered, plus placed concealer.", types: ["skin-tint", "tinted-spf", "strategic-concealer", "cream-blush"], tradeoff: "You will see some of your own skin. That is the design, not a failure." },
  { id: "spot-only", name: "Spot-only architecture", promise: "No base. Concealer and corrector where the eye actually lands.", types: ["no-base", "strategic-concealer", "colour-corrector", "brow-gel"], tradeoff: "Tone is uneven in raking light — but nothing can cake." },
  { id: "one-stick", name: "One-stick capsule", promise: "A multipurpose stick for base and contour, a balm for cheeks and lips.", types: ["multi-stick", "lip-cheek-balm", "brow-gel", "mascara"], tradeoff: "Shade precision is coarser than a liquid match." },
  { id: "mineral-control", name: "Mineral control", promise: "Buildable mineral powder, applied light, blotting over re-powdering.", types: ["mineral-powder", "blotting-paper", "powder-blush", "strategic-concealer"], tradeoff: "Needs a hydrated base underneath or it reads dry by noon." },
  { id: "event-definition", name: "Definition-led event kit", promise: "Base stays honest; longevity is bought in eyes, brows and lip.", types: ["light-foundation", "shadow-stick", "lip-stain", "setting-powder", "cream-highlighter"], tradeoff: "More steps, so budget the extra ten minutes honestly." },
  { id: "skincare-first", name: "Skincare-first, colour later", promise: "Hydration and SPF carry the finish; one colour object signals effort.", types: ["tinted-spf", "tinted-balm", "cream-blush", "no-base"], tradeoff: "Coverage is essentially zero — good skincare has to do the work." },
  { id: "prep-led", name: "Prep-led base", promise: "Hydrating prep, then the thinnest base that still reads even.", types: ["hydrating-prep", "tinted-moisturiser", "hydrating-corrector", "liquid-blush"], tradeoff: "Costs a skincare step before any makeup decision." },
  { id: "definition-only", name: "Definition without base", promise: "Brow, liner, lash and lip. The complexion is left alone entirely.", types: ["no-base", "brow-pencil", "eyeliner-pencil", "satin-lipstick", "mascara"], tradeoff: "Tone is untouched, so the face reads styled rather than even." },
  { id: "camera-diffuse", name: "Camera-diffuse", promise: "Blur and place rather than cover; powder only where the lens flares.", types: ["blur-balm", "hd-blur", "serum-foundation", "blemish-concealer", "setting-powder"], tradeoff: "Needs a light hand — the same kit cakes badly if applied heavily." },
  { id: "mature-flex", name: "Mature flexible film", promise: "Prep, serum tint, cream colour — nothing that settles into lines.", types: ["hydrating-prep", "tinted-moisturiser", "hydrating-corrector", "cream-blush", "lip-oil"], tradeoff: "Matte control and full opacity are off the table on purpose." },
  { id: "deep-match", name: "Deep-band match first", promise: "Wide-range sheer-to-medium base, undertone-honest concealer, stain colour.", types: ["serum-foundation", "strategic-concealer", "liquid-blush", "brow-gel", "lip-stain"], tradeoff: "You will refuse short shade ranges even when the texture is pretty." },
  { id: "rosacea-place", name: "Rosacea placement", promise: "Corrector and fragrance-aware sheer film; no full-face opacity reflex.", types: ["colour-corrector", "green-corrector", "tinted-moisturiser", "strategic-concealer", "brow-gel"], tradeoff: "Glow products that sit on inflamed texture stay out of the kit." },
  { id: "sport-minimal", name: "Performance minimal", promise: "Tinted SPF or sport tint, stain colour, brows — sweat-honest.", types: ["sport-tint", "tinted-spf", "lip-stain", "brow-gel", "blotting-paper"], tradeoff: "No cream highlight, no powder rebuild, no dinner-proof glam stack." },
  { id: "fragrance-guard", name: "Fragrance-guard capsule", promise: "Hard fragrance-free filters, short list, mineral-aware where possible.", types: ["tinted-spf", "strategic-concealer", "blotting-paper", "brow-gel"], tradeoff: "The shortlist is deliberately narrow — desire spends on texture, not range." },
];

export function pathways(p: Profile, scored: TypeScore[]): Pathway[] {
  const map = new Map(scored.map((s) => [s.id, s]));
  return PATHWAY_DEFS.map((d) => {
    const parts = d.types.map((id) => map.get(id)!).filter(Boolean);
    let fit = parts.reduce((s, x) => s + x.score, 0) / Math.max(parts.length, 1);
    const because: string[] = [];
    const ledger: Contribution[] = [{ label: "Average product score", delta: Math.round(fit), note: `Mean of the ${parts.length} products on this pathway.`, weight: "mean(type scores)" }];
    const add = (label: string, delta: number, note: string, weight?: string) => {
      fit += delta;
      ledger.push({ label, delta: Math.round(delta), note, ...(weight ? { weight } : {}) });
    };

    const layers = d.types.reduce((s, id) => s + (TYPE_MAP[id]?.layerWeight ?? 0), 0);
    if (layers <= 3) {
      add("Low film count", 5, `Only ${layers} layers of opacity in the whole pathway.`, "+5 if layers ≤ 3");
      because.push(`Only ${layers} layers of opacity in the whole pathway.`);
    }
    if (d.types.length > p.ceiling) {
      add("Over your ceiling", -(d.types.length - p.ceiling) * 6, `Needs ${d.types.length} products against your ceiling of ${p.ceiling}.`, "−6 per object over ceiling");
      because.push(`Needs ${d.types.length} products against your ceiling of ${p.ceiling}.`);
    } else because.push(`Fits inside your ceiling of ${p.ceiling} products.`);

    const minutes = d.types.reduce((s, id) => s + (TYPE_MAP[id]?.minutes ?? 0), 0);
    const upkeep = d.types.reduce((s, id) => s + (TYPE_MAP[id]?.upkeep ?? 0), 0);
    if (minutes > p.timeBudget) {
      add("Over your minutes", -(minutes - p.timeBudget) * 1.6, `Runs about ${minutes} minutes against your ${p.timeBudget}.`, "−1.6 per minute over");
      because.push(`Runs about ${minutes} minutes against your ${p.timeBudget}.`);
    } else because.push(`Runs about ${minutes} minutes — inside your ${p.timeBudget}.`);

    if (p.maintenance === 0 && upkeep >= 5) {
      add("Upkeep mismatch", -6, `Asks for ${upkeep} units of upkeep from someone who will not touch up.`, "−6");
      because.push("It asks for more re-application than you will give it.");
    }
    if (p.desire >= 3 && ["spot-only", "definition-only", "sport-minimal"].includes(d.id)) {
      add("Desire mismatch", -8, "You want more ritual than this offers.", "−8");
      because.push("You want more ritual than this pathway offers.");
    }
    if (p.desire <= 0 && ["event-definition", "camera-diffuse"].includes(d.id)) add("Low appetite", -10, "More steps than you are asking for.", "−10");
    if (p.maintenance === 0 && d.id === "mineral-control") {
      add("Powder assumes upkeep", -6, "Powder control assumes some midday intervention.", "−6");
      because.push("Powder control assumes some midday intervention.");
    }
    if ((p.climate === "altitude" || p.skin === "dry") && d.id === "mineral-control") {
      add("Dry air vs powder", -8, "Structurally at odds.", "−8");
      because.push("Dry air and powder are structurally at odds.");
    }
    if ((p.climate === "altitude" || p.skin === "dry" || has(p, "mature-skin")) && d.id === "prep-led") {
      add("Prep leverage", 8, "Prep is the correct first move on dehydrated or mature skin.", "+8");
      because.push("Prep does the work your climate would otherwise undo.");
    }
    if (p.outdoors >= 2 && (d.types.includes("tinted-spf") || d.types.includes("mineral-spf") || d.types.includes("sport-tint"))) {
      add("Carries UV strategy", 6, "SPF arrives without an extra step.", "+6");
      because.push("Carries your UV strategy without an extra step.");
    }
    if (p.sensitivity >= 2 && layers <= 3) {
      add("Suits reactivity", 5, "Low film count suits reactive skin.", "+5");
      because.push("Low film count suits reactive skin.");
    }
    if (p.concerns.includes("texture") && (d.id === "camera-diffuse" || d.id === "mature-flex")) {
      add("Texture handling", 6, "Diffusion beats coverage on visible texture.", "+6");
      because.push("Diffusion reads better on texture than opacity does.");
    }
    if ((has(p, "mature-skin") || p.concerns.includes("fine lines")) && d.id === "mature-flex") {
      add("Mature path fit", 10, "Built for flexible films over powder stacks.", "+10");
      because.push("This pathway was built for mature-skin architecture.");
    }
    if (p.depth >= 7 && d.id === "deep-match") {
      add("Deep-band path fit", 10, "Match-first logic for deep and undertone-complex skin.", "+10");
      because.push("Prioritises match and undertone over opacity.");
    }
    if ((has(p, "rosacea") || (p.sensitivity >= 2 && p.concerns.includes("redness"))) && d.id === "rosacea-place") {
      add("Rosacea path fit", 12, "Placement over opacity for reactive redness.", "+12");
      because.push("Corrector-first — the honest answer to mid-flare redness.");
    }
    if (has(p, "performance-sport") && d.id === "sport-minimal") {
      add("Sport path fit", 12, "Sweat-honest object list.", "+12");
      because.push("Designed for sweat, not for a powder rebuild.");
    }
    if ((has(p, "fragrance-sensitive") || p.filters.includes("fragranceFree")) && d.id === "fragrance-guard") {
      add("Fragrance-guard fit", 10, "Short list, hard filters.", "+10");
      because.push("Keeps the object count and fragrance surface area low.");
    }
    if (has(p, "hd-photo") && d.id === "camera-diffuse") {
      add("HD path fit", 10, "Lens-first architecture.", "+10");
      because.push("Blur and place — what HD light actually rewards.");
    }
    if (has(p, "minimalist") && ["one-stick", "definition-only", "spot-only"].includes(d.id)) {
      add("Minimalist fit", 8, "Fewer objects, clearer jobs.", "+8");
    }

    return {
      ...d,
      fit: clamp(Math.round(fit)),
      because: because.slice(0, 4),
      layers,
      minutes,
      upkeep,
      ledger: ledger.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)),
    };
  }).sort((a, b) => b.fit - a.fit);
}

/* ─────────────── Tools ─────────────── */

export function tools(p: Profile, kit: Kit): ToolCall[] {
  const ids = new Set(kit.items.map((i) => i.id));
  const calls: Record<string, ToolCall> = {};
  const set = (id: string, verdict: ToolCall["verdict"], why: string) => {
    const label = TOOLS.find((t) => t.id === id)?.label ?? id;
    calls[id] = { id, label, verdict, why };
  };

  set("fingers", "essential", "Warmth thins cream and stick textures better than any brush. Fingers count as a tool here.");
  set("damp-sponge", ids.has("skin-tint") || ids.has("light-foundation") || ids.has("full-foundation") || ids.has("sport-tint") ? "essential" : "optional",
    ids.has("full-foundation") ? "The only reliable way to press a heavier base thin instead of laying it on." : "Useful for sheering liquid bases; unnecessary if the kit is sticks and balms.");
  set("concealer-brush", ids.has("strategic-concealer") || ids.has("colour-corrector") || ids.has("green-corrector") ? "essential" : "optional",
    "Placed coverage needs a small tool, otherwise a spot becomes a patch.");
  set("powder-brush", ids.has("setting-powder") || ids.has("mineral-powder") ? "essential" : "probably unnecessary",
    ids.has("setting-powder") ? "A soft brush is what keeps powder strategic — two panels, not a full face." : "Nothing in this kit is a powder.");
  set("buffing-brush", ids.has("mineral-powder") ? "optional" : "probably unnecessary",
    ids.has("mineral-powder") ? "Buffs mineral powder in thin passes; go lighter than the brush invites." : "Dense brushes exist to push opacity — this kit does not need it.");
  set("blush-brush", ids.has("powder-blush") ? "essential" : "probably unnecessary",
    ids.has("powder-blush") ? "Powder colour needs a dedicated brush to stay diffuse." : "Cream colour is better with fingers.");
  set("fan-brush", "probably unnecessary", "A specialist tool for a step this kit does not contain.");
  set("spoolie", ids.has("brow-gel") ? "essential" : "optional", "Brows are the cheapest structure on the face and the spoolie is what makes them read groomed.");
  set("lash-curler", p.desire >= 2 || ids.has("mascara") ? "optional" : "probably unnecessary", "Adds openness with no product weight — worth it if you enjoy the ritual.");
  set("airbrush", "probably unnecessary", "Airbrush systems exist to deposit even opacity. That is the opposite of this brief.");
  set("duo-fibre-brush", ids.has("serum-foundation") || ids.has("light-foundation") || ids.has("hd-blur") ? "optional" : "probably unnecessary",
    ids.has("serum-foundation") || ids.has("light-foundation") || ids.has("hd-blur")
      ? "Stippling a medium base is how it stays a film instead of a coat."
      : "Nothing in this kit needs stippling.");
  set("mini-sponge", ids.has("blemish-concealer") || ids.has("strategic-concealer") ? "optional" : "probably unnecessary",
    "Presses the edge of a placed spot into skin — the difference between coverage and a patch.");
  set("shadow-blender", ids.has("shadow-duo") ? "essential" : "probably unnecessary",
    ids.has("shadow-duo") ? "Powder gradient is impossible to diffuse with a fingertip." : "This kit defines the eye without powder.");
  set("lip-brush", ids.has("satin-lipstick") || ids.has("lip-stain") ? "optional" : "probably unnecessary",
    "Only worth it if you want a drawn edge rather than a worn one.");
  set("brow-brush", ids.has("brow-pencil") ? "essential" : ids.has("brow-gel") ? "optional" : "probably unnecessary",
    ids.has("brow-pencil") ? "Pencil without a brush reads as drawn on. The brush is what makes it hair." : "Brow gel and a spoolie already cover this.");

  const order = { essential: 0, optional: 1, "probably unnecessary": 2 } as const;
  return Object.values(calls).sort((a, b) => order[a.verdict] - order[b.verdict]);
}

/* ─────────────── Bag edit ─────────────── */

export function bagEdit(p: Profile, scored: TypeScore[]): BagCall[] {
  const map = new Map(scored.map((s) => [s.id, s]));
  return p.bag.map((id) => {
    const t = TYPE_MAP[id];
    const s = map.get(id);
    const label = t?.label ?? id;
    if (!t || !s) return { id, label, verdict: "keep" as const, why: "Not scored — keep it and re-run when you can describe its job." };

    if (s.tier === "core") {
      return { id, label, verdict: "keep", why: `Scores ${s.score}. It is already doing the job your profile asks for — no reason to replace what works.` };
    }
    if (s.tier === "consider") {
      return {
        id, label, verdict: "use differently",
        why: t.lane === "base"
          ? `Scores ${s.score}. Keep it, but sheer it or use it as spot coverage rather than a full-face layer.`
          : `Scores ${s.score}. Right object, wrong frequency — reserve it for the days that actually need it.`,
      };
    }
    if (t.layerWeight >= 2 && p.coverage < 45) {
      return { id, label, verdict: "use differently", why: `Scores ${s.score}. Do not bin it — press a small amount only where you need coverage. Finish out the bottle, then do not repurchase in this lane.` };
    }
    return { id, label, verdict: "replace when finished", why: `Scores ${s.score} against this profile. No purge: use it up, then move the budget to ${bestIn(scored, t.lane)}.` };
  });
}

function bestIn(scored: TypeScore[], lane: string) {
  return scored.find((s) => s.lane === lane && s.tier === "core")?.label ?? scored[0]!.label;
}

/* ─────────────── Kit build ─────────────── */

export function buildKit(p: Profile, scored: TypeScore[]): Kit {
  const picked: TypeScore[] = [];
  const laneCap: Record<string, number> = { base: 1, spot: 2, colour: 2, finish: 1, eye: 2, lip: 1, care: 0 };
  if (p.coverage > 45 && (p.skin === "dry" || p.climate === "altitude" || p.climate === "dry" || has(p, "mature-skin"))) laneCap["care"] = 1;
  if (p.outdoors >= 2 || has(p, "performance-sport")) laneCap["care"] = Math.max(laneCap["care"] ?? 0, 1);
  if (p.desire >= 3) laneCap["colour"] = 3;
  if (p.ceiling <= 4) { laneCap["colour"] = 1; laneCap["eye"] = 1; }
  if (has(p, "rosacea") || has(p, "redness")) laneCap["spot"] = 3;
  const laneUsed: Record<string, number> = {};
  // Fill by architectural priority, not raw score, so the base and the
  // placement decisions are made before colour and finish spend the ceiling.
  const LANE_ORDER = ["care", "base", "spot", "colour", "eye", "finish", "lip"];
  const queue: TypeScore[] = [];
  const seen = new Set<string>();
  for (let round = 0; round < 3; round++) {
    for (const lane of LANE_ORDER) {
      const next = scored.filter((s) => s.lane === lane && !seen.has(s.id))[0];
      if (next) {
        seen.add(next.id);
        queue.push(next);
      }
    }
  }
  for (const s of scored) if (!seen.has(s.id)) queue.push(s);

  for (const s of queue) {
    if (picked.length >= p.ceiling) break;
    if (s.tier === "hold") continue;
    if (s.id === "no-base" && p.coverage > 18) continue;
    const used = laneUsed[s.lane] ?? 0;
    if (used >= (laneCap[s.lane] ?? 1)) continue;
    if (s.lane === "colour" && p.desire <= 0 && used >= 1) continue;
    if (s.lane === "eye" && p.timeBudget <= 5 && used >= 1) continue;
    const projected = picked.reduce((n, x) => n + x.layerWeight, 0) + s.layerWeight;
    if (projected > 4 + p.desire && s.layerWeight > 0) continue;
    picked.push(s);
    laneUsed[s.lane] = used + 1;
  }

  const layers = picked.reduce((n, x) => n + x.layerWeight, 0);
  const minutes = picked.reduce((n, x) => n + (TYPE_MAP[x.id]?.minutes ?? 1), 0);
  const projectedRisk = architecture(p, layers).risk;
  const upkeep = picked.reduce((n, x) => n + (TYPE_MAP[x.id]?.upkeep ?? 0), 0);

  // Tension = how hard desire, ceiling, minutes and upkeep pull against each
  // other. High tension is not failure; it is the number to negotiate with.
  const tension = clamp(
    Math.round(
      Math.max(0, minutes - p.timeBudget) * 3 +
        Math.max(0, upkeep - p.maintenance * 3) * 5 +
        Math.max(0, layers - (3 + p.desire)) * 8 +
        Math.max(0, p.desire * 12 - picked.filter((x) => x.lane === "colour" || x.lane === "lip").length * 14) +
        Math.max(0, p.coverage - 40) * 0.35,
    ),
  );
  const tensionNote =
    tension < 20
      ? "Your inputs agree with each other. Nothing in this kit is fighting anything else."
      : tension < 45
        ? "Mild tension — the kit is slightly ahead of your minutes or your appetite. Livable."
        : tension < 70
          ? "Real tension. Two inputs want opposite things; move coverage or minutes before adding a product."
          : "High tension. This kit is only achievable on a good morning — cut a lane rather than promising yourself more time.";

  const note =
    picked.length < p.ceiling
      ? `Your ceiling allows ${p.ceiling}; the edit only earned ${picked.length}. The remaining slots stay empty on purpose — an unused slot is not a gap.`
      : `Exactly at your ceiling of ${p.ceiling}. Anything else has to displace something, not join it.`;

  return {
    items: [...picked]
      .sort((a, b) => LANE_ORDER.indexOf(a.lane) - LANE_ORDER.indexOf(b.lane))
      .map((s) => ({
      id: s.id,
      label: s.label,
      job: TYPE_MAP[s.id]?.job ?? "",
      layerWeight: s.layerWeight,
      example: s.examples[0] ?? "",
    })),
    layers,
    minutes,
    ceiling: p.ceiling,
    projectedRisk,
    note,
    tension,
    tensionNote,
  };
}

/* ─────────────── What-if sensitivity ─────────────── */

function riskOf(p: Profile): { risk: number; kitSize: number } {
  const scored = scoreTypes(p);
  const kit = buildKit(p, scored);
  return { risk: architecture(p, kit.layers).risk, kitSize: kit.items.length };
}

export function whatIf(p: Profile): WhatIf[] {
  const base = riskOf(p);
  const moves: { id: string; label: string; move: string; next: Profile; note: string }[] = [];

  if (p.coverage > 12)
    moves.push({ id: "coverage-down", label: "Drop coverage 15", move: `${p.coverage} → ${Math.max(0, p.coverage - 15)}`, next: { ...p, coverage: Math.max(0, p.coverage - 15) }, note: "The single most efficient lever in the system." });
  if (p.coverage < 90)
    moves.push({ id: "coverage-up", label: "Add coverage 15", move: `${p.coverage} → ${Math.min(100, p.coverage + 15)}`, next: { ...p, coverage: Math.min(100, p.coverage + 15) }, note: "What it costs you to ask for more evening." });
  if (p.maintenance < 3)
    moves.push({ id: "maint-up", label: "Allow one touch-up", move: `Maintenance ${p.maintenance} → ${p.maintenance + 1}`, next: { ...p, maintenance: p.maintenance + 1 }, note: "Blotting at 2pm buys back more than any product does." });
  if (p.timeBudget > 5)
    moves.push({ id: "time-down", label: "Cut five minutes", move: `${p.timeBudget} → ${p.timeBudget - 5} min`, next: { ...p, timeBudget: Math.max(3, p.timeBudget - 5) }, note: "A shorter routine physically cannot over-build." });
  if (p.ceiling > 3)
    moves.push({ id: "ceiling-down", label: "Tighten the ceiling", move: `${p.ceiling} → ${p.ceiling - 1} products`, next: { ...p, ceiling: p.ceiling - 1 }, note: "Forces the weakest lane out of the kit." });
  if (p.desire < 3)
    moves.push({ id: "desire-up", label: "Let desire rise", move: `Desire ${p.desire} → ${p.desire + 1}`, next: { ...p, desire: p.desire + 1 }, note: "Where the appetite lands when you permit it." });
  if (!p.goals.includes("escape-pancake"))
    moves.push({ id: "goal-anti", label: "Add the anti-pancake goal", move: "Goal added", next: { ...p, goals: [...p.goals, "escape-pancake"] }, note: "Reweights every base score toward skin-like." });

  return moves
    .map((m) => {
      const r = riskOf(m.next);
      return { id: m.id, label: m.label, move: m.move, risk: r.risk, delta: r.risk - base.risk, kitSize: r.kitSize, note: m.note };
    })
    .sort((a, b) => a.delta - b.delta);
}

/* ─────────────── Coaching ─────────────── */

export function coach(p: Profile, a: Architecture, path: Pathway[], kit: Kit): { title: string; body: string }[] {
  const out: { title: string; body: string }[] = [];
  const top = a.contributions[0];
  const lead = path[0];

  out.push({
    title: a.headline,
    body: `${a.verdict} The heaviest single influence right now is ${top?.label.toLowerCase()}: ${top?.note.toLowerCase()}${top?.weight ? ` Weight in the model: ${top.weight}.` : ""} Finish (skin-like) is simply 100 − pancake risk — currently ${a.skinlike}.`,
  });

  if (lead) {
    out.push({
      title: `Why “${lead.name}” scored ${lead.fit}`,
      body: `${lead.promise} It ranked first because ${lead.because.join(" ")} The trade-off you are accepting: ${lead.tradeoff.toLowerCase()}`,
    });
  }

  if (p.desire >= 2 && p.coverage < 40) {
    out.push({
      title: "Desire is allowed",
      body: "You want to enjoy this, and your coverage appetite is still low. That is the ideal combination: spend the appetite on cream colour, lip and eye definition, where more product adds interest instead of thickness.",
    });
  }
  if (p.coverage > 55 && (p.skin === "dry" || p.climate === "altitude")) {
    out.push({
      title: "Two inputs are fighting",
      body: "High coverage on dry or high-altitude skin is the classic cake mechanism. Keep the coverage if you truly want it, but move it into concealer placement instead of a full-face layer — the eye reads placement as flawless and reads the full layer as makeup.",
    });
  }
  if (p.maintenance === 0 && p.skin === "oily") {
    out.push({
      title: "No touch-ups, live sebum",
      body: "Because you have ruled out midday maintenance, the kit leans on blotting and one thin base rather than powder that would need resetting. Blotting removes oil without adding a layer — the only free move in the system.",
    });
  }
  if (kit.items.length < 4) {
    out.push({
      title: "A short kit is a finished kit",
      body: `${kit.items.length} products cleared the bar. Resist filling the remaining slots: unused ceiling is what keeps the finish honest on a rushed morning.`,
    });
  }
  if (p.sensitivity >= 2 || has(p, "fragrance-sensitive") || has(p, "rosacea")) {
    out.push({
      title: "Reactivity handled as architecture",
      body: "Your hard filters were respected and the film count was cut rather than the brand list. This is education, not diagnosis — nothing here clears a product for reactive skin. Open Claim literacy when a 'soothing' label is doing the selling.",
    });
  }
  if (has(p, "mature-skin") || p.concerns.includes("fine lines")) {
    out.push({
      title: "Mature skin is a film problem",
      body: "Powder and full opacity settle into lines under daylight. The desk is biasing you toward prep, flexible tints and cream colour — not because mature skin is fragile, but because cake reads worse on texture that already holds a crease.",
    });
  }
  if (p.depth >= 7) {
    out.push({
      title: "Deep bands: match before layers",
      body: "If a short range almost matches, the reflex is to add more product. That is how deep skin gets pancaked by a beige that was never right. Widen the range, check undertone (olive, red-leaning, deep-neutral), then keep the film thin.",
    });
  }
  if (has(p, "performance-sport")) {
    out.push({
      title: "Sport is a transfer test",
      body: "Sweat does not care about your prestige compact. Stain colour, tinted SPF, brows and blotting papers outperform any full-face matte that will be on your collar by mile three.",
    });
  }
  if (kit.tension >= 45) {
    out.push({
      title: `Kit tension is running at ${kit.tension}`,
      body: kit.tensionNote,
    });
  }
  return out.slice(0, 7);
}

/* ─────────────── Orchestrator ─────────────── */

export function runEdit(p: Profile): Edit {
  const types = scoreTypes(p);
  const kit = buildKit(p, types);
  const arch = architecture(p, kit.layers);
  const path = pathways(p, types);
  return {
    architecture: arch,
    types,
    pathways: path,
    tools: tools(p, kit),
    bag: bagEdit(p, types),
    kit,
    coach: coach(p, arch, path, kit),
    whatIf: whatIf(p),
  };
}

/* ─────────────── Instrumented run ─────────────── */

export interface StageTiming {
  id: string;
  label: string;
  ms: number;
}

/** Same maths, timed per stage, so a stale or slow panel is visible rather than silently wrong. */
export function runEditTimed(p: Profile): { edit: Edit; timings: StageTiming[] } {
  const now = () => (typeof performance === "undefined" ? Date.now() : performance.now());
  const timings: StageTiming[] = [];
  const step = <T,>(id: string, label: string, fn: () => T): T => {
    const t0 = now();
    const out = fn();
    timings.push({ id, label, ms: Math.round((now() - t0) * 100) / 100 });
    return out;
  };

  const types = step("types", "Type scoring", () => scoreTypes(p));
  const kit = step("kit", "Kit build", () => buildKit(p, types));
  const arch = step("architecture", "Architecture", () => architecture(p, kit.layers));
  const path = step("pathways", "Pathways", () => pathways(p, types));
  const toolCalls = step("tools", "Tools", () => tools(p, kit));
  const bag = step("bag", "Bag edit", () => bagEdit(p, types));
  const coaching = step("coach", "Coaching", () => coach(p, arch, path, kit));
  const sensitivity = step("whatif", "Sensitivity", () => whatIf(p));

  return {
    edit: { architecture: arch, types, pathways: path, tools: toolCalls, bag, kit, coach: coaching, whatIf: sensitivity },
    timings,
  };
}
/* ─────────────── Scenario comparison ─────────────── */

export interface ScenarioMoveDef {
  id: string;
  label: string;
  move: (p: Profile) => Profile;
  moveLabel: (p: Profile) => string;
  note: string;
  applies?: (p: Profile) => boolean;
}

export const SCENARIO_MOVES: ScenarioMoveDef[] = [
  { id: "coverage-down", label: "Drop coverage 15", move: (p) => ({ ...p, coverage: Math.max(0, p.coverage - 15) }), moveLabel: (p) => `Coverage ${p.coverage} → ${Math.max(0, p.coverage - 15)}`, note: "The single most efficient lever in the system.", applies: (p) => p.coverage > 5 },
  { id: "coverage-up", label: "Add coverage 15", move: (p) => ({ ...p, coverage: Math.min(100, p.coverage + 15) }), moveLabel: (p) => `Coverage ${p.coverage} → ${Math.min(100, p.coverage + 15)}`, note: "What it costs to ask for more evening.", applies: (p) => p.coverage < 95 },
  { id: "maint-up", label: "Allow one touch-up", move: (p) => ({ ...p, maintenance: Math.min(3, p.maintenance + 1) }), moveLabel: (p) => `Maintenance ${p.maintenance} → ${p.maintenance + 1}`, note: "Blotting at 2pm buys back more than any product does.", applies: (p) => p.maintenance < 3 },
  { id: "maint-down", label: "Refuse all touch-ups", move: (p) => ({ ...p, maintenance: 0 }), moveLabel: () => "Maintenance → 0", note: "The finish has to be right at 8am and forgiving at 4pm.", applies: (p) => p.maintenance > 0 },
  { id: "time-down", label: "Cut five minutes", move: (p) => ({ ...p, timeBudget: Math.max(3, p.timeBudget - 5) }), moveLabel: (p) => `${p.timeBudget} → ${Math.max(3, p.timeBudget - 5)} min`, note: "A shorter routine physically cannot over-build.", applies: (p) => p.timeBudget > 5 },
  { id: "time-up", label: "Give it ten more minutes", move: (p) => ({ ...p, timeBudget: Math.min(40, p.timeBudget + 10) }), moveLabel: (p) => `${p.timeBudget} → ${Math.min(40, p.timeBudget + 10)} min`, note: "More time tempts layers that were never diagnosed.", applies: (p) => p.timeBudget < 35 },
  { id: "ceiling-down", label: "Tighten the ceiling", move: (p) => ({ ...p, ceiling: Math.max(3, p.ceiling - 1) }), moveLabel: (p) => `${p.ceiling} → ${p.ceiling - 1} objects`, note: "Forces the weakest lane out of the kit.", applies: (p) => p.ceiling > 3 },
  { id: "ceiling-up", label: "Open the ceiling", move: (p) => ({ ...p, ceiling: Math.min(12, p.ceiling + 2) }), moveLabel: (p) => `${p.ceiling} → ${Math.min(12, p.ceiling + 2)} objects`, note: "Shows what the engine would add if permitted.", applies: (p) => p.ceiling < 11 },
  { id: "desire-up", label: "Let desire rise", move: (p) => ({ ...p, desire: Math.min(3, p.desire + 1) }), moveLabel: (p) => `Desire ${p.desire} → ${p.desire + 1}`, note: "Where the appetite lands when you permit it.", applies: (p) => p.desire < 3 },
  { id: "desire-down", label: "Quiet the ritual", move: (p) => ({ ...p, desire: Math.max(0, p.desire - 1) }), moveLabel: (p) => `Desire ${p.desire} → ${p.desire - 1}`, note: "What the kit loses when appetite drops.", applies: (p) => p.desire > 0 },
  { id: "goal-anti", label: "Add the anti-pancake goal", move: (p) => ({ ...p, goals: [...p.goals, "escape-pancake"] }), moveLabel: () => "Goal added", note: "Reweights every base score toward skin-like.", applies: (p) => !p.goals.includes("escape-pancake") },
  { id: "goal-wear-less", label: "Add wear-less permission", move: (p) => ({ ...p, goals: [...p.goals, "wear-less"] }), moveLabel: () => "Goal added", note: "Opens the no-base pathway properly.", applies: (p) => !p.goals.includes("wear-less") },
  { id: "goal-simplify", label: "Add simplify", move: (p) => ({ ...p, goals: [...p.goals, "simplify"] }), moveLabel: () => "Goal added", note: "Rewards multi-use objects over single-job ones.", applies: (p) => !p.goals.includes("simplify") },
  { id: "climate-altitude", label: "Move to altitude", move: (p) => ({ ...p, climate: "altitude" }), moveLabel: (p) => `${p.climate} → altitude`, note: "Thin air is the fastest way to break an opaque film.", applies: (p) => p.climate !== "altitude" },
  { id: "climate-humid", label: "Move to humidity", move: (p) => ({ ...p, climate: "humid" }), moveLabel: (p) => `${p.climate} → humid`, note: "Humidity moves the base sideways instead of cracking it.", applies: (p) => p.climate !== "humid" },
  { id: "skin-oily", label: "Treat skin as oily", move: (p) => ({ ...p, skin: "oily" }), moveLabel: (p) => `${p.skin} → oily`, note: "Sebum travel reorders every base texture.", applies: (p) => p.skin !== "oily" },
  { id: "skin-dry", label: "Treat skin as dry", move: (p) => ({ ...p, skin: "dry" }), moveLabel: (p) => `${p.skin} → dry`, note: "Powder falls down the ranking immediately.", applies: (p) => p.skin !== "dry" },
  { id: "sens-up", label: "Assume reactive skin", move: (p) => ({ ...p, sensitivity: 3 }), moveLabel: (p) => `Sensitivity ${p.sensitivity} → 3`, note: "Cuts films rather than brands.", applies: (p) => p.sensitivity < 3 },
  { id: "filter-mineral", label: "Add mineral filter", move: (p) => ({ ...p, filters: [...p.filters, "mineral" as const] }), moveLabel: () => "Filter added", note: "A preference, never a safety claim.", applies: (p) => !p.filters.includes("mineral") },
  { id: "outdoors-up", label: "Spend the day outdoors", move: (p) => ({ ...p, outdoors: 3 }), moveLabel: (p) => `Outdoors ${p.outdoors} → 3`, note: "SPF becomes the product's real job.", applies: (p) => p.outdoors < 3 },
  { id: "depth-deep", label: "Set depth to deep", move: (p) => ({ ...p, depth: 9 }), moveLabel: (p) => `Depth ${p.depth} → 9`, note: "Match-first pressure rises; short ranges lose.", applies: (p) => p.depth < 8 },
  { id: "goal-mature", label: "Add mature-skin goal", move: (p) => ({ ...p, goals: [...p.goals, "mature-skin"], concerns: p.concerns.includes("fine lines") ? p.concerns : [...p.concerns, "fine lines"] }), moveLabel: () => "Goal added", note: "Biases toward flexible cream films.", applies: (p) => !p.goals.includes("mature-skin") },
  { id: "goal-sport", label: "Add performance/sport", move: (p) => ({ ...p, goals: [...p.goals, "performance-sport"], outdoors: Math.max(p.outdoors, 2) }), moveLabel: () => "Goal added", note: "Sweat-honest kit bias.", applies: (p) => !p.goals.includes("performance-sport") },
];

export function availableMoves(p: Profile): ScenarioMoveDef[] {
  return SCENARIO_MOVES.filter((m) => !m.applies || m.applies(p));
}

function evaluate(p: Profile, id: string, label: string, move: string, note: string, baseRisk?: number, baseBag?: BagCall[]): ScenarioResult {
  const types = scoreTypes(p);
  const kit = buildKit(p, types);
  const arch = architecture(p, kit.layers);
  const path = pathways(p, types);
  const bag = bagEdit(p, types);
  const counts = { keep: 0, differently: 0, replace: 0 };
  const changed: string[] = [];
  for (const b of bag) {
    if (b.verdict === "keep") counts.keep++;
    else if (b.verdict === "use differently") counts.differently++;
    else counts.replace++;
    const before = baseBag?.find((x) => x.id === b.id);
    if (before && before.verdict !== b.verdict) changed.push(`${b.label}: ${before.verdict} → ${b.verdict}`);
  }
  return {
    id,
    label,
    move,
    note,
    risk: arch.risk,
    delta: baseRisk === undefined ? 0 : arch.risk - baseRisk,
    skinlike: arch.skinlike,
    layers: kit.layers,
    minutes: kit.minutes,
    tension: kit.tension,
    objects: kit.items.length,
    ceiling: p.ceiling,
    kit: kit.items.map((i) => ({ label: i.label, lane: TYPE_MAP[i.id]?.lane ?? "" })),
    top: types.slice(0, 5).map((t) => ({ label: t.label, score: t.score })),
    bag: { ...counts, changed: changed.slice(0, 4) },
    pathway: path[0]?.name ?? "—",
    pathwayFit: path[0]?.fit ?? 0,
  };
}

/** Current profile plus each selected move, evaluated end to end for side-by-side reading. */
export function compareScenarios(p: Profile, moveIds: string[]): ScenarioResult[] {
  const current = evaluate(p, "current", "As you have it now", "No change", "Every other column is measured against this one.");
  const baseBag = bagEdit(p, scoreTypes(p));
  const rest = moveIds
    .map((id) => SCENARIO_MOVES.find((m) => m.id === id))
    .filter((m): m is ScenarioMoveDef => Boolean(m))
    .map((m) => evaluate(m.move(p), m.id, m.label, m.moveLabel(p), m.note, current.risk, baseBag));
  return [current, ...rest];
}
