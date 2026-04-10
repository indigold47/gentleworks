/**
 * Sanity environment wiring.
 *
 * All IDs and dataset names live in env vars so the repo stays portable and
 * the project can be transferred between Sanity orgs without code changes.
 *
 * NEXT_PUBLIC_* values are safe to ship to the browser (needed by the embedded
 * Studio). The read token and revalidate secret are server-only.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. See .env.local.example.`,
    );
  }
  return value;
}

export const projectId = required(
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
);

export const dataset = required(
  "NEXT_PUBLIC_SANITY_DATASET",
  process.env.NEXT_PUBLIC_SANITY_DATASET,
);

// Pin the API version so schema changes on Sanity's side can never break us
// without an explicit bump here. Use today's date when raising.
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-04-09";

// Server-only. Used by the cached fetch helper to read drafts/published data.
// Leave undefined in preview/prod if you only need published content.
export const readToken = process.env.SANITY_API_READ_TOKEN;

// Shared secret for the publish webhook → /api/revalidate.
export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET;
