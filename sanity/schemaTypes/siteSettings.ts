import { defineField, defineType } from "sanity";

/**
 * Site Settings — singleton document for globally shared info like
 * the footer address, email, phone, and copyright year.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "copyrightYear",
      title: "Copyright Year",
      type: "string",
      description: 'Year shown in the footer copyright, e.g. "2026".',
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
      name: "phone",
      title: "Phone Number",
      type: "string",
      description: "Public phone number shown in the footer.",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description: 'Public email, e.g. "info@gentle.works".',
    }),
    defineField({
      name: "mapsUrl",
      title: "Google Maps URL",
      type: "url",
      description:
        "Link opened when the address is clicked. Leave empty to disable.",
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Site Settings",
    }),
  },
});
