/**
 * Northern Lantern House shell pieces — Fleet Shell Standard v1.
 * Gold (#C8A34A) appears here ONLY: the Labs wordmark and the footer hairline.
 * The app's own accent (lacquer rose) carries every CTA and state elsewhere.
 */
import { EDITORIAL, PUBLICATION, SKINCARE_DESK, SPA_DESK } from "@/lib/mi/seo";

export const HOUSE = "https://northernlanternhouse.com";

const OUT = { target: "_blank", rel: "noopener" } as const;

/** Fleet link registry — exact URLs from the standard. */
export const FLEET: { label: string; links: { name: string; href: string }[] }[] = [
  {
    label: "Salty & Clever",
    links: [
      { name: "Salty & Clever", href: "https://saltnotes.blog" },
      { name: "Salty Desk", href: "https://salty.saltnotes.blog" },
      { name: "Kitchen & Bar", href: "https://kitchen.saltnotes.blog" },
      { name: "Menu Builder", href: "https://occasion.saltnotes.blog/architecture" },
      { name: "Occasion OS", href: "https://occasion.saltnotes.blog" },
      { name: "Restaurant Intelligence", href: "https://deepdish.saltnotes.blog" },
    ],
  },
  {
    label: "Tangled Thistle",
    links: [
      { name: "Tangled Thistle", href: "https://tangledthistle.blog" },
      { name: "Atmosphere OS", href: "https://atmosphere.tangledthistle.blog" },
      { name: "Venue Intelligence", href: "https://venue.tangledthistle.blog" },
    ],
  },
  {
    label: "Elsewhere",
    links: [
      { name: "Room for Drama", href: "https://dramaroom.blog" },
      { name: "Hook the Horizon", href: "https://hookthehorizon.blog" },
      { name: "Elsewhere, Apparently", href: "https://the-money-apparently.vercel.app" },
    ],
  },
];

export function HouseWordmark({ className = "" }: { className?: string }) {
  return (
    <a
      href={HOUSE}
      {...OUT}
      className={`house-gold tap inline-flex shrink-0 items-center gap-1.5 text-[0.55rem] leading-none tracking-[0.22em] uppercase transition-opacity hover:opacity-75 ${className}`}
    >
      <span aria-hidden>◇</span>
      <span>Northern Lantern House Labs</span>
    </a>
  );
}

function Col({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[0.58rem] tracking-[0.28em] uppercase text-muted-foreground">{label}</p>
      <div className="mt-4 space-y-2 text-[0.78rem] leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

function Out({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="block transition-colors hover:text-champagne">
      {children}
    </a>
  );
}

export function LabsFooter() {
  return (
    <footer className="no-print house-footer no-print bg-[var(--house-deep)]">
      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10">
        <p className="display max-w-2xl text-3xl md:text-5xl">
          Desire is allowed. <span className="gilt-text italic">The finish still has to earn the bag.</span>
        </p>

        <h2 className="house-gold mt-12 text-[0.62rem] tracking-[0.3em] uppercase">Northern Lantern House Labs</h2>

        <div className="mt-8 grid gap-10 md:grid-cols-3">
          <Col label="The House">
            <p>Independent publications and the decision instruments built for them.</p>
            <Out href={HOUSE}>northernlanternhouse.com</Out>
          </Col>

          <Col label="This publication">
            <Out href={PUBLICATION}>Vanity or Vice</Out>
            <Out href="https://makeup.vanityvice.blog">Makeup Intelligence</Out>
            <Out href={SPA_DESK}>Spa Intelligence</Out>
            <Out href={SKINCARE_DESK}>Skincare Desk</Out>
            <Out href={EDITORIAL}>Editorial standards</Out>
          </Col>

          <Col label="Across the fleet">
            <div className="grid gap-6 sm:grid-cols-3 md:grid-cols-1 md:gap-4">
              {FLEET.map((g) => (
                <div key={g.label} className="min-w-0">
                  {g.links.map((l) => (
                    <Out key={l.href} href={l.href}>
                      {l.name}
                    </Out>
                  ))}
                </div>
              ))}
            </div>
          </Col>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-6 text-[0.66rem] tracking-[0.2em] uppercase text-muted-foreground">
          <span>© 2026 Northern Lantern House</span>
          <Out href={`${HOUSE}/legal-accessibility`}>Legal &amp; Accessibility</Out>
          <Out href={`${HOUSE}/support`}>Support</Out>
          <span className="opacity-70">Education only · never a diagnosis, toxin score or safety ranking</span>
        </div>
      </div>
    </footer>
  );
}
