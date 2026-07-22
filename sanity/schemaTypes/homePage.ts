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
              name: "mobileVideo",
              title: "Mobile video (optional)",
              type: "file",
              description:
                "Optional vertical/portrait-cropped version of the video, played on phones instead of the main video. Leave empty to play the main video on all screens.",
              options: { accept: "video/mp4,video/webm" },
            }),
            defineField({
              name: "mobileFocalPoint",
              title: "Mobile focal point",
              type: "object",
              description:
                "Which point of the video stays centered when it gets cropped on mobile. 50/50 is dead center. Ignored if a mobile video is uploaded above.",
              options: { collapsible: true, collapsed: true },
              fields: [
                defineField({
                  name: "x",
                  title: "Horizontal (0 = left, 100 = right)",
                  type: "number",
                  validation: (rule) => rule.min(0).max(100),
                  initialValue: 50,
                }),
                defineField({
                  name: "y",
                  title: "Vertical (0 = top, 100 = bottom)",
                  type: "number",
                  validation: (rule) => rule.min(0).max(100),
                  initialValue: 50,
                }),
              ],
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
