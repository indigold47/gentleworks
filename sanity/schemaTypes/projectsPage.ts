import { defineField, defineType } from "sanity";

/**
 * Projects Page — singleton document for the /projects index page settings.
 *
 * Currently only holds an optional color theme. More fields can be added later.
 */
export const projectsPage = defineType({
  name: "projectsPage",
  title: "Projects Page",
  type: "document",
  fields: [
    defineField({
      name: "theme",
      title: "Color Theme",
      type: "reference",
      to: [{ type: "theme" }],
      description:
        "Optional color theme — controls text and logo color on this page.",
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Projects Page",
    }),
  },
});
