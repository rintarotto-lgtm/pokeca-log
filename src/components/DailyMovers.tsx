import Link from "next/link";
import Image from "next/image";
import type { CardMover } from "@/lib/cardHistory";

const formatYen = (n: number) => `¥${n.toLocaleString()}`;

function MoverCard({
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
  const borderColor = isGainer ? "border-pink-200" : "border-cyan-200";
  const arrow = isGainer ? "▲" : "▼";

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    mover.articleSlug ? (
      <Link
        href={`/articles/${mover.articleSlug}`}
        className="block group shrink-0"
      >
        {children}
      </Link>
    ) : (
      <div className="shrink-0">{children}</div>
    );

  return (
    <Wrapper>
      <div
        className={`w-36 sm:w-40 bg-white rounded-xl border-2 ${borderColor} shadow-sm hover:shadow-md transition-shadow overflow-hidden relative`}
      >
        {/* 順位バッジ */}
        <div className="absolute top-2 left-2 z-10">
          <span
            className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
              rank === 1
                ? "bg-gradient-to-br from-yellow-300 to-yellow-500 text-white shadow"
                : rank === 2
                  ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow"
                  : rank === 3
                    ? "bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow"
                    : "bg-white border border-gray-300 text-gray-700 shadow"
            }`}
          >
            {rank}
          </span>
        </div>

        {/* カード画像エリア */}
        <div className="w-full aspect-[5/7] bg-gradient-to-br from-gray-50 to-orange-50 relative">
          {mover.image ? (
            <Image
              src={mover.image}
              alt={mover.cardName}
              fill
              sizes="(max-width: 640px) 144px, 160px"
              className="object-contain p-2"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-3xl opacity-30">
              🎴
            </div>
          )}
        </div>

        {/* 情報エリア */}
        <div className="p-2">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[8px] font-bold text-orange-700 bg-orange-100 px-1 rounded">
              {mover.rarity}
            </span>
            <span className="text-[8px] text-gray-500 font-mono truncate">
              {mover.cardNumber}
            </span>
          </div>
          <h4 className="text-[11px] font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight min-h-[28px] mb-1">
            {mover.cardName}
          </h4>
          <div className="text-[9px] text-gray-500 mb-1.5 truncate">
            {mover.pack}
          </div>

          {/* 変動率 */}
          <div className={`${deltaBg} rounded px-1.5 py-1 text-center`}>
            <div className={`text-sm font-black ${deltaColor} leading-tight`}>
              {arrow} {Math.abs(mover.deltaPercent).toFixed(1)}%
            </div>
            <div className={`text-[9px] ${deltaColor} font-bold mt-0.5`}>
              {sign}
              {formatYen(mover.delta)}
            </div>
          </div>

          {/* 現在価格 */}
          <div className="text-[9px] text-gray-500 text-center mt-1">
            現在 <span className="font-bold text-gray-700">{formatYen(mover.currentPrice)}</span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

function MoverRow({
  title,
  icon,
  movers,
  type,
  gradient,
}: {
  title: string;
  icon: string;
  movers: CardMover[];
  type: "gainer" | "loser";
  gradient: string;
}) {
  if (movers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className={`${gradient} text-white px-4 py-3 flex items-center gap-2 font-bold`}>
          <span>{icon}</span>
          <span>{title}</span>
        </div>
        <div className="p-8 text-center text-sm text-gray-500">
          該当カードがありません
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden">
      <div className={`${gradient} text-white px-4 py-3 flex items-center justify-between gap-2 font-bold`}>
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <span>{title}</span>
        </div>
        <span className="text-[10px] opacity-80 font-normal">
          ← スワイプで全て見る →
        </span>
      </div>
      <div className="p-3 overflow-x-auto">
        <div className="flex gap-3 min-w-min">
          {movers.map((m, i) => (
            <MoverCard key={m.cardId} mover={m} type={type} rank={i + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function formatUpdateDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];
  const w = weekDays[d.getDay()];
  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const label = isToday ? "（今日）" : "";
  return `${y}年${m}月${day}日（${w}）${label}`;
}

export default function DailyMovers({
  gainers,
  losers,
  updatedAt,
}: {
  gainers: CardMover[];
  losers: CardMover[];
  updatedAt?: string | null;
}) {
  if (gainers.length === 0 && losers.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="mb-6 pb-1 border-b-4 border-orange-400">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 mb-1">
          <span>📈</span>
          <span>価格変動ランキング</span>
        </h2>
        {updatedAt && (
          <p className="text-[11px] sm:text-xs text-gray-500 flex items-center gap-1">
            <span>📅</span>
            <span>{formatUpdateDate(updatedAt)} 更新</span>
          </p>
        )}
      </div>

      <div className="space-y-4">
        {/* 上段：上昇中 */}
        <MoverRow
          title={`🔥 上昇中のカード TOP${gainers.length}`}
          icon="📈"
          movers={gainers}
          type="gainer"
          gradient="bg-gradient-to-r from-pink-500 to-rose-500"
        />

        {/* 下段：下落中 */}
        <MoverRow
          title={`📉 下落中のカード TOP${losers.length}`}
          icon="📉"
          movers={losers}
          type="loser"
          gradient="bg-gradient-to-r from-cyan-600 to-blue-500"
        />
      </div>

      <p className="text-[10px] text-gray-400 mt-3 text-right">
        ※ 直近2回の販売価格データを比較した変動率順
      </p>
    </section>
  );
}
