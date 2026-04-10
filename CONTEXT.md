# Gentle Works — Project Context

Rebuild of [gentle.works](https://www.gentle.works/projects) for the Gentle Works team — an architecture & design studio. This document captures the brief, constraints, and decisions made to date. Update as requirements evolve.

## The Brief

Rebuild the public site with a focus on the **Projects** section. The current site is a creative studio portfolio with sage-green editorial aesthetics. The new site should preserve that brand feel while solving a key pain point: **the team cannot add new project entries without engineering involvement**.

### Requirements

- **Framework:** React — Next.js preferred
- **Content editing:** Non-engineers must be able to add/edit projects (images, description, tags) independently
- **Projects data model:**
  - Multiple images per project
  - Description (rich text)
  - Tags (many-to-many, used for filtering)
- **Tag filtering:** Visitors can select one or more tag chips to filter the project list
- **Layout:** Split-screen Projects page
  - Left: large sticky project image
  - Right: scrollable description + filter chips
- **SEO:** Strong — this is a portfolio that needs to rank for project names and agency keywords
- **Performance:** High — scroll-driven animations throughout, so budget matters
- **Rendering:** Client wants SSG (static generation) rather than SSR or CSR — minimize server cost and maximize performance

## Design Reference

Client has **not yet delivered final designs**. Current direction is derived from the existing gentle.works site identity:
- Sage green (~`#4F6B4A`) brand accent
- Cream (`#F5F1EA`) background
- Near-black ink for text
- Editorial serif for display (placeholder: Instrument Serif)
- Clean sans for body (Inter)
- Oversized display type, generous whitespace, large imagery
- Grid-based asymmetric layouts

Design system placeholder lives in `design-system/gentle-works/MASTER.md`. **This will be updated when final designs arrive.**

## Decisions Locked

- [x] **CMS:** Sanity — free tier, editor-friendly Studio, built-in image CDN with transforms, structured content with TS codegen
- [x] **Framework:** Next.js 16 App Router
- [x] **Rendering:** SSG + ISR via Cache Components (`'use cache'` + `cacheTag` / `updateTag`)
- [x] **Hosting:** Vercel

## Still Open

- [ ] Final brand colors, typography, and visual direction from client design delivery → update `design-system/gentle-works/MASTER.md` first when they arrive
- [ ] Domain and hosting account ownership (Vercel account under client)
- [ ] Analytics platform (leaning Vercel Analytics)
- [ ] Sanity org/project ownership — who owns the Sanity project? Client or contractor initially with transfer later?

## Current Status

Foundation phase complete — Next.js 16 scaffolded, design tokens wired, brand placeholder home and projects stub live. Next step: stand up Sanity Studio with project schema and wire the webhook revalidation flow.
