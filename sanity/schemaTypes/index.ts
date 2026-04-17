import type { SchemaTypeDefinition } from "sanity";

import { project } from "./project";
import { tag } from "./tag";
import { teamMember } from "./teamMember";
import { theme } from "./theme";

export const schemaTypes: SchemaTypeDefinition[] = [project, tag, teamMember, theme];
