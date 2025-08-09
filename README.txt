Resources Feature — Vite + React + React Router v6 (SEO-ready)

What you get
- Dedicated /resources page with SEO (document title + meta description)
- Flyout teaser under the landing hero (ResourcesTeaser + HeroFooter)
- Live fetch from Supabase tables: resources_sections, resources_articles, resources_faqs
- Router wiring example with React Router v6
- No placeholders; renders only your real Supabase content

Install (Vercel)
1) Add these files to your repo with the same paths:
   - src/components/resources/ResourcesTeaser.tsx
   - src/components/resources/HeroFooter.tsx
   - src/pages/Resources.tsx
   - src/routes/AppRoutes.tsx (optional helper if you want pre-wired routes)
2) Ensure env vars exist in Vercel (Settings → Environment Variables):
   - VITE_SUPABASE_URL=https://ujjvujnsdwicsmkoazhq.supabase.co
   - VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
   Redeploy afterward.
3) Show the flyout under your hero:
   import HeroFooter from "@/components/resources/HeroFooter";
   // ...below your hero JSX:
   <HeroFooter />
5) Wire the route (choose one):
   A) Use the provided src/routes/AppRoutes.tsx and render <AppRoutes /> in src/main.tsx
      - Replace your existing RouterProvider call (if any) with <AppRoutes />
   B) Or manually add a Route in your current routes:
      <Route path="/resources" element={<ResourcesPage />} />

Test
- Landing page: hover the 📚 Resources chip → see your section titles & summaries.
- Visit /resources → the page renders your articles and FAQs with Markdown.
- Change something in Supabase and refresh → updates immediately.

Troubleshooting
- 401/403 in console → check Vercel env names/values and redeploy.
- Blank content → confirm rows exist and section_slug matches section slugs.
- Markdown not formatted → verify your content is plain text or add a markdown parser.
