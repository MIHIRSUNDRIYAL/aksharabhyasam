import { getAllTracks } from "@/lib/content/loader";
import { TrackCard } from "@/components/track/TrackCard";
import { UI_STRINGS } from "@/lib/i18n/dictionary";
import { DEFAULT_LANGUAGE, isValidLanguage } from "@/lib/i18n/config";

const TRACK_EMOJI: Record<string, string> = {
  hindi: "🖋️",
  sanskrit: "🕉️",
};

export default async function HomePage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await props.params;
  const lang = isValidLanguage(rawLang) ? rawLang : DEFAULT_LANGUAGE;

  const tracks = await getAllTracks();
  const strings = UI_STRINGS[lang];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <section className="mb-10 text-center">
        <h1 className="font-heading text-4xl font-bold text-violet-700 sm:text-5xl">
          {strings.homeHeroTitle}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600 sm:text-xl">
          {strings.homeHeroSubtitle}
        </p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        {tracks.map((track) => (
          <TrackCard
            key={track.slug}
            href={`/${lang}/${track.slug}`}
            lang={lang}
            title={track.title}
            description={track.shortDescription}
            letterCountLabel={strings.letterCountLabel(track.letterOrder.length)}
            startPracticingLabel={strings.startPracticing}
            emoji={TRACK_EMOJI[track.slug]}
          />
        ))}
      </div>
    </div>
  );
}
