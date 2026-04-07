import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  sourceUrl: string;
  sourceName?: string;
  caption?: string;
  width?: number;
  height?: number;
  /**
   * アスペクト比指定（width/heightの代わり）
   * 例: "16/9", "5/7"
   */
  aspectRatio?: string;
  /**
   * レイアウトオプション
   * "card": 中央寄せでカードサイズ
   * "banner": 16:9のバナー
   * "full": 幅100%
   */
  variant?: "card" | "banner" | "full";
};

/**
 * 引用画像を表示するコンポーネント
 *
 * 日本の著作権法32条「引用」要件に配慮し、
 * 画像の下に必ず出典を明記する。
 */
export default function QuotedImage({
  src,
  alt,
  sourceUrl,
  sourceName = "株式会社ポケモン「ポケモンカードゲーム公式ホームページ」",
  caption,
  width,
  height,
  aspectRatio,
  variant = "full",
}: Props) {
  const isCardVariant = variant === "card";
  const containerClass = isCardVariant
    ? "max-w-xs mx-auto"
    : variant === "banner"
      ? "w-full"
      : "w-full";

  const imageWrapperStyle = aspectRatio
    ? { aspectRatio }
    : variant === "banner"
      ? { aspectRatio: "1200/630" }
      : isCardVariant
        ? { aspectRatio: "5/7" }
        : undefined;

  return (
    <figure className={`my-6 ${containerClass}`}>
      <div
        className="relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
        style={imageWrapperStyle}
      >
        <Image
          src={src}
          alt={alt}
          fill={!!imageWrapperStyle || (!width && !height)}
          width={imageWrapperStyle ? undefined : width}
          height={imageWrapperStyle ? undefined : height}
          className={imageWrapperStyle ? "object-contain" : ""}
          sizes={
            isCardVariant
              ? "(max-width: 640px) 90vw, 320px"
              : "(max-width: 768px) 100vw, 768px"
          }
          unoptimized={false}
        />
      </div>
      <figcaption className="mt-2 text-xs text-gray-500 leading-relaxed">
        {caption && <span className="block mb-1">{caption}</span>}
        <span className="block">
          出典:{" "}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {sourceName}
          </a>
        </span>
        <span className="block text-gray-400 text-[10px] mt-0.5">
          ©Pokémon ©Nintendo/Creatures Inc./GAME FREAK inc.
        </span>
      </figcaption>
    </figure>
  );
}
