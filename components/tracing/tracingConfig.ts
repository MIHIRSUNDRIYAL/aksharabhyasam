/**
 * Tuning constants for the tracing canvas + scoring. Kept in one file so
 * the tracing screen's feedback tiers and the progress store's "mastered"
 * flag are always reading the same thresholds.
 */

/** Fixed logical (CSS) pixel size of the tracing canvas — deliberately not
 * fluid, so a resize/orientation change never has to rescale in-progress
 * strokes or the precomputed reference mask (see tracingScoring.ts). */
export const CANVAS_SIZE = 280;

/** Font size (logical px) used to rasterize the reference glyph. */
export const GLYPH_PX = 190;

/** Nudges the glyph baseline down slightly so it sits visually centered
 * (Devanagari's vertical metrics sit a bit high of true center). */
export const BASELINE_NUDGE = 8;

/** Half-width (logical px) of the "close enough" tolerance zone drawn
 * around the glyph's outline for the precision score. */
export const TOLERANCE_PX = 22;

/** Alpha threshold (0-255) above which a rasterized pixel counts as "ink". */
export const INK_ALPHA_THRESHOLD = 24;

/** Visible stroke width (logical px) the child draws with. */
export const INK_WIDTH = 16;

export const SCORE_THRESHOLDS = {
  great: 0.62,
  good: 0.38,
} as const;

export type FeedbackTier = "great" | "good" | "tryAgain";

export function scoreToTier(score: number): FeedbackTier {
  if (score >= SCORE_THRESHOLDS.great) return "great";
  if (score >= SCORE_THRESHOLDS.good) return "good";
  return "tryAgain";
}
