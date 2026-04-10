import createImageUrlBuilder, {
  type SanityImageSource,
} from "@sanity/image-url";

import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Convenience wrapper so call sites read `urlFor(image).width(1600).url()`
 * instead of plumbing the builder around manually.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
