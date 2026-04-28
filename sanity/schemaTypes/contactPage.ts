import { defineField, defineType } from "sanity";

/**
 * Contact Page — singleton document for the /contact-us page content.
 *
 * Editors can update the hero image, address block, email, and intro text.
 * The contact form itself stays in code.
 */
export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
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
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description:
        "Background image shown on the left side of the Contact page.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "addressLine1",
      title: "Address Line 1",
      type: "string",
      description: 'e.g. "900 DeKalb Ave, Suite E"',
    }),
    defineField({
      name: "addressLine2",
      title: "Address Line 2",
      type: "string",
      description: 'e.g. "Atlanta, GA 30307"',
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description: "Public contact email address.",
    }),
    defineField({
      name: "introText",
      title: "Intro Text",
      type: "text",
      rows: 3,
      description:
        "Text shown above the contact form, e.g. 'If you are interested in working with us...'",
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Contact Page",
    }),
  },
});
