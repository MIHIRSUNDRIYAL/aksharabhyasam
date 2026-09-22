import { Baloo_2, Noto_Sans_Devanagari, Nunito } from "next/font/google";

/**
 * Single source of truth for the app's fonts. The Devanagari font's
 * resolved family name (devanagariFontFamily) is consumed by both the CSS
 * variable (--font-devanagari, for on-page text) and the tracing canvas's
 * `ctx.font` string (canvas 2D cannot read CSS custom properties, so it
 * needs the real generated family name from next/font directly).
 */
export const heading = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
});

export const body = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body",
});

export const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-devanagari",
});

export const devanagariFontFamily = devanagari.style.fontFamily;
