import type { Metadata } from "next";
import { redirect } from "next/navigation";
import "@/app/globals.css";
import { heading, body, devanagari } from "@/lib/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_LOCALE_TAG,
  SUPPORTED_LANGUAGES,
  isValidLanguage,
} from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: {
    default: "Aksharabhyasam — Learn to write Hindi & Sanskrit letters",
    template: "%s | Aksharabhyasam",
  },
  description:
    "Aksharabhyasam teaches kids to write Hindi and Sanskrit letters by tracing them on screen — simple, interactive practice in English, Hindi, and Sanskrit.",
};

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await props.params;

  // An unrecognized language segment (e.g. a hand-typed bad URL) sends the
  // reader to the default language rather than a bare 404 — friendlier for
  // a site aimed at kids/parents who might mistype a link.
  if (!isValidLanguage(rawLang)) {
    redirect(`/${DEFAULT_LANGUAGE}`);
  }

  const lang = rawLang;

  return (
    <html
      lang={LANGUAGE_LOCALE_TAG[lang]}
      className={`${heading.variable} ${body.variable} ${devanagari.variable} h-full`}
    >
      <body className="flex min-h-full flex-col font-body antialiased">
        <Header lang={lang} />
        <main className="flex-1">{props.children}</main>
        <Footer />
      </body>
    </html>
  );
}
