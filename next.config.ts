import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  async redirects() {
    return [
      { source: "/playground", destination: "/terminal", permanent: true },
    ];
  },
};

export default nextConfig;
