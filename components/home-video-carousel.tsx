"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { urlFor } from "@/sanity/lib/image";
import type { HomeMediaItem } from "@/sanity/lib/fetch";

const FALLBACK_IMAGE_URL =
  "https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/3165763e-5418-49cd-a0a5-c652b5f4158c/KI_optimist+hall-7-web+copy.jpg";

type Props = {
  items: HomeMediaItem[];
};

export function HomeVideoCarousel({ items }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const transitioning = useRef(false);
  const [cursorSide, setCursorSide] = useState<"left" | "right">("right");
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [showCursor, setShowCursor] = useState(false);

  const advance = useCallback(
    (delta: 1 | -1) => {
      if (transitioning.current || items.length === 0) return;
      transitioning.current = true;
      setCurrentIndex((i) => (i + delta + items.length) % items.length);
      setTimeout(() => {
        transitioning.current = false;
      }, 400);
    },
    [items.length],
  );

  // Auto-advance for image items after 5 seconds
  useEffect(() => {
    const current = items[currentIndex];
    if (!current || current._type !== "homeHeroImage") return;
    const id = setTimeout(() => advance(1), 5000);
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

  const handleClick = (e: React.MouseEvent) => {
    advance(e.clientX / window.innerWidth >= 0.5 ? 1 : -1);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
    setCursorSide(e.clientX / window.innerWidth >= 0.5 ? "right" : "left");
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden cursor-none"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowCursor(true)}
      onMouseLeave={() => setShowCursor(false)}
    >
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {current._type === "homeHeroVideo" ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              key={current._key}
              src={current.videoUrl}
              aria-label={current.alt}
              autoPlay
              muted
              playsInline
              loop={false}
              className="absolute inset-0 w-full h-full object-cover"
              onEnded={() => advance(1)}
            />
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              role="img"
              aria-label={current.alt}
              style={{
                backgroundImage: `url('${urlFor(current.image).width(1920).quality(80).auto("format").url()}')`,
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Custom directional cursor — desktop only, hidden on touch */}
      {showCursor && (
        <div
          aria-hidden="true"
          className="hidden md:flex pointer-events-none fixed top-0 left-0 z-50 items-center justify-center text-white"
          style={{
            transform: `translate(calc(${cursorPos.x}px - 50%), calc(${cursorPos.y}px - 50%))`,
            width: 40,
            height: 40,
          }}
        >
          {cursorSide === "left" ? (
            <ArrowLeft size={24} strokeWidth={1.5} />
          ) : (
            <ArrowRight size={24} strokeWidth={1.5} />
          )}
        </div>
      )}
    </div>
  );
}
