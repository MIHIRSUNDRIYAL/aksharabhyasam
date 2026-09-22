import { z } from "zod";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/config";

const langEnum = z.enum(SUPPORTED_LANGUAGES);

/** A text value that may be provided in some, not necessarily all, languages. */
const localizedTextSchema = z.partialRecord(langEnum, z.string());

const letterCategorySchema = z.enum(["vowel", "consonant"]);

export const trackConfigSchema = z.object({
  slug: z.string(),
  title: localizedTextSchema,
  shortDescription: localizedTextSchema,
  themeColor: z.string(),
  ageRange: z.string(),
  letterOrder: z.array(z.string()),
});

export const letterSchema = z.object({
  id: z.string(),
  character: z.string().min(1),
  category: letterCategorySchema,
  transliteration: z.string(),
  label: localizedTextSchema,
  themeColor: z.string().optional(),
});

export const lettersFileSchema = z.record(z.string(), letterSchema);
