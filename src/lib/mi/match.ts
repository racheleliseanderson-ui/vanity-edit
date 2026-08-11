import { TYPE_MAP } from "./catalog";
import { PRODUCTS, type DeskProduct } from "./products";
import type { KitItem, Profile } from "./types";

export interface Match {
  product: DeskProduct;
  fit: number;
  why: string;
  shade?: string;
}

const BAND: Record<Profile["budget"], (n: number) => number> = {
  lean: (n) => (n <= 25 ? 14 : n <= 40 ? 6 : n <= 55 ? -6 : -16),
  mid: (n) => (n <= 20 ? 6 : n <= 50 ? 12 : n <= 65 ? 2 : -8),
  open: (n) => (n >= 50 ? 10 : n >= 30 ? 6 : 2),
};

const DEPTH_FAMILY = [
  "porcelain",
  "fair",
  "light",
  "light-medium",
  "medium",
  "medium-tan",
  "tan",
  "deep-tan",
  "deep",
  "rich deep",
];

/** A shade family and direction — never a promise of an exact match. */
export function shadeFamily(p: Profile, product: DeskProduct): string | undefined {
  const t = TYPE_MAP[product.typeId];
  if (!t) return undefined;
  const shaded = ["base", "spot"].includes(t.lane) || product.typeId === "brow-pencil";
  if (!shaded) return undefined;
  const family = DEPTH_FAMILY[Math.min(9, Math.max(0, p.depth - 1))] ?? "medium";
  const LEAN: Record<string, string> = {
    cool: "cool or rosy side",
    neutral: "neutral side",
    warm: "warm or golden side",
    olive: "olive or green-grey side — most ranges over-correct this into pink",
    "golden-olive": "golden-olive side, between yellow and green",
    "deep-neutral": "deep neutral side, avoiding anything ashy",
    "red-leaning": "red or mahogany side, not orange-yellow",
  };
  const lean = LEAN[p.undertone] ?? "neutral side";
  const range = product.shades && product.shades >= 20 ? "the range is wide enough to split hairs" : "the range is short, so expect to blend";
  return `Look in the ${family} band, ${lean} — ${range}.`;
}

/** Rank the desk's finished formulas against one kit slot for this profile. */
export function matchSlot(p: Profile, item: KitItem, limit = 3): Match[] {
  const t = TYPE_MAP[item.id];
  const pool = PRODUCTS.filter((x) => x.typeId === item.id);
  return pool
    .map((product) => {
      let fit = 50;
      const why: string[] = [];

      const budget = BAND[p.budget](product.price);
      fit += budget;
      if (budget >= 10) why.push(`priced for a ${p.budget} desk`);
      if (budget <= -8) why.push(`above where a ${p.budget} desk usually sits`);

      const met = p.filters.filter((f) => product.filters.includes(f));
      const missed = p.filters.filter((f) => !product.filters.includes(f));
      fit += met.length * 11 - missed.length * 9;
      if (met.length) why.push(`meets ${met.length} of your stated preferences`);
      if (missed.length) why.push(`does not state ${missed.join(", ")}`);

      if (p.sensitivity >= 2 && product.filters.includes("fragranceFree")) {
        fit += 8;
        why.push("fragrance-free, which matters at your reactivity");
      }
      if (p.skin === "oily" && (t?.oil ?? 0) > 0) fit += 5;
      if (p.skin === "dry" && (t?.dry ?? 0) > 0) fit += 5;

      if (product.shades && product.shades >= 20) {
        fit += 6;
        why.push(`${product.shades} shades to place you in`);
      } else if (product.shades && product.shades <= 6 && ["base", "spot"].includes(t?.lane ?? "")) {
        fit -= 7;
        why.push("a short shade range for a base");
      }

      if ((t?.layerWeight ?? 0) <= 1) fit += 4;

      const shade = shadeFamily(p, product);
      return {
        product,
        fit: Math.max(4, Math.min(98, Math.round(fit))),
        why: why.length ? `${why.slice(0, 2).join("; ")}.` : product.note,
        ...(shade ? { shade } : {}),
      };
    })
    .sort((a, b) => b.fit - a.fit)
    .slice(0, limit);
}

export function matchKit(p: Profile, items: KitItem[]): { item: KitItem; matches: Match[] }[] {
  return items.map((item) => ({ item, matches: matchSlot(p, item) }));
}
