import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { ProjectPagerItem } from "@/sanity/lib/fetch";

type ProjectPagerProps = {
  prev: ProjectPagerItem | null;
  next: ProjectPagerItem | null;
  /** Project theme main color — drives the arrow gradient/stroke. */
  color: string;
};

/*
 * Arrow paths lifted from public/assets/next_default.svg / previous_defult.svg,
 * inlined so the accent color can follow the project theme and the viewBox can
 * be cropped to the glyph (the source files bury a ~70x130 arrow in a 500x500
 * canvas, which made the buttons render tiny).
 */
const PREV_PATH =
  "M277.84,314.98l-61.87-61.87c-1.71-1.71-1.71-4.49,0-6.2l61.87-61.87c2.76-2.76,7.49-.81,7.49,3.1v123.75c0,3.91-4.72,5.86-7.49,3.1Z";
const NEXT_PATH =
  "M284.05,185.02l61.87,61.87c1.71,1.71,1.71,4.49,0,6.2l-61.87,61.87c-2.76,2.76-7.49.81-7.49-3.1v-123.75c0-3.91,4.72-5.86,7.49-3.1Z";

function Arrow({
  direction,
  variant,
  color,
  className,
}: {
  direction: "prev" | "next";
  variant: "default" | "hover";
  color: string;
  className?: string;
}) {
  const gradId = `pager-${direction}-grad`;
  const path = direction === "prev" ? PREV_PATH : NEXT_PATH;
  // Tight crop around each glyph (+ padding for the hover stroke)
  const viewBox = direction === "prev" ? "208 178 84 144" : "270 178 84 144";
  // Gradient runs from the arrow tip (accent) back to white, as in the source assets
  const [x1, x2] =
    direction === "prev" ? ["214.68", "285.32"] : ["347.21", "276.57"];

  return (
    <svg viewBox={viewBox} aria-hidden className={className}>
      {variant === "default" ? (
        <>
          <defs>
            <linearGradient
              id={gradId}
              x1={x1}
              y1="250"
              x2={x2}
              y2="250"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor={color} />
              <stop offset="1" stopColor="#fff" />
            </linearGradient>
          </defs>
          <path fill={`url(#${gradId})`} d={path} />
        </>
      ) : (
        <path fill="#fff" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" d={path} />
      )}
    </svg>
  );
}

/**
 * Desktop-only previous/next project navigation on detail pages.
 * Themed gradient arrows fixed to the left/right edges at mid-viewport.
 */
export function ProjectPager({ prev, next, color }: ProjectPagerProps) {
  return (
    <>
      {prev && (
        <Link
          href={`/projects/${prev.slug}`}
          aria-label={`Previous project: ${prev.title}`}
          className="group hidden lg:block fixed left-[44px] top-1/2 -translate-y-1/2 z-20"
        >
          <Arrow direction="prev" variant="default" color={color} className="h-[48px] w-[28px] group-hover:hidden" />
          <Arrow direction="prev" variant="hover" color={color} className="h-[48px] w-[28px] hidden group-hover:block" />
        </Link>
      )}
      {next && (
        <Link
          href={`/projects/${next.slug}`}
          aria-label={`Next project: ${next.title}`}
          className="group hidden lg:block fixed right-[34px] top-1/2 -translate-y-1/2 z-20"
        >
          <Arrow direction="next" variant="default" color={color} className="h-[48px] w-[28px] group-hover:hidden" />
          <Arrow direction="next" variant="hover" color={color} className="h-[48px] w-[28px] hidden group-hover:block" />
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
