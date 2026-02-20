import type { Song } from "lib/types"
import type { SectionConfig } from "./sections.constants"

export async function fetchSongs(config: SectionConfig, limit: number = 6, signal?: AbortSignal): Promise<Song[]> {
  const params = new URLSearchParams({
    term: config.term,
    limit: String(limit),
  })
  if (config.country) {
    params.set("country", config.country)
  }

  const response = await fetch(`/api/songs?${params.toString()}`, { signal })
  if (!response.ok) return []

  const data = (await response.json()) as { songs: Song[] }
  return data.songs
}
