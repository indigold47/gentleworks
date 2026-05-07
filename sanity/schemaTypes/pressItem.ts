import { defineField, defineType } from "sanity";

/**
 * Press Item — an award or article featuring Gentle Works.
 *
 * Each entry has a name, description, year, type (award/article),
 * optional image, and an external link.
 */
export const pressItem = defineType({
  name: "pressItem",
  title: "Press Item",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Press Name",
      type: "string",
      description: "Title of the award or article.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "Brief description or excerpt shown alongside the title.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      description: "Year of publication or award.",
      validation: (rule) => rule.required().min(1900).max(2100),
    }),
    defineField({
      name: "pressType",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Award", value: "award" },
          { title: "Article", value: "article" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Optional image shown on the right panel when this item is active.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Describes the image for accessibility.",
        }),
      ],
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
      description: "External URL — opens in a new tab.",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first. Items without an order sort by year (newest first).",
    }),
  ],
  orderings: [
    {
      title: "Sort Order / Year",
      name: "orderYear",
      by: [
        { field: "order", direction: "asc" },
        { field: "year", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "pressType",
      year: "year",
      media: "image",
    },
    prepare({ title, subtitle, year, media }) {
      return {
        title: title ?? "Untitled",
        subtitle: `${subtitle === "award" ? "Award" : "Article"} — ${year ?? ""}`,
        media,
      };
    },
  },
});
