"use client";

import { useState, useRef } from "react";
import type { CardPriceHistoryData } from "@/lib/cardHistory";

const SALE_COLOR = "#06b6d4"; // cyan-500
const BUY_COLOR = "#ec4899"; // pink-500
const MERCARI_COLOR = "#f97316"; // orange-500

function formatYen(value: number) {
  return `¥${value.toLocaleString()}`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatFullDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export default function CardPriceHistoryChart({
  data,
}: {
  data: CardPriceHistoryData;
}) {
  const {
    history,
    cardName,
    currentSale,
    currentBuy,
    currentMercari,
    psa10CurrentSale,
    psa10CurrentBuy,
    initialSale,
    maxSale,
  } = data;

  const hasPsa10 =
    typeof psa10CurrentSale === "number" || typeof psa10CurrentBuy === "number";

  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (history.length < 2) return null;

  const hasMercari = history.some((h) => typeof h.mercari === "number");

  // Y軸の範囲計算（メルカリも含む）
  const allValues = history.flatMap((h) => {
    const vals = [h.sale, h.buy];
    if (typeof h.mercari === "number") vals.push(h.mercari);
    return vals;
  });
  const minPrice = Math.min(...allValues);
  const maxPrice = Math.max(...allValues);
  const yMin = Math.floor((minPrice * 0.95) / 5000) * 5000;
  const yMax = Math.ceil((maxPrice * 1.05) / 5000) * 5000;
  const range = yMax - yMin || 1;

  const chartWidth = 100;
  const chartHeight = 280;
  const paddingTop = 20;
  const paddingBottom = 30;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const getPoint = (index: number, price: number) => {
    const x = (index / Math.max(history.length - 1, 1)) * chartWidth;
    const y = paddingTop + ((yMax - price) / range) * innerHeight;
    return { x, y };
  };

  const buildPath = (key: "sale" | "buy" | "mercari") => {
    const pts: { x: number; y: number }[] = [];
    history.forEach((h, i) => {
      const v = h[key];
      if (typeof v === "number") {
        pts.push(getPoint(i, v));
      }
    });
    return pts
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");
  };

  const salePath = buildPath("sale");
  const buyPath = buildPath("buy");
  const mercariPath = hasMercari ? buildPath("mercari") : "";

  // Y軸ラベル（5段階）
  const ySteps = 4;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => {
    const value = yMax - (range / ySteps) * i;
    return Math.round(value / 1000) * 1000;
  });

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, relativeX / rect.width));
    const idx = Math.round(ratio * (history.length - 1));
    setHoveredIndex(idx);
  };

  const handleMouseLeave = () => setHoveredIndex(null);

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current || !e.touches[0]) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relativeX = e.touches[0].clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, relativeX / rect.width));
    const idx = Math.round(ratio * (history.length - 1));
    setHoveredIndex(idx);
  };

  const hovered = hoveredIndex !== null ? history[hoveredIndex] : null;
  const hoveredSalePoint =
    hoveredIndex !== null ? getPoint(hoveredIndex, history[hoveredIndex].sale) : null;
  const hoveredBuyPoint =
    hoveredIndex !== null ? getPoint(hoveredIndex, history[hoveredIndex].buy) : null;
  const hoveredMercariPoint =
    hoveredIndex !== null && typeof history[hoveredIndex].mercari === "number"
      ? getPoint(hoveredIndex, history[hoveredIndex].mercari as number)
      : null;

  // tooltip位置計算（最も上にあるポイントの上に表示）
  const allHoveredPoints = [
    hoveredSalePoint,
    hoveredBuyPoint,
    hoveredMercariPoint,
  ].filter((p): p is { x: number; y: number } => p !== null);
  const topY =
    allHoveredPoints.length > 0
      ? Math.min(...allHoveredPoints.map((p) => p.y))
      : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 my-8">
      {/* ヘッダー部分 */}
      <div className="border-b pb-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <h3 className="font-bold text-gray-900 text-base sm:text-lg">
            {cardName} の価格推移
          </h3>
          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-normal">
            素体
          </span>
        </div>
        <div
          className={`grid gap-2 sm:gap-3 text-sm ${hasMercari ? "grid-cols-3" : "grid-cols-2"}`}
        >
          <div className="bg-cyan-50 rounded px-2 sm:px-3 py-2">
            <div className="text-[10px] sm:text-xs text-gray-600 mb-1">
              販売価格
            </div>
            <div className="font-bold text-cyan-700 text-sm sm:text-lg leading-tight">
              約 {formatYen(currentSale)}
            </div>
          </div>
          <div className="bg-pink-50 rounded px-2 sm:px-3 py-2">
            <div className="text-[10px] sm:text-xs text-gray-600 mb-1">
              買取価格
            </div>
            <div className="font-bold text-pink-700 text-sm sm:text-lg leading-tight">
              約 {formatYen(currentBuy)}
            </div>
          </div>
          {hasMercari && currentMercari !== undefined && (
            <div className="bg-orange-50 rounded px-2 sm:px-3 py-2">
              <div className="text-[10px] sm:text-xs text-gray-600 mb-1">
                メルカリ相場
              </div>
              <div className="font-bold text-orange-700 text-sm sm:text-lg leading-tight">
                約 {formatYen(currentMercari)}
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mt-3">
          <div>
            初動販売価格：<strong>{formatYen(initialSale)}</strong>
          </div>
          <div>
            過去最高販売価格：<strong>{formatYen(maxSale)}</strong>
          </div>
        </div>

        {/* PSA10 併記 */}
        {hasPsa10 && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-xs font-bold text-amber-800">
                🏅 PSA10 鑑定品の参考価格
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {typeof psa10CurrentSale === "number" && (
                <div>
                  <span className="text-gray-600">販売：</span>
                  <strong className="text-amber-900">
                    {formatYen(psa10CurrentSale)}
                  </strong>
                </div>
              )}
              {typeof psa10CurrentBuy === "number" && (
                <div>
                  <span className="text-gray-600">買取：</span>
                  <strong className="text-amber-900">
                    {formatYen(psa10CurrentBuy)}
                  </strong>
                </div>
              )}
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              ※ PSA10鑑定済みの美品価格。グラフは素体価格のみ。
            </p>
          </div>
        )}
      </div>

      {/* チャート本体 */}
      <div className="relative">
        <div className="flex">
          {/* Y軸ラベル */}
          <div
            className="w-16 shrink-0 relative text-right pr-2"
            style={{ height: chartHeight }}
          >
            {yLabels.map((label, i) => (
              <span
                key={i}
                className="absolute right-2 text-xs text-gray-500"
                style={{
                  top: paddingTop + (innerHeight / ySteps) * i - 7,
                }}
              >
                {formatYen(label)}
              </span>
            ))}
          </div>

          {/* SVGチャート */}
          <div className="flex-1 relative">
            <svg
              ref={svgRef}
              viewBox={`-1 0 ${chartWidth + 2} ${chartHeight}`}
              preserveAspectRatio="none"
              className="w-full cursor-crosshair"
              style={{ height: chartHeight }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseLeave}
            >
              {/* グリッド線 */}
              {yLabels.map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={paddingTop + (innerHeight / ySteps) * i}
                  x2={chartWidth}
                  y2={paddingTop + (innerHeight / ySteps) * i}
                  stroke="#f3f4f6"
                  strokeWidth="0.3"
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              {/* ホバー時の縦ガイドライン */}
              {hoveredIndex !== null && hoveredSalePoint && (
                <line
                  x1={hoveredSalePoint.x}
                  y1={paddingTop}
                  x2={hoveredSalePoint.x}
                  y2={paddingTop + innerHeight}
                  stroke="#9ca3af"
                  strokeWidth="0.5"
                  strokeDasharray="2 2"
                  vectorEffect="non-scaling-stroke"
                />
              )}

              {/* 販売価格の線 */}
              <path
                d={salePath}
                fill="none"
                stroke={SALE_COLOR}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />

              {/* 買取価格の線 */}
              <path
                d={buyPath}
                fill="none"
                stroke={BUY_COLOR}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />

              {/* メルカリ相場の線 */}
              {hasMercari && (
                <path
                  d={mercariPath}
                  fill="none"
                  stroke={MERCARI_COLOR}
                  strokeWidth="2"
                  strokeDasharray="3 2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              )}

              {/* データポイント */}
              {history.map((h, i) => {
                const sp = getPoint(i, h.sale);
                const bp = getPoint(i, h.buy);
                const mp =
                  typeof h.mercari === "number"
                    ? getPoint(i, h.mercari)
                    : null;
                const isHovered = hoveredIndex === i;
                return (
                  <g key={i}>
                    <circle
                      cx={sp.x}
                      cy={sp.y}
                      r={isHovered ? 5 : 3}
                      fill="white"
                      stroke={SALE_COLOR}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle
                      cx={bp.x}
                      cy={bp.y}
                      r={isHovered ? 5 : 3}
                      fill="white"
                      stroke={BUY_COLOR}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      vectorEffect="non-scaling-stroke"
                    />
                    {mp && (
                      <circle
                        cx={mp.x}
                        cy={mp.y}
                        r={isHovered ? 5 : 3}
                        fill="white"
                        stroke={MERCARI_COLOR}
                        strokeWidth={isHovered ? 2.5 : 1.5}
                        vectorEffect="non-scaling-stroke"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Tooltip */}
            {hovered && hoveredSalePoint && (
              <div
                className="absolute pointer-events-none z-10"
                style={{
                  left: `${hoveredSalePoint.x}%`,
                  top: `${topY - 10}px`,
                  transform: `translate(${hoveredIndex === 0 ? "0" : hoveredIndex === history.length - 1 ? "-100%" : "-50%"}, -100%)`,
                }}
              >
                <div className="bg-gray-900/95 text-white rounded-lg shadow-lg px-3 py-2 text-xs whitespace-nowrap">
                  <div className="font-bold mb-1 text-gray-300">
                    {formatFullDate(hovered.date)}
                  </div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: SALE_COLOR }}
                    />
                    <span>販売：</span>
                    <span className="font-bold">
                      {formatYen(hovered.sale)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: BUY_COLOR }}
                    />
                    <span>買取：</span>
                    <span className="font-bold">
                      {formatYen(hovered.buy)}
                    </span>
                  </div>
                  {typeof hovered.mercari === "number" && (
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: MERCARI_COLOR }}
                      />
                      <span>メルカリ：</span>
                      <span className="font-bold">
                        {formatYen(hovered.mercari)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* X軸ラベル */}
            <div className="flex justify-between mt-1 px-1">
              {history.map((h, i) => {
                const showLabel =
                  i === 0 ||
                  i === history.length - 1 ||
                  i === Math.floor(history.length / 2);
                return (
                  <span
                    key={i}
                    className="text-xs text-gray-500"
                    style={{
                      flex: "1 1 0",
                      textAlign:
                        i === 0
                          ? "left"
                          : i === history.length - 1
                            ? "right"
                            : "center",
                    }}
                  >
                    {showLabel ? formatDate(h.date) : ""}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* 凡例 */}
        <div className="flex gap-4 sm:gap-6 mt-4 justify-center flex-wrap">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-1 rounded"
              style={{ backgroundColor: SALE_COLOR }}
            />
            <span className="text-xs text-gray-700 font-medium">販売価格</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-1 rounded"
              style={{ backgroundColor: BUY_COLOR }}
            />
            <span className="text-xs text-gray-700 font-medium">買取価格</span>
          </div>
          {hasMercari && (
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-4 h-1 rounded"
                style={{
                  backgroundColor: MERCARI_COLOR,
                  backgroundImage:
                    "repeating-linear-gradient(90deg, " +
                    MERCARI_COLOR +
                    " 0, " +
                    MERCARI_COLOR +
                    " 3px, transparent 3px, transparent 5px)",
                }}
              />
              <span className="text-xs text-gray-700 font-medium">
                メルカリ相場
              </span>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4 text-right">
        ※ チャート上をマウスオーバー（スマホは長押し）で詳細を表示
      </p>
      <p className="text-xs text-gray-400 mt-1 text-right">
        最終更新：{data.lastUpdated}
      </p>
    </div>
  );
}
