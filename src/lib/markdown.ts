/**
 * シンプルなMarkdown → HTML 変換
 * 対応: 見出し、段落、テーブル、順序付き/なしリスト、太字、水平線、リンク、インラインコード
 */
export function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      out.push('<hr class="my-8 border-gray-200" />');
      i++;
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      out.push(
        `<h3 class="text-lg font-bold mt-8 mb-3 text-gray-900">${inline(line.slice(4))}</h3>`
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      out.push(
        `<h2 class="text-xl font-bold mt-10 mb-4 text-gray-900 border-l-4 border-blue-500 pl-3">${inline(line.slice(3))}</h2>`
      );
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      out.push(
        `<h1 class="text-2xl font-bold mt-10 mb-5 text-gray-900">${inline(line.slice(2))}</h1>`
      );
      i++;
      continue;
    }

    // Table (starts with `|`)
    if (line.trim().startsWith("|") && lines[i + 1]?.trim().startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      out.push(renderTable(tableLines));
      continue;
    }

    // Unordered list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (
        i < lines.length &&
        (lines[i].startsWith("- ") || lines[i].startsWith("* "))
      ) {
        items.push(
          `<li class="mb-1">${inline(lines[i].slice(2))}</li>`
        );
        i++;
      }
      out.push(
        `<ul class="list-disc pl-6 my-4 text-gray-700 leading-relaxed">${items.join("")}</ul>`
      );
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(
          `<li class="mb-1">${inline(lines[i].replace(/^\d+\. /, ""))}</li>`
        );
        i++;
      }
      out.push(
        `<ol class="list-decimal pl-6 my-4 text-gray-700 leading-relaxed">${items.join("")}</ol>`
      );
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    out.push(
      `<p class="text-gray-700 leading-relaxed my-4">${inline(line)}</p>`
    );
    i++;
  }

  return out.join("\n");
}

function inline(text: string): string {
  let t = text;
  // Bold
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
  // Inline code
  t = t.replace(
    /`([^`]+)`/g,
    '<code class="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm">$1</code>'
  );
  // Links [text](url)
  t = t.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-600 hover:underline">$1</a>'
  );
  return t;
}

function renderTable(lines: string[]): string {
  if (lines.length < 2) return "";

  const parseRow = (line: string): string[] =>
    line
      .slice(1, -1) // remove leading/trailing |
      .split("|")
      .map((c) => c.trim());

  const header = parseRow(lines[0]);
  // lines[1] is the separator (|---|---|)
  const bodyRows = lines.slice(2).map(parseRow);

  const headerHtml = `<thead class="bg-gray-50"><tr>${header
    .map(
      (h) =>
        `<th class="border border-gray-200 px-4 py-2 text-left font-bold text-gray-900">${inline(h)}</th>`
    )
    .join("")}</tr></thead>`;

  const bodyHtml = `<tbody>${bodyRows
    .map(
      (row) =>
        `<tr>${row
          .map(
            (c) =>
              `<td class="border border-gray-200 px-4 py-2 text-gray-700">${inline(c)}</td>`
          )
          .join("")}</tr>`
    )
    .join("")}</tbody>`;

  return `<div class="my-6 overflow-x-auto"><table class="w-full text-sm border-collapse">${headerHtml}${bodyHtml}</table></div>`;
}
