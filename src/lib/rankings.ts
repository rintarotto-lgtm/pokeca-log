import fs from "fs";
import path from "path";

export interface RankingCard {
  rank: number;
  name: string;
  rarity: string;
  cardNumber: string;
  salePrice: number;
  buyPrice: number;
  trend: "up" | "down" | "stable";
  highlight: string;
  image: string | null;
  imageSource?: string;
  articleSlug?: string;
  comment: string;
}

export interface RankingData {
  rankingId: string;
  packName: string;
  lastUpdated: string;
  cards: RankingCard[];
}

export type SortMode = "rank" | "salePrice" | "buyPrice";

export function getRanking(rankingId: string): RankingData | null {
  const filePath = path.join(
    process.cwd(),
    "data/rankings",
    `${rankingId}.json`
  );
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as RankingData;
}

/**
 * カードを指定モードでソートして、新しい順位を付与する
 */
export function sortRanking(
  data: RankingData,
  mode: SortMode = "salePrice"
): RankingCard[] {
  const sorted = [...data.cards];
  if (mode === "salePrice") {
    sorted.sort((a, b) => b.salePrice - a.salePrice);
  } else if (mode === "buyPrice") {
    sorted.sort((a, b) => b.buyPrice - a.buyPrice);
  } else {
    sorted.sort((a, b) => a.rank - b.rank);
  }
  return sorted.map((card, i) => ({ ...card, rank: i + 1 }));
}
