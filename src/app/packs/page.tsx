import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "拡張パック一覧",
  description:
    "ポケモンカードゲームの拡張パック一覧。各パックの収録カード・当たりカード情報をチェック。",
};

const packs = [
  {
    slug: "chouden-breaker",
    name: "超電ブレイカー",
    releaseDate: "2026年3月28日",
    description: "電気タイプの強力なexポケモンが多数収録された最新パック。",
  },
  {
    slug: "hengen-no-kamen",
    name: "変幻の仮面",
    releaseDate: "2025年12月15日",
    description: "美しいSARイラストが話題の人気パック。ミュウツーexが目玉。",
  },
];

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {packs.map((pack) => (
          <Link
            key={pack.slug}
            href={`/packs/${pack.slug}`}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
          >
            <div className="h-40 bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center text-6xl">
              📦
            </div>
            <div className="p-5">
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {pack.name}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                発売日: {pack.releaseDate}
              </p>
              <p className="text-sm text-gray-600 mt-2">{pack.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
