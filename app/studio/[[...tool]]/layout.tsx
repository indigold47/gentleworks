/**
 * Studio layout (server component).
 *
 * Re-exports Studio's own metadata + viewport so the Studio UI renders full
 * bleed with the right initial-scale, instead of inheriting the marketing
 * defaults from the root layout. The <html>/<body> wrapper still comes from
 * the root layout.
 */
export { metadata, viewport } from "next-sanity/studio";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
