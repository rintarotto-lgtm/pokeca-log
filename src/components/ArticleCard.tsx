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
  const displayImage = article.eyecatch || (hasThumbnail ? article.thumbnail : null);

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-orange-200 transition-all overflow-hidden group flex flex-col"
    >
      <div className="aspect-[1200/630] bg-gradient-to-br from-orange-100 to-amber-100 relative overflow-hidden">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-40">
            🎴
          </div>
        )}
        {category && (
          <span
            className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${category.color} z-10 shadow-sm`}
          >
            {category.label}
          </span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 text-sm sm:text-base leading-relaxed flex-1">
          {article.title}
        </h3>
        <time className="text-xs text-gray-500 mt-3 block">
          📅 {article.date}
        </time>
      </div>
    </Link>
  );
}
