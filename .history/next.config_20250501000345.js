const CompressionPlugin = require("compression-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    webVitalsAttribution: ["CLS", "LCP", "FCP", "FID", "INP", "TTFB"],
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
    pagesBufferLength: 5,
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

    // Otimização para módulos duplicados
    config.optimization.splitChunks = {
      chunks: "all",
      maxInitialRequests: 25,
      minSize: 20000,
      cacheGroups: {
        default: false,
        vendors: false,
        framework: {
          chunks: "all",
          name: "framework",
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|next|@next)[\\/]/,
          priority: 40,
          enforce: true,
        },
        lib: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          name(module) {
            if (!module.context) return "vendor";

            const match = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            );
            if (!match || !match[1]) return "vendor";

            return `npm.${match[1].replace("@", "")}`;
          },
          priority: 30,
        },
        radix: {
          test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
          chunks: "all",
          name: "radix-ui",
          priority: 35,
        },
      },
    };

    return config;
  },
};

module.exports = nextConfig;
