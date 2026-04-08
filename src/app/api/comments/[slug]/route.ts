import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  getComments,
  addComment,
  isRateLimited,
  isCommentsEnabled,
} from "@/lib/comments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// URL・連絡先系の投稿をブロック（簡易スパム対策）
const NG_PATTERNS = [
  /https?:\/\//i,
  /www\./i,
  /\.com/i,
  /\.net/i,
  /\.jp/i,
  /@[a-z0-9]+/i,
  /line\.me/i,
  /t\.me/i,
  /discord\.gg/i,
];

function ngWordCheck(text: string): boolean {
  return NG_PATTERNS.some((p) => p.test(text));
}

function hashIp(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(ip + (process.env.COMMENT_HASH_SALT ?? "pokeca-log"))
    .digest("hex")
    .slice(0, 16);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const comments = await getComments(slug);
  return NextResponse.json(
    { comments, enabled: isCommentsEnabled() },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isCommentsEnabled()) {
    return NextResponse.json(
      { error: "コメント機能は現在利用できません" },
      { status: 503 }
    );
  }

  const { slug } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "不正なリクエストです" },
      { status: 400 }
    );
  }

  const {
    name,
    body: commentBody,
    honeypot,
  } = (body ?? {}) as {
    name?: string;
    body?: string;
    honeypot?: string;
  };

  // ハニーポット（bot は非表示フィールドも埋めがち）
  if (honeypot && honeypot.length > 0) {
    return NextResponse.json({ error: "不正なリクエスト" }, { status: 400 });
  }

  // バリデーション
  if (
    typeof name !== "string" ||
    typeof commentBody !== "string" ||
    name.trim().length === 0 ||
    commentBody.trim().length === 0
  ) {
    return NextResponse.json(
      { error: "お名前とコメント本文は必須です" },
      { status: 400 }
    );
  }
  const cleanName = name.trim();
  const cleanBody = commentBody.trim();
  if (cleanName.length > 30) {
    return NextResponse.json(
      { error: "お名前は30文字以内にしてください" },
      { status: 400 }
    );
  }
  if (cleanBody.length > 500) {
    return NextResponse.json(
      { error: "コメントは500文字以内にしてください" },
      { status: 400 }
    );
  }
  if (ngWordCheck(cleanBody) || ngWordCheck(cleanName)) {
    return NextResponse.json(
      { error: "URL・連絡先を含む投稿はできません" },
      { status: 400 }
    );
  }

  // レート制限
  const forwardedFor = req.headers.get("x-forwarded-for") ?? "";
  const ip = forwardedFor.split(",")[0].trim() || "unknown";
  const ipHash = hashIp(ip);
  if (await isRateLimited(ipHash)) {
    return NextResponse.json(
      { error: "投稿間隔が短すぎます。10秒ほど空けてください。" },
      { status: 429 }
    );
  }

  const comment = await addComment({
    slug,
    name: cleanName,
    body: cleanBody,
  });

  if (!comment) {
    return NextResponse.json(
      { error: "投稿に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json({ comment });
}
