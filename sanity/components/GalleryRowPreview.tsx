import { useClient } from "sanity";
import imageUrlBuilder from "@sanity/image-url";
import { useMemo } from "react";
import { GALLERY_PRESETS } from "@/lib/gallery-presets";
import type { GalleryPresetId } from "@/lib/gallery-presets";

type MediaItem = {
  _type?: string;
  _key?: string;
  asset?: { _ref: string };
  video?: { asset?: { _ref: string } };
};

type Props = {
  preset?: string;
  media?: unknown[];
};

export function GalleryRowPreview(props: Props) {
  const { preset: presetId } = props;
  const media = (props.media ?? []) as MediaItem[];
  const client = useClient({ apiVersion: "2024-01-01" });
  const builder = useMemo(() => imageUrlBuilder(client), [client]);

  const preset = presetId
    ? GALLERY_PRESETS[presetId as GalleryPresetId]
    : null;

  if (!preset) {
    return (
      <div style={{ padding: "8px 0", fontSize: 13, color: "#8a8a8a" }}>
        Select a layout preset
      </div>
    );
  }

  const items = media ?? [];
  const isFilled = items.length === preset.slots;

  return (
    <div style={{ padding: "6px 0" }}>
      {/* Label */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 500,
          marginBottom: 6,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{preset.label}</span>
        <span
          style={{
            fontSize: 11,
            color: isFilled ? "#8a8a8a" : "#c57600",
          }}
        >
          {items.length}/{preset.slots} media
        </span>
      </div>

      {/* Visual row preview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: preset.cols,
          gap: 3,
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {Array.from({ length: preset.slots }, (_, i) => {
          const aspect = preset.aspects[i] ?? "4/3";
          const item = items[i];
          const isImage =
            item && item._type !== "galleryVideo" && item.asset?._ref;
          const thumbUrl = isImage
            ? builder
                .image(item.asset!._ref)
                .width(300)
                .quality(60)
                .auto("format")
                .url()
            : null;

          return (
            <div
              key={i}
              style={{
                aspectRatio: aspect,
                backgroundColor: "#e8e0d8",
                backgroundImage: thumbUrl ? `url(${thumbUrl})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {!thumbUrl && (
                <span style={{ fontSize: 11, color: "#8a8a8a" }}>
                  {item?._type === "galleryVideo" ? "Video" : `${i + 1}`}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
