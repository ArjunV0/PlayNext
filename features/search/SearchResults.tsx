"use client"

import type { Song } from "./types"
import { useSearch } from "./useSearch"

const RECOMMENDED_SONGS: Song[] = [
  { id: "r1", title: "Midnight Drive", artist: "Neon Waves", duration: 214, coverUrl: "/covers/midnight-drive.jpg" },
  { id: "r2", title: "Fading Light", artist: "Glass Horizon", duration: 243, coverUrl: "/covers/fading-light.jpg" },
  { id: "r3", title: "Ocean Breeze", artist: "Coral Skies", duration: 198, coverUrl: "/covers/ocean-breeze.jpg" },
]

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function SongItem({ song, onSelect }: { song: Song; onSelect: (song: Song) => void }) {
  return (
    <button
      onClick={() => onSelect(song)}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded bg-gray-200 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
        ♪
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{song.title}</p>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{song.artist}</p>
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-500">{formatDuration(song.duration)}</span>
    </button>
  )
}

export function SearchResults() {
  const { query, results, isLoading } = useSearch()

  const isQueryEmpty = query.trim() === ""
  const hasNoResults = !isLoading && !isQueryEmpty && results.length === 0

  const handleSelect = (_song: Song): void => {
    // Placeholder for player logic
  }

  if (isQueryEmpty) {
    return (
      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Recommended</p>
        <div className="space-y-1">
          {RECOMMENDED_SONGS.map((song) => (
            <SongItem key={song.id} song={song} onSelect={handleSelect} />
          ))}
        </div>
      </div>
    )
  }

  if (hasNoResults) {
    return (
      <div className="mt-4">
        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">No results found</p>
        <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Recommended</p>
        <div className="space-y-1">
          {RECOMMENDED_SONGS.map((song) => (
            <SongItem key={song.id} song={song} onSelect={handleSelect} />
          ))}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <p className="mt-4 py-8 text-center text-sm text-gray-400">Searching...</p>
  }

  return (
    <div className="mt-4 space-y-1">
      {results.map((song) => (
        <SongItem key={song.id} song={song} onSelect={handleSelect} />
      ))}
    </div>
  )
}
