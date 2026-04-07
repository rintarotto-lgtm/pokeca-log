#!/usr/bin/env node
/**
 * 毎日の価格取得スクリプト
 *
 * data/card-history/ 内のすべてのカード JSON を読み込み、
 * 対応する外部ソースから最新の販売価格・買取価格を取得して追記する。
 *
 * 注意:
 *   - スクレイピング対象のサイトの利用規約・robots.txt を事前に確認してください
 *   - アクセス間隔は十分に空けています (各リクエスト3秒)
 *   - 取得失敗時はその日のデータをスキップ（エラーにはしない）
 *
 * 使い方:
 *   npx tsx scripts/fetch-daily-prices.ts
 */

import fs from "fs";
import path from "path";

interface CardPriceHistoryPoint {
  date: string;
  sale: number;
  buy: number;
}

interface CardPriceHistoryData {
  cardId: string;
  cardName: string;
  cardNumber: string;
  rarity: string;
  pack: string;
  history: CardPriceHistoryPoint[];
  currentSale: number;
  currentBuy: number;
  initialSale: number;
  maxSale: number;
  source: string;
  lastUpdated: string;
  // 価格取得用のメタ情報（オプション）
  fetchSource?: {
    provider: string; // "snkrdunk" | "manual" | ...
    url?: string;
  };
}

const CARD_HISTORY_DIR = path.join(process.cwd(), "data/card-history");
const DELAY_MS = 3000;

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 販売価格と買取価格を取得する
 * 実装できていないカードは null を返す
 */
async function fetchPrice(
  card: CardPriceHistoryData
): Promise<{ sale: number; buy: number } | null> {
  const source = card.fetchSource;

  if (!source || source.provider === "manual") {
    console.log(`  [${card.cardId}] 手動更新カードのためスキップ`);
    return null;
  }

  // TODO: プロバイダー毎の取得ロジックを実装
  // 例:
  // if (source.provider === "snkrdunk") {
  //   return await fetchFromSnkrdunk(source.url!);
  // }

  console.log(
    `  [${card.cardId}] プロバイダー "${source.provider}" は未実装`
  );
  return null;
}

function updateCard(
  card: CardPriceHistoryData,
  sale: number,
  buy: number
): CardPriceHistoryData {
  const todayStr = today();
  const existingIndex = card.history.findIndex((h) => h.date === todayStr);
  const newPoint: CardPriceHistoryPoint = { date: todayStr, sale, buy };

  if (existingIndex >= 0) {
    card.history[existingIndex] = newPoint;
  } else {
    card.history.push(newPoint);
  }

  // 直近180日分だけ保持
  if (card.history.length > 180) {
    card.history = card.history.slice(-180);
  }

  card.currentSale = sale;
  card.currentBuy = buy;
  card.maxSale = Math.max(card.maxSale, sale);
  card.lastUpdated = todayStr;

  return card;
}

async function main() {
  console.log("=== 毎日の価格取得開始 ===");
  console.log(`日付: ${today()}`);
  console.log("");

  if (!fs.existsSync(CARD_HISTORY_DIR)) {
    console.log(`ディレクトリが存在しません: ${CARD_HISTORY_DIR}`);
    return;
  }

  const files = fs
    .readdirSync(CARD_HISTORY_DIR)
    .filter((f) => f.endsWith(".json"));

  console.log(`対象カード数: ${files.length}`);
  console.log("");

  let updated = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(CARD_HISTORY_DIR, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const card = JSON.parse(raw) as CardPriceHistoryData;

    console.log(`--- ${card.cardName} (${card.cardId}) ---`);

    const priceData = await fetchPrice(card);

    if (priceData) {
      const updatedCard = updateCard(card, priceData.sale, priceData.buy);
      fs.writeFileSync(
        filePath,
        JSON.stringify(updatedCard, null, 2) + "\n"
      );
      console.log(
        `  ✓ 販売 ¥${priceData.sale.toLocaleString()} / 買取 ¥${priceData.buy.toLocaleString()}`
      );
      updated++;
    } else {
      skipped++;
    }

    await sleep(DELAY_MS);
  }

  console.log("");
  console.log("=== 完了 ===");
  console.log(`更新: ${updated} / スキップ: ${skipped}`);
}

main().catch((err) => {
  console.error("エラー:", err);
  process.exit(1);
});
