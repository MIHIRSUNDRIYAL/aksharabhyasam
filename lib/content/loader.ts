import fs from "node:fs/promises";
import path from "node:path";
import {
  trackConfigSchema,
  lettersFileSchema,
} from "@/lib/content/schemas";
import type {
  TrackConfig,
  Letter,
  LettersMap,
  LetterNavEntry,
} from "@/types/content";

/**
 * This module is the ONLY place that knows content lives on disk as JSON
 * files under content/tracks/<track>/. Everything else (pages, components)
 * calls these functions and stays ignorant of the file layout, so content
 * storage can change later without touching UI code.
 */

const CONTENT_ROOT = path.join(process.cwd(), "content", "tracks");

async function readJSON<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export async function getAllTrackSlugs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

export async function getTrack(trackSlug: string): Promise<TrackConfig | null> {
  try {
    const raw = await readJSON<unknown>(
      path.join(CONTENT_ROOT, trackSlug, "track.config.json")
    );
    return trackConfigSchema.parse(raw) as TrackConfig;
  } catch {
    return null;
  }
}

export async function getAllTracks(): Promise<TrackConfig[]> {
  const slugs = await getAllTrackSlugs();
  const tracks = await Promise.all(slugs.map((slug) => getTrack(slug)));
  return tracks.filter((t): t is TrackConfig => t !== null);
}

export async function getLettersMap(trackSlug: string): Promise<LettersMap> {
  try {
    const raw = await readJSON<unknown>(
      path.join(CONTENT_ROOT, trackSlug, "letters.json")
    );
    return lettersFileSchema.parse(raw) as LettersMap;
  } catch {
    return {};
  }
}

export async function getLetter(
  trackSlug: string,
  letterId: string
): Promise<Letter | null> {
  const letters = await getLettersMap(trackSlug);
  return letters[letterId] ?? null;
}

/**
 * The full, ordered letter list for a track, used for the track overview's
 * stepping-stones and for prev/next lookups. Driven entirely by
 * track.config.json's letterOrder — adding a letter later is just adding
 * it to that array plus an entry in letters.json.
 */
export async function getLetterNavList(trackSlug: string): Promise<LetterNavEntry[]> {
  const track = await getTrack(trackSlug);
  if (!track) return [];

  const letters = await getLettersMap(trackSlug);

  return track.letterOrder.map((id) => {
    const letter = letters[id];
    return {
      id,
      character: letter?.character ?? "?",
      label: letter?.label ?? {},
      themeColor: letter?.themeColor ?? track.themeColor,
    };
  });
}
