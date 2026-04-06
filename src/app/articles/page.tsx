import { getAllArticles } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "記事一覧",
  description:
    "ポケカろぐの全記事一覧。ポケモンカードの最新情報・価格比較・初心者ガイドなど、すべての記事をご覧いただけます。",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        <span>記事一覧</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">記事一覧</h1>

      {articles.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center">
          <div className="text-4xl mb-4">📒</div>
          <p className="text-gray-600">記事を準備中です。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
