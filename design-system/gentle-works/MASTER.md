# Design System — Master File

> **LOGIC:** When building a specific page, first check `design-system/gentle-works/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> Otherwise strictly follow the rules below.

---

**Project:** Gentle Works
**Category:** Architecture / Interior Design Studio — Editorial Portfolio
**Generated:** 2026-04-09
**Status:** Placeholder values derived from current gentle.works site identity — **will be updated once client delivers final design.**

---

## Brand Direction

Minimal editorial portfolio for an architecture & design studio. Takes cues from the current gentle.works site: sage green accent, warm cream background, generous whitespace, large imagery, and quiet confidence. The rebuild leans into **exaggerated editorial minimalism** — oversized display type, restrained accents, and image-first storytelling.

## Global Rules

### Color Palette

| Role | Hex | CSS Variable | Notes |
|------|-----|--------------|-------|
| Ink (primary text) | `#141414` | `--color-ink` | Near-black, warmer than pure black |
| Cream (background) | `#F5F1EA` | `--color-cream` | Warm off-white, paper-like |
| Sage (brand accent) | `#4F6B4A` | `--color-sage` | Muted forest sage — primary brand color |
| Sage Deep | `#2F3E2C` | `--color-sage-deep` | Hover/active states |
| Muted | `#6B6B6B` | `--color-muted` | Secondary text, metadata, captions |
| Rule | `#E5DFD3` | `--color-rule` | Hairline dividers on cream |
| Surface | `#FFFFFF` | `--color-surface` | Pure white cards on cream bg (sparingly) |

**Contrast check:** Ink on Cream ≈ 14:1 ✓ AAA. Sage on Cream ≈ 5.1:1 ✓ AA. Muted on Cream ≈ 4.8:1 ✓ AA.

### Typography

Editorial contrast: a display serif for headings creates architectural gravitas; clean grotesk for body supports dense, scannable project descriptions.

- **Display / Headings:** `Instrument Serif` — tall, editorial, excellent at oversized display sizes
- **Body / UI:** `Inter` — neutral, highly legible at small sizes, great variable font support
- **Mood:** Editorial, confident, architectural, considered

**Google Fonts Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
```

**Type scale (fluid):**
| Token | Clamp | Usage |
|---|---|---|
| `--text-xs` | `clamp(0.75rem, 0.72rem + 0.15vw, 0.8125rem)` | Captions, tags |
| `--text-sm` | `clamp(0.875rem, 0.84rem + 0.17vw, 0.9375rem)` | Metadata, UI |
| `--text-base` | `clamp(1rem, 0.95rem + 0.25vw, 1.0625rem)` | Body text |
| `--text-lg` | `clamp(1.125rem, 1.05rem + 0.4vw, 1.25rem)` | Lead paragraphs |
| `--text-xl` | `clamp(1.5rem, 1.3rem + 1vw, 2rem)` | Subheadings |
| `--text-2xl` | `clamp(2rem, 1.6rem + 2vw, 3.5rem)` | Section headings |
| `--text-display` | `clamp(3rem, 2rem + 6vw, 8rem)` | Hero display (Instrument Serif) |

**Rules:**
- Body: `Inter` 400, line-height 1.6, tracking `-0.005em`
- Display headings: `Instrument Serif` 400, line-height 0.95, tracking `-0.02em`
- Never bold Instrument Serif — it's designed for regular weight only
- Use `font-feature-settings: "ss01", "cv11"` on Inter for refined alternates

### Spacing Scale (4pt)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | `4px` | Hairline gaps |
| `--space-2` | `8px` | Tight inline |
| `--space-3` | `12px` | Chip padding |
| `--space-4` | `16px` | Standard |
| `--space-6` | `24px` | Card padding |
| `--space-8` | `32px` | Section inner |
| `--space-12` | `48px` | Block spacing |
| `--space-16` | `64px` | Section margins |
| `--space-24` | `96px` | Large section gaps |
| `--space-32` | `128px` | Hero padding |

### Layout

- **Max content width:** `1440px` with `clamp(16px, 5vw, 80px)` horizontal padding
- **Grid:** 12-col desktop, 6-col tablet, 4-col mobile, `24px` gutters
- **Breakpoints:** 375 / 768 / 1024 / 1440
- **Split-screen projects layout:** 50/50 desktop (sticky left image, scrollable right content), stacked on mobile

### Motion

- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (expo-out, the standard editorial "gentle lift")
- **Durations:** micro 150ms · standard 250ms · large 400ms · page 600ms
- **Scroll animations:** Intersection-observer based fade-up (`y: 24 → 0`, `opacity: 0 → 1`), 80ms stagger for adjacent items
- **Smooth scroll:** Lenis with default config (lerp 0.1)
- **Honor `prefers-reduced-motion`:** fall back to instant state changes, no parallax

### Effects

- **Shadows:** minimal — rely on cream-on-white tonal separation and rules instead of heavy shadows
- **Radii:** `--radius-sm: 2px` / `--radius-md: 4px` / `--radius-lg: 8px` — keep subtle, editorial look prefers near-square corners
- **Borders:** `1px solid var(--color-rule)` for hairlines
- **Image treatment:** No rounded corners on hero/project images; subtle grain overlay acceptable at ≤3% opacity

---

## Component Specs

### Buttons

```css
.btn-primary {
  background: var(--color-ink);
  color: var(--color-cream);
  padding: 14px 28px;
  border-radius: var(--radius-md);
  font: 500 var(--text-sm)/1 'Inter', sans-serif;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  transition: background 250ms var(--ease);
  cursor: pointer;
}
.btn-primary:hover { background: var(--color-sage-deep); }

.btn-ghost {
  background: transparent;
  color: var(--color-ink);
  border: 1px solid var(--color-ink);
  padding: 13px 27px;
  /* same typography */
}
.btn-ghost:hover { background: var(--color-ink); color: var(--color-cream); }
```

### Filter Chips (critical for projects page)

```css
.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--color-rule);
  border-radius: 999px;
  background: transparent;
  font: 400 var(--text-sm) 'Inter', sans-serif;
  color: var(--color-ink);
  cursor: pointer;
  transition: all 200ms var(--ease);
}
.chip:hover { border-color: var(--color-ink); }
.chip[aria-pressed="true"] {
  background: var(--color-ink);
  color: var(--color-cream);
  border-color: var(--color-ink);
}
```

### Project Card (split-screen right column)

- No card background/shadow — let content breathe on cream
- Title: Instrument Serif `--text-2xl`
- Location + year: Inter `--text-sm` muted
- Description: Inter `--text-base`
- Tags: chip variant, smaller
- Hairline rule between entries (`border-bottom: 1px solid var(--color-rule)`)

### Inputs

```css
.input {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--color-rule);
  padding: 12px 0;
  font: 400 var(--text-base) 'Inter', sans-serif;
  color: var(--color-ink);
  transition: border-color 200ms var(--ease);
}
.input:focus {
  outline: none;
  border-bottom-color: var(--color-ink);
}
```

---

## Style Guidelines

**Style:** Editorial Minimalism (architecture/studio variant)

**Keywords:** Editorial, oversized display serif, generous whitespace, cream ground, sage accent, image-first, confident restraint.

**Best For:** Architecture studios, design agencies, editorial portfolios, luxury hospitality, curated product brands.

**Key Effects:**
- `font-family: 'Instrument Serif'` at `clamp(3rem, 2rem + 6vw, 8rem)` for hero display
- `letter-spacing: -0.02em` on display type
- Horizontal hairline rules (`1px var(--color-rule)`) as section dividers
- No heavy shadows — rely on tonal contrast and whitespace hierarchy

### Page Pattern — Projects (Split Screen)

1. **Left column (sticky, 50% desktop):** Large project image, changes on scroll/click
2. **Right column (scrollable, 50% desktop):** Filter chips at top, then project list — each entry has title, meta, description, tags
3. **Filter behavior:** Client-side filtering from pre-rendered data, URL-synced via `?tag=...`, instant feedback
4. **Mobile:** Stacked — image above, content below, horizontally-scrollable filter chips

---

## Anti-Patterns (Do NOT Use)

- ❌ **Emojis as icons** — use Lucide (thin stroke, matches editorial feel)
- ❌ **Heavy drop shadows** — breaks the minimal ground
- ❌ **Bright colors beyond sage** — no vivid accents, no gradients
- ❌ **Bold Instrument Serif** — it's a display-regular face only
- ❌ **Rounded project images** — square corners on imagery always
- ❌ **Dense filter UI** — chips must breathe; ≤8 visible at once, overflow to expandable
- ❌ **Instant image swaps** — always crossfade (250–400ms)
- ❌ **Scale-transform hovers** that shift layout
- ❌ **Carousel-as-primary-nav** — projects are scroll-driven, not swiped

## Pre-Delivery Checklist

- [ ] No emojis used as icons — Lucide SVGs only
- [ ] All icons thin stroke (1.5px), consistent sizing
- [ ] Ink-on-cream contrast verified ≥ 4.5:1
- [ ] Sage accent meets 3:1 minimum against cream
- [ ] Focus rings visible on all interactive elements
- [ ] `prefers-reduced-motion` respected (no Lenis, no parallax, instant transitions)
- [ ] Responsive: 375 / 768 / 1024 / 1440 tested
- [ ] No horizontal scroll on mobile
- [ ] No content hidden behind fixed header
- [ ] Instrument Serif uses `font-display: swap` with metric fallback to avoid CLS
- [ ] Images use next/image with blur placeholders
- [ ] Projects page works without JavaScript (progressive enhancement for filters)
