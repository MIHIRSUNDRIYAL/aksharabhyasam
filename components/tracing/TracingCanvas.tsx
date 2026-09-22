"use client";

import { useEffect, useRef, useState } from "react";
import { devanagariFontFamily } from "@/lib/fonts";
import {
  CANVAS_SIZE,
  INK_WIDTH,
  scoreToTier,
  type FeedbackTier,
} from "@/components/tracing/tracingConfig";
import {
  computeScore,
  imageDataToInkMask,
  rasterizeReference,
  setupHiDPICanvas,
  waitForDevanagariFont,
  type ReferenceMasks,
} from "@/components/tracing/tracingScoring";
import { FeedbackBanner } from "@/components/tracing/FeedbackBanner";
import { celebrate } from "@/components/tracing/celebrate";

export interface TracingCanvasProps {
  /** The Devanagari character to trace, e.g. "अ". */
  character: string;
  onScored?: (score: number) => void;
  strings: {
    clear: string;
    checkMyTracing: string;
    feedbackGreat: string;
    feedbackGood: string;
    feedbackTryAgain: string;
  };
}

/**
 * Renders a large decorative guide letter (plain DOM text, not canvas —
 * it never needs to be pixel-compared against anything) behind an
 * interactive drawing canvas. A third canvas, created but never appended
 * to the DOM, holds the rasterized reference glyph used purely for
 * scoring. The caller should pass a React `key` matching the letter id
 * so the whole component remounts (fresh canvas, cleared feedback) when
 * the letter changes, rather than trying to diff/reset in place.
 */
export function TracingCanvas({ character, onScored, strings }: TracingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const referenceRef = useRef<ReferenceMasks | null>(null);
  const drawingRef = useRef(false);
  const activePointerRef = useRef<number | null>(null);
  const hasInkRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [feedback, setFeedback] = useState<{ tier: FeedbackTier; score: number } | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      await waitForDevanagariFont(devanagariFontFamily);
      if (cancelled) return;

      referenceRef.current = rasterizeReference(
        character,
        devanagariFontFamily,
        CANVAS_SIZE
      );

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = setupHiDPICanvas(canvas, CANVAS_SIZE);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = INK_WIDTH;
      ctx.strokeStyle = "#4338ca";
      ctxRef.current = ctx;

      if (!cancelled) setReady(true);
    }

    setup();
    return () => {
      cancelled = true;
    };
  }, [character]);

  function getLogicalPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!ready) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    activePointerRef.current = e.pointerId;
    drawingRef.current = true;
    hasInkRef.current = true;
    const { x, y } = getLogicalPoint(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current || activePointerRef.current !== e.pointerId) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { x, y } = getLogicalPoint(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function endStroke(e: React.PointerEvent<HTMLCanvasElement>) {
    if (activePointerRef.current !== e.pointerId) return;
    drawingRef.current = false;
    activePointerRef.current = null;
  }

  function handleClear() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasInkRef.current = false;
    setFeedback(null);
  }

  function handleCheck() {
    const canvas = canvasRef.current;
    const reference = referenceRef.current;
    if (!canvas || !reference || !hasInkRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const userInk = imageDataToInkMask(
      ctx.getImageData(0, 0, canvas.width, canvas.height)
    );

    const { score } = computeScore(userInk, reference.core, reference.tolerance);
    const tier = scoreToTier(score);
    setFeedback({ tier, score });
    onScored?.(score);

    if (tier === "great") {
      celebrate();
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative touch-none select-none overflow-hidden rounded-3xl border-2 border-violet-200 bg-white shadow-sm"
        style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-devanagari text-violet-100"
          style={{ fontSize: 190, lineHeight: 1 }}
        >
          {character}
        </span>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 touch-none"
          style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
          onPointerLeave={endStroke}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleClear}
          className="rounded-full border-2 border-violet-200 bg-white px-5 py-2 font-heading font-bold text-violet-700 transition-colors hover:bg-violet-50"
        >
          {strings.clear}
        </button>
        <button
          type="button"
          onClick={handleCheck}
          className="rounded-full bg-violet-600 px-6 py-2 font-heading font-bold text-white shadow transition-colors hover:bg-violet-700"
        >
          {strings.checkMyTracing}
        </button>
      </div>

      {feedback && (
        <FeedbackBanner
          tier={feedback.tier}
          message={
            feedback.tier === "great"
              ? strings.feedbackGreat
              : feedback.tier === "good"
                ? strings.feedbackGood
                : strings.feedbackTryAgain
          }
        />
      )}
    </div>
  );
}
