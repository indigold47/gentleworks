"use client";

import { useState, useCallback, useEffect, useRef, type ReactNode, ViewTransition } from "react";
import Image from "next/image";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";

import type {
  SanityImage,
  SanityVideo,
  GalleryItem as SanityGalleryItem,
  GalleryRow as SanityGalleryRow,
} from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { GALLERY_PRESETS } from "@/lib/gallery-presets";
import type { GalleryPresetId } from "@/lib/gallery-presets";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type LightboxMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; alt: string };

type ProjectGalleryProps = {
  heroImage: SanityImage;
  heroVideo?: SanityVideo | null;
  galleryRows: SanityGalleryRow[] | null;
  /** Project slug — used for shared-element view transition identity. */
  slug: string;
  /** Content rendered between the hero and gallery grid (e.g. description, credits). */
  children?: ReactNode;
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Convert a Sanity hotspot to a CSS object-position value. */
function hotspotToPosition(hotspot?: SanityImage["hotspot"]): string | undefined {
  if (!hotspot) return undefined;
  return `${(hotspot.x * 100).toFixed(1)}% ${(hotspot.y * 100).toFixed(1)}%`;
}

function isVideo(item: SanityGalleryItem): item is Extract<SanityGalleryItem, { _type: "galleryVideo" }> {
  return item._type === "galleryVideo";
}

/* ------------------------------------------------------------------ */
/*  Lightbox                                                           */
/* ------------------------------------------------------------------ */

function Lightbox({
  media,
  initialIndex,
  onClose,
}: {
  media: LightboxMedia[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [closing, setClosing] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pendingIndex = useRef<number | null>(null);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 800);
  }, [onClose]);

  const navigateTo = useCallback((nextIndex: number) => {
    if (transitioning) return;
    pendingIndex.current = nextIndex;
    setTransitioning(true);
    setTimeout(() => {
      setIndex(pendingIndex.current!);
      setTransitioning(false);
    }, 300);
  }, [transitioning]);

  const prev = useCallback(() => {
    navigateTo(index === 0 ? media.length - 1 : index - 1);
  }, [index, media.length, navigateTo]);

  const next = useCallback(() => {
    navigateTo(index === media.length - 1 ? 0 : index + 1);
  }, [index, media.length, navigateTo]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();

      // Focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose, prev, next]);

  // Focus close button on mount
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const current = media[index];

  return (
    <div
      ref={dialogRef}
      className={`fixed inset-0 z-50 flex items-center justify-center ${closing ? "animate-[fadeOut_800ms_var(--ease)_both]" : "animate-[fadeIn_600ms_var(--ease)_both]"}`}
      style={{ backgroundColor: "color-mix(in srgb, var(--theme-main) 95%, transparent 5%)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
    >
      {/* Close */}
      <button
        ref={closeRef}
        type="button"
        onClick={handleClose}
        className="absolute top-5 right-5 z-10 flex h-10 w-10 items-center justify-center text-cream/80 transition-colors hover:text-cream"
        aria-label="Close gallery"
      >
        <X size={24} strokeWidth={1.5} />
      </button>

      {/* Counter */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-sm tracking-wide text-cream/60">
        {index + 1}/{media.length}
      </div>

      {/* Prev */}
      {media.length > 1 && (
        <button
          type="button"
          onClick={prev}
          className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-cream/60 transition-colors hover:text-cream"
          aria-label="Previous image"
        >
          <ChevronLeft size={28} strokeWidth={1.5} />
        </button>
      )}

      {/* Media */}
      <div className={`relative h-[80vh] w-[90vw] max-w-6xl transition-opacity duration-300 ${closing ? "animate-[scaleOut_800ms_var(--ease)_both]" : "animate-[scaleIn_700ms_var(--ease)_100ms_both]"} ${transitioning ? "opacity-0" : "opacity-100"}`} style={{ transitionTimingFunction: "var(--ease)" }}>
        {current.type === "video" ? (
          <video
            key={current.src}
            src={current.src}
            className="h-full w-full object-contain"
            autoPlay
            loop
            muted
            playsInline
            aria-label={current.alt}
          />
        ) : (
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            sizes="90vw"
            className="object-contain"
            priority
          />
        )}
      </div>

      {/* Next */}
      {media.length > 1 && (
        <button
          type="button"
          onClick={next}
          className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-cream/60 transition-colors hover:text-cream"
          aria-label="Next image"
        >
          <ChevronRight size={28} strokeWidth={1.5} />
        </button>
      )}

      {/* Backdrop click */}
      <div className="absolute inset-0 -z-10" onClick={handleClose} aria-hidden />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Image card with plus icon                                          */
/* ------------------------------------------------------------------ */

function GalleryCard({
  src,
  alt,
  sizes,
  priority,
  aspect,
  objectPosition,
  objectFit = "cover",
  onClick,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  aspect: string;
  objectPosition?: string;
  objectFit?: "cover" | "contain";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden cursor-pointer w-full ${objectFit === "contain" ? "bg-white/60" : ""}`}
      style={{ aspectRatio: aspect }}
      aria-label={`View ${alt} fullscreen`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={objectFit === "contain" ? "object-contain p-2" : "object-cover"}
        style={objectPosition ? { objectPosition } : undefined}
        priority={priority}
      />
      {/* Plus icon — always visible, scales up on hover */}
      <span
        className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center text-cream/90 bg-ink/30 backdrop-blur-sm transition-transform duration-300 ease-out group-hover:scale-125 group-focus-visible:scale-125"
        aria-hidden="true"
      >
        <Plus size={20} strokeWidth={1.5} className="transition-transform duration-300 ease-out group-hover:rotate-90" />
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Video card — autoplay, loop, muted (gif-like)                      */
/* ------------------------------------------------------------------ */

function VideoCard({
  src,
  alt,
  aspect,
  onClick,
}: {
  src: string;
  alt: string;
  aspect: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative overflow-hidden cursor-pointer w-full"
      style={{ aspectRatio: aspect }}
      aria-label={`View ${alt} fullscreen`}
    >
      <video
        src={src}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      {/* Plus icon — always visible, scales up on hover */}
      <span
        className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center text-cream/90 bg-ink/30 backdrop-blur-sm transition-transform duration-300 ease-out group-hover:scale-125 group-focus-visible:scale-125"
        aria-hidden="true"
      >
        <Plus size={20} strokeWidth={1.5} className="transition-transform duration-300 ease-out group-hover:rotate-90" />
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  ProjectGallery                                                     */
/* ------------------------------------------------------------------ */

export function ProjectGallery({
  heroImage,
  heroVideo,
  galleryRows,
  slug,
  children,
}: ProjectGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openLightbox = useCallback((index: number) => {
    triggerRef.current = document.activeElement as HTMLElement;
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  // Flat list for lightbox: hero → all gallery row media
  const allMedia: LightboxMedia[] = [
    heroVideo?.url
      ? { type: "video", src: heroVideo.url, alt: heroVideo.alt }
      : {
          type: "image",
          src: urlFor(heroImage).width(2400).quality(90).auto("format").url(),
          alt: heroImage.alt,
        },
    ...(galleryRows ?? []).flatMap((row) =>
      (row.media ?? []).map((item): LightboxMedia =>
        isVideo(item)
          ? { type: "video", src: item.videoUrl, alt: item.alt }
          : {
              type: "image",
              src: urlFor(item).width(2400).quality(90).auto("format").url(),
              alt: item.alt,
            }
      )
    ),
  ];

  // Build a flat index offset for each row (hero is index 0, gallery starts at 1)
  const rowOffsets = (galleryRows ?? []).reduce<number[]>((acc, _row, i) => {
    const prev = i === 0 ? 1 : acc[i - 1] + ((galleryRows ?? [])[i - 1].media ?? []).length;
    acc.push(prev);
    return acc;
  }, []);

  return (
    <>
      {/* Hero — video takes priority when present */}
      <section className="px-6 sm:px-10 lg:px-16">
        <ViewTransition name={`project-hero-${slug}`} share="hero-morph">
          {heroVideo?.url ? (
            <VideoCard
              src={heroVideo.url}
              alt={heroVideo.alt}
              aspect="5/2"
              onClick={() => openLightbox(0)}
            />
          ) : (
            <GalleryCard
              src={urlFor(heroImage).width(2400).quality(85).auto("format").url()}
              alt={heroImage.alt}
              sizes="100vw"
              priority
              aspect="5/2"
              objectPosition={hotspotToPosition(heroImage.hotspot)}
              onClick={() => openLightbox(0)}
            />
          )}
        </ViewTransition>
      </section>

      {/* Slot for description / credits between hero and gallery */}
      {children}

      {/* Gallery rows — preset-driven layout */}
      {galleryRows && galleryRows.length > 0 && (
        <section className="flex flex-col gap-6 px-6 pt-6 pb-12 sm:px-10 lg:px-16 lg:pb-16">
          {galleryRows.map((row, rowIdx) => {
            const preset = GALLERY_PRESETS[row.preset as GalleryPresetId];
            if (!preset || !row.media?.length) return null;

            return (
              <div
                key={row._key ?? rowIdx}
                className="grid grid-cols-1 gap-6 sm:[grid-template-columns:var(--preset-cols)]"
                style={
                  { "--preset-cols": preset.cols } as React.CSSProperties
                }
              >
                  {row.media.map((item, slotIdx) => {
                    const flatIdx = rowOffsets[rowIdx] + slotIdx;
                    const aspect = preset.aspects[slotIdx] ?? "4/3";
                    const sizes = preset.sizes[slotIdx] ?? "100vw";

                    if (isVideo(item)) {
                      return (
                        <VideoCard
                          key={item._key ?? slotIdx}
                          src={item.videoUrl}
                          alt={item.alt}
                          aspect={aspect}
                          onClick={() => openLightbox(flatIdx)}
                        />
                      );
                    }
                    return (
                      <GalleryCard
                        key={item.asset?._ref ?? slotIdx}
                        src={urlFor(item)
                          .width(1200)
                          .quality(85)
                          .auto("format")
                          .url()}
                        alt={item.alt}
                        sizes={sizes}
                        aspect={aspect}
                        objectPosition={hotspotToPosition(item.hotspot)}
                        onClick={() => openLightbox(flatIdx)}
                      />
                    );
                  })}
              </div>
            );
          })}
        </section>
      )}

      {/* Lightbox modal */}
      {lightboxIndex !== null && (
        <Lightbox
          media={allMedia}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
