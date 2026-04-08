"use client";

import { useEffect, useState } from "react";

interface Comment {
  id: string;
  name: string;
  body: string;
  createdAt: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "たった今";
  if (diffMin < 60) return `${diffMin}分前`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}時間前`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}日前`;
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

function Avatar({ name }: { name: string }) {
  const colors = [
    "bg-orange-100 text-orange-700",
    "bg-pink-100 text-pink-700",
    "bg-cyan-100 text-cyan-700",
    "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700",
    "bg-amber-100 text-amber-700",
  ];
  // 名前からハッシュして色を決定
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const color = colors[Math.abs(hash) % colors.length];
  const initial = name[0]?.toUpperCase() ?? "?";

  return (
    <span
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm ${color} shrink-0`}
    >
      {initial}
    </span>
  );
}

export default function CustomComments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 名前を localStorage に記憶
  useEffect(() => {
    const saved = localStorage.getItem("pokeca-comment-name");
    if (saved) setName(saved);
  }, []);

  // コメント読み込み
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/comments/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setComments(data.comments || []);
        setEnabled(data.enabled !== false);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/comments/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, body, honeypot }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "投稿に失敗しました");
      } else if (data.comment) {
        setComments([...comments, data.comment]);
        setBody("");
        setSuccess(true);
        localStorage.setItem("pokeca-comment-name", name);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-10">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2 pb-1 border-b-4 border-orange-400">
        <span>💬</span>
        <span>コメント ({comments.length})</span>
      </h2>

      {!enabled && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 text-center mb-6">
          <div className="text-3xl mb-2">🔧</div>
          <p className="text-sm text-gray-700 font-bold">
            コメント機能は準備中です
          </p>
          <p className="text-xs text-gray-500 mt-1">
            まもなく公開予定です。お楽しみに！
          </p>
        </div>
      )}

      {/* コメント一覧 */}
      {enabled && (
        <div className="space-y-3 mb-6">
          {loading ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              読み込み中...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-3xl mb-2 opacity-50">💭</div>
              まだコメントはありません。
              <br />
              最初のコメントを投稿してみませんか？
            </div>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={c.name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-sm text-gray-900">
                        {c.name}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {formatDate(c.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
                      {c.body}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 投稿フォーム */}
      {enabled && (
        <form
          onSubmit={handleSubmit}
          className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 sm:p-6"
        >
          <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
            <span>✍️</span>
            <span>コメントを投稿</span>
          </h3>

          {/* ハニーポット（ボット対策・非表示） */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-9999px",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
          >
            <label>
              ウェブサイト（入力しないでください）
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                お名前 <span className="text-red-500">*</span>
                <span className="text-[10px] text-gray-500 ml-1 font-normal">
                  （30文字以内・ニックネームOK）
                </span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
                required
                disabled={submitting}
                placeholder="名無しのポケカユーザー"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                コメント <span className="text-red-500">*</span>
                <span className="text-[10px] text-gray-500 ml-1 font-normal">
                  （{body.length}/500）
                </span>
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={500}
                required
                rows={4}
                disabled={submitting}
                placeholder="感想や質問、相場の見方など、ご自由にどうぞ！"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 resize-none disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="text-xs sm:text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div className="text-xs sm:text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                ✅ コメントを投稿しました！
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !name.trim() || !body.trim()}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {submitting ? "投稿中..." : "コメントを投稿する"}
            </button>

            <p className="text-[10px] text-gray-500 text-center leading-relaxed">
              ※ URL・連絡先を含む投稿はできません。スパム対策のためご了承ください。
              <br />
              ※ 不適切なコメントは管理者により削除される場合があります。
            </p>
          </div>
        </form>
      )}
    </section>
  );
}
