/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true,
    optimizePackageImports: ["motion"],
  },
  async redirects() {
    return [
      {
        source: "/register",
        destination: "/join",
        permanent: true,
      },
    ];
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.SITE_AWS_BUCKET}.s3.${process.env.SITE_AWS_REGION}.amazonaws.com`,
      },
      {
        protocol: "https",
        hostname: `**.cdninstagram.com`,
      },
      {
        protocol: "https",
        hostname: `**.fbcdn.net`,
      },
      {
        protocol: "https",
        hostname: `tailwindui.com`,
      },
    ],
  },
};

module.exports = nextConfig;
