# Migration: makeup-intelligence → vanity-edit

**Effective:** 2026-08-10

## Canonical locations

| | New (use this) | Old (retired) |
|--|--|--|
| **GitHub** | `racheleliseanderson-ui/vanity-edit` | `racheleliseanderson-ui/makeup-intelligence` |
| **Production** | https://vanity-makeup.vercel.app | https://makeup-intelligence.vercel.app |
| **Vercel project** | `vanity-makeup` | `makeup-intelligence` |

## What transferred

The new app is an **elevated rewrite**, not a file-for-file copy. Product intent, catalog families, anti-pancake philosophy, and suite handoff contract were carried forward.

| Asset | Status |
|--|--|
| Product types / goals / presets / brand desk | Rewritten in `src/lib/mi/catalog.ts` |
| Scoring engine | Rewritten in `src/lib/mi/engine.ts` |
| Type contract | Rewritten in `src/lib/mi/types.ts` |
| Suite packet handoff → VoV Desk | Ported to `src/lib/mi/suite-packet.ts` (same schema `vov-suite-packet-v1`, same `source: "makeup-intelligence"` for Desk import compatibility) |
| Deploy / Nitro Fluid notes | Captured in `CONFIG.md` |
| Suite packet schema documentation | `docs/suite-packet-contract.md` |
| Fleet a11y / auth / Grok PWA scaffold from v1 | Not required in elevated UI; left in archived v1 repo for reference |
| `AGENTS.md` (Grok sandbox builder template) | Platform template, not product knowledge — not copied |

## Cross-links already updated

- `spa-intelligence` education footer → new URL
- `vov-desk` and `vov-desk-0806` CrossLinks → new URL
- `vanityvice.blog/makeup-intelligence/` CTAs → new URL

## Suite packet compatibility

Personal Desk importers still expect:

```ts
source: "makeup-intelligence"
kind: "makeup-edit"
schema: "vov-suite-packet-v1"
```

Keep that source string until Desk and Makeup are versioned together. Renaming is optional and not required for retirement of the old **repository**.

## Old repo disposition

1. README on `makeup-intelligence` carries a retirement banner.
2. Archive the GitHub repo (Settings → Danger Zone → Archive) so history remains readable but inactive.
3. Optionally add a Vercel redirect from the old domain to `https://vanity-makeup.vercel.app`, then remove the old Vercel project when traffic is gone.
