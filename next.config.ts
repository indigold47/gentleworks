import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables Partial Prerendering + `use cache` directive.
  // Required for our SSG+ISR strategy once the CMS is wired up.
  cacheComponents: true,
  images: {
    // Remote patterns will be added once the CMS is chosen
    // (e.g. cdn.sanity.io or notion S3 URLs).
    remotePatterns: [],
  },
};

export default nextConfig;
