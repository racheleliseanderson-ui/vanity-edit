import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Page } from "@/components/mi/chrome";
import { BRANDS, FAMILIES } from "@/lib/mi/catalog";
import still from "@/assets/desk-still.jpg";

export const Route = createFileRoute("/desk")({
  head: () => ({
    meta: [
      { title: "The desk · Makeup Intelligence" },
      {
        name: "description",
        content:
          "Six desk families of houses held as educational examples — mineral, hybrid SPF, skin tint, botanical, multi-use and sensitive-aware lanes. Never rankings or toxin scores.",
      },
      { property: "og:title", content: "The desk · Makeup Intelligence" },
      { property: "og:description", content: "Why each house sits on the Good-for-You desk." },
    ],
  }),
  component: Desk,
});

function Desk() {
  const [family, setFamily] = useState<string>("all");
  const shown = family === "all" ? BRANDS : BRANDS.filter((b) => b.family === family || b.also === family);

  return (
    <Page>
      <section className="relative isolate overflow-hidden border-b border-border">
        <img src={still} alt="Dark still life of cream pigment and a gold compact" width={1600} height={1104} className="h-[44vh] w-full object-cover opacity-70" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-veil)" }} />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-5 pb-10 md:px-10">
          <p className="eyebrow">Vanity or Vice · seeded desk</p>
          <h1 className="display mt-4 text-5xl md:text-7xl">
            Six families,<br />
            <span className="gilt-text italic">one point of view</span>
          </h1>
        </div>
      </section>

      <div className="sticky top-[86px] z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] gap-2 overflow-x-auto px-5 py-4 md:px-10">
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
      </div>

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
        <div className="divide-y divide-border border-y border-border">
          {shown.map((b) => (
            <article key={b.name} className="grid gap-8 py-10 md:grid-cols-[1fr_1.4fr]">
              <div>
                <p className="text-[0.65rem] tracking-[0.26em] uppercase text-champagne">
                  {b.family}
                  {b.also ? ` · also ${b.also}` : ""}
                </p>
                <h2 className="display mt-3 text-4xl md:text-5xl">{b.name}</h2>
                <p className="mt-2 text-sm italic text-muted-foreground">{b.lane}</p>
                {b.filters.length > 0 && (
                  <p className="mt-4 text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground">
                    Filters honoured · {b.filters.join(" · ")}
                  </p>
                )}
              </div>
              <div>
                <p className="leading-[1.9] text-muted-foreground">{b.note}</p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-[0.62rem] tracking-[0.26em] uppercase text-champagne">Best when</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {b.best.map((x) => <li key={x}>{x}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[0.62rem] tracking-[0.26em] uppercase text-muted-foreground">Less ideal when</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {b.less.map((x) => <li key={x}>{x}</li>)}
                    </ul>
                  </div>
                </div>
                <p className="mt-6 text-sm">
                  <span className="text-[0.62rem] tracking-[0.26em] uppercase text-muted-foreground">Desk examples · </span>
                  {b.examples.join(" · ")}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 panel p-10">
          <p className="display text-3xl md:text-4xl">Match the houses to your own filters</p>
          <p className="mt-4 max-w-xl leading-[1.9] text-muted-foreground">
            Run the edit with mineral, botanical, fragrance-free or multi-use goals and the desk surfaces examples in
            context — with no fear marketing and no safety claims.
          </p>
          <Link to="/edit" className="mt-8 inline-flex border border-champagne/50 px-7 py-4 text-[0.72rem] tracking-[0.3em] uppercase text-champagne transition-colors hover:bg-champagne hover:text-accent-foreground">
            Begin the edit
          </Link>
        </div>
      </section>
    </Page>
  );
}