import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { SettingsMenu } from "@/components/mi/settings";
import { HouseWordmark, LabsFooter } from "@/components/mi/house";
import { ScrollRail } from "@/components/mi/scroll-rail";
import { useI18n, type Key } from "@/lib/mi/i18n";
import { PUBLICATION } from "@/lib/mi/seo";

const NAV = [
  { to: "/", key: "nav.home" },
  { to: "/edit", key: "nav.edit" },
  { to: "/products", key: "nav.products" },
  { to: "/desk", key: "nav.desk" },
  { to: "/insights", key: "nav.insights" },
] as const;

/** House bar: Labs wordmark → publication → app nav → display-mode pill. One row. */
export function Header() {
  const { t } = useI18n();
  return (
    <header className="no-print sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto min-w-0 max-w-[1400px] px-5 py-3 md:flex md:items-center md:justify-between md:gap-6 md:px-10 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <HouseWordmark />
              <a
                href={PUBLICATION}
                className="shrink-0 text-[0.55rem] leading-none tracking-[0.22em] uppercase text-muted-foreground transition-colors hover:text-champagne"
              >
                Vanity or Vice
              </a>
            </div>
            <Link to="/" className="group mt-1.5 block min-w-0 leading-none">
              <span className="display block text-2xl md:text-[1.7rem]">Makeup Intelligence</span>
            </Link>
          </div>
          <div className="shrink-0 md:hidden">
            <SettingsMenu />
          </div>
        </div>
        <div className="mt-2 flex min-w-0 items-center gap-2 md:mt-0 md:gap-4">
          <ScrollRail label={t("nav.primary")} className="min-w-0 flex-1 md:flex-none">
            <nav aria-label={t("nav.primary")} className="flex items-center gap-1 md:gap-2">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  className="tap flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-3 text-[0.7rem] tracking-[0.14em] uppercase text-muted-foreground transition-colors hover:text-foreground active:opacity-70 data-[status=active]:text-champagne md:text-[0.78rem]"
                >
                  {t(n.key as Key)}
                </Link>
              ))}
            </nav>
          </ScrollRail>
          <Link
            to="/edit"
            search={{ stage: "Packet" }}
            className="tap flex min-h-11 shrink-0 items-center whitespace-nowrap border border-champagne/50 px-2.5 text-[0.58rem] tracking-[0.14em] uppercase text-champagne transition-colors hover:bg-champagne/10 sm:px-3 sm:text-[0.62rem] sm:tracking-[0.18em]"
          >
            Your packet
          </Link>
          <div className="hidden md:block">
            <SettingsMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

export const Footer = LabsFooter;


export function Page({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#main"
        className="no-print sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-champagne focus:bg-background focus:px-4 focus:py-3 focus:text-xs focus:uppercase focus:tracking-[0.24em] focus:text-champagne"
      >
        {t("nav.skip")}
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

export function Term({ name, children }: { name: string; children: string }) {
  return (
    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
      <span className="tracking-[0.16em] uppercase text-champagne">{name} · </span>
      {children}
    </p>
  );
}
