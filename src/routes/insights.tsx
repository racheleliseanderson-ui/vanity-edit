import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/mi/chrome";
import { PrintBar } from "@/components/mi/print-bar";
import { CLAIM_KINDS, CLAIMS } from "@/lib/mi/claims";
import { BASE_RISK, SCORE_VARIABLES, TYPE_SCORE_WEIGHTS } from "@/lib/mi/engine";
import { PANCAKE_DEF, TERMS } from "@/lib/mi/vocab";
import cake from "@/assets/cake-vs-skin.jpg";
import capsule from "@/assets/capsule.jpg";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Why makeup cakes · Claim literacy · Makeup Intelligence" },
      {
        name: "description",
        content:
          "The mechanics of pancake makeup, transparent score weights, and claim literacy for SPF, treatment and hybrid makeup — named, dosed, tested, and when not to buy.",
      },
      { property: "og:title", content: "Why makeup cakes · Makeup Intelligence" },
      { property: "og:description", content: "Architecture over cake, explained — with the maths visible." },
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
  {
    n: "07",
    t: "Match before layers",
    b: "On deep, olive, red-leaning and deep-neutral bands, a short shade range is how cake starts: people add product to force a mismatch. Widen the map first. Opacity never fixes undertone.",
  },
  {
    n: "08",
    t: "Claims are not architecture",
    b: "SPF, 'treatment', peptides and barrier language on a foundation do not thin the film. If the active is not named and dosed, you are buying mood. Architecture still decides whether it cakes.",
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

      <section className="mx-auto max-w-[1400px] px-5 pt-10 md:px-10">
        <PrintBar
          title="Print Insights"
          note="The mechanics, published coefficients and claim cards — print-worthy, with every weight still named."
        />
        <p className="max-w-2xl border-l border-champagne/50 pl-4 text-[0.98rem] leading-[1.75] text-foreground">{PANCAKE_DEF}</p>
        <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted-foreground">{TERMS.pancakeRisk}</p>
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

      {/* Transparent score model */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10">
          <p className="eyebrow">Transparent scoring</p>
          <h2 className="display mt-4 max-w-3xl text-4xl md:text-6xl">
            Pancake risk starts at {BASE_RISK}.<br />
            <span className="gilt-text italic">Finish is 100 − risk.</span>
          </h2>
          <p className="mt-6 max-w-2xl leading-[1.9] text-muted-foreground">
            Every variable below is live in the edit. Positive deltas raise pancake risk and lower the skin-like finish score.
            Negative deltas do the opposite. No black box — if a number moves, you can name the weight.
          </p>
          <div className="mt-12 divide-y divide-border border-y border-border">
            {SCORE_VARIABLES.map((v) => (
              <article key={v.id} className="grid gap-4 py-8 md:grid-cols-[1fr_1.2fr]">
                <div>
                  <h3 className="display text-2xl md:text-3xl">{v.label}</h3>
                  <p className="mt-3 font-mono text-[0.7rem] leading-relaxed tracking-[0.04em] text-champagne">{v.weight}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[0.62rem] tracking-[0.26em] uppercase text-muted-foreground">Raises risk when</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.raisesRiskWhen}</p>
                  </div>
                  <div>
                    <p className="text-[0.62rem] tracking-[0.26em] uppercase text-muted-foreground">Finish effect</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.finishEffect}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="eyebrow mt-16">Type fit weights</p>
          <p className="display mt-3 text-3xl md:text-4xl">From a neutral 50</p>
          <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted-foreground">{TERMS.fit}</p>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">{TERMS.filmCost}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {TYPE_SCORE_WEIGHTS.map((w) => (
              <div key={w.label} className="border border-border p-5">
                <p className="text-sm">{w.label}</p>
                <p className="mt-2 font-mono text-[0.65rem] text-champagne">{w.weight}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{w.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Claim literacy */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-10">
        <p className="eyebrow">Claim literacy</p>
        <h2 className="display mt-4 max-w-3xl text-4xl md:text-6xl">
          Named. Dosed. Tested.<br />
          <span className="gilt-text italic">When not to buy.</span>
        </h2>
        <p className="mt-6 max-w-2xl leading-[1.9] text-muted-foreground">
          Makeup that borrows skincare language still has to earn the bag as architecture. These cards are education —
          never a safety ranking, medical clearance, or brand attack. If a claim cannot survive a follow-up question, it does not drive the purchase.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CLAIM_KINDS.map((k) => (
            <div key={k.id} className="border border-border p-6">
              <p className="text-[0.62rem] tracking-[0.26em] uppercase text-champagne">{k.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{k.line}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 divide-y divide-border border-y border-border">
          {CLAIMS.map((c) => (
            <article key={c.id} className="grid gap-6 py-10 md:grid-cols-[0.9fr_1.3fr]">
              <div>
                <p className="text-[0.62rem] tracking-[0.26em] uppercase text-champagne">{c.kind}</p>
                <h3 className="display mt-3 text-2xl md:text-3xl">{c.claim}</h3>
                <p className="mt-4 text-sm italic leading-relaxed text-muted-foreground">{c.verdict}</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-[0.62rem] tracking-[0.26em] uppercase text-champagne">Named</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.named}</p>
                  <p className="mt-4 text-[0.62rem] tracking-[0.26em] uppercase text-champagne">Dosed</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.dosed}</p>
                </div>
                <div>
                  <p className="text-[0.62rem] tracking-[0.26em] uppercase text-muted-foreground">Tested</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.tested}</p>
                  <p className="mt-4 text-[0.62rem] tracking-[0.26em] uppercase text-muted-foreground">When not to buy</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.whenNotToBuy}</p>
                </div>
              </div>
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
              <em className="italic">types</em> against a profile, names the weights, names what it is trading away, and
              tells you when the honest answer is fewer objects rather than better ones.
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
