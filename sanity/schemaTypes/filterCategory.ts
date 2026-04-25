import { defineField, defineType } from "sanity";

/**
 * Filter Category — defines a filterable dimension on the Projects index.
 *
 * Each document represents one filter group (e.g. "Status", "Program Type").
 * The `projectField` tells the frontend which project field to read values
 * from, and `options` lists the known values with a `useAsFilter` toggle
 * controlling whether each one appears as a filter chip on the index page.
 *
 * Options that have `useAsFilter` unchecked still appear on individual
 * project detail pages — they just aren't exposed as index-level filters.
 */
export const filterCategory = defineType({
  name: "filterCategory",
  title: "Filter Category",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description:
        'Display name shown above the filter chips (e.g. "Program Type").',
      validation: (rule) => rule.required().min(1).max(60),
    }),
    defineField({
      name: "key",
      title: "URL Key",
      type: "slug",
      description:
        'Short key used in the URL query string (e.g. "type" produces ?type=housing). Must be unique across categories.',
      options: { source: "label", maxLength: 30 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "projectField",
      title: "Project Field",
      type: "string",
      description:
        'Which field on the Project document this category reads from. Must match a field name exactly (e.g. "status", "projectType").',
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: "Status", value: "status" },
          { title: "Program Type (projectType)", value: "projectType" },
          { title: "Intervention Type (projectTag)", value: "projectTag" },
          { title: "Qualities", value: "qualities" },
        ],
      },
    }),
    defineField({
      name: "singleSelect",
      title: "Single-select filter",
      type: "boolean",
      description:
        'Enable for fields like Status where only one value applies per project. Adds an "All" option automatically.',
      initialValue: false,
    }),
    defineField({
      name: "options",
      title: "Options",
      type: "array",
      of: [
        {
          type: "object",
          name: "filterOption",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "Display text for this option.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              description:
                'The value stored on projects (e.g. "mixed-use"). Must match exactly what projects use.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "useAsFilter",
              title: "Use as filter",
              type: "boolean",
              description:
                "When checked, this option appears as a filter chip on the Projects index. Unchecked options still appear on individual project pages.",
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              title: "label",
              useAsFilter: "useAsFilter",
            },
            prepare: ({ title, useAsFilter }) => ({
              title: title || "Untitled option",
              subtitle: useAsFilter === false ? "Hidden from filters" : "Shown in filters",
            }),
          },
        },
      ],
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description:
        "Display order on the index page. Lower numbers appear first.",
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "projectField",
    },
  },
});
