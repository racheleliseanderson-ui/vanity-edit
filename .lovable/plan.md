# Selective handoff document for Makeup Intelligence

Produce one written handoff artifact — no source changes to this prototype and no repository merge. The document lets you port only accepted behavior into the canonical repository by hand, and states how each accepted piece becomes WordPress.

Frozen reference: commit `a799f9c`, published at vanity-vice-edit.lovable.app.

## What the document contains

1. **Freeze record** — project ID, frozen commit, published URL, the approved visual direction (Noir Vanity), and the fact that this prototype is non-canonical.

2. **File-by-file inventory**, each item classified RETAIN / REWRITE / REJECT / VERIFY:
   - `src/lib/mi/types.ts`, `catalog.ts`, `engine.ts` — the intelligence layer (profile model, pancake-risk architecture scoring, type scoring, pathways, tool necessity, bag edit, ceiling-bound kit builder, adaptive coaching). This is the substantive value; framework-independent TypeScript.
   - `src/styles.css` — palette tokens (oxblood, champagne, porcelain, blush, ink, rouge), typography pairing, motion.
   - `src/components/mi/viz.tsx` — RiskDial, Spectrum, Meter, Chip, Slider.
   - `src/components/mi/chrome.tsx`, `src/routes/*` — composition and art direction; port as reference, not as code.
   - `src/assets/*.jpg` — four generated images; flagged VERIFY for rights/appropriateness before any reuse.
   - Everything else (TanStack runtime, `src/components/ui/*` shadcn set, router/server entry files, lockfile, package.json, generated route tree) — REJECT for canonical merge.

3. **WordPress port map** — for each RETAIN item, the destination form: engine as a standalone TS/JS module or block script, tokens as theme CSS custom properties, viz components as block-level markup/SVG, routes as page templates or block patterns, packet export as print stylesheet.

4. **Dependency and limits record** — the engine's runtime dependencies (none beyond TypeScript), what the React components do depend on, plus known limits: all scoring is deterministic client-side logic with no persistence, no accounts, no analytics; desk examples are illustrative and explicitly not safety rankings.

5. **Verification and rollback notes** — production build result, browser checks performed across presets, absent items (no automated tests, no accessibility audit beyond visual contrast review), and the statement that rollback is simply "do not port."

## Output location

Written to `docs/handoff/makeup-intelligence-a799f9c.md` inside this prototype, so it travels with the frozen commit and can be copied out. No other file is touched.

## Explicitly out of scope

No GitHub connection, no branch, no pull request, no push to `racheleliseanderson-ui/makeup-intelligence`, no WordPress action, no publish, no credentials.
