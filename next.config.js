/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Auto-import SCSS variables and mixins globally
    config.module.rules.forEach((rule) => {
      if (rule.oneOf) {
        rule.oneOf.forEach((oneOfRule) => {
          if (
            oneOfRule.use &&
            Array.isArray(oneOfRule.use)
          ) {
            oneOfRule.use.forEach((item) => {
              if (item.loader && item.loader.includes('sass-loader')) {
                const existingAdditionalData = item.options?.additionalData || '';
                item.options = {
                  ...item.options,
                  additionalData: `${existingAdditionalData}\n@import "src/styles/_variables.scss";\n@import "src/styles/_mixins.scss";`,
                };
              }
            });
          }
        });
      }
    });
    
    return config;
  },
}

module.exports = nextConfig

