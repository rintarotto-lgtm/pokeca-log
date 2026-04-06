/**
 * ポケカ価格スクレイピングスクリプト
 *
 * 使い方:
 *   npx tsx scripts/scrape-prices.ts
 *
 * 注意:
 *   - 各サイトの利用規約を必ず確認してください
 *   - アクセス間隔を十分に空けてください（最低3秒）
 *   - robots.txtを遵守してください
 *   - 商用利用の場合は各サイトに許諾を得てください
 *
 * このスクリプトはテンプレートです。
 * 実際のスクレイピング処理はサイトの構造に合わせて実装してください。
 */

import fs from "fs";
import path from "path";

// --- 型定義 ---

interface PriceEntry {
  shop: string;
  price: number | null;
  url: string;
  updatedAt: string;
}

interface CardPrice {
  cardId: string;
  cardName: string;
  cardNumber: string;
  packName: string;
  packSlug: string;
  rarity: string;
  imageUrl: string;
  prices: PriceEntry[];
}

interface HistoryEntry {
  date: string;
  prices: Record<string, number>;
}

interface CardHistory {
  cardName: string;
  history: HistoryEntry[];
}

// --- 設定 ---

const CARDS_TO_SCRAPE = [
  {
    cardId: "sv7-001",
    cardName: "リザードンex SAR",
    cardNumber: "118/100",
    packName: "変幻の仮面",
    packSlug: "hengen-no-kamen",
    rarity: "SAR",
    imageUrl: "/images/cards/charizard-ex-sar.svg",
    searchQueries: {
      surugaya: "リザードンex SAR 変幻の仮面",
      cardrush: "リザードンex SAR",
      yuyutei: "リザードンex SAR",
    },
  },
  // 他のカードも同様に追加
];

const DELAY_MS = 3000;

// --- ヘルパー ---

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function today() {
  return new Date().toISOString().split("T")[0];
}

// --- スクレイピング関数（テンプレート） ---

/**
 * 駿河屋から価格を取得
 * 実装例: HTMLをfetchしてDOMから価格を抽出
 */
async function scrapeSurugaya(query: string): Promise<number | null> {
  // TODO: 実際のスクレイピング処理を実装
  // const res = await fetch(`https://www.suruga-ya.jp/search?search_word=${encodeURIComponent(query)}`);
  // const html = await res.text();
  // ... DOMをパースして価格を取得
  console.log(`[駿河屋] スクレイピング: ${query}`);
  return null;
}

/**
 * カードラッシュから価格を取得
 */
async function scrapeCardRush(query: string): Promise<number | null> {
  // TODO: 実際のスクレイピング処理を実装
  console.log(`[カードラッシュ] スクレイピング: ${query}`);
  return null;
}

/**
 * 遊々亭から価格を取得
 */
async function scrapeYuyuTei(query: string): Promise<number | null> {
  // TODO: 実際のスクレイピング処理を実装
  console.log(`[遊々亭] スクレイピング: ${query}`);
  return null;
}

/**
 * メルカリの相場を推定（売り切れ価格から算出）
 */
async function scrapeMercari(query: string): Promise<number | null> {
  // TODO: 実際のスクレイピング処理を実装
  console.log(`[メルカリ] 相場取得: ${query}`);
  return null;
}

/**
 * トレトクから価格を取得
 */
async function scrapeTretoku(query: string): Promise<number | null> {
  // TODO: 実際のスクレイピング処理を実装
  console.log(`[トレトク] スクレイピング: ${query}`);
  return null;
}

// --- メイン処理 ---

async function main() {
  console.log("=== ポケカ価格スクレイピング開始 ===");
  console.log(`日付: ${today()}`);
  console.log("");

  const pricesPath = path.join(process.cwd(), "data/prices/prices.json");
  const historyPath = path.join(process.cwd(), "data/prices/history.json");

  // 既存データ読み込み
  let existingPrices: CardPrice[] = [];
  if (fs.existsSync(pricesPath)) {
    existingPrices = JSON.parse(fs.readFileSync(pricesPath, "utf8"));
  }

  let existingHistory: Record<string, CardHistory> = {};
  if (fs.existsSync(historyPath)) {
    existingHistory = JSON.parse(fs.readFileSync(historyPath, "utf8"));
  }

  const updatedPrices: CardPrice[] = [];

  for (const card of CARDS_TO_SCRAPE) {
    console.log(`--- ${card.cardName} ---`);

    const prices: PriceEntry[] = [];
    const priceMap: Record<string, number> = {};

    // 駿河屋
    const surugayaPrice = await scrapeSurugaya(
      card.searchQueries.surugaya
    );
    prices.push({
      shop: "駿河屋",
      price: surugayaPrice,
      url: "https://suruga-ya.jp/",
      updatedAt: today(),
    });
    if (surugayaPrice) priceMap["駿河屋"] = surugayaPrice;
    await sleep(DELAY_MS);

    // カードラッシュ
    const cardrushPrice = await scrapeCardRush(
      card.searchQueries.cardrush
    );
    prices.push({
      shop: "カードラッシュ",
      price: cardrushPrice,
      url: "https://cardrush.jp/",
      updatedAt: today(),
    });
    if (cardrushPrice) priceMap["カードラッシュ"] = cardrushPrice;
    await sleep(DELAY_MS);

    // 遊々亭
    const yuyuteiPrice = await scrapeYuyuTei(
      card.searchQueries.yuyutei
    );
    prices.push({
      shop: "遊々亭",
      price: yuyuteiPrice,
      url: "https://yuyu-tei.jp/",
      updatedAt: today(),
    });
    if (yuyuteiPrice) priceMap["遊々亭"] = yuyuteiPrice;
    await sleep(DELAY_MS);

    // メルカリ
    const mercariPrice = await scrapeMercari(card.cardName);
    prices.push({
      shop: "メルカリ相場",
      price: mercariPrice,
      url: "#",
      updatedAt: today(),
    });
    if (mercariPrice) priceMap["メルカリ相場"] = mercariPrice;
    await sleep(DELAY_MS);

    // トレトク
    const tretokuPrice = await scrapeTretoku(card.cardName);
    prices.push({
      shop: "トレトク",
      price: tretokuPrice,
      url: "https://toretoku.jp/",
      updatedAt: today(),
    });
    if (tretokuPrice) priceMap["トレトク"] = tretokuPrice;
    await sleep(DELAY_MS);

    updatedPrices.push({
      cardId: card.cardId,
      cardName: card.cardName,
      cardNumber: card.cardNumber,
      packName: card.packName,
      packSlug: card.packSlug,
      rarity: card.rarity,
      imageUrl: card.imageUrl,
      prices,
    });

    // 履歴に追加
    if (Object.keys(priceMap).length > 0) {
      if (!existingHistory[card.cardId]) {
        existingHistory[card.cardId] = {
          cardName: card.cardName,
          history: [],
        };
      }
      existingHistory[card.cardId].history.push({
        date: today(),
        prices: priceMap,
      });
      // 直近12週分だけ保持
      if (existingHistory[card.cardId].history.length > 12) {
        existingHistory[card.cardId].history =
          existingHistory[card.cardId].history.slice(-12);
      }
    }

    console.log(
      `  取得完了: ${prices.filter((p) => p.price !== null).length}/5 ショップ`
    );
    console.log("");
  }

  // 既存データとマージ（スクレイピング対象外のカードは保持）
  const scrapedIds = new Set(updatedPrices.map((p) => p.cardId));
  const mergedPrices = [
    ...updatedPrices,
    ...existingPrices.filter((p) => !scrapedIds.has(p.cardId)),
  ];

  // 保存
  fs.writeFileSync(pricesPath, JSON.stringify(mergedPrices, null, 2));
  fs.writeFileSync(
    historyPath,
    JSON.stringify(existingHistory, null, 2)
  );

  console.log("=== スクレイピング完了 ===");
  console.log(`更新カード数: ${updatedPrices.length}`);
  console.log(`保存先: ${pricesPath}`);
  console.log(`履歴: ${historyPath}`);
}

main().catch(console.error);
