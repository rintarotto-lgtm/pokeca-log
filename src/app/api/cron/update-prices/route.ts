import { NextResponse } from "next/server";

/**
 * 価格更新用 Cron ジョブ（毎日 3:00 AM JST に実行）
 *
 * Vercel Cron Jobs から呼び出される。
 * 認証: CRON_SECRET 環境変数を使って保護。
 *
 * 注意:
 *   Vercel の Serverless 環境では fs.writeFileSync が使えません。
 *   実運用では以下のいずれかを検討してください:
 *   1. GitHub Actions で定期実行し、prices.json をコミット
 *   2. 外部DB（Vercel KV, Supabase, PlanetScale等）に保存
 *   3. スクレイピング結果をVercel Blob / S3 に保存
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // TODO: ここで実際のスクレイピング処理を呼び出す
    // 現状はスクリプト（scripts/scrape-prices.ts）をGitHub Actions等で実行することを推奨

    return NextResponse.json({
      success: true,
      message: "Price update triggered",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
