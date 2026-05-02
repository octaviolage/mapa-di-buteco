/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdb-static-files.s3.amazonaws.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
}

export default nextConfig
