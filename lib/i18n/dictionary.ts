import type { Lang } from "@/lib/i18n/config";

/**
 * App-level UI strings (not letter content). Adding a UI language here is
 * a one-time cost independent of how many tracks/letters exist.
 */
export interface UiStrings {
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  ageRangeLabel: (range: string) => string;
  letterCountLabel: (count: number) => string;
  startPracticing: string;
  clear: string;
  checkMyTracing: string;
  nextLetter: string;
  previous: string;
  next: string;
  comingSoon: string;
  done: string;
  feedbackGreat: string;
  feedbackGood: string;
  feedbackTryAgain: string;
}

export const UI_STRINGS: Record<Lang, UiStrings> = {
  en: {
    homeHeroTitle: "Welcome to Aksharabhyasam!",
    homeHeroSubtitle: "Practice writing Hindi and Sanskrit letters, one trace at a time.",
    ageRangeLabel: (range) => `Ages ${range}`,
    letterCountLabel: (count) => `${count} letters`,
    startPracticing: "Start practicing →",
    clear: "Clear",
    checkMyTracing: "Check My Tracing",
    nextLetter: "Next letter",
    previous: "Previous",
    next: "Next",
    comingSoon: "Coming soon",
    done: "✓ Done",
    feedbackGreat: "Great job! ⭐",
    feedbackGood: "Good try! Trace over it a bit more ✏️",
    feedbackTryAgain: "Let's try again 💪",
  },
  hi: {
    homeHeroTitle: "अक्षराभ्यास में आपका स्वागत है!",
    homeHeroSubtitle: "हिंदी और संस्कृत के अक्षर लिखने का अभ्यास करें।",
    ageRangeLabel: (range) => `आयु ${range}`,
    letterCountLabel: (count) => `${count} अक्षर`,
    startPracticing: "अभ्यास शुरू करें →",
    clear: "मिटाएँ",
    checkMyTracing: "जाँचें",
    nextLetter: "अगला अक्षर",
    previous: "पिछला",
    next: "अगला",
    comingSoon: "जल्द आ रहा है",
    done: "✓ पूर्ण",
    feedbackGreat: "बहुत बढ़िया! ⭐",
    feedbackGood: "अच्छी कोशिश! थोड़ा और लिखें ✏️",
    feedbackTryAgain: "फिर से कोशिश करें 💪",
  },
  sa: {
    homeHeroTitle: "अक्षराभ्यासे भवतां स्वागतम्!",
    homeHeroSubtitle: "हिन्दी-संस्कृतयोः अक्षराणि लेखितुं अभ्यासं कुर्वन्तु।",
    ageRangeLabel: (range) => `वयः ${range}`,
    letterCountLabel: (count) => `${count} अक्षराणि`,
    startPracticing: "अभ्यासं आरभताम् →",
    clear: "मार्जयतु",
    checkMyTracing: "परीक्षतु",
    nextLetter: "अग्रिमम् अक्षरम्",
    previous: "पूर्वम्",
    next: "अग्रिमम्",
    comingSoon: "शीघ्रम् आगमिष्यति",
    done: "✓ सम्पूर्णम्",
    feedbackGreat: "साधु! ⭐",
    feedbackGood: "उत्तमः प्रयत्नः! पुनः लिखतु ✏️",
    feedbackTryAgain: "पुनः प्रयत्नं कुर्वन्तु 💪",
  },
};
