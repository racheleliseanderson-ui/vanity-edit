# Makeup Intelligence deploy config (vanity-edit)

**CONFIG_VERSION:** `nitro-fluid-v1.1` (carried forward from makeup-intelligence v1)

**Canonical production:** https://vanity-makeup.vercel.app  
**Vercel project:** `vanity-makeup`  
**GitHub:** `racheleliseanderson-ui/vanity-edit`

## Layers

| Layer | Notes |
| --- | --- |
| Build | Vite 8 + TanStack Start; `package.json` scripts |
| Platform | Vercel + Nitro Fluid when configured |
| App intelligence | `src/lib/mi/*` |
| Suite handoff | `src/lib/mi/suite-packet.ts` → VoV Desk |

## Rules

- Prefer Nitro / Vercel Fluid for production parity with the rest of the intelligence fleet
- Do not treat product-type examples as safety rankings or toxin scores
- Suite packets are explicit handoffs only — never silent overwrite on the Desk

## Environment (when applicable)

| Variable | Typical value |
|----------|----------------|
| Site origin for OG / canonical | `https://vanity-makeup.vercel.app` |

## Changelog

### 2026-08-10 — vanity-edit becomes canonical

- Supersedes `makeup-intelligence` repo and `makeup-intelligence.vercel.app`
- Suite packet contract retained for Desk import compatibility
