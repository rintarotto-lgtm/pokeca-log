import { getAllArticles, getPopularArticles } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export default function Home() {
  const articles = getAllArticles();
  const popularArticles = getPopularArticles();

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 sm:p-8 mb-10">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          📒 ポケカろぐへようこそ
        </h1>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
          ポケモンカードの最新情報・カード価格比較・新弾情報・初心者ガイドを
          <br className="hidden sm:block" />
          わかりやすくお届けするブログメディアです。
        </p>
      </section>

      {/* 最新記事 */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full" />
            最新記事
          </h2>
          <Link
            href="/articles"
            className="text-sm text-blue-600 hover:underline"
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
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-red-500 rounded-full" />
            人気記事
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <ul className="divide-y">
              {popularArticles.map((article, i) => (
                <li key={article.slug}>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="flex items-center gap-4 py-3 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                  >
                    <span className="text-lg font-bold text-blue-600 w-8 text-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-800 line-clamp-2">
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
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-green-500 rounded-full" />
          カテゴリから探す
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className={`${cat.color} rounded-lg p-4 text-center font-bold text-sm`}
            >
              {cat.label}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
