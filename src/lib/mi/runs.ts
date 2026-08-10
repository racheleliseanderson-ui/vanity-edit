import type { Profile } from "./types";

/** One saved pass of the instrument: inputs, path, comparison and where you stopped. */
export interface SavedRun {
  id: string;
  name: string;
  saved: number;
  profile: Profile;
  path?: string | undefined;
  moves: string[];
  stage: string;
}

const KEY = "mi-runs-v1";
const CAP = 24;

function read(): SavedRun[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r): r is SavedRun =>
        !!r &&
        typeof r === "object" &&
        typeof (r as SavedRun).id === "string" &&
        typeof (r as SavedRun).name === "string" &&
        typeof (r as SavedRun).profile === "object",
    );
  } catch {
    return [];
  }
}

function write(runs: SavedRun[]): SavedRun[] {
  const next = runs.slice(0, CAP);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  }
  return next;
}

export const loadRuns = (): SavedRun[] => read().sort((a, b) => b.saved - a.saved);

export function saveRun(input: Omit<SavedRun, "id" | "saved">): SavedRun[] {
  const name = input.name.trim() || "Untitled run";
  const existing = read().filter((r) => r.name !== name);
  return write(
    [{ ...input, name, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, saved: Date.now() }, ...existing].sort(
      (a, b) => b.saved - a.saved,
    ),
  );
}

export const removeRun = (id: string): SavedRun[] => write(read().filter((r) => r.id !== id));

export function duplicateRun(id: string): SavedRun[] {
  const found = read().find((r) => r.id === id);
  if (!found) return loadRuns();
  return saveRun({ ...found, name: `${found.name} copy` });
}

export function renameRun(id: string, name: string): SavedRun[] {
  const trimmed = name.trim();
  if (!trimmed) return loadRuns();
  return write(read().map((r) => (r.id === id ? { ...r, name: trimmed } : r))).sort((a, b) => b.saved - a.saved);
}

/* ─────────── Run diffing ─────────── */

export interface RunDiffRow {
  field: string;
  a: string;
  b: string;
}

const fmt = (v: unknown): string =>
  Array.isArray(v) ? (v.length ? v.join(", ") : "none") : typeof v === "number" ? String(v) : String(v ?? "—");

const FIELDS: { key: keyof Profile; label: string }[] = [
  { key: "goals", label: "Goals" },
  { key: "skin", label: "Skin" },
  { key: "sensitivity", label: "Sensitivity" },
  { key: "concerns", label: "Noticing" },
  { key: "climate", label: "Climate" },
  { key: "outdoors", label: "Outdoors" },
  { key: "timeBudget", label: "Minutes" },
  { key: "maintenance", label: "Maintenance tolerance" },
  { key: "desire", label: "Desire" },
  { key: "ceiling", label: "Ceiling" },
  { key: "coverage", label: "Coverage appetite" },
  { key: "filters", label: "Filters" },
  { key: "budget", label: "Budget" },
  { key: "undertone", label: "Undertone" },
  { key: "depth", label: "Depth" },
  { key: "bag", label: "In the bag" },
];

/** Only the fields that actually differ. An empty result means the two runs are identical. */
export function diffRuns(a: SavedRun, b: SavedRun): RunDiffRow[] {
  return FIELDS.map(({ key, label }) => ({ field: label, a: fmt(a.profile[key]), b: fmt(b.profile[key]) })).filter(
    (r) => r.a !== r.b,
  );
}
