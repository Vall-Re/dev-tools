import type { NextConfig } from "next";

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:slug', // будь-який старий шлях
        destination: '/tools/:slug', // перенаправлення на новий
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
