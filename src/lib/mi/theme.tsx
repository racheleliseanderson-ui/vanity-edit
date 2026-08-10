import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeName = "noir" | "porcelain";
const KEY = "mi-theme";

interface ThemeCtx {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx>({ theme: "noir", setTheme: () => {}, toggle: () => {} });

function apply(t: ThemeName) {
  const root = document.documentElement;
  root.classList.toggle("light", t === "porcelain");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always start on noir so SSR markup and first client render agree.
  const [theme, setThemeState] = useState<ThemeName>("noir");

  useEffect(() => {
    let next: ThemeName | null = null;
    try {
      const stored = window.localStorage.getItem(KEY);
      if (stored === "noir" || stored === "porcelain") next = stored;
    } catch {
      /* storage unavailable */
    }
    if (!next) {
      next = window.matchMedia("(prefers-color-scheme: light)").matches ? "porcelain" : "noir";
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
    setTheme(theme === "noir" ? "porcelain" : "noir");
  }, [theme, setTheme]);

  return <Ctx.Provider value={{ theme, setTheme, toggle }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  return useContext(Ctx);
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const noir = theme === "noir";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={noir ? "Switch to the Porcelain light theme" : "Switch to the Noir dark theme"}
      title={noir ? "Porcelain" : "Noir"}
      className="group relative flex h-9 w-[4.25rem] shrink-0 items-center rounded-full border border-champagne/40 bg-secondary/60 px-1 transition-colors hover:border-champagne"
    >
      <span
        className="absolute h-7 w-7 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          background: "var(--gradient-champagne)",
          transform: noir ? "translateX(0)" : "translateX(2.15rem)",
        }}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-[0.3rem]">
        <MoonIcon active={noir} />
        <SunIcon active={!noir} />
      </span>
    </button>
  );
}

function MoonIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "var(--accent-foreground)" : "var(--muted-foreground)"}
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

function SunIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "var(--accent-foreground)" : "var(--muted-foreground)"}
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
    </svg>
  );
}
