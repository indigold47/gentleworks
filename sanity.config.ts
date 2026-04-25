/**
 * Sanity Studio config.
 *
 * This file is consumed both by the CLI (`npx sanity`) and by the embedded
 * Studio at /studio via next-sanity's NextStudio component. Keep it free of
 * Next.js-specific imports.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { colorInput } from "@sanity/color-input";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { structure } from "./sanity/lib/deskStructure";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "gentle-works",
  title: "Gentle Works",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    colorInput(),
    // Vision is the GROQ query playground — invaluable during schema work.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    // Hide singletons from the "Create new document" menu — they're
    // accessible only via their dedicated desk items.
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === "global") {
        return prev.filter(
          (item) =>
            !["aboutPage", "contactPage", "siteSettings"].includes(
              item.templateId
            )
        );
      }
      return prev;
    },
  },
});
