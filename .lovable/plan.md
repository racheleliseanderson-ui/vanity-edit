# Fifth Avenue: run console, global coverage, decision packet

One pass across the whole instrument. Nothing is thrown away — the engine, catalog, product index, scenario sets and exports all stay and get extended.

## 1. Aesthetic: maximalist Fifth Avenue

A deliberate escalation of the current Noir Vanity / Porcelain direction, applied to every route.

- Type hierarchy becomes the structure: oversized editorial display headings set in deliberate line breaks, small-caps letterspaced eyebrows, tabular figures for every score, and a monospaced register reserved for engine output (ledgers, deltas, timings). Four distinct sizes minimum per page, never five sections of equal weight.
- Composition: full-bleed opening plates, asymmetric splits, overlapping type on image, marquee-scale numerals for risk and skin-like, vitrine-style framed panels for the desk, deep colour fields (oxblood, ink, champagne foil) rather than pale canvas with rules.
- Immersion: parallax on the opening plate, a foil-sheen sweep on primary actions, meters that animate to value, stage transitions that slide with direction — all suppressed under `calm-motion` / `prefers-reduced-motion`.
- Tone stays dry and precise: "this pathway scores 71 because upkeep tolerance is low and the base lane wants two films" — never "glow up your routine". Existing education-only limitations remain verbatim.
- All new colour, gradient, shadow, and motion values are tokens in `src/styles.css`, and each of the four themes (noir, porcelain, black, white) plus colour-blind-safe is checked for contrast.

## 2. Pipeline run management

A new run console shared by the Edit instrument.

- **Named runs with history**: a run captures the whole profile, selected path, scenario selection and stage position. Save, name, list, reload, duplicate, delete, and diff any two runs side by side. Persisted locally, no account.
- **Execution controls**: explicit Run and Re-run, a Hold live-update toggle (freeze scoring while you adjust several fields, then run once), Reset to path defaults, and Revert to last saved run.
- **Pipeline status strip**: each engine stage — architecture, type scoring, pathways, tools, bag, kit, matching — shown with state (idle / running / done / stale) and its own timing, so a stale panel is visible rather than silently wrong.
- **Stage stepper**: Match through Packet with per-stage complete / locked state, keyboard and swipe navigation retained, and a clear "inputs changed since this stage ran" marker.

## 3. Layout, accessibility and flow

- Every route audited for a single `<main>`, one H1, labelled controls, 44px minimum touch targets, visible focus rings, and `aria-live` on score changes.
- Header rows use the grid + `min-w-0` + `shrink-0` pattern so the maximalist type never clips on mobile.
- Run console and stage stepper are reachable by keyboard alone; the mobile drawer keeps focus trapped and returns focus on close.
- Flow check: the instrument must be usable start-to-finish from a preset in under a minute, with every field still open to revision.

## 4. Global coverage

- **Brands and products**: the desk and product index expand to K-beauty, J-beauty, Indian, West African / Nigerian, Brazilian, Middle Eastern, East and Southern European, Australian and Latin American houses, each with region, availability note and price in local context. Search gains a region facet.
- **Skin representation**: the profile model extends beyond cool/neutral/warm to include olive, golden-olive, deep-neutral and red-leaning undertones, with the depth scale widened and described honestly across the full range. Shade-family guidance, film weight and finish advice adapt to undertone and depth together. Matching stays education only — no claims about who a formula is "for".
- **Languages**: EN, FR, ES plus DE, IT, PT-BR, JA, KO, ZH and AR, with AR driving `dir="rtl"` and mirrored layout. Any untranslated key falls back to English rather than showing a blank.

## 5. The Decision Packet

The Full Edit Packet is reworked into a Decision Packet. The Compare Packet stays as it is.

Order: the call, stated plainly; the profile it was made from; why it scored that way, with the ledger; what was rejected and the specific reason; the kit with named desk examples and film weights; the bag verdicts; what would change the call (the sensitivity table); and the standing education-only footer. Print-clean HTML download plus a Print affordance, in the same paper-and-ink treatment.

## Technical notes

- New `src/lib/mi/runs.ts` (versioned localStorage runs, SSR-guarded) and `src/components/mi/run-console.tsx`.
- `src/lib/mi/engine.ts` gains per-stage timing and a staleness signal; scoring maths is unchanged apart from the widened undertone/depth inputs.
- `src/lib/mi/types.ts`, `catalog.ts`, `products.ts`, `match.ts` extended for undertone set, depth range and region.
- `src/lib/mi/full-packet.ts` becomes the Decision Packet builder; `compare-packet.ts` untouched.
- `src/lib/mi/i18n.tsx` gains the new dictionaries, an RTL flag, and English fallback.
- `src/routes/edit.tsx` is large — the run console, stage stepper and status strip land as separate components rather than growing that file further.
- No backend, no new dependencies. Fonts loaded via `<link>` in `__root.tsx`.
