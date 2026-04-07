import Link from "next/link";
import { SITE_NAME, NAV_LINKS, CATEGORIES } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📒</span>
              <span className="text-lg font-bold text-white">{SITE_NAME}</span>
            </div>
            <p className="text-sm text-gray-400">
              ポケモンカードの価格比較・新弾情報・デッキ紹介をお届けするブログメディアです。
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">ページ</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-white transition-colors"
                >
                  サイトについて
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">カテゴリ</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <span className="text-sm">{cat.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-500 space-y-2">
          <p>
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights
            reserved.
          </p>
          <p className="text-gray-500 leading-relaxed max-w-2xl mx-auto">
            本サイトに掲載しているポケモンカードの画像は、
            <a
              href="https://www.pokemon-card.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-300"
            >
              ポケモンカードゲーム公式ホームページ
            </a>
            より引用しています。
          </p>
          <p className="text-gray-600">
            &copy;Pokémon &copy;Nintendo/Creatures Inc./GAME FREAK inc.
          </p>
          <p className="text-gray-600">
            ポケットモンスター・ポケモン・Pokémon は任天堂・クリーチャーズ・ゲームフリークの登録商標です。
            当サイトは公式とは関係のない個人運営のメディアです。
          </p>
        </div>
      </div>
    </footer>
  );
}
