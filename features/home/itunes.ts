import type { Song } from "features/player/PlayerContext"

export async function fetchSongs(term: string, limit: number = 6, signal?: AbortSignal): Promise<Song[]> {
  const params = new URLSearchParams({
    term,
    limit: String(limit),
  })

  const response = await fetch(`/api/songs?${params.toString()}`, { signal })
  if (!response.ok) return []

  const data = (await response.json()) as { songs: Song[] }
  return data.songs
}
