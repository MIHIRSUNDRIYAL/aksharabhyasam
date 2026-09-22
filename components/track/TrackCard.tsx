import Link from "next/link";
import type { LocalizedText } from "@/types/content";
import type { Lang } from "@/lib/i18n/config";

export function TrackCard({
  href,
  lang,
  title,
  description,
  letterCountLabel,
  startPracticingLabel,
  emoji = "✍️",
}: {
  href: string;
  lang: Lang;
  title: LocalizedText;
  description: LocalizedText;
  letterCountLabel: string;
  startPracticingLabel: string;
  emoji?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-3xl border-2 border-violet-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <span aria-hidden className="text-5xl">
        {emoji}
      </span>
      <h2 className="font-heading text-2xl font-bold text-slate-900">
        {title[lang] ?? title.en}
      </h2>
      <p className="text-slate-600">{description[lang] ?? description.en}</p>
      <p className="text-sm font-semibold text-violet-500">{letterCountLabel}</p>
      <span className="mt-auto font-heading font-semibold text-violet-600 group-hover:underline">
        {startPracticingLabel}
      </span>
    </Link>
  );
}
