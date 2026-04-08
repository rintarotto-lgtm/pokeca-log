# Giscusコメント欄のセットアップ手順

ポケカろぐには GitHub Discussions を使ったコメント欄（Giscus）が組み込まれています。
有効化するには以下の手順を踏んでください。

## なぜGiscusなのか

- ✅ **完全無料**（サーバー不要）
- ✅ **スパムに強い**（GitHubログイン必須）
- ✅ **広告なし**（Disqusと違って）
- ✅ **Markdown対応**（リッチなコメントが書ける）
- ✅ **リアクション可能**（👍 ❤️ 🎉 等）

## セットアップ手順

### ステップ1: GitHub DiscussionsをONにする

1. https://github.com/rintarotto-lgtm/pokeca-log/settings にアクセス
2. 下にスクロールして「**Features**」セクションへ
3. 「**Discussions**」にチェックを入れる
4. 「Set up discussions」をクリック

### ステップ2: giscus アプリをインストール

1. https://github.com/apps/giscus にアクセス
2. 「**Install**」をクリック
3. 「**Only select repositories**」を選択
4. `pokeca-log` を選択してインストール

### ステップ3: Giscus設定を取得

1. https://giscus.app にアクセス
2. 言語を「日本語」に
3. リポジトリ欄に `rintarotto-lgtm/pokeca-log` を入力
4. 「**ページ ↔️ Discussions マッピング**」で「**特定の `discussion` の用語**」を選択
5. 「**Discussion カテゴリー**」で **Announcements** を選択（推奨）
6. ページ下部に表示される `<script>` タグの中から以下をメモします：
   - `data-repo-id` の値
   - `data-category-id` の値

### ステップ4: Vercel に環境変数を設定

1. https://vercel.com/rintarotto-lgtms-projects/pokeca-log/settings/environment-variables にアクセス
2. 以下の4つの環境変数を追加：

| キー | 値 |
|-----|-----|
| `NEXT_PUBLIC_GISCUS_REPO` | `rintarotto-lgtm/pokeca-log` |
| `NEXT_PUBLIC_GISCUS_REPO_ID` | （ステップ3で取得したrepo-id） |
| `NEXT_PUBLIC_GISCUS_CATEGORY` | `Announcements` |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | （ステップ3で取得したcategory-id） |

**重要**: 各変数で **Production / Preview / Development すべてにチェック** を入れてください。

### ステップ5: 再デプロイ

Vercel の Deployments ページから最新のデプロイを「**Redeploy**」するか、
GitHubに空コミットをpushして再ビルドをトリガーしてください。

```bash
cd /Users/mac/Desktop/自動化/ポケカ
git commit --allow-empty -m "chore: trigger redeploy for giscus"
git push
```

## 動作確認

1. 任意の記事ページを開く（例: https://pokeca-log.com/articles/mega-greninja-ex-mur-price ）
2. ページ最下部にコメント欄が表示されればOK
3. GitHubアカウントでログインしてコメントを投稿してみる

## トラブルシューティング

### コメント欄が「準備中です」のまま

→ 環境変数が正しく設定されているか、再デプロイされているか確認。

### コメント欄にエラーが表示される

→ giscus アプリがリポジトリにインストールされているか、Discussions が有効か確認。

### コメントの管理

→ https://github.com/rintarotto-lgtm/pokeca-log/discussions から管理できます。不適切なコメントは削除可能。
