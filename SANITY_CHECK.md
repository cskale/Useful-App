# Sanity Checklist (No Lovable Traces)

Run through this quickly after deploy:
- [ ] Vercel builds from branch **main** and latest commit hash matches GitHub.
- [ ] `vite.config.ts` contains **no** imports from `lovable-tagger`.
- [ ] `index.html` has no Lovable meta tags (author/description/og-image).
- [ ] GitHub Actions run **Branding scan** and pass.
- [ ] Repo search for `lovable` finds **0 results** (ignore `package-lock.json`).
- [ ] App loads on Vercel without build errors.
- [ ] Environment variables set in Vercel: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- [ ] (Optional) Remove `bun.lockb` from the repo (done in this bundle).
