"use client";

import { forwardRef } from "react";
import { PortableText } from "next-sanity";

import { SiteNav } from "@/components/projects/projects-nav";
import type { AboutPageData } from "@/sanity/lib/fetch";

const FALLBACK_BODY = [
  {
    key: "1",
    p: (
      <>
        <em>Gentle Works</em> is an Atlanta, Georgia-based design practice
        offering architecture, planning, and interior design services to clients
        who share our commitment to the pursuit of a humane and enduring built
        environment.
      </>
    ),
  },
  {
    key: "2",
    p: "We approach our work with optimism and curiosity, striving to design spaces which are not only beautiful, but sympathetic and responsive to the cultural, environmental, and economic conditions in which we find them.",
  },
  {
    key: "3",
    p: "We take small and large projects alike, but in every case we seek to craft places that serve people, to enrich the experience of everyday life, to foster social connection and commerce, and to leave a built legacy flexible enough to respond to human needs and desires not yet considered.",
  },
];

export type AboutLayoutProps = {
  heroUrl?: string;
  mainColor?: string;
  secondaryColor?: string;
  aboutBody: AboutPageData["body"] | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  /** Show scroll-dependent fades and scrollbar (only on the standalone about page) */
  scrollFraction?: number;
  /** Handler for custom scrollbar drag */
  onScrollbarMouseDown?: React.MouseEventHandler<HTMLDivElement>;
};

/**
 * The shared about page layout — split-screen with hero image left, text right.
 * Used both in the home page scroll animation (second screen) and on /about directly.
 */
export const AboutLayout = forwardRef<HTMLDivElement, AboutLayoutProps>(
  function AboutLayout({ heroUrl, mainColor, secondaryColor, aboutBody, instagramUrl, linkedinUrl, scrollFraction, onScrollbarMouseDown }, ref) {
    const showScrollUI = scrollFraction !== undefined;

    return (
      <div className="relative h-full">
        <div className="grid min-h-svh grid-cols-1 lg:grid-cols-[3fr_2fr]">
          <div className="bleed-safe-top relative h-[calc(50svh_+_var(--sat))] sticky top-0 z-10 lg:h-[calc(100svh_+_var(--sat))] bg-[#e8ddd4]">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-75"
              style={{ backgroundImage: `url('${heroUrl}')` }}
            />
            <SiteNav activeHref="/about" variant="dark" themeColor={mainColor} secondaryColor={secondaryColor} />
          </div>

          <div className="relative lg:sticky lg:top-0 lg:h-svh">
            <div
              ref={ref}
              className="bg-textured relative flex flex-col justify-center lg:justify-start px-8 py-12 sm:px-12 lg:px-16 lg:py-12 lg:h-full lg:overflow-y-auto"
            >
              <div className="flex gap-4 mb-8 lg:mt-[400px]">
                <a href={instagramUrl ?? "https://www.instagram.com/gentleworks/"} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="opacity-60 hover:opacity-100 transition-opacity">
                  <span className="block h-[36px] w-[36px]" style={{ backgroundColor: mainColor ?? "#7a6f47", maskImage: "url('/assets/instagram.svg')", maskSize: "contain", maskRepeat: "no-repeat", WebkitMaskImage: "url('/assets/instagram.svg')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat" }} />
                </a>
                <a href={linkedinUrl ?? "https://www.linkedin.com/company/gentleworks/about/"} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="opacity-60 hover:opacity-100 transition-opacity">
                  <span className="block h-[36px] w-[36px]" style={{ backgroundColor: mainColor ?? "#7a6f47", maskImage: "url('/assets/linkedin.svg')", maskSize: "contain", maskRepeat: "no-repeat", WebkitMaskImage: "url('/assets/linkedin.svg')", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat" }} />
                </a>
              </div>
              <div className="max-w-lg display text-[25px] lg:text-[30px] text-ink/80 space-y-8" style={{ lineHeight: "1.18", ...(mainColor ? { color: mainColor } : {}) }}>
                <h1 className="sr-only">About Gentle Works</h1>
                {aboutBody ? (
                  <PortableText value={aboutBody} />
                ) : (
                  FALLBACK_BODY.map((item) => (
                    <p key={item.key}>
                      {item.p}
                    </p>
                  ))
                )}
              </div>
            </div>
            {/* Top fade — appears as user scrolls away from the top (desktop only, mobile uses fixed) */}
            {showScrollUI && (
              <div
                aria-hidden="true"
                className="hidden lg:block absolute top-0 inset-x-0 h-28 pointer-events-none transition-opacity duration-500"
                style={{
                  background: "linear-gradient(to bottom, #f5f1ea 20%, transparent 100%)",
                  opacity: Math.min(1, scrollFraction * 8),
                }}
              />
            )}
            {/* Bottom fade — hints there's more content, fades out near end (desktop only, mobile uses fixed) */}
            {showScrollUI && (
              <div
                aria-hidden="true"
                className="hidden lg:block absolute bottom-0 inset-x-0 h-28 pointer-events-none transition-opacity duration-500"
                style={{
                  background: "linear-gradient(to top, #f5f1ea 20%, transparent 100%)",
                  opacity: Math.max(0, 1 - scrollFraction * 6),
                }}
              />
            )}
            {/* Mobile bottom fade — fixed to viewport */}
            {showScrollUI && (
              <div
                aria-hidden="true"
                className="lg:hidden fixed bottom-0 left-0 right-0 h-20 pointer-events-none z-10 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(to top, #f5f1ea 20%, transparent 100%)",
                  opacity: 1 - scrollFraction,
                }}
              />
            )}
          </div>
        </div>

        {/* Custom scrollbar — same position as project index and team page */}
        {showScrollUI && (
          <div
            role="scrollbar"
            aria-orientation="vertical"
            aria-valuenow={Math.round(scrollFraction * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="hidden lg:block absolute left-[60%] top-1/2 w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream z-10 overflow-hidden cursor-pointer"
            style={{
              height: "min(750px, calc(100svh - 120px))",
              border: `1px solid ${mainColor ? mainColor + "4D" : "rgba(122,111,71,0.3)"}`,
            }}
            onMouseDown={onScrollbarMouseDown}
          >
            <div
              className="absolute left-0 w-full rounded-full pointer-events-none"
              style={{
                height: "25%",
                top: `${scrollFraction * 75}%`,
                background: mainColor ?? "#7a6f47",
                transition: "top 80ms linear",
              }}
            />
          </div>
        )}
      </div>
    );
  },
);
