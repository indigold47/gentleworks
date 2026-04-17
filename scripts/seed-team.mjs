/**
 * Seed script — populates Sanity with team member data.
 *
 * Usage:
 *   node scripts/seed-team.mjs
 *
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
 * and SANITY_API_WRITE_TOKEN (needs editor or admin role) in .env.local.
 *
 * The script uploads headshots from scripts/seed-assets/ and creates
 * teamMember documents. It's idempotent — uses createOrReplace keyed
 * on deterministic _id values so re-running overwrites cleanly.
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

/** Convert plain text paragraphs to Portable Text blocks. */
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
    asset: { _type: "reference", _ref: asset._id },
    alt,
  };
}

const members = [
  {
    _id: "team-holden-spaht",
    displayName: "Holden Spaht, AIA",
    fullName: "Holden Spaht",
    slug: { _type: "slug", current: "holden-spaht" },
    role: "Principal",
    bio: [
      "Holden Spaht is co-founder and partner at Gentle Works. He is an architect and urban designer who has led award-winning projects of various types and scale throughout his 15-year career, from large area master plans to multi-building adaptive reuse projects to neighborhood restaurants. His work and interests span the disciplines of landscape, architecture, and interiors, with a special focus on adaptive reuse and food and beverage-based hospitality and retail environments. His design approach is informed by a sensitivity to physical, cultural, and historical context, and he is particularly skilled at bridging multiple scales in a project's design resolution. He has a BA in History from the University of Georgia and Master's degrees in both architecture and city and regional planning from Georgia Tech, where he now holds a teaching appointment.",
    ],
    email: "holden@gentle.works",
    photo: "holden-spaht.jpg",
    status: "present",
    order: 1,
  },
  {
    _id: "team-emily-wirt",
    displayName: "Emily Wirt, RA, RID, LEED GA",
    fullName: "Emily Wirt",
    slug: { _type: "slug", current: "emily-wirt" },
    role: "Principal",
    bio: [
      "Emily Wirt is co-founder and partner at Gentle Works. Her architecture and interior design work has traversed scales from furniture design to urban design and planning. She has experience in commercial, residential, food and beverage, healthcare, and higher education spaces. She strives to put equity and advocacy at the forefront of the design profession and continues to find ways to celebrate the identity and beauty of architectural space through her own practice and participation in her local AIA Equity in Architecture chapter, national conferences, and local outreach. Emily believes in an honest approach to progress through architecture, and she weaves a unique narrative for each project through its history, people, and context. She received her Bachelor of Fine Arts degree in Interior Design from the University of Georgia and a Master of Architecture degree from Georgia Tech, where she now holds a teaching appointment.",
    ],
    email: "emily@gentle.works",
    photo: "emily-wirt.jpg",
    status: "present",
    order: 2,
  },
  {
    _id: "team-anna-kiningham",
    displayName: "Anna Kiningham, RA",
    fullName: "Anna Kiningham",
    slug: { _type: "slug", current: "anna-kiningham" },
    role: "Project Architect",
    bio: [
      "A registered architect and designer with over 7 years of experience, Anna remains committed to multi-disciplinary and cross-cultural collaboration to promote empathetic and equitable design strategies. Her skillset is multiscalar: from graphics and furniture design to single-family homes, hospitality, education, and adaptive reuse redevelopments. She is passionate about local place-making and community building, and her design approach is guided by each project's cultural context and historical significance. Anna graduated with a Bachelor of Science degree in Architecture and a Master of Architecture degree from Georgia Tech, where she now also lectures.",
      "When she is not trekking around to new cities with her camera, you can catch her cruising on her bicycle across the southeast or tromping in the North Georgia mountains.",
    ],
    email: "anna@gentle.works",
    photo: "anna-kiningham.jpg",
    status: "present",
    order: 3,
  },
  {
    _id: "team-alex-bumgarner",
    displayName: "Alex Bumgarner",
    fullName: "Alex Bumgarner",
    slug: { _type: "slug", current: "alex-bumgarner" },
    role: "Studio Coordinator + Interior Design Professional",
    bio: [
      "With a background in construction, creative directing and project management and a BS in Furnishings and Interiors from the University of Georgia, Alex has a thoughtful and holistic approach to design. In her role as both studio coordinator and an interior design professional, she seamlessly blends organization, creativity, and collaboration. Passionate about people and sustainability, she takes a relational approach to design, creating mindful spaces that foster connection. Alex contributes to the Gentle Works creative process through concept development, presentations, and documentation. And with strong organizational skills and a keen eye for detail, she thrives in dynamic team environments, keeping the daily studio operations running smoothly.",
      "When she's not at her desk, she enjoys hosting gatherings and architectural sketching. You can find her making friends across the hall in Stereo, strolling through Grant Park, in the aisles of a thrift store or trying out a new restaurant.",
    ],
    email: "alex@gentle.works",
    photo: "alex-bumgarner.jpg",
    status: "present",
    order: 4,
  },
  {
    _id: "team-valentina-ramirez",
    displayName: "Valentina Ramirez",
    fullName: "Valentina Ramirez",
    slug: { _type: "slug", current: "valentina-ramirez" },
    role: "Interior Design Professional",
    bio: [
      "Valentina is an interior design professional with a BFA from the University of Georgia and experience across residential, commercial, and hospitality projects. Her design approach is rooted in curiosity and personal discovery, blending diverse influences into cohesive spaces with a sense of honesty and intention. Having lived and worked in Miami, Charlotte, Washington D.C., Lima, and Bogotá, she brings an eclectic richness and global perspective to every project.",
      "Outside the studio, she's likely behind a camera, hunting for great food, or wandering a market — always in search of the next source of inspiration.",
    ],
    email: "valentina@gentle.works",
    photo: "valentina-ramirez.jpg",
    status: "present",
    order: 5,
  },
  {
    _id: "team-morgan-strickland",
    displayName: "Morgan Strickland",
    fullName: "Morgan Strickland",
    slug: { _type: "slug", current: "morgan-strickland" },
    role: "Project Designer",
    bio: [
      "With 10 years of experience in architecture and interior design, Morgan is an innovative and creative project lead. She holds a Bachelor of Science in Architecture from the Georgia Institute of Technology and has worked with both corporate and boutique studios across the country. Currently, Morgan focuses on residential and hospitality architecture and interiors, drawn to designing the thoughtful, human-scale details that transform spaces into truly magical experiences. Morgan is passionate about collaborating with local artisans to create beautiful, unique moments that make each project feel personal and extraordinary. With a special background in art, sculpture, installations, and immersive experiences, she integrates these creative practices into her professional work, infusing each design with a distinctive sense of craftsmanship.",
      "Outside of her professional life, Morgan enjoys studying ethnobotany, gardening, and renovating her 1950s ranch home, reflecting her love for both design and nature.",
    ],
    email: "morgan@gentle.works",
    photo: "morgan-strickland.jpg",
    status: "present",
    order: 6,
  },
  {
    _id: "team-john-carlisle",
    displayName: "John Carlisle",
    fullName: "John Carlisle",
    slug: { _type: "slug", current: "john-carlisle" },
    role: "Architecture Professional",
    bio: [
      "Carlisle approaches architecture through thoughtful exploration in design and technical precision in documentation. As an architectural designer at Gentle Works, he constantly collaborates with the team through three-dimensional design iteration and helps to bring those ideas to life through details that bridge creativity and function. Following a Bachelor of Science in Architecture from Georgia Tech, he gained nearly four years of professional experience in healthcare architecture, underpinning his desire to uplift human life through beautiful spaces. Seeking to expand his expertise and experience, he pursued a Master of Architecture at the University of Miami, complimented by a certificate in Urban Design. During this time, a summer internship in historic preservation deepened his appreciation for architectural history and reinforced his current passion for adaptive reuse. Now back in Atlanta, Carlisle is particularly interested in architecture's role in neighborhood placemaking, fostering community, and enhancing the city's public spaces.",
      "In his off hours, Carlisle enjoys urban exploration by way of bike and MARTA. He also volunteers regularly with Bearings Bike Works, contributing to community-driven initiatives through service.",
    ],
    email: "jecarlisle7@gmail.com",
    photo: "john-carlisle.jpg",
    // Tagged as "past" to verify the filter works
    status: "past",
    order: 7,
  },
];

async function seed() {
  console.log(`Seeding ${members.length} team members into ${dataset}...`);

  for (const member of members) {
    console.log(`  Uploading photo for ${member.fullName}...`);
    const picture = await uploadImage(member.photo, `${member.fullName} headshot`);

    const doc = {
      _id: member._id,
      _type: "teamMember",
      displayName: member.displayName,
      fullName: member.fullName,
      slug: member.slug,
      role: member.role,
      description: toBlocks(member.bio),
      email: member.email,
      picture,
      status: member.status,
      order: member.order,
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ ${member.displayName} (${member.status})`);
  }

  console.log("\nDone! All team members seeded.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
