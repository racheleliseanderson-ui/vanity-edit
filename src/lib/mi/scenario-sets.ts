export interface ScenarioSet {
  name: string;
  moves: string[];
  saved: string;
  used?: string;
}

const KEY = "vov_scenario_sets_v1";
const MAX = 24;

function clean(s: ScenarioSet): ScenarioSet {
  return {
    name: s.name.slice(0, 60),
    moves: s.moves.filter((m) => typeof m === "string").slice(0, 4),
    saved: typeof s.saved === "string" ? s.saved : new Date().toISOString(),
    ...(typeof s.used === "string" ? { used: s.used } : {}),
  };
}

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
      .map(clean)
      .slice(0, MAX);
  } catch {
    return [];
  }
}

function persist(sets: ScenarioSet[]) {
  if (typeof window === "undefined") return sets;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(sets.slice(0, MAX)));
  } catch {
    /* storage unavailable — sets stay in memory for this visit */
  }
  return sets.slice(0, MAX);
}

/** Save (or overwrite by name) and return the new list, newest first. */
export function saveScenarioSet(name: string, moves: string[]): ScenarioSet[] {
  const key = name.trim().slice(0, 60);
  if (!key) return loadScenarioSets();
  const entry: ScenarioSet = { name: key, moves: moves.slice(0, 4), saved: new Date().toISOString() };
  return persist([entry, ...loadScenarioSets().filter((s) => s.name.toLowerCase() !== key.toLowerCase())]);
}

export function removeScenarioSet(name: string): ScenarioSet[] {
  return persist(loadScenarioSets().filter((s) => s.name !== name));
}

export function renameScenarioSet(from: string, to: string): ScenarioSet[] {
  const key = to.trim().slice(0, 60);
  if (!key) return loadScenarioSets();
  return persist(
    loadScenarioSets()
      .filter((s) => s.name === from || s.name.toLowerCase() !== key.toLowerCase())
      .map((s) => (s.name === from ? { ...s, name: key } : s)),
  );
}

export function duplicateScenarioSet(name: string): ScenarioSet[] {
  const sets = loadScenarioSets();
  const source = sets.find((s) => s.name === name);
  if (!source) return sets;
  let copy = `${source.name} copy`;
  let n = 2;
  while (sets.some((s) => s.name.toLowerCase() === copy.toLowerCase())) copy = `${source.name} copy ${n++}`;
  return persist([{ ...source, name: copy, saved: new Date().toISOString() }, ...sets]);
}

/** Move a set one place up (-1) or down (+1) in the list. */
export function reorderScenarioSet(name: string, direction: -1 | 1): ScenarioSet[] {
  const sets = loadScenarioSets();
  const i = sets.findIndex((s) => s.name === name);
  const j = i + direction;
  if (i < 0 || j < 0 || j >= sets.length) return sets;
  const next = [...sets];
  const [moved] = next.splice(i, 1);
  next.splice(j, 0, moved!);
  return persist(next);
}

export function markScenarioSetUsed(name: string): ScenarioSet[] {
  return persist(loadScenarioSets().map((s) => (s.name === name ? { ...s, used: new Date().toISOString() } : s)));
}

/** Restore a whole set from a shared /edit link. */
export function importScenarioSet(link: string, validMoves: string[]): ScenarioSet[] | null {
  try {
    const url = new URL(link.trim(), typeof window === "undefined" ? "https://example.com" : window.location.origin);
    const moves = (url.searchParams.get("moves") ?? "").split(",").filter((m) => validMoves.includes(m));
    if (!moves.length) return null;
    const name = url.searchParams.get("set") || `Imported ${new Date().toLocaleDateString()}`;
    return saveScenarioSet(name, moves);
  } catch {
    return null;
  }
}
