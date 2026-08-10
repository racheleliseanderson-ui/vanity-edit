import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/mi/chrome";
import cake from "@/assets/cake-vs-skin.jpg";
import capsule from "@/assets/capsule.jpg";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Why makeup cakes · Makeup Intelligence" },
      {
        name: "description",
        content:
          "The mechanics of pancake makeup: layer count, dehydration, sebum travel and maintenance tolerance — and the architecture that avoids all four.",
      },
      { property: "og:title", content: "Why makeup cakes · Makeup Intelligence" },
      { property: "og:description", content: "Architecture over cake, explained." },
    ],
  }),
  component: Insights,
});

const MECHANISMS = [
  {
    n: "01",
    t: "The wrong question",
    b: "Pancake begins with “which foundation?”. That question presumes a full-face layer before anyone has asked what the face actually needs covered. Almost every cake outcome is a diagnosis failure, not a product failure.",
  },
  {
    n: "02",
    t: "Layer arithmetic",
    b: "Primer, base, concealer, powder, bronzer, setting spray is six films. Each edge is a place where the stack can lift, crease or go grey. Cutting one layer improves the finish more reliably than upgrading any single product in it.",
  },
  {
    n: "03",
    t: "Water leaves the film",
    b: "Dry rooms, altitude and dehydrated skin pull water out of a base from underneath. Opaque formulas have the least flex, so they crack first — and powder over them accelerates it.",
  },
  {
    n: "04",
    t: "Sebum travels",
    b: "Oil moves the base sideways. If you have ruled out midday intervention, the only honest answer is a thinner film plus blotting — blotting removes oil without adding a layer, which is the one free move in the system.",
  },
  {
    n: "05",
    t: "Placement reads as skin",
    b: "The eye reads placed coverage as flawless skin and reads an even full layer as makeup. This is why strategic concealer outperforms full base at the same coverage appetite.",
  },
  {
    n: "06",
    t: "Desire is not the problem",
    b: "Wanting makeup is not what causes cake. Spending that appetite on opacity does. Spend it on cream colour, brow structure, lash and lip instead and the appetite is satisfied without thickness.",
  },
];

function Insights() {
  return (
    <Page>
      <section className="relative isolate overflow-hidden">
        <img src={cake} alt="Macro comparison of a cracked opaque makeup film beside luminous bare skin" width={1600} height={912} className="h-[52vh] w-full object-cover md:h-[64vh]" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-veil)" }} />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-5 pb-12 md:px-10">
          <p className="eyebrow">Insights</p>
          <h1 className="display mt-4 max-w-3xl text-5xl md:text-8xl">
            Cake is a<br />
            <span className="gilt-text italic">structural</span> failure
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-10">
        <div className="grid gap-x-16 gap-y-14 md:grid-cols-2">
          {MECHANISMS.map((m, i) => (
            <article key={m.n} className={i % 2 === 1 ? "md:mt-16" : ""}>
              <div className="flex items-baseline gap-5">
                <span className="display text-champagne text-4xl">{m.n}</span>
                <h2 className="display text-3xl md:text-4xl">{m.t}</h2>
              </div>
              <p className="mt-4 max-w-xl text-[0.98rem] leading-[1.85] text-muted-foreground">{m.b}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative border-y border-border">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-20 md:grid-cols-[1.05fr_1fr] md:px-10">
          <div>
            <p className="eyebrow">The house position</p>
            <p className="display mt-5 text-4xl md:text-6xl">
              A finish has to earn<br />its place in the bag.
            </p>
            <p className="mt-6 max-w-xl leading-[1.9] text-muted-foreground">
              No toxin scores. No single “clean” product myth. No purge culture. The desk scores product{" "}
              <em className="italic">types</em> against a profile, names what it is trading away, and tells you when the
              honest answer is fewer objects rather than better ones.
            </p>
            <Link
              to="/edit"
              className="mt-9 inline-flex items-center gap-3 border border-champagne/50 px-7 py-4 text-[0.72rem] tracking-[0.28em] uppercase text-champagne transition-colors hover:bg-champagne hover:text-accent-foreground"
            >
              Run your edit
            </Link>
          </div>
          <img src={capsule} alt="Five-object makeup capsule on dark stone" loading="lazy" width={1408} height={1008} className="w-full object-cover" />
        </div>
      </section>
    </Page>
  );
}