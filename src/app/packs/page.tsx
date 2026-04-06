import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "拡張パック一覧",
  description:
    "ポケモンカードゲームの拡張パック一覧。各パックの収録カード・当たりカード情報をチェック。",
};

export default function PacksPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        <span>拡張パック一覧</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">拡張パック一覧</h1>

      <div className="bg-white rounded-lg shadow-sm p-10 text-center">
        <div className="text-4xl mb-4">📦</div>
        <p className="text-gray-600">
          拡張パック情報は準備中です。もうしばらくお待ちください。
        </p>
      </div>
    </div>
  );
}
