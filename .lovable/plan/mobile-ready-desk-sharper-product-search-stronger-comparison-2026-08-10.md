# Mobile-ready desk, sharper product search, stronger comparison

Three areas, one pass, no new backend.

## 1. Mobile accessibility

The instrument was composed desktop-first: the profile panel is a tall sticky column, the stage tabs scroll off-edge, and most controls are 0.6rem uppercase text with tap targets well under 44px.

- Turn the profile panel into a collapsible drawer on small screens: a "Your inputs" summary bar (goals, skin, ceiling, minutes) that expands into the full field set, so results are what you land on.
- Rebuild the stage strip as a real tablist: `role="tablist"` with arrow-key movement, current-stage announcement, a visible scroll affordance, and 44px-tall targets.
- Raise every filter chip, preset button, toggle and expander to a 44px minimum touch height, keeping the fine letter-spaced type but padding it out.
- Add accessible names wherever only an icon or bare symbol carries meaning, `aria-expanded` on every "why it scored this" expander, one `<main>` landmark per page, `h-dvh` in place of `h-screen`, and visible focus rings from the design tokens.
- Recompose the wide grids for narrow screens: kit rows, tool verdicts and scenario columns become stacked cards rather than clipped tables, and long headline type gets art-directed mobile line breaks instead of shrinking.
- Announce settled score changes through a polite live region so the risk number is not silent to screen readers.

## 2. Refined product search

Today: one text field plus lane, brand, band, preference chips and a thin-films toggle, all applied instantly with no sense of ranking.

- Relevance-ranked results (name, then brand, then type, then note) with the matched term highlighted, plus a sort control: relevance, price low/high, lightest film.
- Filter state moves into the URL as search params so a search is shareable and survives reload, with active filters shown as removable tokens above the results.
- A type-level facet, not just lane, so "cream blush" works as a category; each result surfaces that type's job and film cost.
- Empty and near-miss handling: when nothing matches, show the closest results and name the filter that excluded them.
- "Send to the Edit" on each result, which logs that product's type into the bag and jumps to the Bag stage.

## 3. What-if and compare

Both exist; this makes them legible and actionable.

- What-if panel gets moves sorted by biggest risk drop, a plain-language reason per move, and a one-tap "apply this move" that writes the change into the profile.
- Compare gains a locked baseline column, a diff view that dims unchanged rows so only what moved stays bright, and per-scenario kit and bag diffs shown as add/drop/reword instead of two lists to eyeball.
- Scenario picks persist in the URL alongside the profile, so a comparison can be reopened.
- Both surfaces feed the full packet unchanged.

## Technical notes

- Files: `src/routes/edit.tsx` (stage tabs, drawer, what-if, compare), `src/routes/products.tsx` (search, facets, sort, URL state), `src/components/mi/viz.tsx` (touch sizes, focus, live region, diff cell), `src/components/mi/chrome.tsx` (mobile nav, `<main>`), `src/styles.css` (focus ring, tap-target utility).
- Search params validated with `zodValidator` + `fallback`; no bounds or closed enums inside the validator.
- Scoring and scenario logic in `src/lib/mi/engine.ts` stays as-is — diffing is presentation over existing `ScenarioResult` fields, and "apply this move" reuses the profile change the what-if simulation already describes.
- Verification: rendered checks at 390px, 768px and 1440px in both Porcelain and Noir, a keyboard-only pass through stage tabs and search, and a re-read of the exported full packet.