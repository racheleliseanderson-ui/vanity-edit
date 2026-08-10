import { TOOLS, TYPES, TYPE_MAP, type ProductType } from "./catalog";
import type {
  Architecture,
  BagCall,
  Contribution,
  Edit,
  Kit,
  Pathway,
  Profile,
  Tier,
  ToolCall,
  TypeScore,
} from "./types";

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const has = (p: Profile, g: string) => p.goals.includes(g);

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
  });

  const layers = plannedLayers ?? Math.round(1 + p.coverage / 28 + p.desire * 0.6);
  c.push({
    label: `Layer count (${layers})`,
    delta: Math.round(Math.max(0, layers - 3) * 7 - Math.max(0, 3 - layers) * 5),
    note:
      layers > 4
        ? "Every additional film multiplies edges that can lift or crack."
        : "Few layers — architecture is doing the work instead of product.",
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
  });

  c.push({
    label: "Maintenance tolerance",
    delta: p.maintenance >= 2 ? -6 : 8 - p.maintenance * 4,
    note:
      p.maintenance >= 2
        ? "You will intervene at midday, which lets a slightly richer finish survive."
        : "No touch-ups means the finish must be correct at 8am and forgiving by 4pm.",
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
  });

  if (has(p, "escape-pancake") || has(p, "wear-less")) {
    c.push({ label: "Anti-pancake goal", delta: -9, note: "The stated goal reorders scoring toward skin-like pathways first." });
  }
  if (p.sensitivity >= 2) {
    c.push({ label: "Reactivity", delta: 5, note: "Reactive skin tolerates fewer films, and heavy removal adds its own insult." });
  }
  if (p.concerns.includes("texture") || p.concerns.includes("large pores")) {
    c.push({ label: "Texture visibility", delta: 6, note: "Opaque product settles into texture — the cake reads worse, not better." });
  }
  if (p.outdoors >= 2) {
    c.push({ label: "Outdoor exposure", delta: 4, note: "Heat, sweat and UV all shorten the honest life of a thick base." });
  }

  const risk = clamp(Math.round(30 + c.reduce((s, x) => s + x.delta, 0)));
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

  return { risk, skinlike, headline, verdict, contributions: c.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)) };
}

/* ─────────────── Product-type scoring ─────────────── */

function scoreType(p: Profile, t: ProductType): TypeScore {
  let s = 50;
  const reasons: string[] = [];
  const cautions: string[] = [];

  const gap = t.coverage - p.coverage;
  s -= Math.abs(gap) * 0.42;
  if (Math.abs(gap) <= 12) reasons.push("Delivers almost exactly the coverage you asked for.");
  else if (gap > 25) cautions.push("Gives more opacity than you said you wanted.");
  else if (gap < -25 && t.lane === "base") cautions.push("Sheerer than your stated appetite — pair with spot work.");

  if (p.skin === "oily" || p.skin === "combination") {
    s += t.oil * (p.skin === "oily" ? 6 : 3.5);
    if (t.oil >= 2) reasons.push("Holds up against sebum movement.");
    if (t.oil <= -1) cautions.push("Can slide or go patchy on oilier zones.");
  }
  if (p.skin === "dry" || p.climate === "dry" || p.climate === "altitude") {
    s += t.dry * (p.climate === "altitude" ? 6 : 4.5);
    if (t.dry >= 2) reasons.push("Flexible film that survives dehydrated skin and thin air.");
    if (t.dry <= -2) cautions.push("Powder-heavy texture is the first thing to crack when skin is dry.");
  }

  s -= t.layerWeight * (has(p, "escape-pancake") ? 7 : 4);
  if (t.layerWeight === 0 && t.lane !== "care") reasons.push("Adds zero opacity to the stack.");
  if (t.layerWeight >= 3) cautions.push("Heaviest layer weight on the desk.");

  if (p.maintenance === 0) {
    s -= t.upkeep * 5;
    if (t.upkeep >= 2) cautions.push("Needs re-application you have said you will not do.");
  }
  if (p.timeBudget <= 5) s -= Math.max(0, t.minutes - 2) * 5;
  if (p.timeBudget >= 20 && t.lane !== "base") s += 3;

  if (has(p, "wear-less") && t.lane === "base") s -= t.layerWeight * 6;
  if (has(p, "wear-less") && t.id === "no-base") s += 22;
  if (t.id === "no-base" && p.coverage > 18) {
    s -= (p.coverage - 18) * 0.55;
    cautions.push("You asked for visible evening — bare skin cannot deliver it.");
  }
  if (has(p, "simplify") || has(p, "fast-polish")) {
    if (["multi-stick", "lip-cheek-balm", "cream-blush", "tinted-balm", "brow-gel"].includes(t.id)) {
      s += 9;
      reasons.push("One object, several jobs — protects a short kit.");
    }
    if (t.minutes >= 4) s -= 6;
  }
  if (has(p, "alternatives") && ["skin-tint", "tinted-spf", "multi-stick", "no-base", "mineral-powder"].includes(t.id)) {
    s += 8;
    reasons.push("Sits on an alternative pathway rather than conventional base.");
  }
  if (has(p, "redness") || p.concerns.includes("redness")) {
    if (["colour-corrector", "strategic-concealer"].includes(t.id)) { s += 12; reasons.push("Targets redness where it is, instead of covering the whole face."); }
    if (t.id === "full-foundation") { s -= 8; cautions.push("Full base is the usual over-correction for redness."); }
  }
  if (has(p, "awake") && ["brightening-concealer", "cream-highlighter", "brow-gel", "mascara"].includes(t.id)) {
    s += 11; reasons.push("Reads as awake without touching the complexion.");
  }
  if (has(p, "shine")) {
    if (["blotting-paper", "setting-powder"].includes(t.id)) { s += 12; reasons.push("Shine control that stays strategic, not full-face matte."); }
  }
  if (has(p, "dryness") && t.dry >= 2) { s += 8; reasons.push("Adds water and flex rather than powder."); }
  if (has(p, "event")) {
    if (t.longevity >= 2 && t.layerWeight <= 1) { s += 9; reasons.push("Longevity earned through the right product, not more base."); }
    if (t.id === "lip-stain" || t.id === "shadow-stick") s += 6;
  }
  if (p.outdoors >= 2 && t.id === "tinted-spf") { s += 14; reasons.push("Outdoor exposure makes SPF the product's real job."); }
  if (p.outdoors <= 0 && t.id === "tinted-spf") s -= 4;

  if (p.sensitivity >= 2) {
    s -= t.layerWeight * 4;
    if (t.id === "primer") { s -= 10; cautions.push("Another film on reactive skin without a documented wear failure."); }
    if (t.lane === "spot") { s += 6; reasons.push("Less surface area covered means less to react to."); }
  }
  if (p.filters.includes("mineral") && ["mineral-powder", "tinted-spf"].includes(t.id)) { s += 7; reasons.push("Honours your mineral filter."); }
  if (p.filters.includes("siliconeFree") && ["full-foundation", "primer"].includes(t.id)) { s -= 7; cautions.push("This lane leans silicone — verify formulas."); }
  if (p.budget === "lean" && t.lane === "colour" && t.id !== "lip-cheek-balm") s -= 3;

  if (p.desire >= 3 && ["cream-blush", "shadow-stick", "lip-stain", "cream-highlighter"].includes(t.id)) {
    s += 8; reasons.push("Desire is allowed — this is where to spend it.");
  }
  if (p.desire <= 0 && t.lane === "colour") s -= 6;

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

const PATHWAY_DEFS: { id: string; name: string; promise: string; types: string[]; tradeoff: string }[] = [
  { id: "sheer-hybrid", name: "Sheer hybrid base", promise: "One serum tint or tinted SPF, sheered, plus placed concealer.", types: ["skin-tint", "tinted-spf", "strategic-concealer", "cream-blush"], tradeoff: "You will see some of your own skin. That is the design, not a failure." },
  { id: "spot-only", name: "Spot-only architecture", promise: "No base. Concealer and corrector where the eye actually lands.", types: ["no-base", "strategic-concealer", "colour-corrector", "brow-gel"], tradeoff: "Tone is uneven in raking light — but nothing can cake." },
  { id: "one-stick", name: "One-stick capsule", promise: "A multipurpose stick for base and contour, a balm for cheeks and lips.", types: ["multi-stick", "lip-cheek-balm", "brow-gel", "mascara"], tradeoff: "Shade precision is coarser than a liquid match." },
  { id: "mineral-control", name: "Mineral control", promise: "Buildable mineral powder, applied light, blotting over re-powdering.", types: ["mineral-powder", "blotting-paper", "powder-blush", "strategic-concealer"], tradeoff: "Needs a hydrated base underneath or it reads dry by noon." },
  { id: "event-definition", name: "Definition-led event kit", promise: "Base stays honest; longevity is bought in eyes, brows and lip.", types: ["light-foundation", "shadow-stick", "lip-stain", "setting-powder", "cream-highlighter"], tradeoff: "More steps, so budget the extra ten minutes honestly." },
  { id: "skincare-first", name: "Skincare-first, colour later", promise: "Hydration and SPF carry the finish; one colour object signals effort.", types: ["tinted-spf", "tinted-balm", "cream-blush", "no-base"], tradeoff: "Coverage is essentially zero — good skincare has to do the work." },
];

export function pathways(p: Profile, scored: TypeScore[]): Pathway[] {
  const map = new Map(scored.map((s) => [s.id, s]));
  return PATHWAY_DEFS.map((d) => {
    const parts = d.types.map((id) => map.get(id)!).filter(Boolean);
    let fit = parts.reduce((s, x) => s + x.score, 0) / parts.length;
    const because: string[] = [];

    const layers = d.types.reduce((s, id) => s + (TYPE_MAP[id]?.layerWeight ?? 0), 0);
    if (layers <= 3) { fit += 5; because.push(`Only ${layers} layers of opacity in the whole pathway.`); }
    if (d.types.length > p.ceiling) { fit -= (d.types.length - p.ceiling) * 6; because.push(`Needs ${d.types.length} products against your ceiling of ${p.ceiling}.`); }
    else because.push(`Fits inside your ceiling of ${p.ceiling} products.`);

    const minutes = d.types.reduce((s, id) => s + (TYPE_MAP[id]?.minutes ?? 0), 0);
    if (minutes > p.timeBudget) { fit -= (minutes - p.timeBudget) * 1.6; because.push(`Runs about ${minutes} minutes against your ${p.timeBudget}.`); }
    else because.push(`Runs about ${minutes} minutes — inside your ${p.timeBudget}.`);

    if (p.desire >= 3 && d.id === "spot-only") { fit -= 8; because.push("You want more ritual than this pathway offers."); }
    if (p.desire <= 0 && d.id === "event-definition") fit -= 10;
    if (p.maintenance === 0 && d.id === "mineral-control") { fit -= 6; because.push("Powder control assumes some midday intervention."); }
    if ((p.climate === "altitude" || p.skin === "dry") && d.id === "mineral-control") { fit -= 8; because.push("Dry air and powder are structurally at odds."); }
    if (p.outdoors >= 2 && d.types.includes("tinted-spf")) { fit += 6; because.push("Carries your UV strategy without an extra step."); }
    if (p.sensitivity >= 2 && layers <= 3) { fit += 5; because.push("Low film count suits reactive skin."); }

    return { ...d, fit: clamp(Math.round(fit)), because: because.slice(0, 4) };
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
  set("damp-sponge", ids.has("skin-tint") || ids.has("light-foundation") || ids.has("full-foundation") ? "essential" : "optional",
    ids.has("full-foundation") ? "The only reliable way to press a heavier base thin instead of laying it on." : "Useful for sheering liquid bases; unnecessary if the kit is sticks and balms.");
  set("concealer-brush", ids.has("strategic-concealer") || ids.has("colour-corrector") ? "essential" : "optional",
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
  const laneUsed: Record<string, number> = {};
  // Fill by architectural priority, not raw score, so the base and the
  // placement decisions are made before colour and finish spend the ceiling.
  const LANE_ORDER = ["base", "spot", "colour", "eye", "finish", "lip"];
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
  };
}

/* ─────────────── Coaching ─────────────── */

export function coach(p: Profile, a: Architecture, path: Pathway[], kit: Kit): { title: string; body: string }[] {
  const out: { title: string; body: string }[] = [];
  const top = a.contributions[0];
  const lead = path[0];

  out.push({
    title: a.headline,
    body: `${a.verdict} The heaviest single influence right now is ${top?.label.toLowerCase()}: ${top?.note.toLowerCase()}`,
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
  if (p.sensitivity >= 2) {
    out.push({
      title: "Reactivity handled as architecture",
      body: "Your hard filters were respected and the film count was cut rather than the brand list. This is education, not diagnosis — nothing here clears a product for reactive skin.",
    });
  }
  return out.slice(0, 5);
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
  };
}