"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { SiteNav } from "@/components/projects/projects-nav";
import type { PressItem } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";

type Filter = "all" | "award" | "article";

type PressViewProps = {
  items: PressItem[];
  themeColor?: string;
  secondaryColor?: string;
};

export function PressView({ items, themeColor, secondaryColor }: PressViewProps) {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const [filter, setFilter] = useState<Filter>("all");
  const listPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  const filtered =
    filter === "all" ? items : items.filter((p) => p.pressType === filter);

  // Image to show: hovered item > active item
  const displayIdx = hoveredIdx >= 0 ? hoveredIdx : activeIdx;
  const displayItem = displayIdx >= 0 ? filtered[displayIdx] : null;

  // Scrollbar calculations
  const count = filtered.length;
  const thumbPct = count > 0 ? Math.max(5, 100 / count) : 0;
  const maxOffset = 100 - thumbPct;
  const thumbFraction =
    activeIdx >= 0 && count > 1 ? activeIdx / (count - 1) : 0;
  const thumbTop =
    activeIdx >= 0 && maxOffset > 0 ? thumbFraction * maxOffset : 0;

  // Wheel handler for cycling items on desktop
  useEffect(() => {
    const panels = [listPanelRef.current, rightPanelRef.current].filter(Boolean) as HTMLElement[];
    if (panels.length === 0) return;

    let accumulator = 0;
    let lastTime = 0;
    const CYCLE_THRESHOLD = 120;

    function onWheel(e: WheelEvent) {
      if (window.innerWidth < 1024) return;
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      const now = Date.now();
      if (now - lastTime > 300) accumulator = 0;
      lastTime = now;

      const container = scrollContainerRef.current;
      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      let canNativeScroll = false;
      if (container) {
        const atBottom =
          container.scrollTop + container.clientHeight >=
          container.scrollHeight - 1;
        const atTop = container.scrollTop <= 1;
        canNativeScroll =
          (scrollingDown && !atBottom) || (scrollingUp && !atTop);
      }

      if (canNativeScroll) {
        accumulator = 0;
        return;
      }

      e.preventDefault();
      accumulator += e.deltaY;
      accumulator = Math.max(
        -CYCLE_THRESHOLD,
        Math.min(CYCLE_THRESHOLD, accumulator)
      );

      if (Math.abs(accumulator) >= CYCLE_THRESHOLD) {
        const direction = accumulator > 0 ? 1 : -1;
        accumulator = 0;

        setActiveIdx((prev) => {
          const next = Math.max(
            0,
            Math.min(filtered.length - 1, prev + direction)
          );
          if (next !== prev) isAnimatingRef.current = true;
          return next;
        });
      }
    }

    panels.forEach((p) => p.addEventListener("wheel", onWheel, { passive: false }));
    return () => panels.forEach((p) => p.removeEventListener("wheel", onWheel));
  }, [filtered]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIdx < 0) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    isAnimatingRef.current = true;
    const timeout = setTimeout(() => {
      const rows = container.querySelectorAll("[data-press-row]");
      const row = rows[activeIdx] as HTMLElement | undefined;
      if (!row) {
        isAnimatingRef.current = false;
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();

      if (
        rowRect.top < containerRect.top ||
        rowRect.bottom > containerRect.bottom
      ) {
        const offsetTop =
          rowRect.top - containerRect.top + container.scrollTop;
        const start = container.scrollTop;
        const distance = offsetTop - start;
        const duration = 800;
        let startTime: number | null = null;

        function step(timestamp: number) {
          if (!container) return;
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          container.scrollTop = start + distance * eased;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            isAnimatingRef.current = false;
          }
        }
        requestAnimationFrame(step);
      } else {
        isAnimatingRef.current = false;
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [activeIdx]);

  return (
    <div
      className="grid grid-cols-1 lg:min-h-svh lg:grid-cols-[3fr_2fr]"
      style={{ color: themeColor ?? "#7b6f47" }}
    >
      {/* Mobile: sticky nav panel (matches about/contact/team pattern) */}
      <div className="bleed-safe-top bg-textured relative sticky top-0 z-10 h-[calc(33svh_+_var(--sat))] lg:hidden">
        <SiteNav activeHref="/press" variant="dark" themeColor={themeColor} secondaryColor={secondaryColor} />
      </div>

      {/* Left panel: nav (desktop) + press list */}
      <div ref={listPanelRef} className="bleed-safe-top bg-textured relative flex flex-col">
        {/* Desktop nav */}
        <div className="hidden lg:block">
          <SiteNav activeHref="/press" variant="dark" themeColor={themeColor} secondaryColor={secondaryColor} />
        </div>

        {/* Press list */}
        <div className="flex flex-col px-6 pb-10 pt-4 sm:px-10 lg:px-12 lg:pt-72 lg:pb-12">
          {/* Filter tabs — sticky on mobile below the nav panel */}
          <div className="flex items-center justify-end gap-0 mb-4 sticky top-[calc(33svh_+_var(--sat))] lg:static z-10 bg-textured py-2 -mt-2">
            {(["all", "award", "article"] as const).map((f, i) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setActiveIdx(-1);
                }}
                aria-pressed={filter === f}
                className={`display italic text-sm tracking-wide transition-colors ${
                  filter === f ? "" : "text-muted hover:opacity-100"
                }`}
              >
                {i > 0 && (
                  <span className="text-muted mx-1.5" aria-hidden>
                    ·
                  </span>
                )}
                {f === "all" ? "All" : f === "award" ? "Awards" : "Articles"}
              </button>
            ))}
          </div>

          {/* Items */}
          <div
            ref={scrollContainerRef}
            className="flex flex-col lg:overflow-y-auto lg:flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {filtered.map((item, idx) => (
              <a
                key={item._id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                data-press-row
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(-1)}
                onClick={() => setActiveIdx(idx)}
                className="group grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_2fr_auto] gap-x-6 border-t border-rule py-6 transition-colors items-start"
                style={
                  hoveredIdx === idx || activeIdx === idx
                    ? { backgroundColor: `color-mix(in srgb, ${secondaryColor ?? "#b5ad8e"} 30%, transparent)` }
                    : undefined
                }
              >
                {/* Arrow + name */}
                <div className="flex items-start gap-3">
                  <ArrowUpRight
                    size={22}
                    strokeWidth={1.5}
                    className="mt-1 shrink-0 opacity-60"
                  />
                  <h2 className="display text-xl lg:text-2xl leading-snug">
                    {item.name}
                  </h2>
                </div>

                {/* Year (mobile: top-right, desktop: far right) */}
                <span className="display text-xl lg:text-2xl tabular-nums shrink-0 lg:order-last">
                  {item.year}
                </span>

                {/* Description */}
                <p className="col-span-2 lg:col-span-1 mt-2 lg:mt-0 pl-[34px] lg:pl-0 text-sm leading-relaxed opacity-70">
                  {item.description}
                </p>
              </a>
            ))}
            {/* Bottom border */}
            {filtered.length > 0 && <div className="border-t border-rule" />}
          </div>
        </div>
      </div>

      {/* Custom scrollbar — fixed between the two panels, sibling like team-view */}
      {count > 0 &&
        (() => (
          <div
            role="scrollbar"
            aria-orientation="vertical"
            aria-valuenow={activeIdx}
            aria-valuemin={0}
            aria-valuemax={count - 1}
            className="hidden lg:block fixed left-[60%] top-1/2 w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream z-10 overflow-hidden cursor-pointer"
            style={{ height: "min(750px, calc(100svh - 120px))", borderColor: `${themeColor ?? "#7b6f47"}30`, borderWidth: 1, borderStyle: "solid" }}
            onMouseDown={(e) => {
              e.preventDefault();
              const track = e.currentTarget;
              const rect = track.getBoundingClientRect();

              const setFromY = (clientY: number) => {
                const fraction = Math.max(
                  0,
                  Math.min(1, (clientY - rect.top) / rect.height)
                );
                const idx = Math.round(fraction * (count - 1));
                setActiveIdx(idx);
              };

              setFromY(e.clientY);

              const onMove = (ev: MouseEvent) => setFromY(ev.clientY);
              const onUp = () => {
                window.removeEventListener("mousemove", onMove);
                window.removeEventListener("mouseup", onUp);
              };
              window.addEventListener("mousemove", onMove);
              window.addEventListener("mouseup", onUp);
            }}
          >
            <div
              className="absolute left-0 w-full rounded-full pointer-events-none"
              style={{
                backgroundColor: themeColor ?? "#7b6f47",
                height: `${thumbPct}%`,
                top: `${thumbTop}%`,
                transition:
                  "top 600ms cubic-bezier(0.16, 1, 0.3, 1), height 400ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>
        ))()}

      {/* Right panel: textured background + item image on hover */}
      <div ref={rightPanelRef} className="hidden lg:block bg-textured sticky top-0 h-svh">
        <div className="flex justify-end px-12 pt-24">
          <AnimatePresence mode="wait">
            {displayItem?.image && (
              <motion.div
                key={displayItem._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={urlFor(displayItem.image)
                    .height(1200)
                    .quality(85)
                    .auto("format")
                    .url()}
                  alt={displayItem.image.alt || displayItem.name}
                  className="h-[min(350px,calc(100svh-380px))] w-auto object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
