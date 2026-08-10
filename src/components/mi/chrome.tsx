import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Salon" },
  { to: "/edit", label: "The Edit" },
  { to: "/desk", label: "Desk" },
  { to: "/insights", label: "Insights" },
] as const;

export function Header() {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-4 md:px-10">
        <Link to="/" className="group leading-none">
          <span className="eyebrow block text-[0.6rem]">Vanity or Vice</span>
          <span className="display mt-1 block text-2xl md:text-[1.7rem]">Makeup Intelligence</span>
        </Link>
        <nav className="flex items-center gap-1 md:gap-2">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-full px-3 py-2 text-[0.78rem] tracking-[0.14em] uppercase text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-champagne"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="no-print border-t border-border bg-card/40">
      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10">
        <p className="display max-w-2xl text-3xl md:text-5xl">
          Desire is allowed. <span className="gilt-text italic">The finish still has to earn the bag.</span>
        </p>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-border pt-6 text-xs tracking-[0.18em] uppercase text-muted-foreground">
          <span>Vanity or Vice · Makeup Intelligence</span>
          <span>Education only · never a diagnosis, toxin score or safety ranking</span>
        </div>
      </div>
    </footer>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}