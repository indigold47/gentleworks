import type { SchemaTypeDefinition } from "sanity";

import { aboutPage } from "./aboutPage";
import { contactPage } from "./contactPage";
import { filterCategory } from "./filterCategory";
import { project } from "./project";
import { projectsPage } from "./projectsPage";
import { siteSettings } from "./siteSettings";
import { teamMember } from "./teamMember";
import { teamPage } from "./teamPage";
import { theme } from "./theme";

export const schemaTypes: SchemaTypeDefinition[] = [
  aboutPage,
  contactPage,
  filterCategory,
  project,
  projectsPage,
  siteSettings,
  teamMember,
  teamPage,
  theme,
];
