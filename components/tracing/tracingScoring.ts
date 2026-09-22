import {
  BASELINE_NUDGE,
  GLYPH_PX,
  INK_ALPHA_THRESHOLD,
  TOLERANCE_PX,
} from "@/components/tracing/tracingConfig";

/**
 * Sets up a canvas's backing store at devicePixelRatio resolution and
 * scales its context so all subsequent drawing calls (both here and in
 * the interactive draw layer) can use plain logical (CSS) pixel
 * coordinates. Capped at 2x — a 280px canvas at 3x+ DPR buys negligible
 * visual fidelity for a traced letter but meaningfully more pixels to
 * scan when scoring.
 */
export function setupHiDPICanvas(
  canvas: HTMLCanvasElement,
  cssSize: number
): CanvasRenderingContext2D {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = cssSize * dpr;
  canvas.height = cssSize * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context unavailable");
  ctx.scale(dpr, dpr);
  return ctx;
}

/**
 * Canvas fillText/strokeText do not wait for webfonts, and will silently
 * rasterize a fallback glyph if the Devanagari font hasn't finished
 * loading yet — which would bake the WRONG "ground truth" shape into
 * every score for that letter. Must be awaited before rasterizeReference.
 */
export async function waitForDevanagariFont(fontFamily: string): Promise<void> {
  try {
    await document.fonts.load(`700 ${GLYPH_PX}px ${fontFamily}`);
    await document.fonts.ready;
  } catch {
    // If the Font Loading API is unavailable, proceed anyway — worst case
    // the first render uses a fallback glyph, which is still better than
    // throwing and blocking the whole tracing screen.
  }
}

function toBoolMask(imageData: ImageData, alphaThreshold: number): Uint8Array {
  const { data } = imageData;
  const mask = new Uint8Array(data.length / 4);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    mask[p] = data[i + 3] > alphaThreshold ? 1 : 0;
  }
  return mask;
}

export interface ReferenceMasks {
  core: Uint8Array;
  tolerance: Uint8Array;
}

/**
 * Rasterizes a Devanagari character onto a never-appended offscreen
 * canvas to derive the scoring "ground truth" directly from the webfont
 * already loaded for on-page text — no per-letter SVG/stroke-order data
 * ever needs to be hand-authored. Two passes:
 *  - a filled pass (`core`): the coverage target the child should ink over
 *  - a thick outlined pass (`tolerance`): core + a margin around it, the
 *    zone precision is measured against, so ink slightly outside the
 *    exact glyph outline isn't penalized as harshly as ink far away
 */
export function rasterizeReference(
  character: string,
  fontFamily: string,
  cssSize: number
): ReferenceMasks {
  const canvas = document.createElement("canvas");
  const ctx = setupHiDPICanvas(canvas, cssSize);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${GLYPH_PX}px ${fontFamily}`;
  const cx = cssSize / 2;
  const cy = cssSize / 2 + BASELINE_NUDGE;

  ctx.fillStyle = "#000";
  ctx.fillText(character, cx, cy);
  const core = toBoolMask(
    ctx.getImageData(0, 0, canvas.width, canvas.height),
    INK_ALPHA_THRESHOLD
  );

  ctx.lineWidth = TOLERANCE_PX * 2;
  ctx.strokeStyle = "#000";
  ctx.strokeText(character, cx, cy);
  const tolerance = toBoolMask(
    ctx.getImageData(0, 0, canvas.width, canvas.height),
    INK_ALPHA_THRESHOLD
  );

  return { core, tolerance };
}

export interface ScoreResult {
  coverage: number;
  precision: number;
  score: number;
}

/**
 * coverage = how much of the reference glyph's core the child's ink hit
 * precision = how much of the child's ink stayed within the tolerance zone
 * score = harmonic mean of the two — deliberately not a weighted average,
 * since that would let a tiny scribble that happens to land inside the
 * glyph score well on precision alone despite near-zero coverage. The
 * harmonic mean requires both to be reasonably good.
 */
export function computeScore(
  userInk: Uint8Array,
  refCore: Uint8Array,
  refTolerance: Uint8Array
): ScoreResult {
  let coreTotal = 0;
  let coreHit = 0;
  let inkTotal = 0;
  let inkInTolerance = 0;

  for (let i = 0; i < userInk.length; i++) {
    if (refCore[i]) {
      coreTotal++;
      if (userInk[i]) coreHit++;
    }
    if (userInk[i]) {
      inkTotal++;
      if (refTolerance[i]) inkInTolerance++;
    }
  }

  const coverage = coreTotal === 0 ? 0 : coreHit / coreTotal;
  const precision = inkTotal === 0 ? 0 : inkInTolerance / inkTotal;
  const score =
    coverage === 0 || precision === 0
      ? 0
      : (2 * coverage * precision) / (coverage + precision);

  return { coverage, precision, score };
}

export function imageDataToInkMask(imageData: ImageData): Uint8Array {
  return toBoolMask(imageData, INK_ALPHA_THRESHOLD);
}
