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
  },
};

export default nextConfig;
