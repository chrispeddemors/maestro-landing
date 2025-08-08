/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'maestro-ai.nl' }],
  },
};
export default nextConfig;