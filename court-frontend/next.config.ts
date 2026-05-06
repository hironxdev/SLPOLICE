/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // This proxies all /api requests to the local backend running in the same container
        source: "/api/:path*",
        destination: "http://127.0.0.1:8005/api/:path*",
      },
    ];
  },
  // Ensure we don't have issues with the SLIIT portal branding
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
