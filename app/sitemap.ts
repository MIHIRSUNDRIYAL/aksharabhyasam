import type { MetadataRoute } from "next";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/config";
import { getAllTrackSlugs, getLetterNavList } from "@/lib/content/loader";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const trackSlugs = await getAllTrackSlugs();

  for (const lang of SUPPORTED_LANGUAGES) {
    entries.push({ url: `${SITE_URL}/${lang}` });

    for (const track of trackSlugs) {
      entries.push({ url: `${SITE_URL}/${lang}/${track}` });

      const letters = await getLetterNavList(track);
      for (const letter of letters) {
        entries.push({ url: `${SITE_URL}/${lang}/${track}/${letter.id}` });
      }
    }
  }

  return entries;
}
