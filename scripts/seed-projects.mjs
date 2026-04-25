/**
 * Seed Sanity CMS with projects from the CSV database.
 *
 * Creates draft documents (so heroImage and other required fields
 * can be filled in manually before publishing).
 *
 * Usage:  node scripts/seed-projects.mjs
 */

import { createClient } from "next-sanity";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Sanity client with write token ──────────────────────────────────
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-04-09",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

// ── CSV parsing (handles quoted fields with commas/newlines) ────────
function parseCSV(text) {
  const rows = [];
  let current = "";
  let inQuotes = false;
  const lines = text.split("\n");

  for (const line of lines) {
    if (inQuotes) {
      current += "\n" + line;
      if (line.includes('"')) {
        const quoteCount = (current.match(/"/g) || []).length;
        if (quoteCount % 2 === 0) {
          inQuotes = false;
          rows.push(parseCSVRow(current));
          current = "";
        }
      }
    } else {
      const quoteCount = (line.match(/"/g) || []).length;
      if (quoteCount % 2 !== 0) {
        inQuotes = true;
        current = line;
      } else {
        rows.push(parseCSVRow(line));
      }
    }
  }
  return rows;
}

function parseCSVRow(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

// ── Slug helper ─────────────────────────────────────────────────────
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── Map status string → schema value ────────────────────────────────
function mapStatus(raw) {
  const s = (raw || "").trim().toLowerCase();
  if (s === "built") return "built";
  if (s === "in design") return "in-design";
  if (s === "under construction") return "under-construction";
  if (s === "unbuilt") return "unbuilt";
  return undefined;
}

// ── Map program type string → slug value ────────────────────────────
function mapProgramType(raw) {
  const mapping = {
    "mixed-use": "mixed-use",
    "mixed use": "mixed-use",
    housing: "housing",
    commercial: "commercial",
    civic: "civic",
    workplace: "workplace",
    // CSV extras
    "food + beverage": "food-beverage",
    retail: "retail",
    cultural: "cultural",
    institutional: "institutional",
    wellness: "wellness",
    residential: "residential",
  };
  const key = raw.trim().toLowerCase();
  return mapping[key] || slugify(raw.trim());
}

// ── Map intervention type → slug value ──────────────────────────────
function mapInterventionType(raw) {
  const mapping = {
    "new build": "new-build",
    renovation: "renovation",
    "adaptive reuse": "adaptive-reuse",
    "addition/infill": "addition-infill",
    "addtion/infill": "addition-infill", // typo in CSV
    interiors: "interiors",
    // CSV extras
    "ff&e": "ff-e",
    "historic preservation": "historic-preservation",
    site: "site",
    "strategy/planning": "strategy-planning",
  };
  const key = raw.trim().toLowerCase();
  return mapping[key] || slugify(raw.trim());
}

// ── Split comma-separated and trim ──────────────────────────────────
function splitField(val) {
  if (!val) return [];
  return val
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// ── Convert plain text → portable text blocks ───────────────────────
function toPortableText(text) {
  if (!text) return undefined;
  return text
    .split(/\n{2,}/)
    .filter((p) => p.trim())
    .map((paragraph, i) => ({
      _type: "block",
      _key: `block-${i}`,
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: `span-${i}`,
          text: paragraph.trim(),
          marks: [],
        },
      ],
    }));
}

// ── Derive summary from description (first ~240 chars) ──────────────
function deriveSummary(text, maxLen = 240) {
  if (!text) return undefined;
  const clean = text.replace(/\n+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  // Cut at last sentence boundary before maxLen
  const truncated = clean.slice(0, maxLen);
  const lastPeriod = truncated.lastIndexOf(".");
  if (lastPeriod > maxLen * 0.5) return truncated.slice(0, lastPeriod + 1);
  return truncated.slice(0, truncated.lastIndexOf(" ")) + "…";
}

// ── Build Sanity document from CSV row ──────────────────────────────
function buildDocument(headers, row) {
  const get = (name) => {
    const idx = headers.indexOf(name);
    return idx >= 0 ? (row[idx] || "").trim() : "";
  };

  const title =
    get("Project Title") === "Korver House (RENAME FOR WEBSITE)"
      ? "Korver House"
      : get("Project Title");

  if (!title) return null;

  const descriptionText = get("Project Description");

  const doc = {
    _type: "project",
    title,
    slug: { _type: "slug", current: slugify(title) },
    year: get("Year Completed") ? parseInt(get("Year Completed"), 10) || undefined : undefined,
    location: get("Project Location") || undefined,
    client: get("Client") || undefined,
    status: mapStatus(get("I - Status")),
    projectType: splitField(get("II - Program Type ")).map(mapProgramType),
    projectTag: splitField(get("III - Intervention Type ")).map(mapInterventionType),
    qualities: splitField(get('IV - "Gentle Works Qualities" ')),
    description: toPortableText(descriptionText),
    summary: deriveSummary(descriptionText),
    credits: {},
    featured: false,
  };

  // Credits mapping
  const creditsMap = {
    "Architect/Designer": "architectDesigner",
    Client: "client",
    Photographer: "photographer",
    Contractor: "contractor",
    "MEP Engineer": "mepEngineer",
    "Structural Engineer": "structuralEngineer",
    "Landscape Architect": "landscapeArchitect",
    "Construction Manager": "constructionManager",
    "Operator ": "operator",
    "Other Specialists": "otherSpecialists",
    Cinematographer: "cinematographer",
  };

  for (const [csvField, sanityField] of Object.entries(creditsMap)) {
    const val = get(csvField);
    if (val) doc.credits[sanityField] = val;
  }

  // Clean up empty objects/arrays
  if (Object.keys(doc.credits).length === 0) delete doc.credits;
  if (doc.projectType.length === 0) delete doc.projectType;
  if (doc.projectTag.length === 0) delete doc.projectTag;
  if (doc.qualities.length === 0) delete doc.qualities;

  return doc;
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  const csvPath = resolve(__dirname, "../public/assets/database-projects.csv");
  const raw = readFileSync(csvPath, "utf-8");
  const rows = parseCSV(raw);

  const headers = rows[0];
  const publishIdx = headers.findIndex((h) => h.includes("Publish on Web?"));

  // Already in CMS
  const skip = new Set(["lake claire pool", "ryokou"]);

  const toCreate = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const publish = (row[publishIdx] || "").trim();
    if (publish !== "Yes") continue;

    const title = (row[0] || "").trim();
    if (!title) continue;
    if (skip.has(title.toLowerCase())) continue;

    const doc = buildDocument(headers, row);
    if (doc) toCreate.push(doc);
  }

  console.log(`Found ${toCreate.length} projects to create as drafts.\n`);

  // Use a transaction for atomicity
  let tx = client.transaction();

  for (const doc of toCreate) {
    const draftId = `drafts.${slugify(doc.title)}`;
    tx = tx.createIfNotExists({ ...doc, _id: draftId });
    console.log(`  + ${doc.title} (${draftId})`);
  }

  console.log("\nCommitting transaction...");
  const result = await tx.commit();
  console.log(`Done! Created ${toCreate.length} draft documents.`);
  console.log(
    "\nNext steps:\n" +
      "  1. Open Sanity Studio\n" +
      "  2. Upload hero images for each project\n" +
      "  3. Fill in missing descriptions/summaries\n" +
      "  4. Publish when ready\n"
  );
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
