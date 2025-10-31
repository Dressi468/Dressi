import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-10 px-6 py-24 text-center">
      <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-white/15 bg-white/5">
        <div
          className="absolute inset-0 -z-10 animate-pulse rounded-full from-pink-600/25 via-fuchsia-500/25 to-indigo-500/25 blur-2xl"
          aria-hidden="true"
        />
        <span className="text-5xl font-semibold tracking-tight">404</span>
      </div>

      <div className="max-w-md space-y-4">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">Let&apos;s get you styled again</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/80"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
