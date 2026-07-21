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
 * be cropped tight around the glyph (the source files sit in a 500x500 canvas).
 * The default variant fades from the tip (theme color) out to transparent, and
 * the hover variant is a thin outlined stroke.
 */
const PREV_PATH =
  "M236.06,251.7l23.99,27.37c1.57,1.79,4.52.68,4.52-1.7v-54.74c0-2.38-2.95-3.49-4.52-1.7l-23.99,27.37c-.85.97-.85,2.43,0,3.4Z";
const NEXT_PATH =
  "M273.08,248.3l-23.99-27.37c-1.57-1.79-4.52-.68-4.52,1.7v54.74c0,2.38,2.95,3.49,4.52,1.7l23.99-27.37c.85-.97.85-2.43,0-3.4Z";

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
  const viewBox = direction === "prev" ? "234 218 32 64" : "244 218 32 64";
  // Gradient runs from the arrow tip (theme color) out to transparent
  const [x1, x2] =
    direction === "prev" ? ["230.75", "276.63"] : ["278.4", "232.52"];

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
              <stop offset="0" stopColor={color} stopOpacity="1" />
              <stop offset="0.26" stopColor={color} stopOpacity="0.78" />
              <stop offset="0.81" stopColor={color} stopOpacity="0.21" />
              <stop offset="1" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path fill={`url(#${gradId})`} d={path} />
        </>
      ) : (
        <path fill="none" stroke={color} strokeWidth="1.4" strokeMiterlimit="10" d={path} />
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
          <Arrow direction="prev" variant="default" color={color} className="h-[48px] w-[24px] group-hover:hidden" />
          <Arrow direction="prev" variant="hover" color={color} className="h-[48px] w-[24px] hidden group-hover:block" />
        </Link>
      )}
      {next && (
        <Link
          href={`/projects/${next.slug}`}
          aria-label={`Next project: ${next.title}`}
          className="group hidden lg:block fixed right-[34px] top-1/2 -translate-y-1/2 z-20"
        >
          <Arrow direction="next" variant="default" color={color} className="h-[48px] w-[24px] group-hover:hidden" />
          <Arrow direction="next" variant="hover" color={color} className="h-[48px] w-[24px] hidden group-hover:block" />
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
