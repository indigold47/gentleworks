import { defineField, defineType } from "sanity";

/**
 * Project — the single editorial entity powering the portfolio.
 *
 * Field set matches the brief in CONTEXT.md: multiple images, rich description,
 * tags for filtering, plus the surrounding metadata needed for SEO and detail
 * pages (year, location, client, credits).
 */
export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(1).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (rule) => rule.integer().min(1900).max(2100),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. London, UK",
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description: "Project status shown in the index filter.",
      options: {
        list: [
          { title: "Built", value: "built" },
          { title: "In Design", value: "in-design" },
          { title: "Under Construction", value: "under-construction" },
          { title: "Unbuilt", value: "unbuilt" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "projectType",
      title: "Program Type",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Building program types shown in the index filter. Pick from the suggestions or type a custom value.",
      options: {
        list: [
          { title: "Mixed Use", value: "mixed-use" },
          { title: "Housing", value: "housing" },
          { title: "Commercial", value: "commercial" },
          { title: "Civic", value: "civic" },
          { title: "Workplace", value: "workplace" },
        ],
      },
    }),
    defineField({
      name: "projectTag",
      title: "Intervention Type",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Construction / intervention categories shown in the index filter. Pick from the suggestions or type a custom value.",
      options: {
        list: [
          { title: "New Build", value: "new-build" },
          { title: "Renovation", value: "renovation" },
          { title: "Adaptive Reuse", value: "adaptive-reuse" },
          { title: "Addition/Infill", value: "addition-infill" },
          { title: "Interiors", value: "interiors" },
        ],
      },
    }),
    defineField({
      name: "qualities",
      title: "Gentle Works Qualities",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Free-form qualities that describe this project (e.g. Light-Filled, Community-Oriented). Shown in the index filter.",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
      description: "Legacy tags — used for any additional categorisation.",
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      description:
        "Large lead image — used on the Projects split-screen and the OG card.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroVideo",
      title: "Hero video (optional)",
      type: "file",
      description:
        "Short looping video (mp4 or webm) shown instead of the hero image when provided. Keep under 10 MB for fast loading.",
      options: { accept: "video/mp4,video/webm" },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describes the video content for accessibility.",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "sitePlan",
      title: "Site Plan",
      type: "object",
      description:
        "Site plan image or video — always shown as the first gallery row (left side). Supports image or mp4/webm video.",
      fields: [
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          description: "Upload an image, or leave empty and provide a video instead.",
        }),
        defineField({
          name: "video",
          title: "Video",
          type: "file",
          options: { accept: "video/mp4,video/webm" },
          description: "Upload a video (mp4/webm). Takes priority over the image if both are provided.",
        }),
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "drawing",
      title: "Drawing",
      type: "object",
      description:
        "Architectural drawing image or video — always shown as the first gallery row (right side). Supports image or mp4/webm video.",
      fields: [
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          description: "Upload an image, or leave empty and provide a video instead.",
        }),
        defineField({
          name: "video",
          title: "Video",
          type: "file",
          options: { accept: "video/mp4,video/webm" },
          description: "Upload a video (mp4/webm). Takes priority over the image if both are provided.",
        }),
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
            defineField({
              name: "rowHeight",
              title: "Row Height",
              type: "string",
              description:
                "Controls the height of this image's row on desktop. Compact for detail shots, Standard for most views, Cinematic for dramatic interiors.",
              options: {
                list: [
                  { title: "Compact", value: "compact" },
                  { title: "Standard", value: "standard" },
                  { title: "Cinematic", value: "cinematic" },
                ],
                layout: "radio",
              },
              initialValue: "standard",
            }),
          ],
        },
        {
          type: "object",
          name: "galleryVideo",
          title: "Video",
          fields: [
            defineField({
              name: "video",
              title: "Video file",
              type: "file",
              options: { accept: "video/mp4,video/webm" },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
            defineField({
              name: "rowHeight",
              title: "Row Height",
              type: "string",
              description:
                "Controls the height of this video's row on desktop.",
              options: {
                list: [
                  { title: "Compact", value: "compact" },
                  { title: "Standard", value: "standard" },
                  { title: "Cinematic", value: "cinematic" },
                ],
                layout: "radio",
              },
              initialValue: "standard",
            }),
          ],
          preview: {
            select: { title: "alt" },
            prepare: ({ title }) => ({ title: title || "Video", subtitle: "Video" }),
          },
        },
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Rich text shown on the individual project page.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description:
        "One- or two-line summary used in listings, meta description, and OG.",
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "credits",
      title: "Credits",
      type: "object",
      fields: [
        defineField({ name: "architectDesigner", title: "Architect/Designer", type: "string" }),
        defineField({ name: "client", title: "Client", type: "string" }),
        defineField({ name: "photographer", title: "Photographer", type: "string" }),
        defineField({ name: "contractor", title: "Contractor", type: "string" }),
        defineField({ name: "mepEngineer", title: "MEP Engineer", type: "string" }),
        defineField({ name: "structuralEngineer", title: "Structural Engineer", type: "string" }),
        defineField({ name: "landscapeArchitect", title: "Landscape Architect", type: "string" }),
        defineField({ name: "constructionManager", title: "Construction Manager", type: "string" }),
        defineField({ name: "operator", title: "Operator", type: "string" }),
        defineField({ name: "muralist", title: "Muralist", type: "string" }),
        defineField({ name: "branding", title: "Branding", type: "string" }),
        defineField({ name: "otherSpecialists", title: "Other Specialists", type: "string" }),
        defineField({ name: "cinematographer", title: "Cinematographer", type: "string" }),
      ],
    }),
    defineField({
      name: "theme",
      title: "Theme",
      type: "reference",
      to: [{ type: "theme" }],
      description:
        "Color theme for the individual project page (text, logo, footer).",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Surface on the home page.",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description:
        "Optional manual sort. Lower numbers appear first; ties fall back to year desc.",
    }),
  ],
  orderings: [
    {
      title: "Year, newest first",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
    {
      title: "Manual order",
      name: "manualOrder",
      by: [
        { field: "order", direction: "asc" },
        { field: "year", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "year",
      media: "heroImage",
    },
  },
});
