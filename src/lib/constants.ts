export const SITE_NAME = "ポケカろぐ";
export const SITE_DESCRIPTION =
  "ポケモンカードの最新情報・カード価格比較・新弾情報・デッキ紹介まで、ポケカの話題をまるっとお届けするブログメディア「ポケカろぐ」";
export const SITE_URL = "https://pokeca-log.com";

export const NAV_LINKS = [
  { label: "ホーム", href: "/" },
  { label: "記事一覧", href: "/articles" },
  { label: "サイトについて", href: "/about" },
];

export const SHOPS = [
  { id: "surugaya", name: "駿河屋", color: "#e74c3c" },
  { id: "cardrush", name: "カードラッシュ", color: "#3498db" },
  { id: "yuyu-tei", name: "遊々亭", color: "#2ecc71" },
  { id: "mercari", name: "メルカリ相場", color: "#f39c12" },
  { id: "toretoku", name: "トレトク", color: "#9b59b6" },
] as const;

export const CATEGORIES = [
  { id: "price", label: "価格情報", color: "bg-red-100 text-red-700" },
  { id: "news", label: "最新ニュース", color: "bg-blue-100 text-blue-700" },
  { id: "pack", label: "新弾情報", color: "bg-green-100 text-green-700" },
  { id: "deck", label: "デッキ紹介", color: "bg-purple-100 text-purple-700" },
  { id: "tips", label: "コラム", color: "bg-yellow-100 text-yellow-700" },
] as const;
