import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { CATEGORIES, SITE_NAME, SITE_URL } from "@/lib/constants";
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

  // Simple markdown-to-html (headings, bold, lists, tables, paragraphs)
  const htmlContent = article.content
    .split("\n")
    .map((line) => {
      if (line.startsWith("### ")) return `<h3 class="text-lg font-bold mt-6 mb-2 text-gray-900">${line.slice(4)}</h3>`;
      if (line.startsWith("## ")) return `<h2 class="text-xl font-bold mt-8 mb-3 text-gray-900">${line.slice(3)}</h2>`;
      if (line.startsWith("| ")) return line;
      if (line.startsWith("- ")) return `<li class="ml-4 text-gray-700">${line.slice(2)}</li>`;
      if (line.match(/^\d+\. /)) return `<li class="ml-4 text-gray-700 list-decimal">${line.replace(/^\d+\. /, "")}</li>`;
      if (line.trim() === "") return "<br />";
      return `<p class="text-gray-700 leading-relaxed mb-2">${line}</p>`;
    })
    .join("\n")
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');

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

        <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-8 flex items-center justify-center text-6xl opacity-50">
          🎴
        </div>

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
