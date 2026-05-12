"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

import { AboutLayout } from "@/components/about-layout";
import { HomeVideoCarousel } from "@/components/home-video-carousel";
import type { AboutPageData, HomeMediaItem } from "@/sanity/lib/fetch";

type HomeAboutViewProps = {
  /** "home" = start at hero, "about" = start at about section */
  startAt: "home" | "about";
  heroMedia?: HomeMediaItem[];
  heroUrl?: string;
  mainColor?: string;
  secondaryColor?: string;
  aboutBody: AboutPageData["body"] | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
};

export function HomeAboutView({ startAt, heroMedia = [], heroUrl, mainColor, secondaryColor, aboutBody, instagramUrl, linkedinUrl }: HomeAboutViewProps) {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  // Hoist the theme color to :root so the fixed logo (rendered outside <main>) can inherit it.
  const resolvedColor = mainColor ?? "#7a7047";
  useEffect(() => {
    document.documentElement.style.setProperty("--page-theme-main", resolvedColor);
    document.documentElement.style.setProperty("--page-theme-secondary", secondaryColor ?? resolvedColor);
    return () => {
      document.documentElement.style.removeProperty("--page-theme-main");
      document.documentElement.style.removeProperty("--page-theme-secondary");
    };
  }, [resolvedColor, secondaryColor]);

  const scrollPanelRef = useRef<HTMLDivElement>(null);
  const [scrollFraction, setScrollFraction] = useState(0);

  useEffect(() => {
    const el = scrollPanelRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setScrollFraction(max > 0 ? el.scrollTop / max : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [startAt]);

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

  // Scroll down on / triggers the transition to about.
  // Delay listener activation to prevent residual scroll momentum from
  // immediately re-triggering exit after back-navigation.
  useEffect(() => {
    if (startAt !== "home") return;

    let armed = false;
    const armTimer = setTimeout(() => { armed = true; }, 400);

    const handleWheel = (e: WheelEvent) => {
      if (armed && e.deltaY > 0 && !exiting) {
        setExiting(true);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!armed) return;
      const startY = e.touches[0].clientY;

      const handleTouchEnd = (e2: TouchEvent) => {
        const endY = e2.changedTouches[0].clientY;
        if (startY - endY > 50 && !exiting) {
          setExiting(true);
        }
        window.removeEventListener("touchend", handleTouchEnd);
      };

      window.addEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    return () => {
      clearTimeout(armTimer);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [startAt, exiting]);

  // Forward wheel events from anywhere on the page into the scroll panel (left image side, etc.)
  useEffect(() => {
    if (startAt !== "about") return;
    const onWheel = (e: WheelEvent) => {
      const el = scrollPanelRef.current;
      if (!el || el.contains(e.target as Node)) return;
      el.scrollTop += e.deltaY;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [startAt]);

  const handleScrollbarMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const setFromY = (clientY: number) => {
      const fraction = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      const el = scrollPanelRef.current;
      if (el) el.scrollTop = fraction * (el.scrollHeight - el.clientHeight);
    };
    setFromY(e.clientY);
    const onMove = (ev: MouseEvent) => setFromY(ev.clientY);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // On /about: render only the about section, no hero, no scroll back
  if (startAt === "about") {
    return (
      <main
        id="main-content"
        className="flex flex-col"
        style={{ "--page-theme-main": resolvedColor, "--page-theme-secondary": secondaryColor ?? resolvedColor } as React.CSSProperties}
      >
        <AboutLayout
          ref={scrollPanelRef}
          heroUrl={heroUrl}
          mainColor={mainColor}
          secondaryColor={secondaryColor}
          aboutBody={aboutBody}
          instagramUrl={instagramUrl}
          linkedinUrl={linkedinUrl}
          scrollFraction={scrollFraction}
          onScrollbarMouseDown={handleScrollbarMouseDown}
        />
      </main>
    );
  }

  // On SPA navigation (push/traverse) enter from the about position so it feels
  // like scrolling up. On direct load or reload stay at the hero (y: 0).
  let initialY = "0%";
  if (typeof window !== "undefined") {
    const nav = (window as unknown as { navigation?: { currentEntry?: { navigationType?: string } } }).navigation;
    const navType = nav?.currentEntry?.navigationType;
    if (navType === "push" || navType === "traverse") {
      initialY = "-50%";
    }
  }

  // On /: render hero + about, animate between them
  return (
    <motion.div
      className="fixed inset-0 h-[200dvh] w-full"
      initial={{ y: initialY }}
      animate={exiting ? { y: "-50%" } : { y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        if (exiting) router.push("/about");
      }}
    >
      {/* ── First screen: hero ── */}
      <main id="main-content" className="home-hero-cursor-none relative h-dvh w-full overflow-hidden select-none">
        <HomeVideoCarousel items={heroMedia} />

        {/* ── Desktop: centered wordmark + circular logo top-right ── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/GentleWorks-Logo-InLine.svg"
          alt="Gentle Works"
          className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[765px] max-w-[85vw] h-auto brightness-0 invert"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 360 360"
          aria-hidden="true"
          className="hidden md:block absolute top-5 right-[25px] z-10 h-[60px] w-[60px]"
        >
          <path fill="#fff" d="M308.19,168.04v7.56c-1.1,9.77-2,19.45-4.76,29.35-3.39,12.15-7.24,24.05-14.67,34.3l-14.75,20.35c-14.96,20.65-32.45,29.72-55.7,39.45-11.34,4.74-22.91,8.01-35.25,8.79-23.3,1.48-52.7-3.71-71.18-17.58l-15.37-11.53c-18.09-13.58-30.63-26.34-37.52-48.73-5.96-19.36-8.14-38.87-7.14-59.2.64-13.2,3.09-25.78,6.64-38.4,7.51-26.66,26.77-47.78,50.17-61.56,5.86-3.45,11.86-5.54,18.47-7.14,12.43-3.01,24.53-5.96,37.33-7.14,7.97-.73,24.7-.91,32.35.03,10.9,1.34,21.11,3.63,31.57,6.83,18.18,5.55,33.98,15.04,47.76,28.07,19.63,18.58,28.62,51.17,32.05,76.56Z" />
        </svg>
        {/* ── Mobile: centered wordmark at top ── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/GentleWorks-Logo-InLine.svg"
          alt="Gentle Works"
          className="md:hidden absolute top-[60px] left-1/2 -translate-x-1/2 z-10 w-[75vw] h-auto brightness-0 invert"
        />
        {/* ── Mobile: circular logo at bottom-left (mirrors FixedLogo on other pages) ── */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 360 360"
          aria-hidden="true"
          className="md:hidden absolute bottom-6 left-6 z-10 h-[60px] w-[60px]"
        >
          <path fill="#fff" d="M308.19,168.04v7.56c-1.1,9.77-2,19.45-4.76,29.35-3.39,12.15-7.24,24.05-14.67,34.3l-14.75,20.35c-14.96,20.65-32.45,29.72-55.7,39.45-11.34,4.74-22.91,8.01-35.25,8.79-23.3,1.48-52.7-3.71-71.18-17.58l-15.37-11.53c-18.09-13.58-30.63-26.34-37.52-48.73-5.96-19.36-8.14-38.87-7.14-59.2.64-13.2,3.09-25.78,6.64-38.4,7.51-26.66,26.77-47.78,50.17-61.56,5.86-3.45,11.86-5.54,18.47-7.14,12.43-3.01,24.53-5.96,37.33-7.14,7.97-.73,24.7-.91,32.35.03,10.9,1.34,21.11,3.63,31.57,6.83,18.18,5.55,33.98,15.04,47.76,28.07,19.63,18.58,28.62,51.17,32.05,76.56Z" />
        </svg>

        <a
          href="/about"
          onClick={handleArrowClick}
          className="home-hero-cta absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-auto md:bottom-0 md:translate-y-0 z-10 hover:opacity-80 transition-opacity p-12 md:pb-12"
          style={{ animation: "slow-bounce 3s ease-in-out infinite" }}
          aria-label="About Gentle Works"
        >
          <img src="/assets/down-arrow.svg" alt="" width={29} height={82} className="h-[82px] w-auto brightness-0 invert" />
        </a>

      </main>

      {/* ── Second screen: about (revealed during scroll animation) ── */}
      <div
        className="h-dvh w-full"
        style={{ "--page-theme-main": resolvedColor, "--page-theme-secondary": secondaryColor ?? resolvedColor } as React.CSSProperties}
      >
        <AboutLayout
          heroUrl={heroUrl}
          mainColor={mainColor}
          secondaryColor={secondaryColor}
          aboutBody={aboutBody}
          instagramUrl={instagramUrl}
          linkedinUrl={linkedinUrl}
          scrollFraction={0}
        />
      </div>
    </motion.div>
  );
}
