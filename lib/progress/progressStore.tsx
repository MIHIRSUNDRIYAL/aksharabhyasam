"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { SCORE_THRESHOLDS } from "@/components/tracing/tracingConfig";

export interface LetterProgress {
  attempted: boolean;
  bestScore?: number;
  mastered?: boolean;
}

type ProgressMap = Record<string, LetterProgress>;

const EMPTY_PROGRESS: ProgressMap = {};

/**
 * A tiny external store (one per track) backing localStorage-persisted
 * progress. Modeled with useSyncExternalStore — the React-recommended
 * primitive for subscribing to state that lives outside React, like
 * browser storage — rather than an effect that setStates on mount, which
 * would either risk a hydration mismatch or a needless extra render.
 */
const cache = new Map<string, ProgressMap>();
const listeners = new Map<string, Set<() => void>>();

function storageKey(trackSlug: string) {
  return `aksharabhyasam:progress:${trackSlug}`;
}

function readFromStorage(trackSlug: string): ProgressMap {
  try {
    const raw = window.localStorage.getItem(storageKey(trackSlug));
    if (raw) return JSON.parse(raw) as ProgressMap;
  } catch {
    // localStorage unavailable (private mode, etc.) — progress just won't persist.
  }
  return EMPTY_PROGRESS;
}

function getSnapshot(trackSlug: string): ProgressMap {
  if (!cache.has(trackSlug)) {
    cache.set(trackSlug, readFromStorage(trackSlug));
  }
  return cache.get(trackSlug)!;
}

function getServerSnapshot(): ProgressMap {
  return EMPTY_PROGRESS;
}

function subscribe(trackSlug: string, callback: () => void) {
  if (!listeners.has(trackSlug)) listeners.set(trackSlug, new Set());
  const set = listeners.get(trackSlug)!;
  set.add(callback);
  return () => set.delete(callback);
}

function writeProgress(
  trackSlug: string,
  updater: (prev: ProgressMap) => ProgressMap
) {
  const next = updater(getSnapshot(trackSlug));
  cache.set(trackSlug, next);
  try {
    window.localStorage.setItem(storageKey(trackSlug), JSON.stringify(next));
  } catch {
    // ignore — the in-memory cache still updates the UI for this session.
  }
  listeners.get(trackSlug)?.forEach((callback) => callback());
}

interface ProgressContextValue {
  progress: ProgressMap;
  isLetterMastered: (letterId: string) => boolean;
  recordAttempt: (letterId: string, score: number) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

/**
 * Client-side, localStorage-backed progress tracking, scoped to one
 * track. No accounts needed for v1 — good enough for a single device, and
 * the shape (per-letter best score + mastered flag) is forward-compatible
 * with a later server-synced version.
 */
export function ProgressProvider({
  trackSlug,
  children,
}: {
  trackSlug: string;
  children: ReactNode;
}) {
  const progress = useSyncExternalStore(
    (callback) => subscribe(trackSlug, callback),
    () => getSnapshot(trackSlug),
    getServerSnapshot
  );

  const isLetterMastered = useCallback(
    (letterId: string) => Boolean(progress[letterId]?.mastered),
    [progress]
  );

  const recordAttempt = useCallback(
    (letterId: string, score: number) => {
      writeProgress(trackSlug, (prev) => {
        const bestScore = Math.max(prev[letterId]?.bestScore ?? 0, score);
        return {
          ...prev,
          [letterId]: {
            attempted: true,
            bestScore,
            mastered: bestScore >= SCORE_THRESHOLDS.great,
          },
        };
      });
    },
    [trackSlug]
  );

  const value = useMemo(
    () => ({ progress, isLetterMastered, recordAttempt }),
    [progress, isLetterMastered, recordAttempt]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return ctx;
}
