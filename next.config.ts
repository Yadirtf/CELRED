import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // instrumentation.ts is picked up automatically in Next.js 15+
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;


