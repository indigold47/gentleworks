"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "motion/react";
import * as amplitude from "@amplitude/analytics-browser";

import { urlFor } from "@/sanity/lib/image";
import type { HomeHeroVideo, HomeMediaItem } from "@/sanity/lib/fetch";

// Matches Tailwind's `md` breakpoint — anything below is treated as mobile.
const MOBILE_MEDIA_QUERY = "(max-width: 767px)";
const TRANSITION_MS = 500;

function videoSrcFor(item: HomeHeroVideo, isMobile: boolean) {
  return isMobile && item.mobileVideoUrl ? item.mobileVideoUrl : item.videoUrl;
}

function objectPositionFor(item: HomeHeroVideo, isMobile: boolean) {
  // Only apply the focal point when playing the desktop video on mobile —
  // a purpose-shot mobile video is assumed to already be framed correctly.
  if (!isMobile || item.mobileVideoUrl) return undefined;
  const x = item.mobileFocalPoint?.x ?? 50;
  const y = item.mobileFocalPoint?.y ?? 50;
  return `${x}% ${y}%`;
}

const FALLBACK_IMAGE_URL =
  "https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/3165763e-5418-49cd-a0a5-c652b5f4158c/KI_optimist+hall-7-web+copy.jpg";

type Props = {
  items: HomeMediaItem[];
};

type Outgoing = { item: HomeMediaItem; seq: number };

export function HomeVideoCarousel({ items }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<Outgoing | null>(null);
  const outgoingSeqRef = useRef(0);
  const currentIndexRef = useRef(0);
  const transitioning = useRef(false);
  const [cursorSide, setCursorSide] = useState<"left" | "right">("right");
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [showCursor, setShowCursor] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_MEDIA_QUERY);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const advance = useCallback(
    (delta: 1 | -1, trigger: "user" | "auto" = "auto") => {
      if (transitioning.current || items.length === 0) return;
      transitioning.current = true;
      const from = currentIndexRef.current;
      const to = (from + delta + items.length) % items.length;
      const fromItem = items[from];
      const toItem = items[to];
      outgoingSeqRef.current += 1;
      setOutgoing({ item: fromItem, seq: outgoingSeqRef.current });
      setCurrentIndex(to);
      amplitude.track("hero advanced", {
        trigger,
        direction: delta === 1 ? "next" : "prev",
        from_index: from,
        to_index: to,
        to_type: toItem?._type === "homeHeroVideo" ? "video" : "image",
      });
      setTimeout(() => {
        transitioning.current = false;
      }, TRANSITION_MS);
    },
    [items],
  );

  // Auto-advance for image items after 5 seconds
  useEffect(() => {
    const current = items[currentIndex];
    if (!current || current._type !== "homeHeroImage") return;
    const id = setTimeout(() => advance(1, "auto"), 5000);
    return () => clearTimeout(id);
  }, [currentIndex, items, advance]);

  if (items.length === 0) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${FALLBACK_IMAGE_URL}')` }}
      />
    );
  }

  const current = items[currentIndex];
  const nextIndex = (currentIndex + 1) % items.length;
  const next = items[nextIndex];
  const preloadNext =
    next && next !== current && next._type === "homeHeroVideo" ? next : null;

  const handleClick = (e: React.MouseEvent) => {
    advance(e.clientX / window.innerWidth >= 0.5 ? 1 : -1, "user");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
    setCursorSide(e.clientX / window.innerWidth >= 0.5 ? "right" : "left");
  };

  const renderItem = (item: HomeMediaItem, isOutgoing: boolean) => {
    if (item._type === "homeHeroVideo") {
      return (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          src={videoSrcFor(item, isMobile)}
          poster={item.posterUrl ?? undefined}
          aria-label={item.alt}
          autoPlay
          muted
          playsInline
          loop={false}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: objectPositionFor(item, isMobile) }}
          onEnded={isOutgoing ? undefined : () => advance(1, "auto")}
        />
      );
    }
    return (
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        role="img"
        aria-label={item.alt}
        style={{
          backgroundImage: `url('${urlFor(item.image).width(1920).quality(80).auto("format").url()}')`,
        }}
      />
    );
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden cursor-none"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowCursor(true)}
      onMouseLeave={() => setShowCursor(false)}
    >
      {/* Current — always fully opaque, bottom layer. Fresh mount per item
          so autoPlay restarts the video, but its bytes are cache-warm from
          the preload layer below. */}
      <div
        key={`current-${current._key}-${isMobile ? "m" : "d"}`}
        className="absolute inset-0"
        style={{ zIndex: 1 }}
      >
        {renderItem(current, false)}
      </div>

      {/* Outgoing — fades from 1 to 0 on top of the current, revealing it.
          Because the incoming is already fully opaque underneath, there is
          no moment where the page background bleeds through. */}
      {outgoing && (
        <motion.div
          key={`outgoing-${outgoing.seq}`}
          className="absolute inset-0"
          style={{ zIndex: 2 }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: TRANSITION_MS / 1000, ease: "easeInOut" }}
          onAnimationComplete={() =>
            setOutgoing((prev) => (prev?.seq === outgoing.seq ? null : prev))
          }
        >
          {renderItem(outgoing.item, true)}
        </motion.div>
      )}

      {preloadNext && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          key={`preload-${preloadNext._key}-${isMobile ? "m" : "d"}`}
          src={videoSrcFor(preloadNext, isMobile)}
          preload="auto"
          muted
          playsInline
          aria-hidden="true"
          tabIndex={-1}
          className="absolute w-0 h-0 opacity-0 pointer-events-none"
        />
      )}

      {/* Custom directional cursor — desktop only, hidden on touch */}
      {showCursor && (
        <div
          aria-hidden="true"
          className="hidden md:flex pointer-events-none fixed top-0 left-0 z-50 items-center justify-center text-white"
          style={{
            transform: `translate(calc(${cursorPos.x}px - 50%), calc(${cursorPos.y}px - 50%))`,
            width: 60,
            height: 60,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cursorSide === "left" ? "/assets/left-arrow.svg" : "/assets/right-arrow.svg"}
            alt=""
            className="w-[60px] h-auto brightness-0 invert"
          />
        </div>
      )}
    </div>
  );
}
