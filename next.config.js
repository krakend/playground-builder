const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/demo",
  trailingSlash: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  experimental: {
    scrollRestoration: true,
  },

  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return { ...config,
      optimization: {
        minimize: false,
      },
    };
  },
};

module.exports = withMDX(nextConfig);
