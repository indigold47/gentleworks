import { defineField, defineType } from "sanity";

/**
 * Press Page — singleton document for the /press page settings.
 *
 * Holds a theme reference for text/accent color.
 */
export const pressPage = defineType({
  name: "pressPage",
  title: "Press Page",
  type: "document",
  fields: [
    defineField({
      name: "theme",
      title: "Color Theme",
      type: "reference",
      to: [{ type: "theme" }],
      description:
        "Optional color theme — controls text and accent color on this page.",
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Press Page",
    }),
  },
});
