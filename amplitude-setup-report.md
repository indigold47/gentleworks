# Amplitude Analytics — Setup Report

**Date:** April 28, 2026  
**Project:** Gentle Works (gentle.works)  
**Amplitude App ID:** 810189  

---

## What was set up

### SDK & Plugins

| Package | Version | Purpose |
|---|---|---|
| `@amplitude/analytics-browser` | already installed | Core analytics SDK |
| `@amplitude/plugin-session-replay-browser` | ^1.28.0 | Session Replay (sampleRate: 1 — 100% of sessions) |
| `@amplitude/engagement-browser` | ^1.0.9 | Guides & Surveys |

Initialization is in `components/analytics.tsx`, rendered once in `app/layout.tsx`. Autocapture is enabled — page views, element clicks, and form interactions are tracked automatically with no custom code.

### Environment Variables

| Variable | File | Purpose |
|---|---|---|
| `NEXT_PUBLIC_AMPLITUDE_API_KEY` | `.env.local` | SDK API key |
| `NEXT_PUBLIC_AMPLITUDE_SERVER_URL` | `.env.local` | EU/custom ingest endpoint (`https://api2.amplitude.com/2/httpapi`) |

---

## Instrumented Events

| Event | Fires when | Properties |
|---|---|---|
| `contact inquired` | Contact form submits and the API returns 200 | `subject`, `has_message` |
| `project filter applied` | A filter chip is toggled on the projects page | `filter_category`, `filter_value`, `filter_action` (applied/removed) |

### Files modified

- `components/contact-form.tsx` — `amplitude.track("contact inquired", ...)` on successful API response
- `components/projects/split-screen.tsx` — `amplitude.track("project filter applied", ...)` on each filter toggle

---

## Dashboard

**Gentle Works Analytics — 2026**  
https://app.amplitude.com/analytics/gentle-170888/dashboard/xkps62qp

### Charts

| Chart | Type | Populates |
|---|---|---|
| Site Traffic — Daily Active Visitors | Event Segmentation | Immediately (built-in `_active` event) |
| New Visitors Over Time | Event Segmentation | Immediately (built-in `_new` event) |
| Visitor Retention (7-Day) | Retention | After first users arrive and return |

**Note:** Charts for `contact inquired` and `project filter applied` were not pre-created because Amplitude validates events against the project taxonomy at chart-creation time, and neither event has fired yet. Add these charts after the first form submissions and filter interactions are recorded.

---

## Autocapture coverage

With `autocapture: true`, Amplitude automatically tracks:

- `[Amplitude] Page Viewed` — every route navigation
- `[Amplitude] Element Clicked` — every user click
- `[Amplitude] Form Started` / `[Amplitude] Form Submitted` — contact form interactions
- Session start/end events

These populate as soon as any user visits the deployed site — no custom instrumentation needed.

---

## Session Replay

Session Replay is configured at **sampleRate: 1** (100% of sessions recorded). This is appropriate for a low-traffic studio site. Adjust in `components/analytics.tsx` if traffic grows significantly.
