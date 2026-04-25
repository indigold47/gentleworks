/**
 * Gallery row presets — shared between Sanity schema (validation + labels)
 * and the frontend component (grid layout).
 *
 * Each preset defines:
 * - `slots`: number of media items the row expects
 * - `label`: human-readable name for the CMS dropdown
 * - `aspects`: CSS aspect-ratio value per slot (used on each cell)
 * - `cols`: CSS grid-template-columns for desktop (fr units calculated so
 *   all cells in a row share the same physical height)
 * - `sizes`: responsive `sizes` attribute per slot for <Image>
 */

export type GalleryPresetId =
  | "full-wide"
  | "two-landscape"
  | "landscape-two-wide"
  | "two-wide-landscape"
  | "square-wide-landscape"
  | "wide-landscape-square"
  | "square-portrait"
  | "portrait-square"
  | "landscape-portrait"
  | "portrait-landscape"
  | "three-portrait"
  | "two-square";

export type GalleryPreset = {
  slots: number;
  label: string;
  aspects: string[];
  cols: string;
  sizes: string[];
};

export const GALLERY_PRESETS: Record<GalleryPresetId, GalleryPreset> = {
  "full-wide": {
    slots: 1,
    label: "Full Width (5:2)",
    aspects: ["5/2"],
    cols: "1fr",
    sizes: ["100vw"],
  },
  "two-landscape": {
    slots: 2,
    label: "Two Landscape (4:3 + 4:3)",
    aspects: ["4/3", "4/3"],
    cols: "1fr 1fr",
    sizes: [
      "(min-width: 640px) 50vw, 100vw",
      "(min-width: 640px) 50vw, 100vw",
    ],
  },
  "landscape-two-wide": {
    slots: 3,
    label: "Landscape + Two Wide (4:3 + 8:3 + 8:3)",
    aspects: ["4/3", "8/3", "8/3"],
    cols: "1fr 2fr 2fr",
    sizes: [
      "(min-width: 640px) 20vw, 100vw",
      "(min-width: 640px) 40vw, 100vw",
      "(min-width: 640px) 40vw, 100vw",
    ],
  },
  "two-wide-landscape": {
    slots: 3,
    label: "Two Wide + Landscape (8:3 + 8:3 + 4:3)",
    aspects: ["8/3", "8/3", "4/3"],
    cols: "2fr 2fr 1fr",
    sizes: [
      "(min-width: 640px) 40vw, 100vw",
      "(min-width: 640px) 40vw, 100vw",
      "(min-width: 640px) 20vw, 100vw",
    ],
  },
  "square-wide-landscape": {
    slots: 2,
    label: "Square + Wide Landscape (1:1 + 5:3)",
    aspects: ["1/1", "5/3"],
    cols: "3fr 5fr",
    sizes: [
      "(min-width: 640px) 37vw, 100vw",
      "(min-width: 640px) 63vw, 100vw",
    ],
  },
  "wide-landscape-square": {
    slots: 2,
    label: "Wide Landscape + Square (5:3 + 1:1)",
    aspects: ["5/3", "1/1"],
    cols: "5fr 3fr",
    sizes: [
      "(min-width: 640px) 63vw, 100vw",
      "(min-width: 640px) 37vw, 100vw",
    ],
  },
  "square-portrait": {
    slots: 2,
    label: "Square + Portrait (1:1 + 3:4)",
    aspects: ["1/1", "3/4"],
    cols: "4fr 3fr",
    sizes: [
      "(min-width: 640px) 57vw, 100vw",
      "(min-width: 640px) 43vw, 100vw",
    ],
  },
  "portrait-square": {
    slots: 2,
    label: "Portrait + Square (3:4 + 1:1)",
    aspects: ["3/4", "1/1"],
    cols: "3fr 4fr",
    sizes: [
      "(min-width: 640px) 43vw, 100vw",
      "(min-width: 640px) 57vw, 100vw",
    ],
  },
  "landscape-portrait": {
    slots: 2,
    label: "Landscape + Portrait (4:3 + 3:4)",
    aspects: ["4/3", "3/4"],
    cols: "16fr 9fr",
    sizes: [
      "(min-width: 640px) 64vw, 100vw",
      "(min-width: 640px) 36vw, 100vw",
    ],
  },
  "portrait-landscape": {
    slots: 2,
    label: "Portrait + Landscape (3:4 + 4:3)",
    aspects: ["3/4", "4/3"],
    cols: "9fr 16fr",
    sizes: [
      "(min-width: 640px) 36vw, 100vw",
      "(min-width: 640px) 64vw, 100vw",
    ],
  },
  "three-portrait": {
    slots: 3,
    label: "Three Portrait (3:4 + 3:4 + 3:4)",
    aspects: ["3/4", "3/4", "3/4"],
    cols: "1fr 1fr 1fr",
    sizes: [
      "(min-width: 640px) 33vw, 100vw",
      "(min-width: 640px) 33vw, 100vw",
      "(min-width: 640px) 33vw, 100vw",
    ],
  },
  "two-square": {
    slots: 2,
    label: "Two Square (1:1 + 1:1)",
    aspects: ["1/1", "1/1"],
    cols: "1fr 1fr",
    sizes: [
      "(min-width: 640px) 50vw, 100vw",
      "(min-width: 640px) 50vw, 100vw",
    ],
  },
};

/** Ordered list for CMS dropdowns. */
export const PRESET_LIST = Object.entries(GALLERY_PRESETS).map(
  ([value, { label, slots }]) => ({
    value,
    title: label,
    slots,
  })
);
