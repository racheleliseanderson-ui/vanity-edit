# Touch, accessibility, languages and a deeper edit surface

One pass over the existing instrument. No rewrite, no backend, no new routes except a single settings surface inside the header.

## 1. Touch-friendly interactions

- Every chip, preset, toggle, expander, slider thumb and stage tab reaches a 44px minimum target, with the fine letter-spaced type preserved through padding rather than shrinking.
- Sliders gain large invisible touch rails, drag-anywhere-on-track behaviour, and step buttons either side so a value can be nudged without precision dragging.
- Swipe between stages of the edit (Match → Alternatives → Tools → Bag → Kit → Compare → Packet), with the tablist staying authoritative for keyboard and screen readers.
- The mobile inputs drawer becomes a proper sheet: drag handle, swipe-to-dismiss, body scroll lock while open, focus returned to the trigger on close.
- Compare and kit carousels get momentum scroll with snap points, visible edge fade, and dot indicators showing position.
- Press states on touch (no hover-only affordances), and `prefers-reduced-motion` respected throughout.

## 2. Accessibility: Black, White, colour-blind

Two extra themes join Noir and Porcelain in a theme picker:

- **Black** — true-black ground, high-contrast champagne/white ink, all text at AAA where type size allows.
- **White** — pure white ground, near-black ink, structural rules strengthened so the layout still reads without colour.

Plus a separate colour-blind-safe toggle, layered over whichever theme is active: risk dials, spectra, ledger bars, diff cells and kit add/drop markers are recoloured for deuteran/protan/tritan safety and additionally encode meaning with shape, weight, pattern and text — never colour alone. Both settings persist locally and are read after hydration.

## 3. Language switcher — UI only

English, French, Spanish. Navigation, stage names, field labels, buttons, chip labels, table headers, verdict words and section headings translate. Long editorial essays, brand notes and engine-generated reasoning stay in English, and the switcher says so plainly rather than pretending otherwise. Choice persists locally; `lang` on the document updates so assistive tech switches voice.

## 4. Mobile compatibility

- Results, not inputs, are what you land on at every width.
- Wide grids — kit rows, tool verdicts, bag calls, scenario columns, product results — recompose as stacked cards instead of clipped tables.
- Long display headlines get art-directed mobile line breaks rather than shrinking to nothing.
- Packet and Compare Packet actions stay reachable in a sticky action bar at small widths.
- Verified rendered at 390px, 768px and 1440px in all four themes.

## 5. Refined search

- Faceted counts on every filter so you can see what a filter would cost before applying it.
- Multi-select brand and lane, term highlighting in results, and a "closest matches" fallback that names the filter which excluded them.
- Recent searches remembered locally; a clear-all that leaves the URL tidy.
- Price and film-weight range controls rather than only bands.
- Every result carries its type's job, film cost, and an add-to-bag action.

## 6. Scenario Set Manager

The saved sets get a real management surface, not just chips: rename, duplicate, reorder, delete with undo, a last-used timestamp, export a set as a Compare Packet, and copy a shareable link. Import a set from a pasted link so sets move between devices without an account.

## 7. Smart Paths

Presets become a first-class gallery: each path shows its intended feeling, the trade it makes, projected pancake risk, film count and minutes *before* you commit, and a preview of the kit it would build. Applying a path is reversible in one tap, and any field stays fully revisable afterwards. Two additional paths for the new lanes.

## 8. Makeup matched

- Every kit slot resolves to specific named products from the product index, ranked by fit to the profile, each with a one-line why-this-one and its film cost.
- New undertone and depth inputs (cool/neutral/warm, and a depth scale) feed shade-family suggestions per matched product — stated as families and directions, never as a promise of an exact shade match.
- Matches flow into the Full Packet and Compare Packet.

## 9. Expanded alternatives

More pathways, each with an explicit "what this trades away", side-by-side pathway comparison on fit, films, minutes and upkeep, and a per-pathway route into the kit builder.

## 10. Add to Bag from anywhere

A consistent add-to-bag action on product results, matched kit items, alternative pathways and desk entries — each writing the type into the profile bag, showing a brief confirmation, and re-scoring the bag edit live.

## Technical notes

- New: `src/lib/mi/i18n.tsx` (typed dictionary + provider, three locales, UI strings only), `src/lib/mi/a11y.tsx` (contrast theme + colour-blind-safe + reduce-motion state), `src/components/mi/settings.tsx` (header settings popover), `src/components/mi/touch.tsx` (swipe/sheet/carousel primitives), `src/lib/mi/match.ts` (kit slot → named product matching, shade families), `src/components/mi/scenario-manager.tsx`.
- Extended: `src/styles.css` gains `.hc-black`, `.hc-white` and `.cb-safe` token blocks under `@theme inline` — no hardcoded colour utilities in components; `src/lib/mi/theme.tsx` widens to four themes; `src/lib/mi/catalog.ts` gains undertone/depth fields and two paths; `src/lib/mi/products.ts` gains facet counts and shade families; `src/lib/mi/scenario-sets.ts` gains rename/duplicate/reorder/import.
- Search state stays in URL search params via `zodValidator` + `fallback`, no bounds or closed enums in the validator.
- Engine scoring stays as-is except the new undertone/depth inputs and the added pathways; diffing and matching are presentation over existing results.
- No backend, no accounts, no analytics. Everything persists in `localStorage`, guarded for SSR.
- Verification: rendered passes at three widths across four themes with the colour-blind filter on and off, a keyboard-only run through stage tabs, settings, search and the scenario manager, and a re-read of both exported packets.
