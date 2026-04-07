#!/usr/bin/env node
/**
 * トレンド調査スクリプト
 *
 * Web検索 + RSS で最新トピックを収集し、記事のネタ候補を一覧化する。
 *
 * 使い方:
 *   npx tsx scripts/research-trends.ts
 *
 * 出力:
 *   data/editorial/trend-report-YYYY-MM-DD.json に保存
 *
 * ネタ収集ソース:
 *   1. Google検索（"ポケカ + 期間絞込"）
 *   2. ポケモンカード公式ニュースRSS（あれば）
 *   3. 価格情報サイトのRSS
 *   4. X検索結果（手動収集ガイド）
 *
 * 注: X API は有料化のため、本スクリプトはRSS/Search中心。
 *     X検索URLを生成するので、ブラウザで開いて手動でメモを取れます。
 */

import fs from "fs";
import path from "path";

interface TrendItem {
  source: string;
  title: string;
  url?: string;
  note?: string;
  fetchedAt: string;
}

interface TrendReport {
  date: string;
  generatedAt: string;
  manualCheckLinks: { name: string; url: string }[];
  rssSources: { name: string; url: string }[];
  searchKeywords: string[];
  notes: string;
}

const REPORT_DIR = path.join(process.cwd(), "data/editorial");

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function generateReport(): TrendReport {
  const dateStr = today();

  // X検索URL（手動でブラウザで確認するためのリンク）
  const xSearchTerms = [
    "ポケカ 高騰",
    "ポケカ 暴落",
    "ポケカ 新弾",
    "メガゲッコウガ",
    "ニンジャスピナー",
    "ポケカ 当たり",
    "ポケカ 開封",
    "ポケカ 買取",
  ];

  const manualCheckLinks = xSearchTerms.map((term) => ({
    name: `X検索: ${term}`,
    url: `https://x.com/search?q=${encodeURIComponent(term + " min_faves:50")}&f=live`,
  }));

  // RSSソース（公式・大手）
  const rssSources = [
    {
      name: "ポケモンカードゲーム公式 NEWS",
      url: "https://www.pokemon-card.com/info/",
    },
    {
      name: "ポケモンカードゲーム公式 PRODUCTS",
      url: "https://www.pokemon-card.com/products/",
    },
  ];

  // 検索すべきキーワード（記事執筆時）
  const searchKeywords = [
    `ポケカ 新弾 ${new Date().getFullYear()}年${new Date().getMonth() + 1}月`,
    "ポケカ 高額カード ランキング",
    "ポケカ 高騰 理由",
    "ポケカ デッキ 環境",
    "ポケカ 抽選 予約",
    "ポケカ PSA 鑑定",
    "ニンジャスピナー 当たり",
    "メガゲッコウガex 相場",
  ];

  return {
    date: dateStr,
    generatedAt: new Date().toISOString(),
    manualCheckLinks,
    rssSources,
    searchKeywords,
    notes: `# トレンド調査メモ ${dateStr}

このファイルに今日チェックした話題を追記してください。

## 📊 価格動向（チェック）
- メガゲッコウガex MUR の販売/買取価格を更新したか？
- メガゲッコウガex SAR の販売/買取価格を更新したか？
- 急上昇/急下落しているカードはないか？

## 📰 ニュース収集
- 公式から新しい発表はあったか？
- リーク情報・噂はあったか？

## 🔥 SNSで話題（X）
- 上記の検索リンクをチェックして、いいね50以上のツイートで話題のものをメモ

## 💡 記事ネタ候補
-

## 📝 既存記事の更新が必要なもの
-
`,
  };
}

function main() {
  ensureDir(REPORT_DIR);
  const report = generateReport();
  const filePath = path.join(REPORT_DIR, `trend-report-${report.date}.json`);
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2) + "\n");

  // 人間が読みやすいMarkdownも生成
  const mdPath = path.join(REPORT_DIR, `trend-report-${report.date}.md`);
  const md = `# トレンド調査レポート ${report.date}

生成: ${report.generatedAt}

## 🔗 X（Twitter）検索リンク（手動チェック）

ブラウザで開いて、いいねが多いツイートをチェックします。

${report.manualCheckLinks.map((l) => `- [${l.name}](${l.url})`).join("\n")}

## 📡 RSS・公式情報

${report.rssSources.map((l) => `- [${l.name}](${l.url})`).join("\n")}

## 🔍 検索すべきキーワード

${report.searchKeywords.map((k) => `- \`${k}\``).join("\n")}

---

${report.notes}
`;
  fs.writeFileSync(mdPath, md);

  console.log(`✓ レポートを生成しました:`);
  console.log(`  JSON: ${filePath}`);
  console.log(`  Markdown: ${mdPath}`);
  console.log("");
  console.log("次のステップ:");
  console.log("  1. Markdownを開いて、X検索リンクをブラウザでチェック");
  console.log("  2. 価格動向を確認して update-card-price.ts で更新");
  console.log("  3. 新しいネタを「記事ネタ候補」に追記");
  console.log("  4. 翌日この内容をもとに新規記事を執筆");
}

main();
