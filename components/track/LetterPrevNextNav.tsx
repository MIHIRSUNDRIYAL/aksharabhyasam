import Link from "next/link";
import type { LetterNavEntry } from "@/types/content";
import type { Lang } from "@/lib/i18n/config";

function NavCard({
  entry,
  trackSlug,
  lang,
  direction,
  label,
}: {
  entry: LetterNavEntry | null;
  trackSlug: string;
  lang: Lang;
  direction: "prev" | "next";
  label: string;
}) {
  const arrow = direction === "prev" ? "←" : "→";

  if (!entry) {
    return (
      <div className="flex flex-1 items-center gap-2 rounded-3xl border-2 border-dashed border-slate-200 px-5 py-4 text-slate-400">
        {direction === "prev" && <span aria-hidden>{arrow}</span>}
        <div className={direction === "next" ? "ml-auto text-right" : ""}>
          <p className="text-xs font-bold uppercase tracking-wide">{label}</p>
          <p className="font-heading font-semibold">—</p>
        </div>
        {direction === "next" && <span aria-hidden>{arrow}</span>}
      </div>
    );
  }

  const title = entry.label[lang] ?? entry.label.en ?? entry.character;

  return (
    <Link
      href={`/${lang}/${trackSlug}/${entry.id}`}
      className="flex flex-1 items-center gap-3 rounded-3xl border-2 bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md"
      style={{ borderColor: `${entry.themeColor}66` }}
    >
      {direction === "prev" && (
        <span aria-hidden className="font-devanagari text-2xl">
          {entry.character}
        </span>
      )}
      <div className={direction === "next" ? "ml-auto text-right" : ""}>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="font-heading font-semibold text-slate-900">{title}</p>
      </div>
      {direction === "next" && (
        <span aria-hidden className="font-devanagari text-2xl">
          {entry.character}
        </span>
      )}
    </Link>
  );
}

export function LetterPrevNextNav({
  trackSlug,
  lang,
  prev,
  next,
  prevLabel,
  nextLabel,
}: {
  trackSlug: string;
  lang: Lang;
  prev: LetterNavEntry | null;
  next: LetterNavEntry | null;
  prevLabel: string;
  nextLabel: string;
}) {
  return (
    <nav aria-label="Letter navigation" className="my-8 flex flex-col gap-3 sm:flex-row">
      <NavCard entry={prev} trackSlug={trackSlug} lang={lang} direction="prev" label={prevLabel} />
      <NavCard entry={next} trackSlug={trackSlug} lang={lang} direction="next" label={nextLabel} />
    </nav>
  );
}
