const CompressionPlugin = require("compression-webpack-plugin");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Disable ESLint during builds for production
  eslint: {
    // Only run ESLint during development, ignore during production builds
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during builds for production
  typescript: {
    // Only run TypeScript checking during development, ignore during production builds
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "placehold.co",
      "images.pexels.com",
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
    scrollRestoration: true,
    optimizePackageImports: [
      "@phosphor-icons/react",
      "@radix-ui/react-*",
      "lucide-react",
      "framer-motion",
    ],
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 2,
  },
  webpack: (config, { dev, isServer }) => {
    // Adiciona suporte para comprimir arquivos estáticos
    if (!dev && !isServer) {
      config.plugins.push(
        new CompressionPlugin({
          test: /\.(js|css|html|svg)$/,
          algorithm: "gzip",
          threshold: 10240,
          minRatio: 0.8,
        })
      );
    }

    // Configuração de otimização mais simples e estável
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: "commons",
            chunks: "all",
            minChunks: 2,
            reuseExistingChunk: true,
          },
          framework: {
            chunks: "all",
            name: "framework",
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next|@next)[\\/]/,
            priority: 40,
            enforce: true,
          },
        },
      };
    }

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
