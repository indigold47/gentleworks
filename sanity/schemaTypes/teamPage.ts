import { defineField, defineType } from "sanity";

/**
 * Team Page — singleton document for the /team page settings.
 *
 * Currently only holds an optional color theme. More fields can be added later.
 */
export const teamPage = defineType({
  name: "teamPage",
  title: "Team Page",
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
    defineField({
      name: "teamGif",
      title: "Team Photo / GIF",
      type: "file",
      description:
        "Shown on the left panel before a team member is selected. Upload a GIF, still image, or MP4 — the file is served as-is to preserve animation.",
      options: {
        accept: "image/*, video/mp4",
      },
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Team Page",
    }),
  },
});
