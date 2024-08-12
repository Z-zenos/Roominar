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
    // domains: IMAGE_DOMAINS?.split(',').map((item) => item.trim()) ?? [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'coursera-university-assets.s3.amazonaws.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 's3.techplay.jp',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'nextui.org',
        pathname: '**'
      }

    ],
  },
};
module.exports = withNextIntl(nextConfig);
