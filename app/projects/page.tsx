import Link from "next/link";

/**
 * Projects page — placeholder scaffold.
 *
 * Once the CMS is chosen, this page will:
 *   1. Fetch all projects + tag taxonomy from the CMS in a `'use cache'`
 *      function, tagged with `cacheTag('projects')`.
 *   2. Pass the data into a client <ProjectsSplitScreen /> component that
 *      renders the sticky left image column + scrollable right column of
 *      filter chips and project entries, with URL-synced filter state.
 *   3. Revalidate via a webhook → `/api/revalidate` → `updateTag('projects')`
 *      so editor changes appear without a redeploy.
 *
 * See ARCHITECTURE.md for the full plan.
 */
export default function ProjectsPage() {
  return (
    <main className="flex flex-1 flex-col px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <Link
        href="/"
        className="text-sm uppercase tracking-[0.14em] text-muted hover:text-ink transition-colors"
      >
        ← Back
      </Link>
      <h1 className="display mt-12 text-[clamp(2.5rem,8vw,7rem)]">
        Projects
      </h1>
      <p className="mt-8 max-w-md text-base leading-relaxed text-muted">
        Split-screen projects view lands here once the CMS is wired up and
        designs arrive from the studio.
      </p>
    </main>
  );
}
