"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useProgress } from "@/lib/progress/progressStore";
import type { LetterNavEntry } from "@/types/content";
import type { Lang } from "@/lib/i18n/config";

export function LetterStepMap({
  trackSlug,
  lang,
  letters,
  doneLabel,
}: {
  trackSlug: string;
  lang: Lang;
  letters: LetterNavEntry[];
  doneLabel: string;
}) {
  const { isLetterMastered } = useProgress();

  return (
    <ol className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {letters.map((letter, index) => {
        const mastered = isLetterMastered(letter.id);
        const label = letter.label[lang] ?? letter.label.en ?? letter.character;

        return (
          <li key={letter.id}>
            <Link href={`/${lang}/${trackSlug}/${letter.id}`}>
              <motion.div
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="relative flex flex-col items-center gap-1 rounded-2xl border-2 border-violet-200 bg-white p-3 shadow-sm hover:shadow-md"
              >
                <span
                  aria-hidden
                  className="flex h-14 w-14 items-center justify-center rounded-full font-devanagari text-2xl"
                  style={{ backgroundColor: `${letter.themeColor}33` }}
                >
                  {letter.character}
                </span>
                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  {index + 1}. {label}
                </span>
                {mastered && (
                  <span
                    aria-label={doneLabel}
                    className="absolute -right-1.5 -top-1.5 rounded-full bg-green-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow"
                  >
                    ✓
                  </span>
                )}
              </motion.div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
