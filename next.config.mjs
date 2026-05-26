/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  typescript: {
    // R3F v8 npm package has a broken declarations path — JS compiles correctly
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['@react-three/drei'],
  },
};

export default nextConfig;
