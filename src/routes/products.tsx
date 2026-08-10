import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Page } from "@/components/mi/chrome";
import { Chip, Meter } from "@/components/mi/viz";
import { FILTERS, TYPE_MAP } from "@/lib/mi/catalog";
import { PRICE_BANDS, PRODUCT_BRANDS, PRODUCTS, searchProducts } from "@/lib/mi/products";
import type { FilterKey } from "@/lib/mi/types";

export const Route = createFileRoute("/products")({
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

export default function noop() {}

function ProductsRoute() {
  const [q, setQ] = useState("");
  const [lane, setLane] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [band, setBand] = useState<string>("");
  const [filters, setFilters] = useState<FilterKey[]>([]);
  const [thinOnly, setThinOnly] = useState(false);

  const results = useMemo(
    () =>
      searchProducts({
        q,
        lane: lane || undefined,
        brand: brand || undefined,
        band: band || undefined,
        filters,
        ...(thinOnly ? { maxLayer: 1 } : {}),
      }),
    [q, lane, brand, band, filters, thinOnly],
  );

  const clear = () => {
    setQ("");
    setLane("");
    setBrand("");
    setBand("");
    setFilters([]);
    setThinOnly(false);
  };

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
                onChange={(e) => setQ(e.target.value)}
                placeholder="serum tint, blotting, redness, Kosas, brow…"
                className="mt-3 w-full border-b border-border bg-transparent pb-3 text-xl outline-none placeholder:text-muted-foreground/60 focus:border-champagne md:text-2xl"
              />
            </label>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div>
                <p className="eyebrow">Lane</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {LANES.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLane(lane === l ? "" : l)}
                      className={`border px-3 py-2 text-[0.62rem] tracking-[0.2em] uppercase transition-colors ${
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
                      onClick={() => setBand(band === b.id ? "" : b.id)}
                      className={`border px-3 py-2 text-[0.62rem] tracking-[0.2em] uppercase transition-colors ${
                        band === b.id ? "border-champagne bg-champagne/10 text-champagne" : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setThinOnly(!thinOnly)}
                    className={`border px-3 py-2 text-[0.62rem] tracking-[0.2em] uppercase transition-colors ${
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
                        setFilters(filters.includes(f.id) ? filters.filter((x) => x !== f.id) : [...filters, f.id])
                      }
                    >
                      {f.label}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border pt-5">
              <p className="text-[0.68rem] tracking-[0.24em] uppercase text-muted-foreground">
                {results.length} of {PRODUCTS.length} shown
              </p>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="border border-border bg-transparent px-3 py-2 text-xs text-muted-foreground"
              >
                <option value="">All houses</option>
                {PRODUCT_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <button onClick={clear} className="text-[0.62rem] tracking-[0.26em] uppercase text-champagne hover:opacity-70">
                Clear everything
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10">
        {results.length === 0 ? (
          <p className="panel p-8 text-muted-foreground">
            Nothing on the desk matches that combination. Loosen a filter rather than a standard.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {results.map((p) => {
              const t = TYPE_MAP[p.typeId];
              return (
                <article key={p.id} className="panel flex flex-col gap-4 p-6">
                  <div>
                    <p className="eyebrow">{p.brand}</p>
                    <h2 className="display mt-2 text-2xl leading-tight">{p.name}</h2>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.note}</p>
                  <div className="mt-auto space-y-3 border-t border-border pt-4">
                    <p className="text-[0.62rem] tracking-[0.24em] uppercase text-muted-foreground">
                      {t?.label ?? p.typeId} · {t?.lane}
                      {p.shades ? ` · ${p.shades} shades` : ""}
                    </p>
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
                  </div>
                </article>
              );
            })}
          </div>
        )}
        <p className="mt-14 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Prices are approximate and for banding only. Shade counts and formulas change; verify current ingredient lists
          yourself. Nothing here is a safety ranking, toxin score or medical advice.
        </p>
      </div>
    </Page>
  );
}
