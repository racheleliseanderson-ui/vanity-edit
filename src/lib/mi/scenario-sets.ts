export interface ScenarioSet {
  name: string;
  moves: string[];
  saved: string;
}

const KEY = "vov_scenario_sets_v1";
const MAX = 12;

export function loadScenarioSets(): ScenarioSet[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (s): s is ScenarioSet =>
          !!s &&
          typeof s === "object" &&
          typeof (s as ScenarioSet).name === "string" &&
          Array.isArray((s as ScenarioSet).moves),
      )
      .map((s) => ({
        name: s.name.slice(0, 60),
        moves: s.moves.filter((m) => typeof m === "string").slice(0, 4),
        saved: typeof s.saved === "string" ? s.saved : new Date().toISOString(),
      }))
      .slice(0, MAX);
  } catch {
    return [];
  }
}

function persist(sets: ScenarioSet[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(sets));
  } catch {
    /* storage unavailable — sets stay in memory for this visit */
  }
}

/** Save (or overwrite by name) and return the new list, newest first. */
export function saveScenarioSet(name: string, moves: string[]): ScenarioSet[] {
  const clean = name.trim().slice(0, 60);
  if (!clean) return loadScenarioSets();
  const entry: ScenarioSet = { name: clean, moves: moves.slice(0, 4), saved: new Date().toISOString() };
  const next = [entry, ...loadScenarioSets().filter((s) => s.name.toLowerCase() !== clean.toLowerCase())].slice(0, MAX);
  persist(next);
  return next;
}

export function removeScenarioSet(name: string): ScenarioSet[] {
  const next = loadScenarioSets().filter((s) => s.name !== name);
  persist(next);
  return next;
}