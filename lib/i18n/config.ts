/**
 * Single source of truth for which languages Aksharabhyasam's UI supports.
 * This is the interface language (labels/instructions), a separate axis
 * from WHICH SCRIPT a kid is practicing (see content/tracks/ — Hindi vs
 * Sanskrit letters). Adding a UI language later is: add it here, then add
 * matching dictionary + track label entries. No other code should hardcode
 * a language list.
 */
export const SUPPORTED_LANGUAGES = ["en", "hi", "sa"] as const;

export type Lang = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Lang = "en";

export const LANGUAGE_LABELS: Record<Lang, string> = {
  en: "English",
  hi: "हिन्दी",
  sa: "संस्कृतम्",
};

/** BCP-47 tag for <html lang> per language. */
export const LANGUAGE_LOCALE_TAG: Record<Lang, string> = {
  en: "en",
  hi: "hi",
  sa: "sa",
};

export function isValidLanguage(value: string): value is Lang {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

/**
 * Given a pathname like /en/hindi/a, swap only the leading language
 * segment, e.g. -> /hi/hindi/a. Used by the language switcher so
 * navigating languages keeps you on the same page.
 */
export function replaceLangInPathname(pathname: string, nextLang: Lang): string {
  const segments = pathname.split("/");
  // segments[0] is "" because pathname starts with "/"
  if (segments.length > 1 && isValidLanguage(segments[1])) {
    segments[1] = nextLang;
    return segments.join("/") || "/";
  }
  return `/${nextLang}${pathname === "/" ? "" : pathname}`;
}
