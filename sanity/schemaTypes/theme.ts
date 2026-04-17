import { defineField, defineType } from "sanity";

/**
 * Theme — reusable color theme that editors can create and apply to projects.
 *
 * Each theme defines a main color (used for text, logo, accents) and a
 * secondary color (used for the footer background). Projects reference a
 * theme via a dropdown.
 */
export const theme = defineType({
  name: "theme",
  title: "Theme",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Theme Name",
      type: "string",
      description: "Display name shown in the project theme dropdown.",
      validation: (rule) => rule.required().min(1).max(60),
    }),
    defineField({
      name: "mainColor",
      title: "Main Color",
      type: "color",
      description:
        "Primary accent color — used for text, logo circle, and headings on project pages.",
      options: { disableAlpha: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "secondaryColor",
      title: "Secondary Color",
      type: "color",
      description:
        "Background color for the project page footer.",
      options: { disableAlpha: true },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      mainHex: "mainColor.hex",
    },
    prepare({ title, mainHex }) {
      return {
        title: title ?? "Untitled Theme",
        subtitle: mainHex ?? "",
      };
    },
  },
});
