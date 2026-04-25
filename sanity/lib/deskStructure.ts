import type { StructureResolver } from "sanity/structure";

/**
 * Custom desk structure.
 *
 * Singleton document types (About Page, Contact Page, Site Settings) are
 * shown as direct links instead of filterable lists — editors see a single
 * form with no "create new" button.
 *
 * All other document types keep the default list behavior.
 */

const SINGLETONS = [
  { type: "aboutPage", title: "About Page" },
  { type: "contactPage", title: "Contact Page" },
  { type: "siteSettings", title: "Site Settings" },
] as const;

const SINGLETON_TYPES: Set<string> = new Set(SINGLETONS.map((s) => s.type));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Singleton items — each opens a single document editor
      ...SINGLETONS.map((singleton) =>
        S.listItem()
          .title(singleton.title)
          .id(singleton.type)
          .child(
            S.document()
              .schemaType(singleton.type)
              .documentId(singleton.type)
          )
      ),

      S.divider(),

      // Everything else — default list behavior
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETON_TYPES.has(item.getId() as string)
      ),
    ]);
