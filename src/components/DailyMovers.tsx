import Link from "next/link";
import Image from "next/image";
import type { CardMover } from "@/lib/cardHistory";

const formatYen = (n: number) => `¥${n.toLocaleString()}`;

function MoverItem({
  mover,
  type,
  rank,
}: {
  mover: CardMover;
  type: "gainer" | "loser";
  rank: number;
}) {
  const isGainer = type === "gainer";
  const sign = mover.delta > 0 ? "+" : "";
  const deltaColor = isGainer ? "text-pink-600" : "text-cyan-700";
  const deltaBg = isGainer ? "bg-pink-50" : "bg-cyan-50";
  const arrow = isGainer ? "▲" : "▼";

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    mover.articleSlug ? (
      <Link href={`/articles/${mover.articleSlug}`} className="block group">
        {children}
      </Link>
    ) : (
      <div>{children}</div>
    );

  return (
    <Wrapper>
      <div className="flex items-center gap-3 py-2.5 px-2 hover:bg-orange-50 rounded-lg transition-colors">
        {/* 順位 */}
        <span
          className={`shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
            rank === 1
              ? "bg-gradient-to-br from-yellow-300 to-yellow-500 text-white shadow"
              : rank === 2
                ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow"
                : rank === 3
                  ? "bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow"
                  : "bg-gray-100 text-gray-600"
          }`}
        >
          {rank}
        </span>

        {/* カード画像 */}
        {mover.image && (
          <div className="shrink-0 w-9 h-12 relative rounded overflow-hidden bg-gray-50 border border-gray-200">
            <Image
              src={mover.image}
              alt={mover.cardName}
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
        )}

        {/* 情報 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-[9px] font-bold text-orange-700 bg-orange-100 px-1 py-0 rounded">
              {mover.rarity}
            </span>
            <span className="text-[9px] text-gray-500 font-mono">
              {mover.cardNumber}
            </span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 leading-tight">
            {mover.cardName}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">
            {formatYen(mover.previousPrice)} → {formatYen(mover.currentPrice)}
          </div>
        </div>

        {/* 変動率バッジ */}
        <div
          className={`shrink-0 text-right ${deltaBg} rounded-lg px-2 py-1 min-w-[60px]`}
        >
          <div className={`text-[10px] font-bold ${deltaColor} leading-tight`}>
            {arrow}{" "}
            {Math.abs(mover.deltaPercent).toFixed(1)}%
          </div>
          <div className={`text-[10px] ${deltaColor} leading-tight`}>
            {sign}
            {formatYen(mover.delta)}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default function DailyMovers({
  gainers,
  losers,
}: {
  gainers: CardMover[];
  losers: CardMover[];
}) {
  if (gainers.length === 0 && losers.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-1 border-b-4 border-orange-400">
        <span>📈</span>
        <span>価格変動ランキング</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 上昇 */}
        {gainers.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-pink-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-3 flex items-center gap-2 font-bold">
              <span>🔥</span>
              <span>上昇中のカード TOP{gainers.length}</span>
            </div>
            <div className="p-2">
              {gainers.map((g, i) => (
                <MoverItem
                  key={g.cardId}
                  mover={g}
                  type="gainer"
                  rank={i + 1}
                />
              ))}
            </div>
            <div className="px-4 py-2 text-[10px] text-gray-400 border-t border-gray-100 bg-gray-50">
              ※ 直近2回の販売価格データを比較しています
            </div>
          </div>
        )}

        {/* 下落 */}
        {losers.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-cyan-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-500 text-white px-4 py-3 flex items-center gap-2 font-bold">
              <span>📉</span>
              <span>下落中のカード TOP{losers.length}</span>
            </div>
            <div className="p-2">
              {losers.map((l, i) => (
                <MoverItem
                  key={l.cardId}
                  mover={l}
                  type="loser"
                  rank={i + 1}
                />
              ))}
            </div>
            <div className="px-4 py-2 text-[10px] text-gray-400 border-t border-gray-100 bg-gray-50">
              ※ 直近2回の販売価格データを比較しています
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
