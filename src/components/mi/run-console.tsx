import { useEffect, useMemo, useState } from "react";

import type { StageTiming } from "@/lib/mi/engine";
import { useI18n } from "@/lib/mi/i18n";
import { diffRuns, duplicateRun, loadRuns, removeRun, renameRun, saveRun, type SavedRun } from "@/lib/mi/runs";
import type { Profile } from "@/lib/mi/types";

export type PipelineState = "done" | "stale" | "held";

interface RunConsoleProps {
  profile: Profile;
  path?: string | undefined;
  moves: string[];
  stage: string;
  timings: StageTiming[];
  state: PipelineState;
  held: boolean;
  onToggleHold: () => void;
  onRun: () => void;
  onReset: () => void;
  onLoad: (run: SavedRun) => void;
}

const BTN =
  "min-h-11 border px-4 py-2 text-[0.58rem] tracking-[0.24em] uppercase transition-colors disabled:opacity-35";

export function RunConsole({
  profile,
  path,
  moves,
  stage,
  timings,
  state,
  held,
  onToggleHold,
  onRun,
  onReset,
  onLoad,
}: RunConsoleProps) {
  const { t } = useI18n();
  const [runs, setRuns] = useState<SavedRun[]>([]);
  const [name, setName] = useState("");
  const [a, setA] = useState<string | null>(null);
  const [b, setB] = useState<string | null>(null);

  useEffect(() => setRuns(loadRuns()), []);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const total = useMemo(() => Math.round(timings.reduce((n, s) => n + s.ms, 0) * 100) / 100, [timings]);
  const diff = useMemo(() => {
    const ra = runs.find((r) => r.id === a);
    const rb = runs.find((r) => r.id === b);
    return ra && rb ? { ra, rb, rows: diffRuns(ra, rb) } : null;
  }, [a, b, runs]);

  const stateLabel =
    state === "held"
      ? t("run.holding")
      : state === "stale"
        ? t("run.stale")
        : mounted
          ? `${t("run.done")} · ${total} ms`
          : t("run.done");

  return (
    <section className="no-print vitrine mt-10 p-6 md:p-8" aria-label={t("run.title")}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow">{t("run.title")}</p>
          <h2 className="display mt-2 truncate text-3xl md:text-4xl">The run console</h2>
        </div>
        <p
          aria-live="polite"
          className={`shrink-0 font-mono text-[0.62rem] tracking-[0.18em] uppercase ${
            state === "done" ? "text-muted-foreground" : "text-rouge"
          }`}
        >
          {stateLabel}
        </p>
      </div>

      {/* Execution controls */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button onClick={onRun} className={`${BTN} border-champagne/60 text-champagne hover:bg-champagne/10`}>
          {state === "stale" ? t("run.rerun") : t("run.run")}
        </button>
        <button
          onClick={onToggleHold}
          aria-pressed={held}
          className={`${BTN} ${held ? "border-champagne bg-champagne/10 text-champagne" : "border-border text-muted-foreground hover:text-foreground"}`}
        >
          {t("run.hold")}
        </button>
        <button onClick={onReset} className={`${BTN} border-border text-muted-foreground hover:text-foreground`}>
          {t("run.reset")}
        </button>
      </div>

      {/* Pipeline status strip */}
      <ul className="mt-7 grid list-none gap-px overflow-hidden border border-hairline p-0 sm:grid-cols-2 lg:grid-cols-4">
        {timings.map((s) => (
          <li key={s.id} className="bg-card/40 p-3">
            <p className="font-mono text-[0.56rem] tracking-[0.2em] uppercase text-muted-foreground">
              {state === "done" ? t("run.done") : state === "held" ? t("run.idle") : t("run.stale")}
            </p>
            <p className="mt-1 truncate text-sm">{s.label}</p>
            <p className="font-mono text-[0.62rem] tabular-nums text-champagne">{mounted ? `${s.ms} ms` : "—"}</p>
          </li>
        ))}
      </ul>

      {/* Save + history */}
      <div className="mt-8 border-t border-border pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="run-name">
            {t("run.name")}
          </label>
          <input
            id="run-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("run.name")}
            className="min-h-11 min-w-[14rem] flex-1 border border-border bg-transparent px-4 py-2 text-sm placeholder:text-muted-foreground"
          />
          <button
            onClick={() => {
              if (!name.trim()) return;
              setRuns(saveRun({ name, profile, path, moves, stage }));
              setName("");
            }}
            disabled={!name.trim()}
            className={`${BTN} border-champagne/60 text-champagne hover:bg-champagne/10`}
          >
            {t("run.save")}
          </button>
        </div>

        {runs.length === 0 ? (
          <p className="mt-5 text-sm text-muted-foreground">{t("run.none")}</p>
        ) : (
          <ul className="mt-5 grid list-none gap-3 p-0">
            {runs.map((r) => (
              <li key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border border-border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm">{r.name}</p>
                  <p className="font-mono text-[0.56rem] tracking-[0.18em] uppercase text-muted-foreground">
                    {r.profile.ceiling} objects · {r.profile.coverage}/100 · {r.moves.length} moves ·{" "}
                    {new Date(r.saved).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-1">
                  <Mini label={`${t("run.load")} ${r.name}`} onClick={() => onLoad(r)}>
                    {t("run.load")}
                  </Mini>
                  <Mini
                    label={`Compare ${r.name}`}
                    active={a === r.id || b === r.id}
                    onClick={() => (a === r.id ? setA(null) : b === r.id ? setB(null) : a ? setB(r.id) : setA(r.id))}
                  >
                    {t("run.diff")}
                  </Mini>
                  <Mini label={`Duplicate ${r.name}`} onClick={() => setRuns(duplicateRun(r.id))}>
                    ⧉
                  </Mini>
                  <Mini
                    label={`Rename ${r.name}`}
                    onClick={() => {
                      const next = window.prompt("New name for this run", r.name);
                      if (next) setRuns(renameRun(r.id, next));
                    }}
                  >
                    ✎
                  </Mini>
                  <Mini
                    label={`Delete ${r.name}`}
                    tone="rouge"
                    onClick={() => {
                      setRuns(removeRun(r.id));
                      if (a === r.id) setA(null);
                      if (b === r.id) setB(null);
                    }}
                  >
                    ×
                  </Mini>
                </div>
              </li>
            ))}
          </ul>
        )}

        {diff && (
          <div className="mt-6 border border-champagne/40 p-4">
            <p className="font-mono text-[0.58rem] tracking-[0.2em] uppercase text-champagne">
              {diff.ra.name} → {diff.rb.name}
            </p>
            {diff.rows.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">{t("run.identical")}</p>
            ) : (
              <table className="mt-3 w-full text-left text-sm">
                <thead>
                  <tr className="font-mono text-[0.54rem] tracking-[0.2em] uppercase text-muted-foreground">
                    <th className="py-1 pr-3 font-normal">Field</th>
                    <th className="py-1 pr-3 font-normal">{diff.ra.name}</th>
                    <th className="py-1 font-normal">{diff.rb.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {diff.rows.map((row) => (
                    <tr key={row.field} className="border-t border-border align-top">
                      <td className="py-2 pr-3 text-muted-foreground">{row.field}</td>
                      <td className="py-2 pr-3">{row.a}</td>
                      <td className="py-2 text-champagne">{row.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Mini({
  children,
  label,
  onClick,
  tone,
  active,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  tone?: "rouge";
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid min-h-11 min-w-11 place-items-center border px-2 font-mono text-[0.58rem] uppercase transition-colors ${
        active
          ? "border-champagne bg-champagne/10 text-champagne"
          : tone === "rouge"
            ? "border-border text-rouge hover:border-rouge"
            : "border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
