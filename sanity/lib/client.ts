import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

/**
 * Shared Sanity client.
 *
 * useCdn is true because all reads flow through our own `'use cache'` wrapper,
 * so we want the fastest possible origin. The cache is what makes content
 * fresh, not the CDN bypass.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});
