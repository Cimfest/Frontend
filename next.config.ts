/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- ADD THIS BLOCK ---
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        port: "",
        pathname: "/random/**",
      },
      // You can add other domains here in the future
      // For example, if your Supabase storage has a specific URL:
      // {
      //   protocol: 'https',
      //   hostname: 'your-project-id.supabase.co',
      //   port: '',
      //   pathname: '/storage/v1/object/public/**',
      // },
    ],
  },
  // --------------------
};

export default nextConfig;
