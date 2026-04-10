@AGENTS.md

# Gentle Works — Claude Context

This is the rebuild of [gentle.works](https://www.gentle.works) — an architecture & design studio portfolio site. This file is the first thing to read when resuming work. Keep it current.

## Quick Links

- **Brief & open decisions** → [CONTEXT.md](./CONTEXT.md)
- **Stack, rendering strategy, project structure** → [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Design tokens, component specs, anti-patterns** → [design-system/gentle-works/MASTER.md](./design-system/gentle-works/MASTER.md)
- **Page-specific design overrides** → [design-system/gentle-works/pages/](./design-system/gentle-works/pages/) (empty until designs arrive)

## Stack (locked in)

- **Next.js 16 App Router** (Turbopack), **TypeScript**, **Tailwind v4**
- **Sanity** CMS — not yet wired up, still to-do
- **Motion** + **Lenis** for animation and smooth scroll
- **Lucide** for icons (thin stroke, editorial feel)
- **shadcn/ui** primitives — planned, **not yet initialized** (see TODO)
- **Vercel** hosting with ISR via Cache Components (`'use cache'` + `updateTag`)

## Key Rules

1. **Next.js 16 has breaking changes** vs the version in most training data:
   - `params` and `searchParams` are `Promise`s — must `await`
   - `middleware.ts` is now `proxy.ts`
   - `unstable_cache` is replaced by the `'use cache'` directive
   - `cacheComponents: true` is already enabled in `next.config.ts`
   - Cannot use `cookies()` / `headers()` / `searchParams` inside `'use cache'` — pass values in as arguments
   - When in doubt, read `node_modules/next/dist/docs/` or check the Vercel plugin skills
2. **Design tokens are the source of truth.** Brand colors, type scale, spacing, motion all live in `design-system/gentle-works/MASTER.md` and are exposed to Tailwind via `@theme inline` in `app/globals.css`. Edit MASTER.md first, then sync CSS.
3. **Honor `prefers-reduced-motion`** — Lenis and Motion both disable gracefully, and there's a global CSS override in `globals.css`.
4. **No emojis as icons** — Lucide only. No heavy shadows. No vivid colors beyond sage. See MASTER.md anti-patterns.
5. **Projects filtering is client-side** from pre-rendered data with URL-synced query params (`?tag=hospitality`). Never server-side filter — it breaks SSG.

## TODO (load-bearing reminders)

These are things we intentionally deferred. Do them when the trigger conditions hit:

- [ ] **When client designs arrive:** Update `design-system/gentle-works/MASTER.md` *first* (colors, fonts, spacing, motion). Then sync `app/globals.css`. Then verify existing pages. Don't write new components until MASTER.md reflects reality.
- [ ] **Before building any shadcn/ui components:** Run `npx shadcn@latest init` to set up `components.json`, then install primitives via `npx shadcn@latest add [component]`. Use `--base-color neutral` and reference brand tokens in the config. Don't do this until we actually need a primitive — the init asks about theme/colors and should be informed by the final design.
- [ ] **Sanity setup (next session):** Install `sanity` + `next-sanity`, run `npx sanity@latest init --env` to create project, define project schema (title, slug, description, images, tags, year, location, metadata), embed Studio at `/studio`, add env vars (`SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_READ_TOKEN`), wire `'use cache'` fetch with `cacheTag('projects')`, and build the webhook at `app/api/revalidate/route.ts` that calls `updateTag` on publish.
- [ ] **When we have first real project data:** Build out the split-screen projects page — sticky left image column, right column with filter chips and entries, URL-synced filter state via `useSearchParams`.
- [ ] **Before launch:** Configure Vercel Analytics, Sanity webhook URL, OG image generation, `sitemap.ts`, `robots.ts`, JSON-LD, performance audit against the budget in ARCHITECTURE.md.

## Commands

```bash
npm run dev         # Dev server (Turbopack)
npm run build       # Production build — verify after significant changes
npm run lint
```

## Gotchas

- **Cache Components is enabled** but no `'use cache'` directives exist yet. Both current pages are fully static (no async, no runtime APIs) so they prerender cleanly. When you add CMS fetches, either wrap them in `'use cache'` with `cacheTag` or wrap dynamic parts in `<Suspense>`.
- **Instrument Serif is weight 400 only** — do not bold it. It's a display-regular face.
- **The public/ dir was cleaned** — only add project assets intentionally, nothing left from create-next-app.
- **`.bootstrap-backup` was a temp dir** used during scaffolding, already removed.

## Design System Current State

The MASTER.md values are **placeholders inferred from the existing gentle.works site** (sage green, cream, near-black, editorial serif). They are deliberately chosen to be close enough that swapping to client-delivered values is a surgical edit, but assume every value may change.
