import { defineField, defineType } from "sanity";

/**
 * Home Page — singleton document for the homepage hero carousel.
 *
 * Editors can add, remove, and reorder videos and images that play
 * in the full-screen hero on the homepage.
 */
export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroMedia",
      title: "Hero Media",
      type: "array",
      description:
        "Ordered list of videos and images for the homepage hero carousel. Videos play once then advance; images display for 5 seconds.",
      of: [
        {
          type: "object",
          name: "homeHeroVideo",
          title: "Video",
          fields: [
            defineField({
              name: "video",
              title: "Video file",
              type: "file",
              description: "Upload an MP4 or WebM. Keep under 20 MB for fast loading.",
              options: { accept: "video/mp4,video/webm" },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "poster",
              title: "Poster image",
              type: "image",
              description:
                "A still frame shown while the video loads. Use the first frame of the video for a seamless transition.",
              options: { hotspot: true },
            }),
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description: "Describe the video for screen readers.",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "alt" },
          },
        },
        {
          type: "object",
          name: "homeHeroImage",
          title: "Image",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description: "Describe the image for screen readers.",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { media: "image", title: "alt" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
