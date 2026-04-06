import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-8">
        お探しのページは見つかりませんでした。
      </p>
      <Link
        href="/"
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        トップに戻る
      </Link>
    </div>
  );
}
