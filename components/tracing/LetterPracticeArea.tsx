"use client";

import { useProgress } from "@/lib/progress/progressStore";
import { TracingCanvas, type TracingCanvasProps } from "@/components/tracing/TracingCanvas";

/**
 * Thin client bridge between the tracing canvas and the progress store —
 * kept separate from TracingCanvas itself so that component stays a
 * reusable, progress-agnostic primitive.
 */
export function LetterPracticeArea({
  letterId,
  character,
  strings,
}: {
  letterId: string;
  character: string;
  strings: TracingCanvasProps["strings"];
}) {
  const { recordAttempt } = useProgress();

  return (
    <TracingCanvas
      key={letterId}
      character={character}
      strings={strings}
      onScored={(score) => recordAttempt(letterId, score)}
    />
  );
}
