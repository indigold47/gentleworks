import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { ProjectPagerItem } from "@/sanity/lib/fetch";

type ProjectPagerProps = {
  prev: ProjectPagerItem | null;
  next: ProjectPagerItem | null;
  /** Project theme main color — drives the arrow gradient/stroke. */
  color: string;
};

/**
 * Renders a word one letter per row, stacked vertically — used as an editorial
 * navigation label along the viewport edge.
 */
function VerticalWord({ word }: { word: string }) {
  return (
    <span aria-hidden className="flex flex-col items-center gap-[6px] leading-none">
      {word.split("").map((letter, i) => (
        <span key={i} className="display text-[20px] uppercase">
          {letter}
        </span>
      ))}
    </span>
  );
}

/**
 * Desktop-only previous/next project navigation on detail pages.
 * Editorial vertical typography ("P/R/E/V/I/O/U/S" and "N/E/X/T") fixed to the
 * left/right edges at mid-viewport, tinted with the project theme color.
 */
export function ProjectPager({ prev, next, color }: ProjectPagerProps) {
  return (
    <>
      {prev && (
        <Link
          href={`/projects/${prev.slug}`}
          aria-label={`Previous project: ${prev.title}`}
          className="group hidden lg:block fixed left-[55px] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ color }}
        >
          <span className="block transition-transform duration-500 ease-out group-hover:-translate-x-1.5">
            <VerticalWord word="Previous" />
          </span>
        </Link>
      )}
      {next && (
        <Link
          href={`/projects/${next.slug}`}
          aria-label={`Next project: ${next.title}`}
          className="group hidden lg:block fixed right-[55px] top-1/2 translate-x-1/2 -translate-y-1/2 z-20"
          style={{ color }}
        >
          <span className="block transition-transform duration-500 ease-out group-hover:translate-x-1.5">
            <VerticalWord word="Next" />
          </span>
        </Link>
      )}
    </>
  );
}

/**
 * Mobile/tablet in-flow glass pill placed above the footer.
 * Chevron + short label only — no project titles.
 */
export function ProjectPagerMobile({ prev, next, color }: ProjectPagerProps) {
  if (!prev && !next) return null;
  const glassBg = `color-mix(in srgb, ${color} 55%, transparent)`;

  return (
    <div className="lg:hidden flex justify-center px-6 py-10 sm:py-12">
      <nav
        aria-label="Project navigation"
        className="flex items-stretch gap-1 rounded-full border border-white/20 p-1 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/10"
        style={{ backgroundColor: glassBg }}
      >
        {prev ? (
          <Link
            href={`/projects/${prev.slug}`}
            aria-label={`Previous project: ${prev.title}`}
            className="group flex items-center gap-1.5 rounded-full pl-3 pr-4 py-2 text-cream/95 transition-colors hover:bg-white/15 active:bg-white/25"
          >
            <ChevronLeft
              size={14}
              strokeWidth={1.75}
              className="shrink-0 transition-transform duration-300 ease-out group-hover:-translate-x-0.5"
            />
            <span className="display text-[11px] uppercase tracking-[0.18em]">Previous</span>
          </Link>
        ) : (
          <span className="w-2" aria-hidden />
        )}
        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            aria-label={`Next project: ${next.title}`}
            className="group flex items-center gap-1.5 rounded-full pl-4 pr-3 py-2 text-cream/95 transition-colors hover:bg-white/15 active:bg-white/25"
          >
            <span className="display text-[11px] uppercase tracking-[0.18em]">Next</span>
            <ChevronRight
              size={14}
              strokeWidth={1.75}
              className="shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
            />
          </Link>
        ) : (
          <span className="w-2" aria-hidden />
        )}
      </nav>
    </div>
  );
}
