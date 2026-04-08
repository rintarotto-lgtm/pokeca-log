import { notFound } from "next/navigation";
import Image from "next/image";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { CATEGORIES, SITE_NAME, SITE_URL } from "@/lib/constants";
import { renderMarkdown, extractHeadings } from "@/lib/markdown";
import { getCardHistory } from "@/lib/cardHistory";
import { getRanking } from "@/lib/rankings";
import CardPriceHistoryChart from "@/components/CardPriceHistoryChart";
import QuotedImage from "@/components/QuotedImage";
import TableOfContents from "@/components/TableOfContents";
import RankingList from "@/components/RankingList";
import CustomComments from "@/components/CustomComments";
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
      images: article.eyecatch ? [{ url: article.eyecatch }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const category = CATEGORIES.find((c) => c.id === article.category);
  const htmlContent = renderMarkdown(article.content);
  const headings = article.toc !== false ? extractHeadings(article.content) : [];

  const chartData = article.chartCardId
    ? getCardHistory(article.chartCardId)
    : null;

  const ranking = article.rankingId ? getRanking(article.rankingId) : null;

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
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

      {/* パンくず */}
      <nav className="text-[11px] sm:text-xs text-gray-500 mb-4 sm:mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-orange-600">
          ホーム
        </Link>
        <span>›</span>
        <Link href="/articles" className="hover:text-orange-600">
          記事一覧
        </Link>
        <span>›</span>
        <span className="text-gray-700 line-clamp-1 max-w-[200px] sm:max-w-none">
          {article.title}
        </span>
      </nav>

      <article className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8">
        {/* 記事ヘッダー */}
        <header className="mb-5 pb-5 sm:mb-6 sm:pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2 flex-wrap mb-2 sm:mb-3">
            {category && (
              <span
                className={`text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full ${category.color}`}
              >
                {category.label}
              </span>
            )}
            <time className="text-[10px] sm:text-xs text-gray-500">
              📅 {article.date} 更新
            </time>
          </div>
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-snug sm:leading-tight tracking-tight">
            {article.title}
          </h1>
          {article.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mt-2 sm:mt-3">
              {article.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium border border-orange-100"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* アイキャッチ画像 */}
        {article.eyecatch ? (
          article.eyecatchSource ? (
            <QuotedImage
              src={article.eyecatch}
              alt={article.title}
              sourceUrl={article.eyecatchSource}
              variant="banner"
            />
          ) : (
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
          )
        ) : null}

        {/* 概要 */}
        {article.description && (
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4 my-6 border-l-4 border-orange-400">
            {article.description}
          </p>
        )}

        {/* こんな方におすすめ */}
        {article.recommended && article.recommended.length > 0 && (
          <div className="my-8 rounded-2xl border-2 border-orange-300 overflow-hidden shadow-sm">
            <div className="bg-orange-500 text-white px-5 py-3 font-bold flex items-center gap-2">
              <span>✅</span>
              <span>こんな方におすすめ</span>
            </div>
            <ul className="bg-orange-50 px-6 py-4 space-y-2 list-disc marker:text-orange-400">
              {article.recommended.map((item, i) => (
                <li key={i} className="text-gray-800 text-sm sm:text-base">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 目次 */}
        {headings.length > 0 && <TableOfContents headings={headings} />}

        {/* ランキング（rankingIdが指定されていればトップに表示） */}
        {ranking && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mt-12 mb-5 text-gray-900 pb-2 border-b-4 border-orange-400">
              当たりカードランキング TOP{ranking.cards.length}（販売価格順）
            </h2>
            <RankingList data={ranking} sortMode="salePrice" />
          </div>
        )}

        {/* カード画像（チャートの上に表示） */}
        {article.cardImage &&
          (article.cardImageSource ? (
            <QuotedImage
              src={article.cardImage}
              alt={article.title}
              sourceUrl={article.cardImageSource}
              variant="card"
            />
          ) : (
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
          ))}

        {/* 価格チャート */}
        {chartData && <CardPriceHistoryChart data={chartData} />}

        {/* 本文 */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* コメント欄 */}
        <CustomComments slug={slug} />
      </article>

      {/* フッターナビ */}
      <div className="mt-8 flex items-center justify-between gap-3 flex-wrap">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1 px-4 py-2 bg-white border-2 border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors text-sm font-bold"
        >
          ← 記事一覧
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-bold"
        >
          ホームへ →
        </Link>
      </div>
    </div>
  );
}
