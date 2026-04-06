import Link from "next/link";
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "サイトについて",
  description:
    "ポケカろぐは、ポケモンカードに関する情報をお届けするブログメディアです。運営方針や編集ポリシーをご紹介します。",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        <span>サイトについて</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {SITE_NAME}について
      </h1>

      <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 space-y-8">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            📒 サイトの目的
          </h2>
          <p className="text-gray-700 leading-relaxed">
            「ポケカろぐ」は、ポケモンカードゲーム（ポケカ）に関する最新情報・
            カード価格比較・新弾情報・初心者向けガイドをお届けするブログメディアです。
            ポケカを始めたばかりの方から、長くコレクションを楽しんでいる方まで、
            幅広い層に役立つ情報を発信することを目指しています。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            ✍️ 編集ポリシー
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-2">
              <span className="text-blue-600">●</span>
              <div>
                <strong className="font-bold">情報源の明示</strong>
                <br />
                記事内で紹介する情報は、公式発表・信頼できる複数のソースを確認した上で執筆しています。
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">●</span>
              <div>
                <strong className="font-bold">価格情報の鮮度</strong>
                <br />
                カード相場は日々変動するため、記事には執筆時点の日付を明記し、定期的に更新を行います。
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">●</span>
              <div>
                <strong className="font-bold">公平な情報提供</strong>
                <br />
                特定のショップやサービスを不当に推奨することはせず、ユーザーにとって有益な情報を公平にお届けします。
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">●</span>
              <div>
                <strong className="font-bold">訂正対応</strong>
                <br />
                誤った情報が含まれていた場合は速やかに訂正し、変更履歴を明示します。
              </div>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            📝 取り扱うコンテンツ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded px-4 py-3">
              <strong className="text-gray-900">📰 最新ニュース</strong>
              <p className="text-sm text-gray-600 mt-1">
                新弾発売情報・公式発表など
              </p>
            </div>
            <div className="bg-gray-50 rounded px-4 py-3">
              <strong className="text-gray-900">💰 価格情報</strong>
              <p className="text-sm text-gray-600 mt-1">
                カード相場・買取価格の動向
              </p>
            </div>
            <div className="bg-gray-50 rounded px-4 py-3">
              <strong className="text-gray-900">📦 新弾情報</strong>
              <p className="text-sm text-gray-600 mt-1">
                拡張パックの当たりカード解説
              </p>
            </div>
            <div className="bg-gray-50 rounded px-4 py-3">
              <strong className="text-gray-900">🎓 初心者向け</strong>
              <p className="text-sm text-gray-600 mt-1">
                ルール・始め方・用語解説
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            ⚠️ 免責事項
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm">
            当サイトに掲載されている価格情報・相場情報は、執筆時点の情報であり、
            実際の購入・売却価格を保証するものではありません。
            投資・転売目的でのカード購入判断は、ご自身の責任で行ってください。
          </p>
          <p className="text-gray-700 leading-relaxed text-sm mt-2">
            ポケモン、ポケモンカードは株式会社ポケモンおよび任天堂の商標です。
            当サイトは公式とは一切関係のない個人運営のメディアです。
          </p>
        </section>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          ← トップに戻る
        </Link>
      </div>
    </div>
  );
}
