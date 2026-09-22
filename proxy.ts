import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LANGUAGE, isValidLanguage } from "@/lib/i18n/config";

const PREFERRED_LANG_COOKIE = "preferred-lang";

function detectLang(request: NextRequest): string {
  const cookieLang = request.cookies.get(PREFERRED_LANG_COOKIE)?.value;
  if (cookieLang && isValidLanguage(cookieLang)) return cookieLang;

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferred = acceptLanguage
      .split(",")
      .map((part) => part.split(";")[0].trim().split("-")[0]);
    const match = preferred.find((tag) => isValidLanguage(tag));
    if (match) return match;
  }

  return DEFAULT_LANGUAGE;
}

/** Any path whose last segment has a file extension is a static asset
 * (favicon.ico, icon.svg, robots.txt, sitemap.xml, /assets/logo.svg,
 * apple-icon.png, ...) — never language-prefixed, so never redirected.
 * Matching on "has an extension" rather than an explicit filename list
 * means new static files (like the logo) don't silently break this. */
const STATIC_FILE_PATTERN = /\.[^/]+$/;

/**
 * Any other request that doesn't already start with a language segment
 * (/en, /hi, /sa) is redirected to one, so every page in the app always
 * renders under app/[lang]/... — the language switcher then just swaps
 * this leading segment.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (STATIC_FILE_PATTERN.test(pathname)) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/")[1] ?? "";

  if (isValidLanguage(firstSegment)) {
    return NextResponse.next();
  }

  const lang = detectLang(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
