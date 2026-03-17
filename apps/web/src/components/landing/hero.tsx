import Link from "next/link";

export function Hero() {
  return (
    <section className="py-24 px-6 text-center max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
        Open source · AES-256 encrypted · CLI first
      </div>

      <h1 className="text-5xl font-semibold text-gray-900 leading-tight mb-6">
        Stop sharing secrets
        <br />
        over Slack
      </h1>

      <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto">
        Envcrypt gives your team one secure place to store, share, and sync
        environment variables. Pull secrets with one command. Never paste a
        secret into a chat again.
      </p>

      <div className="flex items-center justify-center gap-3">
        <Link
          href="/register"
          className="bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Start for free
        </Link>
        <Link
          href="#how-it-works"
          className="border border-gray-200 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          See how it works
        </Link>
      </div>
    </section>
  );
}
