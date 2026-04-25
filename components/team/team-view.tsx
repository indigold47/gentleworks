"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PortableText } from "next-sanity";

import { SiteNav } from "@/components/projects/projects-nav";
import type { TeamMemberItem } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";

type Filter = "all" | "present" | "past";

type TeamViewProps = {
  members: TeamMemberItem[];
};

export function TeamView({ members }: TeamViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
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

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex flex-col min-h-svh lg:grid lg:grid-cols-[2fr_14px_1fr]">
      {/* Top/Left panel: nav + selected member photo */}
      <div className="relative sticky top-0 z-10 h-[33svh] lg:h-svh bg-cream lg:flex lg:flex-col lg:justify-end">
        {/* Mobile: side-by-side grid — nav left, photo right */}
        {/* Desktop: nav is absolute overlay, photo at bottom */}
        <div className="grid grid-cols-2 h-full lg:hidden">
          {/* Nav column — relative positioning on mobile */}
          <div className="flex flex-col justify-center">
            <SiteNav
              activeHref="/team"
              variant="dark"
              className="flex flex-col gap-1 px-6 pt-6 pb-4 sm:px-10"
            />
          </div>

          {/* Photo column */}
          <div className="flex flex-col items-end justify-start px-6 pt-6 pb-4 sm:px-10">
            {activeMember?.picture ? (
              <>
                <div className="relative w-full max-w-[140px] aspect-[3/4] overflow-hidden">
                  <Image
                    src={urlFor(activeMember.picture).width(400).quality(85).auto("format").url()}
                    alt={activeMember.picture.alt}
                    fill
                    sizes="140px"
                    className="object-cover"
                  />
                </div>
                <p className="text-xs text-ink mt-1.5 text-right">{activeMember.fullName}</p>
              </>
            ) : activeMember ? (
              <>
                <div className="w-full max-w-[140px] aspect-[3/4] bg-muted/30" />
                <p className="text-xs text-ink mt-1.5 text-right">{activeMember.fullName}</p>
              </>
            ) : null}
          </div>
        </div>

        {/* Desktop: absolute nav overlay */}
        <div className="hidden lg:block">
          <SiteNav activeHref="/team" variant="dark" />
        </div>

        {/* Desktop: photo at bottom of panel */}
        {activeMember && (
          <div className="hidden lg:flex flex-col items-start px-12 pb-12">
            {activeMember.picture ? (
              <div className="relative w-48 h-60 overflow-hidden">
                <Image
                  src={urlFor(activeMember.picture).width(400).quality(85).auto("format").url()}
                  alt={activeMember.picture.alt}
                  fill
                  sizes="192px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-48 h-60 bg-muted/30" />
            )}
            <p className="text-sm text-ink mt-2">{activeMember.fullName}</p>
          </div>
        )}
      </div>

      {/* Custom scrollbar divider */}
      <div className="hidden lg:flex flex-col items-center bg-cream py-12">
        <div className="w-[14px] grow bg-sage-deep/30 rounded-full relative overflow-hidden">
          {(() => {
            const count = filtered.length;
            const thumbPct = Math.max(8, 100 / count);
            const maxOffset = 100 - thumbPct;
            const thumbTop = activeIdx >= 0 && maxOffset > 0 ? thumbFraction * maxOffset : 0;
            return (
              <div
                className="absolute left-0 w-full bg-sage-deep rounded-full"
                style={{
                  height: `${thumbPct}%`,
                  top: `${thumbTop}%`,
                  transition: "top 200ms ease-out, height 300ms ease-out",
                }}
              />
            );
          })()}
        </div>
      </div>

      {/* Bottom/Right panel: team list — scrolls independently */}
      <div className="relative flex flex-col px-6 py-10 sm:px-10 lg:px-12 lg:py-10 lg:overflow-y-auto bg-cream">
        {/* Header */}
        <div className="mb-1">
          <h1 className="text-base">Meet the Gentle Workers.</h1>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-0 border-b border-rule pb-1 mb-2">
          <span className="text-sm text-muted mr-auto">People</span>
          {(["all", "present", "past"] as const).map((f, i) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`text-xs capitalize tracking-wide transition-colors ${
                filter === f
                  ? "text-ink"
                  : "text-muted hover:text-ink"
              } ${i > 0 ? "ml-1" : ""}`}
            >
              {i > 0 && <span className="text-muted mx-1" aria-hidden>·</span>}
              {f === "all" ? "All" : f === "present" ? "Present" : "Past"}
            </button>
          ))}
        </div>

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
                  className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-sage"
                  aria-expanded={isExpanded}
                >
                  <span className="display text-xl lg:text-2xl">
                    {member.displayName}
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={18} strokeWidth={1.5} className="shrink-0 text-muted" />
                  ) : (
                    <ChevronDown size={18} strokeWidth={1.5} className="shrink-0 text-muted" />
                  )}
                </button>

                {isExpanded && (
                  <div className="pb-6">
                    <p className="display italic text-base text-sage mb-4">
                      {member.role}
                    </p>
                    <div className="text-sm leading-relaxed text-ink space-y-4">
                      <PortableText value={member.description} />
                    </div>
                    {member.email && (
                      <p className="text-sm mt-4">
                        You can email them at{" "}
                        <a
                          href={`mailto:${member.email}`}
                          className="text-sage underline underline-offset-2 hover:text-sage-deep transition-colors"
                        >
                          {member.email}
                        </a>
                        .
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
