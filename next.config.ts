import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // SVG画像を許可
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
