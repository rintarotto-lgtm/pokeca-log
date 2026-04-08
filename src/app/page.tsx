import { getAllArticles, getPopularArticles } from "@/lib/articles";
import { getGainers, getLosers } from "@/lib/cardHistory";
import { getBoxGainers, getBoxLosers } from "@/lib/boxHistory";
import ArticleCard from "@/components/ArticleCard";
import DailyMovers from "@/components/DailyMovers";
import BoxMovers from "@/components/BoxMovers";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export default function Home() {
  const articles = getAllArticles();
  const popularArticles = getPopularArticles();
  const gainers = getGainers(20);
  const losers = getLosers(20);
  const boxGainers = getBoxGainers(20);
  const boxLosers = getBoxLosers(20);

  if (articles.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">📒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          ポケカろぐ、準備中です
        </h1>
        <p className="text-gray-600 leading-relaxed mb-8">
          ポケモンカードの最新情報・カード価格比較・新弾情報をお届けする
          <br className="hidden sm:block" />
          ブログメディアを準備中です。もうしばらくお待ちください。
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 rounded-xl sm:rounded-2xl p-5 sm:p-10 mb-8 sm:mb-10 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -top-10 text-9xl opacity-10 select-none">
          📒
        </div>
        <div className="relative">
          <h1 className="text-xl sm:text-3xl font-black mb-2 sm:mb-3 tracking-tight leading-snug">
            ポケカの「今」がわかる、
            <br className="sm:hidden" />
            ポケカろぐ。
          </h1>
          <p className="text-white/90 text-xs sm:text-base leading-relaxed max-w-2xl">
            ポケモンカードの相場推移・新弾の当たり情報・初心者ガイドを
            <br className="hidden sm:block" />
            データとビジュアルで分かりやすくお届けするブログメディアです。
          </p>
          <div className="mt-4 sm:mt-5 flex gap-2 sm:gap-3 flex-wrap">
            <Link
              href="/articles"
              className="inline-flex items-center gap-1 px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-orange-600 font-bold rounded-lg shadow hover:shadow-md transition-shadow text-xs sm:text-sm"
            >
              📖 記事一覧を見る
            </Link>
            {articles[0] && (
              <Link
                href={`/articles/${articles[0].slug}`}
                className="inline-flex items-center gap-1 px-4 sm:px-5 py-2 sm:py-2.5 bg-orange-700/40 backdrop-blur text-white font-bold rounded-lg hover:bg-orange-700/60 transition-colors text-xs sm:text-sm border border-white/30"
              >
                🆕 最新記事を読む
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 価格変動ランキング */}
      <DailyMovers gainers={gainers} losers={losers} />

      {/* BOX価格変動ランキング */}
      <BoxMovers gainers={boxGainers} losers={boxLosers} />

      {/* 最新記事 */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 pb-1 border-b-4 border-orange-400">
            <span>🆕</span>
            <span>最新記事</span>
          </h2>
          <Link
            href="/articles"
            className="text-sm text-orange-600 hover:underline font-bold"
          >
            すべて見る →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 6).map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      {/* 人気記事 */}
      {popularArticles.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-1 border-b-4 border-orange-400">
            <span>🔥</span>
            <span>人気記事</span>
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <ul className="divide-y divide-gray-100">
              {popularArticles.map((article, i) => (
                <li key={article.slug}>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="flex items-center gap-4 py-3 hover:bg-orange-50 -mx-2 px-3 rounded-lg transition-colors group"
                  >
                    <span
                      className={`shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full font-black text-sm shadow ${
                        i === 0
                          ? "bg-gradient-to-br from-yellow-300 to-yellow-500 text-white"
                          : i === 1
                            ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                            : i === 2
                              ? "bg-gradient-to-br from-amber-500 to-amber-700 text-white"
                              : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm sm:text-base font-medium text-gray-800 group-hover:text-orange-600 line-clamp-2 transition-colors">
                      {article.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* カテゴリ */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-1 border-b-4 border-orange-400">
          <span>📂</span>
          <span>カテゴリから探す</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className={`${cat.color} rounded-xl p-4 text-center font-bold text-sm shadow-sm`}
            >
              {cat.label}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
