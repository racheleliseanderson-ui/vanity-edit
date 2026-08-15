import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Page } from "@/components/mi/chrome";
import { BRANDS, FAMILIES, PRICE_TIERS, type PriceTier } from "@/lib/mi/catalog";
import { shareHead } from "@/lib/mi/seo";
import still from "@/assets/desk-still.jpg";

export const Route = createFileRoute("/desk")({
  head: () => shareHead("/desk"),
  component: Desk,
});

function Desk() {
  const [family, setFamily] = useState<string>("all");
  const [tier, setTier] = useState<string>("all");
  const shown = useMemo(() => {
    return BRANDS.filter((b) => {
      if (family !== "all" && b.family !== family && b.also !== family) return false;
      if (tier !== "all" && b.tier !== tier) return false;
      return true;
    });
  }, [family, tier]);

  const tierCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of PRICE_TIERS) c[t.id] = BRANDS.filter((b) => b.tier === t.id).length;
    return c;
  }, []);

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
            Each house says what earns the bag and what loses it.
          </p>
        </div>
      </section>

      <div className="sticky top-[86px] z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-[1400px] space-y-3 px-5 py-4 md:px-10">
          <div className="flex gap-2 overflow-x-auto">
            {["all", ...FAMILIES].map((f) => (
              <button
                key={f}
                onClick={() => setFamily(f)}
                className={`whitespace-nowrap border px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase transition-colors ${
                  family === f ? "border-champagne bg-champagne/10 text-champagne" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? `All houses (${BRANDS.length})` : f}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setTier("all")}
              className={`whitespace-nowrap border px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase transition-colors ${
                tier === "all" ? "border-champagne bg-champagne/10 text-champagne" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              All tiers
            </button>
            {PRICE_TIERS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTier(t.id)}
                className={`whitespace-nowrap border px-4 py-2 text-[0.68rem] tracking-[0.22em] uppercase transition-colors ${
                  tier === t.id ? "border-champagne bg-champagne/10 text-champagne" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label} ({tierCounts[t.id] ?? 0})
              </button>
            ))}
          </div>
        </div>
      </div>

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
            <article key={b.name} className="grid gap-8 py-10 md:grid-cols-[1fr_1.4fr]">
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
          <p className="py-16 text-center text-muted-foreground">No houses in this family × tier cut. Open a filter.</p>
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
