import type { BoxMover } from "@/lib/boxHistory";

const formatYen = (n: number) => `¥${n.toLocaleString()}`;

function BoxCard({
  mover,
  type,
  rank,
}: {
  mover: BoxMover;
  type: "gainer" | "loser";
  rank: number;
}) {
  const isGainer = type === "gainer";
  const sign = mover.delta > 0 ? "+" : "";
  const deltaColor = isGainer ? "text-pink-600" : "text-cyan-700";
  const deltaBg = isGainer ? "bg-pink-50" : "bg-cyan-50";
  const borderColor = isGainer ? "border-pink-200" : "border-cyan-200";
  const arrow = isGainer ? "▲" : "▼";

  return (
    <div
      className={`shrink-0 w-40 sm:w-44 bg-white rounded-xl border-2 ${borderColor} shadow-sm overflow-hidden relative`}
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

      {/* BOX 画像エリア（プレースホルダー） */}
      <div className="w-full aspect-[4/5] bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center relative">
        <span className="text-5xl opacity-40">📦</span>
        {!mover.shrinked && (
          <span className="absolute bottom-2 right-2 text-[9px] bg-gray-800/80 text-white px-1.5 py-0.5 rounded">
            シュリンクなし
          </span>
        )}
      </div>

      {/* 情報エリア */}
      <div className="p-2">
        <h4 className="text-[11px] font-bold text-gray-900 line-clamp-2 leading-tight min-h-[28px] mb-1">
          {mover.name}
        </h4>

        {/* 変動額（大きく）＋変動率（小さく） */}
        <div className={`${deltaBg} rounded px-1.5 py-1 text-center`}>
          <div className={`text-sm font-black ${deltaColor} leading-tight`}>
            {arrow} {sign}
            {formatYen(mover.delta)}
          </div>
          <div className={`text-[9px] ${deltaColor} font-bold mt-0.5`}>
            {Math.abs(mover.deltaPercent).toFixed(1)}%
          </div>
        </div>

        {/* 現在価格 */}
        <div className="text-[9px] text-gray-500 text-center mt-1">
          現在{" "}
          <span className="font-bold text-gray-700">
            {formatYen(mover.currentPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}

function BoxRow({
  title,
  icon,
  movers,
  type,
  gradient,
}: {
  title: string;
  icon: string;
  movers: BoxMover[];
  type: "gainer" | "loser";
  gradient: string;
}) {
  if (movers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden">
        <div
          className={`${gradient} text-white px-4 py-3 flex items-center gap-2 font-bold`}
        >
          <span>{icon}</span>
          <span>{title}</span>
        </div>
        <div className="p-8 text-center text-sm text-gray-500">
          該当BOXがありません
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden">
      <div
        className={`${gradient} text-white px-4 py-3 flex items-center justify-between gap-2 font-bold`}
      >
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
            <BoxCard key={m.boxId} mover={m} type={type} rank={i + 1} />
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

export default function BoxMovers({
  gainers,
  losers,
  updatedAt,
}: {
  gainers: BoxMover[];
  losers: BoxMover[];
  updatedAt?: string | null;
}) {
  if (gainers.length === 0 && losers.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="mb-6 pb-1 border-b-4 border-orange-400">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 mb-1">
          <span>📦</span>
          <span>BOX価格変動ランキング</span>
        </h2>
        {updatedAt && (
          <p className="text-[11px] sm:text-xs text-gray-500 flex items-center gap-1">
            <span>📅</span>
            <span>{formatUpdateDate(updatedAt)} 更新</span>
          </p>
        )}
      </div>

      <div className="space-y-4">
        <BoxRow
          title={`🔥 上昇中のBOX TOP${gainers.length}`}
          icon="📈"
          movers={gainers}
          type="gainer"
          gradient="bg-gradient-to-r from-pink-500 to-rose-500"
        />
        <BoxRow
          title={`📉 下落中のBOX TOP${losers.length}`}
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
