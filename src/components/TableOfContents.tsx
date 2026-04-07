interface Heading {
  level: 2 | 3;
  text: string;
  id: string;
}

/**
 * Markdown本文から ## と ### を抽出して目次を生成
 */
export function extractHeadings(md: string): Heading[] {
  const headings: Heading[] = [];
  const lines = md.split("\n");
  const seen = new Map<string, number>();

  for (const line of lines) {
    let level: 2 | 3 | null = null;
    let text = "";
    if (line.startsWith("## ") && !line.startsWith("### ")) {
      level = 2;
      text = line.slice(3).trim();
    } else if (line.startsWith("### ")) {
      level = 3;
      text = line.slice(4).trim();
    }
    if (level && text) {
      // ID生成（日本語そのまま）
      let id = text
        .replace(/[#*`\[\]()]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();
      // 重複対応
      const count = seen.get(id) ?? 0;
      seen.set(id, count + 1);
      if (count > 0) id = `${id}-${count}`;
      headings.push({ level, text, id });
    }
  }
  return headings;
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="目次"
      className="my-8 bg-orange-50 border-2 border-orange-200 rounded-2xl overflow-hidden"
    >
      <div className="bg-orange-500 text-white px-5 py-3 flex items-center gap-2 font-bold">
        <span>📚</span>
        <span>目次（タップでジャンプ）</span>
      </div>
      <ol className="px-5 py-4 space-y-2 text-sm">
        {headings.map((h, i) => (
          <li
            key={h.id}
            className={h.level === 3 ? "ml-5 text-gray-600" : "text-gray-800 font-medium"}
          >
            <a
              href={`#${h.id}`}
              className="hover:text-orange-600 hover:underline inline-flex items-baseline gap-2"
            >
              {h.level === 2 && (
                <span className="text-orange-500 text-xs font-bold">
                  {String(i + 1).padStart(2, "0")}.
                </span>
              )}
              {h.level === 3 && <span className="text-orange-300">└</span>}
              <span>{h.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
