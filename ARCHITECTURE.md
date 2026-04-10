# Architecture & Tech Decisions

Decisions and rationale for the Gentle Works rebuild. Keep this file in sync with reality as the project evolves.

## Stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 16 (App Router)** | Best SSG + ISR story, metadata API for SEO, Vercel-native, server components reduce client JS |
| Language | **TypeScript** | Type safety across CMS queries and components |
| Styling | **Tailwind v4** + CSS variables | Fast iteration, design tokens map to `design-system/gentle-works/MASTER.md` |
| Components | **shadcn/ui** | Unstyled, accessible primitives we fully own and restyle to brand |
| CMS | **Sanity** | Editor-friendly Studio UI, image CDN w/ transforms, generous free tier, structured content with TS codegen |
| Animation | **Motion** (ex-Framer Motion) + **Lenis** | Best React scroll APIs; Lenis gives buttery smooth scroll feel; both honor `prefers-reduced-motion` |
| Icons | **Lucide** | Thin-stroke, editorial-feeling icon set consistent with brand |
| Hosting | **Vercel** | Zero-config ISR, preview deployments, edge network, native Next.js support |
| Analytics | TBD — likely **Vercel Analytics** | Lightweight, privacy-friendly, no cookie banner needed |

## Rendering Strategy — SSG with ISR

The entire public site is **statically generated at build time** with **Incremental Static Regeneration** for CMS-driven pages. Implementation uses Next.js 16 **Cache Components** (`'use cache'` directive + `cacheTag` / `updateTag`).

### How It Works

1. On build (or first request after deploy), Next.js fetches all projects from Sanity and pre-renders HTML for every page
2. Visitors always get cached static HTML — instant LCP, zero cold start, SEO-perfect
3. When an editor hits "Publish" in Sanity Studio, a webhook calls a Next.js route that invokes `updateTag('projects')`
4. Next.js regenerates affected pages in the background; next request gets the fresh version
5. **No redeploy needed** for content updates

### Why Not SSR?

Adds per-request latency and server cost for zero benefit — content changes at editorial cadence, not per-request.

### Why Not CSR?

Bad SEO (important for a portfolio), bad LCP (fights performance goal), requires loading spinner for content.

## Key Page Patterns

### `/projects` — Split-Screen Filter Page

- All projects + all tags fetched at build time, embedded in the page
- **Filtering is client-side** from the pre-rendered data → instant, no network round trip
- Filter state synced to URL (`?tag=hospitality&tag=residential`) so filters are:
  - Shareable
  - SEO-indexable (each filter combination is a stable URL)
  - Restorable on back-navigation
- Left column: sticky project image that updates on scroll/click
- Right column: filter chips at top, then scroll list of projects

### `/projects/[slug]` — Individual Project

- One per project, statically generated, regenerated on publish via `cacheTag`
- Includes full image gallery, rich description, tags, metadata

## Project Structure

```
gentleworks/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout — fonts, metadata, Lenis wrapper
│   ├── page.tsx             # Home
│   ├── projects/
│   │   ├── page.tsx         # Split-screen filterable list
│   │   └── [slug]/page.tsx  # Individual project
│   └── api/revalidate/route.ts  # Sanity webhook receiver
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   ├── motion/              # Reusable motion components (FadeUp, Stagger, SmoothScroll)
│   └── projects/            # Project-specific (SplitScreen, FilterChips, ProjectCard)
├── lib/
│   ├── sanity/              # Client, queries, types (once CMS is confirmed)
│   └── utils.ts
├── design-system/
│   └── gentle-works/
│       ├── MASTER.md        # Design tokens, component specs, anti-patterns
│       └── pages/           # Page-specific overrides (when designs arrive)
├── public/
├── CONTEXT.md               # Project brief
├── ARCHITECTURE.md          # This file
└── ...                      # Next.js config, package.json, etc.
```

## SEO Approach

- **Next.js Metadata API** for per-page title/description/OG tags
- **Dynamic OG image generation** via `@vercel/og` for each project (title + hero image + sage ground)
- **Sitemap:** auto-generated from Sanity data, served from `app/sitemap.ts`
- **robots.txt** via `app/robots.ts`
- **Structured data:** JSON-LD for `CreativeWork` on each project page, `Organization` on home
- **Semantic HTML** throughout (h1 hierarchy, landmarks, descriptive alt text)

## Performance Budget

| Metric | Target |
|---|---|
| LCP | < 2.0s |
| CLS | < 0.05 |
| INP | < 200ms |
| JS bundle (initial) | < 150kb gzipped |
| Image format | AVIF/WebP via `next/image` + Sanity CDN |

Animations limited to transform/opacity only. Lenis and Motion both off under `prefers-reduced-motion`.

## Accessibility

- WCAG 2.1 AA minimum (AAA on text contrast where possible)
- All filter chips are real `<button>` elements with `aria-pressed`
- Keyboard: Tab order matches visual order, focus rings visible, skip-to-content link
- Images: descriptive alt text entered by editors in Sanity (required field)
- Reduced motion honored across Lenis, Motion, and CSS transitions

## Deployment & CI

- **Vercel** linked to GitHub repo
- Main branch → production
- All PRs → preview deployments
- Sanity webhook → `/api/revalidate` → tag-based ISR invalidation
- Environment variables managed via `vercel env` CLI
