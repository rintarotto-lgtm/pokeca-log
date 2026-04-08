"use client";

import { useEffect, useRef } from "react";

/**
 * Giscus (GitHub Discussions ベースのコメントシステム)
 *
 * セットアップ手順:
 *   1. https://giscus.app にアクセス
 *   2. リポジトリ名を入力 (rintarotto-lgtm/pokeca-log)
 *   3. Discussion カテゴリを選択 (例: "Announcements" or "Q&A")
 *   4. 生成された data-repo-id と data-category-id を環境変数に設定
 *
 * 環境変数 (Vercel):
 *   NEXT_PUBLIC_GISCUS_REPO=rintarotto-lgtm/pokeca-log
 *   NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDOxxxxxxx
 *   NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
 *   NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOxxxxxxxxxxxxxxx
 */
export default function GiscusComments({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  useEffect(() => {
    if (!repo || !repoId || !category || !categoryId) return;
    if (!ref.current) return;
    if (ref.current.querySelector("script")) return; // 2重ロード防止

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "ja");
    script.setAttribute("data-loading", "lazy");

    ref.current.appendChild(script);
  }, [repo, repoId, category, categoryId, slug]);

  // 環境変数が設定されていない場合は案内を表示
  if (!repo || !repoId || !category || !categoryId) {
    return (
      <section className="mt-10 bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 text-center">
        <div className="text-3xl mb-2">💬</div>
        <p className="text-sm text-gray-700 font-bold mb-1">
          コメント欄は準備中です
        </p>
        <p className="text-xs text-gray-500">
          近日中にコメント機能を公開します。お楽しみに！
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2 pb-1 border-b-4 border-orange-400">
        <span>💬</span>
        <span>コメント・掲示板</span>
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        コメントは GitHub アカウントでログインして投稿できます。
        ポケカ情報の交換、質問、感想などご自由にどうぞ！
      </p>
      <div ref={ref} className="giscus-wrapper" />
    </section>
  );
}
