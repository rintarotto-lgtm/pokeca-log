import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // SVG画像を許可（プレースホルダー用）
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // 公式サイトからの画像を引用のため許可
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.pokemon-card.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.pokemon-card.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
