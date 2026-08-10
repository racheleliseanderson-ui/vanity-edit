import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Page } from "@/components/mi/chrome";
import { Chip, DeltaNumber, Ledger, Meter, RiskDial, Slider, Spectrum, Tension } from "@/components/mi/viz";
import {
  CONCERNS,
  DEFAULT_PROFILE,
  FILTERS,
  GOALS,
  PRESETS,
  TYPE_MAP,
} from "@/lib/mi/catalog";
import { SCENARIO_MOVES, availableMoves, compareScenarios, runEdit } from "@/lib/mi/engine";
import { downloadComparePacket } from "@/lib/mi/compare-packet";
import { downloadFullPacket } from "@/lib/mi/full-packet";
import { PRODUCTS } from "@/lib/mi/products";
import { loadScenarioSets, removeScenarioSet, saveScenarioSet, type ScenarioSet } from "@/lib/mi/scenario-sets";
import type { Budget, Climate, FilterKey, Profile, SkinType } from "@/lib/mi/types";

export const Route = createFileRoute("/edit")({
  validateSearch: (
    s: Record<string, unknown>,
  ): { path?: string | undefined; stage?: string | undefined; bag?: string | undefined; moves?: string | undefined } => {
    const out: { path?: string; stage?: string; bag?: string; moves?: string } = {};
    for (const k of ["path", "stage", "bag", "moves"] as const) {
      const v = s[k];
      if (typeof v === "string" && v) out[k] = v;
    }
    return out;
  },
  head: () => ({
    meta: [
      { title: "The Edit · Makeup Intelligence" },
      {
        name: "description",
        content:
          "Adjust skin, goals, lifestyle, maintenance tolerance and desire — and watch pancake risk, pathways, tools, bag calls and your kit rescore live.",
      },
      { property: "og:title", content: "The Edit · Makeup Intelligence" },
      { property: "og:description", content: "Live pancake-risk and architecture scoring." },
    ],
  }),
  component: EditRoute,
});

const STAGES = ["Match", "Compare", "Alternatives", "Tools", "Bag", "Kit", "Packet"] as const;
type Stage = (typeof STAGES)[number];

const SKINS: SkinType[] = ["dry", "normal", "combination", "oily"];
const CLIMATES: Climate[] = ["humid", "temperate", "dry", "altitude"];
const BUDGETS: Budget[] = ["lean", "mid", "open"];
const LEVEL = ["None", "Some", "A lot", "Constantly"];

function toggle<T>(arr: T[], v: T) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

function EditRoute() {
  const search = Route.useSearch();
  const { path } = search;
  const navigate = useNavigate({ from: Route.fullPath });
  const incomingBag = useMemo(
    () => (search.bag ? search.bag.split(",").filter((id: string) => TYPE_MAP[id]) : []),
    [search.bag],
  );
  const [profile, setProfile] = useState<Profile>(() => {
    const preset = PRESETS.find((p) => p.id === path);
    const base: Profile = { ...DEFAULT_PROFILE, ...(preset?.profile ?? {}) };
    return incomingBag.length ? { ...base, bag: [...new Set([...base.bag, ...incomingBag])] } : base;
  });
  const [stage, setStageState] = useState<Stage>(() =>
    STAGES.includes(search.stage as Stage) ? (search.stage as Stage) : "Match",
  );
  const [panelOpen, setPanelOpen] = useState(false);
  const setStage = (s: Stage) => {
    setStageState(s);
    void navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, stage: s === "Match" ? undefined : s }), replace: true });
  };
  const [activePreset, setActivePreset] = useState<string | undefined>(path);

  const edit = useMemo(() => runEdit(profile), [profile]);
  const set = (patch: Partial<Profile>) => setProfile((p) => ({ ...p, ...patch }));
  const [openType, setOpenType] = useState<string | null>(null);
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [moves, setMovesState] = useState<string[]>(() =>
    search.moves ? search.moves.split(",").filter((m: string) => SCENARIO_MOVES.some((s) => s.id === m)) : ["coverage-down", "maint-up"],
  );
  const setMoves = (next: string[] | ((prev: string[]) => string[])) =>
    setMovesState((prev) => {
      const value = typeof next === "function" ? next(prev) : next;
      void navigate({
        search: (s: Record<string, unknown>) => ({ ...s, moves: value.length ? value.join(",") : undefined }),
        replace: true,
      });
      return value;
    });
  const offers = useMemo(() => availableMoves(profile), [profile]);
  const live = useMemo(() => moves.filter((m) => offers.some((o) => o.id === m)), [moves, offers]);
  const columns = useMemo(() => compareScenarios(profile, live), [profile, live]);
  const baseline = columns[0];

  /* Saved scenario sets — local to this browser. */
  const [sets, setSets] = useState<ScenarioSet[]>([]);
  const [setName, setSetName] = useState("");
  const [loadedSet, setLoadedSet] = useState<string | undefined>(undefined);
  useEffect(() => setSets(loadScenarioSets()), []);

  const moveDefs = useMemo(
    () =>
      live
        .map((id) => SCENARIO_MOVES.find((m) => m.id === id))
        .filter((m): m is (typeof SCENARIO_MOVES)[number] => Boolean(m))
        .map((m) => ({ id: m.id, label: m.label, move: m.moveLabel(profile), note: m.note })),
    [live, profile],
  );
  const exportCompare = () => downloadComparePacket(edit, profile, columns, moveDefs, loadedSet);

  /** Apply one costed move straight into the live profile. */
  const applyMove = (id: string) => {
    const def = SCENARIO_MOVES.find((m) => m.id === id);
    if (!def) return;
    setProfile((p) => def.move(p));
    setActivePreset(undefined);
  };

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : e.key === "Home" ? -99 : e.key === "End" ? 99 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = dir === -99 ? 0 : dir === 99 ? STAGES.length - 1 : (i + dir + STAGES.length) % STAGES.length;
    setStage(STAGES[next]!);
    tabRefs.current[next]?.focus();
  };

  useEffect(() => {
    if (panelOpen) setPanelOpen(false);
    // close the mobile drawer whenever the stage changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  return (
    <Page>
      {/* Preset rail + live instrument */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-[1400px] px-5 py-10 md:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Step into the edit</p>
              <h1 className="display mt-3 text-4xl md:text-6xl">
                Your <span className="gilt-text italic">personal edit</span>
              </h1>
              <div className="mt-6 flex flex-wrap gap-2 no-print">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePreset(p.id);
                      setProfile({ ...DEFAULT_PROFILE, ...p.profile });
                    }}
                    className={`border px-4 py-2 text-[0.66rem] tracking-[0.2em] uppercase transition-colors ${
                      activePreset === p.id
                        ? "border-champagne bg-champagne/10 text-champagne"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="panel p-7">
              <RiskDial arch={edit.architecture} />
              <div className="mt-6">
                <Spectrum value={edit.architecture.risk} />
              </div>
              <div className="mt-7 grid grid-cols-3 gap-4 border-t border-border pt-5">
                <Stat k="Objects" v={`${edit.kit.items.length}/${edit.kit.ceiling}`} />
                <Stat k="Films" v={`${edit.kit.layers}`} />
                <Stat k="Tension" v={`${edit.kit.tension}`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-14 md:px-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        {/* Instrument panel — a drawer on small screens, a sticky rail from lg up */}
        <div className="no-print lg:hidden">
          <button
            onClick={() => setPanelOpen((o) => !o)}
            aria-expanded={panelOpen}
            aria-controls="instrument-panel"
            className="flex min-h-11 w-full items-center justify-between border border-champagne/50 bg-champagne/5 px-5 py-3 text-left"
          >
            <span className="text-[0.66rem] tracking-[0.24em] uppercase text-champagne">
              {panelOpen ? "Close the instrument" : "Adjust the instrument"}
            </span>
            <span className="text-xs text-muted-foreground">
              {profile.goals.length} goals · {profile.skin} · {profile.coverage}/100 · {profile.ceiling} objects
            </span>
          </button>
        </div>
        <aside
          id="instrument-panel"
          className={`no-print space-y-10 ${panelOpen ? "" : "hidden"} lg:block lg:sticky lg:top-[110px] lg:max-h-[calc(100vh-140px)] lg:self-start lg:space-y-10 lg:overflow-y-auto lg:pr-4`}
        >
          <Group title="Goals" note="Pick as many as are true.">
            <div className="grid gap-2">
              {GOALS.map((g) => (
                <Chip key={g.id} active={profile.goals.includes(g.id)} note={g.note} onClick={() => set({ goals: toggle(profile.goals, g.id) })}>
                  {g.label}
                </Chip>
              ))}
            </div>
          </Group>

          <Group title="Skin" note="Type, reactivity and what you notice.">
            <div className="grid grid-cols-2 gap-2">
              {SKINS.map((s) => (
                <Chip key={s} active={profile.skin === s} onClick={() => set({ skin: s })}>
                  <span className="capitalize">{s}</span>
                </Chip>
              ))}
            </div>
            <Slider label="Sensitivity" hint={LEVEL[profile.sensitivity]!} min={0} max={3} value={profile.sensitivity} onChange={(n) => set({ sensitivity: n })} />
            <div className="flex flex-wrap gap-2">
              {CONCERNS.map((c) => (
                <button
                  key={c}
                  onClick={() => set({ concerns: toggle(profile.concerns, c) })}
                  className={`border px-3 py-2 text-xs transition-colors ${
                    profile.concerns.includes(c) ? "border-champagne bg-champagne/10 text-champagne" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Group>

          <Group title="Lifestyle" note="Where the makeup has to survive.">
            <div className="grid grid-cols-2 gap-2">
              {CLIMATES.map((c) => (
                <Chip key={c} active={profile.climate === c} onClick={() => set({ climate: c })}>
                  <span className="capitalize">{c}</span>
                </Chip>
              ))}
            </div>
            <Slider label="Outdoors" hint={LEVEL[profile.outdoors]!} min={0} max={3} value={profile.outdoors} onChange={(n) => set({ outdoors: n })} />
            <Slider label="Time each morning" hint={`${profile.timeBudget} min`} min={2} max={40} step={1} value={profile.timeBudget} onChange={(n) => set({ timeBudget: n })} />
          </Group>

          <Group title="Tolerance & desire" note="Both are allowed to be honest.">
            <Slider
              label="Maintenance tolerance"
              hint={["No touch-ups", "One blot", "Midday reset", "Happy to maintain"][profile.maintenance]!}
              min={0}
              max={3}
              value={profile.maintenance}
              onChange={(n) => set({ maintenance: n })}
            />
            <Slider
              label="Desire for the ritual"
              hint={["Wear less", "Quiet", "Enjoy it", "Want the ritual"][profile.desire]!}
              min={0}
              max={3}
              value={profile.desire}
              onChange={(n) => set({ desire: n })}
            />
            <Slider label="Coverage appetite" hint={`${profile.coverage} / 100`} value={profile.coverage} onChange={(n) => set({ coverage: n })} />
            <Slider label="Complexity ceiling" hint={`${profile.ceiling} objects`} min={3} max={12} value={profile.ceiling} onChange={(n) => set({ ceiling: n })} />
          </Group>

          <Group title="Filters & budget" note="Preferences, never safety claims.">
            <div className="grid gap-2">
              {FILTERS.map((f) => (
                <Chip key={f.id} active={profile.filters.includes(f.id)} onClick={() => set({ filters: toggle<FilterKey>(profile.filters, f.id) })}>
                  {f.label}
                </Chip>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {BUDGETS.map((b) => (
                <Chip key={b} active={profile.budget === b} onClick={() => set({ budget: b })}>
                  <span className="capitalize">{b}</span>
                </Chip>
              ))}
            </div>
          </Group>

          <Group title="What is in the bag now" note="Used for the bag edit — nothing gets thrown away.">
            <div className="grid gap-2">
              {Object.values(TYPE_MAP)
                .filter((t) => t.lane !== "care")
                .map((t) => (
                  <button
                    key={t.id}
                    onClick={() => set({ bag: toggle(profile.bag, t.id) })}
                    className={`flex items-center justify-between border px-3 py-2 text-left text-xs transition-colors ${
                      profile.bag.includes(t.id) ? "border-champagne/60 bg-champagne/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                    <span className="text-[0.6rem] tracking-[0.2em] uppercase opacity-60">{profile.bag.includes(t.id) ? "owned" : "add"}</span>
                  </button>
                ))}
            </div>
          </Group>
        </aside>

        {/* Output */}
        <div>
          <div
            role="tablist"
            aria-label="Stages of the edit"
            className="no-print sticky top-[86px] z-20 -mx-5 mb-10 flex snap-x gap-1 overflow-x-auto border-b border-border bg-background/90 px-5 py-2 backdrop-blur-xl md:mx-0 md:px-0"
          >
            {STAGES.map((s, i) => (
              <button
                key={s}
                role="tab"
                id={`stage-tab-${s}`}
                aria-selected={stage === s}
                aria-controls="stage-panel"
                tabIndex={stage === s ? 0 : -1}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                onKeyDown={(e) => onTabKey(e, i)}
                onClick={() => setStage(s)}
                className={`flex min-h-11 snap-start items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2 text-[0.68rem] tracking-[0.24em] uppercase transition-colors ${
                  stage === s
                    ? "border-champagne text-champagne"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="opacity-50">{String(i + 1).padStart(2, "0")}</span>
                {s}
              </button>
            ))}
          </div>
          <div id="stage-panel" role="tabpanel" aria-labelledby={`stage-tab-${stage}`}>
          <p className="sr-only" aria-live="polite">
            {stage} · pancake risk {edit.architecture.risk} of 100 · {edit.kit.items.length} objects · {edit.kit.layers} films
          </p>

          {stage === "Match" && (
            <Section title="Makeup Match" lead="Product types scored against your profile. Layer weight is penalised, not celebrated.">
              <div className="panel mb-10 p-7">
                <p className="eyebrow">Move one input</p>
                <h3 className="display mt-2 text-3xl">What each adjustment would actually cost you</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Every row is the same engine re-run with one field changed. Nothing here is applied until you touch the
                  instrument panel.
                </p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {edit.whatIf.map((w) => (
                    <div key={w.id} className="border border-border p-4 transition-colors hover:border-champagne/50">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-sm">{w.label}</p>
                        <span
                          className="text-[0.72rem] tabular-nums tracking-[0.16em]"
                          style={{ color: w.delta === 0 ? "var(--muted-foreground)" : w.delta < 0 ? "var(--tone-good)" : "var(--tone-warn)" }}
                        >
                          {w.delta > 0 ? `+${w.delta}` : w.delta} risk
                        </span>
                      </div>
                      <p className="mt-1 text-[0.68rem] tracking-[0.16em] uppercase text-muted-foreground">
                        {w.move} · risk {w.risk} · {w.kitSize} objects
                      </p>
                      <p className="mt-2 text-xs leading-snug text-muted-foreground">{w.note}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {SCENARIO_MOVES.some((m) => m.id === w.id) && (
                          <>
                            <button
                              onClick={() => applyMove(w.id)}
                              className="min-h-11 border border-champagne/60 px-4 py-2 text-[0.58rem] tracking-[0.24em] uppercase text-champagne transition-colors hover:bg-champagne/10"
                            >
                              Apply this move
                            </button>
                            <button
                              onClick={() => {
                                setMoves((prev) => (prev.includes(w.id) ? prev : [...prev, w.id].slice(-4)));
                                setStage("Compare");
                              }}
                              className="min-h-11 border border-border px-4 py-2 text-[0.58rem] tracking-[0.24em] uppercase text-muted-foreground transition-colors hover:text-foreground"
                            >
                              Compare it
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-10 grid gap-4 sm:grid-cols-2">
                {edit.architecture.contributions.map((c) => (
                  <div key={c.label} className="panel p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm">{c.label}</p>
                      <span className="text-[0.7rem] tabular-nums tracking-[0.2em] uppercase" style={{ color: c.delta > 0 ? "var(--tone-warn)" : "var(--tone-good)" }}>
                        {c.delta > 0 ? `+${c.delta}` : c.delta}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.note}</p>
                  </div>
                ))}
              </div>
              <div className="divide-y divide-border border-y border-border">
                {edit.types.slice(0, 18).map((t) => (
                  <article key={t.id} className="grid gap-5 py-7 md:grid-cols-[1.1fr_1fr]">
                    <div>
                      <p className="text-[0.62rem] tracking-[0.26em] uppercase text-muted-foreground">
                        {t.tier === "core" ? "Core of the architecture" : t.tier === "consider" ? "Consider" : "Hold for now"}
                      </p>
                      <h3 className="display mt-2 text-3xl">{t.label}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{t.lane}</p>
                      <div className="mt-4 max-w-xs">
                        <Meter value={t.score} label="Fit" right={`${t.score}`} tone={t.tier === "hold" ? "oxblood" : "champagne"} />
                        <div className="mt-3">
                          <Meter value={(t.layerWeight / 3) * 100} label="Layer weight" right={`${t.layerWeight} / 3`} tone="oxblood" />
                        </div>
                      </div>
                      <button
                        onClick={() => setOpenType(openType === t.id ? null : t.id)}
                        className="no-print mt-5 text-[0.62rem] tracking-[0.26em] uppercase text-champagne transition-opacity hover:opacity-70"
                        aria-expanded={openType === t.id}
                      >
                        {openType === t.id ? "Hide the maths" : "Why it scored this"}
                      </button>
                      {openType === t.id && (
                        <div className="stage-in mt-5 border-l border-champagne/40 pl-5">
                          <Ledger items={t.breakdown} caption="Score ledger · from a neutral 50" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-3 text-sm">
                      <ul className="space-y-1">
                        {t.reasons.map((r) => (
                          <li key={r} className="text-foreground/90">— {r}</li>
                        ))}
                      </ul>
                      {t.cautions.length > 0 && (
                        <ul className="space-y-1 text-muted-foreground">
                          {t.cautions.map((c) => (
                            <li key={c}>· {c}</li>
                          ))}
                        </ul>
                      )}
                      <p className="text-xs text-muted-foreground">Desk examples · {t.examples.join(" · ")}</p>
                    </div>
                  </article>
                ))}
              </div>
            </Section>
          )}

          {stage === "Compare" && (
            <Section
              title="Scenario comparison"
              lead="Run several futures beside each other before you change a single field."
            >
              <div className="panel p-6 md:p-8">
                <p className="eyebrow">Pick the moves to compare</p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Each column is the whole engine re-run — scores, pathway, kit, tools and bag calls — with one field
                  changed. Up to four at a time. Nothing is applied to your profile.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {offers.map((m) => {
                    const on = live.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        onClick={() =>
                          setMoves((prev) =>
                            prev.includes(m.id) ? prev.filter((x) => x !== m.id) : [...prev, m.id].slice(-4),
                          )
                        }
                        aria-pressed={on}
                        className={`border px-3 py-2 text-[0.64rem] tracking-[0.18em] uppercase transition-colors ${
                          on
                            ? "border-champagne bg-champagne/10 text-champagne"
                            : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 border-t border-border pt-6">
                  <p className="eyebrow">Scenario sets</p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Name this selection and it stays in this browser for next time. Loading a set updates the address bar
                    too, so it travels.
                  </p>
                  {sets.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {sets.map((s) => (
                        <span
                          key={s.name}
                          className={`inline-flex items-stretch border ${
                            loadedSet === s.name ? "border-champagne bg-champagne/10" : "border-border"
                          }`}
                        >
                          <button
                            onClick={() => {
                              setMoves(s.moves);
                              setLoadedSet(s.name);
                              setSetName(s.name);
                            }}
                            className={`min-h-11 px-4 py-2 text-[0.64rem] tracking-[0.18em] uppercase transition-colors ${
                              loadedSet === s.name ? "text-champagne" : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {s.name} <span className="opacity-60">· {s.moves.length}</span>
                          </button>
                          <button
                            onClick={() => {
                              setSets(removeScenarioSet(s.name));
                              if (loadedSet === s.name) setLoadedSet(undefined);
                            }}
                            aria-label={`Remove the ${s.name} scenario set`}
                            className="min-h-11 border-l border-border px-3 text-xs text-muted-foreground transition-colors hover:text-rouge"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <label className="sr-only" htmlFor="set-name">
                      Name this scenario set
                    </label>
                    <input
                      id="set-name"
                      value={setName}
                      onChange={(e) => setSetName(e.target.value)}
                      placeholder="Name this set"
                      className="min-h-11 min-w-[14rem] flex-1 border border-border bg-transparent px-4 py-2 text-sm placeholder:text-muted-foreground"
                    />
                    <button
                      onClick={() => {
                        if (!setName.trim() || live.length === 0) return;
                        setSets(saveScenarioSet(setName, live));
                        setLoadedSet(setName.trim());
                      }}
                      disabled={!setName.trim() || live.length === 0}
                      className="min-h-11 border border-champagne/60 px-5 py-2 text-[0.62rem] tracking-[0.24em] uppercase text-champagne transition-colors hover:bg-champagne/10 disabled:opacity-40"
                    >
                      Save this set
                    </button>
                    <button
                      onClick={exportCompare}
                      className="min-h-11 border border-champagne bg-champagne/10 px-5 py-2 text-[0.62rem] tracking-[0.24em] uppercase text-champagne transition-colors hover:bg-champagne hover:text-accent-foreground"
                    >
                      Export the compare packet
                    </button>
                  </div>
                </div>
              </div>

              <p className="no-print mt-6 text-[0.62rem] tracking-[0.22em] uppercase text-muted-foreground md:hidden">
                Swipe the columns sideways · changed lines are marked
              </p>
              <div className="-mx-5 mt-8 flex snap-x gap-5 overflow-x-auto px-5 pb-3 md:mx-0 md:px-0">
                <div className="flex gap-5">
                  {columns.map((c) => (
                    <article
                      key={c.id}
                      className={`stage-in flex w-[82vw] shrink-0 snap-start flex-col gap-5 border p-5 sm:w-[300px] ${
                        c.id === "current" ? "border-champagne/60 bg-champagne/[0.04]" : "border-border"
                      }`}
                    >
                      <header>
                        <p className="eyebrow">{c.id === "current" ? "Baseline" : "Scenario"}</p>
                        <h3 className="display mt-2 text-2xl leading-tight">{c.label}</h3>
                        <p className="mt-1 text-[0.62rem] tracking-[0.2em] uppercase text-muted-foreground">{c.move}</p>
                      </header>

                      <div>
                        <div className="flex items-baseline gap-3">
                          <span className="display text-4xl tabular-nums">{c.risk}</span>
                          {c.id !== "current" && (
                            <span
                              className="text-[0.72rem] tabular-nums tracking-[0.16em]"
                              style={{
                                color:
                                  c.delta === 0
                                    ? "var(--muted-foreground)"
                                    : c.delta < 0
                                      ? "var(--tone-good)"
                                      : "var(--tone-warn)",
                              }}
                            >
                              {c.delta > 0 ? `+${c.delta}` : c.delta}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground">
                          Pancake risk · skin-like {c.skinlike}
                        </p>
                        <div className="mt-4 space-y-3">
                          <Meter value={c.risk} label="Risk" right={`${c.risk}`} tone={c.risk > 50 ? "oxblood" : "champagne"} />
                          <Meter value={c.tension} label="Tension" right={`${c.tension}`} tone={c.tension > 45 ? "oxblood" : "champagne"} />
                        </div>
                      </div>

                      <dl className="grid grid-cols-3 gap-3 border-y border-border py-4 text-center">
                        <Cell
                          k="Objects"
                          v={`${c.objects}/${c.ceiling}`}
                          changed={!!baseline && c.id !== "current" && (c.objects !== baseline.objects || c.ceiling !== baseline.ceiling)}
                        />
                        <Cell k="Films" v={`${c.layers}`} changed={!!baseline && c.id !== "current" && c.layers !== baseline.layers} />
                        <Cell k="Min" v={`${c.minutes}`} changed={!!baseline && c.id !== "current" && c.minutes !== baseline.minutes} />
                      </dl>

                      <div>
                        <p className="text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground">Leading pathway</p>
                        <p
                          className={`mt-1 text-sm ${
                            baseline && c.id !== "current" && c.pathway !== baseline.pathway ? "text-champagne" : ""
                          }`}
                        >
                          {c.pathway} <span className="text-muted-foreground">· {c.pathwayFit}</span>
                        </p>
                      </div>

                      <div>
                        <p className="text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground">Kit it builds</p>
                        <ul className="mt-2 space-y-1 text-sm">
                          {c.kit.map((k) => {
                            const isNew = !!baseline && c.id !== "current" && !baseline.kit.some((b) => b.label === k.label);
                            return (
                              <li key={k.label} className={isNew ? "text-champagne" : ""}>
                                {isNew ? "+ " : ""}
                                {k.label} <span className="text-muted-foreground">· {k.lane}</span>
                              </li>
                            );
                          })}
                          {baseline &&
                            c.id !== "current" &&
                            baseline.kit
                              .filter((b) => !c.kit.some((k) => k.label === b.label))
                              .map((b) => (
                                <li key={`dropped-${b.label}`} className="text-rouge line-through">
                                  {b.label}
                                </li>
                              ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground">Highest scores</p>
                        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                          {c.top.map((t) => (
                            <li key={t.label} className="flex justify-between gap-3">
                              <span>{t.label}</span>
                              <span className="tabular-nums">{t.score}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto border-t border-border pt-4">
                        <p className="text-[0.6rem] tracking-[0.24em] uppercase text-muted-foreground">Bag decisions</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {c.bag.keep} keep · {c.bag.differently} use differently · {c.bag.replace} replace when finished
                        </p>
                        {c.bag.changed.length > 0 && (
                          <ul className="mt-2 space-y-1 text-xs text-champagne">
                            {c.bag.changed.map((ch) => (
                              <li key={ch}>{ch}</li>
                            ))}
                          </ul>
                        )}
                        <p className="mt-3 text-xs leading-snug text-muted-foreground">{c.note}</p>
                        {c.id !== "current" && SCENARIO_MOVES.some((m) => m.id === c.id) && (
                          <button
                            onClick={() => applyMove(c.id)}
                            className="mt-4 min-h-11 w-full border border-champagne/60 px-4 py-2 text-[0.58rem] tracking-[0.24em] uppercase text-champagne transition-colors hover:bg-champagne/10"
                          >
                            Make this my profile
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </Section>
          )}

          {stage === "Alternatives" && (
            <Section title="Alternative pathways" lead="Nine routes to the same intention. Each one names what it trades away.">
              <div className="space-y-6">
                {edit.pathways.map((p, i) => (
                  <article key={p.id} className="panel p-7">
                    <div className="flex flex-wrap items-baseline justify-between gap-4">
                      <div>
                        <p className="eyebrow">{i === 0 ? "Strongest fit" : `Pathway ${i + 1}`}</p>
                        <h3 className="display mt-2 text-3xl md:text-4xl">{p.name}</h3>
                        <p className="mt-1 text-sm italic text-muted-foreground">{p.promise}</p>
                      </div>
                      <div className="w-full max-w-[220px]">
                        <Meter value={p.fit} label="Fit" right={`${p.fit} / 100`} />
                        <p className="mt-3 text-[0.62rem] tracking-[0.2em] uppercase text-muted-foreground">
                          {p.types.length} objects · {p.layers} films · {p.minutes} min
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                      <ul className="space-y-1 text-sm">
                        {p.because.map((b) => (
                          <li key={b}>— {b}</li>
                        ))}
                      </ul>
                      <div>
                        <p className="text-[0.62rem] tracking-[0.26em] uppercase text-rouge">Trade-off</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.tradeoff}</p>
                        <p className="mt-4 text-xs text-muted-foreground">
                          Objects · {p.types.map((t) => TYPE_MAP[t]?.label ?? t).join(" · ")}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setOpenPath(openPath === p.id ? null : p.id)}
                      className="no-print mt-6 text-[0.62rem] tracking-[0.26em] uppercase text-champagne transition-opacity hover:opacity-70"
                      aria-expanded={openPath === p.id}
                    >
                      {openPath === p.id ? "Hide the ledger" : `Why it scored ${p.fit}`}
                    </button>
                    {openPath === p.id && (
                      <div className="stage-in mt-5 max-w-xl border-l border-champagne/40 pl-5">
                        <Ledger items={p.ledger} caption="Pathway ledger" />
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </Section>
          )}

          {stage === "Tools" && (
            <Section title="Tool necessity" lead="Derived from the kit you actually earned — not from a starter set.">
              <div className="divide-y divide-border border-y border-border">
                {edit.tools.map((t) => (
                  <div key={t.id} className="grid gap-3 py-6 md:grid-cols-[1fr_auto_1.2fr] md:items-baseline md:gap-8">
                    <h3 className="display text-2xl">{t.label}</h3>
                    <span
                      className={`text-[0.62rem] tracking-[0.26em] uppercase ${
                        t.verdict === "essential" ? "text-champagne" : t.verdict === "optional" ? "text-muted-foreground" : "text-rouge"
                      }`}
                    >
                      {t.verdict}
                    </span>
                    <p className="text-sm leading-relaxed text-muted-foreground">{t.why}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {stage === "Bag" && (
            <Section title="Bag edit" lead="Keep, use differently, or replace when finished. No purge culture.">
              {edit.bag.length === 0 ? (
                <p className="panel p-7 text-muted-foreground">
                  Mark what you already own in the instrument panel and the desk will edit it rather than replace it.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {edit.bag.map((b) => (
                    <article key={b.id} className="panel p-6">
                      <p
                        className={`text-[0.62rem] tracking-[0.26em] uppercase ${
                          b.verdict === "keep" ? "text-champagne" : b.verdict === "use differently" ? "text-foreground" : "text-rouge"
                        }`}
                      >
                        {b.verdict}
                      </p>
                      <h3 className="display mt-2 text-2xl">{b.label}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.why}</p>
                    </article>
                  ))}
                </div>
              )}
            </Section>
          )}

          {stage === "Kit" && (
            <Section title="Build my kit" lead="A ceiling that refuses to be filled just because slots exist.">
              <div className="panel p-7">
                <div className="grid gap-6 sm:grid-cols-3">
                  <Stat k="Objects" v={`${edit.kit.items.length} / ${edit.kit.ceiling}`} />
                  <Stat k="Films on skin" v={`${edit.kit.layers}`} />
                  <Stat k="Morning" v={`${edit.kit.minutes} min`} />
                </div>
                <div className="mt-7">
                  <Meter value={edit.kit.projectedRisk} label="Projected pancake risk for this kit" right={`${edit.kit.projectedRisk} / 100`} tone={edit.kit.projectedRisk > 50 ? "oxblood" : "champagne"} />
                </div>
                <div className="mt-8 border-t border-border pt-7">
                  <Tension value={edit.kit.tension} note={edit.kit.tensionNote} />
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{edit.kit.note}</p>
              </div>
              <div className="mt-8 divide-y divide-border border-y border-border">
                {edit.kit.items.map((it, i) => (
                  <div key={it.id} className="grid gap-3 py-6 md:grid-cols-[3rem_1fr_1.2fr] md:gap-8">
                    <span className="display text-champagne text-xl">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="display text-2xl">{it.label}</h3>
                      <p className="mt-1 text-xs tracking-[0.2em] uppercase text-muted-foreground">Layer weight {it.layerWeight}</p>
                    </div>
                    <div>
                      <p className="text-sm">{it.job}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        On the desk ·{" "}
                        {PRODUCTS.filter((p) => p.typeId === it.id).length
                          ? PRODUCTS.filter((p) => p.typeId === it.id)
                              .slice(0, 3)
                              .map((p) => `${p.brand} ${p.name} ($${p.price})`)
                              .join(" · ")
                          : it.example}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 space-y-6">
                {edit.coach.map((c) => (
                  <article key={c.title} className="border-l border-champagne/50 pl-6">
                    <h3 className="display text-2xl">{c.title}</h3>
                    <p className="mt-2 max-w-2xl leading-[1.85] text-muted-foreground">{c.body}</p>
                  </article>
                ))}
              </div>
            </Section>
          )}

          {stage === "Packet" && (
            <Section title="The edit packet" lead="Print or save as PDF. Yours to take to the counter.">
              <div className="no-print mb-10 flex flex-wrap gap-3">
                <button
                  onClick={() => downloadFullPacket(edit, profile, columns)}
                  className="inline-flex border border-champagne bg-champagne/10 px-7 py-4 text-[0.72rem] tracking-[0.3em] uppercase text-champagne transition-colors hover:bg-champagne hover:text-accent-foreground"
                >
                  Export the full packet
                </button>
                <button
                  onClick={exportCompare}
                  className="inline-flex border border-champagne/60 px-7 py-4 text-[0.72rem] tracking-[0.3em] uppercase text-champagne transition-colors hover:bg-champagne/10"
                >
                  Export the compare packet
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex border border-border px-7 py-4 text-[0.72rem] tracking-[0.3em] uppercase text-muted-foreground transition-colors hover:text-foreground"
                >
                  Print this summary
                </button>
              </div>
              <p className="no-print mb-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                The full packet is a single self-contained file: your inputs, the architecture ledger, every scored
                product type, all nine pathways, tools, bag calls, coaching, the costed single moves and the{" "}
                {columns.length} scenario{columns.length === 1 ? "" : "s"} you have lined up — with named formulas and
                prices beside each kit object. Open it anywhere, or print it to PDF.
              </p>
              <div className="panel space-y-10 p-8 md:p-12">
                <header className="border-b border-border pb-6">
                  <p className="eyebrow">Vanity or Vice · Makeup Intelligence</p>
                  <p className="display mt-3 text-4xl md:text-5xl">The Edit Packet</p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {edit.architecture.headline} · pancake risk {edit.architecture.risk} / 100 · skin-like {edit.architecture.skinlike} / 100
                  </p>
                </header>
                <div className="grid gap-8 sm:grid-cols-3">
                  <Stat k="Objects" v={`${edit.kit.items.length} / ${edit.kit.ceiling}`} />
                  <Stat k="Films on skin" v={`${edit.kit.layers}`} />
                  <Stat k="Kit tension" v={`${edit.kit.tension} / 100`} />
                </div>
                <div>
                  <p className="eyebrow">Architecture</p>
                  <p className="mt-3 max-w-2xl leading-[1.85] text-muted-foreground">{edit.architecture.verdict}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-[1.85] text-muted-foreground">{edit.kit.tensionNote}</p>
                </div>
                <div>
                  <p className="eyebrow">The kit</p>
                  <ul className="mt-4 space-y-3">
                    {edit.kit.items.map((it) => {
                      const named = PRODUCTS.filter((p) => p.typeId === it.id).slice(0, 3);
                      return (
                        <li key={it.id} className="border-b border-border pb-3">
                          <span className="display text-xl">{it.label}</span>
                          <span className="block text-sm text-muted-foreground">{it.job}</span>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            {named.length
                              ? named.map((p) => `${p.brand} ${p.name} ($${p.price})`).join(" · ")
                              : `e.g. ${it.example}`}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {columns.length > 1 && (
                  <div>
                    <p className="eyebrow">Scenarios you compared</p>
                    <ul className="mt-4 space-y-2 text-sm">
                      {columns.slice(1).map((c) => (
                        <li key={c.id} className="border-b border-border pb-2 text-muted-foreground">
                          <span className="text-foreground">{c.label} ({c.move})</span> · risk {c.risk} (
                          {c.delta > 0 ? `+${c.delta}` : c.delta}) · {c.objects} objects · {c.layers} films · tension{" "}
                          {c.tension} · {c.pathway}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <p className="eyebrow">Essential tools</p>
                    <ul className="mt-3 space-y-1 text-sm">
                      {edit.tools.filter((t) => t.verdict === "essential").map((t) => <li key={t.id}>{t.label}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="eyebrow">Chosen pathway</p>
                    <p className="mt-3 text-sm">
                      {edit.pathways[0]?.name} — {edit.pathways[0]?.tradeoff}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="eyebrow">The next best single move</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {edit.whatIf.slice(0, 3).map((w) => (
                      <li key={w.id} className="border-b border-border pb-2 text-muted-foreground">
                        <span className="text-foreground">{w.label} ({w.move})</span> · risk would read {w.risk} ({w.delta > 0 ? `+${w.delta}` : w.delta}). {w.note}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="eyebrow">Coaching</p>
                  <div className="mt-4 space-y-4">
                    {edit.coach.map((c) => (
                      <p key={c.title} className="text-sm leading-[1.85] text-muted-foreground">
                        <span className="text-foreground">{c.title}. </span>
                        {c.body}
                      </p>
                    ))}
                  </div>
                </div>
                <p className="border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
                  Education only. Product types and desk examples are illustrative, never safety rankings, toxin scores
                  or medical advice.
                </p>
              </div>
            </Section>
          )}
          </div>
        </div>
      </div>
    </Page>
  );
}

function Group({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="border-b border-border pb-3">
        <h2 className="display text-2xl">{title}</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{note}</p>
      </div>
      {children}
    </section>
  );
}

function Section({ title, lead, children }: { title: string; lead: string; children: React.ReactNode }) {
  return (
    <section className="stage-in">
      <p className="eyebrow">{title}</p>
      <p className="display mt-3 max-w-2xl text-3xl md:text-5xl">{lead}</p>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return <StatInner k={k} v={v} />;
}

function Cell({ k, v, changed }: { k: string; v: string; changed?: boolean }) {
  return (
    <div>
      <dt className="text-[0.55rem] tracking-[0.22em] uppercase text-muted-foreground">{k}</dt>
      <dd className={`display mt-1 text-xl tabular-nums ${changed ? "text-champagne" : ""}`}>
        {v}
        {changed && <span className="sr-only"> (changed from baseline)</span>}
      </dd>
    </div>
  );
}

function StatInner({ k, v }: { k: string; v: string }) {
  const num = Number(v.split(" ")[0]?.split("/")[0]);
  return (
    <div>
      <p className="text-[0.62rem] tracking-[0.26em] uppercase text-muted-foreground">{k}</p>
      <p className="display mt-2 text-3xl tabular-nums">
        {Number.isFinite(num) ? (
          <>
            <DeltaNumber value={num} />
            {v.slice(String(num).length)}
          </>
        ) : (
          v
        )}
      </p>
    </div>
  );
}