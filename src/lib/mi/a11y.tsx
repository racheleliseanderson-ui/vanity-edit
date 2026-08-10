import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface A11yState {
  /** colour-blind-safe palette layered over the active theme */
  cbSafe: boolean;
  /** honour reduced motion regardless of the OS setting */
  reduceMotion: boolean;
  /** a larger base type scale */
  bigType: boolean;
}

const KEY = "mi-a11y";
const DEFAULTS: A11yState = { cbSafe: false, reduceMotion: false, bigType: false };

interface A11yCtx extends A11yState {
  set: (patch: Partial<A11yState>) => void;
}

const Ctx = createContext<A11yCtx>({ ...DEFAULTS, set: () => {} });

function apply(s: A11yState) {
  const root = document.documentElement;
  root.classList.toggle("cb-safe", s.cbSafe);
  root.classList.toggle("calm-motion", s.reduceMotion);
  root.classList.toggle("big-type", s.bigType);
}

export function A11yProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<A11yState>(DEFAULTS);

  useEffect(() => {
    let next = DEFAULTS;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<A11yState>;
        next = {
          cbSafe: parsed.cbSafe === true,
          reduceMotion: parsed.reduceMotion === true,
          bigType: parsed.bigType === true,
        };
      }
    } catch {
      /* storage unavailable or malformed */
    }
    setState(next);
    apply(next);
  }, []);

  const set = useCallback((patch: Partial<A11yState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      apply(next);
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  const value = useMemo<A11yCtx>(() => ({ ...state, set }), [state, set]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useA11y() {
  return useContext(Ctx);
}
