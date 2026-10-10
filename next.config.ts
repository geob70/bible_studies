import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.1.167',
    '192.168.1.167:3000',
    'localhost:3000',
  ],
};

export default nextConfig;
