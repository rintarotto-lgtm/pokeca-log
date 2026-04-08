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
