import { getAllArticles, getPopularArticles } from "@/lib/articles";
import { getAllPrices, getLowestPrice, formatPrice } from "@/lib/prices";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";

export default function Home() {
  const articles = getAllArticles();
  const popularArticles = getPopularArticles();
  const prices = getAllPrices().slice(0, 5);

  const isEmpty = articles.length === 0 && prices.length === 0;

  if (isEmpty) {
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
        <div className="inline-flex flex-col gap-2 bg-white rounded-lg shadow-sm px-6 py-4 text-sm text-gray-600">
          <div className="flex items-center gap-2 justify-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>コンテンツ準備中</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 最新記事 */}
      {articles.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full" />
            最新記事
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

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

      {/* 価格速報 */}
      {prices.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1 h-6 bg-green-500 rounded-full" />
              カード価格速報
            </h2>
            <Link
              href="/prices"
              className="text-sm text-blue-600 hover:underline"
            >
              すべて見る →
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    カード名
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">
                    パック
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">
                    レアリティ
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    最安値
                  </th>
                </tr>
              </thead>
              <tbody>
                {prices.map((card) => (
                  <tr
                    key={card.cardId}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/prices/${card.cardId}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {card.cardName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                      {card.packName}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded">
                        {card.rarity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-red-600">
                      {formatPrice(getLowestPrice(card))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
