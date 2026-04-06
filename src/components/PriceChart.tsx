"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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

  const chartData = history.map((entry) => ({
    date: formatDate(entry.date),
    ...entry.prices,
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h3 className="font-bold text-gray-900 mb-4 text-base">
        {cardName} の価格推移
      </h3>
      <div className="h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatYen}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
              width={70}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatYen(value),
                name,
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
            />
            {shops.map((shop) => (
              <Line
                key={shop}
                type="monotone"
                dataKey={shop}
                stroke={SHOP_COLORS[shop] ?? "#888"}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 mt-3 text-right">
        ※ 過去6週間の価格推移を表示しています
      </p>
    </div>
  );
}
