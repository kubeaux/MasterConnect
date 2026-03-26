import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Permettre les images depuis l'API
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "backend",
      },
    ],
  },
};

export default nextConfig;