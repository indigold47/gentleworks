import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables Partial Prerendering + `use cache` directive.
  // Required for our SSG+ISR strategy once the CMS is wired up.
  cacheComponents: true,
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      // Sanity's image CDN — all heroImage/gallery URLs come from here.
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
  },
};

export default nextConfig;
