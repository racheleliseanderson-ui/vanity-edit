import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Page } from "@/components/mi/chrome";
import { CopyLinkButton } from "@/components/mi/copy-link";
import { ScrollRail } from "@/components/mi/scroll-rail";
import { Sheet } from "@/components/mi/touch";
import { BRANDS, FAMILIES, PRICE_TIERS, type PriceTier } from "@/lib/mi/catalog";
import { pageUrl } from "@/lib/mi/share";
import { shareHead } from "@/lib/mi/seo";
import still from "@/assets/desk-still.jpg";

interface DeskSearch {
  house?: string | undefined;
  family?: string | undefined;
  tier?: string | undefined;
  q?: string | undefined;
}

export const Route = createFileRoute("/desk")({
  validateSearch: (s: Record<string, unknown>): DeskSearch => {
    const out: DeskSearch = {};
    for (const k of ["house", "family", "tier", "q"] as const) {
      const v = s[k];
      if (typeof v === "string" && v) out[k] = v;
    }
    return out;
  },
  head: () => shareHead("/desk"),
  component: Desk,
});

function Desk() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const family = search.family && FAMILIES.includes(search.family as (typeof FAMILIES)[number]) ? search.family : "all";
  const tier = search.tier && PRICE_TIERS.some((t) => t.id === search.tier) ? search.tier : "all";
  const house = search.house ?? "";
  const q = search.q ?? "";
  const [sheetOpen, setSheetOpen] = useState(false);

  const patch = (next: DeskSearch) =>
    navigate({
      search: (prev: DeskSearch) => {
        const merged: DeskSearch = { ...prev, ...next };
        for (const k of Object.keys(merged) as (keyof DeskSearch)[]) {
          if (merged[k] === "" || merged[k] === undefined || merged[k] === "all") delete merged[k];
        }
        return merged;
      },
      replace: true,
    });

  const shown = useMemo(() => {
    const query = (q || house).trim().toLowerCase();
    return BRANDS.filter((b) => {
      if (family !== "all" && b.family !== family && b.also !== family) return false;
      if (tier !== "all" && b.tier !== tier) return false;
      if (query && !b.name.toLowerCase().includes(query) && !b.lane.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [family, tier, q, house]);

  const tierCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of PRICE_TIERS) c[t.id] = BRANDS.filter((b) => b.tier === t.id).length;
    return c;
  }, []);

  useEffect(() => {
    if (!house) return;
    const id = `house-${house.replace(/\s+/g, "-").toLowerCase()}`;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [house]);

  const activeLabel = [
    family !== "all" ? family : null,
    tier !== "all" ? PRICE_TIERS.find((t) => t.id === tier)?.label : null,
    house || q || null,
  ]
    .filter(Boolean)
    .join(" · ");

  const filters = (
    <>
      <label className="block">
        <span className="sr-only">Search houses</span>
        <input
          value={q || house}
          onChange={(e) => patch({ q: e.target.value || undefined, house: undefined })}
          type="search"
          placeholder="Search a house"
          className="min-h-11 w-full border border-border bg-transparent px-3 text-sm placeholder:text-muted-foreground"
        />
      </label>
      <div className="mt-3">
        <ScrollRail label="Families">
          <div className="flex gap-2">
            {["all", ...FAMILIES].map((f) => (
              <button
                key={f}
                onClick={() => patch({ family: f === "all" ? undefined : f })}
                className={`whitespace-nowrap border px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase transition-colors ${
                  family === f ? "border-champagne bg-champagne/10 text-champagne" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? `All houses (${BRANDS.length})` : f}
              </button>
            ))}
          </div>
        </ScrollRail>
      </div>
      <div className="mt-3">
        <ScrollRail label="Price tiers">
          <div className="flex gap-2">
            <button
              onClick={() => patch({ tier: undefined })}
              className={`whitespace-nowrap border px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase transition-colors ${
                tier === "all" ? "border-champagne bg-champagne/10 text-champagne" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              All tiers
            </button>
            {PRICE_TIERS.map((t) => (
              <button
                key={t.id}
                onClick={() => patch({ tier: t.id })}
                className={`whitespace-nowrap border px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase transition-colors ${
                  tier === t.id ? "border-champagne bg-champagne/10 text-champagne" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label} ({tierCounts[t.id] ?? 0})
              </button>
            ))}
          </div>
        </ScrollRail>
      </div>
    </>
  );

  return (
    <Page>
      <section className="relative isolate overflow-hidden border-b border-border">
        <img src={still} alt="Dark still life of cream pigment and a gold compact" width={1600} height={1104} className="h-[44vh] w-full object-cover opacity-70" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-veil)" }} />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-5 pb-10 md:px-10">
          <p className="eyebrow">Vanity or Vice · seeded desk</p>
          <h1 className="display mt-4 text-5xl md:text-7xl">
            Six families,<br />
            <span className="gilt-text italic">four price tiers</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Drugstore through luxury — same architecture questions. Tier is access and positioning, never a quality ranking.
            Each house says what earns the bag and what loses it. {BRANDS.length} houses on the desk.
          </p>
        </div>
      </section>

      <div className="sticky top-[86px] z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto hidden max-w-[1400px] space-y-3 px-5 py-4 md:block md:px-10">
          {filters}
          <CopyLinkButton href={pageUrl("/desk", search)} label="Copy link" className="px-5 py-2" />
        </div>
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-5 py-3 md:hidden">
          <p className="min-w-0 flex-1 truncate text-[0.62rem] tracking-[0.18em] uppercase text-muted-foreground">
            {activeLabel || `All ${BRANDS.length} houses`}
          </p>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="min-h-11 shrink-0 border border-champagne/50 px-4 text-[0.62rem] tracking-[0.22em] uppercase text-champagne"
          >
            Filters
          </button>
        </div>
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filter the desk">
        {filters}
        <CopyLinkButton href={pageUrl("/desk", search)} label="Copy link" className="mt-4 w-full justify-center" />
        <button
          type="button"
          onClick={() => {
            patch({ family: undefined, tier: undefined, house: undefined, q: undefined });
            setSheetOpen(false);
          }}
          className="mt-3 min-h-11 w-full border border-border text-[0.62rem] tracking-[0.24em] uppercase text-muted-foreground"
        >
          Clear filters
        </button>
      </Sheet>

      <section className="mx-auto max-w-[1400px] px-5 py-10 md:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRICE_TIERS.map((t) => (
            <div key={t.id} className="border border-border p-5">
              <p className="text-[0.62rem] tracking-[0.26em] uppercase text-champagne">{t.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.band}</p>
              <p className="mt-3 text-[0.65rem] tracking-[0.18em] uppercase text-muted-foreground">
                {tierCounts[t.id] ?? 0} houses on the desk
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10">
        <div className="divide-y divide-border border-y border-border">
          {shown.map((b) => (
            <article key={b.name} id={`house-${b.name.replace(/\s+/g, "-").toLowerCase()}`} className="grid gap-8 py-10 md:grid-cols-[1fr_1.4fr]">
              <div>
                <p className="text-[0.65rem] tracking-[0.26em] uppercase text-champagne">
                  {b.family}
                  {b.also ? ` · also ${b.also}` : ""}
                  <span className="text-muted-foreground"> · {tierLabel(b.tier)}</span>
                </p>
                <h2 className="display mt-3 text-4xl md:text-5xl">{b.name}</h2>
                <p className="mt-2 text-sm italic text-muted-foreground">{b.lane}</p>
                {b.filters.length > 0 && (
                  <p className="mt-4 text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground">
                    Filters honoured · {b.filters.join(" · ")}
                  </p>
                )}
                {b.region && (
                  <p className="mt-2 text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground">
                    Easiest to buy · {b.region}
                  </p>
                )}
              </div>
              <div>
                <p className="leading-[1.9] text-muted-foreground">{b.note}</p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-[0.62rem] tracking-[0.26em] uppercase text-champagne">Earns the bag</p>
                    <p className="mt-2 text-sm leading-relaxed">{b.earns}</p>
                    <p className="mt-4 text-[0.62rem] tracking-[0.26em] uppercase text-champagne">Best when</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {b.best.map((x) => <li key={x}>{x}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[0.62rem] tracking-[0.26em] uppercase text-muted-foreground">Loses the bag</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.loses}</p>
                    <p className="mt-4 text-[0.62rem] tracking-[0.26em] uppercase text-muted-foreground">Less ideal when</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {b.less.map((x) => <li key={x}>{x}</li>)}
                    </ul>
                  </div>
                </div>
                <p className="mt-6 text-sm">
                  <span className="text-[0.62rem] tracking-[0.26em] uppercase text-muted-foreground">Desk examples · </span>
                  {b.examples.join(" · ")}
                </p>
                {b.availability && (
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{b.availability}</p>
                )}
              </div>
            </article>
          ))}
        </div>

        {shown.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">No houses in this cut. Open a filter.</p>
            <button
              type="button"
              onClick={() => patch({ family: undefined, tier: undefined, house: undefined, q: undefined })}
              className="mt-5 min-h-11 border border-champagne/60 px-6 text-[0.62rem] tracking-[0.24em] uppercase text-champagne"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="mt-16 panel p-10">
          <p className="display text-3xl md:text-4xl">Match the houses to your own filters</p>
          <p className="mt-4 max-w-xl leading-[1.9] text-muted-foreground">
            Run the edit with mineral, botanical, fragrance-free or multi-use goals and the desk surfaces examples in
            context — with no fear marketing and no safety claims. Price tier never overrides architecture.
          </p>
          <Link to="/edit" className="mt-8 inline-flex border border-champagne/50 px-7 py-4 text-[0.72rem] tracking-[0.3em] uppercase text-champagne transition-colors hover:bg-champagne hover:text-accent-foreground">
            Begin the edit
          </Link>
        </div>
      </section>
    </Page>
  );
}

function tierLabel(t: PriceTier) {
  return PRICE_TIERS.find((x) => x.id === t)?.label ?? t;
}
