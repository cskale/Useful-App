# Multi-Module Runs – Scaffold
This folder now includes:
- `supabase/migrations/20250811_multi_module_runs.sql` – DB schema for runs/sessions/overall.
- `src/types/assessmentRun.ts` – Run types.
- `src/lib/rules/overall.ts` – Weighted overall scoring.
- `src/hooks/useRun.ts` – Minimal client hook to create runs (Supabase-first, local fallback).
- `src/pages/Start.tsx` – Module picker enabling Single/Multi/All.
- `src/pages/RunResult.tsx` – Overall results scaffold.

Apply the route patch in `PATCH_App_tsx.diff`, then:
1) Add a real module ID resolver (query Supabase `modules`).
2) Wire `Assessment.tsx` to respect `?module` and `?run` params, save per-module scores, and push into `run_module_scores` or Supabase.
3) Implement server functions/endpoints if you expose a backend, or use Supabase RPC.

Commands:
- supabase db push
- pnpm dev
