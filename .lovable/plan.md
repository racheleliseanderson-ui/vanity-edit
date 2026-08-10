# Compare Packet export + saved scenario sets

Two additions to the Compare stage of the edit instrument.

## 1. Compare Packet export

A dedicated, self-contained document focused on the comparison — separate from the existing Full Edit Packet.

Contents, in order:
- Cover: publication line, baseline headline, pancake risk / skin-like, which scenarios were selected, timestamp.
- Selected scenarios: each move, what it changes, and its one-line rationale.
- Score delta table: risk, skin-like, films, minutes, objects/ceiling, tension — every scenario as a column, with deltas versus the current profile and changed cells visually marked.
- Flipped bag verdicts: only the objects whose call changed, showing baseline verdict to scenario verdict per scenario.
- Kit differences: added items marked, dropped items struck, per scenario.
- Final kit contents: the current profile's kit in full, with job, film weight and named desk examples.
- Leading pathway per scenario with its fit score.
- Standing education-only footer.

Delivered as a downloadable, print-clean HTML file in the same Vanity or Vice paper/ink treatment as the existing packet, plus a "Print" affordance.

## 2. Saved scenario sets

- Name and save the current selection of comparison moves.
- Saved sets appear as chips above the move picker: click to load, with a remove control.
- Persisted locally in the browser (no account, no backend), remembered between visits.
- Loading a set updates the move selection and the URL, so a set stays shareable.
- Saving a set with an existing name overwrites it; a small cap keeps the list tidy.
- Each saved set can be exported directly as a Compare Packet.

## Technical notes

- New `src/lib/mi/compare-packet.ts` — mirrors the structure of `full-packet.ts` (escaped HTML string builder, blob download), takes `Edit`, `Profile`, `ScenarioResult[]` and the selected move definitions.
- Flipped-verdict detail: `ScenarioResult.bag.changed` already carries the changed calls; the packet renders them per scenario rather than as counts.
- New `src/lib/mi/scenario-sets.ts` — typed localStorage read/write under a versioned key, guarded for SSR and malformed data.
- `src/routes/edit.tsx` Compare stage gains the saved-set chip row, a name input with Save, and Compare Packet download/print buttons; the Packet stage also links to the Compare Packet.
- No engine scoring changes; no new dependencies.