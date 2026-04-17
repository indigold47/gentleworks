/**
 * Seed script — creates the Lake Claire Pool project with gallery images.
 *
 * Usage:
 *   node scripts/seed-project-lcp.mjs
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
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

function toBlocks(paragraphs) {
  return paragraphs.map((text, i) => ({
    _type: "block",
    _key: `block-${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `span-${i}`, text, marks: [] }],
  }));
}

async function uploadImage(filename, alt) {
  const filePath = resolve(__dirname, "seed-assets", filename);
  const buffer = readFileSync(filePath);
  const asset = await client.assets.upload("image", buffer, {
    filename,
    contentType: "image/jpeg",
  });
  return {
    _type: "image",
    _key: `img-${filename.replace(/\W/g, "")}`,
    asset: { _type: "reference", _ref: asset._id },
    alt,
  };
}

async function seed() {
  console.log("Seeding Lake Claire Pool project...");

  // First, ensure we have the required tags
  const tagIds = {
    civic: "tag-civic",
    interiors: "tag-interiors",
  };

  for (const [label, _id] of Object.entries(tagIds)) {
    await client.createOrReplace({
      _id,
      _type: "tag",
      label: label.charAt(0).toUpperCase() + label.slice(1),
      slug: { _type: "slug", current: label },
      order: label === "civic" ? 1 : 2,
    });
    console.log(`  ✓ Tag: ${label}`);
  }

  // Upload hero image
  console.log("  Uploading hero image...");
  const heroImage = await uploadImage("lcp-1.jpg", "Lake Claire Pool interior with lockers and wave mural");
  delete heroImage._key; // hero doesn't need _key

  // Upload gallery images
  const galleryFiles = [
    { file: "lcp-2.jpg", alt: "Lake Claire Pool exterior view" },
    { file: "lcp-3.jpg", alt: "Lake Claire Pool poolside area" },
    { file: "lcp-4.jpg", alt: "Lake Claire Pool lounge with striped seating" },
  ];

  const gallery = [];
  for (const { file, alt } of galleryFiles) {
    console.log(`  Uploading gallery: ${file}...`);
    gallery.push(await uploadImage(file, alt));
  }

  const doc = {
    _id: "project-lake-claire-pool",
    _type: "project",
    title: "Lake Claire Pool",
    slug: { _type: "slug", current: "lake-claire-pool" },
    year: 2025,
    location: "Lake Claire, Atlanta, Georgia",
    client: "Canvas Companies",
    summary:
      "A reimagined private pool club designed for refined relaxation, community connection, and design-forward simplicity.",
    description: toBlocks([
      "We were approached by our friends at Canvas Companies to help reimagine the Lake Claire Pool, a private pool club located in the vibrant Lake Claire neighborhood of Atlanta. We set out to design a neighborhood oasis of refined relaxation, community connection, and design-forward simplicity perfect for this area. A neutral backdrop helped us to brighten and simplify while pops of color, patterns, and graphics provided the playful and bold moments the design needed. From striped tile walls to polka dot floors, we used moments of pattern to set the tone for this fun family friendly environment. Hand painted murals and signage throughout have a vintage graphic quality to playfully describe nostalgic poolside fun. We collaborated with The Loss Prevention and Office Hours for the murals and signage throughout the project.",
    ]),
    heroImage,
    gallery,
    credits: [
      { role: "Year Built", name: "2025" },
      { role: "Architect + Interior Designer", name: "Gentle Works" },
      { role: "Type", name: "Civic, Interiors" },
      { role: "Client", name: "Canvas Companies" },
      { role: "Location", name: "Lake Claire, Atlanta, Georgia" },
      { role: "Contractor", name: "3D Renovations Inc." },
      { role: "Photographer", name: "Andrew Thomas Lee" },
      { role: "Muralist", name: "The Loss Prevention" },
      { role: "Branding", name: "Office Hours" },
    ],
    tags: [
      { _type: "reference", _ref: tagIds.civic, _key: "ref-civic" },
      { _type: "reference", _ref: tagIds.interiors, _key: "ref-interiors" },
    ],
    // theme: use a reference to a theme document once seeded
    featured: true,
    order: 1,
  };

  await client.createOrReplace(doc);
  console.log("  ✓ Lake Claire Pool project created");

  console.log("\nDone!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
