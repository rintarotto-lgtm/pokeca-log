# ポケカ速報

ポケモンカード特化の情報サイト。カード価格比較・新弾情報・記事をお届けします。

## 機能

- 📰 **記事ブログ** - MDX形式でポケカ記事を管理
- 💰 **カード価格比較** - 5つの主要ショップ（駿河屋・カードラッシュ・遊々亭・メルカリ・トレトク）の価格を一覧比較
- 📈 **価格推移チャート** - Rechartsによる過去価格の可視化
- 📦 **拡張パック情報** - パック別の収録カード・関連記事
- 🔍 **SEO最適化** - JSON-LD構造化データ、OGP、sitemap.xml

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **チャート**: Recharts
- **コンテンツ管理**: MDX + gray-matter
- **デプロイ**: Vercel

## ディレクトリ構造

```
├── content/articles/       # 記事 (.mdx)
├── data/prices/            # 価格データ JSON
│   ├── prices.json         # 現在の価格
│   └── history.json        # 価格推移履歴
├── public/images/          # 画像
├── scripts/
│   └── scrape-prices.ts    # 価格スクレイピングスクリプト
└── src/
    ├── app/                # ページ (App Router)
    ├── components/         # Reactコンポーネント
    ├── lib/                # ユーティリティ関数
    └── types/              # 型定義
```

## 開発

```bash
npm install
npm run dev
```

http://localhost:3000 でアクセスできます。

## 記事の追加

`content/articles/` 以下に `.mdx` ファイルを作成します。

```markdown
---
title: "記事タイトル"
description: "記事の概要"
date: "2026-04-06"
category: "price"
tags: ["タグ1", "タグ2"]
thumbnail: "/images/your-thumb.svg"
popular: true
packSlug: "hengen-no-kamen"
---

## 見出し

本文...
```

## 価格データの更新

### 手動更新

`data/prices/prices.json` と `data/prices/history.json` を直接編集します。

### 自動スクレイピング

```bash
npx tsx scripts/scrape-prices.ts
```

`scripts/scrape-prices.ts` 内の各 `scrapeXxx()` 関数を実装する必要があります。

**⚠️ 注意**: 各サイトの利用規約・robots.txtを必ず遵守してください。

### GitHub Actions による自動実行

`.github/workflows/update-prices.yml` により、毎日3:00 AM JSTに自動実行されます。

## Vercel デプロイ手順

1. GitHubにリポジトリをプッシュ
2. [vercel.com](https://vercel.com) にアクセスして "New Project"
3. GitHubリポジトリをインポート
4. デフォルト設定のまま "Deploy"
5. 自動的にビルド・デプロイされます

### 環境変数（任意）

| 変数名 | 説明 |
|--------|------|
| `CRON_SECRET` | `/api/cron/update-prices` の保護用シークレット |

## ライセンス

個人利用向け。

Pokemon、ポケモンカードは株式会社ポケモンおよび任天堂の商標です。
本サイトは公式とは関係ありません。
