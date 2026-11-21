import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
