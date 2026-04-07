"use client";

import { useState, useRef } from "react";
import type { CardPriceHistoryData } from "@/lib/cardHistory";

const SALE_COLOR = "#06b6d4"; // cyan-500
const BUY_COLOR = "#ec4899"; // pink-500

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
  const { history, cardName, currentSale, currentBuy, initialSale, maxSale } =
    data;

  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (history.length < 2) return null;

  // Y軸の範囲計算
  const allValues = history.flatMap((h) => [h.sale, h.buy]);
  const minPrice = Math.min(...allValues);
  const maxPrice = Math.max(...allValues);
  const yMin = Math.floor((minPrice * 0.95) / 5000) * 5000;
  const yMax = Math.ceil((maxPrice * 1.05) / 5000) * 5000;
  const range = yMax - yMin || 1;

  // チャートのサイズ
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

  const buildPath = (key: "sale" | "buy") =>
    history
      .map((h, i) => {
        const point = getPoint(i, h[key]);
        return `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`;
      })
      .join(" ");

  const salePath = buildPath("sale");
  const buyPath = buildPath("buy");

  // Y軸ラベル（5段階）
  const ySteps = 4;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => {
    const value = yMax - (range / ySteps) * i;
    return Math.round(value / 1000) * 1000;
  });

  // マウス位置から最も近いデータポイントのindex を取得
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, relativeX / rect.width));
    const idx = Math.round(ratio * (history.length - 1));
    setHoveredIndex(idx);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

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
    hoveredIndex !== null
      ? getPoint(hoveredIndex, history[hoveredIndex].sale)
      : null;
  const hoveredBuyPoint =
    hoveredIndex !== null
      ? getPoint(hoveredIndex, history[hoveredIndex].buy)
      : null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 my-8">
      {/* ヘッダー部分 */}
      <div className="border-b pb-4 mb-4">
        <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-3">
          {cardName} の価格推移
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-cyan-50 rounded px-3 py-2">
            <div className="text-xs text-gray-600 mb-1">販売価格</div>
            <div className="font-bold text-cyan-700 text-lg">
              約 {formatYen(currentSale)}
            </div>
          </div>
          <div className="bg-pink-50 rounded px-3 py-2">
            <div className="text-xs text-gray-600 mb-1">買取価格</div>
            <div className="font-bold text-pink-700 text-lg">
              約 {formatYen(currentBuy)}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mt-3">
          <div>
            初動販売価格：<strong>{formatYen(initialSale)}</strong>
          </div>
          <div>
            過去最高販売価格：<strong>{formatYen(maxSale)}</strong>
          </div>
        </div>
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

              {/* データポイント */}
              {history.map((h, i) => {
                const sp = getPoint(i, h.sale);
                const bp = getPoint(i, h.buy);
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
                  </g>
                );
              })}
            </svg>

            {/* Tooltip (HTMLオーバーレイ) */}
            {hovered && hoveredSalePoint && (
              <div
                className="absolute pointer-events-none z-10"
                style={{
                  left: `${hoveredSalePoint.x}%`,
                  top: `${Math.min(hoveredSalePoint.y, hoveredBuyPoint?.y ?? 0) - 10}px`,
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
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: BUY_COLOR }}
                    />
                    <span>買取：</span>
                    <span className="font-bold">
                      {formatYen(hovered.buy)}
                    </span>
                  </div>
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
        <div className="flex gap-6 mt-4 justify-center">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-1 rounded"
              style={{ backgroundColor: SALE_COLOR }}
            />
            <span className="text-xs text-gray-700 font-medium">
              販売価格
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-1 rounded"
              style={{ backgroundColor: BUY_COLOR }}
            />
            <span className="text-xs text-gray-700 font-medium">
              買取価格
            </span>
          </div>
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
