import fs from "fs";
import path from "path";

export interface BoxPriceHistoryPoint {
  date: string;
  sale: number;
  buy: number;
  mercari?: number;
}

export interface BoxPriceHistoryData {
  boxId: string;
  name: string;
  pack: string;
  releaseDate: string;
  shrinked: boolean;
  history: BoxPriceHistoryPoint[];
  currentSale: number;
  currentBuy: number;
  currentMercari?: number;
  initialSale: number;
  maxSale: number;
  source: string;
  lastUpdated: string;
}

export interface BoxMover {
  boxId: string;
  name: string;
  pack: string;
  releaseDate: string;
  shrinked: boolean;
  currentPrice: number;
  previousPrice: number;
  delta: number;
  deltaPercent: number;
  currentDate: string;
  previousDate: string;
}

const BOX_DIR = "data/box-history";

export function getAllBoxHistories(): BoxPriceHistoryData[] {
  const dir = path.join(process.cwd(), BOX_DIR);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  return files
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      return JSON.parse(raw) as BoxPriceHistoryData;
    })
    .filter((d) => d.history.length >= 2);
}

export function getBoxHistory(boxId: string): BoxPriceHistoryData | null {
  const filePath = path.join(process.cwd(), BOX_DIR, `${boxId}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as BoxPriceHistoryData;
}

export function calculateBoxMovers(
  priceType: "sale" | "buy" | "mercari" = "sale"
): BoxMover[] {
  const boxes = getAllBoxHistories();
  const movers: BoxMover[] = [];

  for (const b of boxes) {
    const points = b.history.filter(
      (p) => typeof p[priceType] === "number"
    );
    if (points.length < 2) continue;

    const current = points[points.length - 1];
    const previous = points[points.length - 2];

    const currentPrice = current[priceType] as number;
    const previousPrice = previous[priceType] as number;
    const delta = currentPrice - previousPrice;
    if (delta === 0) continue;

    const deltaPercent = (delta / previousPrice) * 100;

    movers.push({
      boxId: b.boxId,
      name: b.name,
      pack: b.pack,
      releaseDate: b.releaseDate,
      shrinked: b.shrinked,
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

export function getBoxGainers(limit = 20): BoxMover[] {
  return calculateBoxMovers()
    .filter((m) => m.delta > 0)
    .sort((a, b) => b.deltaPercent - a.deltaPercent)
    .slice(0, limit);
}

export function getBoxLosers(limit = 20): BoxMover[] {
  return calculateBoxMovers()
    .filter((m) => m.delta < 0)
    .sort((a, b) => a.deltaPercent - b.deltaPercent)
    .slice(0, limit);
}
