import { cacheLife, cacheTag } from "next/cache";
import type { QueryParams } from "next-sanity";

import { client } from "./client";
import {
  aboutPageQuery,
  allFilterCategoriesQuery,
  allProjectsQuery,
  allProjectsDetailQuery,
  allProjectSlugsQuery,
  allTeamMembersQuery,
  contactPageQuery,
  projectBySlugQuery,
  siteSettingsQuery,
} from "./queries";

/**
 * Cached Sanity fetches.
 *
 * Every read is wrapped in `'use cache'` so:
 *   - build time prerender pulls from Sanity once per query
 *   - runtime requests hit Next's cache, not Sanity's CDN
 *   - a publish webhook calling updateTag('projects') invalidates everything
 *     that touched project data in a single call
 *
 * Per CLAUDE.md: never read cookies()/headers()/searchParams inside these —
 * pass any dynamic inputs in as arguments so they become part of the cache key.
 */

type FetchOptions<Q extends string> = {
  query: Q;
  params?: QueryParams;
  tags: string[];
};

async function sanityFetch<T, Q extends string>({
  query,
  params,
  tags,
}: FetchOptions<Q>): Promise<T> {
  "use cache";
  cacheLife("hours");
  for (const t of tags) cacheTag(t);
  return client.fetch<T>(query, params ?? {});
}

// Shared tags — the webhook invalidates these to refresh cached pages.
export const PROJECTS_TAG = "projects";
export const FILTERS_TAG = "filters";

export const TEAM_TAG = "team";
export const THEMES_TAG = "themes";
export const ABOUT_TAG = "about";
export const CONTACT_TAG = "contact";
export const SETTINGS_TAG = "settings";

export function projectTag(slug: string) {
  return `project:${slug}`;
}

export async function getAllProjects() {
  return sanityFetch<ProjectListItem[], typeof allProjectsQuery>({
    query: allProjectsQuery,
    tags: [PROJECTS_TAG],
  });
}

/** All projects with full detail — for the split-screen projects page. */
export async function getAllProjectsDetail() {
  return sanityFetch<ProjectDetail[], typeof allProjectsDetailQuery>({
    query: allProjectsDetailQuery,
    tags: [PROJECTS_TAG],
  });
}

export async function getProjectBySlug(slug: string) {
  return sanityFetch<ProjectDetail | null, typeof projectBySlugQuery>({
    query: projectBySlugQuery,
    params: { slug },
    tags: [PROJECTS_TAG, projectTag(slug)],
  });
}

export async function getAllProjectSlugs() {
  return sanityFetch<string[], typeof allProjectSlugsQuery>({
    query: allProjectSlugsQuery,
    tags: [PROJECTS_TAG],
  });
}

export async function getAllFilterCategories() {
  return sanityFetch<FilterCategoryItem[], typeof allFilterCategoriesQuery>({
    query: allFilterCategoriesQuery,
    tags: [FILTERS_TAG],
  });
}

export async function getAllTeamMembers() {
  return sanityFetch<TeamMemberItem[], typeof allTeamMembersQuery>({
    query: allTeamMembersQuery,
    tags: [TEAM_TAG],
  });
}

export async function getSiteSettings() {
  return sanityFetch<SiteSettingsData | null, typeof siteSettingsQuery>({
    query: siteSettingsQuery,
    tags: [SETTINGS_TAG],
  });
}

// ---------- Hand-written types ----------
// These are deliberately narrow and hand-written for now. When we wire up
// sanity-codegen the generated types will replace these; the call sites can
// stay the same.

export type FilterCategoryItem = {
  _id: string;
  label: string;
  key: string;
  projectField: string;
  singleSelect: boolean | null;
  options:
    | { label: string; value: string; useAsFilter: boolean | null }[]
    | null;
};

export type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  alt: string;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
};

export type ProjectStatus = "built" | "in-design" | "under-construction" | "unbuilt";

export type ProjectListItem = {
  _id: string;
  title: string;
  slug: string;
  year: number;
  location: string | null;
  summary: string;
  featured: boolean | null;
  status: ProjectStatus | null;
  projectType: string[] | null;
  projectTag: string[] | null;
  qualities: string[] | null;
  heroImage: SanityImage;
};

export type SanityVideo = {
  url: string;
  alt: string;
};

export type GalleryImage = SanityImage & {
  caption?: string;
};

export type GalleryVideo = {
  _type: "galleryVideo";
  _key: string;
  videoUrl: string;
  alt: string;
  caption?: string;
};

export type GalleryItem = GalleryImage | GalleryVideo;

export type GalleryRow = {
  _key: string;
  preset: string;
  media: GalleryItem[] | null;
};

export type PortableTextBlock = {
  _type: "block";
  _key: string;
  children: { _type: string; text?: string; [key: string]: unknown }[];
  markDefs?: unknown[];
  style?: string;
};

export type ProjectTheme = {
  name: string;
  mainColor: string;
  secondaryColor: string;
};

export type ProjectDetail = ProjectListItem & {
  client: string | null;
  description: PortableTextBlock[];
  heroVideo: SanityVideo | null;
  galleryRows: GalleryRow[] | null;
  credits: {
    architectDesigner?: string;
    client?: string;
    photographer?: string;
    contractor?: string;
    mepEngineer?: string;
    structuralEngineer?: string;
    landscapeArchitect?: string;
    constructionManager?: string;
    operator?: string;
    muralist?: string;
    branding?: string;
    otherSpecialists?: string;
    cinematographer?: string;
  } | null;
  theme: ProjectTheme | null;
};

export async function getAboutPage() {
  return sanityFetch<AboutPageData | null, typeof aboutPageQuery>({
    query: aboutPageQuery,
    tags: [ABOUT_TAG],
  });
}

export async function getContactPage() {
  return sanityFetch<ContactPageData | null, typeof contactPageQuery>({
    query: contactPageQuery,
    tags: [CONTACT_TAG],
  });
}

export type AboutPageData = {
  heroImage: SanityImage;
  body: PortableTextBlock[];
};

export type SiteSettingsData = {
  copyrightYear: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  phone: string | null;
  email: string | null;
  mapsUrl: string | null;
};

export type ContactPageData = {
  heroImage: SanityImage | null;
  addressLine1: string | null;
  addressLine2: string | null;
  email: string | null;
  introText: string | null;
};

export type TeamMemberItem = {
  _id: string;
  displayName: string;
  fullName: string;
  slug: string;
  role: string;
  description: PortableTextBlock[];
  email: string | null;
  status: "present" | "past";
  picture: SanityImage | null;
};
