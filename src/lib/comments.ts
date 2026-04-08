import { Redis } from "@upstash/redis";

export interface Comment {
  id: string;
  slug: string;
  name: string;
  body: string;
  createdAt: string;
}

/**
 * Upstash Redis クライアントを取得
 * 環境変数が未設定の場合は null を返す（開発時のフォールバック）
 */
function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

/**
 * コメント一覧を取得（古い順）
 */
export async function getComments(slug: string): Promise<Comment[]> {
  const redis = getRedis();
  if (!redis) return [];
  try {
    const comments = await redis.lrange<Comment>(
      `comments:${slug}`,
      0,
      -1
    );
    return comments;
  } catch (e) {
    console.error("Failed to fetch comments:", e);
    return [];
  }
}

/**
 * コメントを追加
 */
export async function addComment(params: {
  slug: string;
  name: string;
  body: string;
}): Promise<Comment | null> {
  const redis = getRedis();
  if (!redis) return null;

  const comment: Comment = {
    id: crypto.randomUUID(),
    slug: params.slug,
    name: params.name,
    body: params.body,
    createdAt: new Date().toISOString(),
  };

  try {
    await redis.rpush(`comments:${params.slug}`, JSON.stringify(comment));
    // 1記事あたり最大500件まで保持（それ以上は古いものから削除）
    await redis.ltrim(`comments:${params.slug}`, -500, -1);
    return comment;
  } catch (e) {
    console.error("Failed to add comment:", e);
    return null;
  }
}

/**
 * レート制限チェック（同一IPは10秒に1回まで）
 */
export async function isRateLimited(ipHash: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;

  try {
    const key = `ratelimit:comment:${ipHash}`;
    const exists = await redis.exists(key);
    if (exists) return true;
    await redis.set(key, 1, { ex: 10 });
    return false;
  } catch (e) {
    console.error("Failed to check rate limit:", e);
    return false;
  }
}

/**
 * コメント数を取得
 */
export async function getCommentCount(slug: string): Promise<number> {
  const redis = getRedis();
  if (!redis) return 0;
  try {
    return await redis.llen(`comments:${slug}`);
  } catch (e) {
    console.error("Failed to get comment count:", e);
    return 0;
  }
}

/**
 * Redisが設定されているか
 */
export function isCommentsEnabled(): boolean {
  return getRedis() !== null;
}
