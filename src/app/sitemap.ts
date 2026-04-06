import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { getAllPrices } from "@/lib/prices";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles().map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const prices = getAllPrices().map((p) => ({
    url: `${SITE_URL}/prices/${p.cardId}`,
    lastModified: new Date(p.prices[0]?.updatedAt ?? new Date()),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/prices`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/packs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...articles,
    ...prices,
  ];
}
