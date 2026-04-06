"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "2rem",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            エラーが発生しました
          </h1>
          <p style={{ marginBottom: "1.5rem", color: "#666" }}>
            申し訳ございません。問題が発生しました。
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: "0.5rem 1.5rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
            }}
          >
            再試行
          </button>
        </div>
      </body>
    </html>
  );
}
