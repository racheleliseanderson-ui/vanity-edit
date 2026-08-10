# Deeper data, more dynamic instrument, light/dark toggle

Three additions to the existing Noir Vanity build. No rewrite — the engine, palette and routes stay; they get extended.

## 1. Light / dark toggle

The stylesheet currently defines only the dark "Noir" palette on `:root`, and a `.dark` variant that nothing switches. Add a real second theme rather than an inverted one:

- **Noir** (existing): ink ground, champagne and oxblood, cinematic.
- **Porcelain** (new): warm porcelain ground, oxblood as the structural ink, champagne as gilt accent, blush fields. Full art direction in the light theme too — not a washed-out copy. Image overlays, spectra, dial arcs and hairlines each get their own light-mode values so contrast stays luxurious rather than flat.

Toggle lives in the header (a small gilt sun/moon switch), persists to `localStorage`, and respects `prefers-color-scheme` on first visit. Read after hydration so there is no SSR mismatch.

## 2. More data

Grow the catalog substantially, keeping the same shape so the engine picks it up automatically:

- **Product types**: 23 → ~40. Add missing lanes — primer/grip, cream bronzer, powder bronzer, cream contour, tinted brow gel, brow pencil, brow soap, lash tint alternatives, tubing mascara, eye pencil, cream shadow stick, powder shadow, lash curler path, tinted lip oil, lip liner, satin lipstick, blot powder, setting spray, hydrating mist, under-eye patch, SPF-only path.
- **Brands**: 26 → ~45, with the same best-when / less-ideal-when honesty and family tags; add several sensitive- and pharmacy-tier houses so `lean` budget is genuinely served.
- **Presets**: 5 → 8. Add oily/humid city, mature-skin luminous, and rosacea-aware paths.
- **Tools**: expand with per-tool alternatives (fingers, damp sponge, blot only) so tool necessity can recommend "nothing extra".
- Each new entry carries the full scoring vector (layer weight, coverage, oil/dry affinity, longevity, upkeep, minutes) so nothing lands unscored.

## 3. More dynamic behavior

- **Transparent score breakdown**: expand any product type to see the exact contributions that produced its number (goal match, skin fit, climate, upkeep cost, layer penalty) as signed bars.
- **What-if sensitivity**: for the current profile, show which single input would move pancake risk the most, with a one-tap "try it" that previews the new risk before committing.
- **Live delta feedback**: when a slider or chip changes, risk, skin-like score and kit size animate to their new values and briefly flag the direction of travel.
- **Pathway comparison**: pick two pathways and see them side by side on fit, layers, minutes, upkeep and what each trades away.
- **Kit tension meter**: shows how much of the complexity ceiling is spent and refuses to fill remaining slots, stating why the kit stopped short.
- **Coaching that cites the numbers** it is reacting to, rather than generic prose.
- **Stage transitions** across Match → Alternatives → Tools → Bag → Kit → Packet get proper motion, and the packet gains a light-theme print sheet so exports stay legible on paper.

## 4. Handoff document (carried over)

Still produce `docs/handoff/makeup-intelligence-<commit>.md`: freeze record, file-by-file RETAIN / REWRITE / REJECT / VERIFY inventory, WordPress port map for each retained item, dependency and limits record, verification and rollback notes. Nothing is pushed to GitHub and nothing merges into the canonical repository.

## Technical notes

- All new colour work goes through tokens in `src/styles.css` (`@theme inline` plus `:root` and `.dark` blocks) — no hardcoded colour utilities in components.
- Catalog growth is data-only in `src/lib/mi/catalog.ts`; scoring weights in `src/lib/mi/engine.ts` gain the new lanes and the per-contribution breakdown the UI reveals.
- Sensitivity analysis runs the existing engine over candidate profile mutations client-side — no backend, no persistence, no accounts.
- Desk examples stay explicitly illustrative, never safety rankings.
