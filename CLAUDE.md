# Malabar Signature Journeys

Static marketing/travel website (Malabarways), built on Replit and moved to GitHub + Vercel.

## Stack
- pnpm workspace; the site is `artifacts/malabarways` (Vite + React + TypeScript + Tailwind + shadcn/ui + wouter)
- Other workspace packages (`api-server`, `mockup-sandbox`, `lib/*`, `scripts`) are Replit scaffolding and are not used by the site

## Commands
- Dev: `pnpm --filter @workspace/malabarways run dev` (PORT defaults to 5173, BASE_PATH to `/`)
- Build: `pnpm --filter @workspace/malabarways run build` -> `artifacts/malabarways/dist/public`

## Deployment
- Vercel, repo root as project root; `vercel.json` sets install/build/output and the SPA rewrite
- On Windows, `pnpm-workspace.yaml` overrides exclude non-Linux native binaries (rollup, esbuild, lightningcss, tailwind oxide), so a local Windows run needs those win32 packages copied in manually

## Changelog
- Make PORT and BASE_PATH optional in vite.config.ts and add vercel.json so the site builds on Vercel without Replit env vars
