import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "dcdn.mitiendanube.com",
      "d2r9epyceweg5n.cloudfront.net",
      "empreender.nyc3.cdn.digitaloceanspaces.com",
    ],
  },
};

export default nextConfig;
