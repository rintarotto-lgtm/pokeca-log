import fs from "fs";
import path from "path";

/**
 * カード価格履歴の1ポイント
 * 全て「素体（未鑑定）」の価格。PSA10は別フィールド。
 */
export interface CardPriceHistoryPoint {
  date: string;
  /** 素体販売価格 */
  sale: number;
  /** 素体買取価格 */
  buy: number;
  /** 素体メルカリ相場 */
  mercari?: number;
  /** PSA10販売価格（鑑定品・任意） */
  psa10Sale?: number;
  /** PSA10買取価格（鑑定品・任意） */
  psa10Buy?: number;
}

export interface CardPriceHistoryData {
  cardId: string;
  cardName: string;
  cardNumber: string;
  rarity: string;
  pack: string;
  history: CardPriceHistoryPoint[];
  /** 素体の現在販売価格 */
  currentSale: number;
  /** 素体の現在買取価格 */
  currentBuy: number;
  /** 素体の現在メルカリ相場 */
  currentMercari?: number;
  /** PSA10 の現在販売価格（任意） */
  psa10CurrentSale?: number;
  /** PSA10 の現在買取価格（任意） */
  psa10CurrentBuy?: number;
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

function fmtForId(cardId: string): { slug: string | null; image: string | null } {
  return {
    slug: SLUG_MAP[cardId] ?? null,
    image: IMAGE_MAP[cardId] ?? null,
  };
}

/**
 * ランキング表示の最小閾値
 * これ以下の変動は「ノイズ扱い」して除外
 */
const MIN_ABS_DELTA = 500; // 最低500円以上の変動
const MIN_CURRENT_PRICE = 3000; // 最低3,000円以上のカードのみ

/**
 * 各カードの直近の販売価格の変動を計算
 *
 * 最後のデータポイントと、その直前の「異なる日付」のデータポイントを比較する。
 * 最終日が今日で、前回更新から7日以上空いていても問題ない。
 */
export function calculateMovers(
  priceType: "sale" | "buy" | "mercari" = "sale"
): CardMover[] {
  const histories = getAllCardHistories();
  const movers: CardMover[] = [];

  for (const h of histories) {
    const points = h.history.filter((p) => typeof p[priceType] === "number");
    if (points.length < 2) continue;

    const current = points[points.length - 1];
    const previous = points[points.length - 2];

    const currentPrice = current[priceType] as number;
    const previousPrice = previous[priceType] as number;
    const delta = currentPrice - previousPrice;
    if (delta === 0) continue;

    // 最低変動額・最低価格フィルター
    if (Math.abs(delta) < MIN_ABS_DELTA) continue;
    if (currentPrice < MIN_CURRENT_PRICE) continue;

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
    .sort((a, b) => b.delta - a.delta) // 変動額の大きい順
    .slice(0, limit);
}

export function getLosers(limit = 5): CardMover[] {
  return calculateMovers()
    .filter((m) => m.delta < 0)
    .sort((a, b) => a.delta - b.delta) // 下落額の大きい順
    .slice(0, limit);
}

/**
 * 最新の更新日を取得（全カード履歴の中で最も新しい日付）
 */
export function getLatestMoverDate(): string | null {
  const histories = getAllCardHistories();
  let latest: string | null = null;
  for (const h of histories) {
    if (h.history.length === 0) continue;
    const d = h.history[h.history.length - 1].date;
    if (!latest || d > latest) latest = d;
  }
  return latest;
}
