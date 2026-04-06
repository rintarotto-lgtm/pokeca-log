import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Article, ArticleWithContent } from "@/types";

const articlesDirectory = path.join(process.cwd(), "content/articles");

export function getAllArticles(): Article[] {
  if (!fs.existsSync(articlesDirectory)) return [];
  const fileNames = fs.readdirSync(articlesDirectory);
  const articles = fileNames
    .filter((name) => name.endsWith(".mdx") || name.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, "");
      const filePath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);
      return {
        slug,
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        category: data.category ?? "news",
        tags: data.tags ?? [],
        thumbnail: data.thumbnail ?? "/images/default-thumb.svg",
        popular: data.popular ?? false,
        packSlug: data.packSlug,
        chartCardId: data.chartCardId,
      } satisfies Article;
    });
  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getArticleBySlug(slug: string): ArticleWithContent | null {
  const extensions = [".mdx", ".md"];
  for (const ext of extensions) {
    const filePath = path.join(articlesDirectory, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);
      return {
        slug,
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        category: data.category ?? "news",
        tags: data.tags ?? [],
        thumbnail: data.thumbnail ?? "/images/default-thumb.svg",
        popular: data.popular ?? false,
        packSlug: data.packSlug,
        chartCardId: data.chartCardId,
        content,
      };
    }
  }
  return null;
}

export function getArticlesByPack(packSlug: string): Article[] {
  return getAllArticles().filter((a) => a.packSlug === packSlug);
}

export function getPopularArticles(): Article[] {
  return getAllArticles().filter((a) => a.popular);
}
