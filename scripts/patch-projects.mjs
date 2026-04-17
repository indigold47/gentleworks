/**
 * Patch existing projects with correct credits (object format) and project info.
 *
 * Usage:
 *   node scripts/patch-projects.mjs
 */

import { createClient } from "@sanity/client";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing env vars. Need NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-04-09",
  token,
  useCdn: false,
});

async function patch() {
  // --- Lake Claire Pool ---
  console.log("Patching Lake Claire Pool...");
  const lcpDocs = await client.fetch(
    `*[_type == "project" && slug.current == "lake-claire-pool"][0]{ _id }`
  );
  if (!lcpDocs) {
    console.error("  ✗ Lake Claire Pool not found — skipping");
  } else {
    await client
      .patch(lcpDocs._id)
      .set({
        year: 2025,
        location: "Lake Claire, Atlanta, GA",
        credits: {
          _type: "credits",
          architectDesigner: "Gentle Works",
          client: "Canvas Companies",
          contractor: "3D Renovations Inc.",
          muralist: "The Loss Prevention",
          branding: "Office Hours",
          photographer: "Andrew Thomas Lee",
        },
      })
      .commit();
    console.log("  ✓ Lake Claire Pool patched");
  }

  // --- Ryokou ---
  console.log("Patching Ryokou...");
  const ryokouDocs = await client.fetch(
    `*[_type == "project" && slug.current == "ryokou"][0]{ _id }`
  );
  if (!ryokouDocs) {
    console.error("  ✗ Ryokou not found — skipping");
  } else {
    await client
      .patch(ryokouDocs._id)
      .set({
        year: 2025,
        location: "Abrams Fixtures in Adair Park, Atlanta, GA",
        credits: {
          _type: "credits",
          architectDesigner: "Gentle Works",
          client: "Braden Fellman Group",
          contractor: "Braden Fellman Group",
          operator: "Chef Leonard Yu and Chef Paul Gutting",
          mepEngineer: "Beach Engineering",
          photographer: "Andrew Lee Thomas",
        },
      })
      .commit();
    console.log("  ✓ Ryokou patched");
  }

  console.log("\nDone!");
}

patch().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});
