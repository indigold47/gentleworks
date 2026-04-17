import { defineField, defineType } from "sanity";

/**
 * Team Member — staff profiles for the Our Team page.
 *
 * Fields: display name (shown in listings), full name, role, description,
 * photo, and a present/past status for filtering.
 */
export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({
      name: "displayName",
      title: "Display Name",
      type: "string",
      description:
        'Name as it appears in the team list, including credentials (e.g. "Emily Wirt, AIA, IIDA, LEED GA").',
      validation: (rule) => rule.required().min(1).max(120),
    }),
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      description: "Full legal name (used for alt text, metadata, etc.).",
      validation: (rule) => rule.required().min(1).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "fullName", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: 'e.g. "Principal", "Project Designer".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Bio text shown when the accordion is expanded.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description: "Optional public contact email.",
    }),
    defineField({
      name: "picture",
      title: "Picture",
      type: "image",
      description: "Headshot shown on the left panel when selected.",
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
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Present", value: "present" },
          { title: "Past", value: "past" },
        ],
        layout: "radio",
      },
      initialValue: "present",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description:
        "Manual sort order. Lower numbers appear first; ties fall back to display name.",
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "manualOrder",
      by: [
        { field: "order", direction: "asc" },
        { field: "displayName", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "displayName",
      subtitle: "role",
      media: "picture",
    },
  },
});
