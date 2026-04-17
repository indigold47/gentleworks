"use client";

import { useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";

import type { SanityImage, GalleryImage } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type GalleryItem = {
  src: string;
  alt: string;
};

type ProjectGalleryProps = {
  heroImage: SanityImage;
  gallery: GalleryImage[] | null;
  /** Content rendered between the hero image and gallery grid (e.g. description, credits). */
  children?: ReactNode;
};

/* ------------------------------------------------------------------ */
/*  Lightbox                                                           */
/* ------------------------------------------------------------------ */

function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: GalleryItem[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const prev = useCallback(() => {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

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

  const current = images[index];

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
        {index + 1}/{images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={prev}
          className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-cream/60 transition-colors hover:text-cream"
          aria-label="Previous image"
        >
          <ChevronLeft size={28} strokeWidth={1.5} />
        </button>
      )}

      {/* Image */}
      <div className="relative h-[80vh] w-[90vw] max-w-6xl">
        <Image
          src={current.src}
          alt={current.alt}
          fill
          sizes="90vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
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
  onClick,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
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
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
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
/*  ProjectGallery                                                     */
/* ------------------------------------------------------------------ */

export function ProjectGallery({
  heroImage,
  gallery,
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

  // Flat list for lightbox: hero first, then gallery
  const allImages: GalleryItem[] = [
    {
      src: urlFor(heroImage).width(2400).quality(90).auto("format").url(),
      alt: heroImage.alt,
    },
    ...(gallery ?? []).map((img) => ({
      src: urlFor(img).width(2400).quality(90).auto("format").url(),
      alt: img.alt,
    })),
  ];

  return (
    <>
      {/* Hero image */}
      <section className="px-6 sm:px-10 lg:px-16">
        <GalleryCard
          src={urlFor(heroImage).width(2400).quality(85).auto("format").url()}
          alt={heroImage.alt}
          sizes="100vw"
          priority
          aspect="aspect-[16/9] w-full"
          onClick={() => openLightbox(0)}
        />
      </section>

      {/* Slot for description / credits between hero and gallery */}
      {children}

      {/* Gallery grid */}
      {gallery && gallery.length > 0 && (
        <section className="flex flex-col gap-6 px-6 pb-12 sm:px-10 lg:px-16 lg:pb-16">
          {Array.from(
            { length: Math.ceil(gallery.length / 2) },
            (_, rowIdx) => {
              const pair = gallery.slice(rowIdx * 2, rowIdx * 2 + 2);
              return (
                <div
                  key={rowIdx}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2"
                >
                  {pair.map((img, imgIdx) => {
                    const flatIdx = rowIdx * 2 + imgIdx + 1;
                    return (
                      <GalleryCard
                        key={img.asset._ref ?? imgIdx}
                        src={urlFor(img)
                          .width(1200)
                          .quality(85)
                          .auto("format")
                          .url()}
                        alt={img.alt}
                        sizes="(min-width: 640px) 50vw, 100vw"
                        aspect="aspect-[4/3]"
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
          images={allImages}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
