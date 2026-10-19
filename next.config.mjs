/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Loaded at runtime from node_modules so it can find its platform binary.
    serverComponentsExternalPackages: ["@ffmpeg-installer/ffmpeg"],
    // Ship the static ffmpeg binary with the media conversion function only.
    outputFileTracingIncludes: {
      "/api/media/process": [
        "./node_modules/@ffmpeg-installer/**/*",
        "./node_modules/.pnpm/@ffmpeg-installer+ffmpeg*/node_modules/@ffmpeg-installer/**/*",
        "./node_modules/.pnpm/@ffmpeg-installer+linux-x64*/node_modules/@ffmpeg-installer/linux-x64/**/*",
      ],
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
      {
        // Stock photos used on some memorials (e.g. /memorial/punde-notre-dame).
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  compress: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/terms", destination: "/terms-of-service", permanent: true },
    ]
  },
}

export default nextConfig
