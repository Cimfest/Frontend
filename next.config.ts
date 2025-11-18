/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // This allows the base64 Data URLs from our AI
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    // This allows remote images from Unsplash
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        port: "",
        pathname: "/**",
      },
      // You can add other trusted remote domains here in the future
    ],
  },
};

export default nextConfig;
