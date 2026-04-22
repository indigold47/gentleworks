import { cacheLife, cacheTag } from "next/cache";
import type { QueryParams } from "next-sanity";

import { client } from "./client";
import {
  allProjectsQuery,
  allProjectsDetailQuery,
  allProjectSlugsQuery,
  allTagsQuery,
  allTeamMembersQuery,
  projectBySlugQuery,
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
export const TAGS_TAG = "tags";
export const TEAM_TAG = "team";
export const THEMES_TAG = "themes";

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

export async function getAllTags() {
  return sanityFetch<TagItem[], typeof allTagsQuery>({
    query: allTagsQuery,
    tags: [TAGS_TAG],
  });
}

export async function getAllTeamMembers() {
  return sanityFetch<TeamMemberItem[], typeof allTeamMembersQuery>({
    query: allTeamMembersQuery,
    tags: [TEAM_TAG],
  });
}

// ---------- Hand-written types ----------
// These are deliberately narrow and hand-written for now. When we wire up
// sanity-codegen the generated types will replace these; the call sites can
// stay the same.

export type TagItem = {
  _id: string;
  label: string;
  slug: string;
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
  tags: TagItem[];
};

export type RowHeight = "compact" | "standard" | "cinematic";

export type SanityVideo = {
  url: string;
  alt: string;
};

export type GalleryImage = SanityImage & {
  caption?: string;
  rowHeight?: RowHeight;
};

export type GalleryVideo = {
  _type: "galleryVideo";
  _key: string;
  videoUrl: string;
  alt: string;
  caption?: string;
  rowHeight?: RowHeight;
};

export type GalleryItem = GalleryImage | GalleryVideo;

type PortableTextBlock = {
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

export type ProjectMediaField = {
  image: SanityImage | null;
  videoUrl: string | null;
  alt: string;
};

export type ProjectDetail = ProjectListItem & {
  client: string | null;
  description: PortableTextBlock[];
  heroVideo: SanityVideo | null;
  sitePlan: ProjectMediaField | null;
  drawing: ProjectMediaField | null;
  gallery: GalleryItem[] | null;
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
