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

/** Singleton pages — shown as direct document editors (no "create new" button). */
const PAGE_SINGLETONS = [
  { type: "homePage", title: "Home Page" },
  { type: "aboutPage", title: "About Page" },
  { type: "contactPage", title: "Contact Page" },
  { type: "pressPage", title: "Press Page" },
  { type: "projectsPage", title: "Projects Page" },
  { type: "teamPage", title: "Team Page" },
] as const;

/** Ordered list types shown after the divider. */
const LIST_TYPES = ["project", "teamMember", "pressItem", "filterCategory", "theme"] as const;

/** Singleton settings shown at the bottom. */
const SETTINGS_SINGLETONS = [
  { type: "siteSettings", title: "Site Settings" },
] as const;

/** All types we manage explicitly — excludes them from the auto-generated list. */
const MANAGED_TYPES: Set<string> = new Set([
  ...PAGE_SINGLETONS.map((s) => s.type),
  ...LIST_TYPES,
  ...SETTINGS_SINGLETONS.map((s) => s.type),
]);

function singletonItem(S: Parameters<StructureResolver>[0], type: string, title: string) {
  return S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type));
}

export const structure: StructureResolver = (S) => {
  const allListItems = S.documentTypeListItems();
  const listItemsByType = new Map(allListItems.map((item) => [item.getId(), item]));

  return S.list()
    .title("Content")
    .items([
      // Page singletons
      ...PAGE_SINGLETONS.map((s) => singletonItem(S, s.type, s.title)),

      S.divider(),

      // Ordered list types
      ...LIST_TYPES.flatMap((type) => {
        const item = listItemsByType.get(type);
        return item ? [item] : [];
      }),

      S.divider(),

      // Settings singletons
      ...SETTINGS_SINGLETONS.map((s) => singletonItem(S, s.type, s.title)),

      // Any remaining types not explicitly managed
      ...allListItems.filter((item) => !MANAGED_TYPES.has(item.getId() as string)),
    ]);
};
