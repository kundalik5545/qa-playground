/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@prisma/client", ".prisma/client", "@prisma/adapter-pg"],

  async redirects() {
    return [
      // Practice page slug renames — 301 permanent redirects
      { source: "/practice/input", destination: "/practice/input-fields", permanent: true },
      { source: "/practice/button", destination: "/practice/buttons", permanent: true },
      { source: "/practice/select", destination: "/practice/dropdowns", permanent: true },
      { source: "/practice/alert", destination: "/practice/alerts-dialogs", permanent: true },
      { source: "/practice/radio", destination: "/practice/radio-checkbox", permanent: true },
      { source: "/practice/calendar", destination: "/practice/date-picker", permanent: true },
      { source: "/practice/window", destination: "/practice/tabs-windows", permanent: true },
      { source: "/practice/waits", destination: "/practice/dynamic-waits", permanent: true },
      { source: "/practice/simple-table", destination: "/practice/data-table", permanent: true },
      { source: "/practice/upload-download", destination: "/practice/file-upload", permanent: true },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
