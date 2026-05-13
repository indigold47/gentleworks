/**
 * Sanity publish webhook → tag-based ISR invalidation.
 *
 * Flow:
 *   1. Editor hits Publish in /studio
 *   2. Sanity POSTs the changed document to this route with a signed body
 *   3. We verify the signature against SANITY_REVALIDATE_SECRET
 *   4. We call revalidateTag() for every tag touched by the change
 *   5. Next regenerates the affected cached fetches on the next request
 *
 * Configure the webhook in sanity.io/manage → API → Webhooks:
 *   URL:     https://<prod-domain>/api/revalidate
 *   Dataset: production
 *   Trigger: Create / Update / Delete
 *   Filter:  _type in ["project", "filterCategory", "teamMember", "theme", "homePage", "aboutPage", "contactPage", "teamPage", "projectsPage", "pressItem", "pressPage", "siteSettings"]
 *   Projection: {
 *     "_type": _type,
 *     "slug":  slug.current
 *   }
 *   Secret:  same value as SANITY_REVALIDATE_SECRET
 *   HTTP:    POST, application/json
 */
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { revalidateSecret } from "@/sanity/env";
import {
  ABOUT_TAG,
  CONTACT_TAG,
  FILTERS_TAG,
  HOME_TAG,
  PRESS_PAGE_TAG,
  PRESS_TAG,
  PROJECTS_PAGE_TAG,
  PROJECTS_TAG,
  SETTINGS_TAG,
  TEAM_PAGE_TAG,
  TEAM_TAG,
  THEMES_TAG,
  projectTag,
} from "@/sanity/lib/fetch";

type WebhookBody = {
  _type?: string;
  slug?: string;
};

/** Expire the cached entry immediately — "max" means use the maximum
 *  expiration profile so the tag is treated as fully stale right away. */
const expire = (tag: string) => revalidateTag(tag, "max");

export async function POST(req: NextRequest) {
  if (!revalidateSecret) {
    // Fail loud in production so a misconfigured env is obvious, not silent.
    console.error("[sanity-revalidate] Missing SANITY_REVALIDATE_SECRET");
    return NextResponse.json(
      { error: "Missing SANITY_REVALIDATE_SECRET" },
      { status: 500 },
    );
  }

  let body: WebhookBody;
  let isValidSignature: boolean;
  try {
    const parsed = await parseBody<WebhookBody>(req, revalidateSecret);
    body = parsed.body ?? {};
    isValidSignature = parsed.isValidSignature === true;
  } catch (err) {
    console.error("[sanity-revalidate] parseBody failed", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 },
    );
  }

  if (!isValidSignature) {
    console.error("[sanity-revalidate] invalid signature", { type: body._type });
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 },
    );
  }

  // Always refresh the collection-level tags. Cost is tiny — these drive the
  // listing page, home featured strip, sitemap, etc.
  switch (body._type) {
    case "homePage": {
      expire(HOME_TAG);
      break;
    }
    case "project": {
      expire(PROJECTS_TAG);
      if (body.slug) expire(projectTag(body.slug));
      break;
    }
    case "teamMember": {
      expire(TEAM_TAG);
      break;
    }
    case "filterCategory": {
      // Filter category changes affect the project index filter chips.
      expire(FILTERS_TAG);
      break;
    }
    case "theme": {
      // Theme edits affect project pages that reference them → invalidate both.
      expire(THEMES_TAG);
      expire(PROJECTS_TAG);
      break;
    }
    case "aboutPage": {
      expire(ABOUT_TAG);
      break;
    }
    case "contactPage": {
      expire(CONTACT_TAG);
      break;
    }
    case "teamPage": {
      expire(TEAM_PAGE_TAG);
      break;
    }
    case "projectsPage": {
      expire(PROJECTS_PAGE_TAG);
      break;
    }
    case "pressItem": {
      expire(PRESS_TAG);
      break;
    }
    case "pressPage": {
      expire(PRESS_PAGE_TAG);
      break;
    }
    case "siteSettings": {
      expire(SETTINGS_TAG);
      break;
    }
    default: {
      // Unknown type — still 200 so Sanity doesn't retry endlessly, but no-op.
      return NextResponse.json({ revalidated: false, type: body._type });
    }
  }

  return NextResponse.json({
    revalidated: true,
    type: body._type,
    slug: body.slug ?? null,
  });
}
