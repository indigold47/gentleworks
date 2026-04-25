import type { SchemaTypeDefinition } from "sanity";

import { aboutPage } from "./aboutPage";
import { contactPage } from "./contactPage";
import { filterCategory } from "./filterCategory";
import { project } from "./project";
import { siteSettings } from "./siteSettings";
import { tag } from "./tag";
import { teamMember } from "./teamMember";
import { theme } from "./theme";

export const schemaTypes: SchemaTypeDefinition[] = [
  aboutPage,
  contactPage,
  filterCategory,
  project,
  siteSettings,
  tag,
  teamMember,
  theme,
];
