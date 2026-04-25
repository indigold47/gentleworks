import { defineField, defineType } from "sanity";
import {
  FilterCategoryStringInput,
  FilterCategoryArrayInput,
} from "../components/FilterCategoryInput";
import { GalleryRowPreview } from "../components/GalleryRowPreview";
import { PRESET_LIST, GALLERY_PRESETS } from "@/lib/gallery-presets";
import type { GalleryPresetId } from "@/lib/gallery-presets";

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
      description:
        "Project status. Options are managed in Filter Category.",
      options: { projectField: "status" } as never,
      components: { input: FilterCategoryStringInput },
    }),
    defineField({
      name: "projectType",
      title: "Program Type",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Building program types. Options are managed in Filter Category.",
      options: { projectField: "projectType" } as never,
      components: { input: FilterCategoryArrayInput },
    }),
    defineField({
      name: "projectTag",
      title: "Intervention Type",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Construction / intervention categories. Options are managed in Filter Category.",
      options: { projectField: "projectTag" } as never,
      components: { input: FilterCategoryArrayInput },
    }),
    defineField({
      name: "qualities",
      title: "Gentle Works Qualities",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Qualities that describe this project. Options are managed in Filter Category.",
      options: { projectField: "qualities" } as never,
      components: { input: FilterCategoryArrayInput },
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
      name: "galleryRows",
      title: "Gallery Rows",
      type: "array",
      description:
        "Build the gallery row by row. Pick a layout preset, then fill in the images/videos for that row.",
      of: [
        {
          type: "object",
          name: "galleryRow",
          title: "Gallery Row",
          fields: [
            defineField({
              name: "preset",
              title: "Layout Preset",
              type: "string",
              description: "Choose how images are arranged in this row.",
              options: {
                list: PRESET_LIST.map(({ value, title }) => ({
                  title,
                  value,
                })),
              },
              validation: (rule) => rule.required(),
              initialValue: "two-landscape",
            }),
            defineField({
              name: "media",
              title: "Media",
              type: "array",
              description:
                "Add images or videos for this row. The number of items must match the selected preset.",
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
                  ],
                  preview: {
                    select: { title: "alt" },
                    prepare: ({ title }) => ({
                      title: title || "Video",
                      subtitle: "Video",
                    }),
                  },
                },
              ],
              validation: (rule) =>
                rule.custom((media, context) => {
                  const parent = context.parent as
                    | { preset?: string }
                    | undefined;
                  if (!parent?.preset) return true;
                  const preset =
                    GALLERY_PRESETS[parent.preset as GalleryPresetId];
                  if (!preset) return true;
                  const count = Array.isArray(media) ? media.length : 0;
                  if (count !== preset.slots) {
                    return `This preset requires exactly ${preset.slots} media item${preset.slots === 1 ? "" : "s"}, but ${count} provided.`;
                  }
                  return true;
                }),
            }),
          ],
          preview: {
            select: { preset: "preset", media: "media" },
          },
          components: {
            preview: (props: Record<string, unknown>) =>
              GalleryRowPreview(props as { preset?: string; media?: unknown[] }),
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
