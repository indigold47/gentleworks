/**
 * Studio layout (server component).
 *
 * Uses `connection()` to opt out of static prerendering — the Studio is a
 * fully client-side SPA that cannot be meaningfully pre-rendered.
 *
 * Metadata + viewport are defined inline rather than re-exported from
 * "next-sanity/studio" to avoid dynamic API usage (`cookies()`) that
 * conflicts with Cache Components.
 */
import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Sanity Studio",
  description: "Content management for Gentle Works",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

async function StudioShell({ children }: { children: React.ReactNode }) {
  await connection();
  return <>{children}</>;
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <StudioShell>{children}</StudioShell>
    </Suspense>
  );
}
