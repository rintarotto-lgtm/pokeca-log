import { notFound } from "next/navigation";
import Image from "next/image";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { CATEGORIES, SITE_NAME, SITE_URL } from "@/lib/constants";
import { renderMarkdown } from "@/lib/markdown";
import { getCardHistory } from "@/lib/cardHistory";
import CardPriceHistoryChart from "@/components/CardPriceHistoryChart";
import Link from "next/link";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      url: `${SITE_URL}/articles/${slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const category = CATEGORIES.find((c) => c.id === article.category);

  const htmlContent = renderMarkdown(article.content);

  const chartData = article.chartCardId
    ? getCardHistory(article.chartCardId)
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.description,
            datePublished: article.date,
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
            },
          }),
        }}
      />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        <span>{article.title}</span>
      </nav>

      <article>
        <div className="mb-6">
          {category && (
            <span
              className={`text-xs font-bold px-2 py-1 rounded ${category.color}`}
            >
              {category.label}
            </span>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mt-3 leading-relaxed">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <time>{article.date}</time>
            {article.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* アイキャッチ画像 */}
        {article.eyecatch ? (
          <div className="aspect-[1200/630] relative rounded-lg overflow-hidden mb-8 bg-gray-100">
            <Image
              src={article.eyecatch}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-8 flex items-center justify-center text-6xl opacity-50">
            🎴
          </div>
        )}

        {/* カード画像（チャートの上に表示） */}
        {article.cardImage && (
          <div className="flex justify-center mb-6">
            <div className="relative w-64 sm:w-72">
              <Image
                src={article.cardImage}
                alt={article.title}
                width={400}
                height={560}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}

        {chartData && <CardPriceHistoryChart data={chartData} />}

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>

      <div className="mt-12 pt-6 border-t">
        <Link
          href="/"
          className="text-blue-600 hover:underline text-sm"
        >
          ← トップに戻る
        </Link>
      </div>
    </div>
  );
}
