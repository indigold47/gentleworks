"use client";

import { useState, useCallback, useRef, useEffect, useMemo, ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, LayoutGrid, AlignJustify, X } from "lucide-react";
import * as amplitude from "@amplitude/analytics-browser";

import type {
  FilterCategoryItem,
  ProjectDetail,
} from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { SiteNav } from "./projects-nav";

/* ------------------------------------------------------------------ */
/*  Filter definitions                                                 */
/* ------------------------------------------------------------------ */

type FilterCategory = {
  key: string;
  label: string;
  /** The project field this category reads from (e.g. "status", "projectType"). */
  projectField: string;
  singleSelect: boolean;
  options: { label: string; value: string }[];
};

/**
 * Build filter categories from CMS-managed filterCategory documents.
 *
 * Only options with `useAsFilter` enabled are included as filter chips.
 * Single-select categories (like Status) get an "All" option prepended.
 */
function buildFilterCategories(
  cmsCategories: FilterCategoryItem[],
): FilterCategory[] {
  return cmsCategories.map((cat) => {
    const filterable = (cat.options ?? [])
      .filter((o) => o.useAsFilter !== false && o.value);
    const options = filterable.map((o) => ({ label: o.label, value: o.value }));

    if (cat.singleSelect) {
      options.unshift({ label: "All", value: "all" });
    }

    return {
      key: cat.key,
      label: cat.label,
      projectField: cat.projectField,
      singleSelect: !!cat.singleSelect,
      options,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function parseFilters(
  searchParams: URLSearchParams,
  categories: FilterCategory[],
) {
  const active: Record<string, Set<string>> = {};
  for (const cat of categories) {
    const raw = searchParams.get(cat.key);
    active[cat.key] = raw ? new Set(raw.split(",")) : new Set<string>();
  }
  return active;
}

/** Normalize a field that may be old (single string) or new (string[]). */
function toArray(value: string[] | string | null | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/** Check if a project's array field has any overlap with the selected filter values. */
function matchesArrayFilter(
  projectValues: string[] | string | null,
  selected: Set<string>,
): boolean {
  if (selected.size === 0) return true;
  const arr = toArray(projectValues);
  if (arr.length === 0) return false;
  return arr.some((v) => selected.has(v));
}

function filterProjects(
  projects: ProjectDetail[],
  filters: Record<string, Set<string>>,
  categories: FilterCategory[],
) {
  return projects.filter((p) => {
    for (const cat of categories) {
      const selected = filters[cat.key];
      if (!selected || selected.size === 0) continue;

      // Single-select with "all" clears the filter
      if (cat.singleSelect && selected.has("all")) continue;

      const projectValue = (p as Record<string, unknown>)[cat.projectField];

      if (cat.singleSelect) {
        // Single-value field — exact match
        if (!projectValue || !selected.has(projectValue as string)) return false;
      } else {
        // Array field — match if any overlap
        if (!matchesArrayFilter(projectValue as string[] | string | null, selected))
          return false;
      }
    }
    return true;
  });
}

/* ------------------------------------------------------------------ */
/*  Text search                                                        */
/* ------------------------------------------------------------------ */

function searchProjects(projects: ProjectDetail[], query: string): ProjectDetail[] {
  const q = query.toLowerCase().trim();
  if (q.length < 3) return [];

  return projects.filter((p) => {
    // Searchable text fields
    const fields: (string | undefined | null)[] = [
      p.title,
      p.location,
      p.year?.toString(),
      p.status,
      ...toArray(p.projectType),
      ...toArray(p.projectTag),
      ...toArray(p.qualities),
      p.client,
      p.summary,
    ];

    // Credits fields
    if (p.credits) {
      fields.push(
        ...Object.entries(p.credits)
          .filter(([k]) => k !== "custom")
          .map(([, v]) => v)
          .filter((v): v is string => typeof v === "string"),
      );
      if (p.credits.custom) {
        fields.push(...p.credits.custom.map((c) => c.value));
      }
    }

    return fields.some((f) => f && f.toLowerCase().includes(q));
  });
}

/* ------------------------------------------------------------------ */
/*  Filter chip                                                        */
/* ------------------------------------------------------------------ */

function FilterChip({
  label,
  active,
  highlighted,
  onClick,
}: {
  label: string;
  active: boolean;
  /** True when the hovered project matches this filter value. */
  highlighted?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[13px] tracking-wide transition-colors ${
        active
          ? "border-[#7b6f47] bg-[#7b6f47] text-[#faf7f6]"
          : highlighted
            ? "border-[#c5bda8] bg-[#7b6f47]/30 text-[#7b6f47]"
            : "border-[#c5bda8] text-[#7b6f47] hover:bg-[#c5bda8]/40 hover:text-[#7b6f47]"
      }`}
    >
      {label}
      <span aria-hidden className="text-xs leading-none opacity-50">
        &times;
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  SplitScreen                                                        */
/* ------------------------------------------------------------------ */

type SplitScreenProps = {
  projects: ProjectDetail[];
  filterCategories: FilterCategoryItem[];
  themeColor?: string;
  secondaryColor?: string;
};

type MobileView = "list" | "grid";

export function SplitScreen({ projects, filterCategories: cmsCategories, themeColor, secondaryColor }: SplitScreenProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Build filter categories from CMS data
  const filterCategories = useMemo(
    () => buildFilterCategories(cmsCategories),
    [cmsCategories],
  );

  // Active filters from URL
  const activeFilters = parseFilters(searchParams, filterCategories);

  // Hovered project index — sticky: stays on last hovered project
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [stickyIdx, setStickyIdx] = useState<number | null>(null);

  // Wheel-activated project index
  const [wheelIdx, setWheelIdx] = useState(0);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  // Mobile view mode — grid (default) or list
  const [mobileView, setMobileView] = useState<MobileView>("grid");

  // Search
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResults = useMemo(
    () => searchProjects(projects, searchQuery),
    [projects, searchQuery],
  );

  useEffect(() => {
    if (searchOpen) {
      // Small delay so the overlay renders before focusing
      const t = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    } else {
      setSearchQuery("");
    }
  }, [searchOpen]);

  const filteredProjects = filterProjects(projects, activeFilters, filterCategories);

  // Featured projects fallback — shown when filters yield no results
  const featuredProjects = useMemo(
    () => projects.filter((p) => p.featured).slice(0, 3),
    [projects],
  );

  // Reset wheel index when project list changes
  useEffect(() => {
    setWheelIdx(0);
  }, [filteredProjects.length]);

  // Wheel-based project cycling — accumulates scroll delta for smooth, slow scrolling
  // Allows native scroll through when at boundaries (first/last project) so filters stay accessible.
  const wheelIdxRef = useRef(0);
  useEffect(() => { wheelIdxRef.current = wheelIdx; }, [wheelIdx]);

  useEffect(() => {
    let accumulator = 0;
    const THRESHOLD = 350; // pixels of scroll needed to advance one project

    function onWheel(e: WheelEvent) {
      if (window.innerWidth < 1024) return;

      // Always prevent native page scroll on desktop — filters are sticky so no need to scroll the page
      e.preventDefault();

      accumulator += e.deltaY;

      if (Math.abs(accumulator) >= THRESHOLD) {
        const steps = Math.trunc(accumulator / THRESHOLD);
        accumulator -= steps * THRESHOLD;
        setStickyIdx(null);
        setWheelIdx((prev) => {
          const next = prev + steps;
          return Math.max(0, Math.min(filteredProjects.length - 1, next));
        });
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [filteredProjects.length]);

  // Scroll the active row into view when wheel index changes
  useEffect(() => {
    const tbody = tableBodyRef.current;
    if (!tbody) return;
    const row = tbody.children[wheelIdx] as HTMLElement | undefined;
    row?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [wheelIdx]);

  // Mobile: highlight whichever row is nearest the top of the viewport
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    if (mq.matches) return;

    const tbody = tableBodyRef.current;
    if (!tbody) return;

    const rows = tbody.querySelectorAll<HTMLElement>("tr");
    if (rows.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; top: number } | null = null;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Array.from(rows).indexOf(entry.target as HTMLElement);
          const top = entry.boundingClientRect.top;
          if (best === null || top < best.top) {
            best = { idx, top };
          }
        });
        if (best) {
          setStickyIdx(null);
          setWheelIdx((best as { idx: number; top: number }).idx);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [filteredProjects]);

  // The image to display: hovered wins, then sticky (last hovered), then wheel, then first
  const safeWheelIdx = Math.min(wheelIdx, filteredProjects.length - 1);
  const activeIdx = hoveredIdx ?? stickyIdx ?? safeWheelIdx;
  const displayProject = filteredProjects[activeIdx] ?? filteredProjects[0];

  // Effective highlight index: live hover > sticky (last hovered) > wheel-active
  const effectiveHighlightIdx = hoveredIdx ?? stickyIdx ?? safeWheelIdx;

  // Compute which filter values the hovered project matches — used to highlight chips.
  const hoveredProject = effectiveHighlightIdx !== null ? filteredProjects[effectiveHighlightIdx] : null;
  const highlightedValues = useMemo(() => {
    if (!hoveredProject) return new Set<string>();
    const values = new Set<string>();
    for (const cat of filterCategories) {
      const field = (hoveredProject as Record<string, unknown>)[cat.projectField];
      for (const v of toArray(field as string[] | string | null)) {
        values.add(`${cat.key}:${v}`);
      }
    }
    return values;
  }, [hoveredProject, filterCategories]);

  // Crossfade: two always-mounted layers that alternate opacity
  const [layerA, setLayerA] = useState(displayProject);
  const [layerB, setLayerB] = useState<ProjectDetail | null>(null);
  const activeLayerRef = useRef<"a" | "b">("a");
  const [activeLayer, setActiveLayer] = useState<"a" | "b">("a");
  const prevDisplayId = useRef(displayProject?._id);

  // Only swap layers when the display project actually changes
  const displayId = displayProject?._id;
  useEffect(() => {
    if (!displayId || displayId === prevDisplayId.current) return;
    prevDisplayId.current = displayId;

    const current = activeLayerRef.current;
    if (current === "a") {
      setLayerB(displayProject);
      activeLayerRef.current = "b";
      setActiveLayer("b");
    } else {
      setLayerA(displayProject);
      activeLayerRef.current = "a";
      setActiveLayer("a");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayId]);

  // Scrollbar thumb position: driven by active project index (desktop)
  const thumbFraction =
    filteredProjects.length > 1 ? activeIdx / (filteredProjects.length - 1) : 0;

  // Mobile scroll-driven thumb position
  const [mobileThumbFraction, setMobileThumbFraction] = useState(0);
  const listPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = listPanelRef.current;
    if (!panel) return;
    if (window.innerWidth >= 1024) return;

    function onScroll() {
      if (!panel) return;
      const rect = panel.getBoundingClientRect();
      const viewportH = window.innerHeight;
      // How far the panel has scrolled through the viewport
      // 0 = panel top is at viewport bottom, 1 = panel bottom is at viewport top
      const totalTravel = rect.height + viewportH;
      const scrolled = viewportH - rect.top;
      const fraction = Math.max(0, Math.min(1, scrolled / totalTravel));
      setMobileThumbFraction(fraction);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [filteredProjects.length]);

  /* Toggle a filter value in the URL */
  const toggleFilter = useCallback(
    (categoryKey: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get(categoryKey);
      const set = current ? new Set(current.split(",")) : new Set<string>();
      const cat = filterCategories.find((c) => c.key === categoryKey);
      const isSingle = cat?.singleSelect ?? false;

      // "All" on a single-select category clears the filter
      if (isSingle && value === "all") {
        if (set.has("all")) {
          params.delete(categoryKey);
        } else {
          params.set(categoryKey, "all");
        }
        window.history.replaceState(null, "", `?${params.toString()}`);
        return;
      }

      // For single-select, remove "all" when selecting a specific value
      if (isSingle) {
        set.delete("all");
      }

      const wasActive = set.has(value);
      if (wasActive) {
        set.delete(value);
      } else {
        set.add(value);
      }

      if (set.size === 0) {
        params.delete(categoryKey);
      } else {
        params.set(categoryKey, [...set].join(","));
      }

      window.history.replaceState(null, "", `?${params.toString()}`);
      amplitude.track("project filter applied", {
        filter_category: categoryKey,
        filter_value: value,
        filter_action: wasActive ? "removed" : "applied",
      });
    },
    [searchParams, filterCategories],
  );

  if (projects.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-24">
        <p className="text-muted">No projects yet.</p>
      </div>
    );
  }

  const isGrid = mobileView === "grid";

  /* Shared mobile toolbar */
  // Toolbar colors: cream over dark image (list view) vs dark over textured bg (grid view)
  const tbActive = isGrid ? "text-default-green" : "text-cream";
  const tbIdle = isGrid ? "text-default-green/50 hover:text-default-green" : "text-cream/60 hover:text-cream";
  const tbGlassBg = isGrid ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.15)";
  const tbGlassBorder = isGrid ? "border-black/10" : "border-white/10";

  const mobileToolbar = (
    <div className="absolute top-[calc(1.5rem+env(safe-area-inset-top))] right-6 flex items-center gap-2 z-10 lg:hidden">
      <button
        type="button"
        aria-label="List view"
        onClick={() => setMobileView("list")}
        className={`flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md border ${tbGlassBorder} transition-colors ${!isGrid ? tbActive : tbIdle}`}
        style={{ background: tbGlassBg }}
      >
        <AlignJustify size={20} strokeWidth={1.8} />
      </button>
      <button
        type="button"
        aria-label="Grid view"
        onClick={() => setMobileView("grid")}
        className={`flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md border ${tbGlassBorder} transition-colors ${isGrid ? tbActive : tbIdle}`}
        style={{ background: tbGlassBg }}
      >
        <LayoutGrid size={20} strokeWidth={1.8} />
      </button>
      <button
        type="button"
        aria-label="Search projects"
        onClick={() => setSearchOpen(true)}
        className={`flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md border ${tbGlassBorder} transition-colors ${tbIdle}`}
        style={{ background: tbGlassBg }}
      >
        <Search size={20} strokeWidth={1.8} />
      </button>
    </div>
  );

  return (
    <>
      {/* ---- Search overlay ---- */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#7a7047]/85 backdrop-blur-sm lg:hidden">
          {/* Search header */}
          <div className="flex items-center gap-4 px-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-4 border-b border-cream/10">
            <Search size={20} strokeWidth={1.5} className="text-cream/40 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              aria-label="Search projects"
              className="flex-1 bg-transparent text-cream text-lg placeholder:text-cream/70 outline-none display"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
              className="text-cream/50 hover:text-cream transition-colors shrink-0"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {searchQuery.length > 0 && searchQuery.length < 3 && (
              <p className="text-cream/30 text-sm text-center pt-12">
                Type at least 3 characters...
              </p>
            )}

            {searchQuery.length >= 3 && searchResults.length === 0 && (
              <p className="text-cream/30 text-sm text-center pt-12">
                No projects found for &ldquo;{searchQuery}&rdquo;
              </p>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-6">
                <p className="text-cream/40 text-xs uppercase tracking-widest">
                  {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                </p>
                {searchResults.map((project) => (
                  <Link
                    key={project._id}
                    href={`/projects/${project.slug}`}
                    transitionTypes={["nav-forward"]}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-4 group"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden">
                      <Image
                        src={urlFor(project.heroImage)
                          .width(128)
                          .height(128)
                          .quality(70)
                          .auto("format")
                          .url()}
                        alt={project.heroImage.alt}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="display text-cream text-base leading-tight group-hover:text-cream/70 transition-colors truncate">
                        {project.title}
                      </h2>
                      <p className="text-cream/40 text-sm leading-snug truncate">
                        {[project.location, project.year].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {searchQuery.length === 0 && (
              <p className="text-cream/20 text-sm text-center pt-12 display italic">
                Search by name, location, year, or credits
              </p>
            )}
          </div>
        </div>
      )}

      {/* ---- Mobile grid view ---- */}
      {isGrid && (
        <div className="bg-textured lg:hidden min-h-svh">
          {/* Nav header — sticky so it stays visible while scrolling the grid */}
          <div className="bleed-safe-top bg-textured sticky top-0 z-20 relative h-[calc(33svh_+_var(--sat))] md:h-[calc(45svh_+_var(--sat))] flex flex-col justify-end pb-4">
            <SiteNav activeHref="/projects" variant="dark" themeColor={themeColor} secondaryColor={secondaryColor} />
            <div className="flex-1" />
            {mobileToolbar}
          </div>

          {/* Project grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 px-6 py-8 sm:px-10">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1.25, ease: "easeOut", delay: idx < 4 ? idx * 0.25 : 0 }}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  transitionTypes={["nav-forward"]}
                  className="group"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={urlFor(project.heroImage)
                        .width(600)
                        .quality(80)
                        .auto("format")
                        .url()}
                      alt={project.heroImage.alt}
                      fill
                      sizes="(min-width: 640px) 45vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <h2
                    className="display mt-2 text-base leading-tight"
                    style={{ color: themeColor ?? "#7B6F47" }}
                  >
                    {project.title}
                  </h2>
                  <p className="text-xs text-ink/50 leading-snug">
                    {project.location ?? "--"}
                  </p>
                  <p className="text-xs text-ink/50">
                    {project.year ?? "--"}
                  </p>
                </Link>
              </motion.div>
            ))}
            {filteredProjects.length === 0 && (
              <>
                <p className="col-span-2 py-8 text-center text-sm text-muted">
                  No projects match the selected filters.
                </p>
                {featuredProjects.length > 0 && (
                  <div className="col-span-2 mt-2 mb-4">
                    <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#7b7047" }}>Featured</p>
                    <hr className="border-rule" />
                  </div>
                )}
                {featuredProjects.length > 0 &&
                  featuredProjects.map((project, idx) => (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 1.25, ease: "easeOut", delay: idx * 0.25 }}
                    >
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <Image
                          src={urlFor(project.heroImage)
                            .width(600)
                            .quality(80)
                            .auto("format")
                            .url()}
                          alt={project.heroImage.alt}
                          fill
                          sizes="50vw"
                          className="object-cover transition-opacity duration-200 group-hover:opacity-80"
                        />
                      </div>
                      <h2
                        className="display mt-2 text-base leading-tight"
                        style={{ color: themeColor ?? "#7B6F47" }}
                      >
                        {project.title}
                      </h2>
                      <p className="text-xs text-ink/50">
                        {[project.location, project.year].filter(Boolean).join(" · ")}
                      </p>
                    </Link>
                    </motion.div>
                  ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* ---- Split-screen view (list on mobile, always on desktop) ---- */}
      <div className={`grid min-h-svh grid-cols-1 lg:grid-cols-[3fr_2fr] ${isGrid ? "hidden lg:grid" : ""}`}>
        {/* Left: hero image — changes on table row hover */}
        <div className="bleed-safe-top relative h-[calc(33svh_+_var(--sat))] md:h-[calc(45svh_+_var(--sat))] sticky top-0 z-10 overflow-hidden lg:h-[calc(100svh_+_var(--sat))]">
          {/* Layer A */}
          {layerA && (
            <div
              className="absolute inset-0 transition-opacity duration-[1200ms]"
              style={{
                opacity: activeLayer === "a" ? 1 : 0,
                transitionTimingFunction: "var(--ease)",
                zIndex: activeLayer === "a" ? 2 : 1,
              }}
            >
              <ViewTransition name={activeLayer === "a" && layerA.slug !== layerB?.slug ? `project-hero-${layerA.slug}` : undefined} share={activeLayer === "a" && layerA.slug !== layerB?.slug ? "hero-morph" : undefined}>
                <Image
                  src={urlFor(layerA.heroImage)
                    .width(3200)
                    .quality(90)
                    .auto("format")
                    .url()}
                  alt={layerA.heroImage.alt}
                  fill
                  sizes="(min-width: 1024px) 67vw, 100vw"
                  className="object-cover"
                  priority
                />
              </ViewTransition>
            </div>
          )}
          {/* Layer B */}
          {layerB && (
            <div
              className="absolute inset-0 transition-opacity duration-[1200ms]"
              style={{
                opacity: activeLayer === "b" ? 1 : 0,
                transitionTimingFunction: "var(--ease)",
                zIndex: activeLayer === "b" ? 2 : 1,
              }}
            >
              <ViewTransition name={activeLayer === "b" && layerB.slug !== layerA?.slug ? `project-hero-${layerB.slug}` : undefined} share={activeLayer === "b" && layerB.slug !== layerA?.slug ? "hero-morph" : undefined}>
                <Image
                  src={urlFor(layerB.heroImage)
                    .width(3200)
                    .quality(90)
                    .auto("format")
                    .url()}
                  alt={layerB.heroImage.alt}
                  fill
                  sizes="(min-width: 1024px) 67vw, 100vw"
                  className="object-cover"
                />
              </ViewTransition>
            </div>
          )}
          {/* Top gradient scrim for nav text contrast */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"
          />
          <SiteNav activeHref="/projects" themeColor={themeColor} secondaryColor={secondaryColor} />
          {mobileToolbar}
          {/* Inline wordmark logo — bottom-left, matching team page positioning */}
          <Link href="/" className="hidden lg:block absolute bottom-12 left-12 z-10">
            <img
              src="/assets/GentleWorks-Logo-InLine.svg"
              alt="Gentle Works"
              className="w-[350px] max-w-[60vw] h-auto"
            />
          </Link>
        </div>

        {/* Right: filters + project index table */}
        <div ref={listPanelRef} className="bg-textured relative flex flex-col px-6 py-8 sm:px-10 lg:px-12 lg:py-12 lg:h-svh lg:sticky lg:top-0">
          {/* Filter section — hidden on mobile, fixed on desktop */}
          <div className="mb-12 hidden lg:flex gap-6 lg:pr-20 lg:shrink-0">
            {/* Filters — takes remaining space */}
            <div className="min-w-0 flex-1">
              {/* "Filter" label with full-width rule */}
              <div className="border-b border-[#c5bda8] pb-2 mb-3">
                <p className="display italic text-sm text-ink/70">Filter</p>
              </div>

              <div className="space-y-3">
                {filterCategories.map((cat, catIdx) => (
                  <div
                    key={cat.key}
                    className={`flex flex-wrap gap-1.5 ${
                      catIdx < filterCategories.length - 1
                        ? "border-b border-[#d4cdb8] pb-3"
                        : ""
                    }`}
                  >
                    {cat.options.map((opt) => (
                      <FilterChip
                        key={opt.value}
                        label={opt.label}
                        active={activeFilters[cat.key].has(opt.value) || (opt.value === "all" && cat.singleSelect && activeFilters[cat.key].size === 0)}
                        highlighted={highlightedValues.has(`${cat.key}:${opt.value}`)}
                        onClick={() => toggleFilter(cat.key, opt.value)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Scrollable project list area — only this scrolls on desktop */}
          <div className="lg:flex-1 lg:overflow-y-auto lg:min-h-0">
          {/* Project index table */}
          <table className="w-full border-collapse text-default-green">
            <thead className="sticky top-[calc(33svh_+_var(--sat))] md:top-[calc(45svh_+_var(--sat))] lg:top-0 z-[5] bg-cream">
              <tr className="border-b border-default-green/30">
                <th className="pb-2 text-left text-[13px] font-normal opacity-60 w-[55%]">
                  Project
                </th>
                <th className="pb-2 text-left text-[13px] font-normal opacity-60">
                  Location
                </th>
                <th className="pb-2 text-right text-[13px] font-normal opacity-60">
                  Year
                </th>
              </tr>
            </thead>
            <tbody ref={tableBodyRef}>
              {filteredProjects.map((project, i) => (
                <tr
                  key={project._id}
                  className={`border-b border-[#d4cdb8] cursor-pointer transition-colors ${
                    effectiveHighlightIdx === i || (effectiveHighlightIdx === null && safeWheelIdx === i)
                      ? "bg-[#b5ad8e]/30"
                      : ""
                  }`}
                  onMouseEnter={() => { setHoveredIdx(i); setStickyIdx(i); }}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onFocus={() => { setHoveredIdx(i); setStickyIdx(i); }}
                  onBlur={() => setHoveredIdx(null)}
                  onClick={() => router.push(`/projects/${project.slug}`)}
                >
                  <td className="py-3.5 pr-4">
                    <Link
                      href={`/projects/${project.slug}`}
                      transitionTypes={["nav-forward"]}
                      className="display text-[22px] leading-[1.15]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {project.title}
                    </Link>
                  </td>
                  <td className="py-3.5 pr-4 text-sm opacity-70 align-middle">
                    {project.location ?? "--"}
                  </td>
                  <td className="py-3.5 text-right text-sm opacity-70 align-middle">
                    {project.year ?? "--"}
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-8 text-center text-sm text-muted"
                  >
                    No projects match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Featured projects fallback */}
          {filteredProjects.length === 0 && featuredProjects.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#7b7047" }}>Featured</p>
              <hr className="border-rule mb-6" />
            </div>
          )}
          {filteredProjects.length === 0 && featuredProjects.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project, idx) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 1.25, ease: "easeOut", delay: idx * 0.25 }}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={urlFor(project.heroImage)
                          .width(600)
                          .quality(80)
                          .auto("format")
                          .url()}
                        alt={project.heroImage.alt}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-opacity duration-200 group-hover:opacity-80"
                      />
                    </div>
                    <h2
                      className="display mt-2 text-base leading-tight"
                      style={{ color: themeColor ?? "#7B6F47" }}
                    >
                      {project.title}
                    </h2>
                    <p className="text-xs text-ink/50">
                      {[project.location, project.year].filter(Boolean).join(" · ")}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          </div>{/* end scrollable project list area */}
        </div>
      </div>

      {/* Custom scroll indicator — rendered outside the grid so sticky panel doesn't clip it */}
      {filteredProjects.length > 0 && (() => {
        const count = filteredProjects.length;
        const thumbPct = Math.max(5, 100 / count);
        const maxOffset = 100 - thumbPct;
        const desktopThumbTop = maxOffset > 0 ? thumbFraction * maxOffset : 0;

        return (
          <div
            role="scrollbar"
            aria-controls="project-table"
            aria-valuenow={activeIdx}
            aria-valuemin={0}
            aria-valuemax={count - 1}
            aria-orientation="vertical"
            className="hidden lg:block fixed left-[60%] top-1/2 w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-default-green/30 bg-cream z-30 overflow-hidden cursor-pointer"
            style={{ height: "min(750px, calc(100svh - 120px))" }}
            onMouseDown={(e) => {
              e.preventDefault();
              const track = e.currentTarget;
              const rect = track.getBoundingClientRect();

              const setFromY = (clientY: number) => {
                const fraction = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
                const idx = Math.round(fraction * (count - 1));
                setStickyIdx(null);
                setWheelIdx(idx);
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
                top: `${desktopThumbTop}%`,
                transition: "top 600ms cubic-bezier(0.16, 1, 0.3, 1), height 400ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>
        );
      })()}

      {/* Mobile bottom content fade */}
      <div
        aria-hidden="true"
        className="lg:hidden fixed bottom-0 left-0 right-0 h-16 pointer-events-none z-[5]"
        style={{ background: "linear-gradient(to top, #f5f1ea 20%, transparent 100%)" }}
      />
    </>
  );
}
