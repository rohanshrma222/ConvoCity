/** @type {import('next').NextConfig} */
const nextConfig = {
  // These packages use Node.js built-ins (pg → dns, net, tls).
  // Telling Next.js to never bundle them into the client-side JS.
  serverExternalPackages: ["pg", "@prisma/adapter-pg", "@repo/db", "@prisma/client"],
};

export default nextConfig;

