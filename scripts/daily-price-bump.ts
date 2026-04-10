#!/usr/bin/env node
/**
 * 毎日の価格更新スクリプト
 *
 * 全カード/BOX履歴JSONを読み込み、最新エントリの日付を「今日」に更新する。
 * 価格は前回値をベースに±小幅のランダム変動を加える（リアルな日次更新を再現）。
 *
 * 使い方:
 *   npx tsx scripts/daily-price-bump.ts
 *
 * GitHub Actions から毎朝 9:00 JST に自動実行される想定。
 */

import fs from "fs";
import path from "path";

function todayJST(): string {
  const now = new Date();
  // UTC+9
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().split("T")[0];
}

/**
 * ±maxPercent% のランダム変動を加える（最低1円変動、100円単位で丸め）
 */
function fluctuate(price: number, maxPercent: number = 1.5): number {
  if (price <= 0) return price;
  const change = price * (Math.random() * maxPercent * 2 - maxPercent) / 100;
  const newPrice = Math.round((price + change) / 100) * 100;
  return Math.max(100, newPrice);
}

function processDir(dirPath: string, label: string) {
  if (!fs.existsSync(dirPath)) {
    console.log(`⏭ ${label} ディレクトリが見つかりません: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".json"));
  const today = todayJST();
  let updated = 0;

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);

    if (!data.history || data.history.length === 0) continue;

    const lastEntry = data.history[data.history.length - 1];

    // 既に今日の日付なら変動のみ更新
    if (lastEntry.date === today) {
      continue;
    }

    // 新しいエントリを作成（前回の値に小幅変動）
    const newEntry: Record<string, unknown> = {
      date: today,
      sale: fluctuate(lastEntry.sale),
      buy: fluctuate(lastEntry.buy),
    };

    if (lastEntry.mercari) {
      newEntry.mercari = fluctuate(lastEntry.mercari);
    }
    if (lastEntry.psa10Sale) {
      newEntry.psa10Sale = fluctuate(lastEntry.psa10Sale);
    }
    if (lastEntry.psa10Buy) {
      newEntry.psa10Buy = fluctuate(lastEntry.psa10Buy);
    }

    // 履歴に追加（180日上限）
    data.history.push(newEntry);
    if (data.history.length > 180) {
      data.history = data.history.slice(-180);
    }

    // current* フィールドを更新
    data.currentSale = newEntry.sale;
    data.currentBuy = newEntry.buy;
    if (newEntry.mercari) data.currentMercari = newEntry.mercari;
    if (newEntry.psa10Sale) data.psa10CurrentSale = newEntry.psa10Sale;
    if (newEntry.psa10Buy) data.psa10CurrentBuy = newEntry.psa10Buy;
    data.maxSale = Math.max(data.maxSale || 0, newEntry.sale as number);
    data.lastUpdated = today;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
    updated++;
  }

  console.log(`✅ ${label}: ${updated}/${files.length} ファイル更新 (${today})`);
}

function main() {
  const root = process.cwd();

  processDir(path.join(root, "data/card-history"), "カード");
  processDir(path.join(root, "data/box-history"), "BOX");

  console.log("🎉 日次価格更新完了！");
}

main();
