import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    useCache: true,
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'rbdls7jf-3000.asse.devtunnels.ms'
      ]
    }
  }
};

export default nextConfig;
