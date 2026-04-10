"use client";

/**
 * Sanity Studio, embedded at /studio.
 *
 * Must be a client component: sanity.config.ts imports from "sanity", which
 * pulls in React context APIs that only run on the client. Metadata + viewport
 * are re-exported from the sibling layout.tsx (server component).
 *
 * The catch-all [[...tool]] segment lets Studio own every sub-route under
 * /studio/*.
 */
import { NextStudio } from "next-sanity/studio";

import config from "../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
