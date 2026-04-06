import { getAllArticles, getPopularArticles } from "@/lib/articles";
import { getAllPrices, getLowestPrice, formatPrice } from "@/lib/prices";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";

export default function Home() {
  const articles = getAllArticles();
  const popularArticles = getPopularArticles();
  const prices = getAllPrices().slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 最新記事 */}
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

      {/* パック別セクション */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-purple-500 rounded-full" />
          拡張パック
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              slug: "chouden-breaker",
              name: "超電ブレイカー",
              date: "2026年3月発売",
            },
            {
              slug: "hengen-no-kamen",
              name: "変幻の仮面",
              date: "2025年12月発売",
            },
          ].map((pack) => (
            <Link
              key={pack.slug}
              href={`/packs/${pack.slug}`}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-3xl shrink-0">
                📦
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{pack.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{pack.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
