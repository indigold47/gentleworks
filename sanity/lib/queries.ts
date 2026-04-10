import { defineQuery } from "next-sanity";

/**
 * GROQ queries.
 *
 * Written with defineQuery so sanity-codegen can generate TS types from them
 * when we wire that up. Keep projections shallow and explicit — typing a
 * `...` spread means codegen has to guess.
 */

export const allProjectsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(coalesce(order, 9999) asc, year desc) {
    _id,
    title,
    "slug": slug.current,
    year,
    location,
    summary,
    featured,
    heroImage {
      ...,
      "alt": coalesce(alt, "")
    },
    "tags": tags[]->{
      _id,
      label,
      "slug": slug.current
    }
  }
`);

export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    year,
    location,
    client,
    summary,
    description,
    featured,
    heroImage {
      ...,
      "alt": coalesce(alt, "")
    },
    gallery[] {
      ...,
      "alt": coalesce(alt, "")
    },
    credits,
    "tags": tags[]->{
      _id,
      label,
      "slug": slug.current
    }
  }
`);

/** Full-detail query for the split-screen projects page. */
export const allProjectsDetailQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(coalesce(order, 9999) asc, year desc) {
    _id,
    title,
    "slug": slug.current,
    year,
    location,
    client,
    summary,
    description,
    featured,
    heroImage {
      ...,
      "alt": coalesce(alt, "")
    },
    gallery[] {
      ...,
      "alt": coalesce(alt, "")
    },
    credits,
    "tags": tags[]->{
      _id,
      label,
      "slug": slug.current
    }
  }
`);

export const allProjectSlugsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)].slug.current
`);

export const allTagsQuery = defineQuery(`
  *[_type == "tag"] | order(coalesce(order, 9999) asc, label asc) {
    _id,
    label,
    "slug": slug.current
  }
`);
