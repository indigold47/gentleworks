import type { SchemaTypeDefinition } from "sanity";

import { project } from "./project";
import { tag } from "./tag";

export const schemaTypes: SchemaTypeDefinition[] = [project, tag];
