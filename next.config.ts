import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/static/**",
      },
    ],
  },
};

export default nextConfig;
