import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Перенаправляє все, КРІМ about, privacy, terms та самої папки tools
        source: '/:slug((?!about|privacy|terms|tools).*)',
        destination: '/tools/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
