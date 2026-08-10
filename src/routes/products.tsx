import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Page } from "@/components/mi/chrome";
import { Chip, Meter } from "@/components/mi/viz";
import { FILTERS, TYPE_MAP } from "@/lib/mi/catalog";
import {
  PRICE_BANDS,
  PRODUCT_BRANDS,
  PRODUCTS,
  SORTS,
  loosenSuggestion,
  rankProducts,
  type SortKey,
} from "@/lib/mi/products";
import type { FilterKey } from "@/lib/mi/types";

interface ProductSearch {
  q?: string;
  lane?: string;
  brand?: string;
  band?: string;
  filters?: string;
  thin?: boolean;
  sort?: string;
  type?: string;
}

const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);

export const Route = createFileRoute("/products")({
  validateSearch: (s: Record<string, unknown>): ProductSearch => {
    const out: ProductSearch = {};
    for (const k of ["q", "lane", "brand", "band", "filters", "sort", "type"] as const) {
      const v = str(s[k]);
      if (v) out[k] = v;
    }
    if (s["thin"] === true || s["thin"] === "true") out.thin = true;
    return out;
  },
  head: () => ({
    meta: [
      { title: "Product Search · Makeup Intelligence" },
      {
        name: "description",
        content:
          "Search the desk by name, brand, lane, price and preference filters — every finished formula tied to the product type it belongs to.",
      },
      { property: "og:title", content: "Product Search · Makeup Intelligence" },
      { property: "og:description", content: "Search finished formulas by lane, layer weight, price and preference." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
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

  const q = search.q ?? "";
  const lane = search.lane ?? "";
  const brand = search.brand ?? "";
  const band = search.band ?? "";
  const typeId = search.type ?? "";
  const thinOnly = search.thin === true;
  const sort = (SORTS.some((s) => s.id === search.sort) ? (search.sort as SortKey) : "relevance") as SortKey;
  const filters = useMemo(
    () => (search.filters ? (search.filters.split(",").filter((f) => FILTERS.some((x) => x.id === f)) as FilterKey[]) : []),
    [search.filters],
  );

  const patch = (next: Partial<ProductSearch>) =>
    navigate({
      search: (prev) => {
        const merged: ProductSearch = { ...prev, ...next };
        for (const k of Object.keys(merged) as (keyof ProductSearch)[]) {
          if (merged[k] === "" || merged[k] === undefined || merged[k] === false) delete merged[k];
        }
        return merged;
      },
      replace: true,
    });

  const query = useMemo(
    () => ({
      q,
      lane: lane || undefined,
      brand: brand || undefined,
      band: band || undefined,
      typeId: typeId || undefined,
      filters,
      ...(thinOnly ? { maxLayer: 1 } : {}),
    }),
    [q, lane, brand, band, typeId, filters, thinOnly],
  );

  const ranked = useMemo(() => rankProducts(query, sort), [query, sort]);
  const terms = useMemo(() => q.trim().split(/\s+/).filter(Boolean), [q]);
  const loosen = useMemo(() => (ranked.length === 0 ? loosenSuggestion(query) : null), [ranked.length, query]);
  const activeCount =
    (q ? 1 : 0) + (lane ? 1 : 0) + (brand ? 1 : 0) + (band ? 1 : 0) + (typeId ? 1 : 0) + (thinOnly ? 1 : 0) + filters.length;

  const clear = () => navigate({ search: {}, replace: true });
  const results = ranked;

  return (
    <Page>
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10">
          <p className="eyebrow">The index</p>
          <h1 className="display mt-3 max-w-3xl text-4xl md:text-6xl">
            Search the desk by <span className="gilt-text italic">what it does</span>, not by hype
          </h1>
          <p className="mt-5 max-w-2xl leading-[1.85] text-muted-foreground">
            {PRODUCTS.length} finished formulas across {PRODUCT_BRANDS.length} houses, each tied to the product type it
            belongs to and the layer weight it costs you. Education only — never a safety ranking.
          </p>

          <div className="mt-10 panel p-6 md:p-8">
            <label className="block">
              <span className="eyebrow">Search</span>
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

            {typeId && (
              <p className="mt-5 flex flex-wrap items-center gap-3 border border-champagne/40 bg-champagne/5 px-4 py-3 text-sm">
                <span className="eyebrow">Pinned type</span>
                <span>{TYPE_MAP[typeId]?.label ?? typeId}</span>
                <button
                  onClick={() => patch({ type: undefined })}
                  className="min-h-11 text-[0.62rem] tracking-[0.24em] uppercase text-champagne hover:opacity-70"
                >
                  Unpin
                </button>
              </p>
            )}

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div>
                <p className="eyebrow">Lane</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {LANES.map((l) => (
                    <button
                      key={l}
                      onClick={() => patch({ lane: lane === l ? undefined : l })}
                      aria-pressed={lane === l}
                      className={`min-h-11 border px-4 py-2 text-[0.62rem] tracking-[0.2em] uppercase transition-colors ${
                        lane === l ? "border-champagne bg-champagne/10 text-champagne" : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="eyebrow">Price band</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PRICE_BANDS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => patch({ band: band === b.id ? undefined : b.id })}
                      aria-pressed={band === b.id}
                      className={`min-h-11 border px-4 py-2 text-[0.62rem] tracking-[0.2em] uppercase transition-colors ${
                        band === b.id ? "border-champagne bg-champagne/10 text-champagne" : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                  <button
                    onClick={() => patch({ thin: !thinOnly })}
                    aria-pressed={thinOnly}
                    className={`min-h-11 border px-4 py-2 text-[0.62rem] tracking-[0.2em] uppercase transition-colors ${
                      thinOnly ? "border-champagne bg-champagne/10 text-champagne" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Thin films only
                  </button>
                </div>
              </div>
              <div>
                <p className="eyebrow">Preferences</p>
                <div className="mt-3 grid gap-2">
                  {FILTERS.map((f) => (
                    <Chip
                      key={f.id}
                      active={filters.includes(f.id)}
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
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border pt-5">
              <p aria-live="polite" className="text-[0.68rem] tracking-[0.24em] uppercase text-muted-foreground">
                {results.length} of {PRODUCTS.length} shown
                {activeCount ? ` · ${activeCount} filter${activeCount === 1 ? "" : "s"} on` : ""}
              </p>
              <label className="flex items-center gap-2">
                <span className="sr-only">House</span>
                <select
                  value={brand}
                  onChange={(e) => patch({ brand: e.target.value || undefined })}
                  className="min-h-11 border border-border bg-transparent px-3 py-2 text-xs text-muted-foreground"
                >
                  <option value="">All houses</option>
                  {PRODUCT_BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2">
                <span className="sr-only">Sort results</span>
                <select
                  value={sort}
                  onChange={(e) => patch({ sort: e.target.value === "relevance" ? undefined : e.target.value })}
                  className="min-h-11 border border-border bg-transparent px-3 py-2 text-xs text-muted-foreground"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                onClick={clear}
                className="min-h-11 text-[0.62rem] tracking-[0.26em] uppercase text-champagne hover:opacity-70"
              >
                Clear everything
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10">
        {results.length === 0 ? (
          <div className="panel p-8 text-muted-foreground">
            <p>Nothing on the desk matches that combination. Loosen a filter rather than a standard.</p>
            {loosen && (
              <p className="mt-4 text-sm">
                The widest single move: {loosen.label} — that alone returns {loosen.count} formulas.
              </p>
            )}
          </div>
        ) : (
          <ul className="grid list-none gap-6 p-0 md:grid-cols-2 xl:grid-cols-3">
            {results.map(({ product: p, relevance, matchedOn }) => {
              const t = TYPE_MAP[p.typeId];
              return (
                <li key={p.id} className="panel flex flex-col gap-4 p-6">
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
                  <div className="mt-auto space-y-3 border-t border-border pt-4">
                    <button
                      onClick={() => patch({ type: p.typeId })}
                      className="min-h-11 text-left text-[0.62rem] tracking-[0.24em] uppercase text-muted-foreground transition-colors hover:text-champagne"
                    >
                      {t?.label ?? p.typeId} · {t?.lane}
                      {p.shades ? ` · ${p.shades} shades` : ""}
                    </button>
                    <Meter
                      value={((t?.layerWeight ?? 0) / 3) * 100}
                      label="Layer weight"
                      right={`${t?.layerWeight ?? 0} / 3`}
                      tone={(t?.layerWeight ?? 0) >= 2 ? "oxblood" : "champagne"}
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
                    <Link
                      to="/edit"
                      search={{ bag: p.typeId, stage: "Bag" }}
                      className="inline-flex min-h-11 items-center border border-champagne/60 px-4 py-2 text-[0.6rem] tracking-[0.24em] uppercase text-champagne transition-colors hover:bg-champagne/10"
                    >
                      Send this type to the edit
                    </Link>
                  </div>
                </li>
              );
            })}
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
