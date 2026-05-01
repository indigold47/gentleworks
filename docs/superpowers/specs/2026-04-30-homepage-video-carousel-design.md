# Homepage Video/Image Carousel — Design Spec

**Date:** 2026-04-30
**Status:** Approved

## Overview

Replace the static background image on the homepage hero with a CMS-managed carousel of full-screen videos and/or images. Videos play once then auto-advance; images display for 5 seconds then auto-advance. Users can navigate forward/backward by clicking the right or left half of the screen. The cursor changes to a directional arrow depending on which half is hovered.

---

## 1. Sanity Schema

### New singleton: `homePage`

File: `sanity/schemaTypes/homePage.ts`

Fields:
- `heroMedia` — array of polymorphic items, ordered by the editor

Array member types:

**`homeHeroVideo`** (inline object type within the array):
- `videoUrl: string` — externally hosted MP4/WebM URL (matches existing `SanityVideo` pattern)
- `alt: string` — required, for accessibility

**`homeHeroImage`** (inline object type within the array):
- `image` — Sanity image asset with hotspot enabled
- `alt: string` — required, for accessibility

Register `homePage` in `sanity/schemaTypes/index.ts`.
Add as a singleton to `sanity/lib/deskStructure.ts`.

---

## 2. Data & Fetch Layer

### Types (in `sanity/lib/fetch.ts`)

```ts
export type HomeHeroVideo = {
  _type: "homeHeroVideo";
  _key: string;
  videoUrl: string;
  alt: string;
};

export type HomeHeroImage = {
  _type: "homeHeroImage";
  _key: string;
  image: SanityImage;
  alt: string;
};

export type HomeMediaItem = HomeHeroVideo | HomeHeroImage;

export type HomePageData = {
  heroMedia: HomeMediaItem[] | null;
};
```

### Query (in `sanity/lib/queries.ts`)

GROQ fetches `heroMedia[]` with `_type`, `_key`, `videoUrl`, `alt`, and the full image projection for image items.

### Fetch function

```ts
export const HOME_TAG = "home";

export async function getHomePage(): Promise<HomePageData | null>
```

Uses existing `sanityFetch` wrapper with `cacheLife("hours")` and `cacheTag(HOME_TAG)`.

---

## 3. `HomeVideoCarousel` Component

File: `components/home-video-carousel.tsx`
Directive: `'use client'`

### Props

```ts
type HomeVideoCarouselProps = {
  items: HomeMediaItem[];
};
```

### State

- `currentIndex: number` — which item is active
- `transitioning: boolean` — blocks input during the 400ms crossfade

### Auto-advance logic

- **Video items:** `<video>` element with `onEnded` callback → `advance(1)`
- **Image items:** `useEffect` with `setTimeout(5000)` → `advance(1)`. Timer is cleared on index change and unmount.

### Navigation

- `advance(delta: 1 | -1)`: sets `transitioning = true`, updates index (wraps), sets `transitioning = false` after 400ms
- **Click handler** on the root element: reads `e.clientX / window.innerWidth`. Right half (≥ 0.5) → `advance(1)`, left half (< 0.5) → `advance(-1)`. No-ops if `transitioning`.

### Custom cursor

- `onMouseMove` tracks `cursorSide: "left" | "right"` state via `e.clientX / window.innerWidth`
- A positioned `<div>` overlay (pointer-events-none, fixed, follows mouse via `transform: translate`) renders a `←` or `→` SVG/Lucide icon. Using a positioned overlay avoids cross-browser custom cursor sizing issues.
- Hidden on touch devices (`hidden md:block`)

### Crossfade

- Uses `AnimatePresence` from `motion/react` (already in project)
- Each item rendered as `<motion.div key={currentIndex}>` with `initial={{ opacity: 0 }}`, `animate={{ opacity: 1 }}`, `exit={{ opacity: 0 }}`, `transition={{ duration: 0.4 }}`
- Both entering and exiting layers are `position: absolute inset-0`, so they stack and blend cleanly

### Video element attributes

`autoPlay muted playsInline` — required for autoplay in all browsers. `loop={false}`.

### Fallback

If `items` is empty, renders the existing hardcoded fallback image URL as a static `<div>` background (matches current behavior).

---

## 4. Changes to `HomeAboutView`

- Prop `heroUrl: string` → `heroMedia: HomeMediaItem[]`
- The static `<div style={{ backgroundImage: url }}>` in the hero `<main>` is replaced by `<HomeVideoCarousel items={heroMedia} />`
- The `about` branch (`startAt === "about"`) still uses a static image for its sticky left column — this is intentional; the carousel only lives on the home hero screen

---

## 5. Changes to `app/page.tsx`

- Call `getHomePage()` instead of `getAboutPage()` for hero media
- Still calls `getAboutPage()` for `aboutBody` and `mainColor` (those remain on the about section)
- Passes `heroMedia={data?.heroMedia ?? []}` to `HomeAboutView`

---

## 6. Revalidation

Add `"home"` to the webhook handler so that publishing a `homePage` document invalidates the homepage cache. This follows the existing pattern for `"about"`, `"projects"`, etc.

---

## Constraints & Non-Goals

- No Mux/Cloudflare Stream integration — editors paste plain video URLs (same pattern as existing `heroVideo` on project pages)
- No drag/swipe gesture on desktop (click zones only); swipe on mobile is out of scope for this iteration
- The about-page sticky left column image is not changed
- No video progress bar or dot indicators — cursor-only navigation signal
