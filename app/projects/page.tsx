import type { Metadata } from "next";
import { Suspense, ViewTransition } from "react";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore the portfolio of Gentle Works — architecture, interior design, and adaptive reuse projects across Atlanta and beyond.",
  alternates: { canonical: "https://gentle.works/projects" },
};
import { getAllProjectsDetail, getAllTags } from "@/sanity/lib/fetch";
import { SplitScreen } from "@/components/projects/split-screen";
import { ScrollToTop } from "@/components/scroll-to-top";

/**
 * Projects page — split-screen layout.
 *
 * Server component: fetches all projects + tags at build time (via `'use cache'`
 * in the fetch helpers), passes them down to the client SplitScreen component.
 *
 * Wrapped in Suspense because SplitScreen uses useSearchParams() for
 * client-side filter state synced to the URL.
 */
export default async function ProjectsPage() {
  const [projects, tags] = await Promise.all([
    getAllProjectsDetail(),
    getAllTags(),
  ]);

  return (
    <ViewTransition
      enter={{
        "nav-back": "slide-from-left",
        default: "none",
      }}
      exit={{
        "nav-forward": "fade-out-down",
        default: "none",
      }}
      default="none"
    >
      <main id="main-content" className="flex flex-col">
        <h1 className="sr-only">Projects</h1>
        <Suspense>
          <SplitScreen projects={projects} tags={tags} />
        </Suspense>
        <ScrollToTop />
      </main>
    </ViewTransition>
  );
}
