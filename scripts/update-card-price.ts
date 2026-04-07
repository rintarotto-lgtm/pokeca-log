#!/usr/bin/env node
/**
 * カード価格更新スクリプト
 *
 * 使い方:
 *   npx tsx scripts/update-card-price.ts <cardId> <sale> <buy>
 *
 * 例:
 *   npx tsx scripts/update-card-price.ts mega-greninja-mur 113000 75000
 *
 * 動作:
 *   - 指定カードの history.json に今日の日付でデータ点を追加
 *   - currentSale / currentBuy / maxSale / lastUpdated を更新
 *   - 同じ日付のデータが既にある場合は上書き
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
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function main() {
  const [, , cardId, saleStr, buyStr] = process.argv;

  if (!cardId || !saleStr || !buyStr) {
    console.error(
      "使い方: npx tsx scripts/update-card-price.ts <cardId> <sale> <buy>"
    );
    console.error(
      "例:     npx tsx scripts/update-card-price.ts mega-greninja-mur 113000 75000"
    );
    process.exit(1);
  }

  const sale = parseInt(saleStr, 10);
  const buy = parseInt(buyStr, 10);

  if (isNaN(sale) || isNaN(buy)) {
    console.error("エラー: sale と buy は数値である必要があります");
    process.exit(1);
  }

  const filePath = path.join(
    process.cwd(),
    "data/card-history",
    `${cardId}.json`
  );

  if (!fs.existsSync(filePath)) {
    console.error(`エラー: ${filePath} が見つかりません`);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw) as CardPriceHistoryData;

  const todayStr = today();

  // 同じ日のデータが既にあるかチェック
  const existingIndex = data.history.findIndex((h) => h.date === todayStr);
  const newPoint: CardPriceHistoryPoint = { date: todayStr, sale, buy };

  if (existingIndex >= 0) {
    data.history[existingIndex] = newPoint;
    console.log(`✓ ${todayStr} のデータを更新しました`);
  } else {
    data.history.push(newPoint);
    console.log(`✓ ${todayStr} のデータを追加しました`);
  }

  // 直近180日分だけ保持
  if (data.history.length > 180) {
    data.history = data.history.slice(-180);
  }

  // 現在値とMax更新
  data.currentSale = sale;
  data.currentBuy = buy;
  data.maxSale = Math.max(data.maxSale, sale);
  data.lastUpdated = todayStr;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");

  console.log(`✓ カード: ${data.cardName}`);
  console.log(`✓ 販売価格: ¥${sale.toLocaleString()}`);
  console.log(`✓ 買取価格: ¥${buy.toLocaleString()}`);
  console.log(`✓ 保存先: ${filePath}`);
}

main();
