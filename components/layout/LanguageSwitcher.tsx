"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  replaceLangInPathname,
  type Lang,
} from "@/lib/i18n/config";

const PREFERRED_LANG_COOKIE = "preferred-lang";

function rememberLanguage(lang: Lang) {
  try {
    document.cookie = `${PREFERRED_LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    // cookies unavailable — the switcher still works, it just won't be remembered next visit.
  }
}

export function LanguageSwitcher({ currentLang }: { currentLang: Lang }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleSelect(lang: Lang) {
    if (lang === currentLang) return;
    rememberLanguage(lang);
    router.push(replaceLangInPathname(pathname, lang));
  }

  return (
    <div
      role="group"
      aria-label="Choose language"
      className="flex gap-1 rounded-full bg-white/70 p-1 shadow-inner"
    >
      {SUPPORTED_LANGUAGES.map((lang) => {
        const active = lang === currentLang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => handleSelect(lang)}
            aria-pressed={active}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors sm:text-base ${
              active
                ? "bg-violet-600 text-white shadow"
                : "text-slate-600 hover:bg-violet-100"
            }`}
          >
            {LANGUAGE_LABELS[lang]}
          </button>
        );
      })}
    </div>
  );
}
