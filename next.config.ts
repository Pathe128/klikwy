import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // pour les images Gmail
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // pour les images Unsplash
      },
    ],
  },
};

export default nextConfig;
