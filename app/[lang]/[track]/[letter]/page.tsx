import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllTrackSlugs,
  getLetter,
  getLetterNavList,
  getTrack,
} from "@/lib/content/loader";
import { ProgressProvider } from "@/lib/progress/progressStore";
import { LetterPracticeArea } from "@/components/tracing/LetterPracticeArea";
import { LetterPrevNextNav } from "@/components/track/LetterPrevNextNav";
import { UI_STRINGS } from "@/lib/i18n/dictionary";
import { DEFAULT_LANGUAGE, isValidLanguage } from "@/lib/i18n/config";

export async function generateStaticParams() {
  const trackSlugs = await getAllTrackSlugs();
  const params: { track: string; letter: string }[] = [];

  for (const track of trackSlugs) {
    const navList = await getLetterNavList(track);
    for (const letter of navList) {
      params.push({ track, letter: letter.id });
    }
  }

  return params;
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; track: string; letter: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, track: trackSlug, letter: letterId } = await props.params;
  const lang = isValidLanguage(rawLang) ? rawLang : DEFAULT_LANGUAGE;
  const letter = await getLetter(trackSlug, letterId);
  if (!letter) return {};
  const label = letter.label[lang] ?? letter.label.en;
  return { title: `${letter.character} — ${label}` };
}

export default async function LetterPracticePage(props: {
  params: Promise<{ lang: string; track: string; letter: string }>;
}) {
  const { lang: rawLang, track: trackSlug, letter: letterId } = await props.params;
  const lang = isValidLanguage(rawLang) ? rawLang : DEFAULT_LANGUAGE;

  const [track, letter, navList] = await Promise.all([
    getTrack(trackSlug),
    getLetter(trackSlug, letterId),
    getLetterNavList(trackSlug),
  ]);
  if (!track || !letter) notFound();

  const currentIndex = navList.findIndex((l) => l.id === letterId);
  const prev = currentIndex > 0 ? navList[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < navList.length - 1
      ? navList[currentIndex + 1]
      : null;

  const strings = UI_STRINGS[lang];
  const label = letter.label[lang] ?? letter.label.en ?? letter.character;

  return (
    <ProgressProvider trackSlug={trackSlug}>
      <article className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <p className="mb-2 text-center text-sm font-bold uppercase tracking-wide text-violet-500">
          {track.title[lang] ?? track.title.en}
        </p>
        <h1 className="mb-6 text-center font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
          {label}
        </h1>

        <LetterPracticeArea
          letterId={letterId}
          character={letter.character}
          strings={{
            clear: strings.clear,
            checkMyTracing: strings.checkMyTracing,
            feedbackGreat: strings.feedbackGreat,
            feedbackGood: strings.feedbackGood,
            feedbackTryAgain: strings.feedbackTryAgain,
          }}
        />

        <LetterPrevNextNav
          trackSlug={trackSlug}
          lang={lang}
          prev={prev}
          next={next}
          prevLabel={strings.previous}
          nextLabel={strings.next}
        />
      </article>
    </ProgressProvider>
  );
}
