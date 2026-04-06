import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types";
import { CATEGORIES } from "@/lib/constants";

export default function ArticleCard({ article }: { article: Article }) {
  const category = CATEGORIES.find((c) => c.id === article.category);
  const hasThumbnail =
    article.thumbnail &&
    article.thumbnail !== "/images/default-thumb.svg" &&
    article.thumbnail !== "/images/default-thumb.jpg";

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
    >
      <div className="h-36 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
        {hasThumbnail ? (
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-30">
            🎴
          </div>
        )}
        {category && (
          <span
            className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded ${category.color} z-10`}
          >
            {category.label}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm leading-relaxed">
          {article.title}
        </h3>
        <time className="text-xs text-gray-500 mt-2 block">
          {article.date}
        </time>
      </div>
    </Link>
  );
}
