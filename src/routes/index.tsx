import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/mi/chrome";
import { BRANDS, PRESETS, TYPES } from "@/lib/mi/catalog";
import { CLAIMS } from "@/lib/mi/claims";
import { shareHead } from "@/lib/mi/seo";
import hero from "@/assets/hero-skin.jpg";
import still from "@/assets/desk-still.jpg";

export const Route = createFileRoute("/")({
  head: () => shareHead("/"),
  component: Index,
});

const ENGINES = [
  { k: "I", t: "Makeup Match", b: "Goal-first product-type scoring, with layer weight penalised against your own dehydration and sebum load. Every coefficient is visible." },
  { k: "II", t: "Alternative Finder", b: "Pathways ranked live — sheer hybrid, spot-only, one-stick, mineral control, mature flex, deep-band match, rosacea placement, sport minimal, and more." },
  { k: "III", t: "Tool Match", b: "Essential, optional, probably unnecessary — derived from the kit you actually earned. Fingers count." },
  { k: "IV", t: "Bag Edit", b: "Keep, use differently, replace when finished. No purge culture, ever." },
  { k: "V", t: "Build My Kit", b: "A complexity ceiling that refuses to be filled just because slots exist." },
  { k: "VI", t: "Wear & Longevity", b: "Will this face hold up over the day? Hour-by-hour integrity, failure modes, and Veil / Edit / Editorial pathways scored for your climate, hours and maintenance honesty." },
  { k: "VII", t: "Claim literacy", b: "SPF, treatment, hybrid and barrier claims on makeup — named, dosed, tested, and when not to buy." },
];

function Index() {
  return (
    <Page>
      {/* Overture */}
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <img
          src={hero}
          alt="Close macro of luminous skin under warm directional light"
          width={1600}
          height={1920}
          className="absolute inset-0 h-full w-full object-cover object-[68%_28%] opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: "var(--gradient-veil)" }} />
        <div className="relative mx-auto flex min-h-[92vh] max-w-[1400px] flex-col justify-end px-5 pb-20 pt-28 md:px-10">
          <p className="eyebrow rise">Desire is allowed · the finish still has to earn the bag</p>
          <h1 className="display rise mt-6 max-w-4xl text-[3.4rem] leading-[0.92] md:text-[7.5rem]">
            The intelligent<br />answer to{" "}
            <span className="gilt-text italic">pancake<br />makeup</span>
          </h1>
          <p className="rise mt-8 max-w-xl text-[1.02rem] leading-[1.9] text-muted-foreground">
            Product <em className="italic text-foreground">types</em> — not brands — matched to your skin, goals,
            lifestyle and maintenance tolerance. Live pancake-risk scoring with every weight named. Alternative pathways
            with their trade-offs out loud. Wear forecast for the hours you actually live. Claim literacy for makeup that dresses as skincare. Architecture over cake.
          </p>
          <div className="rise mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/edit"
              className="group inline-flex items-center gap-4 bg-foreground px-8 py-4 text-[0.72rem] tracking-[0.3em] uppercase text-background transition-all hover:bg-champagne"
            >
              Begin the edit
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/edit"
              search={{ stage: "Wear" }}
              className="border border-border px-7 py-4 text-[0.72rem] tracking-[0.3em] uppercase text-muted-foreground transition-colors hover:border-champagne/60 hover:text-foreground"
            >
              Wear & Longevity
            </Link>
            <Link to="/desk" className="border border-border px-7 py-4 text-[0.72rem] tracking-[0.3em] uppercase text-muted-foreground transition-colors hover:border-champagne/60 hover:text-foreground">
              The desk
            </Link>
            <Link to="/insights" className="border border-border px-7 py-4 text-[0.72rem] tracking-[0.3em] uppercase text-muted-foreground transition-colors hover:border-champagne/60 hover:text-foreground">
              Claims & mechanics
            </Link>
          </div>
          <div className="mt-14 grid max-w-3xl grid-cols-2 gap-y-6 border-t border-border pt-6 text-xs tracking-[0.18em] uppercase text-muted-foreground md:grid-cols-4">
            <span>{TYPES.length} product types</span>
            <span>{BRANDS.length} desk houses</span>
            <span>{PRESETS.length} smart paths</span>
            <span>{CLAIMS.length} claim cards</span>
          </div>
        </div>
      </section>

      {/* Spectrum manifesto */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10">
          <div className="grid gap-14 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="eyebrow">The anti-pancake spectrum</p>
              <p className="display mt-5 text-4xl md:text-6xl">Architecture<br />over cake</p>
            </div>
            <div className="space-y-8">
              <p className="max-w-xl leading-[1.9] text-muted-foreground">
                Wrong type plus too many layers equals a mask. The desk scores skin-like pathways first, then lets you
                spend whatever appetite remains on definition rather than opacity. Pancake risk starts at a base of 30;
                finish (skin-like) is simply 100 minus risk — every variable is weighted in the open.
              </p>
              <div className="space-y-5">
                {[
                  ["Skin tint · tinted SPF", "Sheer · one film", 14],
                  ["Placed concealer", "Spot · intelligent", 30],
                  ["Buildable mineral powder", "Conditional", 56],
                  ["Full-face full coverage", "High pancake risk", 88],
                ].map(([label, verdict, pos]) => (
                  <div key={label as string} className="grid gap-3 border-b border-border pb-5 md:grid-cols-[1fr_auto]">
                    <div>
                      <p className="display text-2xl">{label}</p>
                      <p className="mt-1 text-xs tracking-[0.2em] uppercase text-muted-foreground">{verdict}</p>
                    </div>
                    <div className="flex w-full items-center md:w-64">
                      <div className="relative h-[4px] w-full spectrum-bar rounded-full">
                        <span className="absolute -top-[5px] h-[14px] w-[14px] -translate-x-1/2 rounded-full bg-foreground" style={{ left: `${pos as number}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preset paths */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Smart paths</p>
            <p className="display mt-4 text-4xl md:text-6xl">Start intelligent,<br />never blank</p>
          </div>
          <p className="max-w-sm text-sm leading-[1.9] text-muted-foreground">
            {PRESETS.length} presets seed goals, coverage appetite, ceiling and philosophy — mature skin, humid oily,
            deep undertone, rosacea, fragrance-sensitive, minimalist, sport, HD, and the classics. Every field stays open.
          </p>
        </div>

        <div className="mt-12 divide-y divide-border border-y border-border">
          {PRESETS.map((p, i) => (
            <Link
              key={p.id}
              to="/edit"
              search={{ path: p.id }}
              className="group grid items-baseline gap-3 py-7 transition-colors hover:bg-card/50 md:grid-cols-[4rem_1fr_1fr_auto] md:gap-8"
            >
              <span className="display text-champagne text-2xl">{String(i + 1).padStart(2, "0")}</span>
              <span className="display text-3xl md:text-[2.6rem]">{p.name}</span>
              <span className="text-sm leading-relaxed text-muted-foreground">
                {p.line} <span className="block opacity-70">{p.promise}</span>
              </span>
              <span className="text-[0.68rem] tracking-[0.3em] uppercase text-muted-foreground transition-colors group-hover:text-champagne">
                Take this path →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Engines over still life */}
      <section className="relative isolate overflow-hidden border-t border-border">
        <img src={still} alt="Dark editorial still life of cream pigment, a gold compact and a spent blotting paper" loading="lazy" width={1600} height={1104} className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-background/72" />
        <div className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10">
          <p className="eyebrow">Seven engines · one profile</p>
          <p className="display mt-5 max-w-2xl text-4xl md:text-6xl">
            Every answer explains<br />
            <span className="gilt-text italic">why it scored that way</span>
          </p>
          <div className="mt-14 grid gap-x-14 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {ENGINES.map((e) => (
              <div key={e.k} className="border-t border-border pt-5">
                <span className="display text-champagne text-xl">{e.k}</span>
                <h3 className="display mt-2 text-2xl">{e.t}</h3>
                <p className="mt-3 text-sm leading-[1.85] text-muted-foreground">{e.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Desk houses */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-10">
        <p className="eyebrow">The seeded desk</p>
        <p className="display mt-4 max-w-2xl text-4xl md:text-6xl">
          Houses held as examples,<br />never as rankings
        </p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Drugstore, mid, prestige and luxury — each with an honest positioning note and what earns or loses the bag.
        </p>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {BRANDS.map((b) => (
            <span key={b.name} className="display text-2xl text-muted-foreground transition-colors hover:text-champagne md:text-3xl">
              {b.name}
            </span>
          ))}
        </div>
        <Link to="/desk" className="mt-12 inline-flex border border-champagne/50 px-7 py-4 text-[0.72rem] tracking-[0.3em] uppercase text-champagne transition-colors hover:bg-champagne hover:text-accent-foreground">
          Open the desk
        </Link>
      </section>
    </Page>
  );
}
