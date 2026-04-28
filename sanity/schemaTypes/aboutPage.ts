import { defineField, defineType } from "sanity";

/**
 * About Page — singleton document for the /about page content.
 *
 * Editors can update the hero image and body text without touching code.
 * Only one instance should exist; the Studio structure should enforce this.
 */
export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description: "Background image shown on the left side of the About page.",
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
      name: "theme",
      title: "Color Theme",
      type: "reference",
      to: [{ type: "theme" }],
      description:
        "Optional color theme — controls text and logo color on this page.",
    }),
    defineField({
      name: "body",
      title: "Body Text",
      type: "array",
      of: [{ type: "block" }],
      description:
        "Rich text shown on the right side of the About page.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({
      title: "About Page",
    }),
  },
});
