import { getAllPrices, getLowestPrice, formatPrice } from "@/lib/prices";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "カード価格比較",
  description:
    "ポケモンカードの価格を主要ショップ間で比較。駿河屋・カードラッシュ・遊々亭・メルカリの最安値をチェック。",
};

export default function PricesPage() {
  const prices = getAllPrices();
  const packs = [...new Set(prices.map((p) => p.packName))];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        <span>カード価格比較</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        カード価格比較
      </h1>

      {prices.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center">
          <div className="text-4xl mb-4">💰</div>
          <p className="text-gray-600">
            カード価格データは準備中です。もうしばらくお待ちください。
          </p>
        </div>
      )}

      {packs.map((packName) => {
        const packCards = prices.filter((p) => p.packName === packName);
        return (
          <section key={packName} className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-600 rounded-full" />
              {packName}
            </h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      カード名
                    </th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">
                      レアリティ
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">
                      最安値
                    </th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                      詳細
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {packCards.map((card) => (
                    <tr
                      key={card.cardId}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/prices/${card.cardId}`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {card.cardName}
                        </Link>
                        <span className="text-xs text-gray-500 ml-2">
                          {card.cardNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded">
                          {card.rarity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-red-600">
                        {formatPrice(getLowestPrice(card))}
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <Link
                          href={`/prices/${card.cardId}`}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          価格比較 →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
