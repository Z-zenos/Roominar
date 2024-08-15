/* eslint-disable @typescript-eslint/no-var-requires */
const withNextIntl = require('next-intl/plugin')();

const IMAGE_DOMAINS = process.env.NEXT_PUBLIC_IMAGE_DOMAINS;
/** @type {import("next").NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};
module.exports = withNextIntl(nextConfig);
