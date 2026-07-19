import Link from "next/link";

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
 * Fixed previous/next project navigation on detail pages.
 * Left button centers under the back arrow, right button under the header logo.
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
          <Arrow direction="prev" variant="default" color={color} className="h-[72px] w-[42px] group-hover:hidden" />
          <Arrow direction="prev" variant="hover" color={color} className="h-[72px] w-[42px] hidden group-hover:block" />
        </Link>
      )}
      {next && (
        <Link
          href={`/projects/${next.slug}`}
          aria-label={`Next project: ${next.title}`}
          className="group hidden lg:block fixed right-[34px] top-1/2 -translate-y-1/2 z-20"
        >
          <Arrow direction="next" variant="default" color={color} className="h-[72px] w-[42px] group-hover:hidden" />
          <Arrow direction="next" variant="hover" color={color} className="h-[72px] w-[42px] hidden group-hover:block" />
        </Link>
      )}
    </>
  );
}
