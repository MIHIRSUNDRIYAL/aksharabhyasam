import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
      <span aria-hidden className="text-6xl">
        🧭
      </span>
      <h1 className="font-heading text-3xl font-bold text-slate-900">
        Hmm, that letter wandered off the page.
      </h1>
      <p className="text-lg text-slate-600">
        We couldn&apos;t find that track or letter. Let&apos;s head back and find
        something to practice!
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-violet-600 px-6 py-3 font-heading font-bold text-white shadow transition-colors hover:bg-violet-700"
      >
        Back to Aksharabhyasam
      </Link>
    </div>
  );
}
