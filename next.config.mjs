/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: false, // 追加：ESM モジュールの外部化を無効化
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false, // 追加：Node.js の ESM モジュールを解決
      },
    });
    return config;
  },
};

export default nextConfig;
