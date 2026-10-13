import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isPages = process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'github-pages';

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isPages ? {
    output: 'export',
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/Skardu-Spring',
    trailingSlash: true,
  } : {}),
  // The repo is an npm workspace with a root lockfile; pin the root so Next doesn't guess.
  turbopack: {
    root: path.join(__dirname, '..'),
  },
  images: {
    unoptimized: isPages,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  reactStrictMode: true,
  // Enable compression
  compress: true,
};

export default nextConfig;
