"use client";

import { useState, useCallback, useRef, useEffect, useMemo, ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, LayoutGrid, AlignJustify, X } from "lucide-react";

import type {
  ProjectDetail,
  TagItem,
} from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { Logo } from "@/components/logo";
import { SiteNav } from "./projects-nav";

/* ------------------------------------------------------------------ */
/*  Filter definitions                                                 */
/* ------------------------------------------------------------------ */

type FilterCategory = {
  key: string;
  label: string;
  options: { label: string; value: string }[];
};

/** Prettify a slug-style value into a label: "mixed-use" → "Mixed Use" */
function slugToLabel(value: string): string {
  return value
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Collect unique values from an array field across all projects.
 *  Handles both old (single string) and new (string[]) data formats. */
function collectOptions(
  projects: ProjectDetail[],
  field: "projectType" | "projectTag" | "qualities",
): { label: string; value: string }[] {
  const seen = new Set<string>();
  for (const p of projects) {
    const raw = p[field];
    if (!raw) continue;
    // Old data may still be a single string; new data is string[]
    const values = Array.isArray(raw) ? raw : [raw as unknown as string];
    for (const v of values) seen.add(v);
  }
  return [...seen]
    .sort((a, b) => a.localeCompare(b))
    .map((v) => ({ label: slugToLabel(v), value: v }));
}

/** Build filter categories dynamically from project data. */
function buildFilterCategories(projects: ProjectDetail[]): FilterCategory[] {
  return [
    {
      key: "status",
      label: "Status",
      options: [
        { label: "All", value: "all" },
        { label: "Built", value: "built" },
        { label: "In Design", value: "in-design" },
        { label: "Under Construction", value: "under-construction" },
        { label: "Unbuilt", value: "unbuilt" },
      ],
    },
    {
      key: "type",
      label: "Program Type",
      options: collectOptions(projects, "projectType"),
    },
    {
      key: "tag",
      label: "Intervention Type",
      options: collectOptions(projects, "projectTag"),
    },
    {
      key: "qualities",
      label: "Gentle Works Qualities",
      options: collectOptions(projects, "qualities"),
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const FILTER_KEYS = ["status", "type", "tag", "qualities"];

function parseFilters(searchParams: URLSearchParams) {
  const active: Record<string, Set<string>> = {};
  for (const key of FILTER_KEYS) {
    const raw = searchParams.get(key);
    active[key] = raw ? new Set(raw.split(",")) : new Set<string>();
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
) {
  return projects.filter((p) => {
    // Status filter (single value, "all" clears)
    const statusSet = filters.status;
    if (statusSet.size > 0 && !statusSet.has("all")) {
      if (!p.status || !statusSet.has(p.status)) return false;
    }

    // Program Type filter (array — match if any overlap)
    if (!matchesArrayFilter(p.projectType, filters.type)) return false;

    // Intervention Type filter (array — match if any overlap)
    if (!matchesArrayFilter(p.projectTag, filters.tag)) return false;

    // Qualities filter (array — match if any overlap)
    if (!matchesArrayFilter(p.qualities, filters.qualities)) return false;

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
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2.5 border px-3.5 py-1.5 text-[15px] tracking-wide transition-colors ${
        active
          ? "border-[#8a8160] bg-[#8a8160]/50 text-[#3d3926]"
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
  tags: TagItem[];
};

type MobileView = "list" | "grid";

export function SplitScreen({ projects }: SplitScreenProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Build filter categories dynamically from all project data
  const filterCategories = useMemo(() => buildFilterCategories(projects), [projects]);

  // Active filters from URL
  const activeFilters = parseFilters(searchParams);

  // Hovered project index — default to first project
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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

  const filteredProjects = filterProjects(projects, activeFilters);

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

  // The image to display: hovered project wins, then wheel-active, then first
  const safeWheelIdx = Math.min(wheelIdx, filteredProjects.length - 1);
  const activeIdx = hoveredIdx ?? safeWheelIdx;
  const displayProject = filteredProjects[activeIdx] ?? filteredProjects[0];

  // Scrollbar thumb position: driven by active project index
  const thumbFraction =
    filteredProjects.length > 1 ? activeIdx / (filteredProjects.length - 1) : 0;

  /* Toggle a filter value in the URL */
  const toggleFilter = useCallback(
    (categoryKey: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get(categoryKey);
      const set = current ? new Set(current.split(",")) : new Set<string>();

      // "All" in status is special — it clears the status filter
      if (categoryKey === "status" && value === "all") {
        if (set.has("all")) {
          params.delete(categoryKey);
        } else {
          params.set(categoryKey, "all");
        }
        router.replace(`?${params.toString()}`, { scroll: false });
        return;
      }

      // For status, remove "all" when selecting a specific value
      if (categoryKey === "status") {
        set.delete("all");
      }

      if (set.has(value)) {
        set.delete(value);
      } else {
        set.add(value);
      }

      if (set.size === 0) {
        params.delete(categoryKey);
      } else {
        params.set(categoryKey, [...set].join(","));
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
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
            <SiteNav activeHref="/projects" className="relative z-10 flex flex-col gap-1" />
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
      <div className={`grid min-h-svh grid-cols-1 lg:grid-cols-2 ${isGrid ? "hidden lg:grid" : ""}`}>
        {/* Left: hero image — changes on table row hover */}
        <div className="relative h-[50svh] sticky top-0 lg:h-svh">
          {displayProject && (
            <ViewTransition name={`project-hero-${displayProject.slug}`} share="hero-morph">
              <Image
                src={urlFor(displayProject.heroImage)
                  .width(1600)
                  .quality(85)
                  .auto("format")
                  .url()}
                alt={displayProject.heroImage.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-opacity duration-300"
                priority
              />
            </ViewTransition>
          )}
          {/* Top gradient scrim for nav text contrast */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"
          />
          <SiteNav activeHref="/projects" />
          {mobileToolbar}
          {/* Inline wordmark logo — bottom-left over the hero image */}
          <img
            src="/assets/GentleWorks-Logo-InLine.svg"
            alt="Gentle Works"
            className="absolute bottom-6 left-6 h-4 w-auto sm:bottom-8 sm:left-8 lg:bottom-10 lg:left-10 lg:h-5 pointer-events-none"
          />
        </div>

        {/* Right: filters + project index table */}
        <div className="flex flex-col px-6 py-8 sm:px-10 lg:px-12 lg:py-12">
          {/* Filter section — hidden on mobile per design */}
          <div className="mb-12 hidden lg:flex gap-6">
            {/* Filters — takes remaining space */}
            <div className="min-w-0 flex-1">
              {/* "Filter" label with full-width rule */}
              <div className="border-b border-[#c5bda8] pb-2 mb-4">
                <p className="display italic text-base text-ink/70">Filter</p>
              </div>

              <div className="space-y-4">
                {filterCategories.map((cat, catIdx) => (
                  <div
                    key={cat.key}
                    className={`flex flex-wrap gap-2 ${
                      catIdx < filterCategories.length - 1
                        ? "border-b border-[#d4cdb8] pb-4"
                        : ""
                    }`}
                  >
                    {cat.options.map((opt) => (
                      <FilterChip
                        key={opt.value}
                        label={opt.label}
                        active={activeFilters[cat.key].has(opt.value)}
                        onClick={() => toggleFilter(cat.key, opt.value)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Logo — own column, vertically centered with the first rule */}
            <div className="flex shrink-0 items-start pt-1">
              <Logo className="h-[67px] w-[67px]" />
            </div>
          </div>

          {/* Project index table */}
          <table className="w-full border-collapse text-default-green">
            <thead>
              <tr className="border-b border-default-green/30">
                <th className="pb-2 text-left text-[13px] font-normal italic opacity-60 w-[55%]">
                  Project
                </th>
                <th className="pb-2 text-left text-[13px] font-normal italic opacity-60">
                  Location
                </th>
                <th className="pb-2 text-right text-[13px] font-normal italic opacity-60">
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
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onFocus={() => setHoveredIdx(i)}
                  onBlur={() => setHoveredIdx(null)}
                  onClick={() => router.push(`/projects/${project.slug}`)}
                >
                  <td className="py-3.5 pr-4">
                    <Link
                      href={`/projects/${project.slug}`}
                      transitionTypes={["nav-forward"]}
                      className="display text-[clamp(1.15rem,2.5vw,1.5rem)] leading-[1.15]"
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
                aria-hidden
                className="hidden lg:block fixed left-1/2 top-1/2 w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-default-green/30 bg-cream z-10 overflow-hidden"
                style={{ height: 750 }}
              >
                <div
                  className="absolute left-0 w-full rounded-full bg-default-green"
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
