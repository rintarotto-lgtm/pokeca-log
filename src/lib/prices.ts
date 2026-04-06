import fs from "fs";
import path from "path";
import type { CardPrice } from "@/types";

const pricesPath = path.join(process.cwd(), "data/prices/prices.json");

export function getAllPrices(): CardPrice[] {
  if (!fs.existsSync(pricesPath)) return [];
  const raw = fs.readFileSync(pricesPath, "utf8");
  return JSON.parse(raw) as CardPrice[];
}

export function getCardPrice(cardId: string): CardPrice | null {
  const prices = getAllPrices();
  return prices.find((p) => p.cardId === cardId) ?? null;
}

export function getPricesByPack(packSlug: string): CardPrice[] {
  return getAllPrices().filter((p) => p.packSlug === packSlug);
}

export function getLowestPrice(card: CardPrice): number | null {
  const validPrices = card.prices
    .map((p) => p.price)
    .filter((p): p is number => p !== null);
  return validPrices.length > 0 ? Math.min(...validPrices) : null;
}

export function formatPrice(price: number | null): string {
  if (price === null) return "---";
  return `¥${price.toLocaleString()}`;
}

export interface PriceHistoryEntry {
  date: string;
  prices: Record<string, number>;
}

export interface CardPriceHistory {
  cardName: string;
  history: PriceHistoryEntry[];
}

const historyPath = path.join(process.cwd(), "data/prices/history.json");

export function getPriceHistory(
  cardId: string
): CardPriceHistory | null {
  if (!fs.existsSync(historyPath)) return null;
  const raw = fs.readFileSync(historyPath, "utf8");
  const data = JSON.parse(raw) as Record<string, CardPriceHistory>;
  return data[cardId] ?? null;
}
