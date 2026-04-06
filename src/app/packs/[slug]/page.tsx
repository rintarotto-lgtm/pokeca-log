import { notFound } from "next/navigation";
import { getArticlesByPack } from "@/lib/articles";
import { getPricesByPack, getLowestPrice, formatPrice } from "@/lib/prices";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";
import type { Metadata } from "next";

const packInfo: Record<string, { name: string; releaseDate: string }> = {
  "chouden-breaker": { name: "超電ブレイカー", releaseDate: "2026年3月28日" },
  "hengen-no-kamen": { name: "変幻の仮面", releaseDate: "2025年12月15日" },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(packInfo).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pack = packInfo[slug];
  if (!pack) return {};
  return {
    title: `${pack.name}の情報まとめ`,
    description: `ポケカ拡張パック「${pack.name}」の収録カード・当たりカード・価格情報まとめ。`,
  };
}

export default async function PackPage({ params }: Props) {
  const { slug } = await params;
  const pack = packInfo[slug];
  if (!pack) notFound();

  const articles = getArticlesByPack(slug);
  const prices = getPricesByPack(slug);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        <Link href="/packs" className="hover:text-blue-600">
          拡張パック
        </Link>
        <span className="mx-2">/</span>
        <span>{pack.name}</span>
      </nav>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{pack.name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          発売日: {pack.releaseDate}
        </p>
      </div>

      {/* 関連記事 */}
      {articles.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-600 rounded-full" />
            関連記事
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* カード価格 */}
      {prices.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-green-500 rounded-full" />
            収録カード価格
          </h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    カード名
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">
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
                    <td className="px-4 py-3 text-center">
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
