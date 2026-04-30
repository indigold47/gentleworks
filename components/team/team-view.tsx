"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PortableText } from "next-sanity";

import { SiteNav } from "@/components/projects/projects-nav";
import type { TeamMemberItem } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";

type Filter = "all" | "present" | "past";

function TeamMedia({ url, className }: { url: string; className: string }) {
  if (url.includes(".mp4")) {
    return (
      <video
        src={url}
        className={className}
        autoPlay
        loop
        muted
        playsInline
        aria-label="The Gentle Works team"
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="The Gentle Works team" className={className} />;
}

type TeamViewProps = {
  members: TeamMemberItem[];
  themeColor?: string;
  teamGifUrl?: string | null;
};

export function TeamView({ members, themeColor, teamGifUrl }: TeamViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const memberRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const filtered =
    filter === "all" ? members : members.filter((m) => m.status === filter);

  const activeMember = expandedId
    ? members.find((m) => m._id === expandedId)
    : null;

  // Index of the expanded member within the filtered list
  const activeIdx = expandedId
    ? filtered.findIndex((m) => m._id === expandedId)
    : -1;

  // Scroll the expanded member into view
  useEffect(() => {
    if (!expandedId) return;
    const el = memberRefs.current.get(expandedId);
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }
  }, [expandedId]);

  // Scrollbar thumb — one unit per member
  const thumbFraction =
    activeIdx >= 0 && filtered.length > 1
      ? activeIdx / (filtered.length - 1)
      : 0;

  // Wheel-based member cycling — disabled when a member is expanded so the user can scroll to read
  useEffect(() => {
    if (expandedId !== null) return;

    let accumulator = 0;
    const THRESHOLD = 350;

    function onWheel(e: WheelEvent) {
      if (window.innerWidth < 1024) return;
      e.preventDefault();

      accumulator += e.deltaY;

      if (Math.abs(accumulator) >= THRESHOLD) {
        const steps = Math.trunc(accumulator / THRESHOLD);
        accumulator -= steps * THRESHOLD;
        setExpandedId((prev) => {
          const currentIdx = prev ? filtered.findIndex((m) => m._id === prev) : -1;
          const nextIdx = Math.max(0, Math.min(filtered.length - 1, currentIdx + steps));
          return filtered[nextIdx]?._id ?? prev;
        });
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [filtered, expandedId]);

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex flex-col min-h-svh lg:grid lg:grid-cols-[2fr_1fr]" style={{ color: themeColor ?? "#7b6f47" }}>
      {/* Top/Left panel: nav + selected member photo */}
      <div className="bg-textured relative sticky top-0 z-10 h-[33svh] lg:h-svh lg:flex lg:flex-col lg:justify-end">
        {/* Mobile: absolute nav (top-left, matches all other pages) + photo pinned top-right */}
        {/* Desktop: nav is absolute overlay, photo at bottom */}
        <div className="lg:hidden">
          <SiteNav
            activeHref="/team"
            variant="dark"
            themeColor={themeColor}
          />

          {/* Photo — absolute, right half of panel */}
          <div className="absolute top-0 right-0 h-full w-1/2 overflow-hidden flex flex-col items-end justify-start px-6 pt-6 pb-4 sm:px-10">
            {activeMember?.picture ? (
              <>
                <p className="text-xs mb-1.5 text-right shrink-0">{activeMember.fullName}</p>
                <div className="relative flex-1 min-h-0 w-full overflow-hidden">
                  <Image
                    src={urlFor(activeMember.picture).width(800).quality(85).auto("format").url()}
                    alt={activeMember.picture.alt}
                    fill
                    sizes="(max-width: 1023px) 45vw, 400px"
                    className="object-cover object-top"
                  />
                </div>
              </>
            ) : activeMember ? (
              <>
                <p className="text-xs mb-1.5 text-right shrink-0">{activeMember.fullName}</p>
                <div className="flex-1 min-h-0 w-full bg-muted/30" />
              </>
            ) : teamGifUrl ? (
              <TeamMedia url={teamGifUrl} className="flex-1 min-h-0 w-full object-cover" />
            ) : null}
          </div>
        </div>

        {/* Desktop: absolute nav overlay */}
        <div className="hidden lg:block">
          <SiteNav activeHref="/team" variant="dark" themeColor={themeColor} />
        </div>

        {/* Desktop: photo at bottom of panel */}
        <div className="hidden lg:flex flex-col items-start px-12 pb-12">
          <AnimatePresence mode="wait">
            {activeMember ? (
              <motion.div
                key={activeMember._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex flex-col items-start"
              >
                <p className="text-sm mb-2">{activeMember.fullName}</p>
                {activeMember.picture ? (
                  <div className="relative w-[350px] h-[420px] overflow-hidden">
                    <Image
                      src={urlFor(activeMember.picture).width(800).quality(85).auto("format").url()}
                      alt={activeMember.picture.alt}
                      fill
                      sizes="400px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-[350px] h-[420px] bg-muted/30" />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/Gentle-works-green.svg"
                  alt="Gentle Works"
                  className="mt-4 w-[350px]"
                />
              </motion.div>
            ) : teamGifUrl ? (
              <motion.div
                key="gif"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex flex-col items-start"
              >
                <TeamMedia url={teamGifUrl} className="w-[350px] h-[420px] object-cover" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/Gentle-works-green.svg"
                  alt="Gentle Works"
                  className="mt-4 w-[350px]"
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Custom scrollbar — fixed, matching projects page */}
      {filtered.length > 0 && (() => {
        const count = filtered.length;
        const thumbPct = Math.max(5, 100 / count);
        const maxOffset = 100 - thumbPct;
        const thumbTop = activeIdx >= 0 && maxOffset > 0 ? thumbFraction * maxOffset : 0;

        return (
          <div
            role="scrollbar"
            aria-orientation="vertical"
            aria-valuenow={activeIdx}
            aria-valuemin={0}
            aria-valuemax={count - 1}
            className="hidden lg:block fixed left-[66.666%] top-1/2 w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-default-green/30 bg-cream z-10 overflow-hidden cursor-pointer"
            style={{ height: 750 }}
            onMouseDown={(e) => {
              e.preventDefault();
              const track = e.currentTarget;
              const rect = track.getBoundingClientRect();

              const setFromY = (clientY: number) => {
                const fraction = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
                const idx = Math.round(fraction * (count - 1));
                const member = filtered[idx];
                if (member) setExpandedId(member._id);
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
              className="absolute left-0 w-full rounded-full bg-default-green pointer-events-none"
              style={{
                height: `${thumbPct}%`,
                top: `${thumbTop}%`,
                transition: "top 600ms cubic-bezier(0.16, 1, 0.3, 1), height 400ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>
        );
      })()}

      {/* Bottom/Right panel: team list — fixed height on desktop, inner scroll */}
      <div className="bg-textured relative flex flex-col px-6 py-10 sm:px-10 lg:px-12 lg:pt-24 lg:pb-12 lg:sticky lg:top-0 lg:h-svh lg:overflow-hidden">
        {/* Header — pinned, doesn't scroll */}
        <div className="mb-1">
          <h1 className="text-base">Meet the Gentle Workers.</h1>
        </div>

        {/* Filter tabs — pinned, doesn't scroll */}
        <div className="flex items-center gap-0 border-b border-rule pb-1 mb-0">
          <span className="text-sm text-muted mr-auto">People</span>
          {(["all", "present", "past"] as const).map((f, i) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`text-xs capitalize tracking-wide transition-colors ${
                filter === f
                  ? ""
                  : "text-muted hover:opacity-100"
              } ${i > 0 ? "ml-1" : ""}`}
            >
              {i > 0 && <span className="text-muted mx-1" aria-hidden>·</span>}
              {f === "all" ? "All" : f === "present" ? "Present" : "Past"}
            </button>
          ))}
        </div>

        {/* Scrollable team list — contained within the panel */}
        <div className="lg:overflow-y-auto lg:flex-1 lg:-mx-12 lg:px-12 mt-2">
        {/* Accordion list */}
        <div className="flex flex-col">
          {filtered.map((member) => {
            const isExpanded = expandedId === member._id;

            return (
              <div
                key={member._id}
                ref={(el) => {
                  if (el) memberRefs.current.set(member._id, el);
                  else memberRefs.current.delete(member._id);
                }}
                className="border-b border-rule"
              >
                <button
                  onClick={() => toggle(member._id)}
                  onMouseEnter={() => setHoveredId(member._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="flex w-full items-center justify-between py-4 text-left"
                  aria-expanded={isExpanded}
                >
                  <span
                    className="display text-xl lg:text-[22px]"
                    style={{ fontWeight: isExpanded || hoveredId === member._id ? 600 : 400 }}
                  >
                    {member.displayName}
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={18} strokeWidth={1.5} className="shrink-0 text-muted" />
                  ) : (
                    <ChevronDown size={18} strokeWidth={1.5} className="shrink-0 text-muted" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
                      }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="pb-6">
                        <p className="display italic text-base mb-4">
                          {member.role}
                        </p>
                        <div className="text-sm leading-relaxed space-y-4">
                          <PortableText value={member.description} />
                        </div>
                        {member.email && (
                          <p className="text-sm mt-4">
                            You can email them at{" "}
                            <a
                              href={`mailto:${member.email}`}
                              className="underline underline-offset-2 opacity-100 hover:opacity-70 transition-opacity"
                            >
                              {member.email}
                            </a>
                            .
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        </div>

      </div>
    </div>
  );
}
