/**
 * Seed script — populates the Sanity dataset with sample tags and two real
 * projects scraped from the existing gentle.works site.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<editor-token> npx tsx scripts/seed.mts
 *
 * The token needs Editor permission. Create one at:
 *   sanity.io/manage → project → API → Tokens
 *
 * Safe to re-run: uses createOrReplace so duplicate runs just overwrite.
 */

import { createClient } from "@sanity/client";
import { basename } from "node:path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "qt5g0jg2";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error(
    "Missing SANITY_WRITE_TOKEN. Create an Editor token at sanity.io/manage → API → Tokens.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-04-09",
  useCdn: false,
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function uploadImageFromUrl(
  url: string,
  filename: string,
): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string } }> {
  console.log(`  Uploading ${filename}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, {
    filename,
    contentType: res.headers.get("content-type") ?? "image/jpeg",
  });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

function makeKey(i: number): string {
  return `img${String(i).padStart(3, "0")}`;
}

// ---------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------

const tags = [
  { _id: "tag-hospitality", label: "Hospitality", slug: "hospitality", order: 1 },
  { _id: "tag-restaurant", label: "Restaurant", slug: "restaurant", order: 2 },
  { _id: "tag-residential", label: "Residential", slug: "residential", order: 3 },
  { _id: "tag-commercial", label: "Commercial", slug: "commercial", order: 4 },
  { _id: "tag-interior", label: "Interior Design", slug: "interior-design", order: 5 },
  { _id: "tag-adaptive-reuse", label: "Adaptive Reuse", slug: "adaptive-reuse", order: 6 },
];

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

const lakeClaireImages = [
  "https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/f3fe466c-5569-4b85-9687-126ca331f28a/072425_lakeclairepoolclub_FINAL_0001.jpg",
  "https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/468bd0f0-53d8-46a8-9a00-9c28dd5900eb/072425_lakeclairepoolclub_FINAL_0007.jpg",
  "https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/eeac89b6-d096-4000-ba67-2efb92078c17/072425_lakeclairepoolclub_FINAL_0004.jpg",
  "https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/60095c10-c24b-4ae0-ba6a-858750be7350/072425_lakeclairepoolclub_FINAL_0017.jpg",
  "https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/205339bc-42fb-445a-bd67-af666b8a0401/072425_lakeclairepoolclub_FINAL_0018.jpg",
  "https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/3f76ef16-9491-48a1-9f42-c4c5305afd52/072425_lakeclairepoolclub_FINAL_0005.jpg",
];

const ryokouImages = [
  "https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/525b686a-ac4e-4e1b-b89b-1c3df439e362/gentleworks_ryokou_final_0002.jpg",
  "https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/9b6c4418-04f2-4727-9963-3949287edb34/gentleworks_ryokou_final_0011.jpg",
  "https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/c8848ed9-731c-46fd-87ce-90e568007e91/gentleworks_ryokou_final_0001.jpg",
  "https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/f83b23cf-9c94-4c21-a822-e4d10fc2e0ae/gentleworks_ryokou_final_0008.jpg",
  "https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/dbb8a5c0-1db1-48c8-bcc6-ba35832745ad/gentleworks_ryokou_final_0010.jpg",
  "https://images.squarespace-cdn.com/content/v1/64da8e1294f20c35f1d5e9ca/6be6e3bd-d09a-4688-8f33-21f019f9a707/gentleworks_ryokou_final_0007.jpg",
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // 1. Create tags
  console.log("Creating tags...");
  const tagTransaction = client.transaction();
  for (const t of tags) {
    tagTransaction.createOrReplace({
      _id: t._id,
      _type: "tag",
      label: t.label,
      slug: { _type: "slug", current: t.slug },
      order: t.order,
    });
  }
  await tagTransaction.commit();
  console.log(`  ✓ ${tags.length} tags created\n`);

  // 2. Upload images for Lake Claire Pool
  console.log("Uploading Lake Claire Pool images...");
  const lcHero = await uploadImageFromUrl(lakeClaireImages[0], "lakeclaire-hero.jpg");
  const lcGallery = [];
  for (let i = 1; i < lakeClaireImages.length; i++) {
    const img = await uploadImageFromUrl(
      lakeClaireImages[i],
      `lakeclaire-${String(i + 1).padStart(2, "0")}.jpg`,
    );
    lcGallery.push({
      ...img,
      _key: makeKey(i),
      alt: `Lake Claire Pool Club interior ${i + 1}`,
    });
  }

  // 3. Upload images for Ryokou
  console.log("\nUploading Ryokou images...");
  const ryHero = await uploadImageFromUrl(ryokouImages[0], "ryokou-hero.jpg");
  const ryGallery = [];
  for (let i = 1; i < ryokouImages.length; i++) {
    const img = await uploadImageFromUrl(
      ryokouImages[i],
      `ryokou-${String(i + 1).padStart(2, "0")}.jpg`,
    );
    ryGallery.push({
      ...img,
      _key: makeKey(i),
      alt: `Ryokou omakase bar interior ${i + 1}`,
    });
  }

  // 4. Create projects
  console.log("\nCreating projects...");

  await client.createOrReplace({
    _id: "project-lake-claire-pool",
    _type: "project",
    title: "Lake Claire Pool",
    slug: { _type: "slug", current: "lake-claire-pool" },
    year: 2025,
    location: "Lake Claire, Atlanta, GA",
    client: "Canvas Companies",
    featured: true,
    order: 1,
    summary:
      "A private pool club reimagined as a neighborhood oasis of refined relaxation, community connection, and design-forward simplicity.",
    description: [
      {
        _type: "block",
        _key: "desc1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "The team reimagined a private pool club as a neighborhood oasis of refined relaxation, community connection, and design-forward simplicity. The design employs neutral backdrops with colorful accents, including striped tile walls and polka dot floors. Hand-painted murals throughout evoke vintage poolside aesthetics.",
            marks: [],
          },
        ],
      },
    ],
    heroImage: {
      ...lcHero,
      alt: "Lake Claire Pool Club exterior overview",
    },
    gallery: lcGallery,
    tags: [
      { _type: "reference", _ref: "tag-hospitality", _key: "t1" },
      { _type: "reference", _ref: "tag-interior", _key: "t2" },
    ],
    credits: [
      { _key: "c1", role: "Architect + Interior Designer", name: "Gentle Works" },
      { _key: "c2", role: "Contractor", name: "3D Renovations Inc." },
      { _key: "c3", role: "Muralist", name: "The Loss Prevention" },
      { _key: "c4", role: "Branding", name: "Office Hours" },
      { _key: "c5", role: "Photographer", name: "Andrew Thomas Lee" },
    ],
  });
  console.log("  ✓ Lake Claire Pool");

  await client.createOrReplace({
    _id: "project-ryokou",
    _type: "project",
    title: "Ryokou",
    slug: { _type: "slug", current: "ryokou" },
    year: 2025,
    location: "Adair Park, Atlanta, GA",
    client: "Braden Fellman Group",
    featured: true,
    order: 2,
    summary:
      "A 12-person omakase bar within a restored historic building, embracing wabi sabi principles through exposed wood beams, brick walls, and custom millwork.",
    description: [
      {
        _type: "block",
        _key: "desc1",
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "A 12-person omakase bar led by chef Leonard Yu, located within the restored Abrams Fixtures building in Adair Park. The design embraces wabi sabi principles, celebrating impermanence through exposed wood beams and brick walls. Custom millwork maximizes storage while maintaining elegant proportions.",
            marks: [],
          },
        ],
      },
    ],
    heroImage: {
      ...ryHero,
      alt: "Ryokou omakase bar counter with chef workspace",
    },
    gallery: ryGallery,
    tags: [
      { _type: "reference", _ref: "tag-restaurant", _key: "t1" },
      { _type: "reference", _ref: "tag-interior", _key: "t2" },
      { _type: "reference", _ref: "tag-adaptive-reuse", _key: "t3" },
    ],
    credits: [
      { _key: "c1", role: "Architect + Interior Designer", name: "Gentle Works" },
      { _key: "c2", role: "Contractor", name: "Braden Fellman Group" },
      { _key: "c3", role: "Operators", name: "Chef Leonard Yu & Chef Paul Gutting" },
      { _key: "c4", role: "MEP Engineer", name: "Beach Engineering" },
      { _key: "c5", role: "Photographer", name: "Andrew Lee Thomas" },
    ],
  });
  console.log("  ✓ Ryokou");

  console.log("\n🌿 Done — 6 tags + 2 projects seeded. Refresh /studio to see them.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
