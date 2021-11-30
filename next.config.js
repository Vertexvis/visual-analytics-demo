// See https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
module.exports = {
  swcMinify: true,
  webpack: (config) => {
    config.module.rules.push({ test: /\.csv$/i, use: "raw-loader" });
    return config;
  },
};
