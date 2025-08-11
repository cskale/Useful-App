# Useful App

A clean, professional starter built with **Vite + React + TypeScript + Tailwind + shadcn/ui**.

## Quick start
1. Clone the repo
2. Copy `.env.example` to `.env` and fill values
3. Install & run:
   ```bash
   npm ci
   npm run dev
   ```

## Environment variables
Create a `.env` file at the repo root:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Never commit real keys to the repository. Keep `.env` private.

## Scripts
- `npm run dev` – start the dev server
- `npm run build` – production build
- `npm run lint` – lint files
- `npm run preview` – preview the production build

## Notes
- Supabase URL and anon key are now loaded from environment variables.
- Template identifiers have been removed.
- `get_historical_scores` RPC accepts an optional `module_slug` argument to fetch module-specific trends; omit or set to `null` to include all modules.
