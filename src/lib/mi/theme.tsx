import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeName = "noir" | "porcelain" | "black" | "white";
const KEY = "mi-theme";

export const THEMES: { id: ThemeName; labelKey: string; swatch: string; note: string }[] = [
  { id: "noir", labelKey: "theme.noir", swatch: "oklch(0.13 0.014 22)", note: "Ink ground, champagne and oxblood." },
  { id: "porcelain", labelKey: "theme.porcelain", swatch: "oklch(0.968 0.011 76)", note: "Warm porcelain, oxblood as ink." },
  { id: "black", labelKey: "theme.black", swatch: "#000000", note: "True black, maximum contrast." },
  { id: "white", labelKey: "theme.white", swatch: "#ffffff", note: "Pure white, near-black ink." },
];

interface ThemeCtx {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx>({ theme: "noir", setTheme: () => {}, toggle: () => {} });

/** `light` drives colour-scheme and the light variant; the hc-* classes layer on top. */
function apply(t: ThemeName) {
  const root = document.documentElement;
  root.classList.toggle("light", t === "porcelain" || t === "white");
  root.classList.toggle("hc-black", t === "black");
  root.classList.toggle("hc-white", t === "white");
}

const isTheme = (v: unknown): v is ThemeName =>
  v === "noir" || v === "porcelain" || v === "black" || v === "white";

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always start on noir so SSR markup and first client render agree.
  const [theme, setThemeState] = useState<ThemeName>("noir");

  useEffect(() => {
    let next: ThemeName | null = null;
    try {
      const stored = window.localStorage.getItem(KEY);
      if (isTheme(stored)) next = stored;
    } catch {
      /* storage unavailable */
    }
    if (!next) {
      if (window.matchMedia("(prefers-contrast: more)").matches) {
        next = window.matchMedia("(prefers-color-scheme: light)").matches ? "white" : "black";
      } else {
        next = window.matchMedia("(prefers-color-scheme: light)").matches ? "porcelain" : "noir";
      }
    }
    setThemeState(next);
    apply(next);
  }, []);

  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t);
    apply(t);
    try {
      window.localStorage.setItem(KEY, t);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const toggle = useCallback(() => {
    const order: ThemeName[] = ["noir", "porcelain", "black", "white"];
    setTheme(order[(order.indexOf(theme) + 1) % order.length]!);
  }, [theme, setTheme]);

  return <Ctx.Provider value={{ theme, setTheme, toggle }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  return useContext(Ctx);
}
