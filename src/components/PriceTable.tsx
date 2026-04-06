import type { CardPrice } from "@/types";
import { formatPrice, getLowestPrice } from "@/lib/prices";

export default function PriceTable({ card }: { card: CardPrice }) {
  const lowest = getLowestPrice(card);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded flex items-center justify-center text-2xl">
            🎴
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{card.cardName}</h3>
            <p className="text-xs text-gray-500">
              {card.packName} / {card.cardNumber} / {card.rarity}
            </p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left px-4 py-2 font-medium text-gray-600">
                ショップ
              </th>
              <th className="text-right px-4 py-2 font-medium text-gray-600">
                価格
              </th>
              <th className="text-center px-4 py-2 font-medium text-gray-600">
                更新日
              </th>
            </tr>
          </thead>
          <tbody>
            {card.prices.map((p) => {
              const isLowest = p.price !== null && p.price === lowest;
              return (
                <tr key={p.shop} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {p.shop}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-bold ${
                      isLowest
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    {formatPrice(p.price)}
                    {isLowest && (
                      <span className="ml-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                        最安
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-500">
                    {p.updatedAt}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
