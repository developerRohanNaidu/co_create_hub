/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // ✅ enables static export
  images: {
    unoptimized: true, // ✅ makes sure images from /public work in static export
    domains: ['localhost'], // keep this if you use backend images in dev
  },
};

export default nextConfig;
