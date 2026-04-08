import Link from "next/link";
import Image from "next/image";
import type { RankingCard, RankingData } from "@/lib/rankings";
import { sortRanking } from "@/lib/rankings";

const formatYen = (n: number) => `¥${n.toLocaleString()}`;

const RARITY_COLORS: Record<string, string> = {
  MUR: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
  SAR: "bg-gradient-to-r from-pink-500 to-purple-500 text-white",
  SR: "bg-gradient-to-r from-blue-500 to-cyan-400 text-white",
  AR: "bg-gradient-to-r from-emerald-500 to-teal-400 text-white",
  RR: "bg-gray-200 text-gray-700",
};

const TREND_LABELS: Record<RankingCard["trend"], { label: string; cls: string }> = {
  up: { label: "↑ 上昇", cls: "bg-pink-50 text-pink-600 border border-pink-200" },
  down: { label: "↓ 下落", cls: "bg-cyan-50 text-cyan-700 border border-cyan-200" },
  stable: { label: "→ 横ばい", cls: "bg-gray-50 text-gray-600 border border-gray-200" },
};

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 text-white text-xl font-black shadow-lg ring-4 ring-yellow-100">
        🥇
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 text-white text-xl font-black shadow-lg ring-4 ring-gray-100">
        🥈
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white text-xl font-black shadow-lg ring-4 ring-amber-100">
        🥉
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-orange-300 text-orange-600 text-lg font-black shadow">
      {rank}位
    </span>
  );
}

function RankingItem({ card }: { card: RankingCard }) {
  const rarityCls =
    RARITY_COLORS[card.rarity] ?? "bg-gray-200 text-gray-700";
  const trend = TREND_LABELS[card.trend];

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    card.articleSlug ? (
      <Link
        href={`/articles/${card.articleSlug}`}
        className="block group"
      >
        {children}
      </Link>
    ) : (
      <div>{children}</div>
    );

  return (
    <Wrapper>
      <article className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {/* モバイル：上部にバッジ＋情報、PC：左右分割 */}
        <div className="flex flex-row sm:flex-row">
          {/* 左：順位＋カード画像（モバイルは小さめ） */}
          <div className="w-20 sm:w-44 shrink-0 bg-gradient-to-br from-orange-50 to-amber-50 p-2 sm:p-4 flex flex-col items-center justify-center gap-2 sm:gap-3 border-r border-orange-100">
            <RankBadge rank={card.rank} />
            {card.image && (
              <div className="w-14 sm:w-28 aspect-[5/7] relative rounded overflow-hidden bg-white shadow">
                <Image
                  src={card.image}
                  alt={`${card.name} ${card.rarity}`}
                  fill
                  sizes="(max-width: 640px) 56px, 112px"
                  className="object-contain"
                />
              </div>
            )}
          </div>

          {/* 右：情報 */}
          <div className="flex-1 p-3 sm:p-5 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
              <span
                className={`inline-block px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded ${rarityCls}`}
              >
                {card.rarity}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500 font-mono">
                {card.cardNumber}
              </span>
              <span
                className={`inline-block px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold rounded ${trend.cls}`}
              >
                {trend.label}
              </span>
            </div>

            <h3 className="text-sm sm:text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-1 leading-tight">
              {card.name} {card.rarity}
            </h3>

            <p className="text-[11px] sm:text-xs text-orange-600 font-bold mb-2 sm:mb-3 leading-tight">
              💡 {card.highlight}
            </p>

            <div
              className={`grid gap-1.5 sm:gap-2 mb-2 sm:mb-3 ${card.mercariPrice ? "grid-cols-3" : "grid-cols-2"}`}
            >
              <div className="bg-cyan-50 rounded px-1.5 sm:px-3 py-1 sm:py-2 border border-cyan-100">
                <div className="text-[8px] sm:text-[10px] text-gray-600 font-medium">
                  販売
                </div>
                <div className="text-xs sm:text-base font-bold text-cyan-700 leading-tight">
                  {formatYen(card.salePrice)}
                </div>
              </div>
              <div className="bg-pink-50 rounded px-1.5 sm:px-3 py-1 sm:py-2 border border-pink-100">
                <div className="text-[8px] sm:text-[10px] text-gray-600 font-medium">
                  買取
                </div>
                <div className="text-xs sm:text-base font-bold text-pink-700 leading-tight">
                  {formatYen(card.buyPrice)}
                </div>
              </div>
              {card.mercariPrice && (
                <div className="bg-orange-50 rounded px-1.5 sm:px-3 py-1 sm:py-2 border border-orange-100">
                  <div className="text-[8px] sm:text-[10px] text-gray-600 font-medium">
                    メルカリ
                  </div>
                  <div className="text-xs sm:text-base font-bold text-orange-700 leading-tight">
                    {formatYen(card.mercariPrice)}
                  </div>
                </div>
              )}
            </div>

            <p className="hidden sm:block text-sm text-gray-600 leading-relaxed line-clamp-3">
              {card.comment}
            </p>

            {card.articleSlug && (
              <div className="mt-2 sm:mt-3 text-[11px] sm:text-xs text-orange-600 font-bold">
                詳しい価格推移を見る →
              </div>
            )}
          </div>
        </div>
      </article>
    </Wrapper>
  );
}

export default function RankingList({
  data,
  sortMode = "salePrice",
  limit,
}: {
  data: RankingData;
  sortMode?: "rank" | "salePrice" | "buyPrice";
  limit?: number;
}) {
  let sorted = sortRanking(data, sortMode);
  if (limit) sorted = sorted.slice(0, limit);

  return (
    <div className="my-8">
      <div className="space-y-4">
        {sorted.map((card) => (
          <RankingItem key={`${card.cardNumber}-${card.rarity}`} card={card} />
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4 text-right">
        ※ 価格は{data.lastUpdated}時点の参考情報です（販売価格順で表示）
      </p>
    </div>
  );
}
