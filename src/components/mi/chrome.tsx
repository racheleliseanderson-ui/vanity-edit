import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/lib/mi/theme";

const NAV = [
  { to: "/", label: "Salon" },
  { to: "/edit", label: "The Edit" },
  { to: "/products", label: "Products" },
  { to: "/desk", label: "Desk" },
  { to: "/insights", label: "Insights" },
] as const;

export function Header() {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-5 py-3 md:flex md:items-center md:justify-between md:gap-6 md:px-10 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="group min-w-0 leading-none">
            <span className="eyebrow block text-[0.6rem]">Vanity or Vice</span>
            <span className="display mt-1 block text-2xl md:text-[1.7rem]">Makeup Intelligence</span>
          </Link>
          <div className="shrink-0 md:hidden">
            <ThemeToggle />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 md:mt-0 md:gap-4">
          <nav
            aria-label="Primary"
            className="-mx-1 flex flex-1 items-center gap-1 overflow-x-auto px-1 md:flex-none md:gap-2"
          >
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-2 text-[0.7rem] tracking-[0.14em] uppercase text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-champagne md:px-3 md:text-[0.78rem]"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
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
    <div className="min-h-dvh bg-background">
      <a
        href="#main"
        className="no-print sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-champagne focus:bg-background focus:px-4 focus:py-3 focus:text-xs focus:uppercase focus:tracking-[0.24em] focus:text-champagne"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}