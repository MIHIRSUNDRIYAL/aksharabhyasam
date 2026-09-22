import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import type { Lang } from "@/lib/i18n/config";

export function Header({ lang }: { lang: Lang }) {
  return (
    <header className="sticky top-0 z-20 border-b-2 border-violet-100 bg-violet-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href={`/${lang}`}
          className="flex items-center gap-2 font-heading text-xl font-bold text-violet-700 sm:text-2xl"
        >
          <Image
            src="/assets/logo.svg"
            alt=""
            width={32}
            height={32}
            priority
            className="rounded-lg"
          />
          Aksharabhyasam
        </Link>
        <LanguageSwitcher currentLang={lang} />
      </div>
    </header>
  );
}
