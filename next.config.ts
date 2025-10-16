import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Disable optimization so any remote thumbnail works without domain whitelisting
    unoptimized: true,
  },
};

export default nextConfig;
