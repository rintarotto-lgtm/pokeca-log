# 画像ファイルの配置について

このディレクトリには、サイトで使用する画像を配置します。

## ディレクトリ構成

```
public/images/
├── packs/         # 拡張パックBOX画像（アイキャッチ等）
│   └── ninja-spinner-box.svg
├── cards/         # カード画像
│   └── mega-greninja-mur.svg
└── default-thumb.svg
```

## 著作権について ⚠️

ポケモンカードの画像は **株式会社ポケモン** および **任天堂** に著作権があります。
公式画像を使用する際は、必ず以下を確認してください：

- [ポケモンカードゲーム公式ガイドライン](https://www.pokemon-card.com/)
- 引用の範囲を守り、出典を明記する
- 商用利用の場合は別途許諾を得る

## 自分で画像を用意する場合

### カード画像

1. 自分で撮影した写真を `public/images/cards/<カードID>.jpg` として配置
2. 記事の `cardImage` メタデータをそのパスに更新

例：
```yaml
cardImage: "/images/cards/mega-greninja-mur.jpg"
```

### BOX画像（アイキャッチ）

1. 自分で撮影した写真を `public/images/packs/<パックID>-box.jpg` として配置
2. 記事の `eyecatch` メタデータをそのパスに更新

例：
```yaml
eyecatch: "/images/packs/ninja-spinner-box.jpg"
```

## 推奨サイズ

- **アイキャッチ**: 1200 × 630 px (OGP対応)
- **カード画像**: 400 × 560 px 程度（カードの縦横比 5:7）
- **記事サムネイル**: 800 × 450 px

## 現在配置されているSVG

現状はテキストベースのSVGプレースホルダーを配置しています。
実写の画像を用意したら同じパスに上書きすれば自動で差し替わります。
