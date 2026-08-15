import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Page } from "@/components/mi/chrome";
import { ConfirmButton } from "@/components/mi/touch";
import { Chip, Meter } from "@/components/mi/viz";
import { FILTERS, TYPE_MAP, TYPES } from "@/lib/mi/catalog";
import { useI18n } from "@/lib/mi/i18n";
import {
  PRICE_BANDS,
  PRICE_EXTENT,
  PRODUCT_BRANDS,
  PRODUCTS,
  SORTS,
  clearRecentSearches,
  closestResults,
  facetCounts,
  loadRecentSearches,
  loosenSuggestion,
  rankProducts,
  rememberSearch,
  PRODUCT_REGIONS,
  type ProductQuery,
  type SortKey,
} from "@/lib/mi/products";
import type { FilterKey } from "@/lib/mi/types";
import { shareHead } from "@/lib/mi/seo";

interface ProductSearch {
  q?: string | undefined;
  lanes?: string | undefined;
  brands?: string | undefined;
  regions?: string | undefined;
  band?: string | undefined;
  filters?: string | undefined;
  thin?: boolean | undefined;
  sort?: string | undefined;
  type?: string | undefined;
  min?: number | undefined;
  max?: number | undefined;
}

const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
const num = (v: unknown) => {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : undefined;
};

export const Route = createFileRoute("/products")({
  validateSearch: (s: Record<string, unknown>): ProductSearch => {
    const out: ProductSearch = {};
    for (const k of ["q", "lanes", "brands", "regions", "band", "filters", "sort", "type"] as const) {
      const v = str(s[k]);
      if (v) out[k] = v;
    }
    const min = num(s["min"]);
    const max = num(s["max"]);
    if (min !== undefined) out.min = min;
    if (max !== undefined) out.max = max;
    if (s["thin"] === true || s["thin"] === "true") out.thin = true;
    return out;
  },
  head: () => shareHead("/products"),
  component: ProductsRoute,
});

const LANES = ["base", "spot", "colour", "finish", "eye", "lip", "care"] as const;

function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (!terms.length) return <>{text}</>;
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return (
    <>
      {text.split(re).map((part, i) =>
        terms.some((t) => t.toLowerCase() === part.toLowerCase()) ? (
          <mark key={i} className="bg-champagne/25 text-foreground">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function ProductsRoute() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { t } = useI18n();

  const q = search.q ?? "";
  const band = search.band ?? "";
  const typeId = search.type ?? "";
  const thinOnly = search.thin === true;
  const sort = (SORTS.some((s) => s.id === search.sort) ? (search.sort as SortKey) : "relevance") as SortKey;
  const lanes = useMemo(() => (search.lanes ? search.lanes.split(",").filter((l: string) => LANES.includes(l as (typeof LANES)[number])) : []), [search.lanes]);
  const brands = useMemo(
    () => (search.brands ? search.brands.split(",").filter((b: string) => PRODUCT_BRANDS.includes(b)) : []),
    [search.brands],
  );
  const filters = useMemo(
    () =>
      search.filters
        ? (search.filters.split(",").filter((f: string) => FILTERS.some((x) => x.id === f)) as FilterKey[])
        : [],
    [search.filters],
  );
  const regions = useMemo(
    () => (search.regions ? search.regions.split(",").filter((r: string) => PRODUCT_REGIONS.includes(r as never)) : []),
    [search.regions],
  );

  const [bagged, setBagged] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => setRecent(loadRecentSearches()), []);
  useEffect(() => {
    if (!q.trim()) return;
    const timer = setTimeout(() => setRecent(rememberSearch(q)), 1200);
    return () => clearTimeout(timer);
  }, [q]);

  const patch = (next: ProductSearch) =>
    navigate({
      search: (prev: ProductSearch) => {
        const merged: ProductSearch = { ...prev, ...next };
        for (const k of Object.keys(merged) as (keyof ProductSearch)[]) {
          if (merged[k] === "" || merged[k] === undefined || merged[k] === false) delete merged[k];
        }
        return merged;
      },
      replace: true,
    });

  const query: ProductQuery = useMemo(
    () => ({
      q,
      lanes: lanes.length ? lanes : undefined,
      brands: brands.length ? brands : undefined,
      regions: regions.length ? regions : undefined,
      band: band || undefined,
      typeId: typeId || undefined,
      filters,
      minPrice: search.min,
      maxPrice: search.max,
      ...(thinOnly ? { maxLayer: 1 } : {}),
    }),
    [q, lanes, brands, regions, band, typeId, filters, thinOnly, search.min, search.max],
  );

  const results = useMemo(() => rankProducts(query, sort), [query, sort]);
  const terms = useMemo(() => q.trim().split(/\s+/).filter(Boolean), [q]);
  const loosen = useMemo(() => (results.length === 0 ? loosenSuggestion(query) : null), [results.length, query]);
  const closest = useMemo(() => (results.length === 0 ? closestResults(query, sort) : []), [results.length, query, sort]);
  const laneCounts = useMemo(() => facetCounts(query, "lanes", [...LANES]), [query]);
  const regionCounts = useMemo(() => facetCounts(query, "regions", [...PRODUCT_REGIONS]), [query]);
  const filterCounts = useMemo(
    () => facetCounts({ ...query, filters: filters as unknown as string[] } as ProductQuery, "filters", FILTERS.map((f) => f.id)),
    [query, filters],
  );
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of results) counts[r.product.typeId] = (counts[r.product.typeId] ?? 0) + 1;
    return counts;
  }, [results]);
  const activeTokens: { label: string; clear: () => void }[] = [
    ...(q ? [{ label: `“${q}”`, clear: () => patch({ q: undefined }) }] : []),
    ...lanes.map((l: string) => ({ label: l, clear: () => patch({ lanes: lanes.filter((x: string) => x !== l).join(",") || undefined }) })),
    ...brands.map((b: string) => ({ label: b, clear: () => patch({ brands: brands.filter((x: string) => x !== b).join(",") || undefined }) })),
    ...regions.map((r: string) => ({
      label: r,
      clear: () => patch({ regions: regions.filter((x: string) => x !== r).join(",") || undefined }),
    })),
    ...(band ? [{ label: PRICE_BANDS.find((b) => b.id === band)?.label ?? band, clear: () => patch({ band: undefined }) }] : []),
    ...(search.min !== undefined || search.max !== undefined
      ? [{ label: `$${search.min ?? PRICE_EXTENT.min}–$${search.max ?? PRICE_EXTENT.max}`, clear: () => patch({ min: undefined, max: undefined }) }]
      : []),
    ...(typeId ? [{ label: TYPE_MAP[typeId]?.label ?? typeId, clear: () => patch({ type: undefined }) }] : []),
    ...(thinOnly ? [{ label: t("search.thin"), clear: () => patch({ thin: undefined }) }] : []),
    ...filters.map((f) => ({
      label: FILTERS.find((x) => x.id === f)?.label ?? f,
      clear: () => patch({ filters: filters.filter((x) => x !== f).join(",") || undefined }),
    })),
  ];

  const clear = () => navigate({ search: {}, replace: true });
  const typesWithProducts = useMemo(
    () => TYPES.filter((ty) => PRODUCTS.some((p) => p.typeId === ty.id)),
    [],
  );

  return (
    <Page>
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10">
          <p className="eyebrow">The index</p>
          <h1 className="display mt-3 max-w-3xl text-4xl md:text-6xl">
            Search the desk by
            <br className="sm:hidden" /> <span className="gilt-text italic">what it does</span>, not by hype
          </h1>
          <p className="mt-5 max-w-2xl leading-[1.85] text-muted-foreground">
            {PRODUCTS.length} finished formulas across {PRODUCT_BRANDS.length} houses, each tied to the product type it
            belongs to and the layer weight it costs you. Education only — never a safety ranking.
          </p>

          <div className="mt-10 panel p-5 md:p-8">
            <label className="block">
              <span className="eyebrow">{t("search.label")}</span>
              <input
                value={q}
                onChange={(e) => patch({ q: e.target.value })}
                type="search"
                enterKeyHint="search"
                autoComplete="off"
                placeholder="serum tint, blotting, redness, Kosas, brow…"
                className="mt-3 min-h-11 w-full border-b border-border bg-transparent pb-3 text-lg outline-none placeholder:text-muted-foreground/60 focus:border-champagne md:text-2xl"
              />
            </label>

            {recent.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-[0.58rem] tracking-[0.26em] uppercase text-muted-foreground">{t("search.recent")}</span>
                {recent.map((r) => (
                  <button
                    key={r}
                    onClick={() => patch({ q: r })}
                    className="tap border border-border px-3 text-xs text-muted-foreground transition-colors hover:border-champagne/50 hover:text-foreground"
                  >
                    {r}
                  </button>
                ))}
                <button
                  onClick={() => setRecent(clearRecentSearches())}
                  className="tap px-2 text-[0.58rem] tracking-[0.24em] uppercase text-muted-foreground hover:text-rouge"
                >
                  Forget
                </button>
              </div>
            )}

            {activeTokens.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
                {activeTokens.map((tok) => (
                  <button
                    key={tok.label}
                    onClick={tok.clear}
                    className="tap inline-flex items-center gap-2 border border-champagne/50 bg-champagne/10 px-3 text-[0.62rem] tracking-[0.16em] uppercase text-champagne transition-colors hover:bg-champagne/20"
                  >
                    {tok.label}
                    <span aria-hidden>×</span>
                    <span className="sr-only">Remove this filter</span>
                  </button>
                ))}
                <button
                  onClick={clear}
                  className="tap px-3 text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground hover:text-foreground"
                >
                  {t("search.clear")}
                </button>
              </div>
            )}

            <div className="mt-8 grid gap-7 lg:grid-cols-3">
              <div>
                <p className="eyebrow">{t("search.lane")}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {LANES.map((l) => {
                    const on = lanes.includes(l);
                    const count = laneCounts[l] ?? 0;
                    return (
                      <button
                        key={l}
                        onClick={() => patch({ lanes: (on ? lanes.filter((x: string) => x !== l) : [...lanes, l]).join(",") || undefined })}
                        aria-pressed={on}
                        disabled={!on && count === 0}
                        className={`tap border px-4 text-[0.62rem] tracking-[0.2em] uppercase transition-colors disabled:opacity-30 ${
                          on ? "border-champagne bg-champagne/10 text-champagne" : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {l} <span className="opacity-60">{count}</span>
                      </button>
                    );
                  })}
                </div>

                <p className="eyebrow mt-7">Where it is sold</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Region is availability, not a quality ranking.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PRODUCT_REGIONS.map((r) => {
                    const on = regions.includes(r);
                    const count = regionCounts[r] ?? 0;
                    return (
                      <button
                        key={r}
                        onClick={() =>
                          patch({
                            regions: (on ? regions.filter((x: string) => x !== r) : [...regions, r]).join(",") || undefined,
                          })
                        }
                        aria-pressed={on}
                        disabled={!on && count === 0}
                        className={`tap border px-4 text-[0.62rem] tracking-[0.2em] uppercase transition-colors disabled:opacity-30 ${
                          on
                            ? "border-champagne bg-champagne/10 text-champagne"
                            : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {r} <span className="opacity-60">{count}</span>
                      </button>
                    );
                  })}
                </div>

                <p className="eyebrow mt-7">Product type</p>
                <select
                  value={typeId}
                  onChange={(e) => patch({ type: e.target.value || undefined })}
                  className="tap mt-3 w-full border border-border bg-transparent px-3 text-xs text-muted-foreground"
                >
                  <option value="">Every type</option>
                  {typesWithProducts.map((ty) => (
                    <option key={ty.id} value={ty.id}>
                      {ty.label}
                      {typeCounts[ty.id] ? ` · ${typeCounts[ty.id]}` : ""}
                    </option>
                  ))}
                </select>
                {typeId && (
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {TYPE_MAP[typeId]?.job} · layer weight {TYPE_MAP[typeId]?.layerWeight} of 3
                  </p>
                )}
              </div>

              <div>
                <p className="eyebrow">{t("search.band")}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PRICE_BANDS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => patch({ band: band === b.id ? undefined : b.id })}
                      aria-pressed={band === b.id}
                      className={`tap border px-4 text-[0.62rem] tracking-[0.2em] uppercase transition-colors ${
                        band === b.id ? "border-champagne bg-champagne/10 text-champagne" : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
                <div className="mt-6 space-y-4">
                  <RangeField
                    label={`Lowest price · $${search.min ?? PRICE_EXTENT.min}`}
                    value={search.min ?? PRICE_EXTENT.min}
                    onChange={(n) => patch({ min: n === PRICE_EXTENT.min ? undefined : n })}
                  />
                  <RangeField
                    label={`Highest price · $${search.max ?? PRICE_EXTENT.max}`}
                    value={search.max ?? PRICE_EXTENT.max}
                    onChange={(n) => patch({ max: n === PRICE_EXTENT.max ? undefined : n })}
                  />
                  <button
                    onClick={() => patch({ thin: !thinOnly })}
                    aria-pressed={thinOnly}
                    className={`tap w-full border px-4 text-[0.62rem] tracking-[0.2em] uppercase transition-colors ${
                      thinOnly ? "border-champagne bg-champagne/10 text-champagne" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t("search.thin")}
                  </button>
                </div>
              </div>

              <div>
                <p className="eyebrow">{t("search.prefs")}</p>
                <div className="mt-3 grid gap-2">
                  {FILTERS.map((f) => (
                    <Chip
                      key={f.id}
                      active={filters.includes(f.id)}
                      note={`${filterCounts[f.id] ?? 0} formulas`}
                      onClick={() =>
                        patch({
                          filters:
                            (filters.includes(f.id) ? filters.filter((x) => x !== f.id) : [...filters, f.id]).join(",") ||
                            undefined,
                        })
                      }
                    >
                      {f.label}
                    </Chip>
                  ))}
                </div>
                <p className="eyebrow mt-7">{t("search.houses")}</p>
                <select
                  multiple
                  value={brands}
                  onChange={(e) =>
                    patch({
                      brands:
                        [...e.target.selectedOptions].map((o) => o.value).join(",") || undefined,
                    })
                  }
                  className="mt-3 h-32 w-full border border-border bg-transparent px-3 py-2 text-xs text-muted-foreground"
                >
                  {PRODUCT_BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border pt-5">
              <p aria-live="polite" className="text-[0.68rem] tracking-[0.24em] uppercase text-muted-foreground">
                {results.length} of {PRODUCTS.length} {t("search.shown")}
                {activeTokens.length ? ` · ${activeTokens.length} ${t("search.filtersOn")}` : ""}
              </p>
              <label className="flex items-center gap-2">
                <span className="sr-only">{t("search.sort")}</span>
                <select
                  value={sort}
                  onChange={(e) => patch({ sort: e.target.value === "relevance" ? undefined : e.target.value })}
                  className="tap border border-border bg-transparent px-3 text-xs text-muted-foreground"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10">
        {results.length === 0 ? (
          <div className="space-y-8">
            <div className="panel p-6 md:p-8">
              <p className="display text-2xl">Nothing on the desk matches that combination.</p>
              <p className="mt-3 text-sm text-muted-foreground">Loosen a filter rather than a standard.</p>
              {loosen && (
                <p className="mt-4 text-sm">
                  The filter doing the excluding: <span className="text-champagne">{loosen.label}</span> — that alone
                  returns {loosen.count} formulas.
                </p>
              )}
            </div>
            {closest.length > 0 && (
              <div>
                <p className="eyebrow">Closest on the desk</p>
                <ul className="mt-6 grid list-none gap-6 p-0 md:grid-cols-2 xl:grid-cols-3">
                  {closest.map(({ product: p }) => (
                    <ResultCard key={p.id} p={p} terms={terms} matchedOn={[]} relevance={0} onPin={() => patch({ type: p.typeId })} bagged={bagged} setBagged={setBagged} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <ul className="grid list-none gap-6 p-0 md:grid-cols-2 xl:grid-cols-3">
            {results.map(({ product: p, relevance, matchedOn }) => (
              <ResultCard
                key={p.id}
                p={p}
                terms={terms}
                relevance={relevance}
                matchedOn={matchedOn}
                onPin={() => patch({ type: p.typeId })}
                bagged={bagged}
                setBagged={setBagged}
              />
            ))}
          </ul>
        )}
        <p className="mt-14 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Prices are approximate and for banding only. Shade counts and formulas change; verify current ingredient lists
          yourself. Nothing here is a safety ranking, toxin score or medical advice.
        </p>
      </div>
    </Page>
  );
}

function RangeField({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <span className="text-[0.62rem] tracking-[0.2em] uppercase text-muted-foreground">{label}</span>
      <input
        type="range"
        min={PRICE_EXTENT.min}
        max={PRICE_EXTENT.max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-11 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-[3px] [&::-webkit-slider-runnable-track]:bg-secondary [&::-webkit-slider-thumb]:mt-[-11px] [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--champagne)]"
      />
    </label>
  );
}

function ResultCard({
  p,
  terms,
  relevance,
  matchedOn,
  onPin,
  bagged,
  setBagged,
}: {
  p: import("@/lib/mi/products").DeskProduct;
  terms: string[];
  relevance: number;
  matchedOn: string[];
  onPin: () => void;
  bagged: string[];
  setBagged: (next: string[]) => void;
}) {
  const ty = TYPE_MAP[p.typeId];
  const { t } = useI18n();
  const inBag = bagged.includes(p.typeId);
  return (
    <li className="panel flex flex-col gap-4 p-6">
      <div>
        <p className="eyebrow">
          <Highlight text={p.brand} terms={terms} />
        </p>
        <h2 className="display mt-2 text-2xl leading-tight">
          <Highlight text={p.name} terms={terms} />
        </h2>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        <Highlight text={p.note} terms={terms} />
      </p>
      {p.whenNot && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="tracking-[0.18em] uppercase text-champagne">When not to buy · </span>
          {p.whenNot}
        </p>
      )}
      {p.claims && p.claims.length > 0 && (
        <p className="text-[0.58rem] tracking-[0.18em] uppercase text-muted-foreground">
          Claim tags · {p.claims.join(" · ")}
        </p>
      )}
      <div className="mt-auto space-y-3 border-t border-border pt-4">
        <button
          onClick={onPin}
          className="tap block text-left text-[0.62rem] tracking-[0.24em] uppercase text-muted-foreground transition-colors hover:text-champagne"
        >
          {ty?.label ?? p.typeId} · {ty?.lane}
          {p.shades ? ` · ${p.shades} shades` : ""}
        </button>
        <p className="text-xs leading-snug text-muted-foreground">{ty?.job}</p>
        <Meter
          value={((ty?.layerWeight ?? 0) / 3) * 100}
          label="Film cost"
          right={`${ty?.layerWeight ?? 0} / 3`}
          tone={(ty?.layerWeight ?? 0) >= 2 ? "oxblood" : "champagne"}
        />
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <span className="display text-xl tabular-nums">${p.price}</span>
          <span className="text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground">
            {p.filters.length ? p.filters.join(" · ") : "no filter claims"}
          </span>
        </div>
        {terms.length > 0 && matchedOn.length > 0 && (
          <p className="text-[0.6rem] tracking-[0.18em] uppercase text-muted-foreground/80">
            Matched on {matchedOn.join(", ")} · relevance {relevance}
          </p>
        )}
        <ConfirmButton
          onPress={() => {
            setBagged([...bagged, p.typeId]);
            window.location.href = `/edit?bag=${encodeURIComponent(p.typeId)}&stage=Bag`;
          }}
          confirmed={t("edit.inBag")}
          className="w-full"
        >
          {inBag ? t("edit.inBag") : t("edit.addToBag")}
        </ConfirmButton>
      </div>
    </li>
  );
}
