import fs from "fs";
import path from "path";

export interface CardPriceHistoryPoint {
  date: string;
  sale: number;
  buy: number;
  mercari?: number;
}

export interface CardPriceHistoryData {
  cardId: string;
  cardName: string;
  cardNumber: string;
  rarity: string;
  pack: string;
  history: CardPriceHistoryPoint[];
  currentSale: number;
  currentBuy: number;
  currentMercari?: number;
  initialSale: number;
  maxSale: number;
  source: string;
  lastUpdated: string;
}

export function getCardHistory(
  cardId: string
): CardPriceHistoryData | null {
  const filePath = path.join(
    process.cwd(),
    "data/card-history",
    `${cardId}.json`
  );
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as CardPriceHistoryData;
}

/**
 * data/card-history/ 内の全カード履歴を読み込む
 */
export function getAllCardHistories(): CardPriceHistoryData[] {
  const dir = path.join(process.cwd(), "data/card-history");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  return files
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      return JSON.parse(raw) as CardPriceHistoryData;
    })
    .filter((data) => data.history.length >= 2);
}

export interface CardMover {
  cardId: string;
  cardName: string;
  cardNumber: string;
  rarity: string;
  pack: string;
  articleSlug: string | null;
  image: string | null;
  /** 比較対象 (販売価格) */
  currentPrice: number;
  previousPrice: number;
  /** 変動額 */
  delta: number;
  /** 変動率(%) */
  deltaPercent: number;
  /** 比較日付 */
  currentDate: string;
  previousDate: string;
}

const SLUG_MAP: Record<string, string> = {
  "mega-greninja-mur": "mega-greninja-ex-mur-price",
  "mega-greninja-sar": "mega-greninja-ex-sar-price",
  "cinccino-sar": "cinccino-ex-sar-price",
  "roxie-performance-sar": "roxie-performance-sar-price",
};

const IMAGE_MAP: Record<string, string> = {
  "mega-greninja-mur": "/images/cards/mega-greninja-mur.png",
  "mega-greninja-sar": "/images/cards/mega-greninja-sar.jpg",
  "cinccino-sar": "/images/cards/cinccino-sar.png",
  "roxie-performance-sar": "/images/cards/roxie-performance-sar.png",
};

/**
 * 各カードの直近の販売価格の変動を計算
 */
export function calculateMovers(
  priceType: "sale" | "buy" | "mercari" = "sale"
): CardMover[] {
  const histories = getAllCardHistories();
  const movers: CardMover[] = [];

  for (const h of histories) {
    // 最新と1つ前のデータポイントを取得
    const points = h.history.filter((p) => typeof p[priceType] === "number");
    if (points.length < 2) continue;

    const current = points[points.length - 1];
    const previous = points[points.length - 2];

    const currentPrice = current[priceType] as number;
    const previousPrice = previous[priceType] as number;
    const delta = currentPrice - previousPrice;
    if (delta === 0) continue; // 変動なしはスキップ

    const deltaPercent = (delta / previousPrice) * 100;

    movers.push({
      cardId: h.cardId,
      cardName: h.cardName,
      cardNumber: h.cardNumber,
      rarity: h.rarity,
      pack: h.pack,
      articleSlug: SLUG_MAP[h.cardId] ?? null,
      image: IMAGE_MAP[h.cardId] ?? null,
      currentPrice,
      previousPrice,
      delta,
      deltaPercent,
      currentDate: current.date,
      previousDate: previous.date,
    });
  }

  return movers;
}

export function getGainers(limit = 5): CardMover[] {
  return calculateMovers()
    .filter((m) => m.delta > 0)
    .sort((a, b) => b.deltaPercent - a.deltaPercent)
    .slice(0, limit);
}

export function getLosers(limit = 5): CardMover[] {
  return calculateMovers()
    .filter((m) => m.delta < 0)
    .sort((a, b) => a.deltaPercent - b.deltaPercent)
    .slice(0, limit);
}
