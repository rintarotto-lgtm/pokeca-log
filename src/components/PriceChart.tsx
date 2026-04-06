import type { PriceHistoryEntry } from "@/lib/prices";

const SHOP_COLORS: Record<string, string> = {
  駿河屋: "#e74c3c",
  カードラッシュ: "#3498db",
  遊々亭: "#2ecc71",
  メルカリ相場: "#f39c12",
  トレトク: "#9b59b6",
};

function formatYen(value: number) {
  return `¥${value.toLocaleString()}`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function PriceChart({
  history,
  cardName,
}: {
  history: PriceHistoryEntry[];
  cardName: string;
}) {
  const shops = Object.keys(history[0]?.prices ?? {});

  // すべての価格を集めて min/max を求める
  const allPrices = history.flatMap((h) => Object.values(h.prices));
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const range = maxPrice - minPrice || 1;

  // チャートのサイズ
  const chartWidth = 100; // %
  const chartHeight = 240; // px
  const paddingTop = 20;
  const paddingBottom = 30;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  // ポイント座標を計算
  const getPoint = (priceIndex: number, price: number) => {
    const x = (priceIndex / Math.max(history.length - 1, 1)) * chartWidth;
    const y = paddingTop + ((maxPrice - price) / range) * innerHeight;
    return { x, y };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h3 className="font-bold text-gray-900 mb-4 text-base">
        {cardName} の価格推移
      </h3>

      {/* チャート本体 */}
      <div className="relative">
        {/* Y軸ラベル */}
        <div className="flex">
          <div className="w-16 shrink-0 relative" style={{ height: chartHeight }}>
            <span
              className="absolute right-2 text-xs text-gray-500"
              style={{ top: paddingTop - 6 }}
            >
              {formatYen(maxPrice)}
            </span>
            <span
              className="absolute right-2 text-xs text-gray-500"
              style={{ top: paddingTop + innerHeight / 2 - 6 }}
            >
              {formatYen(Math.round((maxPrice + minPrice) / 2))}
            </span>
            <span
              className="absolute right-2 text-xs text-gray-500"
              style={{ top: paddingTop + innerHeight - 6 }}
            >
              {formatYen(minPrice)}
            </span>
          </div>

          {/* SVGチャート */}
          <div className="flex-1 relative">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
              className="w-full"
              style={{ height: chartHeight }}
            >
              {/* グリッド線 */}
              <line
                x1="0"
                y1={paddingTop}
                x2={chartWidth}
                y2={paddingTop}
                stroke="#f0f0f0"
                strokeWidth="0.3"
              />
              <line
                x1="0"
                y1={paddingTop + innerHeight / 2}
                x2={chartWidth}
                y2={paddingTop + innerHeight / 2}
                stroke="#f0f0f0"
                strokeWidth="0.3"
              />
              <line
                x1="0"
                y1={paddingTop + innerHeight}
                x2={chartWidth}
                y2={paddingTop + innerHeight}
                stroke="#f0f0f0"
                strokeWidth="0.3"
              />

              {/* 各ショップの線 */}
              {shops.map((shop) => {
                const points = history
                  .map((h, i) => {
                    const price = h.prices[shop];
                    if (price === undefined) return null;
                    return getPoint(i, price);
                  })
                  .filter((p): p is { x: number; y: number } => p !== null);

                const path = points
                  .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
                  .join(" ");

                return (
                  <g key={shop}>
                    <path
                      d={path}
                      fill="none"
                      stroke={SHOP_COLORS[shop] ?? "#888"}
                      strokeWidth="0.6"
                      vectorEffect="non-scaling-stroke"
                    />
                    {points.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="0.8"
                        fill={SHOP_COLORS[shop] ?? "#888"}
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                  </g>
                );
              })}
            </svg>

            {/* X軸ラベル */}
            <div className="flex justify-between mt-1 px-1">
              {history.map((h, i) => (
                <span
                  key={i}
                  className="text-xs text-gray-500"
                  style={{
                    flex: i === 0 || i === history.length - 1 ? "0 0 auto" : "1 1 0",
                    textAlign:
                      i === 0
                        ? "left"
                        : i === history.length - 1
                          ? "right"
                          : "center",
                  }}
                >
                  {i === 0 || i === history.length - 1 || i === Math.floor(history.length / 2)
                    ? formatDate(h.date)
                    : ""}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 凡例 */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 justify-center">
          {shops.map((shop) => (
            <div key={shop} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: SHOP_COLORS[shop] ?? "#888" }}
              />
              <span className="text-xs text-gray-700">{shop}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-right">
        ※ 過去6週間の価格推移を表示しています
      </p>
    </div>
  );
}
