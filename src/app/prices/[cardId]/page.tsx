import { notFound } from "next/navigation";
import { getAllPrices, getCardPrice, getPriceHistory } from "@/lib/prices";
import PriceTable from "@/components/PriceTable";
import PriceChart from "@/components/PriceChart";
import Link from "next/link";
import type { Metadata } from "next";

type Props = { params: Promise<{ cardId: string }> };

export async function generateStaticParams() {
  return getAllPrices().map((p) => ({ cardId: p.cardId }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cardId } = await params;
  const card = getCardPrice(cardId);
  if (!card) return {};
  return {
    title: `${card.cardName}の価格比較`,
    description: `${card.cardName}（${card.packName}）の各ショップ価格を比較。駿河屋・カードラッシュ・遊々亭・メルカリの最新価格。`,
  };
}

export default async function CardPricePage({ params }: Props) {
  const { cardId } = await params;
  const card = getCardPrice(cardId);
  if (!card) notFound();

  const history = getPriceHistory(cardId);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: card.cardName,
            description: `${card.packName} ${card.cardNumber} ${card.rarity}`,
            brand: { "@type": "Brand", name: "ポケモンカードゲーム" },
          }),
        }}
      />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        <Link href="/prices" className="hover:text-blue-600">
          カード価格
        </Link>
        <span className="mx-2">/</span>
        <span>{card.cardName}</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {card.cardName} の価格比較
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        {card.packName} / {card.cardNumber} / {card.rarity}
      </p>

      <PriceTable card={card} />

      {history && history.history.length > 1 && (
        <div className="mt-8">
          <PriceChart
            history={history.history}
            cardName={card.cardName}
          />
        </div>
      )}

      <div className="mt-8 bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
        <p>
          ※ 価格は各ショップの販売価格を参考にしています。実際の価格は変動する場合があります。
        </p>
        <p className="mt-1">
          最終更新: {card.prices[0]?.updatedAt ?? "不明"}
        </p>
      </div>

      <div className="mt-8">
        <Link href="/prices" className="text-blue-600 hover:underline text-sm">
          ← 価格一覧に戻る
        </Link>
      </div>
    </div>
  );
}
