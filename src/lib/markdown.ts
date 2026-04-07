/**
 * 強化されたMarkdown → HTML 変換
 *
 * 対応:
 *   見出し / 段落 / テーブル / リスト / 太字 / 水平線 / リンク / インラインコード
 *
 * カスタム記法:
 *   :::recommended           ← 「こんな方におすすめ」ボックス開始
 *   - 項目                   ← 中身
 *   :::                      ← ボックス終了
 *
 *   :::point                 ← ポイントボックス開始
 *   本文
 *   :::                      ← 終了
 *
 *   :::note                  ← 注意ボックス
 *   :::warning               ← 警告ボックス
 *
 *   > キャラ名: セリフ        ← 吹き出し（引用記法）
 */

interface Heading {
  level: 2 | 3;
  text: string;
  id: string;
}

function slugifyText(text: string): string {
  return text
    .replace(/[#*`\[\]()]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

class SlugCounter {
  private seen = new Map<string, number>();
  next(text: string): string {
    let id = slugifyText(text);
    const count = this.seen.get(id) ?? 0;
    this.seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;
    return id;
  }
}

export function renderMarkdown(md: string): string {
  const counter = new SlugCounter();
  return renderBlock(md, counter);
}

function renderBlock(md: string, counter: SlugCounter): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ===== カスタムボックス =====
    if (line.trim().startsWith(":::")) {
      const tag = line.trim().slice(3).trim();
      if (tag === "") {
        i++;
        continue;
      }
      const boxLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ":::") {
        boxLines.push(lines[i]);
        i++;
      }
      i++; // closing :::
      out.push(renderBox(tag, boxLines.join("\n"), counter));
      continue;
    }

    // ===== 引用（吹き出し） =====
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      out.push(renderQuote(quoteLines.join("\n")));
      continue;
    }

    // ===== 水平線 =====
    if (/^---+$/.test(line.trim())) {
      out.push('<hr class="my-10 border-gray-200" />');
      i++;
      continue;
    }

    // ===== 見出し =====
    if (line.startsWith("### ")) {
      const text = line.slice(4);
      const id = counter.next(text);
      out.push(
        `<h3 id="${id}" class="text-lg sm:text-xl font-bold mt-10 mb-4 text-gray-900 flex items-center gap-2 scroll-mt-20"><span class="inline-block w-1 h-5 bg-orange-400 rounded-full"></span>${inline(text)}</h3>`
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      const text = line.slice(3);
      const id = counter.next(text);
      out.push(
        `<h2 id="${id}" class="text-xl sm:text-2xl font-bold mt-12 mb-5 text-gray-900 pb-2 border-b-4 border-orange-400 scroll-mt-20">${inline(text)}</h2>`
      );
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      const text = line.slice(2);
      const id = counter.next(text);
      out.push(
        `<h1 id="${id}" class="text-2xl sm:text-3xl font-bold mt-10 mb-5 text-gray-900 scroll-mt-20">${inline(text)}</h1>`
      );
      i++;
      continue;
    }

    // ===== テーブル =====
    if (line.trim().startsWith("|") && lines[i + 1]?.trim().startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      out.push(renderTable(tableLines));
      continue;
    }

    // ===== リスト =====
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (
        i < lines.length &&
        (lines[i].startsWith("- ") || lines[i].startsWith("* "))
      ) {
        items.push(`<li class="mb-2 pl-1">${inline(lines[i].slice(2))}</li>`);
        i++;
      }
      out.push(
        `<ul class="list-disc pl-6 my-5 text-gray-700 leading-relaxed marker:text-orange-400">${items.join("")}</ul>`
      );
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(
          `<li class="mb-2 pl-1">${inline(lines[i].replace(/^\d+\. /, ""))}</li>`
        );
        i++;
      }
      out.push(
        `<ol class="list-decimal pl-6 my-5 text-gray-700 leading-relaxed marker:text-orange-500 marker:font-bold">${items.join("")}</ol>`
      );
      continue;
    }

    // ===== 空行 =====
    if (line.trim() === "") {
      i++;
      continue;
    }

    // ===== 段落 =====
    out.push(`<p class="text-gray-700 leading-loose my-4">${inline(line)}</p>`);
    i++;
  }

  return out.join("\n");
}

function inline(text: string): string {
  let t = text;
  t = t.replace(
    /\*\*(.+?)\*\*/g,
    '<strong class="font-bold text-orange-600 bg-orange-50 px-1 rounded">$1</strong>'
  );
  t = t.replace(
    /`([^`]+)`/g,
    '<code class="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
  );
  t = t.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-orange-600 hover:underline font-medium">$1</a>'
  );
  return t;
}

function renderTable(lines: string[]): string {
  if (lines.length < 2) return "";
  const parseRow = (line: string): string[] =>
    line
      .slice(1, -1)
      .split("|")
      .map((c) => c.trim());

  const header = parseRow(lines[0]);
  const bodyRows = lines.slice(2).map(parseRow);

  const headerHtml = `<thead class="bg-orange-50"><tr>${header
    .map(
      (h) =>
        `<th class="border border-orange-200 px-4 py-3 text-left font-bold text-orange-700 text-sm">${inline(h)}</th>`
    )
    .join("")}</tr></thead>`;

  const bodyHtml = `<tbody>${bodyRows
    .map(
      (row, ri) =>
        `<tr class="${ri % 2 === 0 ? "bg-white" : "bg-orange-50/30"}">${row
          .map(
            (c) =>
              `<td class="border border-orange-100 px-4 py-3 text-gray-700 text-sm">${inline(c)}</td>`
          )
          .join("")}</tr>`
    )
    .join("")}</tbody>`;

  return `<div class="my-6 overflow-x-auto rounded-lg border border-orange-200 shadow-sm"><table class="w-full text-sm border-collapse">${headerHtml}${bodyHtml}</table></div>`;
}

function renderQuote(text: string): string {
  // [^\s\S] を使うことで /s フラグなしで複数行にマッチ
  const speakerMatch = text.match(/^([^:：]+)[:：]\s*([\s\S]+)/);
  if (speakerMatch) {
    const speaker = speakerMatch[1];
    const message = speakerMatch[2];
    return `<div class="my-6 flex gap-3 items-start"><div class="shrink-0 w-12 h-12 rounded-full bg-orange-100 border-2 border-orange-300 flex items-center justify-center text-2xl">📒</div><div class="flex-1 relative bg-orange-50 border-2 border-orange-200 rounded-xl px-4 py-3"><div class="absolute -left-2 top-3 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-orange-200 border-b-8 border-b-transparent"></div><div class="font-bold text-orange-700 text-xs mb-1">${inline(speaker.trim())}</div><div class="text-gray-700 text-sm leading-relaxed">${inline(message.trim())}</div></div></div>`;
  }
  return `<blockquote class="my-6 border-l-4 border-orange-400 bg-orange-50 px-5 py-4 rounded-r-lg text-gray-700 italic">${inline(text)}</blockquote>`;
}

function renderBox(
  tag: string,
  content: string,
  counter: SlugCounter
): string {
  const innerHtml = renderBlock(content, counter);

  if (tag === "recommended") {
    return `<div class="my-8 rounded-2xl border-2 border-orange-300 overflow-hidden shadow-sm"><div class="bg-orange-500 text-white px-5 py-3 font-bold flex items-center gap-2"><span>✅</span><span>こんな方におすすめ</span></div><div class="bg-orange-50 px-5 py-4">${innerHtml}</div></div>`;
  }
  if (tag === "point") {
    return `<div class="my-8 rounded-2xl border-2 border-blue-300 overflow-hidden shadow-sm"><div class="bg-blue-500 text-white px-5 py-3 font-bold flex items-center gap-2"><span>💡</span><span>ポイント</span></div><div class="bg-blue-50 px-5 py-4">${innerHtml}</div></div>`;
  }
  if (tag === "note") {
    return `<div class="my-8 rounded-2xl border-2 border-yellow-300 overflow-hidden shadow-sm"><div class="bg-yellow-500 text-white px-5 py-3 font-bold flex items-center gap-2"><span>⚠️</span><span>注意</span></div><div class="bg-yellow-50 px-5 py-4">${innerHtml}</div></div>`;
  }
  if (tag === "warning") {
    return `<div class="my-8 rounded-2xl border-2 border-red-300 overflow-hidden shadow-sm"><div class="bg-red-500 text-white px-5 py-3 font-bold flex items-center gap-2"><span>🚨</span><span>警告</span></div><div class="bg-red-50 px-5 py-4">${innerHtml}</div></div>`;
  }
  return innerHtml;
}

export function extractHeadings(md: string): Heading[] {
  const headings: Heading[] = [];
  const counter = new SlugCounter();
  const lines = md.split("\n");
  let inBox = false;
  for (const line of lines) {
    if (line.trim().startsWith(":::")) {
      inBox = !inBox;
      continue;
    }
    if (inBox) continue;
    let level: 2 | 3 | null = null;
    let text = "";
    if (line.startsWith("### ")) {
      level = 3;
      text = line.slice(4).trim();
    } else if (line.startsWith("## ") && !line.startsWith("### ")) {
      level = 2;
      text = line.slice(3).trim();
    }
    if (level && text) {
      const id = counter.next(text);
      headings.push({ level, text, id });
    }
  }
  return headings;
}
