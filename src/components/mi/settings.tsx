import { useEffect, useRef, useState } from "react";

import { useA11y } from "@/lib/mi/a11y";
import { LOCALES, useI18n, type Key } from "@/lib/mi/i18n";
import { THEMES, useTheme } from "@/lib/mi/theme";

export function SettingsMenu() {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();
  const a11y = useA11y();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={t("settings.open")}
        className="tap flex items-center gap-2 rounded-full border border-champagne/40 px-3 text-[0.62rem] tracking-[0.2em] uppercase text-champagne transition-colors hover:border-champagne hover:bg-champagne/10"
      >
        <span aria-hidden className="h-3.5 w-3.5 rounded-full" style={{ background: "var(--gradient-champagne)" }} />
        <span>{locale.toUpperCase()}</span>
        <span aria-hidden className="opacity-60">
          {theme === "noir" ? "◐" : theme === "porcelain" ? "◑" : theme === "black" ? "●" : "○"}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t("settings.title")}
          className="panel absolute right-0 z-50 mt-3 w-[min(88vw,22rem)] space-y-6 p-5 shadow-[var(--shadow-lux)]"
        >
          <Block label={t("settings.theme")}>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setTheme(th.id)}
                  aria-pressed={theme === th.id}
                  className={`tap flex items-center gap-2 border px-3 text-left text-[0.62rem] tracking-[0.14em] uppercase transition-colors ${
                    theme === th.id ? "border-champagne bg-champagne/10 text-champagne" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span
                    aria-hidden
                    className="h-4 w-4 shrink-0 rounded-full border border-border"
                    style={{ background: th.swatch }}
                  />
                  <span className="min-w-0 truncate">{t(th.labelKey as Key)}</span>
                </button>
              ))}
            </div>
          </Block>

          <Block label={t("settings.access")}>
            <div className="grid gap-2">
              <Switch on={a11y.cbSafe} onChange={(v) => a11y.set({ cbSafe: v })} label={t("settings.cb")} note={t("settings.cbNote")} />
              <Switch on={a11y.reduceMotion} onChange={(v) => a11y.set({ reduceMotion: v })} label={t("settings.motion")} />
              <Switch on={a11y.bigType} onChange={(v) => a11y.set({ bigType: v })} label={t("settings.bigType")} />
            </div>
          </Block>

          <Block label={t("settings.language")}>
            <div className="flex flex-wrap gap-2">
              {LOCALES.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  lang={l.id}
                  onClick={() => setLocale(l.id)}
                  aria-pressed={locale === l.id}
                  className={`tap border px-4 text-[0.62rem] tracking-[0.18em] uppercase transition-colors ${
                    locale === l.id ? "border-champagne bg-champagne/10 text-champagne" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.native}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[0.68rem] leading-snug text-muted-foreground">{t("settings.langNote")}</p>
          </Block>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="tap w-full border border-border text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground hover:text-foreground"
          >
            {t("settings.close")}
          </button>
        </div>
      )}
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="text-[0.58rem] tracking-[0.3em] uppercase text-champagne">{label}</p>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Switch({
  on,
  onChange,
  label,
  note,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
  note?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`tap flex items-center justify-between gap-4 border px-3 text-left transition-colors ${
        on ? "border-champagne/60 bg-champagne/10" : "border-border hover:border-champagne/40"
      }`}
    >
      <span className="min-w-0">
        <span className="block text-xs">{label}</span>
        {note && <span className="mt-0.5 block text-[0.62rem] leading-snug text-muted-foreground">{note}</span>}
      </span>
      <span
        aria-hidden
        className="relative h-5 w-9 shrink-0 rounded-full transition-colors"
        style={{ background: on ? "var(--champagne)" : "var(--track)" }}
      >
        <span
          className="absolute top-[3px] h-3.5 w-3.5 rounded-full transition-transform"
          style={{ background: on ? "var(--accent-foreground)" : "var(--foreground)", transform: on ? "translateX(1.25rem)" : "translateX(3px)" }}
        />
      </span>
    </button>
  );
}
