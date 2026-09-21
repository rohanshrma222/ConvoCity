const backendUrl = (process.env.BACKEND_URL || "http://localhost:3002").replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pg", "@prisma/adapter-pg", "@repo/db", "@prisma/client"],

  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${backendUrl}/api/auth/:path*`,
      },
      {
        // Separate prefix: the web app already owns pages under /v1/*.
        source: "/api/backend/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
