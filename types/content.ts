import type { Lang } from "@/lib/i18n/config";

/** Text provided in some (not necessarily all) supported UI languages. */
export type LocalizedText = Partial<Record<Lang, string>>;

export type LetterCategory = "vowel" | "consonant";

export interface TrackConfig {
  slug: string;
  title: LocalizedText;
  shortDescription: LocalizedText;
  themeColor: string;
  ageRange: string;
  /** Ordered list of letter ids — defines practice order and prev/next. */
  letterOrder: string[];
}

export interface Letter {
  id: string;
  /** The actual Devanagari character, e.g. "अ". */
  character: string;
  category: LetterCategory;
  /** Romanized transliteration, e.g. "ā". */
  transliteration: string;
  label: LocalizedText;
  themeColor?: string;
}

export type LettersMap = Record<string, Letter>;

/** A letter's identity + track position, for stepping-stones and prev/next. */
export interface LetterNavEntry {
  id: string;
  character: string;
  label: LocalizedText;
  themeColor: string;
}
