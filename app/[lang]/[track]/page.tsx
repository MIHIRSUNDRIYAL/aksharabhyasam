import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTrackSlugs, getTrack, getLetterNavList } from "@/lib/content/loader";
import { LetterStepMap } from "@/components/track/LetterStepMap";
import { ProgressProvider } from "@/lib/progress/progressStore";
import { UI_STRINGS } from "@/lib/i18n/dictionary";
import { DEFAULT_LANGUAGE, isValidLanguage } from "@/lib/i18n/config";

export async function generateStaticParams() {
  const trackSlugs = await getAllTrackSlugs();
  return trackSlugs.map((track) => ({ track }));
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; track: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, track: trackSlug } = await props.params;
  const lang = isValidLanguage(rawLang) ? rawLang : DEFAULT_LANGUAGE;
  const track = await getTrack(trackSlug);
  if (!track) return {};
  return {
    title: track.title[lang] ?? track.title.en,
    description: track.shortDescription[lang] ?? track.shortDescription.en,
  };
}

export default async function TrackOverviewPage(props: {
  params: Promise<{ lang: string; track: string }>;
}) {
  const { lang: rawLang, track: trackSlug } = await props.params;
  const lang = isValidLanguage(rawLang) ? rawLang : DEFAULT_LANGUAGE;

  const track = await getTrack(trackSlug);
  if (!track) notFound();

  const letters = await getLetterNavList(trackSlug);
  const strings = UI_STRINGS[lang];

  return (
    <ProgressProvider trackSlug={trackSlug}>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <header className="mb-8 text-center">
          <h1 className="font-heading text-4xl font-bold text-slate-900 sm:text-5xl">
            {track.title[lang] ?? track.title.en}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600">
            {track.shortDescription[lang] ?? track.shortDescription.en}
          </p>
          <p className="mt-2 text-sm font-semibold text-violet-600">
            {strings.ageRangeLabel(track.ageRange)}
          </p>
        </header>

        <LetterStepMap
          trackSlug={trackSlug}
          lang={lang}
          letters={letters}
          doneLabel={strings.done}
        />
      </div>
    </ProgressProvider>
  );
}
