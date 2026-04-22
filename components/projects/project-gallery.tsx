"use client";

import { useState, useCallback, useEffect, useRef, type ReactNode, ViewTransition } from "react";
import Image from "next/image";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";

import type {
  SanityImage,
  SanityVideo,
  GalleryItem as SanityGalleryItem,
  ProjectMediaField,
  RowHeight,
} from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type LightboxMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; alt: string };

type ProjectGalleryProps = {
  heroImage: SanityImage;
  heroVideo?: SanityVideo | null;
  sitePlan?: ProjectMediaField | null;
  drawing?: ProjectMediaField | null;
  gallery: SanityGalleryItem[] | null;
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

/** Map CMS row-height choice to a desktop viewport-relative height. */
const ROW_HEIGHT_MAP: Record<RowHeight, string> = {
  compact: "sm:h-[20vw]",
  standard: "sm:h-[28vw]",
  cinematic: "sm:h-[38vw]",
};

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const prev = useCallback(() => {
    setIndex((i) => (i === 0 ? media.length - 1 : i - 1));
  }, [media.length]);

  const next = useCallback(() => {
    setIndex((i) => (i === media.length - 1 ? 0 : i + 1));
  }, [media.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
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
  }, [onClose, prev, next]);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95"
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
    >
      {/* Close */}
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
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
      <div className="relative h-[80vh] w-[90vw] max-w-6xl">
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
      <div className="absolute inset-0 -z-10" onClick={onClose} aria-hidden />
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
  onClick,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  aspect: string;
  objectPosition?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative ${aspect} overflow-hidden cursor-pointer w-full`}
      aria-label={`View ${alt} fullscreen`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        style={objectPosition ? { objectPosition } : undefined}
        priority={priority}
      />
      {/* Plus icon — visible on hover/focus */}
      <span
        className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center text-cream/90 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 bg-ink/30 backdrop-blur-sm"
        aria-hidden="true"
      >
        <Plus size={20} strokeWidth={1.5} />
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
      className={`group relative ${aspect} overflow-hidden cursor-pointer w-full`}
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
      {/* Plus icon — visible on hover/focus */}
      <span
        className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center text-cream/90 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 bg-ink/30 backdrop-blur-sm"
        aria-hidden="true"
      >
        <Plus size={20} strokeWidth={1.5} />
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  ProjectGallery                                                     */
/* ------------------------------------------------------------------ */

/** Convert a ProjectMediaField to a LightboxMedia entry. */
function mediaFieldToLightbox(field: ProjectMediaField): LightboxMedia {
  if (field.videoUrl) {
    return { type: "video", src: field.videoUrl, alt: field.alt };
  }
  return {
    type: "image",
    src: urlFor(field.image!).width(2400).quality(90).auto("format").url(),
    alt: field.alt,
  };
}

export function ProjectGallery({
  heroImage,
  heroVideo,
  sitePlan,
  drawing,
  gallery,
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
    // Return focus to the element that opened the lightbox
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  // Flat list for lightbox: hero → site plan → drawing → gallery
  const allMedia: LightboxMedia[] = [
    heroVideo?.url
      ? { type: "video", src: heroVideo.url, alt: heroVideo.alt }
      : {
          type: "image",
          src: urlFor(heroImage).width(2400).quality(90).auto("format").url(),
          alt: heroImage.alt,
        },
    ...(sitePlan ? [mediaFieldToLightbox(sitePlan)] : []),
    ...(drawing ? [mediaFieldToLightbox(drawing)] : []),
    ...(gallery ?? []).map((item): LightboxMedia =>
      isVideo(item)
        ? { type: "video", src: item.videoUrl, alt: item.alt }
        : {
            type: "image",
            src: urlFor(item).width(2400).quality(90).auto("format").url(),
            alt: item.alt,
          }
    ),
  ];

  // Lightbox index offsets: hero is 0, then sitePlan, then drawing, then gallery
  const sitePlanLightboxIdx = sitePlan ? 1 : -1;
  const drawingLightboxIdx = drawing ? (sitePlan ? 2 : 1) : -1;
  const galleryLightboxOffset = 1 + (sitePlan ? 1 : 0) + (drawing ? 1 : 0);

  return (
    <>
      {/* Hero — video takes priority when present */}
      <section className="px-6 sm:px-10 lg:px-16">
        <ViewTransition name={`project-hero-${slug}`} share="hero-morph">
          {heroVideo?.url ? (
            <VideoCard
              src={heroVideo.url}
              alt={heroVideo.alt}
              aspect="aspect-[16/9] w-full"
              onClick={() => openLightbox(0)}
            />
          ) : (
            <GalleryCard
              src={urlFor(heroImage).width(2400).quality(85).auto("format").url()}
              alt={heroImage.alt}
              sizes="100vw"
              priority
              aspect="aspect-[16/9] w-full"
              objectPosition={hotspotToPosition(heroImage.hotspot)}
              onClick={() => openLightbox(0)}
            />
          )}
        </ViewTransition>
      </section>

      {/* Slot for description / credits between hero and gallery */}
      {children}

      {/* Site Plan + Drawing — fixed first row */}
      {(sitePlan || drawing) && (
        <section className="px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:h-[28vw]">
            {/* Left: Site Plan */}
            {sitePlan ? (
              sitePlan.videoUrl ? (
                <VideoCard
                  src={sitePlan.videoUrl}
                  alt={sitePlan.alt}
                  aspect="aspect-[4/3] sm:aspect-auto sm:h-full"
                  onClick={() => openLightbox(sitePlanLightboxIdx)}
                />
              ) : sitePlan.image ? (
                <GalleryCard
                  src={urlFor(sitePlan.image).width(1200).quality(85).auto("format").url()}
                  alt={sitePlan.alt}
                  sizes="(min-width: 640px) 50vw, 100vw"
                  aspect="aspect-[4/3] sm:aspect-auto sm:h-full"
                  objectPosition={hotspotToPosition(sitePlan.image.hotspot)}
                  onClick={() => openLightbox(sitePlanLightboxIdx)}
                />
              ) : null
            ) : (
              <div className="aspect-[4/3] sm:aspect-auto sm:h-full" />
            )}
            {/* Right: Drawing */}
            {drawing ? (
              drawing.videoUrl ? (
                <VideoCard
                  src={drawing.videoUrl}
                  alt={drawing.alt}
                  aspect="aspect-[4/3] sm:aspect-auto sm:h-full"
                  onClick={() => openLightbox(drawingLightboxIdx)}
                />
              ) : drawing.image ? (
                <GalleryCard
                  src={urlFor(drawing.image).width(1200).quality(85).auto("format").url()}
                  alt={drawing.alt}
                  sizes="(min-width: 640px) 50vw, 100vw"
                  aspect="aspect-[4/3] sm:aspect-auto sm:h-full"
                  objectPosition={hotspotToPosition(drawing.image.hotspot)}
                  onClick={() => openLightbox(drawingLightboxIdx)}
                />
              ) : null
            ) : (
              <div className="aspect-[4/3] sm:aspect-auto sm:h-full" />
            )}
          </div>
        </section>
      )}

      {/* Gallery grid */}
      {gallery && gallery.length > 0 && (
        <section className="flex flex-col gap-6 px-6 pb-12 sm:px-10 lg:px-16 lg:pb-16">
          {Array.from(
            { length: Math.ceil(gallery.length / 2) },
            (_, rowIdx) => {
              const pair = gallery.slice(rowIdx * 2, rowIdx * 2 + 2);
              const rowHeight: RowHeight = pair[0].rowHeight ?? "standard";
              const heightClass = ROW_HEIGHT_MAP[rowHeight];
              return (
                <div
                  key={rowIdx}
                  className={`grid grid-cols-1 gap-6 ${
                    pair.length === 2
                      ? rowIdx % 2 === 0
                        ? `sm:grid-cols-[3fr_2fr] ${heightClass}`
                        : `sm:grid-cols-[2fr_3fr] ${heightClass}`
                      : ""
                  }`}
                >
                  {pair.map((item, imgIdx) => {
                    const flatIdx = rowIdx * 2 + imgIdx + galleryLightboxOffset;
                    if (isVideo(item)) {
                      return (
                        <VideoCard
                          key={item._key ?? imgIdx}
                          src={item.videoUrl}
                          alt={item.alt}
                          aspect="aspect-[4/3] sm:aspect-auto sm:h-full"
                          onClick={() => openLightbox(flatIdx)}
                        />
                      );
                    }
                    return (
                      <GalleryCard
                        key={item.asset._ref ?? imgIdx}
                        src={urlFor(item)
                          .width(1200)
                          .quality(85)
                          .auto("format")
                          .url()}
                        alt={item.alt}
                        sizes="(min-width: 640px) 50vw, 100vw"
                        aspect="aspect-[4/3] sm:aspect-auto sm:h-full"
                        objectPosition={hotspotToPosition(item.hotspot)}
                        onClick={() => openLightbox(flatIdx)}
                      />
                    );
                  })}
                </div>
              );
            },
          )}
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
