# Suite packet contract (Makeup → VoV Desk)

Transferred from `makeup-intelligence` v1 so handoff behavior survives repository retirement.

## Schema

- `schema`: `"vov-suite-packet-v1"`
- `source`: `"makeup-intelligence"` (stable key for Desk importers — do not change lightly)
- `kind`: `"makeup-edit"`
- `target`: `"cabinet" | "routine"`

## Desk side

- Staging key: `vov_suite_import_v1` (localStorage)
- Desk origin: `https://vov-desk-jn9y.vercel.app`
- Import paths: `/cabinet?import=suite` or `/routine?import=suite`

## Rules

1. Explicit handoff only — download / stage / clipboard; Desk user chooses import.
2. Fail closed on unknown schema.
3. Education boundaries always included on the packet.
4. Implementation lives in `src/lib/mi/suite-packet.ts`.
