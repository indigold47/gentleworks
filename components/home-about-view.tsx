"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PortableText } from "next-sanity";
import { motion } from "motion/react";

import { SiteNav } from "@/components/projects/projects-nav";
import type { AboutPageData } from "@/sanity/lib/fetch";

const FALLBACK_IMAGE_URL =
  "https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/3165763e-5418-49cd-a0a5-c652b5f4158c/KI_optimist+hall-7-web+copy.jpg";

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

type HomeAboutViewProps = {
  /** "home" = start at hero, "about" = start at about section */
  startAt: "home" | "about";
  heroUrl: string;
  mainColor?: string;
  aboutBody: AboutPageData["body"] | null;
};

export function HomeAboutView({ startAt, heroUrl, mainColor, aboutBody }: HomeAboutViewProps) {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  const handleArrowClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (exiting) return;
      setExiting(true);
    },
    [exiting],
  );

  // Reset exit state when startAt changes (e.g. navigating back to /)
  useEffect(() => {
    setExiting(false);
  }, [startAt]);

  // On /about: render only the about section, no hero, no scroll back
  if (startAt === "about") {
    return (
      <main
        id="main-content"
        className="flex flex-col"
        style={mainColor ? { "--page-theme-main": mainColor } as React.CSSProperties : undefined}
      >
        <div className="grid min-h-svh grid-cols-1 lg:grid-cols-[2fr_1fr]">
          <div className="relative h-[50svh] sticky top-0 lg:h-svh bg-[#e8ddd4]">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-75"
              style={{ backgroundImage: `url('${heroUrl}')` }}
            />
            <SiteNav activeHref="/about" variant="dark" themeColor={mainColor} />
          </div>

          <div className="bg-textured relative flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-16 lg:py-12 lg:sticky lg:top-0 lg:h-svh lg:overflow-y-auto">
            <div className="max-w-lg display text-[25px] text-ink/80" style={{ lineHeight: "25px", ...(mainColor ? { color: mainColor } : {}) }}>
              <h1 className="sr-only">About Gentle Works</h1>
              {aboutBody ? (
                <PortableText value={aboutBody} />
              ) : (
                FALLBACK_BODY.map((item, i) => (
                  <p key={item.key} className={i > 0 ? "mt-8" : undefined}>
                    {item.p}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // On /: render hero + about, animate between them
  return (
    <motion.div
      className="fixed inset-0 h-[200dvh] w-full"
      animate={exiting ? { y: "-50%" } : { y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        if (exiting) router.replace("/about");
      }}
    >
      {/* ── First screen: hero ── */}
      <main id="main-content" className="relative h-dvh w-full overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/3165763e-5418-49cd-a0a5-c652b5f4158c/KI_optimist+hall-7-web+copy.jpg')",
          }}
        />

        <a
          href="/about"
          onClick={handleArrowClick}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 hover:opacity-80 transition-opacity animate-bounce cursor-pointer"
          aria-label="About Gentle Works"
        >
          <img src="/assets/down-arrow.svg" alt="" className="h-[82px] w-auto brightness-0 invert" />
        </a>

        <a
          href="https://www.instagram.com/gentleworks/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-12 left-6 z-10 hover:opacity-80 transition-opacity"
          aria-label="Instagram"
        >
          <img src="/assets/instagram.svg" alt="" className="h-[30px] w-[30px] brightness-0 invert" />
        </a>

        <a
          href="https://www.linkedin.com/company/gentleworks/about/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-12 right-6 z-10 hover:opacity-80 transition-opacity"
          aria-label="LinkedIn"
        >
          <img src="/assets/linkedin.svg" alt="" className="h-[30px] w-[30px] brightness-0 invert" />
        </a>
      </main>

      {/* ── Second screen: about (revealed during scroll animation) ── */}
      <div
        className="h-dvh w-full grid grid-cols-1 lg:grid-cols-[2fr_1fr]"
        style={mainColor ? { "--page-theme-main": mainColor } as React.CSSProperties : undefined}
      >
        <div className="relative h-full bg-[#e8ddd4]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-75"
            style={{ backgroundImage: `url('${heroUrl}')` }}
          />
          <SiteNav activeHref="/about" variant="dark" themeColor={mainColor} />
        </div>

        <div className="bg-textured relative flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-16 lg:py-12">
          <div className="max-w-lg display text-[25px] text-ink/80" style={{ lineHeight: "25px", ...(mainColor ? { color: mainColor } : {}) }}>
            {aboutBody ? (
              <PortableText value={aboutBody} />
            ) : (
              FALLBACK_BODY.map((item, i) => (
                <p key={item.key} className={i > 0 ? "mt-8" : undefined}>
                  {item.p}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
