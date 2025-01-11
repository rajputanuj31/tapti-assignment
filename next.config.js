/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Suppress the punycode warning
    config.ignoreWarnings = [
      { module: /node_modules\/punycode/ }
    ];
    
    return config;
  },
};

module.exports = nextConfig; 