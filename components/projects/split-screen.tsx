"use client";

import { useState, useCallback, useRef, useEffect, useMemo, ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
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
        ...Object.values(p.credits).filter(
          (v): v is string => typeof v === "string",
        ),
      );
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
          ? "border-[#8a8160] bg-[#8a8160]/50 text-[#3d3926]"
          : highlighted
            ? "border-[#c5bda8] bg-[#7b6f47]/30 text-ink/80"
            : "border-[#c5bda8] text-ink/60 hover:bg-[#c5bda8]/40 hover:text-ink/80"
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
};

type MobileView = "list" | "grid";

export function SplitScreen({ projects, filterCategories: cmsCategories, themeColor }: SplitScreenProps) {
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

  // Mobile view mode — list (default) or grid
  const [mobileView, setMobileView] = useState<MobileView>("list");

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

  // Wheel-based project cycling — each scroll tick advances one project
  useEffect(() => {
    let lastWheelTime = 0;
    const THROTTLE_MS = 300;

    function onWheel(e: WheelEvent) {
      // Only hijack scroll on desktop split-screen
      if (window.innerWidth < 1024) return;

      const now = Date.now();
      if (now - lastWheelTime < THROTTLE_MS) {
        e.preventDefault();
        return;
      }

      const direction = e.deltaY > 0 ? 1 : -1;
      setWheelIdx((prev) => {
        const next = prev + direction;
        return Math.max(0, Math.min(filteredProjects.length - 1, next));
      });

      lastWheelTime = now;
      e.preventDefault();
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

  // The image to display: hovered wins, then sticky (last hovered), then wheel, then first
  const safeWheelIdx = Math.min(wheelIdx, filteredProjects.length - 1);
  const activeIdx = hoveredIdx ?? stickyIdx ?? safeWheelIdx;
  const displayProject = filteredProjects[activeIdx] ?? filteredProjects[0];

  // Compute which filter values the hovered project matches — used to highlight chips.
  const hoveredProject = hoveredIdx !== null ? filteredProjects[hoveredIdx] : null;
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

  // Scrollbar thumb position: driven by active project index
  const thumbFraction =
    filteredProjects.length > 1 ? activeIdx / (filteredProjects.length - 1) : 0;

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
  const mobileToolbar = (
    <div className="absolute top-6 right-6 flex items-center gap-4 z-10 lg:hidden">
      <button
        type="button"
        aria-label="List view"
        onClick={() => setMobileView("list")}
        className={`transition-colors ${!isGrid ? "text-cream" : "text-cream/60 hover:text-cream"}`}
      >
        <AlignJustify size={26} strokeWidth={1.5} />
      </button>
      <button
        type="button"
        aria-label="Grid view"
        onClick={() => setMobileView("grid")}
        className={`transition-colors ${isGrid ? "text-cream" : "text-cream/60 hover:text-cream"}`}
      >
        <LayoutGrid size={26} strokeWidth={1.5} />
      </button>
      <button
        type="button"
        aria-label="Search projects"
        onClick={() => setSearchOpen(true)}
        className="text-cream/60 hover:text-cream transition-colors"
      >
        <Search size={26} strokeWidth={1.5} />
      </button>
    </div>
  );

  return (
    <>
      {/* ---- Search overlay ---- */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink/95 backdrop-blur-sm lg:hidden">
          {/* Search header */}
          <div className="flex items-center gap-4 px-6 pt-6 pb-4 border-b border-cream/10">
            <Search size={20} strokeWidth={1.5} className="text-cream/40 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              aria-label="Search projects"
              className="flex-1 bg-transparent text-cream text-lg placeholder:text-cream/30 outline-none display"
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
                      <h3 className="display text-cream text-base leading-tight group-hover:text-cream/70 transition-colors truncate">
                        {project.title}
                      </h3>
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
        <div className="lg:hidden min-h-svh">
          {/* Nav header with dark background */}
          <div className="relative bg-ink px-6 pt-6 pb-8 sm:px-10">
            <SiteNav activeHref="/projects" className="relative z-10 flex flex-col gap-1" themeColor={themeColor} />
            {mobileToolbar}
          </div>

          {/* Project grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 px-6 py-8 sm:px-10">
            {filteredProjects.map((project) => (
              <Link
                key={project._id}
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
                <h3 className="display mt-2 text-base leading-tight">
                  {project.title}
                </h3>
                <p className="text-xs text-ink/50 leading-snug">
                  {project.location ?? "--"}
                </p>
                <p className="text-xs text-ink/50">
                  {project.year ?? "--"}
                </p>
              </Link>
            ))}
            {filteredProjects.length === 0 && (
              <>
                <p className="col-span-2 py-8 text-center text-sm text-muted">
                  No projects match the selected filters.
                  {featuredProjects.length > 0 &&
                    " Take a look at some of our featured projects:"}
                </p>
                {featuredProjects.length > 0 &&
                  featuredProjects.map((project) => (
                    <Link
                      key={project._id}
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
                      <h3 className="display mt-2 text-base leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-xs text-ink/50">
                        {[project.location, project.year].filter(Boolean).join(" · ")}
                      </p>
                    </Link>
                  ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* ---- Split-screen view (list on mobile, always on desktop) ---- */}
      <div className={`grid min-h-svh grid-cols-1 lg:grid-cols-[2fr_1fr] ${isGrid ? "hidden lg:grid" : ""}`}>
        {/* Left: hero image — changes on table row hover */}
        <div className="relative h-[50svh] sticky top-0 z-10 overflow-hidden lg:h-svh">
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
              <ViewTransition name={activeLayer === "a" ? `project-hero-${layerA.slug}` : undefined} share={activeLayer === "a" ? "hero-morph" : undefined}>
                <Image
                  src={urlFor(layerA.heroImage)
                    .width(1600)
                    .quality(85)
                    .auto("format")
                    .url()}
                  alt={layerA.heroImage.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
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
              <ViewTransition name={activeLayer === "b" ? `project-hero-${layerB.slug}` : undefined} share={activeLayer === "b" ? "hero-morph" : undefined}>
                <Image
                  src={urlFor(layerB.heroImage)
                    .width(1600)
                    .quality(85)
                    .auto("format")
                    .url()}
                  alt={layerB.heroImage.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
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
          <SiteNav activeHref="/projects" themeColor={themeColor} />
          {mobileToolbar}
          {/* Inline wordmark logo — bottom-left over the hero image */}
          <Link href="/" className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 lg:bottom-10 lg:left-10 z-10">
            <img
              src="/assets/GentleWorks-Logo-InLine.svg"
              alt="Gentle Works"
              className="h-4 w-auto lg:h-5"
            />
          </Link>
        </div>

        {/* Right: filters + project index table */}
        <div className="relative flex flex-col px-6 py-8 sm:px-10 lg:px-12 lg:py-12">
          {/* Filter section — hidden on mobile per design */}
          <div className="mb-12 hidden lg:flex gap-6 lg:pr-20">
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
                        active={activeFilters[cat.key].has(opt.value)}
                        highlighted={highlightedValues.has(`${cat.key}:${opt.value}`)}
                        onClick={() => toggleFilter(cat.key, opt.value)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Project index table */}
          <table className="w-full border-collapse text-default-green">
            <thead>
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
                    hoveredIdx === i || (hoveredIdx === null && safeWheelIdx === i)
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
                      className="display text-[20px] leading-[1.15]"
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
                    {featuredProjects.length > 0 && (
                      <>
                        <br />
                        Take a look at some of our featured projects:
                      </>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Featured projects fallback */}
          {filteredProjects.length === 0 && featuredProjects.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <Link
                  key={project._id}
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
                  <h3 className="display mt-2 text-base leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-xs text-ink/50">
                    {[project.location, project.year].filter(Boolean).join(" · ")}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {/* Custom scroll indicator — centered on the split seam, desktop only */}
          {filteredProjects.length > 0 && (() => {
            const count = filteredProjects.length;
            const thumbPct = Math.max(5, 100 / count);
            const maxOffset = 100 - thumbPct;
            const thumbTop = maxOffset > 0 ? thumbFraction * maxOffset : 0;

            return (
              <div
                role="scrollbar"
                aria-controls="project-table"
                aria-valuenow={activeIdx}
                aria-valuemin={0}
                aria-valuemax={count - 1}
                aria-orientation="vertical"
                className="hidden lg:block fixed left-[66.666%] top-1/2 w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-default-green/30 bg-cream z-10 overflow-hidden cursor-pointer"
                style={{ height: 750 }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  const track = e.currentTarget;
                  const rect = track.getBoundingClientRect();

                  const setFromY = (clientY: number) => {
                    const fraction = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
                    const idx = Math.round(fraction * (count - 1));
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
                    top: `${thumbTop}%`,
                    transition: "top 200ms ease-out, height 300ms ease-out",
                  }}
                />
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
}
